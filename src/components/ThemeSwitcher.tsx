import React from 'react';
import { Sun, Moon, BookOpen } from 'lucide-react';

export type ThemeMode = 'light' | 'sepia' | 'dark';

interface ThemeSwitcherProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="flex items-center p-1 rounded-full bg-slate-200/80 dark:bg-white/10 theme-sepia:bg-[#EFE4CC] border border-slate-300/80 dark:border-white/15 theme-sepia:border-[#DFCEAC] text-xs font-bold transition-all shadow-inner">
      {/* Light Theme */}
      <button
        type="button"
        onClick={() => onThemeChange('light')}
        className={`px-2.5 sm:px-3 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
          currentTheme === 'light'
            ? 'bg-white text-slate-950 shadow-xs font-black ring-1 ring-slate-300'
            : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
        }`}
        title="Light Mode (উজ্জ্বল আলো)"
      >
        <Sun className="w-3.5 h-3.5 text-amber-500" />
        <span className="hidden md:inline">Light</span>
      </button>

      {/* Sepia Reader Theme */}
      <button
        type="button"
        onClick={() => onThemeChange('sepia')}
        className={`px-2.5 sm:px-3 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
          currentTheme === 'sepia'
            ? 'bg-[#FCF8ED] text-[#2F1B0B] shadow-xs font-black ring-1 ring-[#DFCEAC]'
            : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
        }`}
        title="Reader Mood (চোখের আরামদায়ক রিডার থিম)"
      >
        <BookOpen className="w-3.5 h-3.5 text-[#B45309]" />
        <span className="hidden md:inline">Reader</span>
      </button>

      {/* Dark Theme */}
      <button
        type="button"
        onClick={() => onThemeChange('dark')}
        className={`px-2.5 sm:px-3 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
          currentTheme === 'dark'
            ? 'bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] text-white shadow-xs font-black ring-1 ring-[#FB6C00]/40'
            : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
        }`}
        title="Dark Night Theme (রাতের ডার্ক মুড)"
      >
        <Moon className={`w-3.5 h-3.5 ${currentTheme === 'dark' ? 'text-white' : 'text-amber-400'}`} />
        <span className="hidden md:inline">Dark</span>
      </button>
    </div>
  );
};

