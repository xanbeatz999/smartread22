# SmartRead — Deployment Guide

## What you have
A complete Next.js 14 app with:
- Landing page with PDF drag & drop
- AI analysis (summary, insights, action items) via Gemini 1.5 Flash (FREE)
- Live Q&A chat with your document
- Export to Markdown

---

## Step 1 — Get your FREE Gemini API Key
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the key

Free tier gives you: 15 requests/min, 1500 requests/day — plenty for a demo.

---

## Step 2 — Deploy to Vercel (5 minutes)

### Option A — GitHub (Easiest)
1. Go to https://github.com → Create account → New Repository → name it `smartread`
2. Upload ALL the files from this zip (keep the folder structure exactly as-is)
3. Go to https://vercel.com → Sign up with GitHub → **Add New Project**
4. Import your `smartread` repo → click **Deploy**
5. After deploy → **Settings → Environment Variables** → Add:
   - Name: `GEMINI_API_KEY`
   - Value: your key from Step 1
6. Go to **Deployments → Redeploy** (top right ⋯ menu)

Done! Your site is live.

---

## File Structure (keep this exactly)
```
smartread/
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── .env.example          ← rename to .env.local for local testing
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx           ← Landing / upload page
│   ├── analyze/
│   │   └── page.tsx       ← Results + Chat page
│   └── api/
│       ├── analyze/
│       │   └── route.ts   ← PDF analysis (calls Gemini)
│       └── chat/
│           └── route.ts   ← Q&A chat (calls Gemini)
└── components/
    ├── ParticleBackground.tsx
    ├── UploadZone.tsx
    └── LoadingSkeleton.tsx
```

---

## Troubleshooting
- **"Analysis failed"** → Check GEMINI_API_KEY is set in Vercel env vars and redeployed
- **"Cannot extract text"** → PDF is image-based/scanned; use a text-selectable PDF
- **Build fails on Vercel** → Make sure ALL files are uploaded to GitHub, especially next.config.js
