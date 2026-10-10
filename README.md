# 🌱 GrowWise: Grounded AI-Powered Garden Planner

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest%202026-Week%201%3A%20Touch%20Grass-2ea44f.svg)](https://hacktoberfest.com)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript%20%2B%20Vite-61dafb.svg)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-Python%20FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![Core AI](https://img.shields.io/badge/Core%20AI-Gemma%202%202B-blueviolet.svg)](https://ai.google.dev/gemma)
[![Tests](https://img.shields.io/badge/Tests-23%20Passing-brightgreen.svg)]()

> A lightweight, transparent, and grounded garden planner built for the **Hacktoberfest 2026 Open-Source AI Challenge, Week 1: Touch Grass**.
> Built exclusively with **React + TypeScript + Vite** on the frontend and **Python FastAPI** on the backend. Designed for deployment on **Render**.

---

## 🌟 Key Features

1. **Modern React + TypeScript + Vite Frontend**:
   - Nature-inspired design system with responsive desktop and mobile layouts.
   - Interactive garden profile with 8 validated growing conditions.
   - 4-Week actionable outdoor task planner with session tracking and Markdown export.
   - Transparent disqualification logs: see exactly why a crop failed without black-box surprises.
2. **Deterministic Botanical Rules Engine**:
   - Sunlight, container depth, soil requirements, and USDA Hardiness Zones evaluated with strict boolean logic.
   - Sourced from 12 authoritative agricultural extension guides (USDA, Cornell, Penn State, UMN, UC Davis, Purdue, etc.).
3. **Open-Weight Gemma 2 2B Architecture**:
   - Primary AI: **Gemma 2 2B** running via Ollama or remote OpenAI-compatible inference endpoints with only **~1.6 GB RAM** footprint.
   - Fallback: Deterministic offline synthesizer requiring **0 MB RAM and zero API keys**.
4. **Outdoor Session & Touch-Grass Tracker**:
   - In-browser tracker logging minutes spent outside with plants.
   - Zero telemetry; all data saved in browser `localStorage`.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React.
- **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic.
- **AI Engine**: Replaceable `BaseModelProvider` supporting open-weight Gemma 2 2B / 9B.
- **Testing**: Python `unittest` suite (23 unit tests).
- **Deployment**: Render Static Site (Frontend) + Render Web Service (FastAPI Backend) via `render.yaml`.

---

## 🚀 Running Locally

### 1. Prerequisites
- Node.js (v18+)
- Python 3.10+
- (Optional for local open-weight AI) [Ollama](https://ollama.com)

### 2. Frontend & Local Server Setup
```bash
# Clone the repository
git clone https://github.com/your-username/growwise.git
cd growwise

# Install frontend dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. (Optional) Run Standalone FastAPI Backend
```bash
# Create and activate Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install backend dependencies
pip install -r backend/requirements.txt

# Start FastAPI server on port 8000
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🧪 Running the Unit Tests

GrowWise includes 23 unit tests verifying crop suitability rules, edge cases, input validation, and safety filters:

```bash
# Run all unit tests
python3 -m unittest backend/tests/test_backend.py tests/test_knowledge_base.py tests/test_rules.py tests/test_ai_engine.py -v
```

Output:
```
Ran 23 tests in 0.011s
OK
```

---

## 🚢 Deploying to Render

This project includes a complete `render.yaml` configuration:

1. Connect your repository to **Render** via Blueprint.
2. Render creates:
   - **Static Site** (`growwise-frontend`):
     - Build Command: `npm install && npm run build`
     - Publish Directory: `dist`
     - Env Var: `VITE_API_BASE_URL`
   - **Web Service** (`growwise-api`):
     - Build Command: `pip install -r backend/requirements.txt`
     - Start Command: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
     - Health Check Path: `/health`
