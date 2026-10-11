/**
 * High-quality re-translation of all official Patente B questions (IT -> BN).
 *
 * Usage:
 *   node scripts/retranslate_quality.cjs --limit 25        (test a small batch, prints results)
 *   node scripts/retranslate_quality.cjs                   (translate everything, resumable)
 *   node scripts/retranslate_quality.cjs --sync            (push v2 translations into MongoDB)
 *
 * Progress is saved to scripts/translations_v2.json after every batch, so the
 * script can be stopped and restarted safely. Hand-curated translations in
 * src/data/patenteTranslationsBn.ts are kept unless --include-curated is passed.
 */
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://khshifatmanjum_db_user:Dtmkv5WKtSMqpTEh@cluster0.h8ljzpx.mongodb.net/patente_bangla?retryWrites=true&w=majority';

const RAW_FILE = path.resolve(__dirname, 'raw_questions.json');
const V2_FILE = path.resolve(__dirname, 'translations_v2.json');
const FLAG_FILE = path.resolve(__dirname, 'translations_v2_flagged.json');
const CURATED_FILE = path.resolve(__dirname, '../src/data/patenteTranslationsBn.ts');

const MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.5-flash'];
const BATCH_SIZE = 25;
const CONCURRENCY = 6;

const args = process.argv.slice(2);
const LIMIT = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1], 10) : 0;
const SYNC = args.includes('--sync');
const INCLUDE_CURATED = args.includes('--include-curated');

const GLOSSARY = `
(Format: Italian => Bengali word to use. Use only the Bengali word in the sentence; add the Italian in brackets only for key terms.
 Where options are separated by "/", choose the ONE that fits the sentence best — NEVER write the slash or both options.)
- Il segnale raffigurato / in figura => ছবিতে দেখানো সংকেতটি / ছবির
- striscia continua => টানা দাগ ; striscia discontinua => ভাঙা ভাঙা দাগ   (NEVER confuse these two)
- carreggiata => মূল সড়ক (Carreggiata) ; corsia => লেন (Corsia) ; banchina => রাস্তার কিনারা (Banchina)
- marciapiede => ফুটপাত ; salvagente => নিরাপত্তা দ্বীপ (Salvagente) ; spartitraffico => সড়ক বিভাজক
- incrocio / intersezione => মোড় / চৌরাস্তা (Incrocio) ; rotatoria => গোলচত্বর ; passaggio a livello => রেলক্রসিং
- dosso => উঁচু ঢিবি (Dosso) ; curva => বাঁক ; galleria => টানেল ; svincolo => সংযোগস্থল / এক্সিট
- in corrispondenza di => ঠিক ওই জায়গায় / ঠিক ওপরে   (NOT letters/correspondence)
- dare precedenza => অগ্রাধিকার দেওয়া ; DARE PRECEDENZA (sign name) => "অগ্রাধিকার দিন" (DARE PRECEDENZA)
- sosta => পার্কিং (Sosta) ; fermata => সাময়িক থামা (Fermata) ; arresto => সম্পূর্ণ থামা
- sorpasso => ওভারটেক (Sorpasso) ; inversione del senso di marcia => ইউ-টার্ন
- senso unico => একমুখী ; doppio senso di circolazione/marcia => দ্বিমুখী
- autostrada => মোটরওয়ে (Autostrada) ; strada extraurbana => শহরের বাইরের সড়ক ; centro abitato => লোকালয়
- autoveicolo => মোটরযান ; autovettura => প্রাইভেট কার ; ciclomotore => মোপেড (Ciclomotore) ; motociclo => মোটরসাইকেল ; rimorchio => ট্রেলার (Rimorchio) ; autocarro => ট্রাক ; complesso veicolare => গাড়ি ও ট্রেলার মিলিয়ে
- massa complessiva => সর্বমোট ওজন ; pneumatici => টায়ার ; spazio di frenatura => ব্রেকিং দূরত্ব ; distanza di sicurezza => নিরাপদ দূরত্ব
- patente => ড্রাইভিং লাইসেন্স ; carta di circolazione => গাড়ির রেজিস্ট্রেশন কাগজ ; revisione => গাড়ির বাধ্যতামূলক পরিদর্শন (Revisione) ; R.C.A. => বাধ্যতামূলক গাড়ি বীমা (R.C.A.)
- stato di ebbrezza => মদ্যপ অবস্থা ; neopatentato => নতুন লাইসেন্সধারী
- semaforo => ট্রাফিক লাইট ; lampeggiante => জ্বলা-নেভা করা ; pannello integrativo => অতিরিক্ত তথ্য প্যানেল ; preavviso => আগাম সংকেত
`;

const PROMPT_HEADER = `You are an expert translator preparing Italian "Patente B" driving-theory exam questions for Bengali-speaking students living in Italy.

Each item is an official TRUE/FALSE statement. Translate it into clear, natural, easy-to-understand Bengali (বাংলা) that a student with basic education can understand immediately.

STRICT RULES (very important — the student answers VERO/FALSO based on your translation):
1. Preserve the EXACT meaning, including every negation and quantifier: non, mai, sempre, solo/soltanto, anche, almeno, tutti, nessuno, obbligatorio, vietato, consentito. Never add, remove, or soften them.
2. Many statements are deliberately FALSE. Do NOT correct them. Translate exactly what the Italian says.
3. Numbers: use Western digits. Italian uses "." as thousands separator and "," as decimal: write "4.500 chilogrammi" as "4500 কিলোগ্রাম" and "0,5 g/l" as "0.5 গ্রাম/লিটার". Keep units (km/h, metri -> মিটার).
4. Write natural, fluent Bengali sentences, not word-by-word machine translation.
5. Do NOT use English words. Only Bengali, plus Italian terms in brackets.
6. For key traffic terms add the Italian word in brackets ONCE, e.g. "ওভারটেক (Sorpasso)". Never put long explanations in brackets.
7. Text written on signs/displays in CAPITALS (e.g. "ACCOSTARE", "STOP", "DARE PRECEDENZA"): keep the Italian and add its Bengali meaning, e.g. "ACCOSTARE" (রাস্তার পাশে থামুন).
8. Ignore image reference numbers in brackets at the end like "(502)".
9. Do not add explanations, answers, or commentary.

GLOSSARY:
${GLOSSARY}

Return ONLY a JSON array: [{"i": <same index>, "bn": "<Bengali translation>"}] — one entry for every input item.

Input items:
`;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function loadCurated() {
  if (!fs.existsSync(CURATED_FILE)) return {};
  const content = fs.readFileSync(CURATED_FILE, 'utf8');
  const map = {};
  const re = /^\s*("(?:[^"\\]|\\.)*")\s*:\s*("(?:[^"\\]|\\.)*"),?\s*$/gm;
  let m;
  while ((m = re.exec(content)) !== null) {
    try {
      map[JSON.parse(m[1]).trim()] = JSON.parse(m[2]);
    } catch {}
  }
  return map;
}

async function getApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const m = fs.readFileSync(envPath, 'utf8').match(/GEMINI_API_KEY\s*=\s*([^\s\r\n]+)/);
    if (m) return m[1].trim();
  }
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const doc = await client.db('patente_bangla').collection('settings').findOne({ key: 'app_settings' });
  await client.close();
  return doc?.geminiApiKey || '';
}

const NEGATION_IT = /\b(non|mai|nessun[oa]?|né)\b/i;
const NEGATION_BN = /(না|নয়|নয়|নেই|নি|কখনো|কখনও|নিষিদ্ধ|বারণ|নিষেধ)/;

function validate(it, bn) {
  const problems = [];
  if (!bn || !/[\u0980-\u09FF]/.test(bn)) problems.push('no-bengali');
  if (bn && (bn.length < it.length * 0.35 || bn.length > it.length * 3)) problems.push('length');
  if (NEGATION_IT.test(it) && bn && !NEGATION_BN.test(bn)) problems.push('negation-missing');

  // Numbers: ignore trailing image refs like "(502)", normalise Italian 4.500 / 0,5
  const itClean = it.replace(/\(\s*\d+\s*\)\s*$/, '');
  const bnDigits = (bn || '').replace(/[.,]/g, '');
  for (const n of itClean.match(/\d+(?:[.,]\d+)*/g) || []) {
    if (!bnDigits.includes(n.replace(/[.,]/g, ''))) problems.push('number-' + n);
  }

  // English words leaking outside brackets/quotes (that are not in the Italian source)
  const outside = (bn || '').replace(/\([^)]*\)/g, ' ').replace(/"[^"]*"/g, ' ');
  for (const w of outside.match(/[A-Za-z]{4,}/g) || []) {
    if (!new RegExp('\\b' + w + '\\b', 'i').test(it)) {
      problems.push('latin-word-' + w);
      break;
    }
  }
  return problems;
}

async function translateBatch(items, apiKey) {
  const payload = items.map((it, i) => ({ i, it }));
  const prompt = PROMPT_HEADER + JSON.stringify(payload, null, 1);

  for (const model of MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
            }),
          }
        );
        if (res.status === 429 || res.status >= 500) {
          await sleep(4000 * (attempt + 1));
          continue;
        }
        if (!res.ok) break; // try next model
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) continue;
        const arr = JSON.parse(text);
        if (!Array.isArray(arr)) continue;
        const out = {};
        for (const row of arr) {
          if (typeof row?.i === 'number' && typeof row?.bn === 'string' && items[row.i]) {
            out[items[row.i]] = row.bn.trim();
          }
        }
        if (Object.keys(out).length >= Math.ceil(items.length * 0.8)) return out;
      } catch {
        await sleep(2000);
      }
    }
  }
  return {};
}

async function runTranslate() {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error('No Gemini API key found');

  const raw = loadJson(RAW_FILE, []);
  const curated = INCLUDE_CURATED ? {} : loadCurated();
  const v2 = loadJson(V2_FILE, {});
  const flagged = loadJson(FLAG_FILE, {});

  const unique = Array.from(new Set(raw.map((q) => q.question.trim())));
  let pending = unique.filter((it) => !curated[it] && !v2[it]);
  if (LIMIT) pending = pending.slice(0, LIMIT);

  console.log(`Unique questions: ${unique.length}`);
  console.log(`Kept hand-curated: ${Object.keys(curated).length}`);
  console.log(`Already done in v2: ${Object.keys(v2).length}`);
  console.log(`To translate now: ${pending.length}`);

  const batches = [];
  for (let i = 0; i < pending.length; i += BATCH_SIZE) batches.push(pending.slice(i, i + BATCH_SIZE));

  let done = 0;
  let cursor = 0;
  async function worker() {
    while (cursor < batches.length) {
      const batch = batches[cursor++];
      let result = await translateBatch(batch, apiKey);

      // Retry any missing / invalid items once, individually grouped
      const retry = batch.filter((it) => !result[it] || validate(it, result[it]).includes('no-bengali'));
      if (retry.length) {
        const second = await translateBatch(retry, apiKey);
        Object.assign(result, second);
      }

      for (const it of batch) {
        const bn = result[it];
        if (!bn) continue;
        v2[it] = bn;
        const problems = validate(it, bn);
        if (problems.length) flagged[it] = { bn, problems };
        else delete flagged[it];
      }

      done += batch.length;
      fs.writeFileSync(V2_FILE, JSON.stringify(v2, null, 2), 'utf8');
      fs.writeFileSync(FLAG_FILE, JSON.stringify(flagged, null, 2), 'utf8');
      console.log(`Progress: ${done}/${pending.length} | v2 total: ${Object.keys(v2).length} | flagged: ${Object.keys(flagged).length}`);
      await sleep(500);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  if (LIMIT) {
    console.log('\n=== SAMPLE RESULTS ===');
    for (const it of pending) {
      console.log('\nIT: ' + it);
      console.log('BN: ' + (v2[it] || '(missing)'));
      if (flagged[it]) console.log('FLAG: ' + flagged[it].problems.join(', '));
    }
  } else {
    console.log('\nTranslations complete! Now auto-syncing high quality translations into MongoDB...');
    await runSync();
  }
  console.log('\nDone.');
}

async function runSync() {
  const raw = loadJson(RAW_FILE, []);
  const curated = loadCurated();
  const v2 = loadJson(V2_FILE, {});
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const col = client.db('patente_bangla').collection('questions');

  let ops = [];
  let updated = 0;
  let missing = 0;
  for (const q of raw) {
    const it = q.question.trim();
    const bn = curated[it] || v2[it];
    if (!bn) {
      missing++;
      continue;
    }
    ops.push({
      updateOne: {
        filter: { officialId: q.id },
        update: { $set: { questionBn: bn, hasTranslation: true, translationVersion: curated[it] ? 'curated' : 'v2-gemini' } },
      },
    });
    if (ops.length >= 500) {
      const r = await col.bulkWrite(ops);
      updated += r.modifiedCount;
      ops = [];
      console.log(`MongoDB updated: ${updated}`);
    }
  }
  if (ops.length) updated += (await col.bulkWrite(ops)).modifiedCount;
  await client.close();
  console.log(`Sync complete. Updated: ${updated}. Missing v2 translation (left unchanged): ${missing}`);
}

(SYNC ? runSync() : runTranslate()).catch((e) => {
  console.error(e);
  process.exit(1);
});

