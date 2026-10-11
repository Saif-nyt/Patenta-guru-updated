const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const dotenv = fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf8');
const match = dotenv.match(/GEMINI_API_KEY=([^\r\n]+)/);
const apiKey = match ? match[1].trim() : '';
const mongoUri = 'mongodb+srv://khshifatmanjum_db_user:Dtmkv5WKtSMqpTEh@cluster0.h8ljzpx.mongodb.net/patente_bangla?retryWrites=true&w=majority';

const CACHE_FILE = path.resolve(__dirname, 'pipeline_cache_en_bn.json');
const MASTER_FILE = path.resolve(__dirname, '../patenteguru_all_questions.json');
const DESKTOP_FILE = 'C:\\Users\\LAPTOP LEGEND\\Desktop\\patenteguru_all_questions.json';
const DOWNLOADS_FILE = 'C:\\Users\\LAPTOP LEGEND\\Downloads\\patenteguru_all_questions.json';

const MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.5-flash'];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch {}
}

function saveCache() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
}

async function callGemini(batch) {
  const prompt = `You are the master driving instructor and translator for the Italian Patente B exam for Bengali expatriates living in Italy.
For each official Italian question below:
1. "questionEn": Translate accurately into clear, simple English.
2. "questionBn": Using the English and driving context, translate into natural, everyday, fluent spoken Bengali (বাংলা) easily understood by Bangladeshi students in Italy. Avoid awkward literal machine translation (e.g., use "বাঁক" instead of "বক্ররেখা", "ওভারটেক" for "sorpasso", "ইউ-টার্ন" for "inversione di marcia", "টু-ওয়ে ট্রাফিক" for "doppio senso").

Questions to translate:
${JSON.stringify(batch.map(q => ({ officialId: q.officialId, questionIt: q.questionIt })), null, 2)}

Return ONLY a valid JSON array in this exact schema:
[
  {
    "officialId": 90989,
    "questionEn": "...",
    "questionBn": "..."
  }
]`;

  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        })
      });

      if (res.status === 200) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } else if (res.status === 429) {
        console.warn(`[${model}] Rate limited (429), pausing 5s...`);
        await sleep(5000);
      } else {
        console.warn(`[${model}] Status ${res.status}`);
      }
    } catch (err) {
      console.warn(`[${model}] Error:`, err.message);
    }
  }
  return null;
}

async function runPipeline(maxToProcess = Infinity) {
  console.log('🚀 === STARTING ITALIAN ➔ ENGLISH ➔ BANGLA PIPELINE ===');
  
  if (!fs.existsSync(MASTER_FILE)) {
    console.error('Master file not found:', MASTER_FILE);
    return;
  }

  const masterQuestions = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));
  console.log(`📊 Total master questions: ${masterQuestions.length}`);
  console.log(`📦 Cache already has: ${Object.keys(cache).length} translations`);

  // Connect to MongoDB
  console.log('📡 Connecting to MongoDB Atlas...');
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db('patente_bangla');
  const questionsCol = db.collection('questions');

  // Identify questions that still need the high-quality IT->EN->BN translation
  const pending = masterQuestions.filter(q => {
    const cached = cache[q.officialId];
    return !cached || !cached.questionBn || !cached.questionEn;
  });

  console.log(`🎯 Questions pending translation: ${pending.length}`);

  const toProcess = pending.slice(0, maxToProcess);
  const BATCH_SIZE = 20;
  let processedCount = 0;

  for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
    const batch = toProcess.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(toProcess.length / BATCH_SIZE);
    console.log(`\n⏳ Processing Batch ${batchNum}/${totalBatches} (${batch.length} questions)...`);

    let results = await callGemini(batch);

    if (!results) {
      console.log('Retrying batch with small delay...');
      await sleep(3000);
      results = await callGemini(batch);
    }

    if (results && results.length > 0) {
      const bulkOps = [];
      for (const item of results) {
        if (!item.officialId || !item.questionBn || !item.questionEn) continue;

        cache[item.officialId] = {
          questionEn: item.questionEn.trim(),
          questionBn: item.questionBn.trim()
        };

        bulkOps.push({
          updateOne: {
            filter: { officialId: Number(item.officialId) },
            update: {
              $set: {
                questionEn: item.questionEn.trim(),
                questionBn: item.questionBn.trim(),
                hasTranslation: true,
                translationSource: 'it_en_bn_pipeline',
                updatedAt: new Date().toISOString()
              }
            }
          }
        });

        // Update in-memory master copy
        const masterItem = masterQuestions.find(q => q.officialId === item.officialId);
        if (masterItem) {
          masterItem.questionEn = item.questionEn.trim();
          masterItem.questionBn = item.questionBn.trim();
          masterItem.translationSource = 'it_en_bn_pipeline';
        }
      }

      if (bulkOps.length > 0) {
        await questionsCol.bulkWrite(bulkOps);
      }

      processedCount += bulkOps.length;
      console.log(`✅ Batch ${batchNum} complete! (${processedCount}/${toProcess.length} processed)`);

      // Save cache and sync master JSON periodically
      saveCache();
      fs.writeFileSync(MASTER_FILE, JSON.stringify(masterQuestions, null, 2), 'utf8');

      try {
        fs.writeFileSync(DESKTOP_FILE, JSON.stringify(masterQuestions, null, 2), 'utf8');
        fs.writeFileSync(DOWNLOADS_FILE, JSON.stringify(masterQuestions, null, 2), 'utf8');
      } catch {}
    } else {
      console.error(`❌ Failed to get results for batch ${batchNum}`);
    }

    // Pacing delay
    await sleep(800);
  }

  await client.close();
  console.log(`\n🎉 Pipeline completed! Successfully translated and updated ${processedCount} questions.`);
}

// Allow passing max count from CLI, e.g. "node pipeline_it_en_bn.cjs 50"
const limitArg = process.argv[2] ? parseInt(process.argv[2], 10) : Infinity;
runPipeline(limitArg).catch(err => {
  console.error('Fatal pipeline error:', err);
  process.exit(1);
});
