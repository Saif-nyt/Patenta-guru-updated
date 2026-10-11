const { getCollection } = require('../api/_db.js');

async function test() {
  const col = await getCollection('settings');
  const doc = await col.findOne({ key: 'app_settings' });
  const apiKey = doc.geminiApiKey;
  
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
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

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })
  });

  const data = await res.json();
  if (data.error) {
    console.error('API Error:', data.error);
    process.exit(1);
  }
  console.log('Gemini Translation:\n', data.candidates[0].content.parts[0].text);
  process.exit(0);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});

