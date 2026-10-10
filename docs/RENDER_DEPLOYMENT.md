# 🚀 GrowWise - Render Deployment Guide

GrowWise is designed for straightforward deployment on [Render](https://render.com).

Because Render's free tier provides 512 MB RAM, **do not attempt to run local 10GB LLMs directly on the free tier container**. Instead, GrowWise supports two production modes:

1. **Deterministic Offline Mode (Default, Recommended for Free Tier)**:
   - Zero LLM memory overhead.
   - Generates 100% verified agricultural guidance synthesized from `data/crops.json` and `data/gardening_sources.json`.
   - Starts instantly and uses <100 MB RAM.

2. **Open-Weight Inference Mode (Gemma 2 2B / 9B via Remote Endpoint)**:
   - Configure a remote OpenAI-compatible inference endpoint serving `google/gemma-2-2b-it` (e.g., Together AI, DeepInfra, Hugging Face Dedicated Endpoint, or your private vLLM instance).
   - Your API key and endpoint URL remain secure on the server.

---

## Option A: Full-Stack Web App (Recommended - 1 Click)

Deploy the unified Vite + Node/Express app that serves the frontend, static assets, and API routes.

- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Health Check Path**: `/api/health`

### Environment Variables:
| Variable | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production bundle serving |
| `PORT` | `10000` | Port automatically assigned by Render |
| `AI_PROVIDER_TYPE` | `offline` (or `open_weight`) | Model provider selection |
| `OPEN_WEIGHT_ENDPOINT_URL` | *(optional)* | e.g. `https://api.together.xyz/v1/chat/completions` |
| `OPEN_WEIGHT_MODEL_NAME` | *(optional)* | `google/gemma-2-2b-it` |
| `OPEN_WEIGHT_API_KEY` | *(optional)* | API key for the remote open-weight inference provider |

---

## Option B: Decoupled Python FastAPI Backend

If you prefer deploying a dedicated Python service:

- **Environment**: `Python`
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path**: `/health`

### Environment Variables:
| Variable | Value | Description |
| :--- | :--- | :--- |
| `PYTHON_VERSION` | `3.10.12` | Python runtime version |
| `CORS_ORIGINS` | `https://your-frontend.onrender.com` | Allowed frontend domains |
| `AI_PROVIDER_TYPE` | `offline` | Default safe offline mode |

---

## 🔒 Security and Privacy Guarantees

- **No GPS tracking**: Users provide friendly location strings (e.g. "Denver, CO" or "USDA Zone 7"), never device GPS coordinates.
- **No Personal Identifiable Info (PII)**: User sessions, outdoor time logs, and task checklists are stored exclusively in the browser's `localStorage`.
- **Zero API Keys in Client Code**: All inference keys remain strictly on the backend server.
