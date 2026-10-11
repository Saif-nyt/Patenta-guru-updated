const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://khshifatmanjum_db_user:Dtmkv5WKtSMqpTEh@cluster0.h8ljzpx.mongodb.net/patente_bangla?retryWrites=true&w=majority';

// Initial sample of official Patente D ministerial questions with Italian, English and Bangla
const initialBusQuestions = [
  {
    officialId: 80001,
    category: 'D',
    chapterNum: 1,
    chapterTitleIt: 'Cronotachigrafo e tempi di guida e di riposo',
    questionIt: 'Il cronotachigrafo digitale deve essere sottoposto a controllo periodico almeno ogni due anni',
    questionEn: 'The digital tachograph must undergo periodic inspection at least once every two years.',
    questionBn: 'ডিজিটাল ট্যাকোগ্রাফটি কমপক্ষে প্রতি দুই বছরে অন্তত একবার নিয়মিত পরিদর্শন (চেকআপ) করাতে হবে।',
    isCorrect: true,
    topic: 'Tachigrafo',
    translationSource: 'it_en_bn_pipeline',
    createdAt: new Date().toISOString()
  },
  {
    officialId: 80002,
    category: 'D',
    chapterNum: 1,
    chapterTitleIt: 'Cronotachigrafo e tempi di guida e di riposo',
    questionIt: 'Dopo un periodo di guida di quattro ore e mezza, il conducente deve fare una pausa di almeno 45 minuti',
    questionEn: 'After a driving period of four and a half hours, the driver must take an uninterrupted break of at least 45 minutes.',
    questionBn: 'টানা সাড়ে চার ঘণ্টা গাড়ি চালানোর পর, চালককে কমপক্ষে ৪৫ মিনিটের একটি বিরতি নিতে হবে।',
    isCorrect: true,
    topic: 'Tempi di guida e riposo',
    translationSource: 'it_en_bn_pipeline',
    createdAt: new Date().toISOString()
  },
  {
    officialId: 80003,
    category: 'D',
    chapterNum: 2,
    chapterTitleIt: 'Meccanica, freni pneumatici e organi di guida',
    questionIt: 'Nei circuiti frenanti pneumatici, la valvola a quattro vie serve a distribuire l\'aria compressa ai vari circuiti di frenatura',
    questionEn: 'In pneumatic braking circuits, the four-way protection valve serves to distribute compressed air to the various brake circuits.',
    questionBn: 'বায়ুচালিত ব্রেকিং সিস্টেমে (এয়ার ব্রেক), ফোর-ওয়ে প্রটেকশন ভালভ বিভিন্ন ব্রেকিং সার্কিটে সংকুচিত বাতাস বণ্টন করতে কাজ করে।',
    isCorrect: true,
    topic: 'Freni pneumatici',
    translationSource: 'it_en_bn_pipeline',
    createdAt: new Date().toISOString()
  },
  {
    officialId: 80004,
    category: 'D',
    chapterNum: 2,
    chapterTitleIt: 'Meccanica, freni pneumatici e organi di guida',
    questionIt: 'Il rallentatore idraulico (retarder) sostituisce completamente il freno di servizio',
    questionEn: 'The hydraulic retarder completely replaces the service brake.',
    questionBn: 'হাইড্রোলিক রিটার্ডার (রিটার্ডার) সার্ভিস ব্রেকের (প্রধান পায়ের ব্রেক) প্রয়োজনীয়তাকে সম্পূর্ণরূপে দূর বা প্রতিস্থাপন করে।',
    isCorrect: false,
    topic: 'Rallentatori',
    translationSource: 'it_en_bn_pipeline',
    createdAt: new Date().toISOString()
  },
  {
    officialId: 80005,
    category: 'D',
    chapterNum: 3,
    chapterTitleIt: 'Comportamento in curva e sbalzo posteriore',
    questionIt: 'Negli autobus, lo sbalzo posteriore può invadere la corsia adiacente durante una svolta stretta',
    questionEn: 'In buses, the rear overhang can swing into the adjacent lane during a tight turn.',
    questionBn: 'বাসের ক্ষেত্রে, একটি সংকীর্ণ বা খাড়া মোড় নেওয়ার সময় বাসের পেছনের বাড়তি অংশ (রিয়ার ওভারহ্যাং) পাশের লেনে চলে আসতে পারে।',
    isCorrect: true,
    topic: 'Dinamica di guida',
    translationSource: 'it_en_bn_pipeline',
    createdAt: new Date().toISOString()
  },
  {
    officialId: 80006,
    category: 'D',
    chapterNum: 4,
    chapterTitleIt: 'Sicurezza dei passeggeri ed uscite di emergenza',
    questionIt: 'Le uscite di emergenza di un autobus devono essere segnalate e facilmente apribili sia dall\'interno che dall\'esterno',
    questionEn: 'The emergency exits of a bus must be clearly marked and easily openable from both the inside and the outside.',
    questionBn: 'একটি বাসের জরুরি নির্গমন পথগুলো (ইমার্জেন্সি এক্সিট) স্পষ্টভাবে চিহ্নিত থাকতে হবে এবং ভেতর ও বাইরে উভয় দিক থেকেই সহজে খোলার উপযোগী হতে হবে।',
    isCorrect: true,
    topic: 'Sicurezza passeggeri',
    translationSource: 'it_en_bn_pipeline',
    createdAt: new Date().toISOString()
  }
];

async function setup() {
  console.log('📡 Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('patente_bangla');

  // Create collection
  const collectionName = 'questions_bus_d';
  const existingCols = await db.listCollections({ name: collectionName }).toArray();
  if (existingCols.length === 0) {
    await db.createCollection(collectionName);
    console.log(`✅ Created collection: ${collectionName}`);
  } else {
    console.log(`ℹ️ Collection ${collectionName} already exists.`);
  }

  const col = db.collection(collectionName);

  // Setup Indexes
  console.log('⚡ Creating indexes...');
  await col.createIndex({ officialId: 1 }, { unique: true });
  await col.createIndex({ chapterNum: 1 });
  await col.createIndex({ category: 1 });
  console.log('✅ Indexes created successfully!');

  // Upsert sample questions
  console.log(`📝 Seeding initial foundational questions...`);
  for (const q of initialBusQuestions) {
    await col.updateOne(
      { officialId: q.officialId },
      { $set: q },
      { upsert: true }
    );
  }

  const totalCount = await col.countDocuments();
  console.log(`🎉 Success! Collection '${collectionName}' is ready with ${totalCount} questions configured.`);

  const samples = await col.find().limit(2).toArray();
  console.log('\nSample from questions_bus_d:');
  console.log(JSON.stringify(samples, null, 2));

  await client.close();
}

setup().catch(err => {
  console.error('Setup error:', err);
  process.exit(1);
});

