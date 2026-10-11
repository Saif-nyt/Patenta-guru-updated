import React, { useState, useMemo } from 'react';
import { AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { ALL_200_QUESTIONS } from '../data/roundQuestions';
import type { QuizQuestion } from '../data/quizData';
import { QuizCard } from './QuizCard';

interface MistakeReviewProps {
  mistakeIds: string[];
  onClearMistakes: () => void;
  onRemoveMistake: (id: string) => void;
  onGoToTopics: () => void;
}

export const MistakeReview: React.FC<MistakeReviewProps> = ({
  mistakeIds,
  onClearMistakes,
  onRemoveMistake,
  onGoToTopics,
}) => {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  // Resolve questions from ministerial question database
  const mistakeQuestions = useMemo(() => {
    const questionMap = new Map<string, QuizQuestion>();
    // Add base quiz questions
    QUIZ_QUESTIONS.forEach((q) => questionMap.set(q.id, q));
    // Add all 600 official ministerial round questions
    ALL_200_QUESTIONS.forEach((q) => questionMap.set(q.id, q));

    const resolved: QuizQuestion[] = [];
    for (const id of mistakeIds) {
      const q = questionMap.get(id);
      if (q) {
        resolved.push(q);
      } else {
        // Fallback for legacy round IDs like r21_q5
        const match = id.match(/^r(\d+)_q(\d+)$/);
        if (match) {
          const qNum = parseInt(match[2], 10);
          const fallbackQ = ALL_200_QUESTIONS[(qNum - 1) % ALL_200_QUESTIONS.length];
          if (fallbackQ) {
            resolved.push({ ...fallbackQ, id });
          }
        }
      }
    }
    return resolved;
  }, [mistakeIds]);

  const handleAnswer = (question: QuizQuestion, ans: boolean) => {
    setAnswers((prev) => ({ ...prev, [question.id]: ans }));
    if (ans === question.isCorrect) {
      // Corrected! Remove from mistakes after a brief delay
      setTimeout(() => {
        onRemoveMistake(question.id);
      }, 1200);
    }
  };

  if (mistakeQuestions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-6 bg-white dark:bg-[#12161F] rounded-3xl p-8 sm:p-12 animate-fadeIn border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 text-emerald-500 border border-slate-200 dark:border-white/10 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            কোনো ভুল প্রশ্ন জমে নেই! 🎉
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            আপনি ১ থেকে ২৪০ রাউন্ডের যেকোনো পরীক্ষায় যে প্রশ্নগুলো ভুল করবেন, সেগুলো স্বয়ংক্রিয়ভাবে এখানে জমা থাকবে। আপনি বারবার পরীক্ষা দিয়ে পাশ করলেও পূর্বের ভুলগুলো এখানে সংরক্ষিত থাকবে যাতে পরীক্ষার আগে রিভিশন দিয়ে শতভাগ নিশ্চিত হতে পারেন।
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToTopics}
          className="py-3 px-6 rounded-full bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:from-[#d02524] hover:to-[#e55e00] text-white font-black text-xs transition hover:scale-105 cursor-pointer shadow-md shadow-[#FB6C00]/25"
        >
          কুইজ প্র্যাকটিস শুরু করুন
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#12161F] rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-black text-slate-700 dark:text-slate-300">
              <AlertCircle className="w-4 h-4 text-[#E52E2D]" />
              <span>স্মার্ট ভুলের খাতা (Revisione Errori)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              আপনার ভুল প্রশ্নগুলো রিভিশন দিন ({mistakeQuestions.length}টি প্রশ্ন)
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-xl">
              যেকোনো রাউন্ডে যে প্রশ্নগুলো ভুল করেছেন, তা এখানে সংরক্ষিত আছে। প্রতিটি প্রশ্নে সঠিক উত্তর দিলে তা স্বয়ংক্রিয়ভাবে আয়ত্ত (Mastered) হিসেবে তালিকা থেকে মুছে যাবে।
            </p>
          </div>

          <button
            type="button"
            onClick={onClearMistakes}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-700 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-800 text-xs font-bold transition cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>সব ভুল ক্লিয়ার করুন</span>
          </button>
        </div>
      </div>

      {/* Mistake Questions List */}
      <div className="space-y-6">
        {mistakeQuestions.map((q, idx) => (
          <div key={q.id} className="relative group">
            <QuizCard
              question={q}
              index={idx}
              userAnswer={answers[q.id] ?? null}
              onAnswer={(val) => handleAnswer(q, val)}
              showInstantResult={true}
            />
            {/* Quick remove if student already feels confident */}
            <div className="flex justify-end pt-2 pr-2">
              <button
                type="button"
                onClick={() => onRemoveMistake(q.id)}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer flex items-center gap-1"
                title="Remove from mistake review without re-answering"
              >
                ✓ মুখস্থ হয়ে গেছে (Remove)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
