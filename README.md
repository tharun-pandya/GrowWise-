# 🌱 GrowWise: Grounded AI-Powered Garden Planner

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest%202026-Week%201%3A%20Touch%20Grass-2ea44f.svg)](https://hacktoberfest.com)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://python.org)
[![Streamlit](https://img.shields.io/badge/UI-Streamlit-red.svg)](https://streamlit.io)
[![Core AI](https://img.shields.io/badge/Core%20AI-Gemma%202%202B-blueviolet.svg)](https://ai.google.dev/gemma)
[![Tests](https://img.shields.io/badge/Tests-15%20Passing-brightgreen.svg)]()

> A lightweight, transparent, and grounded garden planner built for the **Hacktoberfest 2026 Open-Source AI Challenge, Week 1: Touch Grass**.
> Designed specifically to run on lightweight hardware (**≤ 8 GB RAM**) with open-weights AI.

---

## 🌟 Key Features

1. **Deterministic Botanical Rules Engine**:
   - Sunlight, container depth, soil requirements, and USDA Hardiness Zones evaluated with strict boolean logic.
   - Transparent disqualification logging: see exactly why a crop failed without black-box surprises.
2. **Small, Verified Knowledge Base**:
   - 12+ core crops verified using USDA Cooperative Extension and Royal Horticultural Society (RHS) guides.
   - Zero hallucinated botanical requirements.
3. **Core AI via Open-Weight Gemma (or Gemini / Offline Fallback)**:
   - Primary: **Gemma 2 2B** running locally via Ollama with only **~1.6 GB RAM** footprint.
   - Fallback: Deterministic offline synthesizer requiring **0 MB RAM and no API keys**.
   - Optional: Google Gemini 2.5 Flash cloud API.
4. **4-Week Actionable Gardening Checklist**:
   - Generates grounded weekly maintenance tasks (thinning, watering, trellising, pest monitoring).
   - Exportable to Markdown with a single click.
5. **Companion Planting Synergies & Spatial Separation**:
   - Automatically detects beneficial neighbors (e.g., Basil + Cherry Tomato) and antagonistic pairings (e.g., Peppermint in ground).

---

## 💻 RAM Budget Analysis (Why Gemma 2 2B on ≤ 8 GB RAM)

| Component | RAM Consumption | Headroom Remaining on 8 GB RAM |
| :--- | :--- | :--- |
| **Windows 10/11 Base OS** | ~3.2 – 3.8 GB | ~4.2 GB available |
| **Streamlit + Python runtime** | ~150 – 250 MB | ~4.0 GB available |
| **Ollama daemon** | ~100 MB | ~3.9 GB available |
| **Gemma 2 2B (Q4_K_M)** | **~1.6 – 1.8 GB** | **~2.1 – 2.3 GB safety buffer** |
| **Total System Load** | **~5.5 – 5.9 GB** | ✅ **Completely smooth, no paging!** |

*Note: Models larger than 7B require 6–9 GB RAM on their own, which causes heavy disk swapping or freezes on an 8 GB machine. Gemma 2 2B is the optimal open-weight model for local consumer PCs.*

---

## 🚀 Quickstart for Windows (Step-by-Step)

### Prerequisites
- Python 3.8 to 3.12 installed on Windows. *(Make sure "Add python.exe to PATH" was checked during install!)*
- (Optional for open-weight AI) [Ollama for Windows](https://ollama.com/download/windows).

### 1. Open Terminal
Press `Win + R`, type `powershell` (or `cmd`), and navigate to your project directory:
```powershell
cd C:\Users\YourName\Projects\growwise
```

### 2. Create and Activate Virtual Environment
```powershell
# In PowerShell:
python -m venv venv
.\venv\Scripts\Activate.ps1

# (Or in Command Prompt CMD):
# .\venv\Scripts\activate.bat
```

> *If PowerShell shows an execution policy error, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`*

### 3. Install Lightweight Dependencies
```powershell
pip install -r requirements.txt
```
*(Only installs Streamlit! Zero heavy PyTorch or CUDA downloads needed.)*

### 4. Run the Unit Tests
Verify all 15 tests pass:
```powershell
python -m unittest discover tests
```
Output:
```
Ran 15 tests in 0.015s
OK
```

### 5. (Recommended) Set Up Local Gemma 2 2B
1. Download and install [Ollama](https://ollama.com/download/windows).
2. Open a separate PowerShell window and run:
   ```powershell
   ollama run gemma2:2b
   ```
   *(This downloads the compact ~1.6 GB model. Once it replies to a greeting, press `Ctrl + D` or type `/bye` to exit the chat; the background service remains active.)*
3. Test that Ollama is responding:
   ```powershell
   curl http://localhost:11434/api/tags
   ```

### 6. Launch GrowWise
```powershell
streamlit run app.py
```
Open your browser at `http://localhost:8501` and start planning your garden!

---

## 🧪 Testing and Verification Commands

Run individual component tests anytime:

```powershell
# Test the Knowledge Base alone
python -m unittest tests/test_knowledge_base.py

# Test the Deterministic Rules Engine
python -m unittest tests/test_rules.py

# Test the AI Engine & Offline Synthesizer
python -m unittest tests/test_ai_engine.py

# Run everything with verbose details
python -m unittest discover tests -v
```

---

## 📁 Repository Structure

```
growwise/
├── __init__.py           # Package initialization
├── knowledge_base.py     # Verified botanical database (USDA/RHS citations)
├── rules.py              # Pure deterministic suitability engine & space math
├── ai_engine.py          # Gemma local REST + Gemini fallback + offline synthesizer
tests/
├── __init__.py
├── test_knowledge_base.py # 5 integrity tests
├── test_rules.py          # 5 suitability tests
└── test_ai_engine.py      # 5 grounding & formatting tests
app.py                    # Streamlit interactive application
requirements.txt          # Minimal requirements (<20MB download)
README.md                 # Documentation and setup guide
```

---

## 📜 Horticultural Grounding & Ethical Standards

- **No AI Hallucinations**: Minimum sunlight hours, root depths, hardiness zones, and companion compatibility are evaluated **before** AI generation.
- **Invasive Species Protection**: Peppermint (*Mentha × piperita*) is strictly barred from in-ground recommendations to protect gardens from aggressive rhizomes.
- **Transparent Citations**: Every plant card cites its authoritative agricultural source (USDA Extension bulletins and RHS guides).
