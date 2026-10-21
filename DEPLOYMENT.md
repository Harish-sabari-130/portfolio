# 🚀 Harish Sabari P V – Production Deployment Guide (Vercel)

This guide walks you through deploying your 3D Cyber Portfolio with **Saha AI (Google Gemini LLM)** to **Vercel** with zero-configuration serverless backend support and full API key protection.

---

## 🏗️ Architecture Overview

```
[ Visitor Browser ]
        │
        ├── Static WebGL 3D Bundle (HTML, JS, CSS, Textures, Assets)
        │
        └── /api/* Serverless Proxy (Vercel Edge Functions)
                 ├── /api/chat     ──> Google Gemini 3.5 Flash / 2.5 Flash
                 └── /api/contact  ──> Contact Form Transmission & Alerts
```

- **Security:** `GEMINI_API_KEY` is loaded purely in serverless memory. It is **never bundled** into the client JavaScript.
- **Zero Cost:** 100% free on Vercel Hobby tier and Google AI Studio Developer tier.
- **Global CDN:** Instant load times with automatic SSL HTTPS certificate and HTTP/2.

---

## 📋 Pre-Deployment Checklist

- [x] Production build tested and verified (`✓ built in 52s`).
- [x] Secrets protected: `.env` added to `.gitignore`.
- [x] Serverless routes configured in `api/chat.ts` and `api/contact.ts`.
- [x] `vercel.json` configured with SPA routing and serverless rewrites.
- [x] Google Gemini API Key ready.

---

## ⚡ Step-by-Step Deployment Instructions

### Step 1: Commit and Push to GitHub

In your project terminal, stage all changes and push to your GitHub repository:

```bash
# 1. Check status (verify .env is ignored)
git status

# 2. Stage all project files
git add .

# 3. Commit changes
git commit -m "feat: complete Harish Sabari 3D cyber portfolio with Saha AI integration"

# 4. Push to GitHub (main branch)
git push origin main
```

*(If you haven't linked a remote GitHub repo yet)*:
```bash
git remote add origin https://github.com/Harish-sabari-130/<your-repo-name>.git
git branch -M main
git push -u origin main
```

---

### Step 2: Import into Vercel

1. Log in to [Vercel](https://vercel.com/) (sign in with GitHub).
2. Click **"Add New..."** → **"Project"**.
3. Select your repository: `Harish-AI-Nexus` and click **"Import"**.

---

### Step 3: Configure Project Settings

On the Vercel project configuration screen:

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | `Vite` (or `Other`) |
| **Root Directory** | `./` |
| **Build Command** | `pnpm --filter @workspace/harish-portfolio run build` |
| **Output Directory** | `artifacts/harish-portfolio/dist/public` |
| **Install Command** | `pnpm install` |

> [!TIP]
> **Alternative (Single-Folder Deployment):**  
> If you prefer deploying only the frontend folder, set **Root Directory** to `artifacts/harish-portfolio`.  
> - Build Command: `npm run build`  
> - Output Directory: `dist/public`  
> Both configurations are pre-configured with their respective `vercel.json` files!

---

### Step 4: Add Environment Variables

In the **Environment Variables** section on Vercel, add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `AIzaSy...` | Your Google Gemini API Key (Required for Saha AI) |
| `EMAIL_USER` | `harish23alr@gmail.com` | *(Optional)* For contact form email alerts |
| `EMAIL_PASS` | `your_gmail_app_password` | *(Optional)* Gmail 16-character App Password |

---

### Step 5: Deploy & Launch!

1. Click **"Deploy"**.
2. Vercel will build the WebGL bundle and deploy the serverless functions in ~45 seconds.
3. You will receive a live production URL:  
   `https://harish-sabari-portfolio.vercel.app` (or custom domain).

---

## 🔍 Post-Deployment Verification

1. **3D WebGL Graphics:** Verify the celestial orbit and geometric core render at 60 FPS.
2. **Saha AI Assistant:** Click the **Saha AI** avatar capsule in the top-right header and ask:
   - *"Tell me about Harish's Multi-Agent RAG DEA project"*
   - Verify dynamic response loads in ~1 second.
3. **Contact Transmission:** Go to Section 07 (Contact) or click `Contact Me`, send a test message, and check for the success toast.
4. **Mobile Responsiveness:** Open the link on your mobile phone to verify responsive navigation.
