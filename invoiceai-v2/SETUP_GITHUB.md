# 🚀 Go Live in 15 Minutes — No BS Guide

Your site will be at: **https://YOUR_USERNAME.github.io/invoiceai**
Free forever. No domain needed. No credit card. No Netlify.

---

## STEP 1 — Create GitHub account
1. Go to **github.com**
2. Click **Sign up**
3. Use your email, create a password, done

---

## STEP 2 — Create a new repo
1. Click the **"+"** button top right
2. Click **"New repository"**
3. Name: `invoiceai`
4. Set to **Public**
5. Click **"Create repository"** — don't tick anything else

---

## STEP 3 — Upload your files
On the new empty repo page you'll see **"uploading an existing file"** — click it.

1. Unzip the project zip file on your computer
2. Open the `invoiceai` folder
3. **Drag ALL the files and folders** into the GitHub upload box
4. Scroll down, click **"Commit changes"**

That's it — all your code is on GitHub.

---

## STEP 4 — Turn on GitHub Pages (your free website)
1. In your repo, click **"Settings"** (top tab)
2. Click **"Pages"** (left sidebar)
3. Under **"Source"** select **"GitHub Actions"**
4. Done — GitHub will now auto-deploy every time you upload changes

⏳ Wait 1-2 minutes, then your site is live at:
👉 **https://YOUR_USERNAME.github.io/invoiceai**

---

## STEP 5 — Deploy backend FREE on Render
Your frontend is live. Now the backend (AI + payments):

1. Go to **render.com** → Sign up with GitHub (free)
2. Click **"New +"** → **"Web Service"**
3. Connect your `invoiceai` GitHub repo
4. Set **Root Directory**: `backend`
5. Set **Start command**: `npm start`
6. Click **"Create Web Service"**
7. Copy your backend URL → looks like: `https://invoiceai-xxxx.onrender.com`

---

## STEP 6 — Connect frontend to backend
1. Open `frontend/index.html` in any text editor (Notepad works)
2. Find this line near the top:
   ```
   window.BACKEND_URL = 'https://invoiceai-backend.onrender.com';
   ```
3. Replace with your actual Render URL from Step 5
4. Save the file
5. Upload the updated file to GitHub again (same way as Step 3)
6. GitHub auto-updates your live site in ~60 seconds ✅

---

## STEP 7 — Add your free API keys to Render
In Render → Your service → **"Environment"** tab → Add these:

| Key | Where to get it | Cost |
|-----|----------------|------|
| `GEMINI_API_KEY` | aistudio.google.com → Get API Key | Free |
| `STRIPE_SECRET_KEY` | stripe.com → Developers → API Keys | Free account |
| `PAYSTACK_SECRET_KEY` | paystack.com → Settings → API | Free (best for Africa) |
| `FRONTEND_URL` | your GitHub Pages URL from Step 4 | — |
| `MONTHLY_PRICE_USD` | 10 | — |

---

## ✅ You're live!

Your website: `https://YOUR_USERNAME.github.io/invoiceai`
Share this link — anyone can sign up and pay you $10/month.

**To get first paying users:**
- Post in Facebook freelancer groups
- Share in WhatsApp business groups
- Post on Reddit r/freelance

Questions? Come back to Claude and ask anything.
