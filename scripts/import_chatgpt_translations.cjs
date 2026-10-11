const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://khshifatmanjum_db_user:Dtmkv5WKtSMqpTEh@cluster0.h8ljzpx.mongodb.net/patente_bangla?retryWrites=true&w=majority';

async function importTranslations(inputFilePath) {
  if (!fs.existsSync(inputFilePath)) {
    console.error(`❌ File not found: ${inputFilePath}`);
    process.exit(1);
  }

  console.log(`\n📂 Reading translations from: ${inputFilePath}`);
  const rawData = fs.readFileSync(inputFilePath, 'utf8');
  let items = [];
  try {
    items = JSON.parse(rawData);
  } catch (err) {
    console.error(`❌ Invalid JSON in file:`, err.message);
    process.exit(1);
  }

  if (!Array.isArray(items)) {
    console.error(`❌ Expected a JSON array of questions, got ${typeof items}`);
    process.exit(1);
  }

  console.log(`🔍 Found ${items.length} items in the input file.`);

  // Connect to MongoDB
  console.log(`📡 Connecting to MongoDB Atlas...`);
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('patente_bangla');
  const questionsCol = db.collection('questions');

  // Also prepare to update local patenteguru_all_questions.json if exists
  const localMasterPath = path.resolve(__dirname, '../patenteguru_all_questions.json');
  let masterList = [];
  if (fs.existsSync(localMasterPath)) {
    masterList = JSON.parse(fs.readFileSync(localMasterPath, 'utf8'));
  }
  const masterMap = new Map();
  masterList.forEach((q, idx) => {
    if (q.officialId) masterMap.set(Number(q.officialId), idx);
    if (q.id) masterMap.set(String(q.id), idx);
    if (q.questionIt) masterMap.set(q.questionIt.trim(), idx);
  });

  // Also prepare translations_cache.json
  const cachePath = path.resolve(__dirname, 'translations_cache.json');
  let cache = {};
  if (fs.existsSync(cachePath)) {
    try { cache = JSON.parse(fs.readFileSync(cachePath, 'utf8')); } catch {}
  }

  let mongoUpdatedCount = 0;
  let masterUpdatedCount = 0;
  let bulkOps = [];

  for (const item of items) {
    const officialId = item.officialId ? Number(item.officialId) : null;
    const id = item.id ? String(item.id) : null;
    const questionIt = item.questionIt ? item.questionIt.trim() : null;
    const questionBn = item.questionBn ? item.questionBn.trim() : null;
    const questionEn = item.questionEn ? item.questionEn.trim() : null;

    if (!questionBn && !questionEn) continue;

    const updateFields = {
      hasTranslation: true,
      translationSource: 'chatgpt_reviewed',
      updatedAt: new Date().toISOString()
    };
    if (questionBn) updateFields.questionBn = questionBn;
    if (questionEn) updateFields.questionEn = questionEn;

    // Filter to find the question in MongoDB
    let filter = null;
    if (officialId) filter = { officialId: officialId };
    else if (id) filter = { id: id };
    else if (questionIt) filter = { questionIt: questionIt };

    if (filter) {
      bulkOps.push({
        updateOne: {
          filter,
          update: { $set: updateFields }
        }
      });
    }

    // Update in local master map
    let targetIdx = undefined;
    if (officialId && masterMap.has(officialId)) targetIdx = masterMap.get(officialId);
    else if (id && masterMap.has(id)) targetIdx = masterMap.get(id);
    else if (questionIt && masterMap.has(questionIt)) targetIdx = masterMap.get(questionIt);

    if (targetIdx !== undefined && masterList[targetIdx]) {
      if (questionBn) masterList[targetIdx].questionBn = questionBn;
      if (questionEn) masterList[targetIdx].questionEn = questionEn;
      masterList[targetIdx].hasTranslation = true;
      masterList[targetIdx].translationSource = 'chatgpt_reviewed';
      masterUpdatedCount++;
    }

    // Update cache
    if (questionIt) {
      cache[questionIt] = questionBn;
    }
  }

  // Execute MongoDB bulk operations
  if (bulkOps.length > 0) {
    console.log(`⚡ Updating ${bulkOps.length} questions in MongoDB...`);
    const res = await questionsCol.bulkWrite(bulkOps);
    mongoUpdatedCount = res.modifiedCount;
    console.log(`✅ MongoDB: Modified ${mongoUpdatedCount} records (matched ${res.matchedCount}).`);
  }

  // Save updated patenteguru_all_questions.json
  if (masterList.length > 0) {
    fs.writeFileSync(localMasterPath, JSON.stringify(masterList, null, 2), 'utf8');
    console.log(`✅ Local master JSON updated: ${masterUpdatedCount} questions updated.`);

    // Also update Desktop & Downloads copies
    const desktopPath = 'C:\\Users\\LAPTOP LEGEND\\Desktop\\patenteguru_all_questions.json';
    const downloadsPath = 'C:\\Users\\LAPTOP LEGEND\\Downloads\\patenteguru_all_questions.json';
    try {
      fs.writeFileSync(desktopPath, JSON.stringify(masterList, null, 2), 'utf8');
      fs.writeFileSync(downloadsPath, JSON.stringify(masterList, null, 2), 'utf8');
      console.log(`✅ Synced updated JSON directly to Desktop and Downloads!`);
    } catch (e) {
      console.warn(`Could not sync to Desktop/Downloads:`, e.message);
    }
  }

  // Save translations cache
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
  console.log(`✅ Cache updated.`);

  await client.close();
  console.log(`\n🎉 Success! All ${items.length} questions merged seamlessly into MongoDB Atlas & master files.`);
}

// Support command-line arguments: node import_chatgpt_translations.cjs <filePath>
const targetFile = process.argv[2] || 'C:\\Users\\LAPTOP LEGEND\\Downloads\\patenteguru_bangla_translation_sample_20.json';
importTranslations(targetFile).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

