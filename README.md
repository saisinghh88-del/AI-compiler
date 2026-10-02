# SETO — AI-Powered Code Compiler & Learning Workspace

[![Build & Deploy](https://github.com/saisinghh88-del/AI-compiler/actions/workflows/deploy.yml/badge.svg)](https://github.com/saisinghh88-del/AI-compiler/actions/workflows/deploy.yml)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A modern, luxury 3-column browser-based IDE and intelligent learning platform. Run Python, C, C++, Java, JavaScript, TypeScript, Go, Rust, and more with zero local toolchain setup, backed by live compilation and an interactive Socratic AI Mentor.

---

## ✨ Features

- **Luxury SETO Interface**: Clean 3-column responsive layout with ambient pastel gradient backdrop, rounded workstation cards, and distraction-free editing.
- **Multi-Language Live Compiler**: Full execution support for 11+ languages (Python 3, C, C++, Java, JavaScript, TypeScript, Go, Rust, PHP, Ruby, Bash) via Judge0 CE API with automatic fallback runners.
- **Interactive Terminal Console**: Real-time streaming standard output, error diagnostics, memory usage, and execution timing metrics.
- **Socratic AI Mentor**: Context-aware coding assistant that guides students through syntax errors and logical bugs without simply giving away the direct answers.
- **Smart Mistake Vault**: Automatically logs and categorizes recurring programming pitfalls, tracking your learning progress and mastery score over time.
- **Persistent Authentication**: Seamless Sign In / Registration with persistent `localStorage` session handling so the gatekeeper screen is never shown again once logged in.
- **Production-Ready**: Highly optimized chunk splitting, sub-600ms cold builds, and SPA rewrite configurations for Vercel, Netlify, and GitHub Pages.

---

## 🚀 Live Deployment Options

### Option 1: Deploy to Vercel (Recommended)

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your `AI-compiler` repository.
4. Framework preset will automatically be detected as **Vite**.
5. Add the following Environment Variables in Vercel project settings:
   - `VITE_JUDGE0_URL`: `https://ce.judge0.com`
   - *(Optional)* `VITE_GEMINI_API_KEY`: Your Google Gemini API Key
   - *(Optional)* `VITE_SUPABASE_URL`: Your Supabase Project URL
   - *(Optional)* `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
6. Click **Deploy**. Vercel uses `vercel.json` for SPA rewrites and asset caching automatically.

---

### Option 2: Deploy to Netlify

1. Go to [Netlify](https://app.netlify.com/) and click **Add new site > Import an existing project**.
2. Select your `AI-compiler` GitHub repository.
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Add environment variables under **Site configuration > Environment variables**.
5. Netlify uses `public/_redirects` to handle client-side routing. Click **Deploy site**.

---

### Option 3: GitHub Pages (Automated via GitHub Actions)

This repository includes a pre-configured workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. In your GitHub repository, navigate to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Every push to the `main` branch will automatically compile, optimize, and deploy your site to `https://<username>.github.io/<repo-name>/`.

---

## 💻 Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- `npm` or `pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/saisinghh88-del/AI-compiler.git

# Navigate into project directory
cd AI-compiler

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the root directory (you can copy `.env.example`):

```bash
cp .env.example .env
```

Configure your environment variables:

```env
# Live Compiler Backend (Judge0 CE default is free & CORS-enabled)
VITE_JUDGE0_URL=https://ce.judge0.com
VITE_JUDGE0_API_KEY=

# Optional: AI Mentor & Cloud Sync
VITE_GEMINI_API_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

This compiles TypeScript, generates code-split bundles in `dist/`, and validates bundle size:

- `vendor-react`: Isolated React 19 core chunk
- `vendor-monaco`: Monaco Editor chunk
- `vendor-supabase`: Supabase Client chunk
- `vendor-ui`: Lucide icons & animations chunk
- `index.js`: Minimal application logic chunk

To preview the production build locally:

```bash
npm run preview
```

---

## 🐍 Flask Backend & Unified Deployment

You can serve the compiled Vite frontend directly through the Python Flask backend with full client-side SPA routing fallback:

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Build Frontend & Run Flask
```bash
npm run build
python app.py
```
The application will be live at `http://localhost:5000` with:
- Static assets and client-side routes served from `dist/`
- Health check API at `http://localhost:5000/api/health`
- Metadata API at `http://localhost:5000/api/info`

### 3. Deploy to Cloud (Render / Railway / Heroku / VPS)
- **Render**: Connect repository. The included [`render.yaml`](render.yaml) automatically builds both the Vite frontend and Python backend, running `gunicorn app:app`.
- **Railway / Heroku**: Uses the included [`Procfile`](Procfile) (`web: gunicorn app:app`).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript 6
- **Build System**: Vite 8 with Rollup chunk optimization
- **Code Editor**: `@monaco-editor/react`
- **Compiler**: Judge0 CE REST API
- **Icons**: Lucide React
- **Styles**: Custom CSS Design System (SETO Luxury Theme)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
