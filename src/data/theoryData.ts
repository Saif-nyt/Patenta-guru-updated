// 25 Official Ministerial Chapters Bite-Sized Theory Summaries
// Designed specifically for Bangladeshi students preparing for Patente B in Italy

export interface GoldenRule {
  it: string;
  bn: string;
}

export interface TrapKeyword {
  word: string;
  meaningBn: string;
  trapNoteBn: string;
}

export interface TheoryChapter {
  id: string;
  chapterNumber: number;
  titleIt: string;
  titleBn: string;
  category: 'signals' | 'rules' | 'safety' | 'mechanics' | 'legal';
  icon: string;
  summaryBn: string;
  goldenRules: GoldenRule[];
  trapKeywords: TrapKeyword[];
  relatedRounds: number[];
}

export const THEORY_CHAPTERS: TheoryChapter[] = [
  {
    id: 'ch-01',
    chapterNumber: 1,
    titleIt: 'Definizioni Stradali e di Traffico',
    titleBn: 'রাস্তার সংজ্ঞা ও ট্রাফিক পরিচিতি',
    category: 'rules',
    icon: 'Compass',
    summaryBn: 'রাস্তা (Strada), মূল ক্যারেজিয়াটা (Carreggiata), ফুটপাত (Marciapiede), এবং জরুরি লেন (Corsia di emergenza)-এর প্রাথমিক নিয়মাবলি।',
    goldenRules: [
      {
        it: "La carreggiata è la parte della strada destinata normalmente alla circolazione dei veicoli.",
        bn: "ক্যারেজিয়াটা (Carreggiata) হলো রাস্তার মূল অংশ যা যানবাহন চলাচলের জন্য নির্ধারিত।"
      },
      {
        it: "La banchina non fa parte della carreggiata e non consente il normale transito dei veicoli.",
        bn: "বানকিনা (Banchina / রাস্তার সাইডের অংশ) ক্যারেজিয়াটার অন্তর্ভুক্ত নয় এবং এতে সাধারণ গাড়ি চলাচল নিষিদ্ধ।"
      },
      {
        it: "Il marciapiede è una parte della strada riservata ai pedoni.",
        bn: "ফুটপাত (Marciapiede) রাস্তার একটি অংশ যা পথচারীদের জন্য সংরক্ষিত।"
      },
      {
        it: "La corsia di emergenza serve solo per l'arresto dei veicoli in avaria o per il passaggio dei soccorsi.",
        bn: "জরুরি লেন (Corsia di emergenza) শুধুমাত্র গাড়ি নষ্ট হলে অথবা অ্যাম্বুলেন্স/পুলিশের জরুরি চলাচলের জন্য ব্যবহৃত হয়।"
      }
    ],
    trapKeywords: [
      {
        word: "Carreggiata",
        meaningBn: "মূল পিচঢালা সড়ক",
        trapNoteBn: "ফুটপাত বা সাইকেল লেন ক্যারেজিয়াটার অংশ নয় বললে VERO; অংশ বললে FALSO।"
      },
      {
        word: "Sempre",
        meaningBn: "সবসময়",
        trapNoteBn: "প্রশ্নে 'sempre' বা সবসময় থাকলে ৯০% ক্ষেত্রে সেটি FALSO হয়।"
      },
      {
        word: "Banchina",
        meaningBn: "রাস্তার ধারের কাঁচা অংশ",
        trapNoteBn: "এতে গাড়ি ড্রাইভ করা অনুমোদিত বললে FALSO।"
      }
    ],
    relatedRounds: [1, 2, 21]
  },
  {
    id: 'ch-02',
    chapterNumber: 2,
    titleIt: 'Segnali di Pericolo',
    titleBn: 'বিপদজনক সংকেত',
    category: 'signals',
    icon: 'AlertTriangle',
    summaryBn: '১৫০ মিটার আগের ত্রিভুজাকার বিপদ সংকেত, খাড়া ঢালু রাস্তা, আকস্মিক বাঁক, পিচ্ছিল রাস্তা এবং ট্রেন ক্রসিংয়ের পূর্বাভাস।',
    goldenRules: [
      {
        it: "I segnali di pericolo sono posti di norma a 150 metri dal punto di inizio del pericolo.",
        bn: "বিপদজনক সংকেতগুলো সাধারণত বিপদ শুরু হওয়ার ঠিক ১৫০ মিটার পূর্বে স্থাপন করা হয়।"
      },
      {
        it: "Hanno di norma forma triangolare con un vertice verso l'alto e bordo rosso.",
        bn: "এই সংকেতগুলো সাধারণত উপরের দিকে চূড়া বিশিষ্ট লাল বর্ডারযুক্ত ত্রিভুজাকার হয়।"
      },
      {
        it: "In presenza di un segnale di pericolo occorre sempre moderare la velocità.",
        bn: "বিপদ সংকেত দেখলে চালককে অবশ্যই গতি কমাতে হবে এবং বাড়তি সতর্কতা অবলম্বন করতে হবে।"
      }
    ],
    trapKeywords: [
      {
        word: "A 100 metri",
        meaningBn: "১০০ মিটার পূর্বে",
        trapNoteBn: "প্রশ্নে বিপদ সংকেত ১০০ বা ২০০ মিটারে থাকে বললে FALSO (নিয়ম হলো ১৫০ মিটার)।"
      },
      {
        word: "Obbligatorio arrestarsi",
        meaningBn: "গাড়ি সম্পূর্ণ থামানো বাধ্যতামূলক",
        trapNoteBn: "বিপদ সংকেত দেখে গাড়ি থামানো বাধ্যতামূলক নয়, গতি কমানোই নিয়ম (FALSO)।"
      }
    ],
    relatedRounds: [1, 3, 22]
  },
  {
    id: 'ch-03',
    chapterNumber: 3,
    titleIt: 'Segnali di Precedenza',
    titleBn: 'অগ্রাধিকার সংক্রান্ত সংকেত',
    category: 'signals',
    icon: 'CornerDownRight',
    summaryBn: 'স্টপ (STOP), অগ্রাধিকার দিন (Dare Precedenza), এবং অগ্রাধিকারের মূল সড়ক সংক্রান্ত সকল অফিশিয়াল নিয়ম।',
    goldenRules: [
      {
        it: "Il segnale di STOP obbliga a fermarsi sempre in corrispondenza della striscia di arresto, anche in assenza di traffico.",
        bn: "STOP সংকেত থাকলে রাস্তায় গাড়ি থাকুক বা না থাকুক, স্টপ লাইনের ঠিক সামনে গাড়ি সম্পূর্ণ থামানো বাধ্যতামূলক।"
      },
      {
        it: "Il segnale DARE PRECEDENZA obbliga a rallentare e dare la precedenza sia a destra che a sinistra.",
        bn: "DARE PRECEDENZA সংকেত থাকলে গতি কমাতে হবে এবং ডান ও বাম উভয় পাশের যানবাহনকে অগ্রাধিকার দিতে হবে।"
      },
      {
        it: "Nei bivi e incroci, in assenza di segnali, vale la regola generale della precedenza a destra.",
        bn: "কোনো সংকেত না থাকলে সাধারণ নিয়ম অনুযায়ী সর্বদা ডানদিকের গাড়ি অগ্রাধিকার পাবে।"
      }
    ],
    trapKeywords: [
      {
        word: "Solo se sopraggiungono veicoli",
        meaningBn: "শুধুমাত্র গাড়ি আসলে",
        trapNoteBn: "STOP সংকেতে কোনো গাড়ি না আসলেও সম্পূর্ণ থামতে হয়; গাড়ি আসলে থামতে হবে বললে FALSO।"
      },
      {
        word: "Solo a destra",
        meaningBn: "শুধুমাত্র ডান দিকে",
        trapNoteBn: "STOP এবং DARE PRECEDENZA থাকলে ডানে ও বামে উভয় দিকে অগ্রাধিকার দিতে হয়।"
      }
    ],
    relatedRounds: [2, 4, 23]
  },
  {
    id: 'ch-04',
    chapterNumber: 4,
    titleIt: 'Segnali di Divieto',
    titleBn: 'নিষেধাজ্ঞামূলক সংকেত',
    category: 'signals',
    icon: 'Ban',
    summaryBn: 'বৃত্তাকার লাল বর্ডার সংকেত: প্রবেশ নিষেধ (Divieto di accesso), ওভারটেক নিষেধ, হর্ন বাজানো নিষেধ ও ওজন সীমা।',
    goldenRules: [
      {
        it: "I segnali di divieto hanno di norma forma circolare con bordo rosso su fondo bianco.",
        bn: "নিষেধাজ্ঞামূলক সংকেতগুলো সাধারণত সাদা পটভূমির ওপর লাল বর্ডারযুক্ত গোলাকার হয়।"
      },
      {
        it: "Il segnale DIVIETO DI TRANSITO vieta la circolazione in entrambi i sensi a tutti i veicoli.",
        bn: "DIVIETO DI TRANSITO সংকেতটি উভয় দিক থেকেই সকল ধরনের যানবাহনের চলাচল সম্পূর্ণ নিষেধ করে।"
      },
      {
        it: "Il segnale SENSO VIETATO consente di percorrere la strada solo in senso contrario (senso unico).",
        bn: "SENSO VIETATO (প্রবেশ নিষেধ) সংকেত থাকলে সেই দিক দিয়ে ঢোকা নিষেধ কিন্তু উল্টো দিক থেকে একমুখী গাড়ি চলতে পারে।"
      }
    ],
    trapKeywords: [
      {
        word: "Tutti i veicoli",
        meaningBn: "সকল গাড়ি",
        trapNoteBn: "কিছু সংকেতে মোটরবিহীন সাইকেল বা পথচারী বাদ থাকে, প্রশ্নে 'tutti' থাকলে যত্নসহকারে পড়ুন।"
      },
      {
        word: "Esclude",
        meaningBn: "বাদ দেয় বা ছাড় দেয়",
        trapNoteBn: "অফিশিয়াল পরীক্ষায় 'esclude' শব্দটি ট্র্যাপ হিসেবে ব্যবহৃত হয়।"
      }
    ],
    relatedRounds: [5, 6, 24]
  },
  {
    id: 'ch-05',
    chapterNumber: 5,
    titleIt: 'Segnali di Obbligo',
    titleBn: 'বাধ্যতামূলক সংকেত',
    category: 'signals',
    icon: 'ShieldCheck',
    summaryBn: 'নীল ব্যাকগ্রাউন্ডের বৃত্তাকার সংকেত: নির্দিষ্ট দিকে মোড় নেওয়া বাধ্যতামূলক, সর্বনিম্ন গতিসীমা ও স্নো-চেইনের ব্যবহার।',
    goldenRules: [
      {
        it: "I segnali di obbligo hanno forma circolare su fondo blu.",
        bn: "বাধ্যতামূলক সংকেতগুলো সাধারণত নীল পটভূমির ওপর সাদা চিহ্নের গোলাকার সংকেত হয়।"
      },
      {
        it: "Indicano una direzione obbligatoria, una corsia riservata o un comportamento da tenere.",
        bn: "এগুলো চালকের জন্য নির্দিষ্ট পথ, সংরক্ষিত লেন বা নির্দিষ্ট আচরণ বাধ্যতামূলক করে।"
      },
      {
        it: "Il segnale di limite minimo di velocità obbliga a circolare ad una velocità almeno uguale a quella indicata.",
        bn: "সর্বনিম্ন গতিসীমা সংকেত থাকলে সংকেতে প্রদর্শিত গতির সমান বা তার বেশি গতিতে গাড়ি চালাতে হবে।"
      }
    ],
    trapKeywords: [
      {
        word: "Consigliato",
        meaningBn: "পরামর্শমূলক",
        trapNoteBn: "বাধ্যতামূলক সংকেতকে পরামর্শমূলক (consigliato) বললে উত্তর FALSO।"
      },
      {
        word: "Facoltativo",
        meaningBn: "ঐচ্ছিক",
        trapNoteBn: "বাধ্যতামূলক চিহ্ন কখনোই ঐচ্ছিক হতে পারে না।"
      }
    ],
    relatedRounds: [7, 8, 25]
  },
  {
    id: 'ch-06',
    chapterNumber: 6,
    titleIt: 'Segnaletica Orizzontale (Strisce)',
    titleBn: 'রাস্তার অনুভূমিক দাগ ও স্ট্রাইপ',
    category: 'signals',
    icon: 'Divide',
    summaryBn: 'অবিচ্ছিন্ন রেখা (Striscia continua), বিচ্ছিন্ন রেখা (Striscia discontinua), জেব্রা ক্রসিং ও স্টপ লাইন।',
    goldenRules: [
      {
        it: "La striscia bianca continua di mezzeria non può essere mai oltrepassata né calpestata.",
        bn: "রাস্তার মাঝের সাদা অবিচ্ছিন্ন লাইন (Striscia continua) কখনোই অতিক্রম করা বা চাকা ওঠানো যাবে না।"
      },
      {
        it: "La striscia bianca discontinua (tratteggiata) consente il sorpasso e l'inversione di marcia se le condizioni lo permettono.",
        bn: "ভাঙা ভাঙা সাদা লাইন (Striscia discontinua) থাকলে নিরাপদ অবস্থায় ওভারটেক এবং ইউ-টার্ন নেওয়া অনুমোদিত।"
      },
      {
        it: "La striscia trasversale continua indica il punto in cui ci si deve arrestare in presenza del segnale di STOP o semaforo rosso.",
        bn: "রাস্তার আড়াআড়ি শক্ত সাদা লাইনটি নির্দেশ করে লাল বাতি বা STOP চিহ্নের সামনে কোথায় গাড়ি থামাতে হবে।"
      }
    ],
    trapKeywords: [
      {
        word: "Oltrepassare la striscia continua",
        meaningBn: "টানা দাগ অতিক্রম করা",
        trapNoteBn: "টানা দাগ পার হয়ে ওভারটেক করা যায় বললে সবসময় FALSO।"
      }
    ],
    relatedRounds: [9, 10, 26]
  },
  {
    id: 'ch-07',
    chapterNumber: 7,
    titleIt: 'Semafori e Segnali Luminosi',
    titleBn: 'ট্রাফিক লাইট ও আলোক সংকেত',
    category: 'signals',
    icon: 'Sliders',
    summaryBn: 'লাল, হলুদ ও সবুজ বাতি, দিকনির্দেশক তীর, পথচারী ট্রাফিক লাইট এবং হলুদ ফ্ল্যাশিং লাইট।',
    goldenRules: [
      {
        it: "La luce gialla fissa obbliga ad arrestarsi prima dell'incrocio, a meno che non ci si trovi così vicini da non poter fermarsi in sicurezza.",
        bn: "স্থির হলুদ বাতি জ্বললে মোড়ের আগে গাড়ি থামাতে হবে, যদি না এত কাছে থাকেন যে নিরাপদে থামা অসম্ভব।"
      },
      {
        it: "La luce gialla lampeggiante invita a procedere con prudenza e moderare la velocità.",
        bn: "হলুদ বাতি মিটমিট (Lampeggiante) করলে গাড়ি সম্পূর্ণ থামানো বাধ্যতামূলক নয়, তবে গতি কমিয়ে সতর্কভাবে চলতে হবে।"
      },
      {
        it: "La luce rossa obbliga sempre all'arresto prima della striscia trasversale.",
        bn: "লাল বাতি জ্বললে স্টপ লাইনের পূর্বে গাড়ি সম্পূর্ণ থামানো সবসময় বাধ্যতামূলক।"
      }
    ],
    trapKeywords: [
      {
        word: "Gialla lampeggiante",
        meaningBn: "মিটমিটে হলুদ বাতি",
        trapNoteBn: "হলুদ মিটমিট করলে সবসময় থামতে হবে বললে FALSO; সতর্কতা নিয়ে চলার নিয়ম।"
      }
    ],
    relatedRounds: [11, 12, 27]
  },
  {
    id: 'ch-08',
    chapterNumber: 8,
    titleIt: 'Segnali degli Agenti del Traffico',
    titleBn: 'ট্রাফিক পুলিশের হাতের সংকেত',
    category: 'rules',
    icon: 'UserCheck',
    summaryBn: 'ট্রাফিক পুলিশের হাত ওড়ালে বা সোজা তুললে কোন বাতির সমান হয় এবং ট্রাফিক সিগন্যালের চেয়ে পুলিশের আদেশ বেশি কার্যকর।',
    goldenRules: [
      {
        it: "Le prescrizioni degli agenti del traffico prevalgono su tutti i segnali e sulle regole della circolazione.",
        bn: "ট্রাফিক পুলিশের নির্দেশ রাস্তায় উপস্থিত অন্য যেকোনো সাইনবোর্ড বা ট্রাফিক বাতির চেয়ে অগ্রাধিকার পায়।"
      },
      {
        it: "Il braccio alzato verticalmente dal vigile equivale alla luce gialla fissa del semaforo.",
        bn: "পুলিশের এক হাত সোজা উপরের দিকে তোলা ট্রাফিক লাইটের স্থির হলুদ বাতির সমতুল্য।"
      },
      {
        it: "Le braccia aperte nella nostra direzione equivalgono alla luce rossa del semaforo.",
        bn: "পুলিশের দুই হাত আমাদের দিকে প্রসারিত থাকা ট্রাফিক লাইটের লাল বাতির সমান (থামা বাধ্যতামূলক)।"
      }
    ],
    trapKeywords: [
      {
        word: "Braccio alzato",
        meaningBn: "এক হাত সোজা উপরে",
        trapNoteBn: "এটি লাল বাতির সমান বললে FALSO (এটি স্থির হলুদ বাতির সমান)।"
      }
    ],
    relatedRounds: [13, 14, 28]
  },
  {
    id: 'ch-09',
    chapterNumber: 9,
    titleIt: 'Limiti di Velocità e Pericolo',
    titleBn: 'গতিসীমা ও গতি সমন্বয়',
    category: 'rules',
    icon: 'Gauge',
    summaryBn: 'শহরের ভেতর ৫০ কিমি/ঘণ্টা, গ্রামীণ সড়কে ৯০/১১০ এবং হাইওয়েতে (Autostrada) ১৩০ কিমি/ঘণ্টা। নবাগত চালকদের (Neopatentati) জন্য বিশেষ সীমা।',
    goldenRules: [
      {
        it: "I limiti massimi generali sono: 50 km/h nei centri abitati, 90 km/h su strade extraurbane secondarie, 110 km/h su extraurbane principali, 130 km/h in autostrada.",
        bn: "সর্বোচ্চ সাধারণ গতিসীমা: শহরে ৫০ কিমি/ঘণ্টা, সেকেন্ডারি সড়কে ৯০, মেইন অতিরিক্ত নগরে ১১০, এবং অটোস্ত্রাদায় ১৩০ কিমি/ঘণ্টা।"
      },
      {
        it: "In caso di pioggia, il limite massimo in autostrada scende da 130 a 110 km/h.",
        bn: "বৃষ্টি হলে হাইওয়েতে (Autostrada) গতিসীমা ১৩০ থেকে কমে ১১০ কিমি/ঘণ্টা হয়ে যায়।"
      },
      {
        it: "Per i primi tre anni dal conseguimento della patente (neopatentati), il limite è di 100 km/h in autostrada e 90 km/h sulle extraurbane principali.",
        bn: "নতুন ড্রাইভিং লাইসেন্সধারী (প্রথম ৩ বছর) চালকদের জন্য হাইওয়েতে ১০০ এবং মেইন সড়কে ৯০ কিমি/ঘণ্টা গতিসীমা প্রযোজ্য।"
      }
    ],
    trapKeywords: [
      {
        word: "Neopatentati",
        meaningBn: "নতুন লাইসেন্সধারী (প্রথম ৩ বছর)",
        trapNoteBn: "নতুন চালকদের জন্য অটোস্ত্রাদায় ১১০ বা ১৩০ বললে FALSO (সঠিক হলো ১০০ কিমি/ঘণ্টা)।"
      },
      {
        word: "Pioggia autostrada",
        meaningBn: "বৃষ্টির সময়ে হাইওয়ে",
        trapNoteBn: "বৃষ্টিতে গতিসীমা অপরিবর্তিত থাকে বললে FALSO।"
      }
    ],
    relatedRounds: [15, 16, 29]
  },
  {
    id: 'ch-10',
    chapterNumber: 10,
    titleIt: 'Distanza di Sicurezza',
    titleBn: 'নিরাপদ দূরত্ব ও ব্রেকিং স্পেস',
    category: 'safety',
    icon: 'ArrowRightLeft',
    summaryBn: 'প্রতিক্রিয়ার সময় (Tempo di reazione), ব্রেকিং দূরত্ব (Spazio di frenatura), এবং সম্পূর্ণ থামার স্থান (Spazio totale di arresto)।',
    goldenRules: [
      {
        it: "La distanza di sicurezza deve essere mantenuta per evitare il tamponamento con il veicolo che precede.",
        bn: "সামনের গাড়ির পেছনে ধাক্কা এড়ানোর জন্য সবসময় নিরাপদ দূরত্ব বজায় রাখতে হবে।"
      },
      {
        it: "Lo spazio totale di arresto è dato dalla somma dello spazio percorso nel tempo di reazione e dello spazio di frenatura.",
        bn: "সম্পূর্ণ থামার দূরত্ব = প্রতিক্রিয়া সময়ে চলা দূরত্ব + ব্রেক ধরার পর গাড়ি থামার দূরত্ব।"
      },
      {
        it: "La distanza di sicurezza dipende dalla velocità, dalle condizioni dei freni, del fondo stradale e del tempo atmosferico.",
        bn: "নিরাপদ দূরত্ব নির্ভর করে গাড়ির গতি, ব্রেকের অবস্থা, রাস্তার পিচ্ছিলতা ও আবহাওয়ার ওপর।"
      }
    ],
    trapKeywords: [
      {
        word: "Dipende dalla larghezza del veicolo",
        meaningBn: "গাড়ির প্রস্থ বা চওড়ার ওপর নির্ভর করে",
        trapNoteBn: "নিরাপদ দূরত্ব গাড়ির চওড়ার ওপর নির্ভর করে বললে সবসময় FALSO।"
      },
      {
        word: "Distanza fissa",
        meaningBn: "সবসময় নির্দিষ্ট বা ফিক্সড দূরত্ব",
        trapNoteBn: "নিরাপদ দূরত্ব নির্দিষ্ট কোনো ফিক্সড মিটার নয়, গতির সাথে পরিবর্তনশীল।"
      }
    ],
    relatedRounds: [17, 18, 30]
  },
  {
    id: 'ch-11',
    chapterNumber: 11,
    titleIt: 'Norme sulla Circolazione e Sorpasso',
    titleBn: 'রাস্তায় চলাচল ও ওভারটেকের নিয়ম',
    category: 'rules',
    icon: 'ChevronsRight',
    summaryBn: 'সাধারণত ডান পাশ দিয়ে চলাচল (Mano da tenere), বাঁ পাশ দিয়ে ওভারটেক করা, এবং কখন ডান পাশ দিয়ে ওভারটেক অনুমোদিত।',
    goldenRules: [
      {
        it: "I veicoli devono circolare sulla parte destra della carreggiata e vicino al margine destro.",
        bn: "সকল যানবাহনকে ক্যারেজিয়াটার ডান পাশ দিয়ে এবং ডান সীমানার কাছাকাছি চালাতে হবে।"
      },
      {
        it: "Il sorpasso si effettua di norma a sinistra.",
        bn: "ওভারটেকিং সাধারণত বাম পাশ দিয়েই করতে হয়।"
      },
      {
        it: "È consentito il sorpasso a destra se il conducente che precede ha segnalato l'intenzione di svoltare a sinistra.",
        bn: "সামনের গাড়ি বামে মোড় নেওয়ার জন্য সিগন্যাল দিলে তবেই তাকে ডান পাশ দিয়ে ওভারটেক করা বৈধ।"
      }
    ],
    trapKeywords: [
      {
        word: "Sorpasso in curva",
        meaningBn: "বাঁকের ওপর ওভারটেক",
        trapNoteBn: "দ্বিমুখী এক ক্যারেজিয়াটা সড়কে বাঁকের ওপর ওভারটেক সম্পূর্ণ নিষিদ্ধ (VERO)।"
      },
      {
        word: "A destra sempre vietato",
        meaningBn: "ডানে ওভারটেক সবসময় নিষিদ্ধ",
        trapNoteBn: "ট্রাম অথবা বামে মোড় নেওয়া গাড়ির ক্ষেত্রে ডানে ওভারটেক সম্ভব, তাই 'sempre' বললে FALSO।"
      }
    ],
    relatedRounds: [19, 20, 31]
  },
  {
    id: 'ch-12',
    chapterNumber: 12,
    titleIt: 'Sosta, Fermata e Arresto',
    titleBn: 'পার্কিং, সাময়িক থামা ও জরুরি থামা',
    category: 'rules',
    icon: 'SquareParking',
    summaryBn: 'সোস্তা (Sosta - চালক গাড়ি ছেড়ে যায়), ফেরমাতা (Fermata - স্বল্প সময় যাত্রী ওঠানামা, চালক সিটেই থাকে), এবং আররেস্তো (Arresto - ট্রাফিক কারণে থামা)।',
    goldenRules: [
      {
        it: "Durante la fermata il conducente deve essere sempre presente e pronto a riprendere la marcia.",
        bn: "সাময়িক থামার (Fermata) সময় চালককে সর্বদা গাড়িতে উপস্থিত থাকতে হবে এবং প্রয়োজনে গাড়ি সরানোর প্রস্তুতি থাকতে হবে।"
      },
      {
        it: "La sosta è vietata in corrispondenza o prossimità dei passaggi a livello e sulle rotaie del tram.",
        bn: "রেল ক্রসিংয়ের কাছে এবং ট্রামের লাইনের ওপর পার্কিং (Sosta) করা সম্পূর্ণ নিষিদ্ধ।"
      },
      {
        it: "Nei centri abitati la sosta è consentita lungo il margine destro della carreggiata.",
        bn: "শহরের ভেতর ক্যারেজিয়াটার ডান ধারের সমান্তরালে পার্কিং করা অনুমোদিত।"
      }
    ],
    trapKeywords: [
      {
        word: "Fermata con conducente assente",
        meaningBn: "চালক অনুপস্থিত রেখে ফেরমাতা",
        trapNoteBn: "চালক গাড়ি ছেড়ে চলে গেলে সেটা সোস্তা (Sosta) হয়ে যায়, ফেরমাতা থাকে না (FALSO)।"
      },
      {
        word: "Sosta davanti a un passo carrabile",
        meaningBn: "বাড়ির ড্রাইভওয়ের সামনে পার্কিং",
        trapNoteBn: "পাসসো কাররাবিলে (Passo carrabile) এর সামনে পার্কিং নিষিদ্ধ, তবে স্বল্প সময়ের ফেরমাতা অনুমোদিত।"
      }
    ],
    relatedRounds: [4, 18, 32]
  },
  {
    id: 'ch-13',
    chapterNumber: 13,
    titleIt: 'Esempi di Precedenza e Incroci',
    titleBn: 'চৌরাস্তা ও মোড়ে অগ্রাধিকারের নিয়ম',
    category: 'rules',
    icon: 'GitMerge',
    summaryBn: 'চৌরাস্তায় যার ডান পাশ খালি থাকে সে সবার আগে যাবে (Precedenza a destra)। ট্রাম ও সাইরেন বাজানো জরুরি গাড়ি সর্বদা অগ্রাধিকার পায়।',
    goldenRules: [
      {
        it: "Di norma, negli incroci la precedenza va data ai veicoli provenienti da destra.",
        bn: "সাধারণ নিয়মে, চৌরাস্তায় ডান দিক থেকে আসা যানবাহনকে সর্বদা আগে যাওয়ার অগ্রাধিকার (Precedenza) দিতে হবে।"
      },
      {
        it: "I tram su rotaia e i veicoli di emergenza con sirena e lampeggiante blu hanno sempre la precedenza.",
        bn: "রেলের ওপর চলা ট্রাম এবং নীল বাতি ও সাইরেনসহ আসা জরুরি উদ্ধারকারী গাড়ি সর্বদা অগ্রাধিকার পায়।"
      },
      {
        it: "Un veicolo che svolta a sinistra deve dare la precedenza ai veicoli che procedono in senso contrario.",
        bn: "যে গাড়ি বামে মোড় নেয়, তাকে বিপরীত দিক থেকে সোজা আসা যানবাহনকে অগ্রাধিকার দিতে হবে।"
      }
    ],
    trapKeywords: [
      {
        word: "Precedenza a sinistra sempre",
        meaningBn: "বাঁ পাশকে সবসময় অগ্রাধিকার দেওয়া",
        trapNoteBn: "বিশেষ সাইন (যেমন Rotatoria) ছাড়া সাধারণ চৌরাস্তায় সবসময় ডানের গাড়ির অগ্রাধিকার থাকে (FALSO)।"
      },
      {
        word: "Disimpegno dell'incrocio",
        meaningBn: "মোড় অতিক্রম করার ক্রম",
        trapNoteBn: "ডান দিক উন্মুক্ত হওয়া সাপেক্ষে ক্রমানুসারে যানবাহনগুলো মোড় পার হবে (VERO)।"
      }
    ],
    relatedRounds: [1, 21, 22]
  },
  {
    id: 'ch-14',
    chapterNumber: 14,
    titleIt: 'Circolazione su Autostrade e Strade Extraurbane',
    titleBn: 'অটোস্ট্রাডা ও হাইওয়েতে গাড়ি চালানোর নিয়ম',
    category: 'rules',
    icon: 'Milestone',
    summaryBn: 'অটোস্ট্রাডায় সাধারণ গতিসীমা ১৩০ কিমি/ঘণ্টা, বৃষ্টির দিনে ১১০ কিমি। ইউ-টার্ন নেওয়া, রিভার্স ব্যাক করা বা জরুরি লেন ছাড়া হাঁটা সম্পূর্ণ নিষিদ্ধ।',
    goldenRules: [
      {
        it: "Sulle autostrade il limite massimo generale di velocità è di 130 km/h, ridotto a 110 km/h in caso di precipitazioni atmosferiche.",
        bn: "অটোস্ট্রাডায় সাধারণ সর্বোচ্চ গতিসীমা ১৩০ কিমি/ঘণ্টা, তবে বৃষ্টিপাতের সময় তা কমে ১১০ কিমি/ঘণ্টা হয়।"
      },
      {
        it: "È vietata la circolazione di pedoni, ciclomotori, biciclette e veicoli a tenuta non stagna con carico scoperto.",
        bn: "পথচারী, মোপেড, সাইকেল এবং ঢাকনাহীন খোলা মালামাল বোঝাই গাড়ির অটোস্ট্রাডায় চলাচল সম্পূর্ণ নিষিদ্ধ।"
      },
      {
        it: "Sulle autostrade è severamente vietato fare inversione di marcia o fare retromarcia.",
        bn: "অটোস্ট্রাডায় ইউ-টার্ন (Inversione di marcia) নেওয়া বা ব্যাক গিয়ারে গাড়ি পিছিয়ে নেওয়া মারাত্মক নিষিদ্ধ অপরাধ।"
      }
    ],
    trapKeywords: [
      {
        word: "Corsia di emergenza per sosta prolungata",
        meaningBn: "জরুরি লেনে দীর্ঘসময় বিশ্রাম নেওয়া",
        trapNoteBn: "জরুরি লেনে কেবল গাড়ি বিকল হলে বা গুরুতর অসুস্থতায় সর্বোচ্চ ৩ ঘণ্টা থামা যায়, বিশ্রামের জন্য নয় (FALSO)।"
      },
      {
        word: "Inversione di marcia in autostrada",
        meaningBn: "হাইওয়েতে গাড়ি ঘুরিয়ে উল্টো চলা",
        trapNoteBn: "অটোস্ট্রাডায় যেকোনো পরিস্থিতিতে ইউ-টার্ন নেওয়া কঠোরভাবে নিষিদ্ধ (VERO)।"
      }
    ],
    relatedRounds: [2, 23, 24]
  },
  {
    id: 'ch-15',
    chapterNumber: 15,
    titleIt: 'Uso delle Luci e Dispositivi Acustici',
    titleBn: 'গাড়ির লাইট ও হর্ন ব্যবহারের নিয়ম',
    category: 'safety',
    icon: 'Sun',
    summaryBn: 'সূর্যাস্তের আধা ঘণ্টা পর থেকে সূর্যোদয়ের আধা ঘণ্টা আগে পর্যন্ত এবং টানেলে সর্বদা হেডলাইট (Luci anabbaglianti) জ্বালানো বাধ্যতামূলক।',
    goldenRules: [
      {
        it: "I proiettori anabbaglianti devono essere accesi da mezz'ora dopo il tramonto a mezz'ora prima dell'alba e in galleria.",
        bn: "সূর্যাস্তের ৩০ মিনিট পর থেকে সূর্যোদয়ের ৩০ মিনিট আগে পর্যন্ত এবং টানেলের ভেতরে লো-বিম লাইট (Anabbaglianti) জ্বালানো বাধ্যতামূলক।"
      },
      {
        it: "I proiettori abbaglianti devono essere spenti incrociando altri veicoli per non abbagliare.",
        bn: "বিপরীত দিক থেকে আসা গাড়ির চালকের চোখ ধাঁধানো এড়াতে হাই-বিম হেডলাইট (Abbaglianti) বন্ধ করে লো-বিমে নামাতে হবে।"
      },
      {
        it: "Nei centri abitati l'uso del clacson è vietato, salvo in caso di effettivo e immediato pericolo.",
        bn: "শহরাঞ্চলে অকারণে হর্ন বাজানো সম্পূর্ণ নিষিদ্ধ, শুধুমাত্র তাৎক্ষণিক দুর্ঘটনা প্রতিরোধের জরুরি ক্ষেত্র ছাড়া।"
      }
    ],
    trapKeywords: [
      {
        word: "Solo luci di posizione in galleria",
        meaningBn: "টানেলে শুধু পজিশন লাইট জ্বালানো",
        trapNoteBn: "টানেল আলোকিত হলেও শুধু পজিশন লাইট জ্বালানো অবৈধ, অবশ্যই Anabbaglianti জ্বালাতে হবে (FALSO)।"
      },
      {
        word: "Clacson per salutare",
        meaningBn: "পরিচিতদের সালাম দিতে হর্ন দেওয়া",
        trapNoteBn: "কুশল বিনিময় বা ট্রাফিকে বিরক্ত প্রকাশে হর্ন বাজানো সম্পূর্ণ বেআইনি (FALSO)।"
      }
    ],
    relatedRounds: [3, 25, 26]
  },
  {
    id: 'ch-16',
    chapterNumber: 16,
    titleIt: 'Dispositivi di Sicurezza: Cinture, Casco, Airbag e Seggiolini',
    titleBn: 'সিটবেল্ট, হেলমেট, এয়ারব্যাগ ও শিশুর সিট',
    category: 'safety',
    icon: 'ShieldAlert',
    summaryBn: 'গাড়ির সব আরোহীর সিটবেল্ট পরা বাধ্যতামূলক। ১৫০ সেমির কম উচ্চতার শিশুদের জন্য অনুমোদিত চাইল্ড সিট (Seggiolini) ব্যবহার করতে হবে।',
    goldenRules: [
      {
        it: "L'uso delle cinture di sicurezza è obbligatorio per il conducente e per tutti i passeggeri dei veicoli.",
        bn: "গাড়ির চালক এবং সামনের ও পেছনের সব সিটের যাত্রীদের সিটবেল্ট বাঁধা আইনত বাধ্যতামূলক।"
      },
      {
        it: "I bambini di statura inferiore a 1,50 m devono essere assicurati con un sistema di ritenuta per bambini omologato.",
        bn: "১৫০ সেন্টিমিটারের কম উচ্চতার শিশুদের অনুমোদিত চাইল্ড সিটের (Sistema di ritenuta) সাথে বাঁধতে হবে।"
      },
      {
        it: "Il casco protettivo è obbligatorio per tutti i conducenti e passeggeri di motocicli e ciclomotori.",
        bn: "মোটরসাইকেল ও মোপেডের চালক ও পেছনের যাত্রী উভয়ের জন্যই হেলমেট পরা শতভাগ বাধ্যতামূলক।"
      }
    ],
    trapKeywords: [
      {
        word: "Airbag esenta dall'uso della cintura",
        meaningBn: "এয়ারব্যাগ থাকলে সিটবেল্ট পরা লাগবে না",
        trapNoteBn: "এয়ারব্যাগ কখনো সিটবেল্টের বিকল্প নয়, সিটবেল্ট না বাঁধলে এয়ারব্যাগ মারাত্মক আঘাত করতে পারে (FALSO)।"
      },
      {
        word: "Cinture solo sui sedili anteriori",
        meaningBn: "শুধু সামনের সিটে বেল্ট পরা",
        trapNoteBn: "পেছনের সিটের যাত্রীদেরও সিটবেল্ট বাঁধা আইনত বাধ্যতামূলক (FALSO)।"
      }
    ],
    relatedRounds: [4, 27, 28]
  },
  {
    id: 'ch-17',
    chapterNumber: 17,
    titleIt: 'Patente di Guida e Sistema a Punti',
    titleBn: 'লাইসেন্সের প্রকারভেদ ও ২০ পয়েন্ট কাটার নিয়ম',
    category: 'legal',
    icon: 'Award',
    summaryBn: 'নতুন লাইসেন্সে ২০ পয়েন্ট থাকে। নবীন চালকদের (Neopatentati) জন্য প্রথম ৩ বছর বিশেষ গতিসীমা ও যেকোনো ট্রাফিক অপরাধে দ্বিগুণ পয়েন্ট কাটার নিয়ম।',
    goldenRules: [
      {
        it: "La patente di guida è dotata di un punteggio iniziale di 20 punti.",
        bn: "ইতালিতে ড্রাইভিং লাইসেন্স পাওয়ার পর শুরুতে চালকের অ্যাকাউন্টে ২০ পয়েন্ট জমা থাকে।"
      },
      {
        it: "Per i neopatentati, nei primi tre anni dal conseguimento, i punti decurtati per ciascuna violazione sono raddoppiati.",
        bn: "নতুন চালকদের জন্য প্রথম ৩ বছরে প্রতিটি ট্রাফিক অপরাধের পয়েন্ট দ্বিগুণ হারে কাটা হয়।"
      },
      {
        it: "La patente di categoria B consente di guidare autoveicoli fino a 3,5 tonnellate e fino a 9 posti complessivi compreso il conducente.",
        bn: "ক্যাটাগরি 'বি' লাইসেন্স দিয়ে সর্বোচ্চ ৩.৫ টন ওজনের গাড়ি এবং চালকসহ সর্বোচ্চ ৯ সিটের যানবাহন চালানো যায়।"
      }
    ],
    trapKeywords: [
      {
        word: "Neopatentati 130 km/h in autostrada",
        meaningBn: "নতুন চালকদের হাইওয়েতে ১৩০ কিমি গতি",
        trapNoteBn: "প্রথম ৩ বছর হাইওয়েতে সর্বোচ্চ ১০০ কিমি/ঘণ্টা এবং শহরের বাইরে ৯০ কিমি/ঘণ্টা সীমা মানতে হবে (FALSO)।"
      },
      {
        word: "Patente B per tutti i motocicli",
        meaningBn: "বি লাইসেন্সে সব বড় মোটরসাইকেল চালানো যায়",
        trapNoteBn: "ইতালিতে বি লাইসেন্স দিয়ে শুধু ১২৫ সিসি এবং সর্বোচ্চ ১১ কিলোওয়াটের মোটরসাইকেল চালানো যায় (FALSO)।"
      }
    ],
    relatedRounds: [5, 29, 30]
  },
  {
    id: 'ch-18',
    chapterNumber: 18,
    titleIt: 'Comportamento in Caso di Incidente e Soccorso',
    titleBn: 'দুর্ঘটনায় করণীয় ও ফার্স্ট এইড (Primo Soccorso)',
    category: 'safety',
    icon: 'AlertOctagon',
    summaryBn: 'সড়ক দুর্ঘটনায় আহত ব্যক্তিকে ফেলে চলে যাওয়া মারাত্মক অপরাধ। প্রাথমিক চিকিৎসায় আহত ব্যক্তির হেলমেট খোলা বা তরল ওষুধ খাওয়ানো নিষেধ।',
    goldenRules: [
      {
        it: "In caso di incidente con feriti è obbligatorio fermarsi e prestare assistenza ai feriti chiamando i soccorsi (112).",
        bn: "দুর্ঘটনায় কেউ আহত হলে গাড়ি থামানো এবং আহতদের সহায়তা ও ১১২ নম্বরে জরুরি অ্যাম্বুলেন্স ডাকা আইনত বাধ্যতামূলক।"
      },
      {
        it: "Non si devono somministrare bevande o medicinali ai feriti della strada in stato di shock o incoscienti.",
        bn: "দুর্ঘটনায় আহত ও অচেতন ব্যক্তিকে কোনো প্রকার তরল পানি, ওষুধ বা অ্যালকোহল খাওয়ানো সম্পূর্ণ নিষিদ্ধ।"
      },
      {
        it: "Non si deve rimuovere il casco al motociclista infortunato, salvo casi di estrema necessità da parte di personale esperto.",
        bn: "আহত মোটরসাইকেল চালকের মাথা থেকে হেলমেট টেনে খোলা যাবে না, এতে ঘাড়ে মারাত্মক স্পাইনাল ইনজুরি হতে পারে।"
      }
    ],
    trapKeywords: [
      {
        word: "Soccorrere solo se non c'è intralcio",
        meaningBn: "যানজট না হলেই শুধু আহতকে উদ্ধার করা",
        trapNoteBn: "আহত ব্যক্তিকে উদ্ধার ও সহায়তা দেওয়া সর্বাবস্থায় চালকের আইনি দায়িত্ব (FALSO)।"
      },
      {
        word: "Togliere subito il casco per farlo respirare",
        meaningBn: "শ্বাস নেওয়ার সুবিধার জন্য হেলমেট খোলা",
        trapNoteBn: "সাধারণ মানুষের হেলমেট খোলা নিষিদ্ধ, এটি শুধু প্যারামেডিকরা করতে পারেন (FALSO)।"
      }
    ],
    relatedRounds: [6, 31, 32]
  },
  {
    id: 'ch-19',
    chapterNumber: 19,
    titleIt: 'Stato Psicofisico: Alcool, Droga, Farmaci e Sonno',
    titleBn: 'চালকের শারীরিক ও মানসিক অবস্থা ও ড্রাগ',
    category: 'safety',
    icon: 'Activity',
    summaryBn: 'নতুন চালকদের (Neopatentati) জন্য রক্তের অ্যালকোহল মাত্রা শূন্য (০.০ গ্রাম/লিটার) হতে হবে। ক্লান্তি বা ঘুমের ভাব এলে গাড়ি অবিলম্বে নিরাপদ স্থানে থামাতে হবে।',
    goldenRules: [
      {
        it: "Per i neopatentati nei primi tre anni il tasso alcolemico consentito durante la guida è pari a zero (0,0 g/l).",
        bn: "প্রথম ৩ বছরের নতুন চালকদের জন্য গাড়ি চালানোর সময় রক্তে অ্যালকোহলের মাত্রা অবশ্যই শূন্য (০.০) হতে হবে।"
      },
      {
        it: "L'assunzione di alcol e farmaci sedativi aumenta il tempo di reazione del conducente.",
        bn: "অ্যালকোহল ও ঘুমের ওষুধ সেবনের ফলে চালকের প্রতিক্রিয়া সময় (Tempo di reazione) বৃদ্ধি পায় এবং চালকের গতিবিধি ধীর হয়ে যায়।"
      },
      {
        it: "In caso di stanchezza o sonnolenza improvvisa è necessario fermarsi in un'area di sosta e riposare.",
        bn: "গাড়ি চালানোর সময় ক্লান্তি বা ঘুম এলে অবিলম্বে নিকটস্থ সার্ভিস এরিয়ায় গাড়ি থামিয়ে বিশ্রাম নেওয়া কর্তব্য।"
      }
    ],
    trapKeywords: [
      {
        word: "Alcol riduce il tempo di reazione",
        meaningBn: "অ্যালকোহল রিঅ্যাকশন টাইম কমায়",
        trapNoteBn: "অ্যালকোহল রিঅ্যাকশন টাইম বাড়ায় (Aumenta il tempo), অর্থাৎ সিদ্ধান্ত নিতে বেশি সময় লাগে (FALSO)।"
      },
      {
        word: "Tasso alcolemico tollerato per neopatentati",
        meaningBn: "নতুন চালকদের সীমিত মদ্যপান ছাড়",
        trapNoteBn: "নতুনদের জন্য বিন্দুমাত্র অ্যালকোহল অনুমোদিত নয়, সীমা কঠোরভাবে 0.0 (FALSO)।"
      }
    ],
    relatedRounds: [7, 33, 34]
  },
  {
    id: 'ch-20',
    chapterNumber: 20,
    titleIt: 'Responsabilità Civile, Penale e Assicurazione RCA',
    titleBn: 'আইনি দায়বদ্ধতা ও বাধ্যতামূলক গাড়ি বীমা (RCA)',
    category: 'legal',
    icon: 'FileText',
    summaryBn: 'বাধ্যতামূলক আরসিএ বীমা (RCA) অন্যের মানুষ ও সম্পত্তির ক্ষতিপূরণ দেয়। নিজের গাড়ির ক্ষতি কভার করতে চাইলে অতিরিক্ত কাসকো (Kasko) পলিসি প্রয়োজন।',
    goldenRules: [
      {
        it: "L'assicurazione per la responsabilità civile auto (R.C.A.) è obbligatoria per tutti i veicoli a motore posti in circolazione.",
        bn: "রাস্তায় চলাচলকারী সকল মোটরযানের জন্য সরকারি আরসিএ (RCA) বীমা থাকা আইনত বাধ্যতামূলক।"
      },
      {
        it: "La polizza R.C.A. risarcisce i danni causati a terzi (persone, animali o cose), ma non i danni subiti dal conducente responsabile.",
        bn: "আরসিএ বীমা তৃতীয় পক্ষের (মানুষ, পশু ও সম্পত্তির) ক্ষতিপূরণ দেয়, কিন্তু দোষী চালকের নিজের গাড়ির ক্ষতি দেয় না।"
      },
      {
        it: "La responsabilità penale sorge quando vengono violate norme del Codice Penale, come lesioni gravi o omicidio stradale.",
        bn: "দুর্ঘটনায় মারাত্মক জখম বা মৃত্যু ঘটালে চালকের বিরুদ্ধে ফৌজদারি মামলা (Responsabilità penale) দায়ের হয়।"
      }
    ],
    trapKeywords: [
      {
        word: "RCA copre il furto del veicolo",
        meaningBn: "আরসিএ গাড়ি চুরি কভার করে",
        trapNoteBn: "আরসিএ শুধু অন্যের ক্ষতি দেয়, গাড়ি চুরির জন্য আলাদা 'Furto e Incendio' পলিসি লাগে (FALSO)।"
      },
      {
        word: "RCA copre i danni del conducente colpevole",
        meaningBn: "দোষী চালকের নিজের গাড়ির ক্ষতি দেওয়া",
        trapNoteBn: "দোষী চালকের গাড়ির ক্ষতি আরসিএ দেয় না, এর জন্য কাসকো (Kasko) পলিসি লাগে (FALSO)।"
      }
    ],
    relatedRounds: [8, 35, 36]
  },
  {
    id: 'ch-21',
    chapterNumber: 21,
    titleIt: 'Rispetto dell\'Ambiente e Inquinamento',
    titleBn: 'পরিবেশ দূষণ রোধ ও জ্বালানি সাশ্রয়',
    category: 'safety',
    icon: 'Trees',
    summaryBn: 'পরিবেশ দূষণ কমাতে অপ্রয়োজনীয় হর্ন না বাজানো, দীর্ঘ ট্রাফিকে ইঞ্জিন বন্ধ রাখা এবং এক্সস্ট ধোঁয়া ও টায়ারের ঘর্ষণ কমানো।',
    goldenRules: [
      {
        it: "Per diminuire l'inquinamento atmosferico è opportuno spegnere il motore in caso di arresto prolungato.",
        bn: "রেলগেট বা দীর্ঘ ট্রাফিকে গাড়ি আটকে থাকলে বায়ুদূষণ কমাতে গাড়ির ইঞ্জিন বন্ধ করে রাখা উচিত।"
      },
      {
        it: "Un'eccessiva pressione o una pressione insufficiente dei pneumatici aumenta il consumo di carburante e l'usura.",
        bn: "টায়ারে বাতাসের চাপ কম বা বেশি থাকলে জ্বালানি খরচ বাড়ে এবং টায়ার দ্রুত নষ্ট হয়।"
      },
      {
        it: "L'inquinamento acustico può essere ridotto evitando accelerate brusche e usando il clacson solo nei casi consentiti.",
        bn: "হঠাৎ করে অতিরিক্ত এক্সিলারেটর না চেপে এবং হর্নের পরিমিত ব্যবহারে শব্দদূষণ অনেকটাই কমানো যায়।"
      }
    ],
    trapKeywords: [
      {
        word: "Filtro olio per inquinamento dell'aria",
        meaningBn: "বায়ুদূষণ কমাতে অয়েল ফিল্টার বদলানো",
        trapNoteBn: "অয়েল ফিল্টার ইঞ্জিন তেলের ময়লা ছাঁকে, এটি সরাসরি ধোঁয়া বা বায়ুদূষণ নিয়ন্ত্রণ করে না (FALSO)।"
      },
      {
        word: "Gettare mozziconi dal finestrino",
        meaningBn: "জানালা দিয়ে সিগারেটের শেষাংশ ফেলা",
        trapNoteBn: "চলন্ত গাড়ি থেকে সিগারেট বা ময়লা ফেলা কঠোর শাস্তিযোগ্য অপরাধ (FALSO)।"
      }
    ],
    relatedRounds: [9, 37, 38]
  },
  {
    id: 'ch-22',
    chapterNumber: 22,
    titleIt: 'Elementi del Veicolo: Freni, Pneumatici, Sospensioni e Sterzo',
    titleBn: 'গাড়ির মূল যন্ত্রাংশ: ব্রেক, টায়ার, সাসপেনশন ও স্টিয়ারিং',
    category: 'mechanics',
    icon: 'Wrench',
    summaryBn: 'টায়ারের ট্রেড গভীরতা প্রাইভেট গাড়ির জন্য কমপক্ষে ১.৬ মিমি হতে হবে। ব্রেক ও এবিএস (ABS) চাকা লক হওয়া আটকে স্টিয়ারিং নিয়ন্ত্রণ বজায় রাখে।',
    goldenRules: [
      {
        it: "Lo spessore minimo del battistrada dei pneumatici degli autoveicoli deve essere di almeno 1,6 mm.",
        bn: "যাত্রীবাহী প্রাইভেট গাড়ির টায়ারের খাঁজের (Battistrada) সর্বনিম্ন গভীরতা কমপক্ষে ১.৬ মিলিমিটার হতে হবে।"
      },
      {
        it: "Il sistema antibloccaggio ABS impedisce il bloccaggio delle ruote durante una frenata di emergenza garantendo la manovrabilità.",
        bn: "এবিএস (ABS) সিস্টেম জরুরি ব্রেক করার সময় চাকা লক হওয়া আটকে স্টিয়ারিং ঘুরিয়ে গাড়ি নিয়ন্ত্রণের সুযোগ দেয়।"
      },
      {
        it: "Il servofreno funziona solo quando il motore del veicolo è acceso.",
        bn: "সার্ভোব্রেক বুস্টার শুধুমাত্র গাড়ির ইঞ্জিন চালু থাকা অবস্থাতেই কাজ করে।"
      }
    ],
    trapKeywords: [
      {
        word: "Spessore battistrada minimo 0,5 mm",
        meaningBn: "টায়ারের খাঁজ সর্বনিম্ন ০.৫ মিমি",
        trapNoteBn: "গাড়ির জন্য সর্বনিম্ন ১.৬ মিমি এবং মোপেডের জন্য ১.০ মিমি হতে হবে (FALSO)।"
      },
      {
        word: "ABS riduce sempre lo spazio di frenata su neve",
        meaningBn: "বরফে এবিএস ব্রেকিং দূরত্ব সবসময় কমায়",
        trapNoteBn: "বরফ বা আলগা নুড়ি পাথরে এবিএস ব্রেকিং দূরত্ব বাড়িয়ে দিতে পারে (FALSO)।"
      }
    ],
    relatedRounds: [10, 39, 40]
  },
  {
    id: 'ch-23',
    chapterNumber: 23,
    titleIt: 'Spie del Cruscotto e Manutenzione',
    titleBn: 'ড্যাশবোর্ডের ওয়ার্নিং লাইট ও প্রতীক (Spie)',
    category: 'mechanics',
    icon: 'Gauge',
    summaryBn: 'লাল বাতি মানে মারাত্মক বিপদ (অবিলম্বে গাড়ি থামাতে হবে)। অ্যাম্বার/হলুদ বাতি সতর্কতা বোঝায়। নীল বাতি হাই-বিম হেডলাইট নির্দেশ করে।',
    goldenRules: [
      {
        it: "Le spie di colore rosso sul cruscotto indicano pericolo grave o il mancato funzionamento di sistemi vitali del veicolo.",
        bn: "ড্যাশবোর্ডের লাল বাতিগুলো গুরুতর বিপদ অথবা গাড়ির জরুরি সিস্টেম বিকল হওয়ার সতর্কতা নির্দেশ করে।"
      },
      {
        it: "La spia della pressione dell'olio motore di colore rosso impone l'arresto immediato del motore per evitare gravi danni.",
        bn: "ইঞ্জিন অয়েল প্রেশারের লাল বাতি জ্বলে উঠলে ইঞ্জিন রক্ষা করতে অবিলম্বে নিরাপদ জায়গায় গাড়ি বন্ধ করতে হবে।"
      },
      {
        it: "La spia luminosa dei proiettori abbaglianti è di colore blu.",
        bn: "হাই-বিম হেডলাইটের (Luci abbaglianti) নির্দেশক ড্যাশবোর্ড বাতিটি নীল রঙের হয়ে থাকে।"
      }
    ],
    trapKeywords: [
      {
        word: "Spia anabbaglianti rossa",
        meaningBn: "লো-বিম লাইটের বাতি লাল",
        trapNoteBn: "লো-বিম লাইটের বাতি সবুজ, হাই-বিম নীল, কখনোই লাল নয় (FALSO)।"
      },
      {
        word: "Spia temperatura liquido raffreddamento verde",
        meaningBn: "ইঞ্জিন অতিরিক্ত গরম হওয়ার বাতি সবুজ",
        trapNoteBn: "ইঞ্জিন অতিরিক্ত গরম হওয়ার সতর্কতা বাতি সবসময় লাল রঙের হয় (FALSO)।"
      }
    ],
    relatedRounds: [11, 41, 42]
  },
  {
    id: 'ch-24',
    chapterNumber: 24,
    titleIt: 'Traino di Rimorchi e Carrelli',
    titleBn: 'ট্রেলার ও নষ্ট গাড়ি টেনে নিয়ে যাওয়া (Traino)',
    category: 'rules',
    icon: 'Truck',
    summaryBn: 'নষ্ট গাড়ি টেনে নেওয়ার সময় শক্ত বার বা মজবুত দড়ি ব্যবহার করতে হবে। হালকা ট্রেলারের (Rimorchi leggeri) সর্বোচ্চ অনুমোদিত ওজন ৭৫০ কেজি।',
    goldenRules: [
      {
        it: "Il traino di un veicolo in avaria deve avvenire mediante un solido aggancio (barra rigida, fune o catena ben segnalata).",
        bn: "নষ্ট গাড়ি টেনে নেওয়ার সময় শক্ত ধাতব বার অথবা উজ্জ্বল সিগন্যালযুক্ত মজবুত দড়ি দিয়ে বাঁধতে হবে।"
      },
      {
        it: "I rimorchi durante la sosta devono essere frenati con il freno a mano o con cunei bloccaruota.",
        bn: "ট্রেলার খুলে পার্ক করে রাখার সময় হ্যান্ডব্রেক টেনে এবং চাকার নিচে কুনি বা কাঠের ব্লক দিতে হবে।"
      },
      {
        it: "I rimorchi leggeri hanno una massa complessiva a pieno carico fino a 750 kg.",
        bn: "হালকা ট্রেলারের (Rimorchi leggeri) সর্বোচ্চ অনুমোদিত মোট ওজন ৭৫০ কেজি পর্যন্ত হয়ে থাকে।"
      }
    ],
    trapKeywords: [
      {
        word: "Traino di due veicoli contemporaneamente",
        meaningBn: "একসাথে দুটি গাড়ি বা ট্রেলার টানা",
        trapNoteBn: "সাধারণ যাত্রীবাহী গাড়িতে একসাথে একাধিক নষ্ট গাড়ি বা ট্রেলার টানা সম্পূর্ণ নিষিদ্ধ (FALSO)।"
      },
      {
        word: "Rimorchio leggero fino a 1500 kg",
        meaningBn: "১৫০০ কেজি পর্যন্ত হালকা ট্রেলার",
        trapNoteBn: "হালকা ট্রেলার সর্বোচ্চ ৭৫০ কেজি পর্যন্ত, এর বেশি হলে তা ভারী ট্রেলার (FALSO)।"
      }
    ],
    relatedRounds: [12, 43, 44]
  },
  {
    id: 'ch-25',
    chapterNumber: 25,
    titleIt: 'Consumi, Risparmio Energetico e Guida Ecologica',
    titleBn: 'জ্বালানি সাশ্রয় ও পরিবেশবান্ধব ড্রাইভিং',
    category: 'safety',
    icon: 'Fuel',
    summaryBn: 'ছাদের লাগেজ বক্স খুলে রাখা, সঠিক সময়ে উচ্চতর গিয়ার ব্যবহার এবং উইন্ডো বন্ধ রেখে ড্রাইভ করলে জ্বালানি খরচ ও কার্বন নির্গমন উল্লেখযোগ্যভাবে কমে।',
    goldenRules: [
      {
        it: "Un portapacchi carico o un box da tetto peggiora l'aerodinamica del veicolo e aumenta notevolmente i consumi di carburante.",
        bn: "গাড়ির ছাদের ওপর লাগেজ বা বক্স রাখলে বাতাসের বাধা বাড়ে এবং তেলের খরচ অনেক বাড়িয়ে দেয়।"
      },
      {
        it: "Guidare con marce alte appena possibile consente di ridurre il regime del motore e risparmiare carburante.",
        bn: "সম্ভব হওয়ামাত্র উচ্চতর গিয়ারে গাড়ি চালালে ইঞ্জিনের চাপ কমে এবং জ্বালানি সাশ্রয় হয়।"
      },
      {
        it: "Viaggiare con i finestrini aperti ad alta velocità aumenta la resistenza dell'aria e il consumo di carburante.",
        bn: "হাইওয়েতে বেশি গতিতে চলার সময় জানালার কাচ খোলা রাখলে বায়ুর বাধার কারণে তেলের খরচ বাড়ে।"
      }
    ],
    trapKeywords: [
      {
        word: "Aria condizionata non influenza i consumi",
        meaningBn: "এসি চালালে তেলে কোনো প্রভাব পড়ে না",
        trapNoteBn: "গাড়ির এসি চালালে ইঞ্জিনের লোড বাড়ে এবং জ্বালানি খরচ বৃদ্ধি পায় (FALSO)।"
      },
      {
        word: "Riscaldare il motore da fermo per 10 minuti",
        meaningBn: "স্টার্ট দিয়ে গাড়ি ১০ মিনিট দাঁড় করিয়ে রাখা",
        trapNoteBn: "দাঁড়িয়ে গাড়ি গরম করলে তেল নষ্ট ও পরিবেশ দূষণ হয়, স্টার্ট দিয়ে অবিলম্বে ধীরে গাড়ি চালানো শুরু করতে হবে (FALSO)।"
      }
    ],
    relatedRounds: [13, 45, 46]
  }
];
