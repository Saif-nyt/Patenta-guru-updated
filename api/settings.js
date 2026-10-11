import { getCollection } from './_db.js';

const DEFAULT_SETTINGS = {
  freeRoundsLimit: 20,
  academyPriceEur: 49,
  regularPriceEur: 120,
  promoBannerText: 'অফিসিয়াল ইতালিয়ান লাইসেন্স প্রস্তুতি • প্রথম প্রচেষ্টায় পাশের গ্যারান্টি',
  isPromoActive: false,
};

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
    const col = await getCollection('settings');

    if (req.method === 'GET') {
      const doc = await col.findOne({ key: 'app_settings' });
      if (doc) {
        const { _id, key, ...rest } = doc;
        return res.status(200).json(rest);
      }
      return res.status(200).json(DEFAULT_SETTINGS);
    }

    if (req.method === 'POST') {
      const data = await parseBody(req);
      if (!data || typeof data !== 'object') {
        return res.status(400).json({ error: 'Invalid settings body' });
      }

      const existing = (await col.findOne({ key: 'app_settings' })) || {};
      const { _id, key, ...existingRest } = existing;

      const merged = {
        ...DEFAULT_SETTINGS,
        ...existingRest,
        ...data,
        lastUpdated: new Date().toISOString(),
      };

      await col.updateOne(
        { key: 'app_settings' },
        {
          $set: {
            ...merged,
            key: 'app_settings',
          },
        },
        { upsert: true }
      );

      return res.status(200).json({ success: true, settings: merged });
    }

    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    console.error('API /api/settings error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

