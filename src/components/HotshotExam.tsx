import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Volume2,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { HOTSHOT_QUESTIONS } from '../data/hotshotQuestions';
import { RoadSign } from './RoadSign';
import { getBanglaTranslation } from '../utils/patenteTranslator';
import { speakItalian as playItalianFemaleVoice } from '../utils/italianSpeech';

interface HotshotExamProps {
  onRecordMistake?: (id: string) => void;
}

export const HotshotExam: React.FC<HotshotExamProps> = ({ onRecordMistake }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, boolean>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isExamCompleted, setIsExamCompleted] = useState(false);

  const currentQ = HOTSHOT_QUESTIONS[currentIndex];
  const hasAnsweredCurrent = userAnswers[currentIndex] !== undefined;
  const isCurrentCorrect = hasAnsweredCurrent && userAnswers[currentIndex] === currentQ.isCorrect;

  const handleAnswer = (choice: boolean) => {
    if (hasAnsweredCurrent) return;

    setUserAnswers((prev) => ({ ...prev, [currentIndex]: choice }));
    setShowExplanation(true);

    if (choice !== currentQ.isCorrect && onRecordMistake) {
      onRecordMistake(currentQ.id);
    }
  };

  const handleNext = () => {
    if (currentIndex < HOTSHOT_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowExplanation(false);
    } else {
      setIsExamCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setShowExplanation(false);
    setIsExamCompleted(false);
  };

  const speakItalian = (text: string) => {
    playItalianFemaleVoice(text, { rate: 1.0 });
  };

  const totalAnswered = Object.keys(userAnswers).length;
  const correctCount = Object.entries(userAnswers).filter(
    ([idx, ans]) => HOTSHOT_QUESTIONS[Number(idx)].isCorrect === ans
  ).length;
  const wrongCount = totalAnswered - correctCount;

  if (isExamCompleted) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-[#12161F] rounded-3xl p-8 text-center space-y-6 animate-fadeIn border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-white/10 flex items-center justify-center mx-auto text-[#FB6C00] border border-orange-200 dark:border-white/15 shadow-sm">
          <Flame className="w-8 h-8 fill-current text-[#FB6C00]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Hotshot Questions Completed!</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            আপনি অফিশিয়াল কুইজের সর্বাধিক কঠিন ও বিভ্রান্তিকর ৭৫টি ফাঁদ প্রশ্ন সফলভাবে অনুশীলন করেছেন।
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">সঠিক উত্তর</span>
            <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400">{correctCount}</span>
          </div>
          <div className="rounded-2xl p-4 border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300 block">ভুল উত্তর</span>
            <span className="text-3xl font-black text-rose-700 dark:text-rose-400">{wrongCount}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="py-3 px-6 rounded-xl bg-[#FB6C00] hover:bg-[#e05f00] text-white font-black text-sm transition cursor-pointer flex items-center justify-center gap-2 mx-auto shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>পুনরায় শুরু করুন</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#12161F] rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-xs font-black text-orange-800 dark:text-orange-200">
              <Flame className="w-4 h-4 text-[#FB6C00] fill-current" />
              <span>Hotshot Questions • Top 75 Trabocchetti Ministeriali</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Hotshot Questions (৭৫টি শীর্ষ ট্রিক প্রশ্ন)
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
              ৭,১০০+ অফিসিয়াল কুইজের মধ্য থেকে সংগৃহীত সর্বাধিক ভুল হওয়া ৭৫টি শীর্ষ ট্র্যাপ প্রশ্ন। প্রতিটি প্রশ্নের পেছনের গোপন ফাঁদ ও নিয়ম আয়ত্ত করুন।
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">অগ্রগতি</span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                {currentIndex + 1} / {HOTSHOT_QUESTIONS.length}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-white/10 border border-orange-200 dark:border-white/15 flex items-center justify-center font-black text-xs text-[#FB6C00]">
              {Math.round(((currentIndex + 1) / HOTSHOT_QUESTIONS.length) * 100)}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FB6C00] transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / HOTSHOT_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-[#12161F] rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-200 dark:border-white/10 shadow-sm relative">
        {/* Top Topic Badge & Audio */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-black bg-orange-50 dark:bg-white/10 text-[#FB6C00] border border-orange-200 dark:border-white/15">
              {currentQ.chapterTitleBn}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              ({currentQ.chapterTitleIt})
            </span>
          </div>

          <button
            type="button"
            onClick={() => speakItalian(currentQ.questionIt)}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="ইতালিয়ান অডিও শুনুন"
          >
            <Volume2 className="w-4 h-4 text-[#FB6C00]" />
            <span className="hidden sm:inline">অডিও</span>
          </button>
        </div>

        {/* Road Sign Image if available */}
        {currentQ.image && (
          <div className="flex justify-center py-2">
            <RoadSign code={String(currentQ.image)} size={120} />
          </div>
        )}

        {/* Questions: Equal Font Prominence */}
        <div className="space-y-4">
          {/* Italian Question */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Official Ministerial Italian:
            </span>
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              "{currentQ.questionIt}"
            </p>
          </div>

          {/* Bengali Question */}
          <div className="p-4 sm:p-5 rounded-xl bg-orange-50/50 dark:bg-white/5 border border-orange-200/70 dark:border-white/10">
            <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
              {getBanglaTranslation(currentQ.questionIt, currentQ.questionBn)}
            </p>
          </div>
        </div>

        {/* True / False Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            type="button"
            disabled={hasAnsweredCurrent}
            onClick={() => handleAnswer(true)}
            className={`py-3.5 px-4 rounded-xl font-black text-sm sm:text-base transition cursor-pointer flex items-center justify-center gap-2 border shadow-sm ${
              hasAnsweredCurrent
                ? currentQ.isCorrect === true
                  ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-200 dark:ring-emerald-900'
                  : userAnswers[currentIndex] === true
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/10 opacity-50'
                : 'bg-white hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>VERO (সত্য)</span>
          </button>

          <button
            type="button"
            disabled={hasAnsweredCurrent}
            onClick={() => handleAnswer(false)}
            className={`py-3.5 px-4 rounded-xl font-black text-sm sm:text-base transition cursor-pointer flex items-center justify-center gap-2 border shadow-sm ${
              hasAnsweredCurrent
                ? currentQ.isCorrect === false
                  ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-200 dark:ring-emerald-900'
                  : userAnswers[currentIndex] === false
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/10 opacity-50'
                : 'bg-white hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-800 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 hover:border-rose-500'
            }`}
          >
            <XCircle className="w-5 h-5" />
            <span>FALSO (মিথ্যা)</span>
          </button>
        </div>

        {/* Answer Breakdown & Trap Warning */}
        {showExplanation && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/10 animate-fadeIn">
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 font-black text-sm ${
                isCurrentCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
              }`}
            >
              {isCurrentCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>
                {isCurrentCorrect
                  ? 'দারুণ! আপনি সঠিক উত্তর দিয়েছেন (' + (currentQ.isCorrect ? 'VERO' : 'FALSO') + ')'
                  : 'ভুল উত্তর! সঠিক উত্তর হলো: ' + (currentQ.isCorrect ? 'VERO (সত্য)' : 'FALSO (মিথ্যা)')}
              </span>
            </div>

            {/* Trap Tip Banner */}
            {currentQ.trapTipBn && (
              <div className="p-4 rounded-xl bg-orange-50 dark:bg-white/5 border border-orange-200 dark:border-white/10 text-orange-900 dark:text-orange-200 space-y-1 text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-black text-[#FB6C00]">
                  <AlertTriangle className="w-4 h-4 text-[#FB6C00]" />
                  <span>এই প্রশ্নের ফাঁদ (Il Trabocchetto):</span>
                </div>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">{currentQ.trapTipBn}</p>
              </div>
            )}

            {/* Detailed Bengali Explanation */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-black text-[#FB6C00]">
                <BookOpen className="w-4 h-4" />
                <span>বিস্তারিত নিয়ম ও ব্যাখ্যা:</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{currentQ.explanationBn}</p>
            </div>

            {/* Tricky Vocabulary in question */}
            {currentQ.vocabulary && currentQ.vocabulary.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  শব্দার্থ (Vocaboli Chiave):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentQ.vocabulary.map((v, i) => (
                    <div key={i} className="text-xs bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="font-black text-slate-900 dark:text-white">{v.wordIt}</span>
                      <span className="text-slate-600 dark:text-slate-300 font-medium">{v.meaningBn}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 rounded-xl bg-[#FB6C00] hover:bg-[#e05f00] text-white font-black text-sm shadow-sm transition flex items-center gap-2 cursor-pointer shadow-[#FB6C00]/25"
              >
                <span>পরবর্তী প্রশ্ন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
