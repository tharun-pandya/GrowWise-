# 🚀 GrowWise - Single-Service Render Deployment Guide

GrowWise is configured to run as **one single Render Web Service under one public URL**.

The Python FastAPI backend directly serves the compiled **React + TypeScript + Vite** frontend from the repository root `dist/` directory, while simultaneously handling all REST API endpoints under the exact same domain.

---

## 🌟 Architecture Overview

```
                      Single Public Domain (e.g. https://growwise.onrender.com)
                                                 │
                                                 ▼
                                     FastAPI Application (Port $PORT)
                                                 │
              ┌──────────────────────────────────┴──────────────────────────────────┐
              ▼                                                                     ▼
     Frontend Static SPA                                                     REST API Routes
     • GET /                  -> dist/index.html                            • GET  /health & /api/health
     • GET /assets/*          -> dist/assets/* (CSS/JS)                     • GET  /crops & /api/crops
     • GET /favicon.svg       -> dist/favicon.svg                           • GET  /sources & /api/sources
     • GET /{client_route}    -> dist/index.html (SPA Fallback)             • POST /recommendations
                                                                            • POST /plan/generate
                                                                            • POST /ai/explain
                                                                            • POST /api/run-tests
                                                                            • GET  /api/python-files
```

### Key Advantages:
1. **One Single Public URL**: Users access your app at `https://growwise.onrender.com/`. No CORS issues, no separate frontend static site, and no mismatched domains.
2. **Deterministic Plant Rules**: Instant boolean checks for root depth, container size, and sunlight thresholds.
3. **Open-Weight Gemma 2 Support**: Offline grounded fallback mode with zero RAM overhead on Render's free tier.
4. **Automated Build**: A single build step compiles Vite and installs Python packages.

---

## 🛠️ Method 1: Deploy with Render Blueprint (`render.yaml`) (Recommended)

1. In the [Render Dashboard](https://dashboard.render.com), click **New +** → **Blueprint**.
2. Connect your GitHub repository (`tharun-pandya/GrowWise-`).
3. Render reads `render.yaml` and sets up the single Web Service automatically:
   - **Service Name**: `growwise`
   - **Environment**: `Python 3`
   - **Root Directory**: `.`
   - **Build Command**: `./build.sh`
   - **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
   - **Health Check**: `/health`
4. Click **Apply**.

---

## 📋 Method 2: Manual Web Service Setup in Render Dashboard

If setting up manually without the Blueprint:

1. Click **New +** → **Web Service** in Render.
2. Connect your GitHub repository.
3. Configure the following fields:

| Field | Value | Notes |
|---|---|---|
| **Name** | `growwise` | Your preferred service name |
| **Language / Runtime** | `Python 3` | Render's Python environment includes Node.js & npm |
| **Root Directory** | `.` | Leave blank or enter a single dot (`.`) |
| **Build Command** | `./build.sh` | Or: `npm install && npm run build && pip install -r backend/requirements.txt` |
| **Start Command** | `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT` | Starts FastAPI |
| **Health Check Path** | `/health` | Automatically verifies service readiness |
| **Instance Type** | Free | Uses < 120 MB RAM |

### Environment Variables:
Add these in the **Environment** tab:
- `PYTHON_VERSION`: `3.10.12`
- `AI_PROVIDER_TYPE`: `offline` (Instant zero-RAM offline synthesizer; or set to `open_weight` if providing an API key)
- `CORS_ORIGINS`: `*`

---

## 🔍 Verification Checklist

After the Render deploy completes:
1. Open your Render URL (e.g. `https://growwise.onrender.com/`):
   - You should see the **GrowWise React application** with its garden planning interface.
   - You should **NOT** see a JSON response or `{"detail":"Not Found"}`.
2. Check the Health endpoint:
   - Visiting `https://growwise.onrender.com/health` returns `{"status":"healthy","service":"GrowWise Unified Single-Service (FastAPI + React)"}`.
3. Check the Interactive Tests:
   - In the GrowWise UI, go to the **Testing & Deployment Hub** and click **Run All 23 Unit Tests**.
   - All 23 unit tests execute on the backend and report 100% success.
