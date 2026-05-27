const BASE = 'https://invoiceai-t89l.onrender.com';

window.generateDocument = (payload) =>
  fetch(`${BASE}/api/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(r => r.json());

window.generateEmail = (payload) =>
  fetch(`${BASE}/api/ai/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(r => r.json());

window.startStripeCheckout = async (email) => {
  const data = await fetch(`${BASE}/api/payments/stripe/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }).then(r => r.json());
  if (data.url) window.location.href = data.url;
};

window.startPaystackCheckout = async (email, currency = 'USD') => {
  const data = await fetch(`${BASE}/api/payments/paystack/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, currency }),
  }).then(r => r.json());
  if (data.url) window.location.href = data.url;
};

window.checkBackend = async () => {
  try {
    const r = await fetch(`${BASE}/api/health`);
    return r.ok;
  } catch { return false; }
};
