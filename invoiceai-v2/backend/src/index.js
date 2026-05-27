import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import aiRouter from './routes/ai.js';
import paymentsRouter from './routes/payments.js';
import webhooksRouter from './routes/webhooks.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;

// Security headers
app.use(helmet());

// CORS — only your frontend can call this backend
const allowed = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://muha112.github.io',
  'http://muha112.github.io',
];
app.use(cors({
  origin: '*',
  credentials: false,
}));
// Rate limiting
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, max: 120,
  message: { error: 'Too many requests — try again soon.' },
}));

const aiLimit = rateLimit({
  windowMs: 60_000, max: 15,
  message: { error: 'Slow down — max 15 AI calls per minute.' },
});

// Webhooks need raw body
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhooksRouter);

// JSON body
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/ai', aiLimit, aiRouter);
app.use('/api/payments', paymentsRouter);

// Health check
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', ts: new Date().toISOString() }));

// 404
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message,
  });
});

app.listen(PORT, () => console.log(`✅ InvoiceAI backend on :${PORT}`));
