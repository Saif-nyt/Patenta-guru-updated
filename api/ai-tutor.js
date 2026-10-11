import { generateTutorResponse } from './_gemini.js';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const body = await parseBody(req);
    const prompt = body?.prompt || body?.query || body?.message;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Valid prompt or query is required' });
    }

    const history = Array.isArray(body?.history) ? body.history : [];
    const reply = await generateTutorResponse(prompt.trim(), history);

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error('AI Tutor API error:', err);
    return res.status(500).json({
      error: err.message || 'AI Tutor temporarily unavailable',
    });
  }
}

