const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://khshifatmanjum_db_user:Dtmkv5WKtSMqpTEh@cluster0.h8ljzpx.mongodb.net/patente_bangla?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function verify() {
  await client.connect();
  const db = client.db('patente_bangla');
  const col = db.collection('questions');
  const total = await col.countDocuments();
  const withTranslation = await col.countDocuments({ hasTranslation: true });
  const sample = await col.aggregate([{ $sample: { size: 3 } }]).toArray();

  console.log('Total questions in MongoDB:', total);
  console.log('Questions with Bengali translation:', withTranslation);
  sample.forEach((q, i) => {
    console.log(`\nSample ${i+1}:`);
    console.log('IT:', q.questionIt);
    console.log('BN:', q.questionBn);
    console.log('Answer:', q.isCorrect ? 'VERO' : 'FALSO');
  });
  await client.close();
}

verify().catch(console.error);

