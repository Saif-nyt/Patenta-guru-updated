import type { InvoiceRecord } from '../services/paymentService';

/**
 * Generates clean, production-grade, official Italian A4 Invoice HTML
 */
export const generateInvoiceHtml = (invoice: InvoiceRecord): string => {
  const issuer = invoice.issuer || {
    name: 'Patente Guru Italia',
    brand: 'Autoscuola Digitale Patente B',
    instructor: 'Marco Hossain & Patente Guru Team',
    location: 'Bolzano (BZ), Trentino-Alto Adige, Italia',
    email: 'info@patenteguru.it',
    website: 'https://patenteguru.it',
  };

  const studentName = invoice.studentName || 'Studente Patente B';
  const studentEmail = invoice.studentEmail || '';
  const studentPhone = invoice.studentPhone || '';
  const codiceFiscale = invoice.codiceFiscale || 'REGOLARE';
  const city = invoice.city || 'Bolzano, Italia';
  const paymentMethodLabel = invoice.paymentMethodLabel || 'Carta di Credito / Debito (Stripe Verified)';
  const amount = Number(invoice.amount || 49).toFixed(2);
  const formattedDate = invoice.formattedDate || new Date().toLocaleDateString('it-IT');
  const transactionId = invoice.transactionId || 'TXN-CONFIRMED';
  const invoiceId = invoice.id || `PG-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const taxExemption =
    invoice.taxExemptionNote ||
    "Operazione esente da IVA ai sensi dell'Art. 10, comma 1, n. 20 del D.P.R. 633/1972 (Prestazioni didattiche e di formazione).";

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ricevuta Fiscale ${invoiceId} - ${studentName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 13px;
      line-height: 1.5;
      padding: 16px 20px;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 18px;
      margin-bottom: 18px;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.5px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .brand-orange { color: #ea580c; }
    .brand-blue { color: #2563eb; }
    .badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 6px;
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      margin-left: 8px;
      vertical-align: middle;
    }
    .company-details {
      margin-top: 6px;
      font-size: 11px;
      color: #475569;
      line-height: 1.45;
    }
    .receipt-meta-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 18px;
      text-align: right;
      min-width: 220px;
    }
    .receipt-title {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #64748b;
    }
    .receipt-number {
      font-size: 16px;
      font-weight: 900;
      font-family: monospace;
      color: #1d4ed8;
      margin: 2px 0 6px 0;
    }
    .receipt-meta-line {
      font-size: 11px;
      color: #475569;
    }
    .student-card {
      background: #f0f7ff;
      border: 1px solid #c7dfff;
      border-radius: 12px;
      padding: 14px 18px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      gap: 20px;
    }
    .student-col { flex: 1; }
    .col-title {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #1e3a8a;
      margin-bottom: 4px;
    }
    .student-name {
      font-size: 14px;
      font-weight: 900;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .student-detail {
      font-size: 12px;
      color: #334155;
    }
    .cf-pill {
      display: inline-block;
      font-family: monospace;
      font-weight: 900;
      background: #ffffff;
      border: 1px solid #93c5fd;
      color: #0f172a;
      padding: 1px 7px;
      border-radius: 4px;
      font-size: 11px;
    }
    table.invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      margin-bottom: 16px;
    }
    table.invoice-table th {
      background: #f8fafc;
      border-bottom: 2px solid #cbd5e1;
      padding: 10px 12px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #475569;
      text-align: left;
    }
    table.invoice-table th.center { text-align: center; }
    table.invoice-table th.right { text-align: right; }
    table.invoice-table td {
      padding: 14px 12px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
      font-size: 12px;
    }
    table.invoice-table td.center { text-align: center; }
    table.invoice-table td.right { text-align: right; }
    .item-title {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .item-desc {
      font-size: 11px;
      color: #64748b;
      line-height: 1.4;
    }
    .totals-container {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
    }
    .totals-table {
      width: 270px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 16px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #475569;
      margin-bottom: 6px;
    }
    .totals-row.final {
      border-top: 1px solid #cbd5e1;
      padding-top: 8px;
      margin-top: 8px;
      font-size: 15px;
      font-weight: 900;
      color: #0f172a;
    }
    .totals-row.final .price {
      color: #059669;
    }
    .legal-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 10px;
      color: #64748b;
      line-height: 1.45;
      margin-bottom: 20px;
    }
    .legal-title {
      font-weight: 800;
      color: #334155;
      margin-bottom: 2px;
    }
    .footer-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #e2e8f0;
      padding-top: 14px;
    }
    .stamp-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .paid-square {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background: #ecfdf5;
      border: 2px solid #10b981;
      color: #059669;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 12px;
      letter-spacing: 0.5px;
    }
    .paid-text-title {
      font-size: 11px;
      font-weight: 900;
      color: #047857;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .paid-text-sub {
      font-size: 10px;
      color: #64748b;
    }
    .signed-by {
      text-align: right;
      font-size: 11px;
      color: #64748b;
    }
    .signed-title {
      font-weight: 800;
      color: #334155;
    }
  </style>
</head>
<body>
  <!-- Header Row -->
  <div class="header-row">
    <div>
      <div class="brand-title">
        Patente<span class="brand-orange">Guru</span><span class="brand-blue">.it</span>
        <span class="badge">Autoscuola Digitale</span>
      </div>
      <div class="company-details">
        <p><strong>${issuer.instructor}</strong></p>
        <p>${issuer.location}</p>
        <p>Email: ${issuer.email} • Web: ${issuer.website}</p>
      </div>
    </div>

    <div class="receipt-meta-box">
      <div class="receipt-title">Ricevuta di Pagamento</div>
      <div class="receipt-number">${invoiceId}</div>
      <div class="receipt-meta-line">Data: <strong>${formattedDate}</strong></div>
      <div class="receipt-meta-line">Transazione: <strong>${transactionId}</strong></div>
    </div>
  </div>

  <!-- Student Billing Details -->
  <div class="student-card">
    <div class="student-col">
      <div class="col-title">Dati Intestatario / Studente</div>
      <div class="student-name">${studentName}</div>
      <div class="student-detail">Email: <strong>${studentEmail}</strong></div>
      <div class="student-detail">Telefono: <strong>${studentPhone}</strong></div>
    </div>

    <div class="student-col" style="text-align: right;">
      <div class="col-title">Dati Fiscali & Residenza</div>
      <div class="student-detail" style="margin-bottom: 4px;">Codice Fiscale: <span class="cf-pill">${codiceFiscale}</span></div>
      <div class="student-detail">Città: <strong>${city}</strong></div>
      <div class="student-detail">Metodo: <strong>${paymentMethodLabel}</strong></div>
    </div>
  </div>

  <!-- Line Items Table -->
  <table class="invoice-table">
    <thead>
      <tr>
        <th style="width: 60%;">Descrizione Servizio / Corso</th>
        <th class="center" style="width: 10%;">Qtà</th>
        <th class="right" style="width: 15%;">Prezzo</th>
        <th class="right" style="width: 15%;">Totale</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div class="item-title">Corso Completo Patente B 2026 (Accesso Fino al Conseguimento)</div>
          <div class="item-desc">
            • Tutti i 240 Round Ufficiali (7.200+ Quiz Ministeriali con traduzione in Bengali)<br>
            • Simulatore Esame Orale con audio a voce naturale italiana<br>
            • 25 Capitoli di Teoria & Banca Parole Trabocchetto<br>
            • Assistenza Didattica e Ripasso Errori Illimitato
          </div>
        </td>
        <td class="center"><strong>1</strong></td>
        <td class="right">€${amount}</td>
        <td class="right"><strong>€${amount}</strong></td>
      </tr>
    </tbody>
  </table>

  <!-- Totals Box -->
  <div class="totals-container">
    <div class="totals-table">
      <div class="totals-row">
        <span>Imponibile:</span>
        <span>€${amount}</span>
      </div>
      <div class="totals-row">
        <span>IVA (Esente art. 10 DPR 633/72):</span>
        <span>€0,00</span>
      </div>
      <div class="totals-row final">
        <span>Totale Pagato:</span>
        <span class="price">€${amount}</span>
      </div>
    </div>
  </div>

  <!-- Legal Exemption Notice -->
  <div class="legal-box">
    <div class="legal-title">Nota Fiscale & Garanzia:</div>
    <p>${taxExemption}</p>
    <p style="margin-top: 4px;">Ricevuta valida ai fini della detrazione e registrazione contabile per corsi di preparazione ed istruzione teorica.</p>
  </div>

  <!-- Footer Stamps -->
  <div class="footer-row">
    <div class="stamp-badge">
      <div class="paid-square">PAID</div>
      <div>
        <div class="paid-text-title">Pagamento Confermato</div>
        <div class="paid-text-sub">Transazione: ${transactionId}</div>
      </div>
    </div>

    <div class="signed-by">
      <p class="signed-title">PatenteGuru.it / Zentixx Team</p>
      <p>Bolzano (BZ), Italia</p>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Triggers official print or PDF export using a clean, isolated iframe
 * Solves modal clipping, backdrop-blur, and blank Windows print preview issues 100%
 */
export const printInvoiceDocument = (invoice: InvoiceRecord): void => {
  if (typeof window === 'undefined') return;

  try {
    // Remove previous iframe if present
    const existing = document.getElementById('patente-invoice-print-frame');
    if (existing) {
      existing.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'patente-invoice-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc || !iframe.contentWindow) {
      window.print();
      return;
    }

    const html = generateInvoiceHtml(invoice);
    doc.open();
    doc.write(html);
    doc.close();

    // Give browser 200ms to render layout and CSS before opening print dialog
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.warn('Iframe print notice, fallback to window.print():', err);
        window.print();
      }

      // Clean up iframe after print dialog completes
      setTimeout(() => {
        try {
          iframe.remove();
        } catch {}
      }, 3000);
    }, 200);
  } catch (err) {
    console.error('Invoice print error:', err);
    window.print();
  }
};

/**
 * Direct file download fallback for offline archival
 */
export const downloadInvoiceHtmlFile = (invoice: InvoiceRecord): void => {
  if (typeof window === 'undefined') return;
  const html = generateInvoiceHtml(invoice);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ricevuta_${invoice.id || 'PG-2026'}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
