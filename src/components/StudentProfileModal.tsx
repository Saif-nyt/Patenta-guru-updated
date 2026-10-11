import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  FileText,
  LogOut,
  Save,
  Check
} from 'lucide-react';
import type { StudentProfile } from '../services/studentService';
import { syncStudentProgressToCloud } from '../services/studentService';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
  isVip: boolean;
  onLogout: () => void;
  onOpenInvoice?: () => void;
  onUpdateProfile?: (updated: StudentProfile) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  isVip,
  onLogout,
  onOpenInvoice,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  useEffect(() => {
    if (student) {
      setName(student.name || '');
      setPhone(student.phone || '');
      setAddress(student.address || '');
      setCity(student.city || '');
    }
  }, [student, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !student) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData: Partial<StudentProfile> = {
      name: name.trim() || student.name,
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
    };

    await syncStudentProgressToCloud(student.uid, updatedData);

    const mergedStudent: StudentProfile = {
      ...student,
      ...updatedData,
    };

    if (onUpdateProfile) {
      onUpdateProfile(mergedStudent);
    }

    setIsSavedSuccess(true);
    setIsEditing(false);
    setTimeout(() => setIsSavedSuccess(false), 2500);
  };

  const completedCount = student.completedRounds ? Object.values(student.completedRounds).filter((r) => r.passed).length : 0;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      {/* Click Outside Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Body */}
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-[#12161F] theme-sepia:bg-[#FCF8ED] border border-slate-200 dark:border-white/10 theme-sepia:border-[#DFCEAC] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 z-10 max-h-[90vh] overflow-y-auto no-scrollbar scrollbar-none text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E52E2D] to-[#FB6C00] text-white flex items-center justify-center text-sm font-black uppercase shadow-md shadow-[#FB6C00]/20">
              {(student.name || student.email || 'S').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                {student.name || student.email || 'শিক্ষার্থী প্রোফাইল'}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Student Profile &amp; Data
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-500 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Plan Status Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FB6C00]" />
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                {isVip || student.isVip ? 'Academy Pro (২৪০ রাউন্ড এক্সেস)' : 'Free Foundation (১–২০ রাউন্ড ফ্রি)'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {isVip || student.isVip ? 'পাস করা পর্যন্ত ফুল কোর্স অন্তর্ভুক্ত' : 'ফ্রি ফাউন্ডেশন লেভেল'}
              </div>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            isVip || student.isVip
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200'
          }`}>
            {isVip || student.isVip ? 'ENROLLED' : 'FREE'}
          </span>
        </div>

        {/* Quick Academic Progress Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
            <span className="text-[10px] font-bold text-slate-400 block">Current Round</span>
            <span className="text-base font-black text-slate-900 dark:text-white">#{student.unlockedRound || 1}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
            <span className="text-[10px] font-bold text-slate-400 block">Questions Solved</span>
            <span className="text-base font-black text-slate-900 dark:text-white">{student.totalQuestionsAnswered || 0}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
            <span className="text-[10px] font-bold text-slate-400 block">Passed Rounds</span>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{completedCount}</span>
          </div>
        </div>

        {/* Student Personal Information Fields */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              ব্যক্তিগত তথ্য (Dati Personali)
            </h4>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-[#FB6C00] hover:underline cursor-pointer"
            >
              {isEditing ? 'বাতিল করুন' : 'তথ্য পরিবর্তন করুন (Edit)'}
            </button>
          </div>

          {isSavedSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>আপনার তথ্য সফলভাবে সংরক্ষিত হয়েছে!</span>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  শিক্ষার্থীর পুরো নাম (Nome Completo)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  ফোন নম্বর (Telefono / WhatsApp)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+39 320 000 0000"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    ইতালির ঠিকানা (Indirizzo)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Via Roma 12"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    শহর / প্রভিন্স (Città)
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Milano (MI)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:from-[#d02524] hover:to-[#e55e00] text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-[#FB6C00]/25"
                >
                  <Save className="w-3.5 h-3.5 text-white" />
                  <span>তথ্য সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2 text-xs">
              {/* Name */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">শিক্ষার্থীর নাম (Name)</span>
                    <span className="text-slate-900 dark:text-white font-bold">{student.name}</span>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">নিবন্ধিত ইমেইল (Email)</span>
                    <span className="text-slate-900 dark:text-white font-bold">{student.email}</span>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">ফোন নম্বর (Phone)</span>
                    <span className="text-slate-900 dark:text-white font-bold">
                      {student.phone || 'যুক্ত করা হয়নি (Edit এ ক্লিক করে যুক্ত করুন)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">ইতালির ঠিকানা (Indirizzo in Italia)</span>
                    <span className="text-slate-900 dark:text-white font-bold">
                      {student.address
                        ? `${student.address}${student.city ? `, ${student.city}` : ''}`
                        : 'যুক্ত করা হয়নি (Edit এ ক্লিক করে ঠিকানা যুক্ত করুন)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls: Invoice + Logout */}
        <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-2">
          {(isVip || student.isVip) && onOpenInvoice && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenInvoice();
              }}
              className="w-full py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-white/15 shadow-xs"
            >
              <FileText className="w-4 h-4 text-[#FB6C00]" />
              <span>ডাউনলোড করুন অফিসিয়াল ইনভয়েস (Fattura PDF)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full py-2.5 px-4 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-rose-200 dark:border-rose-900/50"
          >
            <LogOut className="w-4 h-4" />
            <span>অ্যাকাউন্ট থেকে লগআউট করুন (Log Out)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
