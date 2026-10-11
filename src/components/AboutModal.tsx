import React from 'react';
import { X, Mail, Globe, ShieldCheck, HeartHandshake, Compass } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#12161F] theme-sepia:bg-[#FCF8ED] border border-slate-200 dark:border-white/10 theme-sepia:border-[#DFCEAC] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto text-left">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-white/10 border border-orange-200 dark:border-white/15 text-xs font-bold text-orange-800 dark:text-orange-200">
            <Compass className="w-3.5 h-3.5 text-[#FB6C00]" />
            <span>আমাদের পরিচিতি ও মিশন</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            আমাদের সম্পর্কে (Chi Siamo)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            ইতালিতে প্রবাসী ভাই-বোনদের লাইসেন্স জয়ের নির্ভরযোগ্য সঙ্গী।
          </p>
        </div>

        {/* Founders & Development Partners Grid */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-5 text-left shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Shifat Manjum */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xs">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#FB6C00] to-[#F9B637] p-0.5 shadow-sm shrink-0">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center text-lg font-black text-[#FB6C00]">
                  SM
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Shifat Manjum</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-100 dark:bg-orange-950/60 text-[#FB6C00] border border-orange-200 dark:border-orange-800">
                    Founder
                  </span>
                </div>
                <p className="text-xs text-[#FB6C00] font-bold truncate">
                  Product Architect &amp; Founder
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  সফটওয়্যার ডেভেলপার ও উদ্যোক্তা
                </p>
              </div>
            </div>

            {/* Saiful Islam */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xs">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-sm shrink-0">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center text-lg font-black text-emerald-600">
                  SI
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Saiful Islam</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Partner
                  </span>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold truncate">
                  Co-Developer &amp; Partner
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  সফটওয়্যার ডেভেলপার ও প্রজেক্ট পার্টনার
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal pt-2 border-t border-slate-200 dark:border-white/10">
            <p>
              «ইতালিতে আসার পর একটি ড্রাইভিং লাইসেন্স (Patente B) পাওয়া মানে কেবল গাড়ি চালানো নয়—এটি কাজের নতুন দুয়ার উন্মোচন, স্বাধীনভাবে চলাফেরা এবং পরিবারের সুরক্ষা নিশ্চিত করার সবচেয়ে বড় চাবিকাঠি।»
            </p>
            <p>
              «কিন্তু বহু বছর ধরে আমরা দেখেছি, কঠিন ইতালিয়ান ব্যাকরণ ও হাজার হাজার অপরিচিত শব্দের কারণে আমাদের বহু প্রবাসী ভাই-বোন বারবার পরীক্ষায় ফেল করেন। অনেকেই কাজের ব্যস্ততার কারণে নির্দিষ্ট সময়ে কোচিং বা জুম ক্লাসে বসতে পারেন না, আবার অনেকে অতিরিক্ত অর্থ খরচ করেও সঠিক গাইডলাইন পান না।»
            </p>
            <p className="text-orange-950 dark:text-orange-200 font-semibold bg-orange-100/50 dark:bg-orange-950/40 p-3 rounded-xl border border-orange-200 dark:border-orange-800">
              «সেই সমস্যাকে স্থায়ীভাবে সমাধান করতেই আমরা (Shifat Manjum &amp; Saiful Islam) যৌথভাবে দিনরাত পরিশ্রম করে তৈরি করেছি Patente Bangla। আমাদের লক্ষ্য একটাই: উন্নত প্রযুক্তি ও কৃত্রিম বুদ্ধিমত্তার সাহায্যে প্রতিটি সরকারি প্রশ্নকে সহজ বাংলায় বুঝিয়ে দেওয়া, সঠিক উচ্চারণ শোনানো এবং পরীক্ষার ফাঁদ শব্দগুলো ধরিয়ে দেওয়া—যাতে যে কেউ নিজের সুবিধামতো সময়ে অনুশীলন করে প্রথম সুযোগেই সফল হতে পারেন।»
            </p>
          </div>

          {/* Social / Contact Links */}
          <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-4 text-xs">
            <a
              href="mailto:khshifat@gmail.com"
              className="inline-flex items-center gap-1.5 text-[#FB6C00] hover:text-[#e05f00] font-bold transition"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>khshifat@gmail.com</span>
            </a>
            <a
              href="https://github.com/shifat-manjum"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Shifat Manjum</span>
            </a>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-500 dark:text-slate-400 text-xs">
              টিম: <strong className="text-slate-800 dark:text-slate-200">Shifat Manjum &amp; Saiful Islam (Zentixx • MyPdfTools)</strong>
            </span>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-white/10 text-[#FB6C00] flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">১০০% ডিজিটাল প্রস্তুতি</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              স্মার্টফোন বা ল্যাপটপ থেকে যেকোনো সময়, যেকোনো জায়গা থেকে অনুশীলন।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-white/10 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">নির্ভুল সরকারি ডেটা</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              ইতালির মোটরিজ্জাসিওনে (Motorizzazione)-র হুবহু অফিশিয়াল প্রশ্নব্যাংক।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-white/10 text-amber-600 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">বাংলা ভাষাভাষী কমিউনিটি</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              সহজ বাংলা অনুবাদ, সঠিক উচ্চারণ এবং কেন সত্য/মিথ্যা তার যুক্তি।
            </p>
          </div>
        </div>

        {/* Close Button Bottom */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-8 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 font-black text-xs transition cursor-pointer"
          >
            বন্ধ করুন (Chiudi)
          </button>
        </div>
      </div>
    </div>
  );
};
