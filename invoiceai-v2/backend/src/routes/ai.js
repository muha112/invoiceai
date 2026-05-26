import { Router } from 'express';
const router = Router();

const GEMINI = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const clean = (s, max = 500) =>
  typeof s === 'string' ? s.trim().slice(0, max).replace(/[<>"']/g, '') : '';

// POST /api/ai/generate
router.post('/generate', async (req, res) => {
  const { docType, fromName, toName, projectTitle, scopeText, items, extraNotes, currency = '$' } = req.body;

  if (!['invoice', 'proposal'].includes(docType))
    return res.status(400).json({ error: 'Invalid docType' });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(503).json({ error: 'AI not configured on server' });

  const itemList = Array.isArray(items)
    ? items.map(i => `${clean(i.desc)} x${i.qty} @ ${currency}${i.price}`).join(', ')
    : '';

  const prompt = docType === 'invoice'
    ? `You are a professional business writing AI. Write invoice body text.
From: ${clean(fromName)} | To: ${clean(toName)} | Project: ${clean(projectTitle)}
Items: ${itemList} | Notes: ${clean(extraNotes)}
Write: 1) Warm thank-you (1 sentence) 2) Work description (2-3 sentences) 3) Payment reminder (1 sentence).
Plain text only. No markdown. No bullet points.`
    : `You are a professional business writing AI. Write a compelling proposal.
From: ${clean(fromName)} | To: ${clean(toName)} | Project: ${clean(projectTitle)}
Scope: ${clean(scopeText, 800)} | Notes: ${clean(extraNotes)}
Write: 1) Executive summary (2-3 sentences) 2) Deliverables (3-4 lines starting with -) 3) Why us (2 sentences) 4) Next steps (1-2 sentences).
Plain text only. No markdown headers.`;

  try {
    const r = await fetch(`${GEMINI}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error?.message || 'Gemini error');
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty AI response');
    res.json({ text });
  } catch (e) {
    console.error('[AI generate]', e.message);
    res.status(502).json({ error: 'AI generation failed. Try again.' });
  }
});

// POST /api/ai/email
router.post('/email', async (req, res) => {
  const { docType, fromName, toName, projectTitle } = req.body;
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(503).json({ error: 'AI not configured' });

  const prompt = `Write a short professional email (under 80 words) sending a ${clean(docType)} to ${clean(toName)} from ${clean(fromName)} for project: ${clean(projectTitle)}. Friendly and professional. Plain text only.`;

  try {
    const r = await fetch(`${GEMINI}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const data = await r.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ text });
  } catch (e) {
    res.status(502).json({ error: 'Email generation failed' });
  }
});

export default router;
