import { getCollection } from './_db.js';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
}

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  // If req.body is undefined, read stream
  try {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const raw = Buffer.concat(buffers).toString();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const col = await getCollection('students');

    if (req.method === 'GET') {
      const url = new URL(req.url, 'http://localhost');
      const email = url.searchParams.get('email');
      const uid = url.searchParams.get('uid');
      const phone = url.searchParams.get('phone');

      if (email || uid || phone) {
        let filter;
        if (email) filter = { email: email.trim().toLowerCase() };
        else if (uid) filter = { uid: String(uid) };
        else {
          const cleanDigits = phone.replace(/\D/g, '');
          filter = { phone: { $regex: cleanDigits.slice(-8) } };
        }
        const doc = await col.findOne(filter);
        if (!doc) {
          return res.status(404).json({ error: 'Student not found' });
        }
        const { _id, passwordHash, ...rest } = doc;
        return res.status(200).json({
          ...rest,
          _id: _id.toString(),
        });
      }

      const docs = await col
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      const students = docs.map((doc) => {
        const { _id, passwordHash, ...rest } = doc;
        return {
          ...rest,
          _id: _id.toString(),
        };
      });

      return res.status(200).json(students);
    }

    if (req.method === 'POST') {
      const data = await parseBody(req);
      if (!data) {
        return res.status(400).json({ error: 'Invalid or missing JSON payload' });
      }

      if (Array.isArray(data)) {
        for (const item of data) {
          const email = item.email ? item.email.trim().toLowerCase() : null;
          const uid = item.uid ? String(item.uid) : null;
          if (!email && !uid) continue;

          const filter = email ? { email } : { uid };
          const { createdAt, _id, passwordHash, ...rest } = item;
          if (email) rest.email = email;

          await col.updateOne(
            filter,
            {
              $set: {
                ...rest,
                updatedAt: new Date().toISOString(),
              },
              $setOnInsert: {
                createdAt: createdAt || new Date().toISOString(),
              },
            },
            { upsert: true }
          );
        }
        return res.status(200).json({ success: true, count: data.length });
      }

      const email = data.email ? data.email.trim().toLowerCase() : null;
      const uid = data.uid ? String(data.uid) : null;

      if (!email && !uid) {
        return res.status(400).json({ error: 'Email or UID is required' });
      }

      const filter = email ? { email } : { uid };
      const { createdAt, _id, passwordHash, ...rest } = data;
      if (email) rest.email = email;

      await col.updateOne(
        filter,
        {
          $set: {
            ...rest,
            updatedAt: new Date().toISOString(),
          },
          $setOnInsert: {
            createdAt: createdAt || new Date().toISOString(),
          },
        },
        { upsert: true }
      );

      return res.status(200).json({ success: true, student: { ...rest, createdAt: createdAt || new Date().toISOString() } });
    }

    if (req.method === 'DELETE') {
      const url = new URL(req.url, 'http://localhost');
      const body = await parseBody(req);
      const rawEmail = url.searchParams.get('email') || body?.email || '';
      const rawUid = url.searchParams.get('uid') || body?.uid || '';

      const cleanEmail = String(rawEmail).trim().toLowerCase();
      const cleanUid = String(rawUid).trim();

      if (!cleanEmail && !cleanUid) {
        return res.status(400).json({ error: 'Student email or UID is required to delete' });
      }

      const orConditions = [];
      if (cleanEmail) {
        orConditions.push({ email: cleanEmail });
      }
      if (cleanUid) {
        orConditions.push({ uid: cleanUid });
      }

      const result = await col.deleteMany({ $or: orConditions });

      if (cleanEmail) {
        try {
          const otpCol = await getCollection('email_otps');
          await otpCol.deleteMany({ email: cleanEmail });
        } catch {}
      }

      return res.status(200).json({
        success: true,
        deletedCount: result.deletedCount || 0,
      });
    }

    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    console.error('API /api/students error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
