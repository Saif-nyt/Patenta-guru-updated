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

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const stripe = await getStripe();
    let sessionId = null;
    if (req.method === 'GET') {
      const url = new URL(req.url, 'http://localhost');
      sessionId = url.searchParams.get('session_id') || url.searchParams.get('sessionId');
    } else if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {}
      }
      sessionId = body?.sessionId || body?.session_id;
    }

    if (!sessionId) {
      return res.status(400).json({ error: 'Missing session_id parameter' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const meta = session.metadata || {};
      const studentEmail = (meta.studentEmail || session.customer_email || '').trim().toLowerCase();
      const studentName = meta.studentName || 'Studente Patente B';
      const studentPhone = meta.studentPhone || '';
      const codiceFiscale = meta.codiceFiscale || 'REGOLARE';
      const address = meta.address || 'Italia';
      const city = meta.city || 'Bolzano';
      const amount = session.amount_total ? session.amount_total / 100 : 49.0;
      const transactionId = String(session.payment_intent || session.id);

      const invoiceNumber = `PG-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const now = new Date();
      const formattedDate = now.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const invoice = {
        id: invoiceNumber,
        date: now.toISOString(),
        formattedDate,
        studentName,
        studentEmail,
        studentPhone,
        codiceFiscale,
        address,
        city,
        amount,
        currency: 'EUR',
        taxExemptionNote:
          "Operazione didattico-formativa esente da IVA ai sensi dell'art. 10, comma 1, n. 20 del D.P.R. 633/1972.",
        paymentMethod: 'card',
        paymentMethodLabel: 'Stripe Checkout (Carta / PostePay / Apple Pay)',
        transactionId,
        status: 'PAGATO',
        courseDescription:
          "Corso Completo Ufficiale Patente B 2026 - Accesso Illimitato a tutti i 240 Round con spiegazioni in Bengali, Simulatore Orale e Assistenza Didattica.",
        issuer: {
          name: 'PatenteGuru.it / Patente Bangla Italia',
          brand: 'PatenteGuru Autoscuola Digitale',
          instructor: 'Shifat Manjum (Founder & Lead Instructor)',
          location: 'Bolzano (BZ), Trentino-Alto Adige, Italia',
          email: 'khshifat@gmail.com',
          website: 'https://patenteguru.it',
        },
      };

      // 1. Update Student in MongoDB Atlas to VIP (all 240 rounds unlocked!)
      if (studentEmail) {
        try {
          const studentsCol = await getCollection('students');
          await studentsCol.updateOne(
            { email: studentEmail },
            {
              $set: {
                name: studentName,
                phone: studentPhone || undefined,
                isVip: true,
                vipUnlockedAt: now.toISOString(),
                transactionId,
                updatedAt: now.toISOString(),
              },
              $setOnInsert: {
                uid: 'std_' + Date.now(),
                email: studentEmail,
                unlockedRound: 1,
                totalQuestionsAnswered: 0,
                completedRounds: {},
                mistakeIds: [],
                createdAt: now.toISOString(),
              },
            },
            { upsert: true }
          );
        } catch (dbErr) {
          console.warn('MongoDB Atlas student update warning on payment verification:', dbErr);
        }
      }

      // 2. Save Invoice in MongoDB Atlas
      try {
        const invoicesCol = await getCollection('invoices');
        await invoicesCol.updateOne(
          { transactionId },
          { $set: invoice },
          { upsert: true }
        );
      } catch (invErr) {
        console.warn('MongoDB Atlas invoice save warning:', invErr);
      }

      return res.status(200).json({
        success: true,
        paid: true,
        studentEmail,
        studentName,
        transactionId,
        invoice,
      });
    }

    return res.status(200).json({
      success: false,
      paid: false,
      status: session.payment_status,
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    return res.status(500).json({ error: err.message || 'Payment verification failed' });
  }
}

