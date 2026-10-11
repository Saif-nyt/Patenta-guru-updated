import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Building2, 
  Copy, 
  Check, 
  Loader2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { 
  createInvoiceRecord, 
  saveInvoice 
} from '../services/paymentService';
import type { 
  PaymentMethodType, 
  PaymentFormData, 
  InvoiceRecord 
} from '../services/paymentService';
import { 
  getAppSettings, 
  SETTINGS_CHANGE_EVENT 
} from '../services/appSettingsService';
import { trackInitiateCheckout } from '../utils/metaPixel';

interface CoursePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (invoice: InvoiceRecord) => void;
  initialStudent?: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
  attemptedRound?: number;
  academyPriceEur?: number;
  regularPriceEur?: number;
}

export const CoursePaymentModal: React.FC<CoursePaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialStudent,
  attemptedRound = 21,
  academyPriceEur,
  regularPriceEur,
}) => {
  const [appSettings, setAppSettings] = useState(() => getAppSettings());
  const activePrice = academyPriceEur || appSettings.academyPriceEur || 49;
  const regularPrice = regularPriceEur || appSettings.regularPriceEur || 120;

  useEffect(() => {
    const handleSettingsChanged = (e: any) => {
      if (e?.detail) setAppSettings(e.detail);
    };
    window.addEventListener(SETTINGS_CHANGE_EVENT, handleSettingsChanged);
    return () => window.removeEventListener(SETTINGS_CHANGE_EVENT, handleSettingsChanged);
  }, []);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedIban, setCopiedIban] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState<PaymentFormData>({
    studentName: initialStudent?.name || '',
    studentEmail: initialStudent?.email || '',
    studentPhone: initialStudent?.phone || '+39 ',
    codiceFiscale: '',
    address: '',
    city: 'Bolzano',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  // Keep initial student updated if changed
  useEffect(() => {
    if (initialStudent) {
      setFormData((prev) => ({
        ...prev,
        studentName: prev.studentName || initialStudent.name || '',
        studentEmail: prev.studentEmail || initialStudent.email || '',
        studentPhone: prev.studentPhone && prev.studentPhone !== '+39 ' ? prev.studentPhone : initialStudent.phone || '+39 ',
      }));
    }
  }, [initialStudent]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isProcessing]);

  if (!isOpen) return null;

  const handleCopyIban = (iban: string) => {
    navigator.clipboard.writeText(iban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2500);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.studentName.trim()) {
      setErrorMessage('দয়া করে আপনার সম্পূর্ণ নাম (Nome e Cognome) লিখুন।');
      return;
    }

    if (!formData.studentEmail.trim() || !formData.studentEmail.includes('@')) {
      setErrorMessage('দয়া করে একটি সঠিক ইমেইল অ্যাড্রেস লিখুন (যেখানে ইনভয়েস পাঠানো হবে)।');
      return;
    }

    setIsProcessing(true);

    // If Bonifico Bancario, complete local invoice workflow
    if (selectedMethod === 'bonifico') {
      try {
        const payload: PaymentFormData = {
          ...formData,
          paymentMethod: selectedMethod,
        };
        const invoice = createInvoiceRecord(payload, activePrice);
        saveInvoice(invoice);
        setIsProcessing(false);
        onSuccess(invoice);
      } catch (err: any) {
        setIsProcessing(false);
        setErrorMessage(err?.message || 'পেমেন্ট প্রসেস করতে সাময়িক সমস্যা হয়েছে।');
      }
      return;
    }

    // Real Stripe Checkout for Card, PostePay, Apple Pay, Google Pay, and PayPal
    try {
      trackInitiateCheckout(activePrice, 'EUR', 'Patente Bangla Pro Pass');
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: formData.studentName.trim(),
          studentEmail: formData.studentEmail.trim().toLowerCase(),
          studentPhone: formData.studentPhone.trim(),
          codiceFiscale: formData.codiceFiscale.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          priceEur: activePrice,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Stripe পেমেন্ট গেটওয়েতে সংযোগ করতে সমস্যা হয়েছে।');
      }

      // Redirect student to Stripe's official 256-bit SSL encrypted 3D-Secure checkout
      window.location.href = data.url;
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err?.message || 'পেমেন্ট গেটওয়েতে সংযোগ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full my-auto overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 transform transition-all max-h-[92vh] flex flex-col text-slate-800 dark:text-slate-100 text-left">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#170E18] via-[#0D1117] to-[#18110E] p-5 sm:p-6 text-white relative shrink-0 border-b border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1.5 pr-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-black text-slate-200">
              <Lock className="w-3.5 h-3.5 text-[#FB6C00]" />
              <span>Checkout Sicuro SSL 256-bit • Ricevuta Fiscale Immediata</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
              অনলাইন কোর্স এনরোলমেন্ট ও পেমেন্ট (€{activePrice})
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
              পাস করা পর্যন্ত এককালীন এক্সেস (Una Tantum) • Round #{attemptedRound} থেকে ২৪০ রাউন্ড এবং সাথে সাথে অফিসিয়াল ইনভয়েস রসিদ
            </p>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmitPayment} className="p-5 sm:p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Pricing Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Pacchetto Ufficiale Patente B 2026
              </span>
              <p className="text-sm font-black text-slate-900 dark:text-white">
                ২৪০টি সম্পূর্ণ রাউন্ড + অডিও সিমুলেশন + ফুল সিলেবাস
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                ✓ কোনো রিনিউ ফি নেই • লাইসেন্স পাস করার আগ পর্যন্ত আনলিমিটেড
              </p>
            </div>

            <div className="text-right sm:border-l sm:border-slate-200 dark:sm:border-slate-700 sm:pl-4 shrink-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  €{activePrice},00
                </span>
                <span className="text-xs text-slate-400 line-through">€{regularPrice}</span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                Esente IVA Art. 10 DPR 633/72
              </span>
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              পেমেন্ট মাধ্যম নির্বাচন করুন (Metodo di Pagamento):
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Card / PostePay Evolution */}
              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  selectedMethod === 'card'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-black shadow-xs ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold leading-tight">Carta / PostePay</span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400">Visa / Mastercard</span>
              </button>

              {/* PostePay Gialla Standard */}
              <button
                type="button"
                onClick={() => setSelectedMethod('postepay')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  selectedMethod === 'postepay'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-black shadow-xs ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="w-5 h-5 rounded-md bg-amber-400 text-slate-900 flex items-center justify-center text-[10px] font-black">
                  P
                </div>
                <span className="text-xs font-bold leading-tight">PostePay</span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400">Poste Italiane</span>
              </button>

              {/* PayPal */}
              <button
                type="button"
                onClick={() => setSelectedMethod('paypal')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  selectedMethod === 'paypal'
                    ? 'border-[#FB6C00] bg-orange-50 dark:bg-white/5 text-[#FB6C00] dark:text-[#FB6C00] font-black shadow-xs ring-2 ring-[#FB6C00]/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span className="text-sm font-black text-[#FB6C00]">🅿️ PayPal</span>
                <span className="text-xs font-bold leading-tight">PayPal</span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400">Express Pay</span>
              </button>

              {/* Bonifico Bancario / SEPA */}
              <button
                type="button"
                onClick={() => setSelectedMethod('bonifico')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  selectedMethod === 'bonifico'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold leading-tight">Bonifico</span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400">SEPA Bancario</span>
              </button>
            </div>
          </div>

          {/* Student Billing & Invoice Information */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>ইনভয়েস ও স্টুডেন্ট তথ্য (Dati Intestatario Fattura):</span>
              </label>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                অফিসিয়াল রসিদের জন্য প্রযোজ্য
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  আপনার সম্পূর্ণ নাম (Nome e Cognome) *
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="e.g. Md Shifat Manjum"
                  value={formData.studentName}
                  onChange={(e) => setFormData((p) => ({ ...p, studentName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  ইমেইল অ্যাড্রেস (Email per Ricevuta) *
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="student@gmail.com"
                  value={formData.studentEmail}
                  onChange={(e) => setFormData((p) => ({ ...p, studentEmail: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  মোবাইল / WhatsApp নম্বর (Telefono)
                </label>
                <input
                  type="tel"
                  autoComplete="tel"
                  placeholder="+39 351 000 0000"
                  value={formData.studentPhone}
                  onChange={(e) => setFormData((p) => ({ ...p, studentPhone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Codice Fiscale (ইতালিয়ান ট্যাক্স কোড)
                </label>
                <input
                  type="text"
                  placeholder="es. RSSMRA85M01H501Z"
                  value={formData.codiceFiscale}
                  onChange={(e) => setFormData((p) => ({ ...p, codiceFiscale: e.target.value.toUpperCase() }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  শহর / ঠিকানা (Città / Indirizzo in Italia)
                </label>
                <input
                  type="text"
                  placeholder="es. Bolzano, Milano, Bologna, Roma..."
                  value={formData.city}
                  onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Stripe Card & PostePay Gateway View */}
          {(selectedMethod === 'card' || selectedMethod === 'postepay') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Stripe Official Checkout (3D-Secure 256-bit)</span>
                </span>
                <div className="flex items-center gap-1 text-[10px] font-black text-slate-600 dark:text-slate-300">
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border">VISA</span>
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border">Mastercard</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-900 font-bold">PostePay</span>
                  <span className="px-2 py-0.5 rounded-md bg-black text-white font-bold"> Pay</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/60 space-y-2 text-xs">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  নিচের <strong>"Paga Ora €{activePrice},00 con Stripe"</strong> বাটনে ক্লিক করলে আপনাকে Stripe-এর অফিসিয়াল <strong>256-bit SSL নিরাপদ চেকআউট</strong> পেজে নিয়ে যাওয়া হবে।
                </p>
                <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ PostePay Evolution, Visa, Mastercard, Apple Pay ও Google Pay সাপোর্টেড
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ আপনার ব্যাংকের PosteID / 3D-Secure SMS ওটিপি দিয়ে সম্পূর্ণ সুরক্ষিত
                  </li>
                  <li className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                    ✓ পেমেন্ট সম্পন্ন হওয়ামাত্রই স্বয়ংক্রিয়ভাবে সব ২৪০টি রাউন্ড ওপেন হবে এবং অফিশিয়াল ইনভয়েস পাবেন
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* PayPal Gateway View */}
          {selectedMethod === 'paypal' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-orange-50/60 dark:bg-white/5 border border-orange-200 dark:border-white/10 space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-orange-100 dark:border-white/10 mx-auto flex items-center justify-center text-xl shadow-xs">
                🅿️
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                PayPal Express Checkout
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                আপনার পেপ্যাল অ্যাকাউন্ট বা পেপ্যাল লিংক করা যেকোনো কার্ড থেকে মাত্র ১-ক্লিকে নিরাপদ পেমেন্ট সম্পন্ন হবে।
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-white/10 text-[#FB6C00] dark:text-orange-200 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FB6C00]" />
                <span>Protezione Acquisti PayPal al 100%</span>
              </div>
            </div>
          )}

          {/* Bonifico Bancario View */}
          {selectedMethod === 'bonifico' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Dati per il Bonifico Bancario SEPA</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Accredito Diretto
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">IBAN Ufficiale:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-slate-900 dark:text-white text-xs sm:text-sm">
                      IT89 X 03069 09606 100000184729
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyIban('IT89X0306909606100000184729')}
                      className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition cursor-pointer"
                      title="Copia IBAN"
                    >
                      {copiedIban ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Beneficiario:</span>
                  <span className="font-bold text-slate-900 dark:text-white">Shifat Manjum (PatenteGuru)</span>
                </div>

                <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Banca / Sede:</span>
                  <span className="font-bold text-slate-900 dark:text-white">Bolzano, Italia</span>
                </div>

                <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Causale:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    Iscrizione Patente B - {formData.studentName || 'Studente'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                * বোনিফিকো সম্পন্ন করার পর নিচের বাটনে ক্লিক করুন। সাথে সাথে আপনার অফিশিয়াল রসিদ জেনারেট হয়ে যাবে এবং ২৪০টি রাউন্ড ওপেন হবে।
              </p>
            </div>
          )}

          {/* Guarantee Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Attivazione Istantanea 240 Round</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Accesso Valido Fino al Conseguimento Esame</span>
            </span>
          </div>

          {/* Action CTA Button */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Stripe সুরক্ষিত পেমেন্ট পেজে রিডাইরেক্ট হচ্ছে...</span>
                </>
              ) : selectedMethod === 'bonifico' ? (
                <>
                  <Building2 className="w-4.5 h-4.5" />
                  <span>বোনিফিকো তথ্য নিশ্চিত করুন • Conferma Bonifico €{activePrice},00</span>
                </>
              ) : (
                <>
                  <Lock className="w-4.5 h-4.5" />
                  <span>
                    নিরাপদে পেমেন্ট সম্পন্ন করুন (€{activePrice}) • Paga Ora €{activePrice},00 con Stripe
                  </span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-bold text-center transition cursor-pointer"
            >
              পরে করবো (Annulla e Chiudi)
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
