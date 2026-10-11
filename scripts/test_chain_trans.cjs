const fs = require('fs');
const dotenv = fs.readFileSync('.env', 'utf8');
const match = dotenv.match(/GEMINI_API_KEY=([^\r\n]+)/);
const apiKey = match ? match[1].trim() : '';

async function testGenerate() {
  const models = ['gemini-2.5-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-flash-latest'];
  const prompt = `You are an expert translator for the Italian Patente B driving exam for Bengali students in Italy.
For each question:
1. Translate into clear, accurate English (questionEn).
2. From the English and context, translate into natural, easy-to-understand everyday Bengali (questionBn) used by Bengali speakers in Italy. Avoid awkward literal machine translation (e.g., use "বাঁক" instead of "বক্ররেখা", "ওভারটেক" for "sorpasso", "ইউ-টার্ন" for "inversione di marcia").

Questions:
[
  { "id": 90989, "it": "In una carreggiata del tipo rappresentato si può sorpassare anche in curva" },
  { "id": 90990, "it": "La carreggiata del tipo rappresentato è a doppio senso di circolazione" },
  { "id": 90992, "it": "In una carreggiata del tipo rappresentato non si può effettuare l'inversione di marcia" }
]

Return JSON array:
[
  { "id": 90989, "questionEn": "...", "questionBn": "..." }
]`;

  for (const m of models) {
    try {
      console.log(`Trying ${m}...`);
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + m + ':generateContent?key=' + apiKey;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });
      const data = await res.json();
      if (res.status === 200 && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log(`\n🎉 SUCCESS with ${m}!\n`);
        console.log(data.candidates[0].content.parts[0].text);
        return;
      } else {
        console.log(`${m} failed (${res.status}):`, data.error?.message || data);
      }
    } catch (e) {
      console.log(`${m} err:`, e.message);
    }
  }
}

testGenerate();

