// ─────────────────────────────────────────────────────────
// API client — all calls go to your secure backend
// The backend holds your secret keys — never the browser
// ─────────────────────────────────────────────────────────
import { CONFIG } from './config.js';

const BASE = CONFIG.BACKEND_URL;

async function request(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ── AI ────────────────────────────────────────────────────
export const generateDocument = (payload) => request('/api/ai/generate', payload);
export const generateEmail    = (payload) => request('/api/ai/email', payload);

// ── Payments ──────────────────────────────────────────────
export async function startStripeCheckout(email) {
  const data = await request('/api/payments/stripe/checkout', { email });
  if (data.url) window.location.href = data.url;
}

export async function startPaystackCheckout(email, currency = 'USD') {
  const data = await request('/api/payments/paystack/checkout', { email, currency });
  if (data.url) window.location.href = data.url;
}

export async function verifyPaystack(reference) {
  const res = await fetch(`${BASE}/api/payments/paystack/verify/${reference}`);
  return res.json();
}

// ── Health ────────────────────────────────────────────────
export async function checkBackend() {
  try {
    const res = await fetch(`${BASE}/api/health`);
    return res.ok;
  } catch { return false; }
}
