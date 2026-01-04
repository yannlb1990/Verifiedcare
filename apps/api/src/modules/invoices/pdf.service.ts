import { Injectable } from '@nestjs/common';

interface InvoicePdfData {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  provider: {
    businessName?: string;
    name?: string;
    abn?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  participant: {
    name?: string;
    ndisNumber?: string;
    email?: string;
    address?: string;
  };
  lineItems: Array<{
    lineNumber: number;
    description: string;
    serviceDate: Date;
    quantity: number;
    unit: string;
    unitRate: number;
    lineTotal: number;
    gstAmount: number;
  }>;
  subtotal: number;
  gstAmount: number;
  platformFee: number;
  totalAmount: number;
  notes?: string;
}

@Injectable()
export class PdfService {
  /**
   * Generate invoice PDF as base64 string
   * Note: Full PDF generation with pdfkit requires the package to be installed
   * This provides a simple HTML-based invoice that can be converted to PDF
   */
  async generateInvoicePdf(data: InvoicePdfData): Promise<string> {
    const html = this.generateInvoiceHtml(data);
    // For now, return HTML that can be printed to PDF
    // In production, use puppeteer or pdfkit for proper PDF generation
    return Buffer.from(html).toString('base64');
  }

  /**
   * Generate invoice as HTML (for email or browser printing)
   */
  generateInvoiceHtml(data: InvoicePdfData): string {
    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString('en-AU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
      }).format(amount);
    };

    const lineItemsHtml = data.lineItems
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${formatDate(item.serviceDate)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity} ${item.unit}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.unitRate)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.gstAmount)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">${formatCurrency(item.lineTotal + item.gstAmount)}</td>
      </tr>
    `,
      )
      .join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${data.invoiceNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      border-bottom: 3px solid #2D5A4A;
      padding-bottom: 20px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #2D5A4A;
    }
    .logo-sub {
      font-size: 14px;
      color: #6b7280;
      margin-top: 4px;
    }
    .invoice-title {
      text-align: right;
    }
    .invoice-title h1 {
      margin: 0;
      font-size: 32px;
      color: #2D5A4A;
    }
    .invoice-number {
      font-size: 16px;
      color: #6b7280;
      margin-top: 4px;
    }
    .parties {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .party {
      width: 45%;
    }
    .party-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
      margin-bottom: 8px;
    }
    .party-name {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }
    .party-details {
      font-size: 14px;
      color: #4b5563;
    }
    .dates {
      display: flex;
      gap: 40px;
      margin-bottom: 40px;
      padding: 16px 24px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .date-item label {
      font-size: 12px;
      text-transform: uppercase;
      color: #6b7280;
    }
    .date-item .value {
      font-size: 16px;
      font-weight: 500;
      color: #1f2937;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    thead {
      background: #2D5A4A;
      color: white;
    }
    thead th {
      padding: 12px;
      text-align: left;
      font-weight: 500;
      font-size: 14px;
    }
    thead th:last-child {
      text-align: right;
    }
    .totals {
      margin-left: auto;
      width: 300px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .totals-row.total {
      border-bottom: none;
      border-top: 2px solid #2D5A4A;
      padding-top: 12px;
      margin-top: 8px;
      font-size: 20px;
      font-weight: bold;
      color: #2D5A4A;
    }
    .notes {
      margin-top: 40px;
      padding: 20px;
      background: #fef3c7;
      border-radius: 8px;
      border-left: 4px solid #f59e0b;
    }
    .notes-title {
      font-weight: 600;
      margin-bottom: 8px;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
    .payment-info {
      margin-top: 40px;
      padding: 20px;
      background: #ecfdf5;
      border-radius: 8px;
    }
    .payment-title {
      font-weight: 600;
      color: #065f46;
      margin-bottom: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Verified Care</div>
      <div class="logo-sub">NDIS Provider Marketplace</div>
    </div>
    <div class="invoice-title">
      <h1>TAX INVOICE</h1>
      <div class="invoice-number">${data.invoiceNumber}</div>
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <div class="party-label">From</div>
      <div class="party-name">${data.provider.businessName || data.provider.name}</div>
      <div class="party-details">
        ${data.provider.abn ? `ABN: ${data.provider.abn}<br>` : ''}
        ${data.provider.email ? `${data.provider.email}<br>` : ''}
        ${data.provider.phone || ''}
      </div>
    </div>
    <div class="party">
      <div class="party-label">Bill To</div>
      <div class="party-name">${data.participant.name}</div>
      <div class="party-details">
        ${data.participant.ndisNumber ? `NDIS: ${data.participant.ndisNumber}<br>` : ''}
        ${data.participant.email || ''}
      </div>
    </div>
  </div>

  <div class="dates">
    <div class="date-item">
      <label>Invoice Date</label>
      <div class="value">${formatDate(data.invoiceDate)}</div>
    </div>
    <div class="date-item">
      <label>Due Date</label>
      <div class="value">${formatDate(data.dueDate)}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 35%">Description</th>
        <th style="width: 15%; text-align: center;">Date</th>
        <th style="width: 12%; text-align: center;">Qty</th>
        <th style="width: 12%; text-align: right;">Rate</th>
        <th style="width: 12%; text-align: right;">GST</th>
        <th style="width: 14%; text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${lineItemsHtml}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Subtotal</span>
      <span>${formatCurrency(data.subtotal)}</span>
    </div>
    <div class="totals-row">
      <span>GST (10%)</span>
      <span>${formatCurrency(data.gstAmount)}</span>
    </div>
    <div class="totals-row total">
      <span>Total Due</span>
      <span>${formatCurrency(data.totalAmount)}</span>
    </div>
  </div>

  ${
    data.notes
      ? `
  <div class="notes">
    <div class="notes-title">Notes</div>
    <div>${data.notes}</div>
  </div>
  `
      : ''
  }

  <div class="payment-info">
    <div class="payment-title">Payment Information</div>
    <p>Payment is due within 14 days of invoice date. Please quote invoice number <strong>${data.invoiceNumber}</strong> with your payment.</p>
    <p>For NDIS plan-managed participants, this invoice will be submitted to your plan manager.</p>
  </div>

  <div class="footer">
    <p>This is a tax invoice issued by ${data.provider.businessName || data.provider.name} through Verified Care.</p>
    <p>Verified Care - Connecting NDIS participants with verified providers</p>
  </div>
</body>
</html>
    `;
  }
}
