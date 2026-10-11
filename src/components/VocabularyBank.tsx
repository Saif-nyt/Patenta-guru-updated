import React, { useState } from 'react';
import { BookmarkCheck, Search, Volume2, AlertTriangle, Sparkles } from 'lucide-react';
import { COMPREHENSIVE_VOCABULARY, CATEGORIES } from '../data/vocabData';
import { speakItalian as playItalianFemaleVoice, stopSpeech } from '../utils/italianSpeech';

export const VocabularyBank: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  const speakItalian = (word: string) => {
    if (speakingWord === word) {
      stopSpeech();
      setSpeakingWord(null);
      return;
    }
    setSpeakingWord(word);
    playItalianFemaleVoice(word, {
      rate: 1.0,
      onStart: () => setSpeakingWord(word),
      onEnd: () => setSpeakingWord(null)
    });
  };

  const filteredVocab = COMPREHENSIVE_VOCABULARY.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    const matchesSearch =
      item.wordIt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaningBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phoneticBn && item.phoneticBn.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#12161F] rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-white/10 border border-orange-200 dark:border-white/15 text-xs font-black text-orange-800 dark:text-orange-200">
            <BookmarkCheck className="w-4 h-4 text-[#FB6C00]" />
            <span>অফিশিয়াল শব্দকোষ (Dizionario Ufficiale Ministeriale)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            ড্রাইভিং লাইসেন্স পরীক্ষার ১২০+ কঠিন শব্দার্থ
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
            ইতালিয়ান কুইজে বারবার আসা কঠিন শব্দগুলো এবং কুইজের ফাঁদ শব্দ (Trabocchetti) জানলে যেকোনো প্রশ্নের সঠিক উত্তর মুহূর্তেই দেওয়া সম্ভব। শব্দটির পাশে স্পিকার আইকনে চাপ দিয়ে খাঁটি ইতালিয়ান উচ্চারণ শুনে নিন।
          </p>
        </div>
      </div>

      {/* Category Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 shadow-sm ${
                isSelected
                  ? 'bg-[#FB6C00] text-white shadow-orange-500/20 font-black'
                  : 'bg-white dark:bg-[#12161F] hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
              }`}
            >
              <span>{cat.labelBn}</span>
              <span className="text-[11px] opacity-80 hidden md:inline">({cat.labelIt})</span>
            </button>
          );
        })}
      </div>

      {/* Search Input Box */}
      <div className="bg-white dark:bg-[#12161F] rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 border border-slate-200 dark:border-white/10 shadow-sm">
        <Search className="w-5 h-5 text-[#FB6C00] shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ইতালিয়ান বা বাংলায় শব্দ খুঁজুন (যেমন: Carreggiata, Sorpasso, ওভারটেকিং, পার্কিং)..."
          className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-lg transition"
          >
            মুছুন
          </button>
        )}
      </div>

      {/* Trap Words Advisory Note if Trap category is selected */}
      {selectedCategory === 'trap' && (
        <div className="p-4 rounded-2xl bg-orange-50 dark:bg-white/5 border border-orange-200 dark:border-white/10 text-orange-950 dark:text-orange-200 flex items-start gap-3 text-xs sm:text-sm shadow-sm animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-[#FB6C00] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-black text-orange-900 dark:text-[#FB6C00] text-sm">
              💡 কুইজের ফাঁদ শব্দের কৌশল (Trucchi e Trabocchetti):
            </strong>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              ইতালির কুইজে <strong>Mai, Sempre, Esclusivamente, Tassativamente</strong> জাতীয় চরম শব্দ থাকলে বেশিরভাগ ক্ষেত্রে উত্তর <strong className="text-rose-600 font-black">FALSO</strong> হয়। পক্ষান্তরে <strong>Di norma, Opportune cautele, Prudenza</strong> থাকলে বেশিরভাগ ক্ষেত্রে উত্তর <strong className="text-emerald-600 font-black">VERO</strong> হয়!
            </p>
          </div>
        </div>
      )}

      {/* Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVocab.map((item) => {
          const isSpeaking = speakingWord === item.wordIt;
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-[#12161F] rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4 transition hover:border-[#FB6C00] dark:hover:border-[#FB6C00] group border border-slate-200 dark:border-white/10 shadow-sm"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-[#FB6C00] transition tracking-tight">
                    {item.wordIt}
                  </span>
                  {item.phoneticBn && (
                    <span className="text-[11px] font-bold text-orange-800 dark:text-orange-200 bg-orange-50 dark:bg-white/10 px-2 py-0.5 rounded-full border border-orange-200 dark:border-white/15">
                      উচ্চারণ: {item.phoneticBn}
                    </span>
                  )}
                  {item.category === 'trap' && (
                    <span className="text-[10px] font-black text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                      ফাঁদ শব্দ
                    </span>
                  )}
                </div>

                {/* Bengali Meaning */}
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                  {item.meaningBn}
                </p>

                {/* Trap Alert Tag if available */}
                {item.trapAlert && (
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-800 dark:text-orange-200 bg-orange-50 dark:bg-white/10 px-2.5 py-1 rounded-xl border border-orange-200 dark:border-white/15">
                    <Sparkles className="w-3 h-3 text-[#FB6C00]" />
                    <span>{item.trapAlert}</span>
                  </div>
                )}
              </div>

              {/* Speak Audio Button */}
              <button
                type="button"
                onClick={() => speakItalian(item.wordIt)}
                title="ইতালিয়ান উচ্চারণ শুনুন (Pronuncia)"
                className={`p-2.5 rounded-xl border transition cursor-pointer shrink-0 ${
                  isSpeaking
                    ? 'bg-[#FB6C00] text-white border-[#FB6C00] shadow-sm animate-pulse'
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {filteredVocab.length === 0 && (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm bg-white dark:bg-[#12161F] rounded-2xl space-y-2 border border-slate-200 dark:border-white/10 shadow-sm">
          <p className="text-base font-bold text-slate-800 dark:text-slate-200">কোনো শব্দ খুঁজে পাওয়া যায়নি</p>
          <p>বানান ঠিক আছে কিনা দেখে আবার খুঁজুন অথবা ক্যাটাগরি পরিবর্তন করুন।</p>
        </div>
      )}
    </div>
  );
};
