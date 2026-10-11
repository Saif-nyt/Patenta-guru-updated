import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCw, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    try {
      const user = localStorage.getItem('patente_student_user');
      if (user) {
        const parsed = JSON.parse(user);
        if (!parsed || !parsed.name || typeof parsed.name !== 'string' || !parsed.name.trim()) {
          if (parsed?.email && typeof parsed.email === 'string') {
            parsed.name = parsed.email.split('@')[0] || 'Student';
            localStorage.setItem('patente_student_user', JSON.stringify(parsed));
          } else {
            localStorage.removeItem('patente_student_user');
          }
        }
      }
    } catch {
      try {
        localStorage.removeItem('patente_student_user');
      } catch {}
    }
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      localStorage.removeItem('patente_student_user');
      localStorage.removeItem('patente_bangla_completed_rounds');
      localStorage.removeItem('patente_bangla_mistakes');
      localStorage.removeItem('patente_bangla_unlocked_round');
      localStorage.removeItem('patente_bangla_answered_count');
      localStorage.removeItem('patente_last_study_date');
      localStorage.removeItem('patente_study_streak');
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D1117] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="max-w-md w-full bg-[#12161F] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E52E2D] to-[#FB6C00] flex items-center justify-center mx-auto shadow-lg shadow-[#FB6C00]/25">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                কিছু একটা সমস্যা হয়েছে
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                পেজটি লোড হতে সাময়িক ত্রুটি দেখা দিয়েছে। নিচের বোতামে ক্লিক করে রিলোড দিন অথবা ক্যাশ রিসেট করুন।
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#E52E2D] to-[#FB6C00] hover:from-[#d02524] hover:to-[#e55e00] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FB6C00]/25 transition cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>পেজ রিলোড করুন (Reload)</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetCache}
                className="w-full py-3 px-6 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
              >
                <Trash2 className="w-4 h-4 text-[#FB6C00]" />
                <span>ক্যাশ রিসেট ও ফ্রেশ স্টার্ট (Reset Cache)</span>
              </button>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Patente Bangla Italia • অটোমেটিক ডাটা প্রটেকশন</span>
            </div>

            {this.state.error && (
              <details className="text-left text-[11px] text-slate-500 bg-black/40 p-3 rounded-xl overflow-x-auto border border-white/5">
                <summary className="cursor-pointer text-slate-400 font-bold mb-1">Technical Details (কারিগরি তথ্য)</summary>
                <div className="font-mono text-rose-400 break-words">{this.state.error.toString()}</div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
