import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Info,
  GraduationCap,
  LogOut,
  LogIn,
  ChevronDown,
  Phone,
  FileText,
  User,
  MapPin,
  MessageCircle
} from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import type { ThemeMode } from './ThemeSwitcher';
import { StudyMusicPlayer } from './StudyMusicPlayer';
import type { StudentUser } from './StudentAuthModal';
import { CarLogo } from './CarLogo';
import { WHATSAPP_GROUP_URL } from '../config/constants';
import { trackWhatsAppJoin } from '../services/analytics';

export type NavTab = 'rounds' | 'exam' | 'hotshot' | 'topics' | 'vocab' | 'mistakes' | 'admin';

interface HeaderProps {
  totalQuestionsAnswered: number;
  isVip: boolean;
  freeRoundsLimit?: number;
  academyPriceEur?: number;
  regularPriceEur?: number;
  onOpenPaywall: () => void;
  onOpenAbout: () => void;
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  currentUser: StudentUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
  onOpenInvoice?: () => void;
  onGoToCurriculum?: () => void;
  onOpenStudentProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalQuestionsAnswered: _totalQuestionsAnswered,
  isVip,
  freeRoundsLimit: _freeRoundsLimit = 20,
  academyPriceEur = 49,
  regularPriceEur = 120,
  onOpenPaywall,
  onOpenAbout,
  currentTheme,
  onThemeChange,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAdmin,
  onOpenInvoice,
  onGoToCurriculum,
  onOpenStudentProfile,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);
  return (
    <header className="sticky top-0 z-50 w-full bg-white/[0.98] dark:bg-[#0D1117]/[0.98] border-b border-slate-200 dark:border-white/10 shadow-sm transition-colors">
      <div className="max-w-[1600px] mx-auto px-[15px] py-3.5 sm:py-5 space-y-3 sm:space-y-4">
        {/* Top Line: Brand & VIP Upgrade Action */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <span className="font-black text-xl sm:text-3xl tracking-tight text-slate-900 dark:text-white">
                  Patente<span className="text-[#FB6C00]">Bangla</span>
                </span>
                {/* Official Patente Guru Badge (Positioned where user marked red box) */}
                <CarLogo size="lg" className="shrink-0 drop-shadow-md" />
              </div>
              <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block mt-0.5">
                ইতালিয়ান ড্রাইভিং লাইসেন্স স্কুল কুইজ • সহজ বাংলা ব্যাখ্যা ও অডিও
              </p>
              <div className="inline-flex items-center gap-1.5 sm:gap-2 mt-1 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200 text-[10.5px] sm:text-[12px] font-bold tracking-wide leading-tight">
                <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 dark:bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-slate-700 dark:bg-white"></span>
                </span>
                <span>Official 2026 Ministerial Questions • সরকারি অফিসিয়াল সিলেবাস</span>
              </div>
            </div>
          </div>

          {/* Right Status / Theme / Music / Student Pass Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-between sm:justify-end w-full sm:w-auto pt-2.5 sm:pt-0 border-t border-slate-200 dark:border-white/10 sm:border-0">
            {/* 3-Way Theme Switcher (Light / Reader / Dark) */}
            <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />

            {/* Study Ambient Concentration Music */}
            <StudyMusicPlayer />

            {/* Student Auth / Profile Menu */}
            {currentUser ? (
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="py-2 sm:py-2.5 px-3 sm:px-4 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
                  title="Your Student Profile"
                >
                  <div className="w-6 h-6 rounded-full bg-[#FB6C00] text-white flex items-center justify-center text-xs font-black uppercase shadow-xs">
                    {(currentUser.name || currentUser.email || 'S').charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[90px] sm:max-w-[130px] truncate">{currentUser.name || currentUser.email?.split('@')[0] || 'Student'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Card */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#12161F] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 p-4 space-y-3 z-50 animate-fadeIn text-left">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E52E2D] to-[#FB6C00] text-white flex items-center justify-center text-sm font-black uppercase shadow-md shrink-0">
                        {(currentUser.name || currentUser.email || 'S').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {currentUser.name || currentUser.email?.split('@')[0] || 'Student'}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {currentUser.email || ''}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      {currentUser.phone && (
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{currentUser.phone}</span>
                        </div>
                      )}

                      {currentUser.address && (
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-[#FB6C00] shrink-0" />
                          <span className="truncate">{currentUser.address}{currentUser.city ? `, ${currentUser.city}` : ''}</span>
                        </div>
                      )}

                      <div className="p-2.5 rounded-xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Plan Status</span>
                          {currentUser.isVip || isVip ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-black uppercase">
                              ACADEMY PRO
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-black uppercase">
                              FREE FOUNDATION
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* View & Edit Student Full Data Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        if (onOpenStudentProfile) onOpenStudentProfile();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:from-[#d02524] hover:to-[#e55e00] text-white font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#FB6C00]/25 active:scale-95"
                    >
                      <User className="w-3.5 h-3.5 text-white" />
                      <span>আমার তথ্য ও প্রোফাইল (My Data)</span>
                    </button>

                    {/* WhatsApp Student Group Shortcut */}
                    <a
                      href={WHATSAPP_GROUP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setIsProfileOpen(false);
                        trackWhatsAppJoin('header_profile_dropdown');
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-[#25D366]/30 active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current text-[#25D366]" />
                      <span>WhatsApp স্টুডেন্ট গ্রুপ (Join Group)</span>
                    </a>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      {(isVip || currentUser.isVip) && onOpenInvoice && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            onOpenInvoice();
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-white/15"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#FB6C00]" />
                          <span>অফিসিয়াল ইনভয়েস (Fattura PDF)</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          onLogout();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-rose-200 dark:border-rose-900/50"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out (সাইন আউট)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="py-2 sm:py-2.5 px-3 sm:px-4 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
                title="Student Login / Register"
              >
                <LogIn className="w-4 h-4 text-[#FB6C00]" />
                <span>Sign In / Register</span>
              </button>
            )}

            {/* About Us */}
            <button
              type="button"
              onClick={onOpenAbout}
              className="py-2 sm:py-2.5 px-3 sm:px-3.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="About Us & Founder"
            >
              <Info className="w-4 h-4 text-[#FB6C00]" />
              <span className="hidden lg:inline">About</span>
            </button>

            {/* Admin Portal Button */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-bold transition flex items-center gap-1 cursor-pointer"
              title="Admin CRM Portal (Authorized Admins)"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span className="hidden xl:inline text-xs">Admin</span>
            </button>

            {/* Academy Enrollment CTA */}
            {!isVip ? (
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wider block">
                    VIP 240 Rounds
                  </span>
                  <div className="flex items-baseline gap-1 justify-end">
                    <span className="text-[11px] text-slate-400 line-through">
                      €{regularPriceEur}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                      €{academyPriceEur}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenPaywall}
                  className="py-2 sm:py-2.5 px-3.5 sm:px-5 rounded-full bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:from-[#d02524] hover:to-[#e55e00] text-white font-black text-xs sm:text-sm shadow-md shadow-[#FB6C00]/30 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-1.5 sm:gap-2 shrink-0 animate-pulse"
                  title="সম্পূর্ণ কোর্স এক্সেস পেতে এখনই এনরোল ও পেমেন্ট করুন"
                >
                  <GraduationCap className="w-4 h-4 text-white shrink-0" />
                  <span>🔥 Pay Now (€{academyPriceEur}) / ভর্তি হন</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={onGoToCurriculum}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-black transition cursor-pointer shadow-xs active:scale-95"
                  title="২৪০ রাউন্ডের সম্পূর্ণ সিলেবাস খুলুন"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="hidden sm:inline">VIP Enrolled (240 Rounds)</span>
                  <span className="sm:hidden">VIP</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenPaywall}
                  className="py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-full bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] text-white text-[11px] sm:text-xs font-black transition cursor-pointer shadow-xs active:scale-95 flex items-center gap-1"
                  title="Make payment or test checkout"
                >
                  <span>💳 Pay Now</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
