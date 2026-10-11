import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Clock,
  Award,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  GraduationCap
} from 'lucide-react';
import type { QuizQuestion } from '../data/quizData';
import { getQuestionsForRound, ALL_200_QUESTIONS, shuffleQuestions } from '../data/roundQuestions';
import { getRoundTopic } from '../data/roundCurriculumData';
import { QuizCard } from './QuizCard';
import { trackExamStart, trackExamSubmit } from '../services/analytics';
import { fetchSimulationExamQuestions } from '../services/questionsService';
import {
  loadExamDraft,
  saveExamDraft,
  clearExamDraft,
  answersToIdKeyed,
  answersToIndexKeyed,
} from '../services/examDraftService';

interface ExamSimulatorProps {
  onSaveMistakes: (questionIds: string[], roundId?: number | null) => void;
  onGoToTopics: () => void;
  roundId?: number | null;
  onBackToRounds?: () => void;
  onSelectRound?: (roundId: number) => void;
  isVip?: boolean;
  onOpenEnrollment?: () => void;
  academyPriceEur?: number;
}

export const ExamSimulator: React.FC<ExamSimulatorProps> = ({
  onSaveMistakes,
  onGoToTopics,
  roundId,
  onBackToRounds,
  onSelectRound,
  isVip = false,
  onOpenEnrollment,
  academyPriceEur = 49,
}) => {
  // Select questions based on round or general mock test (randomized order on every attempt)
  const currentRoundTopic = roundId ? getRoundTopic(roundId) : null;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(20 * 60); // 20 minutes
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);
  const [resumeNotice, setResumeNotice] = useState<string | null>(null);
  // Round the currently displayed questions belong to (always set together with setQuestions),
  // so saved progress can never be written under the wrong exam key
  const [activeRoundId, setActiveRoundId] = useState<number | null>(null);

  const discardSavedProgress = () => {
    clearExamDraft(activeRoundId);
    if ((roundId ?? null) !== activeRoundId) {
      clearExamDraft(roundId ?? null);
    }
  };

  // Restore an unfinished exam (any round or mock test) instead of resetting to question 1
  useEffect(() => {
    const draft = loadExamDraft(roundId ?? null);

    if (draft) {
      const safeIdx = Math.min(
        Math.max(draft.currentIdx, 0),
        draft.questions.length - 1
      );
      setActiveRoundId(roundId ?? null);
      setQuestions(draft.questions);
      setAnswers(answersToIndexKeyed(draft.answers, draft.questions));
      setCurrentIdx(safeIdx);
      setTimeLeftSeconds(Math.min(20 * 60, Math.max(1, draft.timeLeftSeconds)));
      setIsSubmitted(false);
      setIsStarted(true);
      setIsLoadingQuestions(false);
      setResumeNotice(
        roundId
          ? `রাউন্ড #${roundId} • প্রশ্ন ${safeIdx + 1}/${draft.questions.length} থেকে চালিয়ে যাচ্ছেন`
          : `মক টেস্ট • প্রশ্ন ${safeIdx + 1}/${draft.questions.length} থেকে চালিয়ে যাচ্ছেন`
      );
      trackExamStart(roundId ?? undefined);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setResumeNotice(null);
    if (roundId) {
      setActiveRoundId(roundId);
      setQuestions(getQuestionsForRound(roundId, true));
      setAnswers({});
      setCurrentIdx(0);
      setTimeLeftSeconds(20 * 60);
      setIsSubmitted(false);
      setIsStarted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveRoundId(null);
      setQuestions([]);
      setAnswers({});
      setCurrentIdx(0);
      setTimeLeftSeconds(20 * 60);
      setIsSubmitted(false);
      setIsStarted(false);
    }
  }, [roundId]);

  // Auto-hide the resume notice after a few seconds
  useEffect(() => {
    if (!resumeNotice) return;
    const timer = setTimeout(() => setResumeNotice(null), 6000);
    return () => clearTimeout(timer);
  }, [resumeNotice]);

  const startNewExam = async () => {
    // A deliberate fresh attempt discards any saved progress for this exam
    discardSavedProgress();
    setResumeNotice(null);

    if (roundId) {
      setActiveRoundId(roundId);
      setQuestions(getQuestionsForRound(roundId, true));
      setAnswers({});
      setCurrentIdx(0);
      setTimeLeftSeconds(20 * 60);
      setIsSubmitted(false);
      setIsStarted(true);
      trackExamStart(roundId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // General Mock test: fetch 30 randomized questions from MongoDB 7,165 question bank
    setIsLoadingQuestions(true);
    try {
      const qList = await fetchSimulationExamQuestions(30);
      setQuestions(qList);
    } catch {
      const fallback = shuffleQuestions(ALL_200_QUESTIONS).slice(0, 30);
      setQuestions(fallback);
    } finally {
      setIsLoadingQuestions(false);
      setActiveRoundId(null);
      setAnswers({});
      setCurrentIdx(0);
      setTimeLeftSeconds(20 * 60);
      setIsSubmitted(false);
      setIsStarted(true);
      trackExamStart(undefined);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ---- Auto-save in-progress exam so the student can resume from any question ----
  const persistDraftRef = useRef<() => void>(() => {});

  const persistDraft = () => {
    if (!isStarted || isSubmitted || questions.length === 0) return;
    // Nothing attempted yet → no progress worth resuming
    if (Object.keys(answers).length === 0 && currentIdx === 0) return;
    saveExamDraft({
      roundId: activeRoundId,
      questions,
      answers: answersToIdKeyed(answers, questions),
      currentIdx,
      timeLeftSeconds,
    });
  };

  // Always keep the ref pointed at the latest render's save function
  useEffect(() => {
    persistDraftRef.current = persistDraft;
  });

  // Save right away on every answer / question navigation
  useEffect(() => {
    persistDraftRef.current();
  }, [answers, currentIdx, questions, isStarted, isSubmitted, activeRoundId]);

  // Keep the saved remaining time fresh + flush when the tab is hidden or closed
  useEffect(() => {
    if (!isStarted || isSubmitted || questions.length === 0) return;
    const interval = setInterval(() => persistDraftRef.current(), 5000);
    const flush = () => persistDraftRef.current();
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') persistDraftRef.current();
    };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(interval);
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isStarted, isSubmitted, questions.length, activeRoundId]);

  // Timer countdown
  useEffect(() => {
    if (!isStarted || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isSubmitted]);

  const handleAnswer = (val: boolean) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [currentIdx]: val }));
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    // Exam finished → remove the saved draft so it is no longer offered as "Resume"
    discardSavedProgress();
    setResumeNotice(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Calculate mistakes
    const mistakeIds: string[] = [];
    questions.forEach((q, idx) => {
      const userAns = answers[idx];
      if (userAns === undefined || userAns !== q.isCorrect) {
        mistakeIds.push(q.id);
      }
    });

    onSaveMistakes(mistakeIds, roundId);

    const errorCount = mistakeIds.length;
    const passed = errorCount <= 3;
    const scorePct = Math.round(((questions.length - errorCount) / (questions.length || 30)) * 100);
    trackExamSubmit(roundId || undefined, scorePct, passed, errorCount);

    if (passed) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalAnswered = Object.keys(answers).length;
  const currentQuestion = questions[currentIdx];

  // Calculate results if submitted
  const totalQuestions = questions.length || 30;
  const correctCount = questions.reduce((acc, q, idx) => {
    const userAns = answers[idx];
    return userAns === q.isCorrect ? acc + 1 : acc;
  }, 0);
  const errorCount = questions.reduce((acc, q, idx) => {
    const userAns = answers[idx];
    return userAns !== q.isCorrect ? acc + 1 : acc;
  }, 0);
  const isPassed = errorCount <= 3;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  const activePillRef = useRef<HTMLButtonElement | null>(null);

  // Auto-scroll ribbon to keep active question in view
  useEffect(() => {
    try {
      if (activePillRef.current) {
        activePillRef.current.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    } catch {}
  }, [currentIdx]);

  // Keyboard navigation shortcuts: V for Vero, F for Falso, ArrowRight/Enter for Next, ArrowLeft for Prev
  useEffect(() => {
    if (!isStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is pressing modifier keys (Ctrl+C, Ctrl+V, Cmd+C, Alt, etc.)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Don't trigger if user is typing in an input
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;

      if (e.key === 'v' || e.key === 'V' || e.key === '1') {
        e.preventDefault();
        handleAnswer(true);
      } else if (e.key === 'f' || e.key === 'F' || e.key === '2') {
        e.preventDefault();
        handleAnswer(false);
      } else if (e.key === 'ArrowRight' || (e.key === 'Enter' && !isSubmitted)) {
        e.preventDefault();
        if (currentIdx === questions.length - 1) {
          handleSubmitExam();
        } else {
          setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1));
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIdx((prev) => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarted, questions.length, isSubmitted, currentIdx]);

  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-[#12161F] rounded-3xl p-8 sm:p-10 text-center space-y-6 animate-fadeIn border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 text-[#FB6C00] border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto shadow-xs">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-black text-slate-700 dark:text-slate-300">
            <span>
              {currentRoundTopic
                ? `${currentRoundTopic.badgeBn} • ${currentRoundTopic.badgeIt}`
                : 'Official Ministerial Simulation • Simulazione Esame Ufficiale'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {currentRoundTopic
              ? `রাউন্ড #${roundId}: ${currentRoundTopic.titleBn}`
              : roundId ? `রাউন্ড #${roundId} এর ৩০টি কুইজ পরীক্ষা` : 'সরকারি ড্রাইভিং লাইসেন্স সিমুলেশন পরীক্ষা'}
          </h2>
          {currentRoundTopic && (
            <p className="text-[#FB6C00] font-bold text-sm tracking-wide">
              {currentRoundTopic.titleIt}
            </p>
          )}
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
            ইতালির পরিবহন মন্ত্রণালয়ের (Ministero dei Trasporti) অফিসিয়াল নিয়মে ৩০টি প্রশ্ন এবং ২০ মিনিট সময়।
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-left">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">মোট প্রশ্ন:</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">৩০টি কুইজ</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">৭,১৬৫টি ব্যাংক থেকে</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">সময় সীমা:</span>
            <span className="text-lg font-black text-[#FB6C00]">২০ মিনিট</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">টাইমার নিয়ন্ত্রণ</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">পাস করার শর্ত:</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">সর্বোচ্চ ৩ ভুল</span>
            <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 block">অফিসিয়াল মান</span>
          </div>
        </div>

        {/* Essential Advice Quote: Complete all 240 rounds first */}
        <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border-2 border-amber-500/30 max-w-xl mx-auto text-left space-y-1.5">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-black text-xs uppercase tracking-wide">
            <span>💡 শিক্ষকের বিশেষ পরামর্শ (Consiglio del Docente):</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
            &ldquo;সরাসরি সিমুলেশন পরীক্ষা দেওয়ার আগে আমাদের কারিকুলামের সম্পূর্ণ <strong>২৪০টি রাউন্ড শেষ করার জোর সুপারিশ করা হলো</strong>। ২৪০টি রাউন্ড শেষ করলে আপনার সরকারি সিলেবাসের প্রতিটি অধ্যায় নির্ভুলভাবে আয়ত্তে চলে আসবে এবং সিমুলেশনে নিশ্চিত পাস করবেন!&rdquo;
          </p>
        </div>

        <button
          type="button"
          onClick={startNewExam}
          disabled={isLoadingQuestions}
          className="py-3.5 px-8 rounded-full bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:from-[#d02524] hover:to-[#e55e00] disabled:opacity-70 text-white font-black text-base shadow-lg shadow-[#FB6C00]/25 transition-all hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-2"
        >
          {isLoadingQuestions ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>প্রশ্ন তৈরি হচ্ছে...</span>
            </>
          ) : (
            <span>পরীক্ষা শুরু করুন (Inizia Esame) 🚀</span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 animate-fadeIn">
      {/* Top Status Bar: Timer + Progress */}
      <div className="bg-white dark:bg-[#12161F] rounded-2xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-sm transition-colors">
        {/* Round or Mock Test Label */}
        <div className="flex items-center gap-2.5">
          {onBackToRounds && (
            <button
              type="button"
              onClick={onBackToRounds}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              title="রাউন্ড তালিকায় ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">রাউন্ড তালিকা</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-orange-50 dark:bg-white/10 text-[#FB6C00] font-black text-xs border border-orange-200 dark:border-white/15 shrink-0">
              {roundId ? `রাউন্ড #${roundId}` : 'মডেল টেস্ট'}
            </span>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-bold hidden md:inline truncate max-w-[320px]">
              {currentRoundTopic
                ? `${currentRoundTopic.titleBn} (${currentRoundTopic.titleIt})`
                : (roundId ? `লেভেল ${roundId} পরীক্ষা` : '৩০টি অফিসিয়াল প্রশ্ন')}
            </span>
          </div>
        </div>

        {/* Timer & Answered Count */}
        <div className="flex items-center gap-2.5">
          <div
            className={`py-1.5 px-3 rounded-full flex items-center gap-1.5 font-black text-sm border ${
              timeLeftSeconds < 180
                ? 'bg-rose-950/70 text-rose-300 border-rose-800 animate-pulse'
                : timeLeftSeconds < 360
                ? 'bg-[#FB6C00]/20 text-[#FB6C00] border-[#FB6C00]/40'
                : 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#FB6C00]" />
            <span className="text-sm tracking-wider font-mono">{timeFormatted}</span>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            উত্তর: <strong className="text-slate-900 dark:text-white">{totalAnswered} / {questions.length}</strong>
          </span>
        </div>

        {/* Submit or Reset button */}
        {!isSubmitted ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (
                  totalAnswered > 0 &&
                  !window.confirm(
                    'বর্তমান পরীক্ষার সংরক্ষিত অগ্রগতি মুছে যাবে। নতুন করে পরীক্ষা শুরু করবেন?'
                  )
                ) {
                  return;
                }
                startNewExam();
              }}
              className="py-2 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-white/15 transition cursor-pointer"
              title="সংরক্ষিত অগ্রগতি মুছে নতুন করে পরীক্ষা শুরু করুন"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">নতুন পরীক্ষা</span>
            </button>
            <button
              type="button"
              onClick={handleSubmitExam}
              className="py-2 px-4 rounded-full bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:from-[#d02524] hover:to-[#e55e00] text-white font-black text-xs shadow-md shadow-[#FB6C00]/20 hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              পরীক্ষা জমা দিন (Consegna)
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startNewExam}
            className="py-2 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white font-black text-xs flex items-center gap-2 border border-slate-200 dark:border-white/20 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>নতুন পরীক্ষা</span>
          </button>
        )}
      </div>

      {/* Restored saved progress notice */}
      {resumeNotice && (
        <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-black animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{resumeNotice}</span>
        </div>
      )}

      {/* Results Banner if submitted */}
      {isSubmitted && (
        <div
          className={`p-6 sm:p-8 rounded-3xl border text-center space-y-5 shadow-lg animate-fadeIn ${
            isPassed
              ? 'bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900 border-emerald-300 dark:border-emerald-800'
              : 'bg-gradient-to-b from-rose-50 to-white dark:from-rose-950/40 dark:to-slate-900 border-rose-300 dark:border-rose-800'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md">
            {isPassed ? (
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9 text-white" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <XCircle className="w-9 h-9 text-white" />
              </div>
            )}
          </div>

          <div className="space-y-1.5 max-w-xl mx-auto">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-1 border shadow-xs"
              style={{
                backgroundColor: isPassed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                borderColor: isPassed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                color: isPassed ? '#059669' : '#dc2626'
              }}
            >
              <span>{isPassed ? '✓ IDONEO • অফিশিয়াল মান উত্তীর্ণ' : '✕ RESPINTO • অকৃতকার্য'}</span>
            </div>
            {currentRoundTopic && (
              <p className="text-xs font-black text-[#FB6C00] uppercase tracking-wide">
                রাউন্ড #{roundId}: {currentRoundTopic.titleBn} • {currentRoundTopic.titleIt}
              </p>
            )}
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isPassed ? '🎉 অভিনন্দন! আপনি পরীক্ষায় পাস করেছেন!' : '❌ দুঃখিত! আপনি পরীক্ষায় ফেল করেছেন'}
            </h2>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
              {isPassed
                ? `চমৎকার ফলাফল! আপনি মোট ৩০টি প্রশ্নের মধ্যে ${correctCount}টি সঠিক উত্তর দিয়েছেন এবং মাত্র ${errorCount}টি ভুল করেছেন (অনুমোদিত সর্বোচ্চ ৩টি ভুল)।`
                : `আপনি মোট ৩০টি প্রশ্নের মধ্যে ${correctCount}টি সঠিক উত্তর দিয়েছেন এবং ${errorCount}টি ভুল করেছেন। ইতালিয়ান নিয়ম অনুযায়ী পরীক্ষায় পাস করতে সর্বোচ্চ ৩টি ভুলের সুযোগ আছে।`}
            </p>
          </div>

          {/* Prominent Points & Score Cards Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left pt-1">
            {/* 1. Correct Points */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-400 dark:border-emerald-700/60 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <span>সঠিক (Correct)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                  {correctCount}
                </span>
                <span className="text-xs font-bold text-emerald-700/70">/ {totalQuestions}</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                Passed Points ✅
              </span>
            </div>

            {/* 2. Incorrect Points */}
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-400 dark:border-rose-700/60 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-rose-800 dark:text-rose-300">
                <span>ভুল (Incorrect)</span>
                <XCircle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-400">
                  {errorCount}
                </span>
                <span className="text-xs font-bold text-rose-700/70">/ {totalQuestions}</span>
              </div>
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 mt-1">
                {errorCount <= 3 ? 'অনুমোদিত সীমার ভেতর' : 'অনুমোদিত ৩টির বেশি'}
              </span>
            </div>

            {/* 3. Accuracy Percentage */}
            <div className="p-4 rounded-2xl bg-orange-50 dark:bg-white/5 border-2 border-orange-300 dark:border-white/15 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-orange-800 dark:text-orange-300">
                <span>অর্জিত স্কোর</span>
                <Award className="w-4 h-4 text-[#FB6C00]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-[#FB6C00]">
                  {scorePercentage}%
                </span>
              </div>
              <span className="text-[11px] font-bold text-orange-700 dark:text-orange-300 mt-1">
                সঠিকতার হার
              </span>
            </div>

            {/* 4. Ministerial Decision */}
            <div
              className={`p-4 rounded-2xl border-2 shadow-xs flex flex-col justify-between ${
                isPassed
                  ? 'bg-emerald-500/10 border-emerald-500 dark:border-emerald-600 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-500/10 border-rose-500 dark:border-rose-600 text-rose-900 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span>অফিসিয়াল স্ট্যাটাস</span>
                <span className="text-xs">{isPassed ? '🎓' : '⚠️'}</span>
              </div>
              <div className="mt-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight">
                  {isPassed ? 'IDONEO' : 'RESPINTO'}
                </span>
              </div>
              <span className="text-[11px] font-bold mt-1">
                {isPassed ? 'পাস সম্পন্ন' : 'সর্বোচ্চ ৩টি ভুল অনুমোদিত'}
              </span>
            </div>
          </div>

          {/* Strategic Post-Exam Pro Academy Upgrade CTA for Unpaid Students */}
          {!isVip && onOpenEnrollment && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-red-500/15 border border-orange-500/30 text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E52E2D] to-[#FB6C00] flex items-center justify-center text-white shrink-0 shadow-md">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    সম্পূর্ণ ২৪০টি রাউন্ডের অফিশিয়াল কুইজ প্র্যাকটিস করতে চান?
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                    একাডেমি প্রো মেম্বারশিপে (€{academyPriceEur}) লাইফটাইম এক্সেস ও পাস করা পর্যন্ত আনলিমিটেড মক টেস্ট পান।
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenEnrollment}
                className="w-full sm:w-auto py-2.5 px-5 rounded-full bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:from-[#d02524] hover:to-[#e55e00] text-white font-black text-xs shrink-0 shadow-md shadow-[#FB6C00]/25 transition hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5 text-white" />
                <span>একাডেমিতে ভর্তি হন (€{academyPriceEur})</span>
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={startNewExam}
              className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-black text-xs sm:text-sm transition cursor-pointer flex items-center gap-2 shadow-sm hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>পুনরায় পরীক্ষা দিন (Randomized Order)</span>
            </button>

            {isPassed && roundId && onSelectRound && roundId < 240 && (
              <button
                type="button"
                onClick={() => onSelectRound(roundId + 1)}
                className="py-3 px-6 rounded-xl bg-[#FB6C00] hover:bg-[#e05f00] text-white font-black text-xs sm:text-sm transition cursor-pointer flex items-center gap-2 shadow-sm hover:scale-105 active:scale-95 shadow-[#FB6C00]/25"
              >
                <span>পরবর্তী রাউন্ড #{roundId + 1} শুরু করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onGoToTopics}
              className="py-3 px-6 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            >
              অধ্যায়ভিত্তিক রিভিশন নিন
            </button>

            {onBackToRounds && (
              <button
                type="button"
                onClick={onBackToRounds}
                className="py-3 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              >
                রাউন্ড তালিকায় ফিরুন
              </button>
            )}
          </div>
        </div>
      )}

      {/* Official Ministerial Exam Question Ribbon: 10-Question Brackets with Google Antigravity Scroller */}
      {/* Sleek, Compact Single-Row Question Ribbon (1 to 30 continuous) */}
      <div className="bg-white dark:bg-[#12161F] rounded-2xl p-2 sm:p-2.5 border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-sm flex items-center gap-2">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0 pl-1 hidden sm:inline">
          Questions:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none flex-1">
          {questions.map((q, idx) => {
            const hasAnswered = answers[idx] !== undefined;
            const isCurrent = currentIdx === idx;
            const isUserRight = isSubmitted && answers[idx] === q.isCorrect;

            return (
              <button
                key={idx}
                ref={isCurrent ? activePillRef : null}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`w-8 h-8 sm:w-8 sm:h-8 rounded-xl font-black text-xs shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#FB6C00] text-white shadow-md shadow-[#FB6C00]/30 ring-2 ring-[#FB6C00]/30 scale-105'
                    : isSubmitted
                    ? isUserRight
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                    : hasAnswered
                    ? 'bg-slate-200 text-slate-900 dark:bg-white/15 dark:text-white font-bold'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={`Question ${idx + 1}${hasAnswered ? ' (Answered)' : ''}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Question Card: Visible immediately in the viewport; clearance padding on mobile only */}
      <div className="pb-36 md:pb-0">
        {currentQuestion && (
          <QuizCard
            question={currentQuestion}
            index={currentIdx}
            userAnswer={answers[currentIdx] ?? null}
            onAnswer={handleAnswer}
            showInstantResult={isSubmitted}
            isExamSubmitted={isSubmitted}
            hideAnswerButtonsOnMobile={true}
          />
        )}
      </div>

      {/* Desktop Navigation Bar: Clean, predictable position right under the question card */}
      <div className="hidden md:flex bg-white dark:bg-slate-900 rounded-2xl p-2.5 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm items-center justify-between gap-2 sm:gap-3">
        <button
          type="button"
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
          className="py-2.5 sm:py-3 px-3 sm:px-6 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 border border-slate-200 dark:border-slate-700 transition cursor-pointer disabled:opacity-30 disabled:pointer-events-none shrink-0"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Previous (পূর্ববর্তী)</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-black text-slate-900 dark:text-white">
            {currentIdx + 1} / {questions.length}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Keyboard: [V] Vero • [F] Falso • [➔] Next
          </span>
        </div>

        {currentIdx === questions.length - 1 && !isSubmitted ? (
          <button
            type="button"
            onClick={handleSubmitExam}
            className="py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow-md shadow-emerald-500/20 transition cursor-pointer shrink-0"
          >
            <span>Submit Exam (পরীক্ষা জমা দিন)</span>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          </button>
        ) : (
          <button
            type="button"
            disabled={currentIdx === questions.length - 1}
            onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
            className="py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl bg-[#FB6C00] hover:bg-[#e05f00] active:scale-95 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow-md shadow-[#FB6C00]/25 transition cursor-pointer disabled:opacity-30 disabled:pointer-events-none shrink-0"
          >
            <span>Next (পরবর্তী)</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        )}
      </div>

      {/* Mobile Fixed Cockpit Answer & Navigation Deck: Anchored above mobile tab bar (zero jumping) */}
      <div className="md:hidden fixed bottom-[68px] sm:bottom-[72px] left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200/90 dark:border-slate-800/90 p-2.5 sm:p-3 shadow-2xl space-y-2 transition-all">
        {/* Row 1: Fixed Anchor VERO / FALSO Buttons */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {/* VERO Button */}
          <button
            type="button"
            onClick={() => handleAnswer(true)}
            disabled={isSubmitted}
            className={`py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl font-black text-base flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 select-none touch-manipulation min-h-[48px] ${
              answers[currentIdx] === true
                ? isSubmitted
                  ? currentQuestion?.isCorrect
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 dark:ring-emerald-900 border-2 border-emerald-500'
                    : 'bg-rose-600 text-white ring-4 ring-rose-200 dark:ring-rose-900 border-2 border-rose-500'
                  : 'bg-emerald-600 text-white ring-4 ring-emerald-200 dark:ring-emerald-900 border-2 border-emerald-500'
                : isSubmitted && currentQuestion?.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-500'
                : 'bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500'
            }`}
          >
            <span className="tracking-wide text-base">VERO</span>
            <span className="text-xs font-bold opacity-80">(সত্য)</span>
            {isSubmitted && currentQuestion?.isCorrect && (
              <CheckCircle2 className="w-4 h-4 text-emerald-100 ml-1" />
            )}
            {isSubmitted && answers[currentIdx] === true && !currentQuestion?.isCorrect && (
              <XCircle className="w-4 h-4 text-white ml-1" />
            )}
          </button>

          {/* FALSO Button */}
          <button
            type="button"
            onClick={() => handleAnswer(false)}
            disabled={isSubmitted}
            className={`py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl font-black text-base flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 select-none touch-manipulation min-h-[48px] ${
              answers[currentIdx] === false
                ? isSubmitted
                  ? !currentQuestion?.isCorrect
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 dark:ring-emerald-900 border-2 border-emerald-500'
                    : 'bg-rose-600 text-white ring-4 ring-rose-200 dark:ring-rose-900 border-2 border-rose-500'
                  : 'bg-rose-600 text-white ring-4 ring-rose-200 dark:ring-rose-900 border-2 border-rose-500'
                : isSubmitted && !currentQuestion?.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-500'
                : 'bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-800 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500'
            }`}
          >
            <span className="tracking-wide text-base">FALSO</span>
            <span className="text-xs font-bold opacity-80">(মিথ্যা)</span>
            {isSubmitted && !currentQuestion?.isCorrect && (
              <CheckCircle2 className="w-4 h-4 text-emerald-100 ml-1" />
            )}
            {isSubmitted && answers[currentIdx] === false && currentQuestion?.isCorrect && (
              <XCircle className="w-4 h-4 text-white ml-1" />
            )}
          </button>
        </div>

        {/* Row 2: Navigation & Progress */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition cursor-pointer disabled:opacity-30 disabled:pointer-events-none shrink-0"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>পূর্ববর্তী</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs font-black text-slate-900 dark:text-white">
              {currentIdx + 1} / {questions.length}
            </span>
          </div>

          {currentIdx === questions.length - 1 && !isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmitExam}
              className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition cursor-pointer shrink-0"
            >
              <span>জমা দিন</span>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            </button>
          ) : (
            <button
              type="button"
              disabled={currentIdx === questions.length - 1}
              onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
              className="py-2 px-3.5 rounded-xl bg-[#FB6C00] hover:bg-[#e05f00] active:scale-95 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-[#FB6C00]/25 transition cursor-pointer disabled:opacity-30 disabled:pointer-events-none shrink-0"
            >
              <span>পরবর্তী</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
