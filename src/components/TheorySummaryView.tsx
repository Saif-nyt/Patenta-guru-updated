import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  Volume2, 
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { THEORY_CHAPTERS, type TheoryChapter } from '../data/theoryData';
import { speakItalian as playItalianFemaleVoice, stopSpeech } from '../utils/italianSpeech';

interface TheorySummaryViewProps {
  onStartRound: (roundId: number) => void;
  onOpenExamSim?: () => void;
  isVip?: boolean;
  onOpenEnrollment?: () => void;
  academyPriceEur?: number;
  regularPriceEur?: number;
}

export const TheorySummaryView: React.FC<TheorySummaryViewProps> = ({
  onStartRound,
  isVip = false,
  onOpenEnrollment,
  academyPriceEur = 49,
  regularPriceEur = 120,
}) => {
  const activePrice = academyPriceEur || 49;
  const regularPrice = regularPriceEur || 120;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingRule, setPlayingRule] = useState<string | null>(null);

  const speakItalian = (text: string) => {
    if (playingRule === text) {
      stopSpeech();
      setPlayingRule(null);
      return;
    }
    setPlayingRule(text);
    playItalianFemaleVoice(text, {
      rate: 1.0,
      onStart: () => setPlayingRule(text),
      onEnd: () => setPlayingRule(null)
    });
  };

  const filteredChapters = THEORY_CHAPTERS.filter((ch) => {
    const matchesCategory = selectedCategory === 'all' || ch.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesSearch = 
      ch.titleIt.toLowerCase().includes(query) ||
      ch.titleBn.toLowerCase().includes(query) ||
      ch.summaryBn.toLowerCase().includes(query) ||
      ch.goldenRules.some(r => r.it.toLowerCase().includes(query) || r.bn.toLowerCase().includes(query)) ||
      ch.trapKeywords.some(k => k.word.toLowerCase().includes(query) || k.meaningBn.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Header Banner (Adaptive Mesh Ambient Style) */}
      <div className="bg-gradient-to-r from-[#170E18] via-[#0D1117] to-[#18110E] rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E52E2D]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-[#FB6C00]/12 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-slate-200">
            <BookOpen className="w-3.5 h-3.5 text-white" />
            <span>25 Official Ministerial Chapters • ২৫টি অধ্যায়ের থিওরি সারসংক্ষেপ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Theory Summaries &amp; Exam Trap Keywords
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            কোনো দীর্ঘ বই মুখস্থ করার দরকার নেই। প্রতিটি অধ্যায়ের ৩টি গোল্ডেন রুলস এবং পরীক্ষার ফাঁদ শব্দগুলো মাত্র ৯০ সেকেন্ডে আয়ত্ত করুন।
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অধ্যায় বা কিওয়ার্ড দিয়ে খুঁজুন (e.g. Sosta, Carreggiata, Precedenza)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#12161F] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-slate-400 dark:focus:border-white/30 focus:ring-1 focus:ring-slate-300 dark:focus:ring-white/20 transition shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none no-scrollbar">
          {[
            { id: 'all', label: 'All 25 Chapters (সব অধ্যায়)' },
            { id: 'signals', label: 'Road Signs (চিহ্ন)' },
            { id: 'rules', label: 'Traffic Rules (নিয়মাবলী)' },
            { id: 'safety', label: 'Safety & First Aid (নিরাপত্তা)' },
            { id: 'mechanics', label: 'Vehicle & Mechanics (গাড়ি)' },
            { id: 'legal', label: 'License & Insurance (কাগজপত্র)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] text-white font-black shadow-md shadow-[#FB6C00]/20'
                  : 'bg-white dark:bg-[#12161F] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#181F2C] border border-slate-200 dark:border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chapter Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {filteredChapters.map((chapter: TheoryChapter) => (
          <div
            key={chapter.id}
            className="bg-white dark:bg-[#12161F] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-sm hover:border-slate-300 dark:hover:border-white/25 transition-all overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-4 sm:p-5 bg-slate-50/80 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E52E2D] to-[#FB6C00] text-white font-black flex items-center justify-center text-sm shadow-md shadow-[#FB6C00]/25 shrink-0">
                  {chapter.chapterNumber}
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {chapter.titleBn}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#FB6C00] tracking-wide">
                    {chapter.titleIt}
                  </p>
                </div>
              </div>

              {/* Start Quiz for this Chapter (Pill Button Matching Other Action Buttons) */}
              <button
                type="button"
                onClick={() => onStartRound(chapter.relatedRounds[0] || 1)}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:from-[#d02524] hover:to-[#e55e00] text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-[#FB6C00]/25 active:scale-95"
              >
                <span>Practice Chapter</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Card Body */}
            <div className="p-4 sm:p-6 space-y-5">
              {/* Summary Description */}
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-white/5 p-3.5 rounded-xl border border-slate-200 dark:border-white/10">
                💡 <span className="font-bold text-slate-900 dark:text-white">Chapter Overview:</span> {chapter.summaryBn}
              </p>

              {/* 3 Golden Rules */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-200">
                  <Sparkles className="w-4 h-4 text-[#FB6C00]" />
                  <span>Golden Rules (Direct Ministerial Takeaways):</span>
                </div>

                <div className="space-y-2.5">
                  {chapter.goldenRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5 relative group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#FB6C00] shrink-0 mt-0.5" />
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            "{rule.it}"
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => speakItalian(rule.it)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/15 transition shrink-0 cursor-pointer"
                          title="Listen Italian pronunciation"
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${playingRule === rule.it ? 'animate-pulse text-[#FB6C00]' : ''}`} />
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium pl-6 leading-relaxed">
                        👉 <span className="font-bold text-slate-800 dark:text-slate-200">সহজ বাংলা অর্থ:</span> {rule.bn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trap Keywords */}
              {chapter.trapKeywords.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#E52E2D]">
                    <AlertTriangle className="w-4 h-4 text-[#E52E2D]" />
                    <span>Exam Trap Keywords to Watch Out For:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {chapter.trapKeywords.map((trap, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-black text-[#E52E2D] bg-[#E52E2D]/10 px-2 py-0.5 rounded-md border border-[#E52E2D]/20">
                            ⚠️ {trap.word}
                          </span>
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                            ({trap.meaningBn})
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed pt-1">
                          {trap.trapNoteBn}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="px-5 py-3 bg-slate-50/80 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Related Practice: <strong className="text-slate-900 dark:text-slate-200">Round #{chapter.relatedRounds.join(', #')}</strong></span>
              <button
                type="button"
                onClick={() => onStartRound(chapter.relatedRounds[0] || 1)}
                className="text-slate-900 dark:text-white font-black hover:text-[#FB6C00] dark:hover:text-[#FB6C00] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Start Practice</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Strategic Bottom Academy Enrollment Banner for Theory Readers */}
      {!isVip && onOpenEnrollment && (
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#1A1215] via-[#12161F] to-[#1D130E] border border-orange-500/30 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fadeIn mt-6">
          <div className="space-y-2 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-xs font-black text-orange-400">
              <GraduationCap className="w-4 h-4 text-orange-400" />
              <span>Patente Bangla Academy Pro Pass • এককালীন মাত্র €{activePrice}{regularPrice > activePrice ? ` (নিয়মিত €${regularPrice})` : ''}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              থিওরি রিভিশন শেষ? এবার ২৪০ রাউন্ডের কুইজ দিয়ে ১০০% প্রস্তুতি নিন
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              শুধুমাত্র নিয়ম মুখস্থ নয়, ইতালির অফিসিয়াল ২০২৬ পরিবহন মন্ত্রণালয়ের সব ৭,১৬৫টি কুইজ বাংলায় বুঝে বুঝে সমাধান করতে আজই একাডেমিতে ভর্তি হন।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenEnrollment}
              className="w-full sm:w-auto py-3 px-8 rounded-full bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:from-[#d02524] hover:to-[#e55e00] text-white font-black text-sm shadow-xl shadow-[#FB6C00]/30 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 text-center"
            >
              <GraduationCap className="w-4 h-4 text-white" />
              <span>একাডেমিতে ভর্তি হন (€{activePrice})</span>
            </button>
            <span className="text-[11px] text-slate-400 font-semibold text-center">
              লাইফটাইম এক্সেস • একবার ফি দিয়ে পাস করা পর্যন্ত
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
