# 🌿 Hacktoberfest 2026: Touch Grass — DEV Submission Outline

## What I Built
**GrowWise** is an AI-powered, grounded garden planner designed to solve modern screen addiction by turning digital queries into tangible outdoor activities.

Built for the **Hacktoberfest 2026 Open-Source AI Challenge (Week 1: Touch Grass)**, GrowWise takes a user's location, sunlight exposure, growing space, garden type, and available time, then produces:
1. **Deterministic Plant Recommendations**: Strict boolean evaluations from verified agricultural extension facts, with transparent explanations of why every crop was recommended or excluded.
2. **Weekly Outdoor Gardening Plan**: Grounded tasks with supplies, duration, and safety guidance designed to get people outside with dirty fingernails.
3. **Outdoor Session & Touch-Grass Tracker**: In-browser session logger tracking real outdoor minutes spent gardening.
4. **Replaceable Open-Weight AI Architecture**: Supports Google's open-weight **Gemma 2 2B** via standard OpenAI-compatible endpoints or local Ollama, with an instant offline grounded fallback.

## Demo
- Live App URL: `[INSERT_RENDER_OR_DEMO_URL]`
- Video Walkthrough: `[INSERT_VIDEO_URL]`

## Code
- GitHub Repository: `[INSERT_GITHUB_REPO_URL]`
- License: Apache-2.0 / MIT

## How I Built It
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide icons.
- **Backend Architecture**: Decoupled design with both unified Express runtime and pure Python FastAPI backend (`backend/app`).
- **Data Grounding**: Curated local JSON knowledge base (`data/crops.json` & `data/gardening_sources.json`) cross-referenced against USDA Cooperative Extension, Royal Horticultural Society (RHS), Cornell, and UC Davis.
- **Model Architecture**: Provider-agnostic `BaseModelProvider` interface supporting open-weight **Gemma 2 2B / 9B** inference runtimes, keeping credentials secure on the server while guaranteeing deterministic fallbacks.
- **Testing**: 23 total unit tests across deterministic rules, profile validation, chemical safety filters, and mock provider fallbacks.

## Why Does Open Innovation Matter?
Open-weight models like **Gemma** democratize AI by allowing models to run on local edge devices, private servers, and constrained hardware without vendor lock-in or recurring API costs. By combining open-weight models with deterministic factual grounding, we prove that AI can be accurate, private, and lightweight without hallucinating agricultural facts.

## My Agent Session
- Built in Google AI Studio using development tooling and prompt engineering to architect the deterministic rules engine, TypeScript interfaces, and unit test suites.

## Prize Categories
- **Hacktoberfest 2026: Week 1 Touch Grass** (Primary)
- **Best Open-Weight Model Implementation (Gemma)**
