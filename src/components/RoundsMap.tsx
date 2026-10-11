import React from 'react';
import {
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Play,
  Award,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Flag
} from 'lucide-react';

export interface RoundInfo {
  id: number;
  titleBn: string;
  titleIt: string;
  topicBadgeBn: string;
  topicBadgeIt: string;
  questionsCount: number;
  isFree: boolean;
}

// Generate the 240 rounds structure with bilingual badges & balanced titles
export const ALL_ROUNDS: RoundInfo[] = [
  { id: 1, titleBn: 'রাউন্ড ১: বিপদজনক ট্রাফিক সংকেত', titleIt: 'Round 1: Segnali di Pericolo Base', topicBadgeBn: '⚠️ সংকেত', topicBadgeIt: 'Segnali di Pericolo', questionsCount: 30, isFree: true },
  { id: 2, titleBn: 'রাউন্ড ২: স্টপ ও ডানদিকের অগ্রাধিকার', titleIt: 'Round 2: Precedenze e Regola STOP', topicBadgeBn: '🛑 অগ্রাধিকার', topicBadgeIt: 'Precedenze e Incroci', questionsCount: 30, isFree: true },
  { id: 3, titleBn: 'রাউন্ড ৩: গতিসীমা ও ব্রেকিং দূরত্ব', titleIt: 'Round 3: Limiti di Velocità e Frenata', topicBadgeBn: '⭕ গতিসীমা', topicBadgeIt: 'Limiti di Velocità', questionsCount: 30, isFree: true },
  { id: 4, titleBn: 'রাউন্ড ৪: পার্কিং ও সাময়িক থামা', titleIt: 'Round 4: Norme di Sosta e Fermata', topicBadgeBn: '🚫 পার্কিং', topicBadgeIt: 'Sosta e Fermata', questionsCount: 30, isFree: true },
  { id: 5, titleBn: 'রাউন্ড ৫: ওভারটেকিং ও বাঁকের নিয়ম', titleIt: 'Round 5: Sorpasso in Curva e Dosso', topicBadgeBn: '⛔ ওভারটেক', topicBadgeIt: 'Regole sul Sorpasso', questionsCount: 30, isFree: true },
  { id: 6, titleBn: 'রাউন্ড ৬: গোলচত্বর ও ট্রাম অগ্রাধিকার', titleIt: 'Round 6: Rotatorie, Tram e Binari', topicBadgeBn: '🚊 ট্রাম ও মোড়', topicBadgeIt: 'Rotatorie e Tram', questionsCount: 30, isFree: true },
  { id: 7, titleBn: 'রাউন্ড ৭: বাধ্যতামূলক ট্রাফিক সংকেত', titleIt: 'Round 7: Segnali di Obbligo Ministeriali', topicBadgeBn: '🔵 সংকেত', topicBadgeIt: 'Segnali di Obbligo', questionsCount: 30, isFree: true },
  { id: 8, titleBn: 'রাউন্ড ৮: নিষেধাজ্ঞামূলক ট্রাফিক সংকেত', titleIt: 'Round 8: Segnali di Divieto Ministeriali', topicBadgeBn: '🔴 নিষেধাজ্ঞা', topicBadgeIt: 'Segnali di Divieto', questionsCount: 30, isFree: true },
  { id: 9, titleBn: 'রাউন্ড ৯: হাইওয়ে (Autostrada) নিয়মাবলি', titleIt: 'Round 9: Circolazione su Autostrade', topicBadgeBn: '🛣️ হাইওয়ে', topicBadgeIt: 'Autostrade e Tangenziali', questionsCount: 30, isFree: true },
  { id: 10, titleBn: 'রাউন্ড ১০: হেডলাইট ও দৃশ্যমানতার নিয়ম', titleIt: 'Round 10: Uso dei Fari e Visibilità', topicBadgeBn: '💡 বাতি ও লাইট', topicBadgeIt: 'Uso dei Fari e Luci', questionsCount: 30, isFree: true },
  { id: 11, titleBn: 'রাউন্ড ১১: অ্যালকোহল, ড্রাগস ও ফিটনেস', titleIt: 'Round 11: Guida in Stato di Ebbrezza e Punti', topicBadgeBn: '🍷 অ্যালকোহল ও পয়েন্ট', topicBadgeIt: 'Alcol, Droga e Punti', questionsCount: 30, isFree: true },
  { id: 12, titleBn: 'রাউন্ড ১২: প্রাথমিক চিকিৎসা ও দুর্ঘটনা', titleIt: 'Round 12: Primo Soccorso Stradale e Urgenze', topicBadgeBn: '🚑 ফার্স্ট এইড', topicBadgeIt: 'Primo Soccorso', questionsCount: 30, isFree: true },
  { id: 13, titleBn: 'রাউন্ড ১৩: গাড়ির ইঞ্জিন, ব্রেক ও মেকানিক্স', titleIt: 'Round 13: Meccanica, Motore e Freni', topicBadgeBn: '⚙️ যন্ত্রাংশ ও ব্রেক', topicBadgeIt: 'Motore, Freni e Gomme', questionsCount: 30, isFree: true },
  { id: 14, titleBn: 'রাউন্ড ১৪: ট্রাফিক মোড়ে গাড়ির ক্রসিং ক্রম', titleIt: 'Round 14: Ordine di Precedenza agli Incroci', topicBadgeBn: '🚸 মোড়ের ক্রম', topicBadgeIt: 'Incroci e Precedenze', questionsCount: 30, isFree: true },
  { id: 15, titleBn: 'রাউন্ড ১৫: পরিবেশবান্ধব ও নিরাপদ ড্রাইভিং', titleIt: 'Round 15: Guida Ecologica e Sicurezza Attiva', topicBadgeBn: '🌿 পরিবেশ ও জ্বালানি', topicBadgeIt: 'Ambiente ed Ecoguida', questionsCount: 30, isFree: true },
  { id: 16, titleBn: 'রাউন্ড ১৬: রাস্তার দাগ ও ট্রাফিক লাইট', titleIt: 'Round 16: Segnaletica Orizzontale e Semafori', topicBadgeBn: '🚦 ট্রাফিক লাইট ও দাগ', topicBadgeIt: 'Strisce e Semafori', questionsCount: 30, isFree: true },
  { id: 17, titleBn: 'রাউন্ড ১৭: সম্পূরক সাইনবোর্ড ও ফলক', titleIt: 'Round 17: Pannelli Integrativi dei Segnali', topicBadgeBn: '📋 সম্পূরক ফলক', topicBadgeIt: 'Pannelli Integrativi', questionsCount: 30, isFree: true },
  { id: 18, titleBn: 'রাউন্ড ১৮: সিটবেল্ট, এয়ারব্যাগ ও হেলমেট', titleIt: 'Round 18: Cinture di Sicurezza, Airbag e Casco', topicBadgeBn: '🛡️ সিটবেল্ট ও হেলমেট', topicBadgeIt: 'Cinture e Casco', questionsCount: 30, isFree: true },
  { id: 19, titleBn: 'রাউন্ড ১৯: ড্রাইভিং লাইসেন্স ক্যাটাগরি ও বয়স', titleIt: 'Round 19: Patenti di Guida, Categorie ed Età', topicBadgeBn: '🪪 লাইসেন্স ও ক্যাটাগরি', topicBadgeIt: 'Patenti e Documenti', questionsCount: 30, isFree: true },
  { id: 20, titleBn: 'রাউন্ড ২০: ফ্রি স্টাডি গ্র্যান্ড ফাইনাল মক টেস্ট', titleIt: 'Round 20: Test di Sbarramento Finale (20 Round)', topicBadgeBn: '🎓 গ্র্যান্ড ফাইনাল মক', topicBadgeIt: 'Simulazione Ufficiale 30Q', questionsCount: 30, isFree: true },

  // Pro Student Pass Rounds (Rounds 21 to 240)
  {
    id: 21,
    titleBn: 'রাউন্ড ২১ - ২৪০: সম্পূর্ণ ২২০টি ফুল থিওরি ও কুইজ ব্যাংক',
    titleIt: 'Round 21 - 240: Tutti i 7.100+ Quiz Ministeriali Ufficiali',
    topicBadgeBn: '⭐ প্রো স্টুডেন্ট পাস',
    topicBadgeIt: 'Tutti i 240 Round Ufficiali',
    questionsCount: 6565,
    isFree: false,
  },
];

interface RoundsMapProps {
  unlockedRound: number;
  completedRounds: Record<number, { errors: number; passed: boolean }>;
  onStartRound: (roundId: number) => void;
  onOpenPaywall: () => void;
  isVip: boolean;
  totalQuestionsAnswered: number;
  academyPriceEur?: number;
}

export const RoundsMap: React.FC<RoundsMapProps> = ({
  unlockedRound,
  completedRounds,
  onStartRound,
  onOpenPaywall,
  isVip,
  totalQuestionsAnswered,
  academyPriceEur = 49,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn">
      {/* Top Progression Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-slate-200 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-black text-orange-700">
              <Award className="w-4 h-4 text-[#FB6C00]" />
              <span>ধাপে ধাপে পাস করার রোডম্যাপ • Mappa dei 240 Round</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              লেভেল বাই লেভেল আনলক করুন
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed">
              প্রতিটি রাউন্ডে ৩০টি অফিশিয়াল কুইজ। সর্বোচ্চ ৩টি বা তার কম ভুল করলেই পরবর্তী রাউন্ড সঙ্গে সঙ্গে আনলক হয়ে যাবে!
            </p>
          </div>

          {/* Progress Tracker Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shrink-0 w-full md:w-80 space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500">ফ্রি ট্রায়াল কোটা:</span>
              <span className="text-[#FB6C00] font-mono text-sm font-black">
                {Math.min(600, totalQuestionsAnswered)} / 600 প্রশ্ন
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FB6C00] to-[#F9B637] transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (totalQuestionsAnswered / 600) * 100)}%` }}
              />
            </div>
            {!isVip && totalQuestionsAnswered >= 600 ? (
              <button
                type="button"
                onClick={onOpenPaywall}
                className="w-full py-2.5 px-3 rounded-xl bg-[#FB6C00] text-white font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:bg-orange-600"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Pro Student Pass (€{academyPriceEur})</span>
              </button>
            ) : isVip ? (
              <div className="text-xs font-black text-emerald-700 flex items-center justify-center gap-1.5 py-1 bg-emerald-50 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>প্রো স্টুডেন্ট পাস সক্রিয় (Pro Student)</span>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 text-center">
                ২০টি রাউন্ড (৬০০ প্রশ্ন) সম্পূর্ণ বিনামূল্যে ট্রায়াল
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Rounds Section with Bigger Eye-Catching Header */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <Flag className="w-6 h-6 text-[#FB6C00] shrink-0" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide">
                রাউন্ড তালিকা (১ - ২৪০) • <span className="text-[#FB6C00]">Lista dei Round</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              ধারাবাহিকভাবে রাউন্ডগুলো সম্পূর্ণ করুন। পরীক্ষায় পাস করতে সকল রাউন্ডে সবুজ টিক অর্জন করুন!
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-600 shrink-0 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" /> পাস
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Lock className="w-3.5 h-3.5" /> লক করা
            </span>
          </div>
        </div>

        {/* Rounds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ALL_ROUNDS.map((round) => {
            const isUnlocked = isVip ? true : (round.isFree && round.id <= unlockedRound);
            const roundResult = completedRounds[round.id];
            const isPassed = roundResult?.passed;
            const isCurrentActive = round.id === unlockedRound;

            return (
              <div
                key={round.id}
                className={`bg-white rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all duration-200 relative overflow-hidden border ${
                  isCurrentActive
                    ? 'border-[#FB6C00] ring-2 ring-orange-200 shadow-md scale-[1.01]'
                    : isPassed
                    ? 'border-emerald-200 shadow-sm hover:border-emerald-300'
                    : isUnlocked
                    ? 'border-slate-200 hover:border-slate-300 shadow-sm'
                    : 'opacity-80 border-slate-200 bg-slate-50/70'
                }`}
              >
                <div className="space-y-3 relative z-10">
                  {/* Top Bar: Topic Badge (Italian first) + Status */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    {/* Topic Badge: Italian First, then Bangla */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 border border-orange-200 dark:border-orange-800">
                      <span className="font-bold text-[#FB6C00]">{round.topicBadgeIt}</span>
                      <span className="text-slate-300 dark:text-slate-600 font-normal">|</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{round.topicBadgeBn}</span>
                    </div>

                    {/* Status Badge */}
                    {isPassed ? (
                      <span className="flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Promosso / Passed ({roundResult.errors} Errors)</span>
                      </span>
                    ) : roundResult ? (
                      <span className="flex items-center gap-1.5 text-xs font-black text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Bocciato / Not Passed ({roundResult.errors} Errors)</span>
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                        <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ready (আনলক করা)</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Pro Student Pass (€{academyPriceEur})</span>
                      </span>
                    )}
                  </div>

                  {/* Italian First, Bangla Second — Equal Font Size & Weight */}
                  <div className="space-y-1 pt-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug tracking-tight">
                      {round.titleIt}
                    </h3>
                    <p className="text-base sm:text-lg font-bold text-[#FB6C00] leading-snug tracking-tight">
                      {round.titleBn}
                    </p>
                  </div>

                  {/* Quick Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium pt-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FB6C00]" />
                      {round.questionsCount} Quiz (৩০টি কুইজ)
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">
                      Max 3 errors to pass (সর্বোচ্চ ৩টি ভুল)
                    </span>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 relative z-10">
                  <span className="text-xs font-bold text-slate-500">
                    {round.isFree ? (
                      <span className="text-emerald-700 font-bold">Free Trial (বিনামূল্যে)</span>
                    ) : isVip ? (
                      <span className="text-orange-700 font-bold">Pro Student Pass Active</span>
                    ) : (
                      <span className="text-slate-500">Requires Pro Pass (€{academyPriceEur})</span>
                    )}
                  </span>

                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => onStartRound(round.id)}
                      className={`py-2 px-5 rounded-xl font-black text-xs flex items-center gap-2 transition cursor-pointer shadow-sm ${
                        isCurrentActive
                          ? 'bg-[#FB6C00] text-white hover:bg-orange-600'
                          : isPassed
                          ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                          : 'bg-slate-900 dark:bg-slate-100 hover:bg-black dark:hover:bg-white text-white dark:text-slate-900'
                      }`}
                    >
                      {isPassed ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Retake (আবার দিন)</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Start Round (শুরু করুন)</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenPaywall}
                      className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Unlock with Pro Pass</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
