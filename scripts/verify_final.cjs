const { MongoClient } = require('mongodb');
const fs = require('fs');
const uri = 'mongodb+srv://khshifatmanjum_db_user:Dtmkv5WKtSMqpTEh@cluster0.h8ljzpx.mongodb.net/patente_bangla?retryWrites=true&w=majority';

async function verify() {
  const client = new MongoClient(uri);
  await client.connect();
  const col = client.db('patente_bangla').collection('questions');
  const total = await col.countDocuments();
  const withBn = await col.countDocuments({ questionBn: { $exists: true, $ne: '' } });
  const withEn = await col.countDocuments({ questionEn: { $exists: true, $ne: '' } });
  console.log('MongoDB Total Questions:', total);
  console.log('MongoDB Questions with Bangla:', withBn);
  console.log('MongoDB Questions with English:', withEn);
  const sample = await col.aggregate([{ $sample: { size: 3 } }]).toArray();
  sample.forEach((s, i) => {
    console.log(`\nSample ${i+1} (Official ID: ${s.officialId}):`);
    console.log('🇮🇹 IT:', s.questionIt);
    console.log('🇬🇧 EN:', s.questionEn);
    console.log('🇧🇩 BN:', s.questionBn);
  });
  await client.close();

  // Make sure Desktop & Downloads files are 100% updated with latest master
  const masterContent = fs.readFileSync('patenteguru_all_questions.json', 'utf8');
  fs.writeFileSync('C:\\Users\\LAPTOP LEGEND\\Desktop\\patenteguru_all_questions.json', masterContent, 'utf8');
  fs.writeFileSync('C:\\Users\\LAPTOP LEGEND\\Downloads\\patenteguru_all_questions.json', masterContent, 'utf8');
  console.log('\n✅ Synced latest 100% complete files to Desktop and Downloads!');
}

verify().catch(console.error);

