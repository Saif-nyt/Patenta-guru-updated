import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export type AppTab = 'dashboard' | 'curriculum' | 'exam' | 'theory' | 'errors';

interface AppNavigationProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  errorCount?: number;
  activeRound?: number;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({
  currentTab,
  onTabChange,
  errorCount = 0,
}) => {
  const tabs = [
    {
      id: 'dashboard' as AppTab,
      label: 'Dashboard',
      subtext: 'Overview & Stats',
      icon: LayoutDashboard,
    },
    {
      id: 'curriculum' as AppTab,
      label: '240 Rounds',
      subtext: '7K+ Questions',
      icon: BookOpen,
    },
    {
      id: 'exam' as AppTab,
      label: 'Real Life Exam Simulator',
      subtext: '30 Qs Official / 20 Min',
      icon: Clock,
    },
    {
      id: 'theory' as AppTab,
      label: 'Summarized Theory',
      subtext: '25 Chapters',
      icon: FileText,
    },
    {
      id: 'errors' as AppTab,
      label: 'Error Review',
      subtext: errorCount > 0 ? `${errorCount} Errors Saved` : 'Revisione Errori',
      icon: AlertCircle,
    },
  ];

  return (
    <>
      {/* Desktop & Tablet Top Tab Navigation Bar (Adaptive Cockpit Style) */}
      <nav className="hidden md:block bg-white/[0.97] dark:bg-[#0D1117]/[0.97] border-b border-slate-200 dark:border-white/10 relative z-30 shadow-xs dark:shadow-xl transition-colors">
        <div className="max-w-[1600px] mx-auto px-[15px] py-3 sm:py-4">
          <div 
            className="flex items-center justify-start xl:justify-center gap-2.5 lg:gap-4 overflow-x-auto no-scrollbar scrollbar-none py-1 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`group relative p-[2px] rounded-2xl cursor-pointer transition-all duration-200 shrink-0 select-none ${
                    isActive
                      ? 'scale-[1.02] -translate-y-0.5'
                      : 'hover:scale-[1.01] hover:-translate-y-0.5 opacity-90 hover:opacity-100'
                  } active:translate-y-0.5 active:scale-[0.98]` }
                >
                  {/* Physical Push-Button Body */}
                  <div
                    className={`relative z-10 w-full h-full rounded-[14px] px-3.5 py-3 sm:px-4.5 sm:py-3.5 lg:px-5 lg:py-3.5 min-h-[58px] lg:min-h-[64px] flex items-center gap-3 lg:gap-3.5 transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-gradient-to-b dark:from-[#1C2333] dark:via-[#12161F] dark:to-[#0D1117] border border-slate-900 dark:border-t-white/30 dark:border-b-black shadow-md dark:shadow-[0_4px_16px_rgba(0,0,0,0.6)]'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-800 dark:bg-gradient-to-b dark:from-[#151A26] dark:via-[#12161F] dark:to-[#0D1117] dark:text-white/90 dark:hover:text-white border border-slate-200 dark:border-t-white/10 dark:border-b-black shadow-xs dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]'
                    }`}
                  >
                    {/* Illuminated Icon */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 border ${
                        isActive
                          ? 'bg-white/15 dark:bg-[#E52E2D]/20 border-white/20 dark:border-[#E52E2D]/60'
                          : 'bg-white dark:bg-white/5 border-slate-300 dark:border-white/10'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" style={{ color: isActive ? '#FFFFFF' : undefined }} />
                    </div>

                    {/* Dual-Tier Text without dot light */}
                    <div className="text-left flex flex-col justify-center">
                      <span className={`text-xs sm:text-sm lg:text-base font-black tracking-tight whitespace-nowrap ${
                        isActive ? 'text-white' : 'text-slate-900 dark:text-white'
                      }`}>
                        {tab.label}
                      </span>
                      <span
                        className={`text-[9.5px] sm:text-[10px] lg:text-[11px] font-black tracking-wider uppercase whitespace-nowrap block mt-0.5 ${
                          isActive ? 'text-amber-300 dark:text-[#FB6C00]' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {tab.subtext}
                      </span>
                    </div>

                    {/* Active Bottom Indicator */}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-[#FB6C00] dark:bg-[#E52E2D]"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0D1117]/95 border-t border-slate-200 dark:border-white/10 shadow-[0_-8px_25px_rgba(0,0,0,0.1)] dark:shadow-[0_-8px_25px_rgba(0,0,0,0.6)] safe-bottom select-none touch-manipulation">
        <div className="grid grid-cols-5 h-[68px] sm:h-[72px] px-1.5 py-1 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 relative transition-all duration-150 cursor-pointer rounded-xl py-1 ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white/10 dark:text-white border-t border-slate-700 dark:border-white/20 shadow-xs dark:shadow-[0_2px_8px_rgba(0,0,0,0.6)]'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95'
                }`}
              >
                <div
                  className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center relative transition-transform ${
                    isActive ? 'scale-105' : ''
                  } ${
                    isActive
                      ? 'bg-white/15 dark:bg-[#E52E2D]/20 border border-white/20 dark:border-[#E52E2D]/50'
                      : 'bg-transparent border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4.5 h-4.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`}
                  />
                  {tab.id === 'errors' && errorCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 text-[8px] font-black px-1.5 py-0.2 rounded-full bg-[#E52E2D] text-white shadow-xs">
                      {errorCount > 99 ? '99+' : errorCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[9px] sm:text-[10px] tracking-tight whitespace-nowrap truncate max-w-[62px] text-center ${
                    isActive ? 'font-black' : 'font-medium'
                  }`}
                >
                  {tab.id === 'exam' ? 'Exam Sim' : tab.label}
                </span>
                {isActive && (
                  <span
                    className="absolute bottom-0.5 w-6 h-0.5 rounded-full bg-[#FB6C00] dark:bg-[#E52E2D]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
