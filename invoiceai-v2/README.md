# 🧾 InvoiceAI

AI-powered invoice and proposal generator for freelancers.

**Live site:** https://YOUR_USERNAME.github.io/invoiceai

---

## 💰 How you earn
- Users pay $10/month
- 100 users = $1,000/month  
- 1,000 users = $10,000/month

## 🚀 Deploy (free, no credit card)
Read **SETUP_GITHUB.md** — takes 15 minutes.

| Service | What for | Cost |
|---------|---------|------|
| GitHub Pages | Frontend hosting | Free forever |
| Render | Backend hosting | Free |
| Google Gemini | AI generation | Free |
| Stripe | Global payments | Free (2.9% per sale) |
| Paystack | Africa payments | Free (1.5% per sale) |

## 📁 Structure
```
invoiceai/
├── frontend/        ← Your website (hosted on GitHub Pages)
│   ├── index.html   ← Main app
│   └── src/
│       ├── app.js   ← App logic
│       ├── api.js   ← Calls backend securely
│       └── ui.js    ← Document rendering
├── backend/         ← Secure server (hosted on Render)
│   └── src/
│       ├── index.js
│       └── routes/
│           ├── ai.js        ← Gemini AI
│           ├── payments.js  ← Stripe + Paystack
│           └── webhooks.js  ← Auto payment detection
└── SETUP_GITHUB.md  ← Start here
```
