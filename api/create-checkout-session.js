import { getStripe } from './_stripe.js';
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
    const stripe = await getStripe();
    const body = await parseBody(req);
    if (!body) {
      return res.status(400).json({ error: 'Missing request body' });
    }

    const {
      studentName = 'Studente Patente B',
      studentEmail,
      studentPhone = '',
      codiceFiscale = '',
      address = '',
      city = 'Bolzano',
    } = body;

    if (!studentEmail || !studentEmail.includes('@')) {
      return res.status(400).json({ error: 'Valid student email is required' });
    }

    // Determine current academy price: check DB settings first, fallback to body.priceEur, then default €49
    let priceEur = typeof body.priceEur === 'number' && body.priceEur > 0 ? body.priceEur : 49;
    try {
      const settingsCol = await getCollection('settings');
      const settingsDoc = await settingsCol.findOne({ key: 'app_settings' });
      if (settingsDoc && typeof settingsDoc.academyPriceEur === 'number' && settingsDoc.academyPriceEur > 0) {
        priceEur = settingsDoc.academyPriceEur;
      }
    } catch (e) {
      console.warn('Could not read price from settings, using fallback price:', e);
    }

    // Determine origin for redirection
    const origin =
      req.headers.origin ||
      (req.headers.host ? `https://${req.headers.host}` : null) ||
      'https://www.patenteguru.it';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'link'],
      mode: 'payment',
      customer_email: studentEmail.trim().toLowerCase(),
      client_reference_id: studentEmail.trim().toLowerCase(),
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(priceEur * 100),
            product_data: {
              name: 'Corso Completo Patente B 2026 - PatenteGuru.it',
              description:
                'Accesso Illimitato a 240 Round con spiegazioni in Bengali, Simulatore Orale e Assistenza Didattica fino al superamento dell’esame.',
              images: ['https://www.patenteguru.it/patente-guru-logo.jpg'],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        studentName: studentName.trim(),
        studentEmail: studentEmail.trim().toLowerCase(),
        studentPhone: studentPhone.trim(),
        codiceFiscale: (codiceFiscale || '').trim().toUpperCase(),
        address: address.trim(),
        city: city.trim(),
        amount: String(priceEur),
      },
      success_url: `${origin}/?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?payment_cancelled=true`,
    });

    return res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    console.error('Stripe session creation error:', err);
    return res.status(500).json({ error: err.message || 'Payment session creation failed' });
  }
}

