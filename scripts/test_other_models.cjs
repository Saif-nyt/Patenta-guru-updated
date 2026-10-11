const { getCollection } = require('../api/_db.js');

async function check() {
  const col = await getCollection('settings');
  const doc = await col.findOne({ key: 'app_settings' });
  const apiKey = doc.geminiApiKey;

  const models = [
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash-lite',
    'gemini-3-flash-preview',
    'gemini-flash-latest',
    'gemini-pro-latest'
  ];

  for (const m of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello, reply with 1 word.' }] }]
        })
      });
      const data = await res.json();
      if (data.candidates) {
        console.log(`✅ Model ${m} is WORKING! Reply:`, data.candidates[0].content.parts[0].text.trim());
      } else {
        console.log(`❌ Model ${m} failed:`, data.error?.message || data.error?.code);
      }
    } catch (e) {
      console.log(`❌ Model ${m} error:`, e.message);
    }
  }
}

check();
