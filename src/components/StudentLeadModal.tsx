import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

interface StudentLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLead: (data: { name: string; email: string; phone: string }) => void;
}

export const StudentLeadModal: React.FC<StudentLeadModalProps> = ({
  isOpen,
  onClose,
  onSaveLead,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onSaveLead({ name, email, phone });
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl text-left">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-800">
            <UserCheck className="w-3.5 h-3.5 text-[#FB6C00]" />
            <span>Student Registration • ফ্রি স্টাডি অ্যাকাউন্ট</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            আপনার অগ্রগতি ও স্কোর সেভ রাখুন
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            আপনার নাম ও ইমেইল দিয়ে অ্যাকাউন্ট তৈরি করে নিন, যাতে যেকোনো ডিভাইস থেকে আপনার ২০টি ফ্রি রাউন্ডের স্কোর ও ভুল প্রশ্নের তালিকা সংরক্ষিত থাকে।
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-black text-emerald-900 text-base">ধন্যবাদ, আপনার প্রোফাইল সেভ হয়েছে!</h4>
            <p className="text-xs text-emerald-700">এখন আপনার ২০টি ফ্রি রাউন্ডে অনুশীলন চালিয়ে যান।</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                আপনার নাম (Full Name)*
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: MD Shifat"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#FB6C00]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ইমেইল ঠিকানা (Email Address)*
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#FB6C00]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                হোয়াটসঅ্যাপ নম্বর (WhatsApp / Phone - Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+39 345 678 9012"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#FB6C00]"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                কুইজ ও ফাঁদ প্রশ্নের বিশেষ আপডেট সরাসরি পাওয়ার জন্য
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#FB6C00] hover:bg-orange-600 text-white font-black text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <span>ফ্রি অ্যাকাউন্ট তৈরি করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
