import React, { useState, useEffect } from 'react';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  Lightbulb,
  AlertTriangle,
  Languages,
  Headphones,
  Copy,
  Check
} from 'lucide-react';
import type { QuizQuestion } from '../data/quizData';
import { RoadSign } from './RoadSign';
import { getBanglaTranslation, getEnglishTranslation } from '../utils/patenteTranslator';
import { speakItalian as playItalianFemaleVoice, stopSpeech } from '../utils/italianSpeech';

interface QuizCardProps {
  question: QuizQuestion;
  index: number;
  userAnswer?: boolean | null;
  onAnswer: (answer: boolean) => void;
  showInstantResult?: boolean;
  isExamSubmitted?: boolean;
  hideAnswerButtons?: boolean;
  hideAnswerButtonsOnMobile?: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  index,
  userAnswer,
  onAnswer,
  showInstantResult = true,
  isExamSubmitted = false,
  hideAnswerButtons = false,
  hideAnswerButtonsOnMobile = false,
}) => {
  const [showBanglaTranslation, setShowBanglaTranslation] = useState(true);
  const [showEnglishTranslation, setShowEnglishTranslation] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0); // Regular human reading speed
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyQuestion = async (text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setIsCopied(false);
    }
  };

  // Stop any playing speech whenever the active question changes or card unmounts
  useEffect(() => {
    setIsSpeaking(false);
    return () => {
      stopSpeech();
    };
  }, [question.id, question.questionIt]);

  // Audio pronunciation using natural Italian female voice at regular speed
  const speakItalian = (text: string) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }
    playItalianFemaleVoice(text, {
      rate: speechRate,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false)
    });
  };

  const isAnswered = userAnswer !== null && userAnswer !== undefined;
  const isCorrect = isAnswered && userAnswer === question.isCorrect;
  const shouldRevealOutcome = showInstantResult && isAnswered;

  return (
    <div
      className={`bg-white dark:bg-[#12161F] rounded-2xl p-5 sm:p-7 space-y-5 transition-all duration-200 relative overflow-hidden border shadow-xs dark:shadow-sm min-h-[380px] flex flex-col justify-between ${
        shouldRevealOutcome
          ? isCorrect
            ? 'border-emerald-500/50 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20'
            : 'border-rose-500/50 ring-2 ring-rose-500/20 bg-rose-50/20 dark:bg-rose-950/20'
          : 'border-slate-200 dark:border-white/10'
      }`}
    >
      <div className="space-y-4">
        {/* Top Header: Question # and Category */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-xs border-b border-slate-200 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white font-black border border-slate-200 dark:border-white/15 text-xs">
              Question #{index + 1}
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-bold hidden md:inline truncate max-w-[200px]">
              {question.chapterTitleIt}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Audio Speed Toggle */}
            <button
              type="button"
              onClick={() => setSpeechRate(speechRate === 1.0 ? 0.85 : 1.0)}
              className="px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
              title="Speech Speed"
            >
              <span>{speechRate === 1.0 ? '1.0x (Regular)' : '0.85x (Slow)'}</span>
            </button>

            {/* Oral Exam Headphone Audio Button */}
            <button
              type="button"
              onClick={() => speakItalian(question.questionIt)}
              title="Listen official Italian pronunciation (Oral Exam Mode)"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition cursor-pointer text-xs font-bold shadow-2xs ${
                isSpeaking
                  ? 'bg-[#FB6C00] text-white border-[#FB6C00] font-black animate-pulse shadow-md shadow-[#FB6C00]/25'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10'
              }`}
            >
              <Headphones className={`w-3.5 h-3.5 shrink-0 ${isSpeaking ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`} />
              <span>{isSpeaking ? 'Playing...' : 'Audio'}</span>
            </button>

            {/* English Translation Toggle */}
            <button
              type="button"
              onClick={() => setShowEnglishTranslation(!showEnglishTranslation)}
              title="Toggle English Translation"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition cursor-pointer text-xs font-bold ${
                showEnglishTranslation
                  ? 'bg-blue-600 text-white border-transparent shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
              }`}
            >
              <span className="text-xs">🇬🇧</span>
              <span>{showEnglishTranslation ? 'English: ON' : 'English: OFF'}</span>
            </button>

            {/* Bangla Translation Toggle */}
            <button
              type="button"
              onClick={() => setShowBanglaTranslation(!showBanglaTranslation)}
              title="Toggle Bengali Meaning"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition cursor-pointer text-xs font-bold ${
                showBanglaTranslation
                  ? 'bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] text-white border-transparent shadow-sm shadow-[#FB6C00]/20'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
              }`}
            >
              <Languages className={`w-3.5 h-3.5 shrink-0 ${showBanglaTranslation ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`} />
              <span>{showBanglaTranslation ? 'বাংলা: ON' : 'বাংলা: OFF'}</span>
            </button>
          </div>
        </div>

        {/* Question Content Area: Side-by-Side on Desktop if Sign Exists */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch min-h-[160px]">
          {/* Road Sign Graphic (if present) */}
          {(question.signCode || question.image) && (
            <div className="md:col-span-4 flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-inner">
              <RoadSign code={question.signCode || String(question.image)} size={110} />
              {question.signSymbol && (
                <span className="mt-2 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/10 px-3 py-0.5 rounded-full border border-slate-200 dark:border-white/15 shadow-xs">
                  {question.signSymbol}
                </span>
              )}
            </div>
          )}

          {/* Question Text Area */}
          <div className={`${(question.signCode || question.image) ? 'md:col-span-8' : 'md:col-span-12'} flex flex-col justify-between gap-3`}>
            {/* Official Italian Question Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-1 rounded-md bg-slate-200/80 dark:bg-white/10 text-slate-800 dark:text-white border border-slate-300 dark:border-white/15 shadow-xs flex items-center gap-1.5">
                    <span>🇮🇹</span>
                    <span>Official Ministerial Question</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* One-click Copy Question for AI Tutor */}
                  <button
                    type="button"
                    onClick={() => handleCopyQuestion(question.questionIt)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#FB6C00] dark:text-slate-300 dark:hover:text-[#FB6C00] cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 transition"
                    title="ক্লিক করলেই প্রশ্নটি কপি হয়ে যাবে (AI টিউটর বা চ্যাটবটে পেস্ট করার জন্য)"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-emerald-600 font-black">কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 shrink-0" />
                        <span>কপি করুন</span>
                      </>
                    )}
                  </button>

                  {/* Quick Audio trigger */}
                  <button
                    type="button"
                    onClick={() => speakItalian(question.questionIt)}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeaking ? 'Stop Audio' : 'Listen with Headphones'}</span>
                  </button>
                </div>
              </div>
              <p className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed tracking-wide pt-1">
                "{question.questionIt}"
              </p>
            </div>

            {/* Clean English Translation Box */}
            {showEnglishTranslation && (question.questionEn || getEnglishTranslation(question.questionIt)) && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/30">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[11px] font-black px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 flex items-center gap-1">
                    <span>🇬🇧</span>
                    <span>English Translation</span>
                  </span>
                </div>
                <p className="text-sm sm:text-lg font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                  "{question.questionEn || getEnglishTranslation(question.questionIt)}"
                </p>
              </div>
            )}

            {/* Prominent Bangla Translation Box */}
            {showBanglaTranslation && (
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <p className="text-base sm:text-xl font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {getBanglaTranslation(question.questionIt, question.questionBn)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Big High-Contrast VERO / FALSO Buttons */}
        {!hideAnswerButtons && (
          <div className={`${hideAnswerButtonsOnMobile ? 'hidden md:grid' : 'grid'} grid-cols-2 gap-3 sm:gap-4 pt-1`}>
            {/* VERO Button */}
            <button
              type="button"
              onClick={() => onAnswer(true)}
              disabled={isExamSubmitted}
              className={`py-4 px-4 sm:px-6 rounded-2xl font-black text-base sm:text-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
                userAnswer === true
                  ? shouldRevealOutcome
                    ? question.isCorrect
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 dark:ring-emerald-900'
                      : 'bg-rose-600 text-white ring-4 ring-rose-200 dark:ring-rose-900'
                    : 'bg-emerald-600 text-white ring-4 ring-emerald-200 dark:ring-emerald-900'
                  : shouldRevealOutcome && question.isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-500'
                  : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500'
              }`}
            >
              <span className="tracking-wide text-lg sm:text-xl">VERO</span>
              <span className="text-xs font-bold opacity-80">(সত্য)</span>
              {shouldRevealOutcome && question.isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-100 sm:ml-1" />
              )}
              {shouldRevealOutcome && userAnswer === true && !question.isCorrect && (
                <XCircle className="w-5 h-5 text-white sm:ml-1" />
              )}
            </button>

            {/* FALSO Button */}
            <button
              type="button"
              onClick={() => onAnswer(false)}
              disabled={isExamSubmitted}
              className={`py-4 px-4 sm:px-6 rounded-2xl font-black text-base sm:text-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
                userAnswer === false
                  ? shouldRevealOutcome
                    ? !question.isCorrect
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 dark:ring-emerald-900'
                      : 'bg-rose-600 text-white ring-4 ring-rose-200 dark:ring-rose-900'
                    : 'bg-rose-600 text-white ring-4 ring-rose-200 dark:ring-rose-900'
                  : shouldRevealOutcome && !question.isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-500'
                  : 'bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-800 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500'
              }`}
            >
              <span className="tracking-wide text-lg sm:text-xl">FALSO</span>
              <span className="text-xs font-bold opacity-80">(মিথ্যা)</span>
              {shouldRevealOutcome && !question.isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-100 sm:ml-1" />
              )}
              {shouldRevealOutcome && userAnswer === false && question.isCorrect && (
                <XCircle className="w-5 h-5 text-white sm:ml-1" />
              )}
            </button>
          </div>
        )}

        {/* Detailed Outcome & Explanation Box */}
        {shouldRevealOutcome && (
          <div className="space-y-4 pt-2 animate-fadeIn">
            {/* Verdict Banner */}
            <div
              className={`p-3.5 rounded-xl flex items-center justify-between text-xs sm:text-sm font-black ${
                isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
                <span>
                  {isCorrect
                    ? '✅ চমৎকার! আপনার উত্তর সঠিক হয়েছে।'
                    : `❌ উত্তর ভুল হয়েছে! সঠিক উত্তর: ${question.isCorrect ? 'VERO (সত্য)' : 'FALSO (মিথ্যা)'}`}
                </span>
              </div>
            </div>

            {/* Explanation Box */}
            {question.explanationBn && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5 text-left">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#FB6C00]">
                  <Lightbulb className="w-4 h-4" />
                  <span>কেন এই উত্তরটি সঠিক? (ব্যাখ্যা ও পরীক্ষার টিপস):</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {question.explanationBn}
                </p>
              </div>
            )}

            {/* Trap Warning if applicable */}
            {question.trapTipBn && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2 text-left">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-800 dark:text-amber-300 font-bold">পরীক্ষার সতর্কবার্তা (Trabocchetto):</strong>
                  <p className="mt-0.5 leading-relaxed">{question.trapTipBn}</p>
                </div>
              </div>
            )}

            {/* Vocabulary in this question */}
            {question.vocabulary && question.vocabulary.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  এই প্রশ্নের কঠিন শব্দার্থ:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {question.vocabulary.map((vocab, vIdx) => (
                    <div
                      key={vIdx}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                    >
                      <div>
                        <span className="text-xs font-black text-slate-900 dark:text-white block">{vocab.wordIt}</span>
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">{vocab.meaningBn}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => speakItalian(vocab.wordIt)}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                        title="উচ্চারণ"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
