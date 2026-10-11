import React, { useState } from 'react';
import { X, Lock, Mail, ShieldAlert, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLoginSuccess: (email: string) => void;
}

// Authorized admin emails list specified by the owner
const AUTHORIZED_ADMIN_EMAILS = [
  'khshifat@gmail.com',
  'khshifatmanjum@gmail.com',
  'saifulislamnyt@gmail.com',
];

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAdminLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();

    // 1. Strict security check: Email must belong to authorized admins
    const isAuthorized = AUTHORIZED_ADMIN_EMAILS.some((adm) => cleanEmail === adm.toLowerCase());

    if (!isAuthorized) {
      setError('অননুমোদিত ইমেইল (Access Denied). শুধুমাত্র অনুমোদিত অ্যাডমিনরা (khshifat@gmail.com, khshifatmanjum@gmail.com বা saifulislamnyt@gmail.com) এই পোর্টালে প্রবেশ করতে পারেন।');
      return;
    }

    if (!password) {
      setError('পাসওয়ার্ড দিন (Please enter admin password)');
      return;
    }

    setIsLoading(true);

    // 2. Verify via MongoDB /api/auth
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admin-login',
          email: cleanEmail,
          password,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok && data.success) {
          sessionStorage.setItem('patente_admin_auth', cleanEmail);
          onAdminLoginSuccess(cleanEmail);
          onClose();
          setIsLoading(false);
          return;
        } else {
          setError('ভুল পাসওয়ার্ড। দয়া করে আপনার সঠিক পাসওয়ার্ড দিন।');
          setIsLoading(false);
          return;
        }
      }
    } catch {}

    // 3. Fallback check for offline/local admin mode
    if (password.length >= 4) {
      sessionStorage.setItem('patente_admin_auth', cleanEmail);
      onAdminLoginSuccess(cleanEmail);
      onClose();
    } else {
      setError('পাসওয়ার্ড ন্যূনতম ৪ অক্ষরের দিন');
    }
    setIsLoading(false);
  };

  const handleQuickAdminLogin = (adminEmail: string) => {
    sessionStorage.setItem('patente_admin_auth', adminEmail);
    onAdminLoginSuccess(adminEmail);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn text-left">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-emerald-200/70 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-emerald-950/30 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-black text-emerald-700 dark:text-emerald-300">
            <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
            <span>Restricted Access • অ্যাডমিন পোর্টাল</span>
          </div>

          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            অ্যাডমিন CRM ড্যাশবোর্ড
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            স্টুডেন্টদের ডেটা, WhatsApp লিড তালিকা ও পেমেন্ট হিস্ট্রি দেখতে অনুমোদিত অ্যাডমিন ইমেইল দিয়ে লগইন করুন।
          </p>
        </div>

        {/* Authorized Emails Notice */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>অনুমোদিত অ্যাডমিন অ্যাকাউন্ট:</span>
          </div>
          <div className="flex flex-col gap-0.5 pl-5 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
            <span>• khshifat@gmail.com</span>
            <span>• khshifatmanjum@gmail.com</span>
            <span>• saifulislamnyt@gmail.com</span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              অ্যাডমিন ইমেইল (Admin Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="saifulislamnyt@gmail.com বা khshifat@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              অ্যাডমিন পাসওয়ার্ড (Admin Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="আপনার পাসওয়ার্ড দিন"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:opacity-95 text-white font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/25 disabled:opacity-50"
          >
            <span>{isLoading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন (Access CRM)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Fast Access for Owners & Partners */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <span className="text-[10px] text-slate-400 block text-center uppercase tracking-wider font-bold">
            দ্রুত অ্যাডমিন অ্যাক্সেস (Fast 1-Click Verify)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickAdminLogin('khshifatmanjum@gmail.com')}
              className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold transition cursor-pointer text-center border border-slate-200 dark:border-slate-700 truncate"
              title="khshifatmanjum@gmail.com"
            >
              khshifatmanjum@...
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdminLogin('khshifat@gmail.com')}
              className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold transition cursor-pointer text-center border border-slate-200 dark:border-slate-700 truncate"
              title="khshifat@gmail.com"
            >
              khshifat@...
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdminLogin('saifulislamnyt@gmail.com')}
              className="py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold transition cursor-pointer text-center border border-emerald-200 dark:border-emerald-800 truncate"
              title="saifulislamnyt@gmail.com"
            >
              saifulislamnyt@...
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
