export interface VocabularyItem {
  wordIt: string;
  meaningBn: string;
}

export interface QuizQuestion {
  id: string;
  chapterId: string;
  chapterTitleIt: string;
  chapterTitleBn: string;
  questionIt: string;
  questionBn: string;
  questionEn?: string;
  isCorrect: boolean; // true = VERO, false = FALSO
  explanationBn: string;
  trapTipBn?: string;
  signType?: 'danger' | 'priority' | 'prohibition' | 'obligation' | 'indication';
  signSymbol?: string;
  signCode?: string;
  image?: number | string;
  vocabulary: VocabularyItem[];
}

export interface Chapter {
  id: string;
  titleIt: string;
  titleBn: string;
  icon: string;
  descriptionBn: string;
  questionCount: number;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'precedenza',
    titleIt: 'Precedenze e Incroci',
    titleBn: 'অগ্রাধিকার ও রাস্তার মোড় (Precedenza)',
    icon: 'CornerDownRight',
    descriptionBn: 'ডান দিকের অগ্রাধিকার নিয়ম (Regola della destra), ট্রাফিক মোড়ে কোন গাড়ি আগে যাবে এবং স্টপ চিহ্নের নিয়ম।',
    questionCount: 8,
  },
  {
    id: 'segnali-pericolo',
    titleIt: 'Segnali di Pericolo',
    titleBn: 'বিপদজনক ট্রাফিক সংকেত (Segnali di Pericolo)',
    icon: 'AlertTriangle',
    descriptionBn: '১৫০ মিটার আগের ত্রিভুজাকার বিপদ সংকেত, খাড়া ঢাল, বাঁক এবং পথচারী পারাপার।',
    questionCount: 8,
  },
  {
    id: 'velocita-distanza',
    titleIt: 'Velocità e Distanza di Sicurezza',
    titleBn: 'গতিসীমা ও নিরাপদ দূরত্ব (Velocità e Distanza)',
    icon: 'Gauge',
    descriptionBn: 'শহরে ও হাইওয়েতে গতিসীমা, ব্রেকিং দূরত্ব এবং আবহাওয়ার প্রভাবে গতি নিয়ন্ত্রণ।',
    questionCount: 6,
  },
  {
    id: 'sosta-fermata',
    titleIt: 'Sosta, Fermata e Arresto',
    titleBn: 'পার্কিং ও সাময়িক থামা (Sosta e Fermata)',
    icon: 'SquareParking',
    descriptionBn: 'সোস্তা (Sosta) ও ফেরমাতা (Fermata)-র মধ্যে আসল পার্থক্য এবং কোথায় পার্কিং সম্পূর্ণ নিষিদ্ধ।',
    questionCount: 6,
  },
  {
    id: 'sorpasso',
    titleIt: 'Norme sul Sorpasso',
    titleBn: 'ওভারটেকিংয়ের নিয়ম (Norme sul Sorpasso)',
    icon: 'ChevronsRight',
    descriptionBn: 'কখন বাঁ দিক দিয়ে ওভারটেক করা যায়, কখন ওভারটেকিং সম্পূর্ণ নিষিদ্ধ (বাঁকে, রেললাইনে, জেব্রাক্রসিংয়ে)।',
    questionCount: 6,
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- PRECEDENZE & INCROCI ---
  {
    id: 'prec-01',
    chapterId: 'precedenza',
    chapterTitleIt: 'Precedenze e Incroci',
    chapterTitleBn: 'অগ্রাধিকার ও রাস্তার মোড়',
    questionIt: 'Negli incroci, in assenza di segnali specifici, la regola generale è dare la precedenza a chi proviene da destra.',
    questionBn: 'কোনো নির্দিষ্ট ট্রাফিক সাইন না থাকলে, রাস্তার মোড়ে সাধারণ নিয়ম হলো ডান দিক থেকে আসা গাড়িকে অগ্রাধিকার দেওয়া।',
    isCorrect: true,
    explanationBn: 'ইতালির ট্রাফিক আইনের সাধারণ নিয়ম (Art. 145 C.d.S.): যদি কোনো স্টপ বা অগ্রাধিকারের সাইন না থাকে, তবে সবসময় ডান দিক (Destra) থেকে আসা গাড়িকে আগে যেতে দিতে হবে।',
    trapTipBn: 'সবসময় মনে রাখবেন: "Norma generale = precedenza a destra". এটি একদম সত্য।',
    signType: 'priority',
    signCode: 'intersezione_destra',
    vocabulary: [
      { wordIt: 'Incrocio', meaningBn: 'রাস্তার মোড় / চৌরাস্তা' },
      { wordIt: 'In assenza di', meaningBn: 'অনুপস্থিতিতে / না থাকলে' },
      { wordIt: 'Dare la precedenza', meaningBn: 'অগ্রাধিকার দেওয়া / আগে যেতে দেওয়া' },
      { wordIt: 'Destra', meaningBn: 'ডান দিক' }
    ]
  },
  {
    id: 'prec-02',
    chapterId: 'precedenza',
    chapterTitleIt: 'Precedenze e Incroci',
    chapterTitleBn: 'অগ্রাধিকার ও রাস্তার মোড়',
    questionIt: 'Il segnale di STOP obbliga ad arrestarsi in ogni caso, anche quando non sopraggiungono altri veicoli.',
    questionBn: 'STOP (স্টপ) চিহ্ন দেখলে অন্য কোনো গাড়ি না আসলেও প্রতি ক্ষেত্রেই অবশ্যই সম্পূর্ণ গাড়ি থামাতে হবে।',
    isCorrect: true,
    explanationBn: 'স্টপ (STOP) চিহ্নে গাড়ি সম্পূর্ণ থামানো বাধ্যতামূলক (Arresto obbligatorio), রাস্তা সম্পূর্ণ ফাঁকা থাকলেও অন্তত ১ সেকেন্ড চাকা স্থির করতে হবে। শুধুমাত্র গতি কমালে জরিমানা হবে।',
    trapTipBn: 'অনেকে ভাবে ফাঁকা থাকলে না থামলেও চলে—না! স্টপ সাইনে গাড়ি সম্পূর্ণ থামা (Arrestarsi) বাধ্যতামূলক।',
    signType: 'obligation',
    signSymbol: '🛑 STOP',
    signCode: 'stop',
    vocabulary: [
      { wordIt: 'Obbliga', meaningBn: 'বাধ্য করে / বাধ্যতামূলক' },
      { wordIt: 'Arrestarsi', meaningBn: 'সম্পূর্ণ গাড়ি থামানো' },
      { wordIt: 'In ogni caso', meaningBn: 'প্রতিটি ক্ষেত্রে / সর্বাবস্থায়' },
      { wordIt: 'Sopraggiungono', meaningBn: 'এগিয়ে আসা / উপস্থিত হওয়া' }
    ]
  },
  {
    id: 'prec-03',
    chapterId: 'precedenza',
    chapterTitleIt: 'Precedenze e Incroci',
    chapterTitleBn: 'অগ্রাধিকার ও রাস্তার মোড়',
    questionIt: 'I veicoli che circolano su rotaie (come il tram) hanno sempre la precedenza, salvo diversa segnalazione.',
    questionBn: 'রেললাইনের ওপর চলা যানবাহন (যেমন ট্রাম) ভিন্ন কোনো সংকেত না থাকলে সবসময় অগ্রাধিকার পাবে।',
    isCorrect: true,
    explanationBn: 'ট্রাম বা রেলের গাড়ি ডান দিক বা বাঁ দিক যেদিক থেকেই আসুক না কেন, সাধারণ গাড়ির চেয়ে তাদের অগ্রাধিকার থাকে, কারণ তারা ট্র্যাকে চলে এবং সহজে ব্রেক করতে পারে না।',
    trapTipBn: 'ট্রাম সবসময় অগ্রাধিকার পায় যদি না ট্রাফিকের বিশেষ কোনো লাইট বা সাইন ট্রামকে থামার নির্দেশ দেয়।',
    signType: 'priority',
    signCode: 'tram',
    vocabulary: [
      { wordIt: 'Circolano su rotaie', meaningBn: 'রেললাইনের ওপর চলে' },
      { wordIt: 'Salvo diversa segnalazione', meaningBn: 'ভিন্ন সংকেত না থাকলে' },
      { wordIt: 'Tram', meaningBn: 'ট্রাম গাড়ি' }
    ]
  },
  {
    id: 'prec-04',
    chapterId: 'precedenza',
    chapterTitleIt: 'Precedenze e Incroci',
    chapterTitleBn: 'অগ্রাধিকার ও রাস্তার মোড়',
    questionIt: 'Il segnale di DARE PRECEDENZA obbliga sempre e comunque ad arrestare la marcia, anche se la strada è libera.',
    questionBn: 'DARE PRECEDENZA (উল্টো ত্রিভুজ) চিহ্ন রাস্তা ফাঁকা থাকলেও সবসময় গাড়ি সম্পূর্ণ থামাতে বাধ্য করে।',
    isCorrect: false,
    explanationBn: 'ভুল (FALSO)! "Dare Precedenza" চিহ্নে রাস্তা ফাঁকা থাকলে না থেমে সাবধানে চলে যাওয়া যায়। শুধুমাত্র STOP চিহ্নেই ফাঁকা থাকলেও সম্পূর্ণ থামতে হয়।',
    trapTipBn: 'শব্দটি খেয়াল করুন: "obbliga sempre ad arrestarsi". এটি FALSO, কারণ ফাঁকা থাকলে থামার বাধ্যবাধকতা নেই, শুধু গতি কমিয়ে দেখে যেতে হয়।',
    signType: 'priority',
    signSymbol: '▽ DARE PRECEDENZA',
    signCode: 'dare_precedenza',
    vocabulary: [
      { wordIt: 'Arrestare la marcia', meaningBn: 'গাড়ি চলাচল সম্পূর্ণ বন্ধ করা' },
      { wordIt: 'Strada libera', meaningBn: 'ফাঁকা রাস্তা' }
    ]
  },
  {
    id: 'prec-05',
    chapterId: 'precedenza',
    chapterTitleIt: 'Precedenze e Incroci',
    chapterTitleBn: 'অগ্রাধিকার ও রাস্তার মোড়',
    questionIt: 'Uscendo da una proprietà privata (es. un garage o cortile), si deve dare la precedenza a tutti i veicoli in transito sulla strada.',
    questionBn: 'ব্যক্তিগত জায়গা (যেমন গ্যারেজ বা বাড়ির উঠান) থেকে বের হওয়ার সময় রাস্তায় চলাচলকারী সব যানবাহনকে অগ্রাধিকার দিতে হবে।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! ব্যক্তিগত সম্পত্তি বা গ্যারেজ থেকে মূল সড়কে ওঠার সময় ডান বা বাঁ উভয় দিক থেকে আসা সমস্ত গাড়ি ও পথচারীকে আগে যেতে দিতে হবে।',
    signCode: 'dare_precedenza',
    vocabulary: [
      { wordIt: 'Proprietà privata', meaningBn: 'ব্যক্তিগত সম্পত্তি / গ্যারেজ' },
      { wordIt: 'In transito', meaningBn: 'চলাচলরত' },
      { wordIt: 'Uscendo', meaningBn: 'বের হওয়ার সময়' }
    ]
  },

  // --- SEGNALI DI PERICOLO ---
  {
    id: 'peric-01',
    chapterId: 'segnali-pericolo',
    chapterTitleIt: 'Segnali di Pericolo',
    chapterTitleBn: 'বিপদজনক ট্রাফিক চিহ্ন',
    questionIt: 'I segnali di pericolo vengono normalmente posti a 150 metri dal punto di inizio del pericolo.',
    questionBn: 'বিপদজনক সংকেতগুলো সাধারণত বিপদ শুরু হওয়ার ১৫০ মিটার আগে স্থাপন করা হয়।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! ইতালির ট্রাফিক আইনে সমস্ত ত্রিভুজাকার বিপদ সংকেত (Segnali di pericolo) সাধারণত বিপদের স্থান থেকে ১৫০ মিটার আগেই বসানো থাকে যাতে চালক আগেই গতি কমাতে পারে।',
    trapTipBn: 'মনে রাখবেন: স্ট্যান্ডার্ড দূরত্ব হলো ঠিক ১৫০ মিটার (150 metri)।',
    signType: 'danger',
    signSymbol: '⚠️ 150m',
    signCode: 'strada_deformata',
    vocabulary: [
      { wordIt: 'Segnali di pericolo', meaningBn: 'বিপদজনক সংকেত / চিহ্ন' },
      { wordIt: 'Posti a', meaningBn: 'স্থাপন করা হয়' },
      { wordIt: 'Punto di inizio', meaningBn: 'শুরুর স্থান' }
    ]
  },
  {
    id: 'peric-02',
    chapterId: 'segnali-pericolo',
    chapterTitleIt: 'Segnali di Pericolo',
    chapterTitleBn: 'বিপদজনক ট্রাফিক চিহ্ন',
    questionIt: 'In presenza del segnale STRADA DEFORMATA, è opportuno moderare la velocità per evitare danni alle sospensioni del veicolo.',
    questionBn: 'STRADA DEFORMATA (ভাঙাচোরা রাস্তা) চিহ্ন থাকলে গাড়ির সাসপেনশনের ক্ষতি এড়াতে গতি কমানো উচিত।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! রাস্তার পৃষ্ঠতল অসমান বা ভাঙাচোরা হলে গাড়ির নিয়ন্ত্রণ বজায় রাখতে এবং সাসপেনশন রক্ষা করতে গতি কমানো (Moderare la velocità) বাধ্যতামূলক।',
    signType: 'danger',
    signSymbol: '⚠️ STRADA DEFORMATA',
    signCode: 'strada_deformata',
    vocabulary: [
      { wordIt: 'Strada deformata', meaningBn: 'ভাঙাচোরা / অসমান রাস্তা' },
      { wordIt: 'Moderare la velocità', meaningBn: 'গতি কমানো / নিয়ন্ত্রণ করা' },
      { wordIt: 'Sospensioni', meaningBn: 'গাড়ির স্প্রিং / সাসপেনশন' }
    ]
  },
  {
    id: 'peric-03',
    chapterId: 'segnali-pericolo',
    chapterTitleIt: 'Segnali di Pericolo',
    chapterTitleBn: 'বিপদজনক ট্রাফিক চিহ্ন',
    questionIt: 'Il segnale di CURVA PERICOLOSA A DESTRA vieta sempre il transito ai motocicli.',
    questionBn: 'CURVA PERICOLOSA A DESTRA (ডান দিকে বিপদজনক বাঁক) চিহ্ন মোটরসাইকেল চলাচল সবসময় নিষিদ্ধ করে।',
    isCorrect: false,
    explanationBn: 'ভুল (FALSO)! বাঁকের সাইন শুধু সতর্ক করে যে সামনে বিপদজনক মোড় আছে। এটি কোনো গাড়ি বা মোটরসাইকেল চলাচল নিষিদ্ধ করে না।',
    trapTipBn: 'পরীক্ষায় যখনই কোনো বিপদ চিহ্নে "vieta il transito" (চলাচল নিষিদ্ধ করে) লেখা থাকবে, সতর্ক হোন—বিপদ সংকেত নিষিদ্ধ করে না, শুধু সাবধান করে!',
    signType: 'danger',
    signSymbol: '⚠️ CURVA A DESTRA',
    signCode: 'curva_destra',
    vocabulary: [
      { wordIt: 'Curva pericolosa', meaningBn: 'বিপদজনক বাঁক' },
      { wordIt: 'Vieta il transito', meaningBn: 'চলাচল নিষিদ্ধ করে' },
      { wordIt: 'Motocicli', meaningBn: 'মোটরসাইকেল' }
    ]
  },
  {
    id: 'peric-04',
    chapterId: 'segnali-pericolo',
    chapterTitleIt: 'Segnali di Pericolo',
    chapterTitleBn: 'বিপদজনক ট্রাফিক চিহ্ন',
    questionIt: 'In presenza del segnale ATTRAVERSAMENTO PEDONALE, bisogna essere pronti ad arrestarsi se vi sono pedoni che attraversano la carreggiata.',
    questionBn: 'ATTRAVERSAMENTO PEDONALE (জেব্রাক্রসিং সংকেত) থাকলে পথচারী রাস্তা পার হলে গাড়ি থামাতে প্রস্তুত থাকতে হবে।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! জেব্রাক্রসিং সাইন দেখলে গতি কমাতে হবে এবং পথচারী পারাপার হলে তাদেরকে অগ্রাধিকার দিয়ে সম্পূর্ণ থামতে হবে।',
    signType: 'danger',
    signSymbol: '⚠️ PEDONI',
    signCode: 'pedonale',
    vocabulary: [
      { wordIt: 'Attraversamento pedonale', meaningBn: 'পথচারী পারাপার / জেব্রাক্রসিং' },
      { wordIt: 'Pronti ad arrestarsi', meaningBn: 'থামতে প্রস্তুত থাকা' },
      { wordIt: 'Carreggiata', meaningBn: 'যানবাহন চলাচলের পাকা রাস্তা' }
    ]
  },

  // --- VELOCITA E DISTANZA ---
  {
    id: 'vel-01',
    chapterId: 'velocita-distanza',
    chapterTitleIt: 'Velocità e Distanza di Sicurezza',
    chapterTitleBn: 'গতিসীমা ও নিরাপদ দূরত্ব',
    questionIt: 'Il limite massimo generale di velocità nei centri abitati è di 50 km/h.',
    questionBn: 'শহরের ভেতরে (জনবসতি এলাকায়) সাধারণ সর্বোচ্চ গতিসীমা হলো ৫০ কিমি/ঘণ্টা।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! ইতালির যে কোনো শহরের ভেতরে (Centri abitati) সাধারণ সর্বোচ্চ গতিসীমা ৫০ কিমি/ঘন্টা (কিছু বিশেষ প্রশস্ত সড়কে সর্বোচ্চ ৭০ কিমি পর্যন্ত হতে পারে সাইন থাকলে)।',
    trapTipBn: 'মনে রাখবেন: Centro abitato = 50 km/h. Autostrada = 130 km/h.',
    signCode: 'limite_50',
    vocabulary: [
      { wordIt: 'Limite massimo', meaningBn: 'সর্বোচ্চ সীমা' },
      { wordIt: 'Centri abitati', meaningBn: 'জনবসতি এলাকা / শহরের ভেতর' }
    ]
  },
  {
    id: 'vel-02',
    chapterId: 'velocita-distanza',
    chapterTitleIt: 'Velocità e Distanza di Sicurezza',
    chapterTitleBn: 'গতিসীমা ও নিরাপদ দূরত্ব',
    questionIt: 'In autostrada, in caso di pioggia, il limite massimo di velocità per le autovetture scende a 110 km/h.',
    questionBn: 'হাইওয়েতে (Autostrada) বৃষ্টির সময় সাধারণ প্রাইভেট কারের সর্বোচ্চ গতিসীমা কমে ১১০ কিমি/ঘণ্টা হয়।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! সাধারণ আবহাওয়ায় অটোস্ট্রাডার গতিসীমা ১৩০ কিমি/ঘন্টা। কিন্তু বৃষ্টি (Pioggia) হলে পিচ্ছিল রাস্তার কারণে তা স্বয়ংক্রিয়ভাবে ১১০ কিমি/ঘন্টায় নেমে আসে।',
    trapTipBn: 'বৃষ্টি হলে: Autostrada = 110 km/h (130 থেকে কমে), Extraurbana principale = 90 km/h (110 থেকে কমে)।',
    signCode: 'limite_110',
    vocabulary: [
      { wordIt: 'Autostrada', meaningBn: 'হাইওয়ে / মোটরওয়ে' },
      { wordIt: 'In caso di pioggia', meaningBn: 'বৃষ্টির ক্ষেত্রে' },
      { wordIt: 'Scende a', meaningBn: 'কমে দাঁড়ায়' }
    ]
  },
  {
    id: 'vel-03',
    chapterId: 'velocita-distanza',
    chapterTitleIt: 'Velocità e Distanza di Sicurezza',
    chapterTitleBn: 'গতিসীমা ও নিরাপদ দূরত্ব',
    questionIt: 'La distanza di sicurezza deve essere aumentata se il veicolo che precede è un autocarro di grandi dimensioni.',
    questionBn: 'সামনের গাড়িটি যদি একটি বড় আকারের ট্রাক (Autocarro) হয়, তবে নিরাপদ দূরত্ব বাড়ানো উচিত।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! বড় ট্রাকের পেছনে থাকলে সামনের দৃশ্যমানতা (Visibilità) অনেক কমে যায়, তাই যথেষ্ট দূরত্ব বজায় রাখা আবশ্যক যাতে সামনে কী ঘটছে তা দেখা যায়।',
    vocabulary: [
      { wordIt: 'Distanza di sicurezza', meaningBn: 'নিরাপদ দূরত্ব' },
      { wordIt: 'Aumentata', meaningBn: 'বাড়াতে হবে' },
      { wordIt: 'Veicolo che precede', meaningBn: 'সামনে চলমান গাড়ি' },
      { wordIt: 'Autocarro', meaningBn: 'ট্রাক / পণ্যবাহী গাড়ি' }
    ]
  },
  {
    id: 'vel-04',
    chapterId: 'velocita-distanza',
    chapterTitleIt: 'Velocità e Distanza di Sicurezza',
    chapterTitleBn: 'গতিসীমা ও নিরাপদ দূরত্ব',
    questionIt: 'Lo spazio di frenatura diminuisce se la strada è bagnata.',
    questionBn: 'রাস্তা ভেজা থাকলে ব্রেকিং দূরত্ব কমে যায়।',
    isCorrect: false,
    explanationBn: 'ভুল (FALSO)! রাস্তা ভেজা (Bagnata) বা বরফাচ্ছন্ন থাকলে টায়ারের গ্রিপ কমে যায়, ফলে ব্রেক চাপার পর গাড়ি থামতে অনেক বেশি দূরত্বের প্রয়োজন হয় (Spazio aumenta, non diminuisce!).',
    trapTipBn: '"Diminuisce" মানে কমে যাওয়া। ভেজা রাস্তায় ব্রেক দূরত্ব কখনও কমে না, বরং দ্বিগুণ বাড়ে (Aumenta)!',
    signCode: 'strada_deformata',
    vocabulary: [
      { wordIt: 'Spazio di frenatura', meaningBn: 'ব্রেকিং দূরত্ব (ব্রেক চাপার পর গাড়ি থামার দূরত্ব)' },
      { wordIt: 'Diminuisce', meaningBn: 'কমে যায় (Aumenta = বাড়ে)' },
      { wordIt: 'Strada bagnata', meaningBn: 'ভেজা রাস্তা' }
    ]
  },

  // --- SOSTA E FERMATA ---
  {
    id: 'sosta-01',
    chapterId: 'sosta-fermata',
    chapterTitleIt: 'Sosta, Fermata e Arresto',
    chapterTitleBn: 'পার্কিং ও গাড়ি থামানোর নিয়ম',
    questionIt: 'La fermata è la temporanea sospensione della marcia anche per consentire la salita o la discesa delle persone.',
    questionBn: 'ফেরমাতা (Fermata) হলো যাত্রী উঠানো বা নামানোর উদ্দেশ্যে সাময়িকভাবে গাড়ি থামিয়ে রাখা।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! Fermata এবং Sosta-র মূল পার্থক্য: Fermata-তে চালক সিটে বা গাড়ির পাশে সতর্ক অবস্থায় থাকে (যাত্রী নামানো বা তোলার জন্য), আর Sosta মানে গাড়ি দীর্ঘক্ষণ পার্ক করে চালক চলে যাওয়া।',
    trapTipBn: 'Fermata = চালক গাড়িতে থাকে। Sosta = চালক গাড়ি লক করে চলে যায়।',
    signCode: 'divieto_fermata',
    vocabulary: [
      { wordIt: 'Fermata', meaningBn: 'সাময়িক থামা (চালক গাড়িতে থাকে)' },
      { wordIt: 'Salita o discesa', meaningBn: 'যাত্রী উঠা বা নামা' },
      { wordIt: 'Temporanea sospensione', meaningBn: 'সাময়িক বিরতি' }
    ]
  },
  {
    id: 'sosta-02',
    chapterId: 'sosta-fermata',
    chapterTitleIt: 'Sosta, Fermata e Arresto',
    chapterTitleBn: 'পার্কিং ও গাড়ি থামানোর নিয়ম',
    questionIt: 'È consentito sostare davanti ai cassonetti dei rifiuti urbani.',
    questionBn: 'ময়লার ড্রাম বা বিনের (Cassonetti) সামনে গাড়ি পার্ক (Sosta) করা বৈধ।',
    isCorrect: false,
    explanationBn: 'ভুল (FALSO)! ময়লার গাড়ির কাজ যাতে বাধাগ্রস্ত না হয়, সেজন্য পৌর ময়লার ড্রামের সামনে গাড়ি পার্ক করা সম্পূর্ণ বেআইনি এবং জরিমানা ও গাড়ি তুলে নেওয়ার শাস্তি রয়েছে।',
    trapTipBn: 'Cassonetti dei rifiuti-র সামনে সোস্তা (Sosta) সবসময় নিষিদ্ধ (Vietata).',
    signCode: 'divieto_sosta',
    vocabulary: [
      { wordIt: 'È consentito', meaningBn: 'অনুমোদিত / বৈধ' },
      { wordIt: 'Cassonetti dei rifiuti', meaningBn: 'রাস্তার ময়লা ফেলার ডাস্টবিন' },
      { wordIt: 'Sostare', meaningBn: 'পার্ক করে রাখা' }
    ]
  },
  {
    id: 'sosta-03',
    chapterId: 'sosta-fermata',
    chapterTitleIt: 'Sosta, Fermata e Arresto',
    chapterTitleBn: 'পার্কিং ও গাড়ি থামানোর নিয়ম',
    questionIt: 'La sosta è vietata in corrispondenza dei passaggi a livello e sui binari di linee ferroviarie o tramviarie.',
    questionBn: 'রেলক্রসিংয়ের ওপর এবং ট্রেন বা ট্রামের লাইনের ওপর গাড়ি পার্ক করা সম্পূর্ণ নিষিদ্ধ।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! রেললাইন বা ট্রামলাইনে গাড়ি রাখা চরম বিপজ্জনক এবং সম্পূর্ণ নিষিদ্ধ।',
    signCode: 'passaggio_livello',
    vocabulary: [
      { wordIt: 'Passaggi a livello', meaningBn: 'রেলওয়ে লেভেল ক্রসিং' },
      { wordIt: 'Binari', meaningBn: 'রেলের লাইন' },
      { wordIt: 'È vietata', meaningBn: 'নিষিদ্ধ' }
    ]
  },

  // --- SORPASSO ---
  {
    id: 'sorp-01',
    chapterId: 'sorpasso',
    chapterTitleIt: 'Norme sul Sorpasso',
    chapterTitleBn: 'ওভারটেকিংয়ের নিয়ম',
    questionIt: 'È vietato il sorpasso in prossimità o in corrispondenza delle curve o dei dossi su strade a due corsie e a doppio senso di marcia.',
    questionBn: 'দুই লেনের দুইমুখী রাস্তায় অন্ধ বাঁকে বা উঁচু রাস্তায় (Dosso) ওভারটেক করা সম্পূর্ণ নিষিদ্ধ।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! অন্ধ বাঁকে বা দোস্‌সো (Dosso)-তে সামনের রাস্তা দেখা যায় না (Mancanza di visibilità), তাই বিপরীত দিক থেকে আসা গাড়ির সাথে মুখোমুখি সংঘর্ষের ঝুঁকি এড়াতে ওভারটেক সম্পূর্ণ নিষিদ্ধ।',
    trapTipBn: 'অন্ধ বাঁকে এবং দোস্‌সোতে বিপরীতমুখী লেনে গিয়ে ওভারটেক করা কঠোরভাবে নিষিদ্ধ।',
    signCode: 'divieto_sorpasso',
    vocabulary: [
      { wordIt: 'Sorpasso', meaningBn: 'ওভারটেকিং / অন্য গাড়িকে অতিক্রম করা' },
      { wordIt: 'Dosso', meaningBn: 'উঁচু ঢালু রাস্তা (যেখানে অপর পাশ দেখা যায় না)' },
      { wordIt: 'Doppio senso', meaningBn: 'দ্বিমুখী চলাচল' }
    ]
  },
  {
    id: 'sorp-02',
    chapterId: 'sorpasso',
    chapterTitleIt: 'Norme sul Sorpasso',
    chapterTitleBn: 'ওভারটেকিংয়ের নিয়ম',
    questionIt: 'Il sorpasso a destra è consentito quando il conducente del veicolo che precede ha segnalato l\'intenzione di svoltare a sinistra.',
    questionBn: 'সামনের গাড়ি চালক যদি বাঁয়ে মোড় নেওয়ার জন্য সিগনাল দেয়, তবে তাকে ডান দিক দিয়ে ওভারটেক করা বৈধ।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! সাধারণ নিয়ম হলো বাঁ দিক দিয়ে ওভারটেক করা। তবে যদি সামনের গাড়িটি বাঁয়ে ঘোরার জন্য বাঁ দিকের ইন্ডিকেটর দিয়ে রাস্তার মাঝখানে দাঁড়ায়, তখন তাকে সাবধানে ডান দিক দিয়ে পার হওয়া যায়।',
    trapTipBn: 'এটি একটি বিশেষ ছাড়: সামনের গাড়ি বাঁয়ে ঘুরতে চাইলে ডান দিক দিয়ে ওভারটেক করা যায়।',
    signCode: 'divieto_sorpasso',
    vocabulary: [
      { wordIt: 'Sorpasso a destra', meaningBn: 'ডান দিক দিয়ে ওভারটেকিং' },
      { wordIt: 'Svoltare a sinistra', meaningBn: 'বাঁয়ে মোড় নেওয়া' },
      { wordIt: 'Ha segnalato', meaningBn: 'সিগনাল দিয়েছে / সংকেত দিয়েছে' }
    ]
  }
];

export const VOCABULARY_LIST: VocabularyItem[] = [
  { wordIt: 'Carreggiata', meaningBn: 'যানবাহন চলাচলের পাকা রাস্তা (ফুটপাত ছাড়া)' },
  { wordIt: 'Corsia', meaningBn: 'রাস্তার একক লেন (গাড়ি চলার একটি সারি)' },
  { wordIt: 'Spartitraffico', meaningBn: 'রাস্তার মাঝখানের ডিভাইডার বা বিভাজক' },
  { wordIt: 'Banchina', meaningBn: 'সড়কের পাশের কাঁচা কিনারা বা পেভমেন্ট' },
  { wordIt: 'Incrocio / Intersezione', meaningBn: 'রাস্তার মোড় / চৌরাস্তা' },
  { wordIt: 'Precedenza', meaningBn: 'অগ্রাধিকার (কে আগে যাবে)' },
  { wordIt: 'Sosta', meaningBn: 'দীর্ঘস্থায়ী পার্কিং (চালক গাড়ির বাইরে)' },
  { wordIt: 'Fermata', meaningBn: 'ক্ষণস্থায়ী থামা (চালক গাড়িতে থাকে)' },
  { wordIt: 'Sorpasso', meaningBn: 'ওভারটেকিং (সামনের গাড়িকে টপকে যাওয়া)' },
  { wordIt: 'Dosso', meaningBn: 'উঁচু ঢিবিসদৃশ রাস্তা (যেখানে অপর প্রান্ত দেখা যায় না)' },
  { wordIt: 'Cunetta', meaningBn: 'নিচু খাদসদৃশ রাস্তা যেখানে পানি জমে' },
  { wordIt: 'Passaggio a livello', meaningBn: 'রেলওয়ে লেভেল ক্রসিং' },
  { wordIt: 'Catadiottri', meaningBn: 'গাড়ির পেছনে লাগানো লাল প্রতিফলক আলো (রিফ্লেক্টর)' },
  { wordIt: 'Spazio di frenatura', meaningBn: 'ব্রেক চাপার পর গাড়ি থামার দূরত্ব' },
  { wordIt: 'Distanza di sicurezza', meaningBn: 'সামনের গাড়ি থেকে নিরাপদ দূরত্ব' },
  { wordIt: 'Svoltare', meaningBn: 'মোড় ঘোরানো (ডানে বা বাঁয়ে)' },
  { wordIt: 'Retromarcia', meaningBn: 'রিভার্স গিয়ার / পেছনে গাড়ি নেওয়া' },
  { wordIt: 'Girobussola / Rotatoria', meaningBn: 'গোলচত্বর / রাউন্ডঅ্যাবাউট' },
  { wordIt: 'Autostrada', meaningBn: 'হাইওয়ে / মোটরওয়ে (সর্বোচ্চ ১৩০ কিমি/ঘণ্টা)' },
  { wordIt: 'Strada extraurbana', meaningBn: 'শহরের বাইরের সংযোগ সড়ক' },
];

