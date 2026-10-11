import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  MapPin,
  Mail,
  Globe
} from 'lucide-react';
import type { InvoiceRecord } from '../services/paymentService';
import { printInvoiceDocument } from '../utils/invoicePrinter';

interface CourseInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceRecord | null;
  onStartCourse?: () => void;
}

export const CourseInvoiceModal: React.FC<CourseInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onStartCourse,
}) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    printInvoiceDocument(invoice);
  };

  const formattedAmount = `€${Number(invoice.amount || 49).toFixed(2).replace('.', ',')}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full my-auto overflow-hidden shadow-2xl border border-slate-200 transform transition-all max-h-[92vh] flex flex-col text-slate-800">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between gap-3 shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                <span>পেমেন্ট সফল ও অফিসিয়াল রসিদ</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  PAGATO
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Ricevuta Fiscale Ufficiale • Scaricabile & Stampabile
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 transition shadow-sm cursor-pointer active:scale-95"
              title="Stampa o Salva PDF (Print / Save as PDF)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Stampa / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              aria-label="Chiudi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div 
          id="printable-invoice" 
          className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-white text-slate-800 text-left"
        >
          {/* Header Issuer & Document Info */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-5 border-b-2 border-slate-100">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Patente<span className="text-[#FB6C00]">Guru</span><span className="text-blue-600">.it</span>
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  Autoscuola Digitale
                </span>
              </div>
              <p className="text-xs font-bold text-slate-700">
                {invoice.issuer.instructor}
              </p>
              <div className="text-[11px] text-slate-500 space-y-0.5">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{invoice.issuer.location}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{invoice.issuer.email}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{invoice.issuer.website}</span>
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-right w-full sm:w-auto shrink-0 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                Ricevuta di Pagamento
              </span>
              <p className="text-base font-black text-blue-700 tracking-wide font-mono">
                {invoice.id}
              </p>
              <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
                <p>Data: <strong className="font-semibold text-slate-800">{invoice.formattedDate}</strong></p>
                <p>Transazione: <strong className="font-mono text-slate-800">{invoice.transactionId}</strong></p>
              </div>
            </div>
          </div>

          {/* Student Billing Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 block">
                Dati Intestatario / Studente (Student Info)
              </span>
              <p className="text-sm font-black text-slate-900">
                {invoice.studentName}
              </p>
              <p className="text-slate-600">
                Email: <span className="font-semibold text-slate-800">{invoice.studentEmail}</span>
              </p>
              <p className="text-slate-600">
                Tel: <span className="font-semibold text-slate-800">{invoice.studentPhone}</span>
              </p>
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 block">
                Dati Fiscali & Residenza
              </span>
              <p className="text-slate-600">
                Codice Fiscale:{' '}
                <span className="font-mono font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-blue-200">
                  {invoice.codiceFiscale}
                </span>
              </p>
              <p className="text-slate-600">
                Città: <span className="font-semibold text-slate-800">{invoice.city || 'Bolzano, Italia'}</span>
              </p>
              <p className="text-slate-600">
                Metodo: <span className="font-semibold text-slate-800">{invoice.paymentMethodLabel}</span>
              </p>
            </div>
          </div>

          {/* Service Line Items Table */}
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Descrizione Servizio / Corso</th>
                    <th className="py-2.5 px-2 text-center">Qtà</th>
                    <th className="py-2.5 px-2 text-right">Prezzo</th>
                    <th className="py-2.5 px-3 text-right">Totale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">
                        Corso Completo Patente B 2026 (Accesso Fino al Conseguimento)
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                        • Tutti i 240 Round Ufficiali (7.200+ Quiz Ministeriali con traduzione in Bengali)
                        <br />• Simulatore Esame Orale con audio a voce naturale italiana
                        <br />• 25 Capitoli di Teoria & Banca Parole Trabocchetto
                        <br />• Assistenza Didattica e Ripasso Errori Illimitato
                      </p>
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-slate-700">1</td>
                    <td className="py-3 px-2 text-right font-medium text-slate-700">{formattedAmount}</td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">{formattedAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Price Calculation Box */}
            <div className="pt-2 flex justify-end">
              <div className="w-full sm:w-64 space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Imponibile:</span>
                  <span>{formattedAmount}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>IVA (Esente art. 10 DPR 633/72):</span>
                  <span>€0,00</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Totale Pagato:</span>
                  <span className="text-emerald-700">{formattedAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Exemption Notice */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 leading-relaxed">
            <p className="font-semibold text-slate-700 mb-0.5">Nota Fiscale & Garanzia:</p>
            <p>{invoice.taxExemptionNote}</p>
            <p className="mt-1">
              Ricevuta valida ai fini della detrazione e registrazione contabile per corsi di preparazione ed istruzione teorica.
            </p>
          </div>

          {/* Digital Stamp & Sign */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center font-black text-xs">
                PAID
              </div>
              <div className="text-[11px] leading-tight">
                <p className="font-black text-emerald-700 uppercase tracking-wider">
                  PAGAMENTO CONFERMATO
                </p>
                <p className="text-slate-500">Transazione: {invoice.transactionId}</p>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-500">
              <p className="font-bold text-slate-700">PatenteGuru.it / Zentixx Team</p>
              <p>Bolzano (BZ), Italia</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden when printing) */}
        <div className="no-print p-4 sm:p-5 bg-slate-50 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>অ্যাকাউন্টে ২৪০টি রাউন্ড সফলভাবে সক্রিয় করা হয়েছে।</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Scarica PDF / Stampa</span>
            </button>

            {onStartCourse && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartCourse();
                }}
                className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-blue-500/20 active:scale-95"
              >
                <span>কুইজ শুরু করুন (Vai al Corso)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
