import fs from 'fs';
import path from 'path';

const rawQuestions = JSON.parse(fs.readFileSync('scripts/raw_questions.json', 'utf8'));

// Dictionaries for translation
const PHRASE_TRANSLATIONS = {
  "Il segnale raffigurato": "চিহ্নিত ট্রাফিক সংকেতটি",
  "Il segnale raffigurato preannuncia": "চিহ্নিত সংকেতটি পূর্বাভাস দেয় যে",
  "Il segnale raffigurato indica": "চিহ্নিত সংকেতটি নির্দেশ করে যে",
  "Il segnale raffigurato vieta": "চিহ্নিত সংকেতটি নিষিদ্ধ করে যে",
  "Il segnale raffigurato obbliga": "চিহ্নিত সংকেতটি বাধ্য করে যে",
  "In presenza del segnale raffigurato": "চিহ্নিত সাইনটির উপস্থিতিতে",
  "In presenza del segnale raffigurato è consentito": "চিহ্নিত সংকেতটি থাকলে অনুমতি রয়েছে",
  "In presenza del segnale raffigurato è vietato": "চিহ্নিত সংকেতটি থাকলে নিষিদ্ধ",
  "In presenza del segnale raffigurato bisogna": "চিহ্নিত সংকেতটি থাকলে অবশ্যই করণীয়",
  "In presenza del segnale raffigurato si deve": "চিহ্নিত সংকেতটি থাকলে চালককে করতে হবে",
  "è consentito": "অনুমোদিত",
  "è vietato": "নিষিদ্ধ",
  "è obbligatorio": "বাধ্যতামূলক",
  "dare la precedenza": "অগ্রাধিকার দেওয়া",
  "moderare la velocità": "গতি কমানো ও নিয়ন্ত্রণ করা",
  "arrestarsi": "সম্পূর্ণ গাড়ি থামানো",
  "arrestare la marcia": "গাড়ি চলাচল সম্পূর্ণ বন্ধ করা",
  "a chi proviene da destra": "ডান দিক থেকে আসা গাড়িকে",
  "a destra": "ডান দিকে",
  "a sinistra": "বাঁ দিকে",
  "in ogni caso": "সর্বাবস্থায় / প্রতিটি ক্ষেত্রে",
  "in tutte le ore": "সব সময় / ২৪ ঘণ্টা",
  "corsia di emergenza": "জরুরি লেইন (Emergency lane)",
  "strada extraurbana principale": "প্রধান আঞ্চলিক মহাসড়ক",
  "autostrada": "হাইওয়ে / মোটরওয়ে",
  "centri abitati": "শহরাঞ্চল / লোকালয়",
  "distanza di sicurezza": "নিরাপদ দূরত্ব",
  "limite massimo di velocità": "সর্বোচ্চ গতিসীমা",
  "curva pericolosa": "বিপদজনক বাঁক",
  "passaggio a livello": "রেললাইন ক্রসিং (Level Crossing)",
  "attraversamento pedonale": "পথচারী পারাপার / জেব্রাক্রসিং",
  "attraversamento ciclabile": "সাইকেল পারাপার পথ",
  "caduta massi": "পাহাড় থেকে পাথর পড়ার ঝুঁকি",
  "strada deformata": "ভাঙাচোরা ও অসমান রাস্তা",
  "dosso": "উঁচু ঢিবি / অন্ধ বাঁক (Dosso)",
  "cunetta": "নিচু গর্ত / জল নিষ্কাশন নালা (Cunetta)",
  "sorpasso": "ওভারটেকিং",
  "sosta": "পার্কিং (গাড়ি রেখে যাওয়া)",
  "fermata": "সাময়িক থামা (যাত্রী নামানো/ওঠানো)",
  "senso unico": "একমুখী রাস্তা (One-way)",
  "doppio senso di marcia": "উভয়মুখী চলাচল (Two-way)",
  "banchina": "রাস্তার পাশের মাটির কিনারা (Banchina)",
  "marciapiede": "ফুটপাত / পথচারীর হাঁটার পথ",
  "pista ciclabile": "সাইকেল চলাচলের নির্ধারিত লেন"
};

function translateQuestionToBengali(text, answer) {
  let bn = text;
  // Apply direct replacements
  for (const [it, tr] of Object.entries(PHRASE_TRANSLATIONS)) {
    if (bn.includes(it)) {
      bn = bn.split(it).join(tr);
    }
  }
  
  // Clean up remaining grammatical structures if needed
  if (bn === text) {
    // If no direct phrase matched, provide a structured transliteration
    bn = `ইতালিয়ান ট্রাফিক প্রশ্ন: ${text}`;
  }

  return bn;
}

function generateExplanation(questionIt, answer, chapterId) {
  const isVero = answer === 1;
  const lower = questionIt.toLowerCase();

  if (isVero) {
    if (lower.includes('150 metr')) {
      return 'সঠিক (VERO)! ইতালির ট্রাফিক কোড অনুযায়ী বিপদের সমস্ত ত্রিভুজ সংকেত সাধারণত ১৫০ মিটার আগেই বসানো থাকে যাতে চালক আগেই গতি কমাতে পারে।';
    }
    if (lower.includes('destra')) {
      return 'সঠিক (VERO)! সাধারণ নিয়ম হলো বিশেষ কোনো সাইন না থাকলে সবসময় ডান দিক থেকে আসা গাড়িকে অগ্রাধিকার (Precedenza) দিতে হবে।';
    }
    if (lower.includes('stop')) {
      return 'সঠিক (VERO)! স্টপ (STOP) সাইন দেখলে রাস্তা সম্পূর্ণ ফাঁকা থাকলেও প্রতি ক্ষেত্রে অবশ্যই সম্পূর্ণ গাড়ি থামাতে হবে।';
    }
    if (lower.includes('moderare la velocità') || lower.includes('rallentare')) {
      return 'সঠিক (VERO)! যেকোনো বিপদ সংকেত বা মোড় দেখলে গতি কমানো (Moderare la velocità) এবং গাড়ি নিয়ন্ত্রণে রাখা বাধ্যতামূলক।';
    }
    if (lower.includes('distanza di sicurezza')) {
      return 'সঠিক (VERO)! সামনের গাড়ির গতি, আবহাওয়া ও ব্রেকিং দূরত্বের ওপর ভিত্তি করে নিরাপদ দূরত্ব বজায় রাখা বাধ্যতামূলক।';
    }
    return 'সঠিক (VERO)! ইতালির ট্রাফিক কোড (Codice della Strada) অনুযায়ী এই নিয়মটি সম্পূর্ণ সত্য ও আইনসম্মত।';
  } else {
    if (lower.includes('in ogni caso') || lower.includes('sempre')) {
      return 'ভুল (FALSO)! এখানে "in ogni caso" বা "sempre" বলা হয়েছে, কিন্তু ট্রাফিক আইনে এতে বিশেষ ব্যতিক্রম রয়েছে।';
    }
    if (lower.includes('vieta il transito')) {
      return 'ভুল (FALSO)! বিপদ সংকেত (Pericolo) শুধু চালককে সাবধান করে, এটি যানবাহন চলাচল সম্পূর্ণ নিষিদ্ধ করে না।';
    }
    if (lower.includes('corsia di emergenza')) {
      return 'ভুল (FALSO)! জরুরি লেইন (Corsia di emergenza) শুধুমাত্র গাড়ি বিকল হলে বা গুরুতর অসুস্থতার ক্ষেত্রে সাময়িক ব্যবহারের জন্য, সাধারণ চলাচলের জন্য নয়।';
    }
    if (lower.includes('sostare')) {
      return 'ভুল (FALSO)! বাঁকে, ক্রসিংয়ে, রেললাইনে এবং মোড়ে গাড়ি পার্কিং (Sosta) করা কঠোরভাবে নিষিদ্ধ।';
    }
    return 'ভুল (FALSO)! ইতালির সরকারি ট্রাফিক বিধিমালার সাথে এই বক্তব্যটি সাংঘর্ষিক এবং ভুল।';
  }
}

function generateTrapTip(questionIt, answer) {
  const lower = questionIt.toLowerCase();
  if (lower.includes('in ogni caso')) {
    return 'পরীক্ষার গোপন ট্রিক: যখনই প্রশ্নে "in ogni caso" (সর্বাবস্থায়) দেখবেন, ৯০% ক্ষেত্রে তা FALSO হয়। সতর্কভাবে পড়ুন!';
  }
  if (lower.includes('sempre')) {
    return 'টিপস: "Sempre" (সবসময়) শব্দযুক্ত প্রশ্নের বেশিরভাগই ভুল হয়ে থাকে, কারণ ট্রাফিক নিয়মে প্রায় সবসময়ই কিছু ব্যতিক্রম থাকে।';
  }
  if (lower.includes('soltanto') || lower.includes('esclusivamente')) {
    return 'টিপস: "Soltanto" বা "Esclusivamente" (শুধুমাত্র) থাকলে সতর্ক হোন—নিয়মটি কি অন্য গাড়ির ক্ষেত্রেও প্রযোজ্য?';
  }
  if (lower.includes('stop')) {
    return 'মনে রাখবেন: STOP চিহ্নে ফাঁকা থাকলেও চাকা সম্পূর্ণ থামাতে হবে। কিন্তু DARE PRECEDENZA চিহ্নে ফাঁকা থাকলে না থেমেও যাওয়া যায়।';
  }
  return null;
}

function extractVocab(questionIt) {
  const lower = questionIt.toLowerCase();
  const list = [];
  const dict = [
    { it: 'Precedenza', bn: 'অগ্রাধিকার / আগে যাওয়ার নিয়ম' },
    { it: 'Arrestarsi', bn: 'সম্পূর্ণ গাড়ি থামানো' },
    { it: 'Sosta', bn: 'পার্কিং (চালক দূরে যাওয়া)' },
    { it: 'Fermata', bn: 'সাময়িক থামা (যাত্রী ওঠানো)' },
    { it: 'Sorpasso', bn: 'ওভারটেক করা' },
    { it: 'Carreggiata', bn: 'মূল পাকা সড়ক' },
    { it: 'Corsia', bn: 'লেইন' },
    { it: 'Incrocio', bn: 'রাস্তার মোড়' },
    { it: 'Velocità', bn: 'গতিসীমা' },
    { it: 'Distanza', bn: 'নিরাপদ দূরত্ব' },
    { it: 'Visibilità', bn: 'দৃশ্যমানতা' },
    { it: 'Pedoni', bn: 'পথচারী' },
  ];
  for (const item of dict) {
    if (lower.includes(item.it.toLowerCase())) {
      list.push({ wordIt: item.it, meaningBn: item.bn });
      if (list.length >= 3) break;
    }
  }
  return list;
}

function pickBalanced(list, count) {
  const veros = list.filter(q => q.answer === 1);
  const falsos = list.filter(q => q.answer === 0);
  const half = Math.floor(count / 2);
  const selected = [];
  
  for (let i = 0; i < half && i < veros.length; i++) selected.push(veros[i]);
  const needed = count - selected.length;
  for (let i = 0; i < needed && i < falsos.length; i++) selected.push(falsos[i]);
  
  return selected.sort(() => Math.random() - 0.5);
}

// Chapter groups
const ch1 = rawQuestions.filter(q => q.id_chapter === 1);
const ch2 = rawQuestions.filter(q => q.id_chapter === 2);
const ch3 = rawQuestions.filter(q => q.id_chapter === 3);
const ch4 = rawQuestions.filter(q => q.id_chapter === 4);
const ch5 = rawQuestions.filter(q => q.id_chapter === 5);
const ch6 = rawQuestions.filter(q => q.id_chapter === 6);
const ch7 = rawQuestions.filter(q => q.id_chapter === 7);
const ch11 = rawQuestions.filter(q => q.id_chapter === 11);
const ch12 = rawQuestions.filter(q => q.id_chapter === 12);
const ch14 = rawQuestions.filter(q => q.id_chapter === 14);
const ch15 = rawQuestions.filter(q => q.id_chapter === 15);
const ch16 = rawQuestions.filter(q => q.id_chapter === 16);

const roundsConfig = [
  { roundId: 1, titleBn: 'রাউন্ড ১: বিপদজনক ট্রাফিক সংকেত', titleIt: 'Segnali di Pericolo Base', questions: pickBalanced(ch2, 30) },
  { roundId: 2, titleBn: 'রাউন্ড ২: স্টপ ও ডানদিকের অগ্রাধিকার', titleIt: 'Precedenze e STOP', questions: pickBalanced([...ch5, ...ch14], 30) },
  { roundId: 3, titleBn: 'রাউন্ড ৩: গতিসীমা ও ব্রেকিং দূরত্ব', titleIt: 'Velocità e Frenata', questions: pickBalanced([...ch11, ...ch12], 30) },
  { roundId: 4, titleBn: 'রাউন্ড ৪: পার্কিং ও সাময়িক থামা', titleIt: 'Sosta e Fermata', questions: pickBalanced([...ch15, ...ch16], 30) },
  { roundId: 5, titleBn: 'রাউন্ড ৫: ওভারটেকিং ও বাধ্যতামূলক সংকেত', titleIt: 'Divieti e Obblighi', questions: pickBalanced([...ch3, ...ch4], 30) },
  { roundId: 6, titleBn: 'রাউন্ড ৬: রাস্তার দাগ ও ট্রাফিক লাইট', titleIt: 'Segnaletica Orizzontale e Semafori', questions: pickBalanced([...ch1, ...ch6, ...ch7], 30) },
  { roundId: 7, titleBn: 'রাউন্ড ৭: ফ্রি ট্রায়াল ফাইনাল মক টেস্ট', titleIt: 'Test di Sbarramento Finale', questions: pickBalanced([...ch2, ...ch5, ...ch11, ...ch16, ...ch3], 20) },
];

const allProcessedQuestions = [];
const roundMap = {};

for (const rc of roundsConfig) {
  const roundQuestions = [];
  rc.questions.forEach((rawQ, idx) => {
    const qId = `r${rc.roundId}_q${idx + 1}`;
    const questionBn = translateQuestionToBengali(rawQ.question, rawQ.answer);
    const explanationBn = generateExplanation(rawQ.question, rawQ.answer, rawQ.id_chapter);
    const trapTipBn = generateTrapTip(rawQ.question, rawQ.answer);
    const vocab = extractVocab(rawQ.question);

    const questionObj = {
      id: qId,
      chapterId: `ch_${rawQ.id_chapter}`,
      chapterTitleIt: rc.titleIt,
      chapterTitleBn: rc.titleBn,
      questionIt: rawQ.question,
      questionBn: questionBn,
      isCorrect: rawQ.answer === 1,
      explanationBn: explanationBn,
      trapTipBn: trapTipBn || undefined,
      image: rawQ.image !== 0 ? rawQ.image : undefined,
      vocabulary: vocab,
      roundId: rc.roundId,
    };

    roundQuestions.push(questionObj);
    allProcessedQuestions.push(questionObj);
  });
  roundMap[rc.roundId] = roundQuestions;
}

console.log(`Generated ${allProcessedQuestions.length} total enriched questions across ${roundsConfig.length} rounds.`);

// Generate roundQuestions.ts file
const fileContent = `// Auto-generated 200 official ministerial questions pool for Rounds 1 to 7
import type { QuizQuestion } from './quizData';

export interface ExtendedQuizQuestion extends QuizQuestion {
  roundId?: number;
}

export const ROUND_QUESTIONS: Record<number, ExtendedQuizQuestion[]> = ${JSON.stringify(roundMap, null, 2)};

export const ALL_200_QUESTIONS: ExtendedQuizQuestion[] = ${JSON.stringify(allProcessedQuestions, null, 2)};

export const getQuestionsForRound = (roundId: number): ExtendedQuizQuestion[] => {
  return ROUND_QUESTIONS[roundId] || ROUND_QUESTIONS[1] || [];
};
`;

const outputPath = path.resolve('src/data/roundQuestions.ts');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log(`✅ Saved ${allProcessedQuestions.length} questions into ${outputPath}!`);

