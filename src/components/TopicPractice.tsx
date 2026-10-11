import React, { useState } from 'react';
import {
  BookOpen,
  CornerDownRight,
  AlertTriangle,
  Gauge,
  SquareParking,
  ChevronsRight
} from 'lucide-react';
import { CHAPTERS, QUIZ_QUESTIONS } from '../data/quizData';
import type { QuizQuestion } from '../data/quizData';
import { QuizCard } from './QuizCard';

interface TopicPracticeProps {
  onRecordMistake: (questionId: string) => void;
}

export const TopicPractice: React.FC<TopicPracticeProps> = ({ onRecordMistake }) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>('precedenza');
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const filteredQuestions = QUIZ_QUESTIONS.filter((q) => q.chapterId === selectedChapterId);
  const activeChapter = CHAPTERS.find((c) => c.id === selectedChapterId) || CHAPTERS[0];

  const handleAnswer = (question: QuizQuestion, ans: boolean) => {
    setAnswers((prev) => ({ ...prev, [question.id]: ans }));
    if (ans !== question.isCorrect) {
      onRecordMistake(question.id);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CornerDownRight':
        return <CornerDownRight className="w-5 h-5 text-emerald-400" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'Gauge':
        return <Gauge className="w-5 h-5 text-[#FB6C00]" />;
      case 'SquareParking':
        return <SquareParking className="w-5 h-5 text-amber-500" />;
      case 'ChevronsRight':
        return <ChevronsRight className="w-5 h-5 text-rose-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden border border-slate-200 shadow-sm">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-black text-orange-800">
            <BookOpen className="w-4 h-4 text-[#FB6C00]" />
            <span>অধ্যায়ভিত্তিক অনুশীলন (Studio per Argomento)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            টপিকভিত্তিক কুইজ ও বাংলা ব্যাখ্যা
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
            অধ্যায় সিলেক্ট করুন এবং প্রতিটি প্রশ্নের উত্তর দিন। সাথে সাথে সঠিক উত্তর এবং বাংলা ব্যাখ্যা দেখে নিন।
          </p>
        </div>
      </div>

      {/* Chapter Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CHAPTERS.map((chap) => {
          const isSelected = chap.id === selectedChapterId;
          return (
            <button
              key={chap.id}
              type="button"
              onClick={() => setSelectedChapterId(chap.id)}
              className={`p-4 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-orange-50/70 border-[#FB6C00] ring-2 ring-orange-200 shadow-sm'
                  : 'bg-white hover:border-slate-300 hover:bg-slate-50 border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-[#FB6C00]">
                  {getIcon(chap.icon)}
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-[#FB6C00] border border-orange-200">
                  {chap.questionCount} কুইজ
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#FB6C00]">{chap.titleIt}</h4>
                <p className="text-sm font-black text-slate-900 mt-0.5">{chap.titleBn}</p>
              </div>

              <p className="text-[11px] text-slate-500 line-clamp-2">
                {chap.descriptionBn}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Chapter Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
        <div>
          <h3 className="font-black text-slate-900 text-base">{activeChapter.titleBn}</h3>
          <p className="text-xs text-[#FB6C00] font-bold">{activeChapter.titleIt}</p>
        </div>
        <span className="text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          মোট {filteredQuestions.length}টি প্রশ্ন
        </span>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.map((q, idx) => (
          <QuizCard
            key={q.id}
            question={q}
            index={idx}
            userAnswer={answers[q.id] ?? null}
            onAnswer={(val) => handleAnswer(q, val)}
            showInstantResult={true}
          />
        ))}
      </div>
    </div>
  );
};
