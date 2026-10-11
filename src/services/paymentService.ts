export type PaymentMethodType = 'card' | 'postepay' | 'paypal' | 'applepay' | 'bonifico';

export interface InvoiceRecord {
  id: string; // e.g. "PG-2026-84729"
  date: string; // ISO string
  formattedDate: string; // e.g. "24/09/2026, 21:40"
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  codiceFiscale: string; // Italian Codice Fiscale
  address?: string;
  city?: string;
  amount: number; // 49.00
  currency: string; // "EUR"
  taxExemptionNote: string;
  paymentMethod: PaymentMethodType;
  paymentMethodLabel: string;
  transactionId: string;
  status: 'PAGATO';
  courseDescription: string;
  issuer: {
    name: string;
    brand: string;
    instructor: string;
    location: string;
    email: string;
    website: string;
  };
}

export interface PaymentFormData {
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  codiceFiscale: string;
  address: string;
  city: string;
  paymentMethod: PaymentMethodType;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

const INVOICES_STORAGE_KEY = 'patente_student_invoices';

export const generateInvoiceNumber = (): string => {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `PG-2026-${randomSuffix}`;
};

export const generateTransactionId = (method: PaymentMethodType): string => {
  const prefix = method.toUpperCase().slice(0, 4);
  const randomHex = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `TXN-${prefix}-${randomHex}`;
};

export const getPaymentMethodLabel = (method: PaymentMethodType): string => {
  switch (method) {
    case 'card':
      return 'Carta di Credito / Debito (Visa / Mastercard)';
    case 'postepay':
      return 'PostePay (Poste Italiane)';
    case 'paypal':
      return 'PayPal Express Checkout';
    case 'applepay':
      return 'Apple Pay / Google Pay';
    case 'bonifico':
      return 'Bonifico Bancario SEPA';
    default:
      return 'Pagamento Elettronico';
  }
};

export const createInvoiceRecord = (formData: PaymentFormData, amount: number = 49.0): InvoiceRecord => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    id: generateInvoiceNumber(),
    date: now.toISOString(),
    formattedDate,
    studentName: formData.studentName.trim() || 'Studente Patente B',
    studentEmail: formData.studentEmail.trim(),
    studentPhone: formData.studentPhone.trim() || '+39',
    codiceFiscale: formData.codiceFiscale.trim().toUpperCase() || 'NON SPECIFICATO',
    address: formData.address.trim() || 'Italia',
    city: formData.city.trim() || 'Bolzano',
    amount: typeof amount === 'number' && amount > 0 ? amount : 49.0,
    currency: 'EUR',
    taxExemptionNote:
      "Operazione didattico-formativa esente da IVA ai sensi dell'art. 10, comma 1, n. 20 del D.P.R. 633/1972.",
    paymentMethod: formData.paymentMethod,
    paymentMethodLabel: getPaymentMethodLabel(formData.paymentMethod),
    transactionId: generateTransactionId(formData.paymentMethod),
    status: 'PAGATO',
    courseDescription:
      "Corso Completo Ufficiale Patente B 2026 - Accesso a tutti i 240 Round Ufficiali, Quiz Ministeriali con spiegazioni in Bengali, Simulatore Orale e Assistenza Didattica valida fino al conseguimento della patente.",
    issuer: {
      name: 'PatenteGuru.it / Patente Bangla Italia',
      brand: 'PatenteGuru Autoscuola Digitale',
      instructor: 'Shifat Manjum (Founder & Lead Instructor)',
      location: 'Bolzano (BZ), Trentino-Alto Adige, Italia',
      email: 'khshifat@gmail.com',
      website: 'https://patenteguru.it',
    },
  };
};

export const saveInvoice = (invoice: InvoiceRecord): void => {
  try {
    const existing = getInvoices();
    const updated = [invoice, ...existing.filter((inv) => inv.id !== invoice.id)];
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save invoice locally:', err);
  }
};

export const getInvoices = (studentEmail?: string): InvoiceRecord[] => {
  try {
    const raw = localStorage.getItem(INVOICES_STORAGE_KEY);
    if (!raw) return [];
    const list: InvoiceRecord[] = JSON.parse(raw);
    if (studentEmail) {
      const clean = studentEmail.trim().toLowerCase();
      return list.filter((inv) => (inv?.studentEmail || '').toLowerCase() === clean);
    }
    return list;
  } catch {
    return [];
  }
};

export const getLatestInvoice = (studentEmail?: string): InvoiceRecord | null => {
  const list = getInvoices(studentEmail);
  return list.length > 0 ? list[0] : null;
};

