import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Play, 
  Search, 
  GraduationCap
} from 'lucide-react';
import { getRoundTopic } from '../data/roundCurriculumData';

interface RoundsCurriculumViewProps {
  currentRoundId: number;
  unlockedRound?: number;
  isVip?: boolean;
  freeRoundsLimit?: number;
  academyPriceEur?: number;
  regularPriceEur?: number;
  onSelectRound: (roundId: number) => void;
  onTriggerEnrollment: (roundId: number) => void;
  completedRounds?: Record<number, { errors: number; passed: boolean }>;
}

export const RoundsCurriculumView: React.FC<RoundsCurriculumViewProps> = ({
  currentRoundId: _currentRoundId,
  unlockedRound: _unlockedRound,
  isVip = false,
  freeRoundsLimit = 20,
  academyPriceEur = 49,
  regularPriceEur = 120,
  onSelectRound,
  onTriggerEnrollment,
  completedRounds = {},
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'free' | 'pro' | 'passed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic Free Rounds Limit (sanitized between 0 and 240)
  const effectiveFreeLimit = Math.min(240, Math.max(0, freeRoundsLimit));

  // Total 240 rounds
  const totalRounds = 240;
  // Strict sequential unlock: round N+1 is unlocked only if rounds 1..N have been completed and passed.
  const safeCompleted = completedRounds || {};
  let sequentialUnlocked = 1;
  while (safeCompleted[sequentialUnlocked]?.passed === true && sequentialUnlocked < totalRounds) {
    sequentialUnlocked++;
  }
  const effectiveUnlocked = sequentialUnlocked;

  const rounds = Array.from({ length: totalRounds }, (_, i) => {
    const id = i + 1;
    const isFree = id <= effectiveFreeLimit;
    const result = safeCompleted[id];
    
    // Resolve unique official Italian and Bangla topic for every round 1 to 240
    const topic = getRoundTopic(id);

    return {
      id,
      isFree,
      titleIt: topic.titleIt,
      titleBn: topic.titleBn,
      badgeIt: topic.badgeIt,
      badgeBn: topic.badgeBn,
      category: topic.category,
      result,
    };
  });

  const filteredRounds = rounds.filter((r) => {
    if (filterTab === 'free' && !r.isFree) return false;
    if (filterTab === 'pro' && r.isFree) return false;
    if (filterTab === 'passed' && !r.result?.passed) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = String(r.id) === q || `round ${r.id}`.includes(q) || `রাউন্ড ${r.id}`.includes(q);
      const matchTopicIt = r.titleIt.toLowerCase().includes(q) || (r.badgeIt && r.badgeIt.toLowerCase().includes(q));
      const matchTopicBn = r.titleBn.toLowerCase().includes(q) || (r.badgeBn && r.badgeBn.toLowerCase().includes(q));
      return matchNum || matchTopicIt || matchTopicBn;
    }

    return true;
  });

  const freeRoundsCount = effectiveFreeLimit;
  const proRoundsCount = Math.max(0, totalRounds - effectiveFreeLimit);
  const passedCount = Object.values(safeCompleted).filter(r => r?.passed).length;

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Top Academic Banner (Adobe Mesh Ambient Style) */}
      <div className="bg-gradient-to-r from-[#170E18] via-[#0D1117] to-[#18110E] rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E52E2D]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-[#FB6C00]/12 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-slate-200">
            <GraduationCap className="w-4 h-4 text-white" />
            <span>অফিসিয়াল ইতালিয়ান ড্রাইভিং লাইসেন্স সিলেবাস (Corso Ufficiale)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            ২৪০ রাউন্ডের সম্পূর্ণ সিলেবাস (240 Schede Quiz)
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {effectiveFreeLimit === 0
              ? 'ধারাবাহিক অগ্রগতি: প্রতিটি রাউন্ড পাস করলে (সর্বোচ্চ ৩টি ভুল) পরবর্তী রাউন্ড স্বয়ংক্রিয়ভাবে আনলক হবে। একাডেমি মেম্বারশিপে সম্পূর্ণ ২৪০টি রাউন্ড আনলক থাকে।'
              : effectiveFreeLimit >= 240
              ? 'ধারাবাহিক অগ্রগতি: প্রতিটি রাউন্ড পাস করলে (সর্বোচ্চ ৩টি ভুল) পরবর্তী রাউন্ড স্বয়ংক্রিয়ভাবে আনলক হবে। সব ২৪০ রাউন্ড সবার জন্য উন্মুক্ত।'
              : `ধারাবাহিক অগ্রগতি: প্রতিটি রাউন্ড পাস করলে (সর্বোচ্চ ৩টি ভুল) পরবর্তী রাউন্ড স্বয়ংক্রিয়ভাবে আনলক হবে। ১ থেকে ${effectiveFreeLimit} রাউন্ড সবার জন্য সম্পূর্ণ ফ্রি।`}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold">
            <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-slate-200">
              🟢 বর্তমান আনলক: <span className="text-white font-black">রাউন্ড #{effectiveUnlocked}</span>
            </div>
            {effectiveFreeLimit < 240 && (
              <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-slate-200">
                🎓 একাডেমি প্রো: <span className="text-slate-100 font-black">রাউন্ড {effectiveFreeLimit + 1}–২৪০ (€{academyPriceEur}{regularPriceEur > academyPriceEur ? ` / ছাড়ের পূর্বে €${regularPriceEur}` : ''} • পাস করা পর্যন্ত এক্সেস)</span>
              </div>
            )}
            <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-slate-200">
              ✅ পাস করা রাউন্ড: <span className="text-white font-black">{passedCount} / ২৪০</span>
            </div>
            {!isVip && (
              <button
                type="button"
                onClick={() => onTriggerEnrollment(Math.max(effectiveUnlocked, effectiveFreeLimit + 1))}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:from-[#d02524] hover:to-[#e55e00] text-white font-black text-xs shadow-md shadow-[#FB6C00]/25 transition hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5 text-white" />
                <span>💳 Pay Now (€{academyPriceEur}) / ভর্তি হন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Strategic Pro Academy Enrollment Banner for Non-VIP students */}
      {!isVip && effectiveFreeLimit < 240 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-red-500/10 border border-orange-500/30 text-slate-900 dark:text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E52E2D] to-[#FB6C00] flex items-center justify-center text-white shrink-0 shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                সম্পূর্ণ ২৪০টি রাউন্ড আনলক করতে চান?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                অফিসিয়াল একাডেমি প্রো মেম্বারশিপে লাইফটাইম এক্সেস, ৭,১৬৫টি কুইজ, অডিও উচ্চারণ ও আনলিমিটেড মক টেস্ট সুবিধা পান।
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onTriggerEnrollment(effectiveFreeLimit + 1)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:from-[#d02524] hover:to-[#e55e00] text-white font-black text-xs sm:text-sm shadow-md shadow-[#FB6C00]/25 hover:scale-105 active:scale-95 transition shrink-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <GraduationCap className="w-4 h-4 text-white" />
            <span>💳 Pay Now (€{academyPriceEur}) / এখনই ভর্তি হন</span>
          </button>
        </div>
      )}

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="রাউন্ড নম্বর বা অধ্যায় খুঁজুন (যেমন: Round 5, Precedenze, Segnali)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#12161F] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-slate-400 dark:focus:border-white/30 focus:ring-1 focus:ring-slate-300 dark:focus:ring-white/20 transition shadow-xs"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: `সব রাউন্ড (${totalRounds})` },
            { id: 'free', label: `ফ্রি রাউন্ড (${freeRoundsCount})` },
            { id: 'pro', label: `পেইড রাউন্ড (${proRoundsCount})` },
            { id: 'passed', label: `পাস হয়েছে (${passedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] text-white font-black shadow-md shadow-[#FB6C00]/20'
                  : 'bg-white dark:bg-[#12161F] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#181F2C] border border-slate-200 dark:border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modern 240 Rounds Grid (Clean Adaptive Cards with Italian First, then Bangla) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredRounds.map((round) => {
          const isPassed = round.result?.passed === true;
          // Unlocking logic: VIP students have ALL 240 rounds completely unlocked!
          // Non-VIP students follow sequential progression
          const isUnlocked = isVip || round.id <= effectiveUnlocked;
          const isCurrent = round.id === effectiveUnlocked;
          const isPaidSyllabus = round.id > effectiveFreeLimit && !isVip;

          return (
            <div
              key={round.id}
              className={`rounded-2xl border p-5 sm:p-5.5 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl relative flex flex-col justify-between min-h-[225px] ${
                isCurrent
                  ? 'bg-white dark:bg-[#161C28] border-slate-900/30 dark:border-[#FB6C00]/40 ring-2 ring-slate-900/10 dark:ring-[#FB6C00]/20 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(251,108,0,0.15)]'
                  : isPassed
                  ? 'bg-white dark:bg-[#12161F] border-emerald-500/30 dark:border-emerald-500/20 hover:border-emerald-500/50 shadow-xs'
                  : isUnlocked
                  ? 'bg-white dark:bg-[#12161F] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25 shadow-xs'
                  : 'bg-slate-50 dark:bg-[#0E121A] border-slate-200 dark:border-white/5 opacity-80'
              }`}
            >
              <div className="space-y-3">
                {/* Card Top Header: Round Pill & Live Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0 shadow-xs ${
                        isCurrent
                          ? 'bg-gradient-to-br from-[#E52E2D] to-[#FB6C00] text-white shadow-md shadow-[#FB6C00]/30'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : round.isFree
                          ? 'bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-slate-200 border border-slate-200 dark:border-white/15'
                          : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                      }`}
                    >
                      {round.id < 10 ? `0${round.id}` : round.id}
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-slate-200">
                      Round #{round.id}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  {isPassed ? (
                    <span className="flex items-center gap-1 text-[11px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{30 - (round.result?.errors ?? 0)}/৩০ পাস</span>
                    </span>
                  ) : isCurrent ? (
                    <span className="flex items-center gap-1.5 text-[11px] font-black text-white bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] px-2.5 py-1 rounded-full shadow-sm shadow-[#FB6C00]/25 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-white" />
                      <span>রানিং রাউন্ড</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-black text-white bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] px-2.5 py-1 rounded-full shadow-sm shadow-[#FB6C00]/25">
                      {!isUnlocked && <Lock className="w-3 h-3 text-white/90" />}
                      <span>{round.isFree ? 'ফ্রি রাউন্ড' : 'পেইড রাউন্ড'}</span>
                    </span>
                  )}
                </div>

                {/* Card Title: Category Badge + Italian First, then Bengali */}
                <div className="pt-1 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/15">
                      {round.badgeBn}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      • {round.badgeIt}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-[17px] font-black text-slate-900 dark:text-white leading-snug tracking-tight">
                    {round.titleIt}
                  </h3>
                  <p className="text-xs sm:text-[13px] font-bold text-slate-600 dark:text-slate-300 pt-0.5 leading-snug">
                    {round.titleBn}
                  </p>
                </div>

                {/* Exam Specs (Bangla) */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10.5px] font-bold text-slate-600 dark:text-slate-300">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200">
                    ৩০টি প্রশ্ন
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200">
                    ২০ মিনিট
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200">
                    সর্বোচ্চ ৩ ভুল
                  </span>
                </div>
              </div>

              {/* Action Button (Bangla & Italian) */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/10 mt-3">
                {isPaidSyllabus ? (
                  <button
                    type="button"
                    onClick={() => onTriggerEnrollment(round.id)}
                    className="w-full py-2.5 px-3 rounded-full bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:opacity-90 text-white font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
                  >
                    <GraduationCap className="w-4 h-4 text-white" />
                    <span>একাডেমিতে ভর্তি হন (Iscriviti - €{academyPriceEur})</span>
                  </button>
                ) : !isUnlocked ? (
                  <button
                    type="button"
                    onClick={() => alert(`🔒 রাউন্ড #${round.id} এখনও আনলক হয়নি। দয়া করে প্রথমে পূর্ববর্তী রাউন্ড #${round.id - 1} সফলভাবে পাস করুন (সর্বোচ্চ ৩টি ভুল)।`)}
                    className="w-full py-2.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-300 dark:border-white/15 transition cursor-pointer"
                    title={`রাউন্ড #${round.id - 1} পাস করে আনলক করুন`}
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>রাউন্ড #{round.id - 1} পাস করে আনলক করুন</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectRound(round.id)}
                    className={`w-full py-2.5 px-3 rounded-full font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md active:scale-95 ${
                      isCurrent
                        ? 'bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:from-[#d02524] hover:to-[#e55e00] text-white shadow-lg shadow-[#FB6C00]/25'
                        : isPassed
                        ? 'bg-slate-800 hover:bg-slate-900 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white border border-slate-700 dark:border-white/20'
                        : 'bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:from-[#d02524] hover:to-[#e55e00] text-white shadow-lg shadow-[#FB6C00]/25'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-white" />
                    <span>
                      {isCurrent 
                        ? 'পরীক্ষা শুরু করুন (Inizia Round)' 
                        : isPassed 
                        ? 'আবার অনুশীলন করুন (Ripeti Quiz)' 
                        : 'কুইজ শুরু করুন (Inizia Round)'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
