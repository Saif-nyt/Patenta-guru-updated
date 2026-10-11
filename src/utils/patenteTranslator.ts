// Intelligent Italian-to-Bangla translator for Patente B Ministerial Questions

// Dictionary of Italian Patente terms and phrases to Bengali
export const PHRASE_DICTIONARY: Array<[RegExp, string]> = [
  // Signal starters
  [/^Il segnale raffigurato preannuncia una fermata di autobus/i, 'ছবিতে প্রদর্শিত সংকেতটি একটি বাস স্টপের পূর্বাভাস দেয়'],
  [/^Il segnale raffigurato indica la fermata di un autobus/i, 'ছবিতে প্রদর্শিত সংকেতটি একটি বাস স্টপ নির্দেশ করে'],
  [/^Il segnale raffigurato è un segnale di preavviso di direzione obbligatoria/i, 'ছবিতে প্রদর্শিত সংকেতটি বাধ্যতামূলক দিক নির্দেশনার অগ্রিম সংকেত'],
  [/^Il segnale raffigurato indica la fine di una pista ciclabile/i, 'ছবিতে প্রদর্শিত সংকেতটি সাইকেল লেনের সমাপ্তি নির্দেশ করে'],
  [/^Il segnale raffigurato indica una zona a traffico limitato/i, 'ছবিতে প্রদর্শিত সংকেতটি সীমিত ট্রাফিক জোন (ZTL) নির্দেশ করে'],
  [/^Il segnale raffigurato preannuncia un pericolo/i, 'ছবিতে প্রদর্শিত সংকেতটি একটি বিপদের পূর্বাভাস দেয়'],
  [/^Il segnale raffigurato vieta il transito/i, 'ছবিতে প্রদর্শিত সংকেতটি চলাচল নিষিদ্ধ করে'],
  [/^Il segnale raffigurato obbliga ad arrestarsi/i, 'ছবিতে প্রদর্শিত সংকেতটি সম্পূর্ণ গাড়ি থামাতে বাধ্য করে'],
  [/^Il segnale raffigurato consente di svoltare/i, 'ছবিতে প্রদর্শিত সংকেতটি মোড় নেওয়ার অনুমতি দেয়'],
  [/^Il segnale raffigurato è un segnale di/i, 'ছবিতে প্রদর্শিত সংকেতটি হলো একটি'],
  [/^Il segnale raffigurato preannuncia/i, 'ছবিতে প্রদর্শিত সংকেতটি পূর্বাভাস দেয়:'],
  [/^Il segnale raffigurato indica/i, 'ছবিতে প্রদর্শিত সংকেতটি নির্দেশ করে:'],
  [/^Il segnale raffigurato vieta/i, 'ছবিতে প্রদর্শিত সংকেতটি নিষেধ করে:'],
  [/^Il segnale raffigurato obbliga/i, 'ছবিতে প্রদর্শিত সংকেতটি বাধ্য করে:'],
  [/^Il segnale raffigurato consente/i, 'ছবিতে প্রদর্শিত সংকেতটি অনুমতি দেয়:'],
  [/^In presenza del segnale raffigurato è obbligatorio/i, 'ছবিতে প্রদর্শিত সংকেত থাকলে বাধ্যতামূলক:'],
  [/^In presenza del segnale raffigurato è consentito/i, 'ছবিতে প্রদর্শিত সংকেত থাকলে অনুমোদিত:'],
  [/^In presenza del segnale raffigurato è vietato/i, 'ছবিতে প্রদর্শিত সংকেত থাকলে নিষিদ্ধ:'],
  [/^In presenza del segnale raffigurato bisogna/i, 'ছবিতে প্রদর্শিত সংকেত থাকলে আবশ্যক:'],
  [/^In presenza del segnale raffigurato si deve/i, 'ছবিতে প্রদর্শিত সংকেত থাকলে অবশ্যই:'],

  // General rules
  [/^Non è obbligatorio soccorrere un ferito/i, 'আহত ব্যক্তিকে উদ্ধার করা বাধ্যতামূলক নয়'],
  [/^È obbligatorio soccorrere un ferito/i, 'সড়ক দুর্ঘটনায় আহত ব্যক্তিকে সহায়তা ও উদ্ধার করা বাধ্যতামূলক'],
  [/^È vietato sorpassare/i, 'ওভারটেক করা নিষিদ্ধ'],
  [/^È consentito il sorpasso/i, 'ওভারটেক করা অনুমোদিত'],
  [/^È vietata la sosta/i, 'পার্কিং (Sosta) করা নিষিদ্ধ'],
  [/^È vietata la fermata/i, 'সাময়িক থামা (Fermata) নিষিদ্ধ'],
  [/^È consentita la fermata/i, 'সাময়িক থামা (Fermata) অনুমোদিত'],
  [/^La carreggiata è destinata/i, 'ক্যারেজিয়াটা (Carreggiata / চলাচলের মূল সড়ক) নির্ধারিত:'],
  [/^La corsia di emergenza serve/i, 'জরুরি লেন (Corsia di emergenza) ব্যবহৃত হয়:'],
  [/^Sulle autostrade è vietato/i, 'অটোস্ত্রাদা বা হাইওয়েতে নিষিদ্ধ:'],
  [/^Sulle autostrade è consentito/i, 'অটোস্ত্রাদা বা হাইওয়েতে অনুমোদিত:'],
  [/^La distanza di sicurezza deve essere/i, 'নিরাপদ দূরত্ব অবশ্যই হতে হবে:'],
  [/^La distanza di sicurezza dipende/i, 'নিরাপদ দূরত্ব নির্ভর করে:'],
  [/^Il limite massimo di velocità/i, 'সর্বোচ্চ গতিসীমা:'],
  [/^Durante la marcia/i, 'গাড়ি চালানোর সময়:'],
  [/^Prima di iniziare il sorpasso/i, 'ওভারটেক শুরু করার পূর্বে:'],
  [/^Negli incroci/i, 'রাস্তার মোড়ে:'],
  [/^Nelle rotatorie/i, 'গোলচত্বরে (Rotatoria):'],
  [/^Nei passaggi a livello/i, 'রেল ক্রসিংয়ে:'],
  [/^I pedoni hanno la precedenza/i, 'পথচারীদের অগ্রাধিকার রয়েছে'],
  [/^Si deve dare la precedenza/i, 'অগ্রাধিকার দিতে হবে:'],
  [/^Il conducente deve/i, 'চালককে অবশ্যই:'],
  [/^Il casco deve essere/i, 'সুরক্ষা হেলমেট অবশ্যই:'],
  [/^Le cinture di sicurezza devono essere/i, 'সিটবেল্ট অবশ্যই:'],
  [/^L\'air-bag/i, 'এয়ারব্যাগ'],
];

// Term replacements
export const TERM_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bfermata di un autobus\b/gi, 'বাসের স্টপ (Fermata autobus)'],
  [/\bfermata dell'autobus\b/gi, 'বাসের স্টপ (Fermata autobus)'],
  [/\bpista ciclabile\b/gi, 'সাইকেল ট্র্যাক (Pista ciclabile)'],
  [/\battraversamento pedonale\b/gi, 'জেব্রা ক্রসিং (Attraversamento pedonale)'],
  [/\bpassaggio a livello con barriere\b/gi, 'ব্যারিয়ারযুক্ত রেল ক্রসিং'],
  [/\bpassaggio a livello senza barriere\b/gi, 'ব্যারিয়ারবিহীন রেল ক্রসিং'],
  [/\bpassaggio a livello\b/gi, 'রেল ক্রসিং (Passaggio a livello)'],
  [/\bsosta di emergenza\b/gi, 'জরুরি পার্কিং (Sosta di emergenza)'],
  [/\bcorsia di emergenza\b/gi, 'জরুরি লেন (Corsia di emergenza)'],
  [/\bcorsia di accelerazione\b/gi, 'গতি বাড়ানোর লেন (Corsia di accelerazione)'],
  [/\bcorsia di decelerazione\b/gi, 'গতি কমানোর লেন (Corsia di decelerazione)'],
  [/\bstrada sdrucciolevole\b/gi, 'পিচ্ছিল রাস্তা (Strada sdrucciolevole)'],
  [/\bdoppia curva pericolosa\b/gi, 'দ্বৈত বিপজ্জনক বাঁক (Doppia curva)'],
  [/\bcurva pericolosa\b/gi, 'বিপজ্জনক বাঁক (Curva pericolosa)'],
  [/\bdiscesa pericolosa\b/gi, 'খাড়া ঢালু রাস্তা (Discesa pericolosa)'],
  [/\bsalita ripida\b/gi, 'খাড়া চড়াই রাস্তা (Salita ripida)'],
  [/\bspazio di frenatura\b/gi, 'ব্রেকিং দূরত্ব (Spazio di frenatura)'],
  [/\btempo di reazione\b/gi, 'প্রতিক্রিয়া সময় (Tempo di reazione)'],
  [/\bdistanza di sicurezza\b/gi, 'নিরাপদ দূরত্ব (Distanza di sicurezza)'],
  [/\blimite massimo di velocità\b/gi, 'সর্বোচ্চ গতিসীমা'],
  [/\bcinture di sicurezza\b/gi, 'সিটবেল্ট (Cinture di sicurezza)'],
  [/\bcasco protettivo\b/gi, 'সুরক্ষা হেলমেট (Casco)'],
  [/\btasso alcolemico\b/gi, 'রক্তে অ্যালকোহলের মাত্রা'],
  [/\bneopatentati\b/gi, 'নতুন লাইসেন্সধারী চালক (প্রথম ৩ বছর)'],
  [/\bautostrada\b/gi, 'হাইওয়ে (Autostrada)'],
  [/\bstrade extraurbane principali\b/gi, 'প্রধান অতিরিক্ত নগর সড়ক (১১০ কিমি/ঘণ্টা)'],
  [/\bstrade extraurbane secondarie\b/gi, 'দ্বিতীয় শ্রেণির গ্রামীণ সড়ক (৯০ কিমি/ঘণ্টা)'],
  [/\bcarreggiata\b/gi, 'ক্যারেজিয়াটা (চলাচলের মূল পিচঢালা সড়ক)'],
  [/\bcorsia\b/gi, 'লেন (Corsia)'],
  [/\bbanchina\b/gi, 'বানকিনা (রাস্তার সাইডের কাঁধ)'],
  [/\bmarciapiede\b/gi, 'ফুটপাত (Marciapiede)'],
  [/\bisola di traffico\b/gi, 'ট্রাফিক চ্যানেল আইল্যান্ড'],
  [/\bsalvagente\b/gi, 'যাত্রী সুরক্ষা প্ল্যাটফর্ম (Salvagente)'],
  [/\brotatoria\b/gi, 'গোলচত্বর (Rotatoria)'],
  [/\bincrocio\b/gi, 'রাস্তার মোড় (Incrocio)'],
  [/\bdare la precedenza\b/gi, 'অগ্রাধিকার দেওয়া'],
  [/\bdiritto di precedenza\b/gi, 'অগ্রাধিকারের অধিকার'],
  [/\bsorpasso a destra\b/gi, 'ডান পাশ দিয়ে ওভারটেক'],
  [/\bsorpasso\b/gi, 'ওভারটেকিং'],
  [/\bfermata\b/gi, 'সাময়িক থামা'],
  [/\bsosta\b/gi, 'পার্কিং করা'],
  [/\barresto\b/gi, 'সম্পূর্ণ গাড়ি থামা'],
  [/\bobbligatorio\b/gi, 'বাধ্যতামূলক'],
  [/\bvietato\b/gi, 'নিষিদ্ধ'],
  [/\bconsentito\b/gi, 'অনুমোদিত'],
  [/\bsempre\b/gi, 'সবসময়'],
  [/\bmai\b/gi, 'কখনোই না'],
  [/\bsolo\b/gi, 'শুধুমাত্র'],
  [/\besclusivamente\b/gi, 'শুধুমাত্র ও বিশেষভাবে'],
];

import { PATENTE_TRANSLATIONS_BN } from '../data/patenteTranslationsBn';
import { PATENTE_TRANSLATIONS_EN } from '../data/patenteTranslationsEn';

/**
 * Checks whether text contains Bengali characters
 */
export const containsBengali = (text?: string): boolean => {
  if (!text) return false;
  return /[\u0980-\u09FF]/.test(text);
};

/**
 * Automatically polishes machine-translated phrases into natural, easily understandable Bengali.
 */
export const polishBengaliTranslation = (text: string): string => {
  if (!text) return '';
  let res = text;

  const POLISH_MAP: Array<[RegExp, string]> = [
    // Misleading geometric terms & intersection phrases
    [/ছেদটিতে,\s*যানবাহনগুলি নিম্নলিখিত ক্রমে ছেদটি পরিষ্কার করে/g, 'প্রদর্শিত চৌরাস্তায় যানবাহনগুলো এই ক্রমানুসারে মোড় পার হবে'],
    [/ছেদটি পরিষ্কার করে/g, 'মোড় অতিক্রম করে'],
    [/ছেদ পরিষ্কার করে/g, 'মোড় অতিক্রম করে'],
    [/ছেদটিতে/g, 'চৌরাস্তায়'],
    [/ছেদক্ষেত্রে/g, 'চৌরাস্তায়'],
    [/ছেদ-এ/g, 'চৌরাস্তায়'],
    [/ছেদটি/g, 'চৌরাস্তাটি'],
    [/ছেদের/g, 'চৌরাস্তার'],
    [/ছেদ অতিক্রম/g, 'চৌরাস্তা অতিক্রম'],
    [/ছেদ থেকে/g, 'চৌরাস্তা থেকে'],
    [/একটি ছেদ/g, 'একটি চৌরাস্তা বা মোড় (Incrocio)'],
    [/কোনো ছেদে/g, 'কোনো চৌরাস্তায় বা মোড়ে'],
    [/কাছাকাছি ছেদ/g, 'কাছাকাছি চৌরাস্তা'],
    [/ছেদ/g, 'চৌরাস্তা বা মোড়'],

    // Italian Patente technical terms made friendly
    [/পাবলিক সার্ভিস বাস স্টপের জন্য নির্ধারিত এলাকায় ফুটপাতে হলুদ বাস লেখা খুঁজে বের করা নিয়ন্ত্রক।/g, "পাবলিক বাস স্টপের জন্য নির্ধারিত স্থানে রাস্তার পিচের ওপর হলুদ রঙে 'BUS' লেখা থাকা আইনসম্মত ও নিয়মমাফিক।"],
    [/খুঁজে বের করা নিয়ন্ত্রক/g, 'থাকা আইনসম্মত ও নিয়মমাফিক'],
    [/সাইকেল চালকদের জন্য ফুটপাতে উৎসাহের একটি লেখা খুঁজে পাওয়া বাধ্যতামূলক/g, "সড়কের পিচের ওপর রেসিং সাইক্লিস্টদের উৎসাহ দেওয়ার স্লোগান লেখা থাকা আইনসম্মত ও ট্রাফিক কোড অনুযায়ী অনুমোদিত"],
    [/একটি স্টপ ইভেন্টে, যেখানে কোনও উঁচু ফুটপাথ নেই, চালককে অবশ্যই পথচারীদের ট্রানজিটের জন্য এক মিটারের কম জায়গা ছেড়ে দিতে হবে।/g, 'গাড়ি সাময়িক থামানোর ক্ষেত্রে যদি কোনো উঁচু ফুটপাথ না থাকে, তবে পথচারী চলাচলের জন্য কমপক্ষে এক মিটার জায়গা ছেড়ে দিতে হবে।'],
    [/একটি শক্তিশালী পার্শ্বীয় ঢাল সহ সড়কপথে অ্যাকুয়াপ্ল্যানিংয়ের ঘটনাটি বৃদ্ধি পায়/g, 'সড়কে পাশের ঢাল (Pendenza laterale) বেশি হলে অ্যাকুয়াপ্ল্যানিং (Aquaplaning / পানিতে চাকা পিছলে যাওয়া) হওয়ার ঝুঁকি বাড়ে'],
    [/প্রেসক্রিপশন সংকেত/g, 'বাধ্যতামূলক ও নিয়ন্ত্রণমূলক সংকেত (Segnale di prescrizione)'],
    [/প্রেসক্রিপশন/g, 'বাধ্যতামূলক নিয়ম বা সংকেত'],
    [/ক্যারেজওয়েতে/g, 'দ্বিমুখী মূল সড়কে (Carreggiata)'],
    [/ক্যারেজওয়ের/g, 'মূল সড়কের (Carreggiata)'],
    [/ক্যারেজওয়ে/g, 'চলাচলের মূল সড়ক (Carreggiata)'],
    [/ভ্রমণের সময়/g, 'গাড়ি চালানোর সময়'],
    [/ভ্রমণে বাধা/g, 'জরুরি বিরতি বা গাড়ি থামা (Sosta di emergenza)'],
    [/ভ্রমণের দিক উল্টাতে/g, 'গাড়ি ইউ-টার্ন নিয়ে উল্টো দিকে চালাতে (Inversione di marcia)'],
    [/ভ্রমণের দিক/g, 'চলাচলের দিক'],
    [/প্রচলন থাকাকালীন/g, 'গাড়ি চালানোর সময়'],
    [/প্রচলনে/g, 'চলাচলে'],
    [/একটি প্রসারিত রাস্তা/g, 'রাস্তার একটি অংশ'],
    [/রাস্তার প্রসারিত/g, 'সড়কের নির্দিষ্ট অংশ'],
    [/প্রসারিত রাস্তা/g, 'সড়কের অংশ'],
    [/অনিয়মিত ফুটপাথ/g, 'অমসৃণ বা ভাঙাচোরা রাস্তা (Pavimentazione irregolare)'],
    [/কম রশ্মির আলো/g, 'লো-বিম হেডলাইট (Luci anabbaglianti)'],
    [/উচ্চ রশ্মির আলো/g, 'হাই-বিম হেডলাইট (Luci abbaglianti)'],
    [/টায়ার এবং অ্যাসফল্টের মধ্যে গ্রিপ/g, 'টায়ার ও পিচঢালা রাস্তার গ্রিপ (ঘর্ষণ)'],
    [/টায়ার এবং অ্যাসফল্ট/g, 'টায়ার ও পিচঢালা রাস্তা'],
    [/আধা-বাধা এখনও উত্থাপিত/g, 'হাফ ব্যারিয়ারযুক্ত রেলগেট এখনও খোলা থাকলেও'],
    [/আধা-বাধা/g, 'হাফ ব্যারিয়ারযুক্ত রেলগেট (Semibarriera)'],
    [/লেভেল ক্রসিং/g, 'রেল ক্রসিং (Passaggio a livello)'],
    [/একটি ড্রাইভওয়ে/g, 'একটি ব্যক্তিগত প্রবেশপথ (Passo carrabile)'],
    [/ড্রাইভওয়ে/g, 'ব্যক্তিগত প্রবেশপথ (Passo carrabile)'],
    [/বিচ্ছিন্ন পার্শ্বীয় সাদা ডোরা/g, 'সড়কের পাশের ভাঙা সাদা দাগ (Striscia discontinua)'],
    [/সোজা চালিয়ে যাওয়ার বাধ্যবাধকতা/g, 'শুধুমাত্র সোজা এগিয়ে যাওয়ার নির্দেশ'],
    [/একটি লাল স্ট্রাইপ দ্বারা অতিক্রম করা হয়/g, 'একটি লাল দাগ দিয়ে কাটা থাকে'],
    [/বন্য প্রাণীদের সম্ভাব্য এবং আকস্মিক ক্রসিং ঘোষণা করে/g, 'হঠাৎ বন্য প্রাণী রাস্তা পার হওয়ার আশঙ্কার বিষয়ে সতর্ক করে'],
    [/পথের অধিকার রয়েছে/g, 'আগে যাওয়ার অগ্রাধিকার (Precedenza) রয়েছে'],
    [/পথের অধিকার/g, 'অগ্রাধিকার (Precedenza)'],
    [/উতরাই/g, 'নিচের দিকে ঢালু রাস্তা (Discesa)'],
    [/চড়াই/g, 'খাড়া উঁচু রাস্তা (Salita)'],
    [/কোয়াড্রিসাইকেল ছাড়া/g, 'চার চাকার হালকা মোটরযান (Quadricicli) ছাড়া'],
    [/কোয়াড্রিসাইকেল/g, 'চার চাকার ছোট যান (Quadricicli)'],
    [/স্বাভাবিক যাতায়াতের/g, 'স্বাভাবিক গাড়ি চলাচলের'],
    [/মোটর গাড়ি হল একটি মোটরযান/g, 'অটোভেইকেল (Autoveicolo) হলো একটি মোটরচালিত যান'],
    [/ট্র্যাক্টরের মতো একই নীতির সাথে/g, 'মূল টানাগাড়ির বীমা পলিসির আওতায়'],
    [/দেখানো বর্ণনাকারী একটি চক্র পথ থেকে রাস্তাকে বিভক্ত করে/g, 'প্রদর্শিত সাইড রিফ্লেক্টরটি সাইকেল লেন থেকে মূল সড়ককে আলাদা করে'],
    [/একটি বিপজ্জনক বক্ররেখা হাইলাইট করার জন্য চিত্রিত বর্ণনাকারী একাধিক উপাদানের সেটে রয়েছে/g, 'বিপজ্জনক বাঁক স্পষ্টভাবে নির্দেশ করতে প্রদর্শিত রিফ্লেক্টর বোর্ডগুলো (Delineatore) সারিবদ্ধভাবে বসানো থাকে'],
    [/চিত্রিত বর্ণনাকারী/g, 'প্রদর্শিত রিফ্লেক্টর প্যানেল (Delineatore)'],
    [/দেখানো বর্ণনাকারী/g, 'প্রদর্শিত রিফ্লেক্টর প্যানেল (Delineatore)'],
    [/বর্ণনাকারী/g, 'সড়ক নির্দেশক রিফ্লেক্টর প্যানেল (Delineatore)'],
    [/স্তব্ধ মাত্রা সহ/g, 'ফ্লাইওভার বা আন্ডারপাসযুক্ত ইন্টারসেকশনে (Livelli sfalsati)'],
    [/স্তব্ধ স্তরে/g, 'ফ্লাইওভার বা আন্ডারপাসযুক্ত ইন্টারসেকশনে'],
    [/একটি চক্র পথ থেকে/g, 'সাইকেল লেন থেকে'],
    [/চক্র পথ/g, 'সাইকেল লেন (Pista ciclabile)'],
    [/একটি বিপজ্জনক বক্ররেখা/g, 'একটি বিপজ্জনক বাঁক (Curva pericolosa)'],
    [/বিপজ্জনক বক্ররেখা/g, 'বিপজ্জনক বাঁক (Curva pericolosa)'],
    [/বক্ররেখার ব্যাসার্ধের সাথে/g, 'বাঁকের তীব্রতার (Raggio della curva) সাথে'],
    [/বক্ররেখার/g, 'বাঁকের (Curva)'],
    [/বক্ররেখা/g, 'রাস্তার বাঁক (Curva)'],
    [/প্রধান অতিরিক্ত-শহুরে সড়কে/g, 'প্রধান হাইওয়েতে (Strada extraurbana principale)'],
    [/প্রধান অতিরিক্ত-শহুরে রাস্তায়/g, 'প্রধান হাইওয়েতে (Strada extraurbana principale)'],
    [/প্রধান অতিরিক্ত-শহুরে/g, 'প্রধান হাইওয়ে (Strada extraurbana principale)'],
    [/অতিরিক্ত-শহুরে রাস্তায়/g, 'শহরের বাইরের হাইওয়েতে (Strada extraurbana)'],
    [/অতিরিক্ত-শহুরে রাস্তা/g, 'শহরের বাইরের হাইওয়ে (Strada extraurbana)'],
    [/অতিরিক্ত-শহুরে/g, 'শহরের বাইরের হাইওয়ে (Extraurbana)'],
    [/একটি পাহাড়ের উপর দিয়ে/g, 'উঁচু ঢাল বা ঢিবির ওপর দিয়ে (Dosso)'],
    [/পাহাড়ের উপর দিয়ে/g, 'উঁচু ঢাল বা ঢিবির ওপর দিয়ে (Dosso)'],
  ];

  for (const [pattern, replacement] of POLISH_MAP) {
    res = res.replace(pattern, replacement);
  }

  return res.trim();
};

/**
 * Normalizes text by removing typographic quotes, extra spaces, and standardizing casing
 */
const normalizeItalian = (text: string): string => {
  return (text || '')
    .replace(/[\u2018\u2019`']/g, "'")
    .replace(/[\u201C\u201D"]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
};

export interface BilingualKeywordRule {
  itKeyword: RegExp;
  itLabel: string;
  bnTargets: string[];
}

export const BILINGUAL_KEYWORD_RULES: BilingualKeywordRule[] = [
  // 1. Speeds, distances & braking dynamics
  {
    itKeyword: /\bspazio di frenatura\b/i,
    itLabel: 'Spazio di frenatura',
    bnTargets: ['ব্রেকিং দূরত্ব'],
  },
  {
    itKeyword: /\bspazio di arresto\b/i,
    itLabel: 'Spazio di arresto',
    bnTargets: ['সম্পূর্ণ থামার দূরত্ব', 'থামার দূরত্ব'],
  },
  {
    itKeyword: /\bspazio di reazione\b/i,
    itLabel: 'Spazio di reazione',
    bnTargets: ['প্রতিক্রিয়ার দূরত্ব', 'প্রতিক্রিয়া দূরত্ব'],
  },
  {
    itKeyword: /\btempo di reazione\b/i,
    itLabel: 'Tempo di reazione',
    bnTargets: ['প্রতিক্রিয়া সময়', 'প্রতিক্রিয়ার সময়'],
  },
  {
    itKeyword: /\bdistanza di sicurezza\b/i,
    itLabel: 'Distanza di sicurezza',
    bnTargets: ['নিরাপদ দূরত্ব'],
  },
  {
    itKeyword: /\blimite massimo di velocit[àa]\b/i,
    itLabel: 'Limite di velocità',
    bnTargets: ['সর্বোচ্চ গতিসীমা', 'সর্বোচ্চ গতি সীমা'],
  },

  // 2. Road slopes, curves & geometry
  {
    itKeyword: /\bdisces[ae]\b/i,
    itLabel: 'Discesa',
    bnTargets: ['নিচের দিকে ঢালু রাস্তা', 'নিচের দিকে ঢালু', 'ঢালু রাস্তা', 'ঢালু অংশে', 'ঢালু অংশ', 'ঢালু', 'উতরাই'],
  },
  {
    itKeyword: /\bsalit[ae]\b/i,
    itLabel: 'Salita',
    bnTargets: ['খাড়া চড়াই রাস্তা', 'খাড়া চড়াই', 'চড়াই রাস্তা', 'চড়াই অংশ', 'খাড়া চড়াই', 'চড়াই', 'চড়াই'],
  },
  {
    itKeyword: /\bdoss[oi]\b/i,
    itLabel: 'Dosso',
    bnTargets: ['উঁচু ঢাল বা ঢিবির', 'উঁচু ঢাল বা ঢিবি', 'উঁচু ঢাল', 'উঁচু ঢিবি', 'ডোসো', 'বাম্পার'],
  },
  {
    itKeyword: /\bcunett[ae]\b/i,
    itLabel: 'Cunetta',
    bnTargets: ['নিচু গর্ত বা নর্দমা', 'নিচু রাস্তা', 'কুনেত্তা'],
  },
  {
    itKeyword: /\bdoppia curva\b/i,
    itLabel: 'Doppia curva',
    bnTargets: ['দ্বৈত বিপজ্জনক বাঁক', 'দ্বৈত বাঁক', 'পরপর দুটি বাঁক'],
  },
  {
    itKeyword: /\bcurv[ae]\b(?!\s+pericolosa)/i,
    itLabel: 'Curva',
    bnTargets: ['বিপজ্জনক বাঁক', 'বাঁকের তীব্রতা', 'বাঁক'],
  },
  {
    itKeyword: /\bstrada sdrucciolevole\b/i,
    itLabel: 'Strada sdrucciolevole',
    bnTargets: ['পিচ্ছিল রাস্তা'],
  },
  {
    itKeyword: /\bsdrucciolevol[ei]\b/i,
    itLabel: 'Sdrucciolevole',
    bnTargets: ['পিচ্ছিল'],
  },
  {
    itKeyword: /\bstrada deformata\b/i,
    itLabel: 'Strada deformata',
    bnTargets: ['ভাঙাচোরা রাস্তা', 'অমসৃণ রাস্তা'],
  },
  {
    itKeyword: /\bgalleri[ae]\b/i,
    itLabel: 'Galleria',
    bnTargets: ['টানেল', 'সুরঙ্গ', 'সুড়ঙ্গ'],
  },

  // 3. Road infrastructure & elements (Compounds first)
  {
    itKeyword: /\bcorsia di emergenza\b/i,
    itLabel: 'Corsia di emergenza',
    bnTargets: ['জরুরি লেন'],
  },
  {
    itKeyword: /\bcorsia di accelerazione\b/i,
    itLabel: 'Corsia di accelerazione',
    bnTargets: ['গতি বাড়ানোর লেন'],
  },
  {
    itKeyword: /\bcorsia di decelerazione\b/i,
    itLabel: 'Corsia di decelerazione',
    bnTargets: ['গতি কমানোর লেন'],
  },
  {
    itKeyword: /\bcorsi[ae] di canalizzazione\b/i,
    itLabel: 'Corsie di canalizzazione',
    bnTargets: ['লেন বিভাজন এলাকা', 'লেন বিভাজন', 'ক্যানালাইজেশন লেন'],
  },
  {
    itKeyword: /\bcarreggiat[ae]\b/i,
    itLabel: 'Carreggiata',
    bnTargets: ['দ্বিমুখী মূল সড়ক', 'চলাচলের মূল সড়ক', 'মূল সড়ক', 'ক্যারেজিয়াটা', 'ক্যারেজওয়ে'],
  },
  {
    itKeyword: /\bcorsi[ae]\b(?!\s+di\s+(canalizzazione|emergenza|accelerazione|decelerazione))/i,
    itLabel: 'Corsia',
    bnTargets: ['লেন'],
  },
  {
    itKeyword: /\bbanchin[ae]\b/i,
    itLabel: 'Banchina',
    bnTargets: ['বানকিনা', 'রাস্তার সাইডের কাঁধ', 'রাস্তার কাঁধ'],
  },
  {
    itKeyword: /\bmarciapied[ei]\b/i,
    itLabel: 'Marciapiede',
    bnTargets: ['ফুটপাত'],
  },
  {
    itKeyword: /\bspartitraffico\b/i,
    itLabel: 'Spartitraffico',
    bnTargets: ['রোড ডিভাইডার', 'ট্রাফিক ডিভাইডার', 'ডিভাইডার'],
  },
  {
    itKeyword: /\bsalvagente\b/i,
    itLabel: 'Salvagente',
    bnTargets: ['যাত্রী সুরক্ষা প্ল্যাটফর্ম', 'সালভাজেন্তে'],
  },
  {
    itKeyword: /\bisola di traffico\b/i,
    itLabel: 'Isola di traffico',
    bnTargets: ['ট্রাফিক চ্যানেল আইল্যান্ড', 'ট্রাফিক আইল্যান্ড'],
  },
  {
    itKeyword: /\brotatori[ae]\b/i,
    itLabel: 'Rotatoria',
    bnTargets: ['গোলচত্বর', 'রাউন্ডঅ্যাবাউট'],
  },
  {
    itKeyword: /\bpassaggio a livello\b/i,
    itLabel: 'Passaggio a livello',
    bnTargets: ['ব্যারিয়ারযুক্ত রেল ক্রসিং', 'ব্যারিয়ারবিহীন রেল ক্রসিং', 'রেল ক্রসিং', 'লেভেল ক্রসিং'],
  },
  {
    itKeyword: /\bpasso carrabile\b/i,
    itLabel: 'Passo carrabile',
    bnTargets: ['ব্যক্তিগত প্রবেশপথ'],
  },
  {
    itKeyword: /\battraversamento pedonale\b/i,
    itLabel: 'Attraversamento pedonale',
    bnTargets: ['জেব্রা ক্রসিং', 'পথচারী পারাপার'],
  },
  {
    itKeyword: /\bpista ciclabile\b/i,
    itLabel: 'Pista ciclabile',
    bnTargets: ['সাইকেল লেন', 'সাইকেল ট্র্যাক'],
  },
  {
    itKeyword: /\bincroci[oi]\b/i,
    itLabel: 'Incrocio',
    bnTargets: ['চৌরাস্তায় বা মোড়', 'চৌরাস্তা বা মোড়', 'চৌরাস্তা', 'রাস্তার মোড়', 'মোড়'],
  },
  {
    itKeyword: /\bintersezion[ei]\b/i,
    itLabel: 'Intersezione',
    bnTargets: ['ইন্টারসেকশন'],
  },

  // 4. Maneuvers & driving actions
  {
    itKeyword: /\bsosta di emergenza\b/i,
    itLabel: 'Sosta di emergenza',
    bnTargets: ['জরুরি পার্কিং'],
  },
  {
    itKeyword: /\bsost[ae]\b(?!\s+di\s+emergenza)/i,
    itLabel: 'Sosta',
    bnTargets: ['পার্কিং করা', 'পার্কিং'],
  },
  {
    itKeyword: /\bfermat[ae]\b/i,
    itLabel: 'Fermata',
    bnTargets: ['সাময়িক থামা', 'বাস স্টপ'],
  },
  {
    itKeyword: /\barrest[oi]\b/i,
    itLabel: 'Arresto',
    bnTargets: ['সম্পূর্ণ গাড়ি থামা', 'গাড়ি সম্পূর্ণ থামানো', 'গাড়ি থামা'],
  },
  {
    itKeyword: /\binversione di marcia\b/i,
    itLabel: 'Inversione di marcia',
    bnTargets: ['ইউ-টার্ন নিয়ে উল্টো দিকে চালাতে', 'ইউ-টার্ন', 'উল্টো দিকে গাড়ি ঘোরানো'],
  },
  {
    itKeyword: /\bsorpass[oi]\b/i,
    itLabel: 'Sorpasso',
    bnTargets: ['ওভারটেকিং', 'ওভারটেক করার', 'ওভারটেক করতে', 'ওভারটেক করা', 'ওভারটেক'],
  },
  {
    itKeyword: /\bprecedenz[ae]\b/i,
    itLabel: 'Precedenza',
    bnTargets: ['অগ্রাধিকার দেওয়ার', 'অগ্রাধিকার দেওয়া', 'অগ্রাধিকার'],
  },
  {
    itKeyword: /\bsvolt[ae] a destra\b/i,
    itLabel: 'Svolta a destra',
    bnTargets: ['ডানদিকে মোড় নেওয়ার', 'ডানদিকে মোড় নিতে', 'ডানদিকে মোড়', 'ডানে মোড়'],
  },
  {
    itKeyword: /\bsvolt[ae] a sinistra\b/i,
    itLabel: 'Svolta a sinistra',
    bnTargets: ['বামদিকে মোড় নেওয়ার', 'বামদিকে মোড় নিতে', 'বামদিকে মোড়', 'বামে মোড়'],
  },
  {
    itKeyword: /\bsvolt[ae]\b(?!\s+a\s+(destra|sinistra))/i,
    itLabel: 'Svolta',
    bnTargets: ['মোড় নেওয়ার', 'মোড় নিতে', 'মোড় নেওয়া'],
  },

  // 5. Vehicle equipment, safety & conditions
  {
    itKeyword: /\bluci anabbaglianti\b|\banabbaglianti\b/i,
    itLabel: 'Anabbaglianti',
    bnTargets: ['লো-বিম হেডলাইট', 'লো-বিম লাইট', 'লো-বিম'],
  },
  {
    itKeyword: /\bluci abbaglianti\b|\babbaglianti\b/i,
    itLabel: 'Abbaglianti',
    bnTargets: ['হাই-বিম হেডলাইট', 'হাই-বিম লাইট', 'হাই-বিম'],
  },
  {
    itKeyword: /\bluci di posizione\b/i,
    itLabel: 'Luci di posizione',
    bnTargets: ['পজিশন লাইট'],
  },
  {
    itKeyword: /\bquattro frecce\b|\bsegnalazione luminosa di pericolo\b/i,
    itLabel: 'Quattro frecce',
    bnTargets: ['হ্যাজার্ড লাইট', 'ইমার্জেন্সি ফ্লাশার', 'ইমার্জেন্সি লাইট'],
  },
  {
    itKeyword: /\bcinture di sicurezza\b/i,
    itLabel: 'Cinture di sicurezza',
    bnTargets: ['সিটবেল্ট'],
  },
  {
    itKeyword: /\bcasco\b/i,
    itLabel: 'Casco',
    bnTargets: ['সুরক্ষা হেলমেট', 'হেলমেট'],
  },
  {
    itKeyword: /\bair-?bag\b/i,
    itLabel: 'Airbag',
    bnTargets: ['এয়ারব্যাগ'],
  },
  {
    itKeyword: /\bcatene da neve\b/i,
    itLabel: 'Catene da neve',
    bnTargets: ['বরফের চেইন', 'স্নো চেইন'],
  },
  {
    itKeyword: /\bpneumatic[oi]\b/i,
    itLabel: 'Pneumatici',
    bnTargets: ['টায়ার', 'টায়ার'],
  },
  {
    itKeyword: /\baquaplaning\b/i,
    itLabel: 'Aquaplaning',
    bnTargets: ['অ্যাকুয়াপ্ল্যানিং', 'পানিতে চাকা পিছলে যাওয়া'],
  },
  {
    itKeyword: /\bneopatentat[oi]\b/i,
    itLabel: 'Neopatentati',
    bnTargets: ['নতুন লাইসেন্সধারী চালক', 'নতুন লাইসেন্সধারী'],
  },
  {
    itKeyword: /\btasso alcolemico\b/i,
    itLabel: 'Tasso alcolemico',
    bnTargets: ['রক্তে অ্যালকোহলের মাত্রা', 'অ্যালকোহলের মাত্রা'],
  },
  {
    itKeyword: /\bspecchi[oi] retrovisore\b|\bspecchi retrovisori\b/i,
    itLabel: 'Specchio retrovisore',
    bnTargets: ['লুকিং গ্লাস', 'রিয়ারভিউ মিরর', 'রিয়ার-ভিউ আয়না'],
  },
  {
    itKeyword: /\bautostrad[ae]\b/i,
    itLabel: 'Autostrada',
    bnTargets: ['অটোস্ত্রাদা বা হাইওয়ে', 'অটোস্ত্রাদা', 'হাইওয়ে'],
  },
  {
    itKeyword: /\bstrad[ae] extraurban[ae] principal[ei]\b/i,
    itLabel: 'Strada extraurbana principale',
    bnTargets: ['প্রধান অতিরিক্ত নগর সড়ক', 'প্রধান হাইওয়ে'],
  },
  {
    itKeyword: /\bstrad[ae] extraurban[ae] secondari[ae]\b/i,
    itLabel: 'Strada extraurbana secondaria',
    bnTargets: ['দ্বিতীয় শ্রেণির গ্রামীণ সড়ক', 'দ্বিতীয় শ্রেণির হাইওয়ে'],
  },
  {
    itKeyword: /\bstrad[ae] extraurban[ae]\b(?!\s+(principale|secondaria))/i,
    itLabel: 'Strada extraurbana',
    bnTargets: ['শহরের বাইরের হাইওয়ে', 'শহরের বাইরের সড়ক'],
  },

  // 6. Common Trap keywords
  {
    itKeyword: /\besclusivamente\b/i,
    itLabel: 'Esclusivamente',
    bnTargets: ['শুধুমাত্র ও বিশেষভাবে', 'শুধুমাত্র'],
  },
  {
    itKeyword: /\bobbligatoriamente\b/i,
    itLabel: 'Obbligatoriamente',
    bnTargets: ['বাধ্যতামূলকভাবে'],
  },
  {
    itKeyword: /\bobbligatori[oi]\b/i,
    itLabel: 'Obbligatorio',
    bnTargets: ['বাধ্যতামূলক'],
  },
  {
    itKeyword: /\bvietat[oi]\b/i,
    itLabel: 'Vietato',
    bnTargets: ['নিষিদ্ধ'],
  },
  {
    itKeyword: /\bconsentit[oi]\b/i,
    itLabel: 'Consentito',
    bnTargets: ['অনুমোদিত'],
  },
];

/**
 * Enriches Bengali translation with bracketed Italian technical terms
 * e.g., "রাস্তা যদি নিচের দিকে ঢালু (Discesa) হয়, তবে ব্রেকিং দূরত্ব (Spazio di frenatura) বৃদ্ধি পায়"
 */
export const enrichBilingualKeywords = (bnText: string, itText: string): string => {
  if (!bnText || !itText) return bnText || '';

  let res = bnText;

  for (const rule of BILINGUAL_KEYWORD_RULES) {
    // 1. Verify Italian question actually features this keyword
    if (!rule.itKeyword.test(itText)) {
      continue;
    }

    // 2. Prevent duplicate annotations (e.g. avoid (Discesa) (Discesa))
    const escapedLabel = rule.itLabel.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    if (new RegExp('\\(' + escapedLabel + '\\)', 'i').test(res)) {
      continue;
    }

    // 3. Search and annotate the appropriate Bengali target word
    for (const target of rule.bnTargets) {
      const idx = res.indexOf(target);
      if (idx !== -1) {
        // Expand to include attached Bengali suffixes (e.g. চৌরাস্তায়, ফুটপাতে, পার্কিংয়ের)
        let endIdx = idx + target.length;
        while (endIdx < res.length && /[\u0980-\u09FF]/.test(res[endIdx])) {
          endIdx++;
        }

        // Ensure following token is not already an open bracket
        const afterTarget = res.slice(endIdx).trimStart();
        if (afterTarget.startsWith('(')) {
          break;
        }

        // Replace only the first occurrence cleanly
        res = res.slice(0, endIdx) + ` (${rule.itLabel})` + res.slice(endIdx);
        break; // Only annotate this term once per question
      }
    }
  }

  // Clean any accidental double spacing inside or before brackets
  res = res.replace(/\s+\(([^)]+)\)/g, ' ($1)');
  return res;
};

/**
 * Returns clean, guaranteed Bangla translation for any Patente Italian question,
 * automatically enriched with bilingual technical terms in brackets.
 */
export const getBanglaTranslation = (questionIt: string, rawQuestionBn?: string): string => {
  const cleanIt = (questionIt || '').trim();
  let bnResult = '';

  // 1. Check exact match in pre-compiled dictionary of all official questions
  if (PATENTE_TRANSLATIONS_BN[cleanIt]) {
    bnResult = polishBengaliTranslation(PATENTE_TRANSLATIONS_BN[cleanIt]);
  } else if (rawQuestionBn && containsBengali(rawQuestionBn) && rawQuestionBn.trim() !== cleanIt) {
    // 2. If rawQuestionBn has authentic Bengali and is not raw Italian, return it directly
    bnResult = polishBengaliTranslation(rawQuestionBn.trim());
  } else {
    // 3. Normalize punctuation / typographic quotes / whitespace and check dictionary again
    const normalizedTarget = normalizeItalian(cleanIt);
    let matched = false;
    for (const [dictIt, dictBn] of Object.entries(PATENTE_TRANSLATIONS_BN)) {
      if (normalizeItalian(dictIt) === normalizedTarget) {
        bnResult = polishBengaliTranslation(dictBn);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // 4. Pattern Match fallback for new dynamic questions
      for (const [pattern, banglaPrefix] of PHRASE_DICTIONARY) {
        if (pattern.test(cleanIt)) {
          bnResult = polishBengaliTranslation(banglaPrefix);
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      // 5. Clean default fallback: if raw Bengali is available use it, else synthesize from phrase dictionary or traffic term dictionary
      if (rawQuestionBn && containsBengali(rawQuestionBn) && !rawQuestionBn.includes('শীঘ্রই')) {
        bnResult = polishBengaliTranslation(rawQuestionBn.trim());
      } else {
        // Synthesize meaning by translating known driving keywords
        let synth = cleanIt;
        for (const [pattern, bnMeaning] of TERM_REPLACEMENTS) {
          synth = synth.replace(pattern, ` ${bnMeaning} `);
        }
        bnResult = polishBengaliTranslation(synth.trim());
      }
    }
  }

  // 6. Enrich with Italian technical terms in brackets
  return enrichBilingualKeywords(bnResult, cleanIt);
};

/**
  * Retrieves official English translation for any Italian question
  */
export const getEnglishTranslation = (questionIt: string, fallbackEn?: string): string => {
  if (fallbackEn && fallbackEn.trim().length > 3) {
    return fallbackEn.trim();
  }
  const clean = (questionIt || '').trim();
  if (PATENTE_TRANSLATIONS_EN[clean]) {
    return PATENTE_TRANSLATIONS_EN[clean];
  }
  // Try case-insensitive / trimmed lookup
  const lower = clean.toLowerCase();
  for (const [key, val] of Object.entries(PATENTE_TRANSLATIONS_EN)) {
    if (key.toLowerCase() === lower) {
      return val;
    }
  }
  return '';
};


