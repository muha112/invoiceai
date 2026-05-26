import { Router } from 'express';
import Stripe from 'stripe';
const router = Router();

// ── STRIPE WEBHOOK ────────────────────────────────────────
// Stripe calls this URL automatically when a payment succeeds/fails
// Set this URL in your Stripe dashboard → Webhooks
router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) return res.status(503).json({ error: 'Webhook not configured' });

  let event;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (e) {
    console.error('[Stripe webhook] signature failed:', e.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log(`✅ New subscriber: ${session.customer_email}`);
      // TODO: Save subscriber to your database, send welcome email
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      console.log(`❌ Subscription cancelled: ${sub.customer}`);
      // TODO: Revoke access in your database
      break;
    }
    case 'invoice.payment_failed': {
      console.log('⚠️ Payment failed — notify customer');
      // TODO: Send payment failure email
      break;
    }
    default:
      console.log(`[Stripe webhook] unhandled: ${event.type}`);
  }

  res.json({ received: true });
});

// ── PAYSTACK WEBHOOK ──────────────────────────────────────
// Paystack calls this URL automatically
// Set in your Paystack dashboard → Settings → API Keys & Webhooks
router.post('/paystack', async (req, res) => {
  // Verify it's really from Paystack
  const hash = req.headers['x-paystack-signature'];
  const crypto = await import('crypto');
  const expected = crypto.default
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '')
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== expected) {
    console.error('[Paystack webhook] invalid signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { event, data } = req.body;

  if (event === 'charge.success') {
    console.log(`✅ Paystack payment: ${data.customer?.email} — ${data.amount / 100} ${data.currency}`);
    // TODO: Grant user access, save to database
  }

  if (event === 'subscription.disable') {
    console.log(`❌ Paystack subscription cancelled: ${data.customer?.email}`);
    // TODO: Revoke access
  }

  res.sendStatus(200);
});

export default router;
