// ─────────────────────────────────────────────────────────
// Config — update BACKEND_URL after you deploy to Render
// ─────────────────────────────────────────────────────────
export const CONFIG = {
  // After deploying backend to Render, replace this with your Render URL
  // Example: https://invoiceai-backend.onrender.com
  BACKEND_URL: window.BACKEND_URL || 'https://invoiceai-backend.onrender.com',
  APP_NAME: 'InvoiceAI',
  MONTHLY_PRICE: 10,
};
