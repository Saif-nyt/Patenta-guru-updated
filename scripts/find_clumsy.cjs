const fs = require('fs');

const raw = fs.readFileSync('src/data/patenteTranslationsBn.ts', 'utf8');

const suspiciousWords = [
  'নিয়ন্ত্রক',
  'খুঁজে বের করা',
  'বর্ণনাকারী',
  'স্তব্ধ',
  'প্রসারিত',
  'প্রেসক্রিপশন',
  'ট্র্যাক্টরের',
  'ছেদ',
  'পরিষ্কার করে',
  'বিচ্ছিন্ন পার্শ্বীয়',
  'আধা-বাধা',
  'কোয়াড্রিসাইকেল',
  'পাংচার',
  'ড্রাইভওয়ে',
  'ক্যারেজওয়ে',
  'ভ্রমণে বাধা'
];

const lines = raw.split('\n');
let found = {};

suspiciousWords.forEach(w => found[w] = []);

for (let line of lines) {
  for (let w of suspiciousWords) {
    if (line.includes(w)) {
      found[w].push(line.trim());
    }
  }
}

for (let [w, items] of Object.entries(found)) {
  if (items.length > 0) {
    console.log(`=== FOUND: "${w}" (${items.length} items) ===`);
    items.slice(0, 3).forEach(it => console.log('  ', it));
  }
}

