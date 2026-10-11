import React from 'react';
import type { NavTab } from './Header';
import { CarLogo } from './CarLogo';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenAbout: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenAbout, onOpenAdmin }) => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#0D1117] transition-colors">
      <div className="max-w-[1600px] mx-auto px-[15px] py-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Purpose */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="font-black text-lg text-slate-900 dark:text-white">
                Patente<span className="text-[#FB6C00]">Bangla</span> Italia
              </span>
              <CarLogo size="sm" />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              ইতালিতে বসবাসরত সকল ভাই ও বোনেদের জন্য ইতালিয়ান ড্রাইভিং লাইসেন্স (Patente B) এর প্রথম পূর্ণাঙ্গ বাংলা সহায়িকা।
              অফিশিয়াল কুইজের সহজ বাংলা অনুবাদ, কঠিন শব্দের উচ্চারণ এবং কেন সত্য বা মিথ্যা তার যৌক্তিক ব্যাখ্যা।
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              দ্রুত লিঙ্ক (Navigazione)
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={onOpenAbout}
                  className="hover:text-slate-950 dark:hover:text-white font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer flex items-center gap-1.5"
                >
                  ℹ️ আমাদের সম্পর্কে (Chi Siamo)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('hotshot')}
                  className="hover:text-amber-600 dark:hover:text-white text-[#FB6C00] font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  🔥 হটশট ফাঁদ প্রশ্ন (Trabocchetti)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('exam')}
                  className="hover:text-slate-950 dark:hover:text-white text-slate-700 dark:text-slate-300 transition cursor-pointer"
                >
                  🎯 সিমুলেশন পরীক্ষা (Simulazione Esame)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('topics')}
                  className="hover:text-slate-950 dark:hover:text-white text-slate-700 dark:text-slate-300 transition cursor-pointer"
                >
                  📚 অধ্যায়ভিত্তিক কুইজ (Quiz per Capitolo)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('vocab')}
                  className="hover:text-slate-950 dark:hover:text-white text-slate-700 dark:text-slate-300 transition cursor-pointer"
                >
                  📖 শব্দকোষ ও উচ্চারণ (Dizionario)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('mistakes')}
                  className="hover:text-slate-950 dark:hover:text-white text-slate-700 dark:text-slate-300 transition cursor-pointer"
                >
                  ❌ ভুল প্রশ্ন রিভিশন (I Miei Errori)
                </button>
              </li>
              <li className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAdmin) {
                      onOpenAdmin();
                    } else {
                      setActiveTab('admin');
                    }
                  }}
                  className="hover:text-slate-950 dark:hover:text-white text-slate-600 dark:text-slate-400 font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  🔒 অ্যাডমিন CRM ও কন্ট্রোল প্যানেল (Admin CRM)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Student Document Utility Card — Cross-Promotion with MyPdfTools.it */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 dark:border-emerald-500/20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white rounded-md">
                100% Gratis &amp; Privato
              </span>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                📄 ড্রাইভিং স্কুলের জন্য ডকুমেন্ট ও PDF তৈরি করুন (Documenti per Autoscuola / Motorizzazione)
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Permesso di Soggiorno, Carta d&apos;Identità এবং Codice Fiscale এর ছবি (JPG) থেকে PDF করতে বা একসাথে যুক্ত করতে আমাদের ফ্রি ও নিরাপদ টুল ব্যবহার করুন:
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="https://www.mypdftools.it/unire-documenti-identita-pdf"
              target="_blank"
              rel="noopener"
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <span>🪪 Unisci Documenti PDF</span>
            </a>
            <a
              href="https://www.mypdftools.it/da-jpg-a-pdf"
              target="_blank"
              rel="noopener"
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#161B26] hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 font-bold text-xs transition"
            >
              📸 Foto in PDF
            </a>
            <a
              href="https://www.mypdftools.it/comprimere-pdf-per-pec"
              target="_blank"
              rel="noopener"
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#161B26] hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 font-bold text-xs transition"
            >
              📉 Comprimi PDF
            </a>
            <a
              href="https://www.mypdftools.it"
              target="_blank"
              rel="noopener"
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#161B26] hover:bg-slate-50 dark:hover:bg-white/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-black text-xs transition"
            >
              MyPdfTools.it ↗
            </a>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#12161F] border border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-400 space-y-1 shadow-xs">
          <p className="font-bold text-slate-900 dark:text-slate-200">
            ⚠️ Disclaimer Legale &amp; Trasparenza (আইনি তথ্য):
          </p>
          <p className="leading-relaxed">
            PatenteBangla Italia è una piattaforma didattica indipendente per l'apprendimento e lo studio del Codice della Strada italiano per la comunità bengalese. Questo sito **NON è affiliato, sponsorizzato o gestito dal Ministero delle Infrastrutture e dei Trasporti (MIT)** né dalla Motorizzazione Civile. I testi delle domande ministeriali sono basati sui listati ufficiali di pubblico dominio.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} PatenteBangla Italia. All Rights Reserved • সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={onOpenAbout}
              className="hover:text-slate-950 dark:hover:text-white underline transition cursor-pointer font-medium text-slate-700 dark:text-slate-300"
            >
              Shifat Manjum &amp; Saiful Islam (Zentixx)
            </button>
            <span>•</span>
            <span>কমিউনিটির উপকারের জন্য নির্মিত</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
