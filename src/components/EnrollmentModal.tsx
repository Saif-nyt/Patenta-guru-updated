import React, { useState, useEffect } from 'react';
import { 
  X, 
  GraduationCap, 
  Headphones, 
  BookOpen, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck,
  ExternalLink,
  CreditCard
} from 'lucide-react';
import { getAppSettings, SETTINGS_CHANGE_EVENT } from '../services/appSettingsService';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueFree: () => void;
  onViewFullPage?: () => void;
  onOpenPayment?: () => void;
  attemptedRound?: number;
  academyPriceEur?: number;
  regularPriceEur?: number;
  freeRoundsLimit?: number;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  onContinueFree,
  onViewFullPage,
  onOpenPayment,
  attemptedRound = 21,
  academyPriceEur,
  regularPriceEur: _regularPriceEur,
  freeRoundsLimit,
}) => {
  const [appSettings, setAppSettings] = useState(() => getAppSettings());

  useEffect(() => {
    const handleSettingsChanged = (e: any) => {
      if (e?.detail) setAppSettings(e.detail);
    };
    window.addEventListener(SETTINGS_CHANGE_EVENT, handleSettingsChanged);
    return () => window.removeEventListener(SETTINGS_CHANGE_EVENT, handleSettingsChanged);
  }, []);

  const activePrice = academyPriceEur || appSettings.academyPriceEur || 49;
  const currentFreeLimit = typeof freeRoundsLimit === 'number' ? freeRoundsLimit : appSettings.freeRoundsLimit;

  // Listen for Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello! I would like to enroll in the complete course on Patente Bangla Italia (Activating Round #${attemptedRound} to 240). Please share enrollment details.`
  );
  const whatsappUrl = `https://wa.me/393510000000?text=${whatsappMessage}`;

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Container: Max 90vh with flex column so header & footer stay fixed, and body scrolls smoothly */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full my-auto overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 transform transition-all max-h-[90vh] flex flex-col">
        
        {/* Fixed Header Banner with Always-Visible Close Button */}
        <div className="bg-gradient-to-r from-[#170E18] via-[#0D1117] to-[#18110E] p-5 sm:p-6 text-white relative shrink-0 border-b border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
            aria-label="Close modal"
            title="বাতিল করুন (Close)"
          >
            <X className="w-5 h-5" />
            <span className="text-xs font-bold hidden sm:inline">বাতিল</span>
          </button>

          <div className="space-y-2 pr-16 sm:pr-20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-black text-slate-200">
              <GraduationCap className="w-3.5 h-3.5 text-[#FB6C00]" />
              <span>Official Driving Academy Enrollment</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
              Complete Syllabus & Full Academy Access
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
              ফাউন্ডেশন রাউন্ড (১–{currentFreeLimit}) সফলভাবে মূল্যায়নের পর সম্পূর্ণ কোর্স অ্যাক্টিভ করুন (€{activePrice} এককালীন কোর্স ফি • পাস করা পর্যন্ত এক্সেস)।
            </p>
          </div>
        </div>

        {/* Scrollable Course Inclusions Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-left">
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              এনরোলমেন্টের সাথে যা যা পাচ্ছেন:
            </span>

            <div className="space-y-2.5">
              {[
                {
                  icon: BookOpen,
                  title: 'Complete 240 Rounds (7,200+ Ministerial Questions)',
                  desc: 'ইতালির পরিবহন মন্ত্রণালয়ের অফিশিয়াল ডাটাবেজের প্রতিটি প্রশ্নের সহজ বাংলা অনুবাদ ও সঠিক ব্যাখ্যা।',
                },
                {
                  icon: Headphones,
                  title: 'Official Oral Exam Headphone Audio Simulation',
                  desc: 'ইতালির মোটরিসাসিয়নের আসল পরীক্ষার মতো প্রতিটি প্রশ্ন নেটিভ ইতালিয়ান নারী কণ্ঠে শোনার সুবিধা।',
                },
                {
                  icon: Sparkles,
                  title: '25 Chapters Theory Cheat Sheets & Trap Keywords',
                  desc: 'প্রতিটি চ্যাপ্টারের মূল ফাঁদ শব্দ (Trabocchetti) এবং দ্রুত মুখস্থ করার গোল্ডেন রুলস।',
                },
                {
                  icon: MessageCircle,
                  title: 'Direct WhatsApp Instructor Mentorship',
                  desc: 'কুইজ সমাধান করতে গিয়ে কোনো প্রশ্ন বুঝতে না পারলে সরাসরি অভিজ্ঞ টিমের সাথে হোয়াটসঅ্যাপে সমাধান।',
                },
                {
                  icon: ShieldCheck,
                  title: '2026 Ministerial Updates • Access Until You Pass',
                  desc: 'কোনো মাসিক ফি নেই। একবার এককালীন এনরোল করলে ড্রাইভিং লাইসেন্স (Patente) পাস করা পর্যন্ত আনলিমিটেড এক্সেস।',
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80">
                    <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* View as Full Page Option */}
          {onViewFullPage && (
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewFullPage();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                <span>পূর্ণাঙ্গ আলাদা পেজে বিস্তারিত দেখুন (View as Full Page)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Fixed Bottom Action Buttons */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 shrink-0 space-y-2">
          {onOpenPayment ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPayment();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md active:scale-98"
            >
              <CreditCard className="w-4.5 h-4.5" />
              <span>অনলাইনে সরাসরি পেমেন্ট করুন (€{activePrice}) • Paga Online</span>
            </button>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md active:scale-98"
            >
              <MessageCircle className="w-4.5 h-4.5" />
              <span>Confirm Enrollment via WhatsApp (€{activePrice})</span>
            </a>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onContinueFree}
              className="flex-1 py-2 px-3 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-bold text-xs text-center transition cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Continue Free (১–{currentFreeLimit} রাউন্ড)
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-xl text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-bold text-xs text-center transition cursor-pointer flex items-center gap-1 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              title="WhatsApp সহায়তা"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs text-center transition cursor-pointer"
            >
              বন্ধ করুন (Close)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
