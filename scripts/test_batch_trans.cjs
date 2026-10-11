const fs = require('fs');
const { getCollection } = require('../api/_db.js');

async function testBatch() {
  const col = await getCollection('settings');
  const doc = await col.findOne({ key: 'app_settings' });
  const apiKey = doc.geminiApiKey;

  // Read first 10 questions from roundQuestions.ts
  const content = fs.readFileSync('./src/data/roundQuestions.ts', 'utf8');
  const itList = [];
  const re = /"questionIt":\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(content)) !== null && itList.length < 10) {
    if (!itList.includes(m[1])) itList.push(m[1]);
  }

  console.log(`Translating sample ${itList.length} questions...`);

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
  const prompt = `You are a master Italian-to-Bengali translator for Italy's official Patente B driving theory exam.
Translate the following Italian quiz questions into clear, natural, highly accurate, and easy-to-understand Bengali (বাংলা) for Bengali expatriates in Italy.

Rules:
1. Translate accurately, making natural Bengali sense (not broken/literal word-for-word).
2. Use standard Bengali driving terminology where helpful:
   - "autovettura" -> "যাত্রীবাহী কার / প্রাইভেট কার"
   - "strada extraurbana principale" -> "প্রধান অতিরিক্ত নগর সড়ক / প্রধান হাইওয়ে"
   - "se barrato da una striscia rossa" -> "যদি একটি লাল আড়াআড়ি দাগ টানা থাকে"
   - "corsia di emergenza" -> "জরুরি লেন (Corsia di emergenza)"
   - "salvagente" -> "পথচারী সুরক্ষা দ্বীপ (Salvagente)"
3. Return ONLY a JSON object mapping exact Italian question string to Bengali translation string.

Input questions:
${JSON.stringify(itList, null, 2)}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    })
  });

  const data = await res.json();
  console.log('Result:\n', data.candidates[0].content.parts[0].text);
}

testBatch().catch(console.error);

