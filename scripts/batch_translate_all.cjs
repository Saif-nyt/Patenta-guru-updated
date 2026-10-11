const fs = require('fs');
const path = require('path');
const { getCollection } = require('../api/_db.js');

const CACHE_FILE = path.resolve(__dirname, 'translations_cache.json');

// Direct overrides requested by user
const USER_OVERRIDES = {
  "Il numero delle persone trasportabili sulle autovetture può raggiungere il massimo di dieci": "যাত্রীবাহী গাড়িতে সর্বোচ্চ দশজন পর্যন্ত মানুষকে পরিবহন করা যেতে পারে।",
  "Il segnale raffigurato, se barrato, da una striscia rossa indica la fine di una strada extraurbana principale": "প্রদর্শিত চিহ্নটির ওপর দিয়ে যদি লাল রঙের একটি আড়াআড়ি দাগ টানা থাকে, তবে তা প্রধান সড়কের (Strada extraurbana principale) সমাপ্তি নির্দেশ করে।",
  "Il segnale raffigurato se barrato da una striscia rossa indica la fine della sua validità": "প্রদর্শিত সাইনটির ওপর যদি একটি লাল আড়াআড়ি দাগ টানা থাকে, তবে তা এর কার্যকারিতার সমাপ্তি নির্দেশ করে।"
};

const WORKING_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3-flash-preview'
];

function extractQuestionsFromCode(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const list = [];
  const re = /"questionIt":\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const q = m[1].trim();
    if (q && !list.includes(q)) list.push(q);
  }
  return list;
}

function extractTranslationsFromMap(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const list = [];
  const re = /"([^"]+)":\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const it = m[1].trim();
    if (it && it.length > 5 && !list.includes(it)) list.push(it);
  }
  return list;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Google Translate fallback
async function googleTranslateSingle(text) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=it&tl=bn&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data[0]) {
      let raw = data[0].map(item => item[0]).join('').trim();
      // Polish Patente driving terms
      raw = raw.replace(/যদি অতিক্রম করা হয়/g, 'যদি একটি লাল আড়াআড়ি দাগ টানা থাকে');
      raw = raw.replace(/অতিক্রম করা হয়/g, 'একটি আড়াআড়ি দাগ দ্বারা চিহ্নিত করা থাকে');
      raw = raw.replace(/দশে পৌঁছাতে পারে/g, 'সর্বোচ্চ ১০ জন হতে পারে');
      raw = raw.replace(/দশজনে পৌঁছাতে পারে/g, 'সর্বোচ্চ ১০ জন হতে পারে');
      raw = raw.replace(/গাড়িতে যাতায়াত করা যায় এমন লোকের সংখ্যা/g, 'যাত্রীবাহী কারে (Autovettura) সর্বোচ্চ পরিবহনযোগ্য লোকের সংখ্যা');
      raw = raw.replace(/চিত্রিত চিহ্নটি/g, 'প্রদর্শিত সাইনটি');
      raw = raw.replace(/চিত্রের চিহ্নটি/g, 'প্রদর্শিত সাইনটি');
      raw = raw.replace(/চিহ্নিত চিহ্নটি/g, 'প্রদর্শিত সাইনটি');
      raw = raw.replace(/প্রদর্শিত চিহ্নটি/g, 'প্রদর্শিত সাইনটি');
      raw = raw.replace(/রাস্তার প্রসারিত/g, 'রাস্তার এমন একটি অংশ');
      raw = raw.replace(/একটি প্রসারিত রাস্তা/g, 'রাস্তার এমন একটি অংশ');
      raw = raw.replace(/স্তব্ধ মাত্রা/g, 'ফ্লাইওভার বা আন্ডারপাস');
      raw = raw.replace(/বর্ণনাকারী/g, 'রিফ্লেক্টর প্যানেল');
      return raw;
    }
  } catch {}
  return '';
}

async function translateBatch(items, apiKey) {
  const prompt = `You are a master Italian-to-Bengali translator for Italy's official Patente B driving theory quizzes.
Translate each Italian question into clear, natural, highly accurate, and easy-to-understand Bengali (বাংলা) for Bengali students in Italy.

Rules:
1. Translate accurately and idiomatically into natural Bengali. DO NOT use awkward literal machine translations (e.g. do not translate 'se barrato' as 'অতিক্রম করা', translate as 'আড়াআড়ি দাগ টানা থাকলে').
2. Keep Italian technical traffic terms in brackets where helpful (e.g. Autovettura, Autostrada, Strada extraurbana principale, Corsia di emergenza, Salvagente, Sosta, Fermata, Sorpasso).
3. Return ONLY a valid JSON object mapping the exact Italian question to the Bengali translation.

Input JSON Array:
${JSON.stringify(items, null, 2)}`;

  for (const model of WORKING_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (!res.ok) {
        continue;
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const parsed = JSON.parse(rawText);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed;
      }
    } catch {}
  }

  // Fallback to Google Translate for each item if AI models are busy
  console.log(`Fallback: Using refined Google Translate for batch of ${items.length} questions...`);
  const fallbackMap = {};
  for (const it of items) {
    const bn = await googleTranslateSingle(it);
    if (bn) fallbackMap[it] = bn;
  }
  return fallbackMap;
}

async function main() {
  console.log('--- STARTING HIGH-QUALITY BANGLA TRANSLATION PIPELINE ---');

  // Load API key from database
  const col = await getCollection('settings');
  const doc = await col.findOne({ key: 'app_settings' });
  const apiKey = doc?.geminiApiKey;
  if (!apiKey) {
    console.error('Fatal: No geminiApiKey found in MongoDB settings.');
    process.exit(1);
  }

  // Load existing cache
  let cache = {};
  if (fs.existsSync(CACHE_FILE)) {
    try {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      console.log(`Loaded ${Object.keys(cache).length} cached translations.`);
    } catch {}
  }

  // Apply user overrides into cache
  Object.assign(cache, USER_OVERRIDES);

  // Collect all unique questions in the project
  const qRound = extractQuestionsFromCode('./src/data/roundQuestions.ts');
  const qHotshot = extractQuestionsFromCode('./src/data/hotshotQuestions.ts');
  const qMap = extractTranslationsFromMap('./src/data/patenteTranslationsBn.ts');

  const allQuestionsSet = new Set([...qRound, ...qHotshot, ...qMap]);
  const allQuestions = Array.from(allQuestionsSet);
  console.log(`Total unique questions found in codebase: ${allQuestions.length}`);

  const pending = allQuestions.filter(q => !cache[q] || cache[q].length < 5);
  console.log(`Pending translations needed: ${pending.length}`);

  const BATCH_SIZE = 20;
  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    const batch = pending.slice(i, i + BATCH_SIZE);
    console.log(`Translating batch ${Math.floor(i / BATCH_SIZE) + 1} / ${Math.ceil(pending.length / BATCH_SIZE)} (${batch.length} questions)...`);

    const result = await translateBatch(batch, apiKey);
    for (const [it, bn] of Object.entries(result)) {
      if (bn && typeof bn === 'string' && bn.trim().length > 3) {
        cache[it.trim()] = bn.trim();
      }
    }

    // Persist cache periodically
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
    console.log(`Saved progress. Cache now has ${Object.keys(cache).length} translations.`);

    await sleep(800);
  }

  console.log('\n--- ALL TRANSLATIONS COMPLETE! INJECTING INTO SOURCE CODE ---');

  // 1. Update patenteTranslationsBn.ts
  const mapEntries = Object.entries(cache).map(([it, bn]) => {
    return `  ${JSON.stringify(it)}: ${JSON.stringify(bn)},`;
  });
  const mapFileContent = `// Pre-compiled high-quality Google/Gemini Bangla Translations for all official Patente B questions
export const PATENTE_TRANSLATIONS_BN: Record<string, string> = {
${mapEntries.join('\n')}
};
`;
  fs.writeFileSync('./src/data/patenteTranslationsBn.ts', mapFileContent, 'utf8');
  console.log('Updated src/data/patenteTranslationsBn.ts successfully.');

  // 2. Update roundQuestions.ts
  let rqContent = fs.readFileSync('./src/data/roundQuestions.ts', 'utf8');
  let replacedCount = 0;
  rqContent = rqContent.replace(
    /("questionIt":\s*"([^"]+)",\s*"questionBn":\s*")[^"]*(")/g,
    (match, prefix, it, suffix) => {
      const cleanIt = it.trim();
      if (cache[cleanIt]) {
        replacedCount++;
        return `${prefix}${cache[cleanIt].replace(/"/g, '\\"')}${suffix}`;
      }
      return match;
    }
  );
  fs.writeFileSync('./src/data/roundQuestions.ts', rqContent, 'utf8');
  console.log(`Updated roundQuestions.ts (${replacedCount} question instances updated).`);

  // 3. Update hotshotQuestions.ts
  if (fs.existsSync('./src/data/hotshotQuestions.ts')) {
    let hqContent = fs.readFileSync('./src/data/hotshotQuestions.ts', 'utf8');
    let hqReplacedCount = 0;
    hqContent = hqContent.replace(
      /("questionIt":\s*"([^"]+)",\s*"questionBn":\s*")[^"]*(")/g,
      (match, prefix, it, suffix) => {
        const cleanIt = it.trim();
        if (cache[cleanIt]) {
          hqReplacedCount++;
          return `${prefix}${cache[cleanIt].replace(/"/g, '\\"')}${suffix}`;
        }
        return match;
      }
    );
    fs.writeFileSync('./src/data/hotshotQuestions.ts', hqContent, 'utf8');
    console.log(`Updated hotshotQuestions.ts (${hqReplacedCount} questions updated).`);
  }

  console.log('--- ALL FILES SUCCESSFULLY UPDATED WITH HIGH-QUALITY BANGLA TRANSLATIONS ---');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error in translation pipeline:', err);
  process.exit(1);
});

