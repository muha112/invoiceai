#!/bin/bash
# ════════════════════════════════════════════
# InvoiceAI — Push to GitHub (run this once)
# ════════════════════════════════════════════

echo "📦 Setting up InvoiceAI on GitHub..."

# Initialize git
git init
git add .
git commit -m "🚀 Initial InvoiceAI launch — full stack"

# Create repo on GitHub and push
# Replace YOUR_USERNAME with your GitHub username
echo ""
echo "Now run these 2 commands:"
echo ""
echo "  1. Go to github.com → click '+' → New repository → name it 'invoiceai' → Create"
echo "  2. Run:"
echo ""
echo "     git remote add origin https://github.com/YOUR_USERNAME/invoiceai.git"
echo "     git push -u origin main"
echo ""
echo "Done! Then connect to Netlify + Render using the buttons in README.md"
