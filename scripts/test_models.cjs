const { getCollection } = require('../api/_db.js');

async function test() {
  const col = await getCollection('settings');
  const doc = await col.findOne({ key: 'app_settings' });
  const apiKey = doc.geminiApiKey;

  const models = [
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-3-flash-preview',
    'gemini-flash-latest',
    'gemini-3.8-flash'
  ];

  const prompt = `Translate each Italian Patente B quiz question into clear, natural, highly accurate, and easy-to-understand Bengali (বাংলা) for Bengali students studying driving license in Italy.
Rules:
- Translate accurately with natural, professional Bangla phrasing (e.g. "autovettura" -> "যাত্রীবাহী কার / প্রাইভেট কার", "se barrato da una striscia rossa" -> "যদি একটি লাল আড়াআড়ি দাগ টানা থাকে", "strada extraurbana principale" -> "প্রধান হাইওয়ে / শহরের বাইরের প্রধান সড়ক").
- No awkward or broken machine translation word-for-word.
- Return ONLY a valid JSON object mapping Italian question -> Bengali translation.

Questions to translate:
[
  "Il numero delle persone trasportabili sulle autovetture può raggiungere il massimo di dieci",
  "Il segnale raffigurato, se barrato, da una striscia rossa indica la fine di una strada extraurbana principale"
]`;

  for (const model of models) {
    try {
      console.log(`Trying ${model}...`);
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });
      const data = await res.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        console.log(`SUCCESS with ${model}!\n`, data.candidates[0].content.parts[0].text);
        process.exit(0);
      } else {
        console.log(`${model} failed:`, data.error?.message || data.error?.code);
      }
    } catch (e) {
      console.log(`${model} error:`, e.message);
    }
  }
  process.exit(1);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});

