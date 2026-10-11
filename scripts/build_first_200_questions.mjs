import fs from 'fs';
import path from 'path';

// 1. Load official raw data
const rawQuestions = JSON.parse(fs.readFileSync('scripts/raw_questions.json', 'utf8'));
const rawChapters = JSON.parse(fs.readFileSync('scripts/raw_chapters.json', 'utf8'));

console.log(`Loaded ${rawQuestions.length} official questions and ${rawChapters.length} chapters.`);

// Chapter definitions mapping
const CHAPTER_META = {
  1: { id: 'definizioni', it: 'Definizioni stradali e di traffico', bn: 'রাস্তার সংজ্ঞা ও ট্রাফিকের নিয়ম' },
  2: { id: 'pericolo', it: 'Segnali di pericolo', bn: 'বিপদজনক ট্রাফিক সংকেত' },
  3: { id: 'divieto', it: 'Segnali di divieto', bn: 'নিষেধাজ্ঞামূলক ট্রাফিক সংকেত' },
  4: { id: 'obbligo', it: 'Segnali di obbligo', bn: 'বাধ্যতামূলক ট্রাফিক সংকেত' },
  5: { id: 'precedenza', it: 'Segnali di precedenza', bn: 'অগ্রাধিকারের ট্রাফিক সংকেত' },
  6: { id: 'orizzontale', it: 'Segnaletica orizzontale', bn: 'রাস্তার ওপর আঁকা দাগ ও লাইন' },
  7: { id: 'semafori', it: 'Segnalazioni semaforiche', bn: 'ট্রাফিক লাইট ও পুলিশ সংকেত' },
  8: { id: 'indicazione', it: 'Segnali di indicazione', bn: 'তথ্য ও দিকনির্দেশক সংকেত' },
  10: { id: 'pannelli', it: 'Pannelli integrativi dei segnali', bn: 'অতিরিক্ত সম্পূরক ফলক' },
  11: { id: 'velocita', it: 'Limiti di velocità', bn: 'গতিসীমা ও গতি নিয়ন্ত্রণ' },
  12: { id: 'distanza', it: 'Distanza di sicurezza', bn: 'নিরাপদ দূরত্ব ও ব্রেকিং' },
  13: { id: 'norme_circolazione', it: 'Norme sulla circolazione dei veicoli', bn: 'গাড়ির অবস্থান ও চলাচল' },
  14: { id: 'incroci', it: 'Esempi di precedenza agli incroci', bn: 'রাস্তার মোড়ে অগ্রাধিকার ক্রম' },
  15: { id: 'sorpasso', it: 'Norme sul sorpasso', bn: 'ওভারটেকিংয়ের নিয়ম' },
  16: { id: 'sosta', it: 'Fermata, sosta, arresto e partenza', bn: 'পার্কিং, সাময়িক থামা ও স্টার্ট' },
  17: { id: 'autostrada', it: 'Ingombro della carreggiata e autostrada', bn: 'হাইওয়ে ও রাস্তা ব্যবহারের নিয়ম' },
  18: { id: 'luci', it: 'Uso delle luci e dispositivi', bn: 'হেডলাইট ও সতর্কবার্তা বাতি' },
  19: { id: 'cinture', it: 'Cinture di sicurezza e casco', bn: 'সিটবেল্ট, হেলমেট ও নিরাপত্তা' },
  20: { id: 'patenti', it: 'Patenti di guida e punti', bn: 'লাইসেন্স ও পয়েন্ট কাটা' },
  21: { id: 'incidenti', it: 'Comportamento in caso di incidente', bn: 'দুর্ঘটনা ও চালকের করণীয়' },
  22: { id: 'alcol_droga', it: 'Guida e condizioni psicofisiche (alcol e droga)', bn: 'অ্যালকোহল, ড্রাগস ও ফিটনেস' },
  23: { id: 'responsabilita', it: 'Responsabilità civile e penale, RCA', bn: 'আইনি দায়বদ্ধতা ও ইনস্যুরেন্স' },
  24: { id: 'inquinamento', it: 'Inquinamento ed ecoguida', bn: 'পরিবেশ রক্ষা ও জ্বালানি সাশ্রয়' },
  25: { id: 'veicolo_sicurezza', it: 'Elementi del veicolo e sicurezza', bn: 'গাড়ির ব্রেক, টায়ার ও যন্ত্রাংশ' },
};

// Common ministerial trap words dictionary
const TRAP_WORDS = [
  { it: 'in ogni caso', tip: 'সতর্ক থাকুন: "in ogni caso" (সর্বাবস্থায়) কথাটি থাকলে বেশিরভাগ ক্ষেত্রে প্রশ্নটি FALSO হয়, কারণ ট্রাফিক আইনে প্রায় সবসময়ই কিছু ব্যতিক্রম থাকে।' },
  { it: 'sempre', tip: '"Sempre" (সবসময়) শব্দযুক্ত প্রশ্নে সতর্ক থাকুন। সাধারণ নিয়মে কোনো ব্যতিক্রম থাকলে উত্তর FALSO হয়।' },
  { it: 'mai', tip: '"Mai" (কখনোই না) শব্দটি থাকলে খেয়াল করুন—কোনো পরিস্থিতিতে কি অনুমতি আছে? থাকলে উত্তর FALSO হবে।' },
  { it: 'obbliga in ogni caso ad arrestarsi', tip: 'থামার ক্ষেত্রে কেবল STOP চিহ্নে ফাঁকা থাকলেও সম্পূর্ণ থামা বাধ্যতামূলক। অন্যান্য চিহ্নে ফাঁকা থাকলে বাধ্যতামূলক নয়।' },
  { it: 'esclusivamente', tip: '"Esclusivamente" (একমাত্র/কেবলমাত্র) শব্দটি সাধারণ নিয়মকে অতি-সীমিত করে ফেলে, তাই সতর্ক থাকুন।' },
  { it: 'soltanto', tip: '"Soltanto" (শুধুমাত্র) ট্রাফিকের নিয়মে একটি পরিচিত ট্র্যাপ বা ফাঁদ শব্দ।' },
  { it: 'qualsiasi tipo', tip: '"Qualsiasi tipo" (যেকোনো ধরনের) যানবাহনের ওপর নিয়ম ঢালাওভাবে প্রযোজ্য হয় না।' },
];

// Vocabulary dictionary of core Italian driving terms
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
  'limite massimo': { it: 'Limite massimo', bn: 'সর্বোচ্চ সীমা' },
  'divieto': { it: 'Divieto', bn: 'নিষেধাজ্ঞা' },
  'obbligo': { it: 'Obbligo', bn: 'বাধ্যবাধকতা' },
  'pericolo': { it: 'Pericolo', bn: 'বিপদ / ঝুঁকি' },
  'autostrada': { it: 'Autostrada', bn: 'হাইওয়ে / মোটরওয়ে' },
  'centri abitati': { it: 'Centri abitati', bn: 'শহরাঞ্চল / লোকালয়' },
  'visibilità': { it: 'Visibilità', bn: 'দৃশ্যমানতা / দেখার পরিধি' },
  'veicolo': { it: 'Veicolo', bn: 'যানবাহন / গাড়ি' },
  'motocicli': { it: 'Motocicli', bn: 'মোটরসাইকেল' },
  'autovetture': { it: 'Autovetture', bn: 'ব্যক্তিগত প্রাইভেট কার' },
  'catene': { it: 'Catene da neve', bn: 'বরফের চেইনের টায়ার' },
  'cinture di sicurezza': { it: 'Cinture di sicurezza', bn: 'সিটবেল্ট' },
  'casco': { it: 'Casco', bn: 'হেলমেট' },
  'spazio di frenata': { it: 'Spazio di frenata', bn: 'ব্রেক করার পর গাড়ি থামার দূরত্ব' },
  'carico': { it: 'Carico', bn: 'গাড়িতে বহন করা মালামাল' },
  'rimorchio': { it: 'Rimorchio', bn: 'পেছনে টানা ট্রেলার' },
  'strada extraurbana': { it: 'Strada extraurbana', bn: 'শহরের বাইরের আঞ্চলিক সড়ক' },
};

function extractVocabulary(text) {
  const lower = text.toLowerCase();
  const vocabs = [];
  for (const [key, val] of Object.entries(VOCAB_MAP)) {
    if (lower.includes(key)) {
      vocabs.push({ wordIt: val.it, meaningBn: val.bn });
      if (vocabs.length >= 4) break;
    }
  }
  return vocabs;
}

function findTrapTip(text) {
  const lower = text.toLowerCase();
  for (const t of TRAP_WORDS) {
    if (lower.includes(t.it)) {
      return t.tip;
    }
  }
  return null;
}

console.log('Building round structure generator...');

