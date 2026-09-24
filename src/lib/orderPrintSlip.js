/**
 * Order Print Slip & Tax Invoice Generator
 * Company Details:
 *   WEMAKE SWEETS AND SNACKS
 *   GROUND FLOOR, BLOCK NO. 159, PLOT NO. 51, SHAKTI INDUSTRIES,
 *   BHADA, Surat, 395006 Gujarat, India
 *   GSTIN: 24AADFW9354L1ZN
 *   Website: https://www.wemakesweets.com/
 */

export const COMPANY_DETAILS = {
  name: 'WEMAKE SWEETS AND SNACKS',
  addressLine1: 'GROUND FLOOR, BLOCK NO. 159, PLOT NO. 51, SHAKTI INDUSTRIES,',
  addressLine2: 'BHADA, Surat',
  cityStateZip: 'Surat, 395006 Gujarat, India',
  gstin: '24AADFW9354L1ZN',
  website: 'https://www.wemakesweets.com',
  tagline: 'We Serve Sweetness !!!',
  email: 'support@wemakesweets.com',
};

/**
 * Converts a numerical amount to Indian Rupee Words
 * @param {number} num 
 * @returns {string} e.g. "Eight Hundred Ninety Eight Rupees Only"
 */
export function numberToWords(num) {
  if (num === null || num === undefined || isNaN(num)) return '';
  num = Math.round(Number(num));
  if (num === 0) return 'Zero Rupees Only';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertLessThanOneThousand(n) {
    let str = '';
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += b[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += a[n] + ' ';
    }
    return str.trim();
  }

  let words = '';
  // Crores
  if (num >= 10000000) {
    words += convertLessThanOneThousand(Math.floor(num / 10000000)) + ' Crore ';
    num %= 10000000;
  }
  // Lakhs
  if (num >= 100000) {
    words += convertLessThanOneThousand(Math.floor(num / 100000)) + ' Lakh ';
    num %= 100000;
  }
  // Thousands
  if (num >= 1000) {
    words += convertLessThanOneThousand(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }
  // Remainder
  if (num > 0) {
    words += convertLessThanOneThousand(num);
  }

  return (words.trim() + ' Rupees Only').replace(/\s+/g, ' ');
}

/**
 * Format date for invoice display
 */
export function formatSlipDate(dateStr) {
  if (!dateStr) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

/**
 * Generates standalone HTML document for the Tax Invoice / Packing Slip
 */
export function generateOrderSlipHTML(order) {
  if (!order) return '';

  const orderId = order.orderId || order._id || 'N/A';
  const orderDate = formatSlipDate(order.createdAt);
  const items = order.items || [];
  const totalAmount = Number(order.totalAmount || 0);
  const wordsAmount = numberToWords(totalAmount);

  // Address
  const customerName = order.shippingAddress?.name || order.user?.name || 'Valued Customer';
  const customerPhone = order.shippingAddress?.phone || order.user?.phone || 'N/A';
  const customerEmail = order.shippingAddress?.email || order.user?.email || 'N/A';
  const addressLine = order.shippingAddress?.address || '';
  const city = order.shippingAddress?.city || '';
  const state = order.shippingAddress?.state || '';
  const pincode = order.shippingAddress?.pincode || '';
  const country = order.shippingAddress?.country || 'India';

  const fullAddress = [addressLine, city, state ? `${state} - ${pincode}` : pincode, country]
    .filter(Boolean)
    .join(', ') || 'Address on file';

  // Logistics & Payment
  const awbCode = order.shiprocket?.awbCode || 'Pending Assignment';
  const courierName = order.shiprocket?.courierName || 'Shiprocket Logistics';
  const logisticsStatus = order.shiprocket?.status || 'Active';
  const paymentMethod = (order.paymentMethod || 'ONLINE').toUpperCase();
  const paymentStatus = (order.paymentStatus || 'PAID').toUpperCase();
  const orderStatus = (order.orderStatus || 'CONFIRMED').toUpperCase();

  const logoUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/withoutBackground111.png`
    : '/withoutBackground111.png';

  const rowsHTML = items.map((item, index) => {
    const itemName = item.name || 'Sweets & Snacks Product';
    const sku = item.sku || '-';
    const qty = item.quantity || 1;
    const price = Number(item.price || 0);
    const total = Number(item.total || qty * price);

    return `
      <tr>
        <td style="text-align: center; color: #64748b; font-weight: 500;">${index + 1}</td>
        <td>
          <div style="font-weight: 600; color: #0f172a;">${itemName}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">SKU: <span style="font-family: monospace; color: #334155;">${sku}</span></div>
        </td>
        <td style="text-align: center; font-weight: 600; color: #0f172a;">${qty}</td>
        <td style="text-align: right; color: #334155;">₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        <td style="text-align: right; font-weight: 700; color: #0f172a;">₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - ${orderId}</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    @page {
      size: A4;
      margin: 10mm 12mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #ffffff;
      color: #1e293b;
      font-size: 12px;
      line-height: 1.45;
      padding: 15px 20px;
    }
    .invoice-wrapper {
      max-width: 800px;
      margin: 0 auto;
    }
    
    /* Header layout */
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
    }
    .header-table td {
      vertical-align: top;
    }
    .company-logo {
      max-height: 70px;
      max-width: 160px;
      object-fit: contain;
      display: block;
      margin-bottom: 4px;
    }
    .company-name {
      font-size: 16px;
      font-weight: 800;
      color: #881337;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .company-sub {
      font-size: 11px;
      color: #475569;
      line-height: 1.35;
    }
    .company-gst {
      margin-top: 4px;
      font-size: 11px;
      color: #1e293b;
    }
    .company-gst strong {
      color: #0f172a;
    }
    .company-website {
      color: #b91c1c;
      font-weight: 600;
      text-decoration: none;
    }
    
    /* Invoice meta right card */
    .invoice-meta-card {
      text-align: right;
    }
    .invoice-title {
      font-size: 20px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .order-id-badge {
      display: inline-block;
      font-family: monospace;
      font-size: 13px;
      font-weight: 700;
      background: #f1f5f9;
      color: #0f172a;
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
      margin-bottom: 6px;
    }
    .meta-line {
      font-size: 11.5px;
      color: #475569;
      margin-bottom: 2px;
    }
    .meta-line strong {
      color: #0f172a;
    }
    .badge {
      display: inline-block;
      padding: 2px 7px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      border-radius: 3px;
      letter-spacing: 0.3px;
    }
    .badge-paid {
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #86efac;
    }
    .badge-pending {
      background: #fef3c7;
      color: #b45309;
      border: 1px solid #fde68a;
    }
    .badge-confirmed {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
    }
    
    /* Divider */
    .brand-divider {
      height: 3px;
      background: linear-gradient(90deg, #881337 0%, #be123c 60%, #f59e0b 100%);
      margin: 10px 0 14px 0;
      border-radius: 2px;
    }
    
    /* 2 Columns Grid for Bill To and Shiprocket info */
    .grid-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .grid-table td {
      width: 50%;
      vertical-align: top;
    }
    .info-box {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      background: #fafafa;
      padding: 10px 12px;
      margin-right: 6px;
      min-height: 120px;
    }
    .grid-table td:last-child .info-box {
      margin-right: 0;
      margin-left: 6px;
    }
    .box-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #881337;
      border-bottom: 1px dashed #cbd5e1;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .info-row {
      font-size: 11.5px;
      color: #334155;
      margin-bottom: 3px;
      line-height: 1.35;
    }
    .info-row strong {
      color: #0f172a;
    }
    
    /* Products Table */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
    }
    .items-table th {
      background: #881337;
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 8px 10px;
      border: 1px solid #881337;
    }
    .items-table td {
      padding: 8px 10px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 11.5px;
      vertical-align: middle;
    }
    .items-table tr:nth-child(even) {
      background: #f8fafc;
    }
    
    /* Summary box */
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .summary-table td {
      vertical-align: top;
    }
    .words-box {
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      padding: 10px 12px;
      border-radius: 6px;
      margin-right: 12px;
    }
    .words-title {
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 3px;
    }
    .words-text {
      font-size: 12px;
      font-weight: 700;
      color: #0f172a;
      font-style: italic;
    }
    .guarantee-note {
      font-size: 10.5px;
      color: #64748b;
      margin-top: 8px;
      padding-top: 6px;
      border-top: 1px dashed #e2e8f0;
    }
    
    .calculation-box {
      border: 1px solid #cbd5e1;
      background: #ffffff;
      border-radius: 6px;
      overflow: hidden;
      margin-left: 12px;
    }
    .calc-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 12px;
      font-size: 11.5px;
      color: #475569;
      border-bottom: 1px solid #f1f5f9;
    }
    .calc-row.grand-total {
      background: #881337;
      color: #ffffff;
      font-weight: 800;
      font-size: 14px;
      padding: 8px 12px;
      border-bottom: none;
    }
    
    /* Footer & Signatory */
    .footer-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
    }
    .footer-table td {
      vertical-align: top;
    }
    .terms-box {
      font-size: 10px;
      color: #64748b;
      line-height: 1.4;
    }
    .terms-box strong {
      color: #334155;
    }
    .signature-box {
      text-align: right;
      font-size: 11px;
      color: #334155;
    }
    .signature-box strong {
      font-size: 12px;
      color: #881337;
    }
    .sign-space {
      height: 40px;
    }
    .thank-you-banner {
      text-align: center;
      font-size: 11.5px;
      font-weight: 700;
      color: #881337;
      background: #fff1f2;
      border: 1px dashed #fecdd3;
      border-radius: 4px;
      padding: 6px;
      margin-top: 14px;
      letter-spacing: 0.3px;
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">
    <!-- Header Table -->
    <table class="header-table">
      <tr>
        <td style="width: 60%;">
          <img src="${logoUrl}" class="company-logo" alt="WeMake Sweets & Snacks" />
          <div class="company-name">${COMPANY_DETAILS.name}</div>
          <div class="company-sub">${COMPANY_DETAILS.addressLine1}</div>
          <div class="company-sub">${COMPANY_DETAILS.addressLine2}, ${COMPANY_DETAILS.cityStateZip}</div>
          <div class="company-gst">
            <strong>GSTIN:</strong> ${COMPANY_DETAILS.gstin} &nbsp;|&nbsp; 
            <strong>Website:</strong> <a class="company-website" href="${COMPANY_DETAILS.website}" target="_blank">${COMPANY_DETAILS.website}</a>
          </div>
        </td>
        <td style="width: 40%;" class="invoice-meta-card">
          <div class="invoice-title">TAX INVOICE</div>
          <div class="order-id-badge">ORDER: ${orderId}</div>
          <div class="meta-line"><strong>Invoice Date:</strong> ${orderDate}</div>
          <div class="meta-line">
            <strong>Payment Mode:</strong> 
            <span style="font-weight: 700; color: ${paymentMethod === 'COD' ? '#b45309' : '#047857'};">
              ${paymentMethod}
            </span>
          </div>
          <div class="meta-line">
            <strong>Payment Status:</strong> 
            <span class="badge ${paymentStatus === 'PAID' ? 'badge-paid' : 'badge-pending'}">
              ${paymentStatus}
            </span>
          </div>
          <div class="meta-line" style="margin-top: 2px;">
            <strong>Order Status:</strong> 
            <span class="badge badge-confirmed">${orderStatus}</span>
          </div>
        </td>
      </tr>
    </table>

    <!-- Decorative Accent Line -->
    <div class="brand-divider"></div>

    <!-- 2 Column Details: Bill to & Logistics -->
    <table class="grid-table">
      <tr>
        <td>
          <div class="info-box">
            <div class="box-title">BILL TO / SHIP TO</div>
            <div class="info-row"><strong>${customerName}</strong></div>
            <div class="info-row" style="color: #475569;">${fullAddress}</div>
            <div class="info-row" style="margin-top: 6px;">
              <strong>Phone:</strong> ${customerPhone}
            </div>
            ${customerEmail && customerEmail !== 'N/A' ? `<div class="info-row"><strong>Email:</strong> ${customerEmail}</div>` : ''}
          </div>
        </td>
        <td>
          <div class="info-box">
            <div class="box-title">SHIPPING & LOGISTICS DETAILS</div>
            <div class="info-row">
              <strong>Courier Partner:</strong> ${courierName}
            </div>
            <div class="info-row">
              <strong>Shiprocket AWB:</strong> 
              <span style="font-family: monospace; font-weight: 700; color: #047857;">${awbCode}</span>
            </div>
            <div class="info-row">
              <strong>Logistics Status:</strong> ${logisticsStatus}
            </div>
            <div class="info-row">
              <strong>Platform:</strong> WeMake Sweets Official Store
            </div>
          </div>
        </td>
      </tr>
    </table>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 6%;">#</th>
          <th style="width: 54%; text-align: left;">Item Description</th>
          <th style="width: 10%; text-align: center;">Qty</th>
          <th style="width: 15%; text-align: right;">Rate (₹)</th>
          <th style="width: 15%; text-align: right;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHTML.length > 0 ? rowsHTML : `
          <tr>
            <td colspan="5" style="text-align: center; color: #94a3b8; padding: 15px;">No item details recorded</td>
          </tr>
        `}
      </tbody>
    </table>

    <!-- Summary Section -->
    <table class="summary-table">
      <tr>
        <td style="width: 55%;">
          <div class="words-box">
            <div class="words-title">Amount in Words</div>
            <div class="words-text">${wordsAmount || 'Rupees Zero Only'}</div>
            <div class="guarantee-note">
              ✓ 100% Vegetarian & Pure Ingredients<br/>
              ✓ Prepared & Packaged hygienically under strict quality standards
            </div>
          </div>
        </td>
        <td style="width: 45%;">
          <div class="calculation-box">
            <div class="calc-row">
              <span>Items Subtotal:</span>
              <span style="font-weight: 600; color: #0f172a;">₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="calc-row">
              <span>Shipping & Handling:</span>
              <span style="font-weight: 700; color: #15803d;">FREE</span>
            </div>
            <div class="calc-row">
              <span>Taxes (GST Included):</span>
              <span style="font-style: italic; color: #64748b;">Included</span>
            </div>
            <div class="calc-row grand-total">
              <span>Total Payable:</span>
              <span>₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </td>
      </tr>
    </table>

    <!-- Terms & Signature Footer -->
    <table class="footer-table">
      <tr>
        <td style="width: 60%;">
          <div class="terms-box">
            <strong>Terms & Conditions:</strong><br/>
            1. Goods once sold are non-returnable once opened due to perishable food safety regulations.<br/>
            2. For customer support or delivery tracking, visit <a href="${COMPANY_DETAILS.website}" style="color: #b91c1c; text-decoration: none;">${COMPANY_DETAILS.website}</a>.<br/>
            3. This is a computer-generated tax invoice and requires no physical signature.
          </div>
        </td>
        <td style="width: 40%;">
          <div class="signature-box">
            <div>For <strong>${COMPANY_DETAILS.name}</strong></div>
            <div class="sign-space"></div>
            <div style="font-weight: 700; color: #0f172a; border-top: 1px solid #cbd5e1; display: inline-block; padding-top: 4px; min-width: 140px;">
              Authorized Signatory
            </div>
          </div>
        </td>
      </tr>
    </table>

    <!-- Sweet Greeting Banner -->
    <div class="thank-you-banner">
      ♥ Thank You for Choosing WeMake Sweets & Snacks! We Serve Sweetness In Every Bite! ♥
    </div>
  </div>
</body>
</html>`;
}

/**
 * Triggers clean print dialog / Save to PDF using an isolated iframe
 */
export function printOrderSlip(order) {
  if (!order) return;
  const html = generateOrderSlipHTML(order);

  let iframe = document.getElementById('order-print-iframe');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'order-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.zIndex = '-9999';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);
  }

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      console.error('Print failed:', e);
      // Fallback
      window.print();
    }
  }, 400);
}

export default {
  COMPANY_DETAILS,
  numberToWords,
  formatSlipDate,
  generateOrderSlipHTML,
  printOrderSlip,
};
