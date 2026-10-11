import React from 'react';
import {
  X,
  CheckCircle2,
  CreditCard,
  Sparkles,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

interface VipPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockVip: () => void;
  questionsAnsweredCount: number;
  academyPriceEur?: number;
  regularPriceEur?: number;
}

export const VipPaywallModal: React.FC<VipPaywallModalProps> = ({
  isOpen,
  onClose,
  onUnlockVip,
  questionsAnsweredCount,
  academyPriceEur = 49,
  regularPriceEur = 120,
}) => {
  const activePrice = academyPriceEur || 49;
  const regularPrice = regularPriceEur || 120;
  const discountPercent = regularPrice > 0 ? Math.round(((regularPrice - activePrice) / regularPrice) * 100) : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl bg-white space-y-6 overflow-hidden text-left">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 p-0.5 mx-auto shadow-sm flex items-center justify-center text-[#FB6C00]">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-800">
            <Sparkles className="w-3.5 h-3.5 text-[#FB6C00]" />
            <span>ফ্রি ট্রায়াল সম্পন্ন ({questionsAnsweredCount} / 600 প্রশ্ন)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            প্রো স্টুডেন্ট পাস (Pro Student Pass)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            আপনি সফলভাবে ২০টি ফ্রি রাউন্ডের প্রস্তুতি শেষ করেছেন। বাকি ২২০টি রাউন্ড ও সম্পূর্ণ কোর্স সম্পন্ন করতে প্রো স্টুডেন্ট পাসে যুক্ত হোন।
          </p>
        </div>

        {/* Student Pass Benefits List */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
            What you get with Pro Student Pass:
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>All 7,165 Official Ministerial Questions</strong>: With complete Bangla translation & logical answer reasoning.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>All 240 Step-by-Step Rounds</strong>: Master every level from beginner to official exam grade.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Unlimited 20-Min Mock Exams</strong>: Exact Ministerial format with 30 official questions.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Full Audio Pronunciation & Trap Bank</strong>: Never get confused by tricky Italian grammar traps (Trabocchetti).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>VIP WhatsApp Study Support</strong>: Direct doubt clearance from native Bengali speakers in Italy.</span>
            </li>
          </ul>
        </div>

        {/* Pricing Box */}
        <div className="p-5 rounded-2xl bg-orange-50/70 border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              One-Time Enrollment • Access Until You Pass (Fino alla Patente)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">€{activePrice}</span>
              {regularPrice > activePrice && (
                <span className="text-xs text-slate-400 line-through">€{regularPrice}</span>
              )}
              {discountPercent > 0 && (
                <span className="text-[11px] font-bold text-[#FB6C00] bg-white px-2 py-0.5 rounded-full border border-orange-200">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              No monthly subscription • Study until you pass
            </p>
          </div>

          <button
            type="button"
            onClick={onUnlockVip}
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#FB6C00] hover:bg-orange-600 text-white font-black text-sm shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            <span>Unlock Pro Student Pass (€{activePrice})</span>
          </button>
        </div>

        {/* Accepted Payment Badges */}
        <div className="space-y-2 text-center">
          <p className="text-[11px] text-slate-500">
            Accepted Payment Methods in Italy:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-700">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">🟡 PostePay</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">💳 Credit / Debit Card</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">🅿️ PayPal</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">🔴 Satispay</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure SSL Payment • 100% Satisfaction Guarantee</span>
        </div>
      </div>
    </div>
  );
};
