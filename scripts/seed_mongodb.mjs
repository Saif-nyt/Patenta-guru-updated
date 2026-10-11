import fs from 'fs';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: Please provide MONGODB_URI in your environment or .env file before running seed.');
  process.exit(1);
}

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas for seeding.');
    const db = client.db('patente_bangla');
    const studentsCol = db.collection('students');
    const settingsCol = db.collection('settings');

    // 1. Seed students
    if (fs.existsSync('students_db.json')) {
      const localStudents = JSON.parse(fs.readFileSync('students_db.json', 'utf-8'));
      console.log('Found', localStudents.length, 'students in students_db.json');
      for (const student of localStudents) {
        const email = student.email ? student.email.trim().toLowerCase() : null;
        const uid = student.uid ? String(student.uid) : null;
        if (!email && !uid) continue;

        const filter = email ? { email } : { uid };
        const { createdAt, _id, ...rest } = student;
        if (email) rest.email = email;

        await studentsCol.updateOne(
          filter,
          {
            $set: {
              ...rest,
              updatedAt: new Date().toISOString()
            },
            $setOnInsert: {
              createdAt: createdAt || new Date().toISOString()
            }
          },
          { upsert: true }
        );
      }
      console.log('Seeded students into MongoDB Atlas students collection.');
    }

    // 2. Seed settings
    const defaultSettings = {
      key: 'app_settings',
      freeRoundsLimit: 20,
      academyPriceEur: 49,
      promoBannerText: 'অফিসিয়াল ইতালিয়ান লাইসেন্স প্রস্তুতি • প্রথম প্রচেষ্টায় পাশের গ্যারান্টি',
      isPromoActive: false,
      lastUpdated: new Date().toISOString()
    };
    await settingsCol.updateOne(
      { key: 'app_settings' },
      { $set: defaultSettings },
      { upsert: true }
    );
    console.log('Seeded settings into MongoDB Atlas settings collection.');

    const count = await studentsCol.countDocuments();
    console.log('Total students in MongoDB Atlas:', count);
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seed();

