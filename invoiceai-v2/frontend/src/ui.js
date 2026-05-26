// ─────────────────────────────────────────────────────────
// UI helpers — render invoice/proposal documents
// ─────────────────────────────────────────────────────────

export function renderDocument({ docType, fromName, fromEmail, fromPhone, toName, toEmail,
  projectTitle, currency, dueDate, items, aiText, total, tax, grandTotal }) {

  const docNum = 'INV-' + (Math.floor(Math.random() * 900) + 100);
  const today  = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
  const dueStr = dueDate
    ? new Date(dueDate).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })
    : 'Upon receipt';

  let bodyHtml = '';

  if (docType === 'invoice') {
    const rows = items?.length
      ? items.map(l => `
          <tr>
            <td>${esc(l.desc)}</td>
            <td style="text-align:center">${l.qty}</td>
            <td style="text-align:right">${currency}${Number(l.price).toFixed(2)}</td>
            <td style="text-align:right">${currency}${(l.qty * l.price).toFixed(2)}</td>
          </tr>`).join('')
      : `<tr><td colspan="4" style="text-align:center;color:#888;padding:1rem">No items added</td></tr>`;

    bodyHtml = `
      <p class="doc-desc">${esc(aiText)}</p>
      <table class="doc-table">
        <thead><tr><th>Description</th><th style="text-align:center">Qty</th><th style="text-align:right">Unit price</th><th style="text-align:right">Amount</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="doc-totals">
        <div class="totals-box">
          <div class="total-row"><span>Subtotal</span><span>${currency}${Number(total).toFixed(2)}</span></div>
          <div class="total-row"><span>Tax (10%)</span><span>${currency}${Number(tax).toFixed(2)}</span></div>
          <div class="total-row grand"><span>Total due</span><span>${currency}${Number(grandTotal).toFixed(2)}</span></div>
        </div>
      </div>`;
  } else {
    const formatted = esc(aiText).replace(/^- /gm, '• ').replace(/\n- /g, '\n• ');
    bodyHtml = `
      <p class="doc-desc" style="white-space:pre-wrap">${formatted}</p>
      <div class="doc-totals">
        <div class="totals-box">
          <div class="total-row grand"><span>Project budget</span><span>${currency}${grandTotal > 0 ? Number(grandTotal).toFixed(2) : 'TBD'}</span></div>
        </div>
      </div>`;
  }

  return `
    <div class="doc-wrap" id="printable_doc">
      <div class="doc-head">
        <div>
          <div class="doc-brand">${esc(fromName || 'Your Business')}</div>
          <div style="font-size:13px;color:#888;margin-top:4px">${esc(fromEmail || '')} ${fromPhone ? '· ' + esc(fromPhone) : ''}</div>
        </div>
        <div style="text-align:right">
          <div class="doc-type-badge">${docType === 'invoice' ? 'Invoice' : 'Proposal'}</div>
          ${docType === 'invoice' ? `<div style="font-size:13px;color:#888;margin-top:6px">${docNum}</div>` : ''}
          <div style="font-size:13px;color:#888">Date: ${today}</div>
        </div>
      </div>
      <div class="doc-meta">
        <div class="doc-meta-block"><label>Bill to</label><p>${esc(toName)}<br>${esc(toEmail || '')}</p></div>
        <div class="doc-meta-block"><label>${docType === 'invoice' ? 'Due date' : 'Deadline'}</label><p>${dueStr}</p></div>
      </div>
      <div class="doc-subject">${esc(projectTitle)}</div>
      ${bodyHtml}
    </div>`;
}

export function renderEmail(text, { toName, toEmail, fromName, projectTitle, docType }) {
  return `
    <div class="doc-wrap">
      <div style="margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid #e2e0d8">
        <div style="font-size:13px;color:#888;margin-bottom:4px">To: <strong style="color:#0e0e0e">${esc(toName)} ${toEmail ? '&lt;' + esc(toEmail) + '&gt;' : ''}</strong></div>
        <div style="font-size:13px;color:#888">Subject: <strong style="color:#0e0e0e">${docType === 'invoice' ? 'Invoice' : 'Proposal'} — ${esc(projectTitle)}</strong></div>
      </div>
      <p style="font-size:14px;line-height:1.8;white-space:pre-wrap;color:#0e0e0e">${esc(text)}</p>
      <p style="margin-top:1rem;font-size:14px;color:#444">Best regards,<br>${esc(fromName)}</p>
    </div>`;
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
