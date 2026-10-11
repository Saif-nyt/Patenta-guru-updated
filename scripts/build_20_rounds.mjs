// Generate official ministerial questions pool for Rounds 1 to 20 (600 official questions)
import fs from 'fs';

const rawQuestions = JSON.parse(fs.readFileSync('scripts/raw_questions.json', 'utf8'));
const rawChapters = JSON.parse(fs.readFileSync('scripts/raw_chapters.json', 'utf8'));

console.log(`Loaded ${rawQuestions.length} raw questions.`);

// 20 Free Round themes covering all core Italian driving license topics
const ROUND_DEFS = [
  { id: 1, titleBn: 'রাউন্ড ১: বিপদজনক ট্রাফিক সংকেত', titleIt: 'Round 1: Segnali di Pericolo Base', topicBn: '⚠️ বিপদ সংকেত', topicIt: 'Segnali di Pericolo', count: 30 },
  { id: 2, titleBn: 'রাউন্ড ২: স্টপ ও ডানদিকের অগ্রাধিকার', titleIt: 'Round 2: Precedenze e Regola STOP', topicBn: '🛑 অগ্রাধিকার', topicIt: 'Precedenze e Incroci', count: 30 },
  { id: 3, titleBn: 'রাউন্ড ৩: গতিসীমা ও ব্রেকিং দূরত্ব', titleIt: 'Round 3: Limiti di Velocità e Frenata', topicBn: '⭕ গতিসীমা', topicIt: 'Limiti di Velocità', count: 30 },
  { id: 4, titleBn: 'রাউন্ড ৪: পার্কিং ও সাময়িক থামা', titleIt: 'Round 4: Norme di Sosta e Fermata', topicBn: '🚫 পার্কিং', topicIt: 'Sosta e Fermata', count: 30 },
  { id: 5, titleBn: 'রাউন্ড ৫: ওভারটেকিং ও বাঁকের নিয়ম', titleIt: 'Round 5: Sorpasso in Curva e Dosso', topicBn: '⛔ ওভারটেক', topicIt: 'Regole sul Sorpasso', count: 30 },
  { id: 6, titleBn: 'রাউন্ড ৬: গোলচত্বর ও ট্রাম অগ্রাধিকার', titleIt: 'Round 6: Rotatorie, Tram e Binari', topicBn: '🚊 ট্রাম ও মোড়', topicIt: 'Rotatorie e Tram', count: 30 },
  { id: 7, titleBn: 'রাউন্ড ৭: বাধ্যতামূলক ট্রাফিক সাইন', titleIt: 'Round 7: Segnali di Obbligo Ministeriali', topicBn: '🔵 সংকেত', topicIt: 'Segnali di Obbligo', count: 30 },
  { id: 8, titleBn: 'রাউন্ড ৮: নিষেধাজ্ঞামূলক ট্রাফিক সাইন', titleIt: 'Round 8: Segnali di Divieto Ministeriali', topicBn: '🔴 নিষেধাজ্ঞা', topicIt: 'Segnali di Divieto', count: 30 },
  { id: 9, titleBn: 'রাউন্ড ৯: হাইওয়ে (Autostrada) নিয়মাবলি', titleIt: 'Round 9: Circolazione su Autostrade', topicBn: '🛣️ হাইওয়ে', topicIt: 'Autostrade e Tangenziali', count: 30 },
  { id: 10, titleBn: 'রাউন্ড ১০: হেডলাইট ও দৃশ্যমানতার নিয়ম', titleIt: 'Round 10: Uso dei Fari e Visibilità', topicBn: '💡 বাতি ও লাইট', topicIt: 'Uso dei Fari e Luci', count: 30 },
  { id: 11, titleBn: 'রাউন্ড ১১: অ্যালকোহল, ড্রাগস ও ফিটনেস', titleIt: 'Round 11: Guida in Stato di Ebbrezza e Punti', topicBn: '🍷 অ্যালকোহল ও পয়েন্ট', topicIt: 'Alcol, Droga e Punti', count: 30 },
  { id: 12, titleBn: 'রাউন্ড ১২: প্রাথমিক চিকিৎসা ও দুর্ঘটনা', titleIt: 'Round 12: Primo Soccorso Stradale e Urgenze', topicBn: '🚑 ফার্স্ট এইড', topicIt: 'Primo Soccorso', count: 30 },
  { id: 13, titleBn: 'রাউন্ড ১৩: গাড়ির ইঞ্জিন, ব্রেক ও মেকানিক্স', titleIt: 'Round 13: Meccanica, Motore e Freni', topicBn: '⚙️ যন্ত্রাংশ ও ব্রেক', topicIt: 'Motore, Freni e Gomme', count: 30 },
  { id: 14, titleBn: 'রাউন্ড ১৪: ট্রাফিক মোড়ে গাড়ির ক্রসিং ক্রম', titleIt: 'Round 14: Ordine di Precedenza agli Incroci', topicBn: '🚸 মোড়ের ক্রম', topicIt: 'Incroci e Precedenze', count: 30 },
  { id: 15, titleBn: 'রাউন্ড ১৫: পরিবেশবান্ধব ও নিরাপদ ড্রাইভিং', titleIt: 'Round 15: Guida Ecologica e Sicurezza Attiva', topicBn: '🌿 পরিবেশ ও জ্বালানি', topicIt: 'Ambiente ed Ecoguida', count: 30 },
  { id: 16, titleBn: 'রাউন্ড ১৬: রাস্তার দাগ ও ট্রাফিক লাইট', titleIt: 'Round 16: Segnaletica Orizzontale e Semafori', topicBn: '🚦 ট্রাফিক লাইট ও দাগ', topicIt: 'Strisce e Semafori', count: 30 },
  { id: 17, titleBn: 'রাউন্ড ১৭: সম্পূরক সাইনবোর্ড ও ফলক', titleIt: 'Round 17: Pannelli Integrativi dei Segnali', topicBn: '📋 সম্পূরক ফলক', topicIt: 'Pannelli Integrativi', count: 30 },
  { id: 18, titleBn: 'রাউন্ড ১৮: সিটবেল্ট, এয়ারব্যাগ ও হেলমেট', titleIt: 'Round 18: Cinture di Sicurezza, Airbag e Casco', topicBn: '🛡️ সিটবেল্ট ও হেলমেট', topicIt: 'Cinture e Casco', count: 30 },
  { id: 19, titleBn: 'রাউন্ড ১৯: ড্রাইভিং লাইসেন্স ক্যাটাগরি ও বয়স', titleIt: 'Round 19: Patenti di Guida, Categorie ed Età', topicBn: '🪪 লাইসেন্স ও ক্যাটাগরি', topicIt: 'Patenti e Documenti', count: 30 },
  { id: 20, titleBn: 'রাউন্ড ২০: ফ্রি স্টাডি গ্র্যান্ড ফাইনাল মক টেস্ট', titleIt: 'Round 20: Test di Sbarramento Finale (20 Round)', topicBn: '🎓 গ্র্যান্ড ফাইনাল মক', topicIt: 'Simulazione Ufficiale 30Q', count: 30 },
];

const VOCAB_MAP = {
  'precedenza': { it: 'Precedenza', bn: 'অগ্রাধিকার / আগে যাওয়ার অধিকার' },
  'arrestarsi': { it: 'Arrestarsi', bn: 'সম্পূর্ণ গাড়ি থামানো' },
  'fermata': { it: 'Fermata', bn: 'সাময়িক থামা (যাত্রী ওঠানামা)' },
  'sosta': { it: 'Sosta', bn: 'পার্কিং (চালক গাড়ি থেকে দূরে যাওয়া)' },
  'sorpasso': { it: 'Sorpasso', bn: 'ওভারটেকিং' },
  'svolta': { it: 'Svolta', bn: 'মোড় ঘোরানো (ডানে বা বাঁয়ে)' },
  'carreggiata': { it: 'Carreggiata', bn: 'গাড়ি চলাচলের মূল পাকা রাস্তা' },
  'corsia': { it: 'Corsia', bn: 'লেইন (এক সারিতে গাড়ি চলার পথ)' },
  'incrocio': { it: 'Incrocio', bn: 'রাস্তার মোড় / চৌরাস্তা' },
  'pedoni': { it: 'Pedoni', bn: 'পথচারী' },
  'velocità': { it: 'Velocità', bn: 'গতি / গতিবেগ' },
  'distanza di sicurezza': { it: 'Distanza di sicurezza', bn: 'নিরাপদ দূরত্ব' },
  'frenatura': { it: 'Frenatura', bn: 'ব্রেক করা' },
  'divieto': { it: 'Divieto', bn: 'নিষেধাজ্ঞা' },
  'obbligo': { it: 'Obbligo', bn: 'বাধ্যবাধকতা' },
  'pericolo': { it: 'Pericolo', bn: 'বিপদ / ঝুঁকি' },
  'autostrada': { it: 'Autostrada', bn: 'হাইওয়ে / মোটরওয়ে' },
  'centri abitati': { it: 'Centri abitati', bn: 'শহরাঞ্চল / লোকালয়' },
  'visibilità': { it: 'Visibilità', bn: 'দৃশ্যমানতা' },
  'cinture': { it: 'Cinture di sicurezza', bn: 'সিটবেল্ট' },
  'casco': { it: 'Casco', bn: 'হেলমেট' }
};

const TRAP_WORDS = [
  { it: 'in ogni caso', tip: 'সতর্ক থাকুন: "in ogni caso" (সর্বাবস্থায়) কথাটি থাকলে বেশিরভাগ ক্ষেত্রে প্রশ্নটি FALSO হয়।' },
  { it: 'sempre', tip: '"Sempre" (সবসময়) শব্দযুক্ত প্রশ্নে সতর্ক থাকুন। সাধারণ নিয়মে ব্যতিক্রম থাকলে উত্তর FALSO হয়।' },
  { it: 'mai', tip: '"Mai" (কখনোই না) শব্দটি থাকলে খেয়াল করুন—কোনো পরিস্থিতিতে কি অনুমতি আছে? থাকলে উত্তর FALSO হবে।' },
  { it: 'esclusivamente', tip: '"Esclusivamente" (একমাত্র/কেবলমাত্র) শব্দটি সাধারণ নিয়মকে অতি-সীমিত করে ফেলে, তাই সতর্ক থাকুন।' },
  { it: 'soltanto', tip: '"Soltanto" (শুধুমাত্র) ট্রাফিকের নিয়মে একটি পরিচিত ট্র্যাপ বা ফাঁদ শব্দ।' },
];

function extractVocabulary(text) {
  const lower = text.toLowerCase();
  const vocabs = [];
  for (const [key, val] of Object.entries(VOCAB_MAP)) {
    if (lower.includes(key)) {
      vocabs.push({ wordIt: val.it, meaningBn: val.bn });
      if (vocabs.length >= 3) break;
    }
  }
  return vocabs;
}

function findTrapTip(text) {
  const lower = text.toLowerCase();
  for (const t of TRAP_WORDS) {
    if (lower.includes(t.it)) return t.tip;
  }
  return null;
}

// Simple translation generator for Bangla
function generateBanglaTranslation(textIt) {
  let bn = textIt;
  bn = bn.replace(/Il segnale raffigurato preannuncia/gi, 'চিহ্নিত ট্রাফিক সংকেতটি সামনে নির্দেশ করে');
  bn = bn.replace(/In presenza del segnale raffigurato è consentito/gi, 'চিহ্নিত সাইনটির উপস্থিতিতে অনুমতি রয়েছে');
  bn = bn.replace(/In presenza del segnale raffigurato è vietato/gi, 'চিহ্নিত সাইনটির উপস্থিতিতে নিষেধ');
  bn = bn.replace(/In presenza del segnale raffigurato è obbligatorio/gi, 'চিহ্নিত সাইনটির উপস্থিতিতে বাধ্যতামূলক');
  bn = bn.replace(/La distanza di sicurezza deve essere/gi, 'নিরাপদ দূরত্ব বজায় রাখতে হবে');
  bn = bn.replace(/Negli incroci/gi, 'রাস্তার বিভিন্ন মোড়ে');
  bn = bn.replace(/è sempre consentito/gi, 'সবসময় অনুমতি আছে');
  bn = bn.replace(/non è consentito/gi, 'অনুমোদন নেই');
  bn = bn.replace(/dare la precedenza/gi, 'অগ্রাধিকার দিতে হবে');
  bn = bn.replace(/a chi proviene da destra/gi, 'ডান দিক থেকে আসা গাড়িকে');
  bn = bn.replace(/sulla carreggiata/gi, 'পাকা রাস্তার উপরে');
  bn = bn.replace(/in autostrada/gi, 'হাইওয়েতে');
  bn = bn.replace(/limite massimo di velocità/gi, 'সর্বোচ্চ গতিসীমা');
  bn = bn.replace(/per tutti i veicoli/gi, 'সকল যানবাহনের জন্য');
  bn = bn.replace(/corsia di emergenza/gi, 'জরুরি ইমার্জেন্সি লেইনে');
  return bn;
}

const roundQuestionsMap = {};
const all600Questions = [];

let qPointer = 0;
for (const round of ROUND_DEFS) {
  const roundQList = [];
  for (let i = 0; i < round.count; i++) {
    const raw = rawQuestions[qPointer % rawQuestions.length];
    qPointer++;

    const questionText = raw.question || '';
    const isTrue = raw.answer === 1;
    const explanation = isTrue
      ? 'সঠিক (VERO)! ইতালির অফিশিয়াল ট্রাফিক কোড (Codice della Strada) অনুযায়ী এই বক্তব্যটি শতভাগ আইনসম্মত ও সত্য।'
      : 'ভুল (FALSO)! ইতালির সরকারি ট্রাফিক বিধিমালার সাথে এই বক্তব্যটি সাংঘর্ষিক এবং পরীক্ষায় এটি ভুল উত্তর।';

    const trapTip = findTrapTip(questionText);
    const vocab = extractVocabulary(questionText);
    const qBn = generateBanglaTranslation(questionText);

    const questionObj = {
      id: `r${round.id}_q${i + 1}`,
      chapterId: `ch_${raw.id_chapter || round.id}`,
      chapterTitleIt: round.titleIt.split(': ')[1],
      chapterTitleBn: round.titleBn,
      questionIt: questionText,
      questionBn: qBn,
      isCorrect: isTrue,
      explanationBn: explanation,
      image: raw.image > 0 ? raw.image : undefined,
      vocabulary: vocab,
      roundId: round.id,
      ...(trapTip ? { trapTipBn: trapTip } : {})
    };

    roundQList.push(questionObj);
    all600Questions.push(questionObj);
  }
  roundQuestionsMap[round.id] = roundQList;
}

console.log(`Generated ${all600Questions.length} questions across 20 rounds.`);

const code = `// Auto-generated 600 official ministerial questions pool for Rounds 1 to 20
import type { QuizQuestion } from './quizData';

export interface ExtendedQuizQuestion extends QuizQuestion {
  roundId?: number;
}

export const ROUND_QUESTIONS: Record<number, ExtendedQuizQuestion[]> = ${JSON.stringify(roundQuestionsMap, null, 2)};

export const ALL_200_QUESTIONS: ExtendedQuizQuestion[] = ${JSON.stringify(all600Questions, null, 2)};

export const getQuestionsForRound = (roundId: number): ExtendedQuizQuestion[] => {
  return ROUND_QUESTIONS[roundId] || ROUND_QUESTIONS[1] || [];
};
`;

fs.writeFileSync('src/data/roundQuestions.ts', code);
console.log('Successfully wrote src/data/roundQuestions.ts with 20 full free rounds (600 official questions)!');
