import { Router } from 'express';
import Stripe from 'stripe';
const router = Router();

// ── STRIPE ────────────────────────────────────────────────
// POST /api/payments/stripe/checkout
// Creates a Stripe checkout session for $10/month subscription
router.post('/stripe/checkout', async (req, res) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return res.status(503).json({ error: 'Stripe not configured' });

  const stripe = new Stripe(secretKey);
  const { email, successUrl, cancelUrl } = req.body;

  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [{
        price: process.env.STRIPE_MONTHLY_PRICE_ID,
        quantity: 1,
      }],
      success_url: successUrl || `${process.env.FRONTEND_URL}/success?session={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/cancel`,
      metadata: { app: 'invoiceai' },
    });
    res.json({ url: session.url });
  } catch (e) {
    console.error('[Stripe checkout]', e.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// ── PAYSTACK ──────────────────────────────────────────────
// POST /api/payments/paystack/checkout
// Initializes a Paystack payment (great for Africa — ETB, NGN, KES, GHS)
router.post('/paystack/checkout', async (req, res) => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) return res.status(503).json({ error: 'Paystack not configured' });

  const { email, currency = 'USD', callbackUrl } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  // Paystack amount is in kobo/cents (multiply by 100)
  const amountInCents = Number(process.env.MONTHLY_PRICE_USD || 10) * 100;

  try {
    const r = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountInCents,
        currency,
        callback_url: callbackUrl || `${process.env.FRONTEND_URL}/success`,
        metadata: { app: 'invoiceai', plan: 'monthly' },
        plan: process.env.PAYSTACK_PLAN_CODE, // optional recurring plan
      }),
    });

    const data = await r.json();
    if (!data.status) throw new Error(data.message || 'Paystack error');
    res.json({ url: data.data.authorization_url, reference: data.data.reference });
  } catch (e) {
    console.error('[Paystack checkout]', e.message);
    res.status(500).json({ error: 'Failed to initialize Paystack payment' });
  }
});

// ── PAYSTACK VERIFY ───────────────────────────────────────
// GET /api/payments/paystack/verify/:reference
router.get('/paystack/verify/:reference', async (req, res) => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) return res.status(503).json({ error: 'Paystack not configured' });

  try {
    const r = await fetch(`https://api.paystack.co/transaction/verify/${req.params.reference}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    const data = await r.json();
    if (data.data?.status === 'success') {
      return res.json({ success: true, data: data.data });
    }
    res.json({ success: false, message: data.data?.gateway_response });
  } catch (e) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

export default router;
