const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://khshifatmanjum_db_user:Dtmkv5WKtSMqpTEh@cluster0.h8ljzpx.mongodb.net/patente_bangla?retryWrites=true&w=majority';
const rawQuestions = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'raw_questions.json'), 'utf8'));
const cacheFile = path.resolve(__dirname, 'translations_cache.json');
let cache = {};
if (fs.existsSync(cacheFile)) {
  cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function translateChunk(textArray) {
  const textJoined = textArray.join('\n');
  const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=it&tl=bn&dt=t&q=' + encodeURIComponent(textJoined);
  const res = await fetch(url);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  const full = data[0].map(s => s[0]).join('');
  const lines = full.split('\n');
  return lines;
}

async function run() {
  console.log('=== STARTING COMPLETE 7,165 QUESTION TRANSLATION PIPELINE ===');
  console.log('Total official raw questions:', rawQuestions.length);
  console.log('Already translated in cache:', Object.keys(cache).length);

  const missing = rawQuestions.filter(q => {
    const key = q.question.trim();
    return !cache[key] || cache[key].length < 3 || cache[key].includes('শীঘ্রই');
  });

  console.log('Questions needing translation:', missing.length);

  const CHUNK_SIZE = 40;
  let translatedThisRun = 0;

  for (let i = 0; i < missing.length; i += CHUNK_SIZE) {
    const batch = missing.slice(i, i + CHUNK_SIZE);
    const questionsText = batch.map(q => q.question.trim());

    try {
      const bnLines = await translateChunk(questionsText);
      if (bnLines.length === questionsText.length) {
        questionsText.forEach((qIt, idx) => {
          let bn = (bnLines[idx] || '').trim();
          if (bn && bn.length > 2) {
            cache[qIt] = bn;
            translatedThisRun++;
          }
        });
      } else {
        // Fallback item by item if newline split mismatch
        for (const qIt of questionsText) {
          try {
            const single = await translateChunk([qIt]);
            if (single[0]) {
              cache[qIt] = single[0].trim();
              translatedThisRun++;
            }
          } catch {}
          await sleep(50);
        }
      }
    } catch (err) {
      console.warn('Batch error at index ' + i + ':', err.message);
      // Fallback single
      for (const qIt of questionsText) {
        try {
          const single = await translateChunk([qIt]);
          if (single[0]) {
            cache[qIt] = single[0].trim();
            translatedThisRun++;
          }
        } catch {}
        await sleep(50);
      }
    }

    if (i % 200 === 0 || i + CHUNK_SIZE >= missing.length) {
      fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf8');
      console.log(`Progress: translated ${i + batch.length} / ${missing.length} questions. Cache size: ${Object.keys(cache).length}`);
    }

    await sleep(200);
  }

  // Final cache save
  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf8');
  console.log('Translations complete! Cache now contains: ' + Object.keys(cache).length + ' questions.');

  // Now update MongoDB with all new translations!
  console.log('Updating MongoDB questions collection with complete Bengali translations...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('patente_bangla');
  const col = db.collection('questions');

  let updatedCount = 0;
  const bulkOps = [];

  for (const q of rawQuestions) {
    const qIt = q.question.trim();
    const qBn = cache[qIt] || cache[q.question] || '';
    if (qBn) {
      bulkOps.push({
        updateOne: {
          filter: { officialId: q.id },
          update: {
            $set: {
              questionBn: qBn,
              hasTranslation: true
            }
          }
        }
      });
    }

    if (bulkOps.length >= 500) {
      const res = await col.bulkWrite(bulkOps);
      updatedCount += res.modifiedCount;
      bulkOps.length = 0;
      console.log('MongoDB updated: ' + updatedCount + ' questions...');
    }
  }

  if (bulkOps.length > 0) {
    const res = await col.bulkWrite(bulkOps);
    updatedCount += res.modifiedCount;
  }

  console.log('SUCCESS! Updated total MongoDB questions with Bengali translations: ' + updatedCount);
  await client.close();
}

run().catch(console.error);

