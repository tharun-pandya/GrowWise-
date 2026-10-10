# 🚀 GrowWise - Render Deployment Guide (React + FastAPI)

GrowWise uses **React + TypeScript + Vite** for the frontend and **FastAPI** for the backend.
**Streamlit has been completely removed.**

---

## Architecture Overview on Render

GrowWise deploys as two decoupled services defined in `render.yaml`:

1. **Frontend**: Render **Static Site** (`dist`) built with Vite.
2. **Backend**: Render **Web Service** (Python FastAPI) providing deterministic evaluations and open-weight AI routing.

```
                      ┌────────────────────────────────────────┐
                      │   Render Static Site: Frontend         │
                      │   (React + TypeScript + Vite)          │
                      │   Publish Directory: dist              │
                      └──────────────────┬─────────────────────┘
                                         │
                         Calls /api/* via│ VITE_API_BASE_URL
                                         ▼
                      ┌────────────────────────────────────────┐
                      │   Render Web Service: Backend          │
                      │   (Python FastAPI + uvicorn)           │
                      │   Port: $PORT | Health: /health        │
                      └──────────────────┬─────────────────────┘
                                         │
                           Optional REST │ (Ollama / vLLM / remote)
                                         ▼
                      ┌────────────────────────────────────────┐
                      │   Open-Weight Gemma 2 2B Inference     │
                      │   or Offline Grounded Synthesizer      │
                      └────────────────────────────────────────┘
```

---

## 1. Automatic Deployment via Blueprint (`render.yaml`)

1. Push your repository to GitHub.
2. In the Render Dashboard, click **New +** → **Blueprint**.
3. Select your GitHub repository containing `render.yaml`.
4. Render will automatically provision both services:
   - **`growwise-frontend`**: Static Site with build command `npm install && npm run build`, publish directory `dist`.
   - **`growwise-api`**: Python Web Service with start command `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`.

---

## 2. Manual Setup (Alternative)

### Service 1: React Frontend (Static Site)
- **Type**: Static Site
- **Name**: `growwise-frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_BASE_URL`: `https://your-growwise-api.onrender.com` (URL of your backend service)

### Service 2: Python Backend (Web Service)
- **Type**: Web Service
- **Name**: `growwise-api`
- **Runtime**: Python 3
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path**: `/health`
- **Environment Variables**:
  - `PYTHON_VERSION`: `3.10.12`
  - `AI_PROVIDER_TYPE`: `offline` (or `open_weight` when configured with a remote endpoint)
  - `CORS_ORIGINS`: `https://your-growwise-frontend.onrender.com`
  - `OPEN_WEIGHT_ENDPOINT_URL`: *(optional remote OpenAI-compatible endpoint e.g. Together AI, DeepInfra, vLLM)*
  - `OPEN_WEIGHT_MODEL_NAME`: `google/gemma-2-2b-it`
  - `OPEN_WEIGHT_API_KEY`: *(optional remote API key)*

---

## 3. Important Production Notes

1. **Free Tier RAM Budget**:
   Render's free tier provides 512 MB RAM. The backend defaults to `AI_PROVIDER_TYPE=offline`, which uses <80 MB RAM and synthesizes verified advice without downloading large neural weights.
2. **Open-Weight Gemma in Production**:
   Do not attempt to run a local Ollama daemon on Render. To use Gemma in production, configure `OPEN_WEIGHT_ENDPOINT_URL` to point to a remote OpenAI-compatible endpoint hosting `google/gemma-2-2b-it`.
3. **No Streamlit**:
   The frontend is 100% React, TypeScript, and Vite. There are no Python GUI dependencies.
