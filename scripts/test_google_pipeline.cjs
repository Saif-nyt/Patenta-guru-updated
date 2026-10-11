const fs = require('fs');

async function googleTranslate(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=it&tl=bn&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data && data[0]) {
    return data[0].map(item => item[0]).join('');
  }
  return '';
}

// Smart post-processing rules specifically for Italian Patente -> Bengali
function refinePatenteBangla(bn, it) {
  let res = bn;

  // Fix literal errors
  res = res.replace(/যদি অতিক্রম করা হয়/g, 'যদি একটি লাল আড়াআড়ি দাগ টানা থাকে');
  res = res.replace(/লাল ডোরা দিয়ে আঁকা চিহ্নটি/g, 'প্রদর্শিত চিহ্নটির ওপর লাল দাগ থাকলে');
  res = res.replace(/দশে পৌঁছাতে পারে/g, 'সর্বোচ্চ ১০ জন হতে পারে');
  res = res.replace(/দশজনে পৌঁছাতে পারে/g, 'সর্বোচ্চ ১০ জন হতে পারে');
  res = res.replace(/গাড়িতে যাতায়াত করা যায় এমন লোকের সংখ্যা/g, 'যাত্রীবাহী কারে (Autovettura) বহনযোগ্য মানুষের সংখ্যা');
  res = res.replace(/চিত্রিত চিহ্নটি/g, 'প্রদর্শিত সাইনটি');
  res = res.replace(/চিত্রের চিহ্নটি/g, 'প্রদর্শিত সাইনটি');
  res = res.replace(/চিহ্নিত চিহ্নটি/g, 'প্রদর্শিত সাইনটি');
  res = res.replace(/প্রদর্শিত চিহ্নটি/g, 'প্রদর্শিত সাইনটি');
  res = res.replace(/রাস্তার প্রসারিত/g, 'রাস্তার এমন একটি অংশ');
  res = res.replace(/একটি প্রসারিত রাস্তা/g, 'রাস্তার এমন একটি অংশ');
  res = res.replace(/স্তব্ধ মাত্রা/g, 'ফ্লাইওভার বা আন্ডারপাস');
  res = res.replace(/বর্ণনাকারী/g, 'রিফ্লেক্টর প্যানেল');

  return res.trim();
}

async function run() {
  const samples = [
    "Il numero delle persone trasportabili sulle autovetture può raggiungere il massimo di dieci",
    "Il segnale raffigurato, se barrato, da una striscia rossa indica la fine di una strada extraurbana principale",
    "Il segnale raffigurato se barrato da una striscia rossa indica la fine della sua validità",
    "La corsia di emergenza non può essere utilizzata per la circolazione ordinaria",
    "La distanza di sicurezza deve essere mantenuta anche rispetto ai veicoli che seguono"
  ];

  for (const it of samples) {
    const raw = await googleTranslate(it);
    const refined = refinePatenteBangla(raw, it);
    console.log('IT:', it);
    console.log('Raw Google:', raw);
    console.log('Refined:', refined);
    console.log('---');
  }
}

run();
