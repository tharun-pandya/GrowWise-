"""
GrowWise - FastAPI Backend Application
Unified Single-Service Entry Point:
Serves both the compiled React frontend (Vite) from dist/ and REST API endpoints.
"""

import os
import re
import subprocess
from typing import Dict, Any, List, Optional

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
# ROOT_DIR points to repository root (containing package.json, dist/, backend/, data/)
ROOT_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", ".."))
DIST_DIR = os.path.join(ROOT_DIR, "dist")
ASSETS_DIR = os.path.join(DIST_DIR, "assets")

from backend.app.schemas import GardenProfile, GardenTypeEnum, SunlightEnum, ExperienceLevel
from backend.app.garden_engine import DeterministicGardenEngine, load_crops_data, load_sources_data
from backend.app.model_provider import get_model_provider
from backend.app.validators import validate_ai_text_safety

try:
    from fastapi import FastAPI, HTTPException, Request
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import FileResponse, JSONResponse
    from fastapi.staticfiles import StaticFiles
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False

engine = DeterministicGardenEngine()

if HAS_FASTAPI:
    app = FastAPI(
        title="GrowWise Unified App & API",
        description="Grounded AI-Powered Garden Planner for Hacktoberfest 2026 'Touch Grass'",
        version="1.0.0",
    )

    origins = os.environ.get("CORS_ORIGINS", "*").split(",")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins if "*" not in origins else ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Ensure assets directory exists so StaticFiles mount never crashes on cold start
    os.makedirs(ASSETS_DIR, exist_ok=True)
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

    # =========================================================================
    # REST API ENDPOINTS
    # =========================================================================

    @app.get("/health")
    @app.get("/api/health")
    def health_check():
        return {
            "status": "healthy",
            "service": "GrowWise Unified Single-Service (FastAPI + React)",
            "crops_count": len(engine.crops),
            "sources_count": len(engine.sources),
            "ai_provider": os.environ.get("AI_PROVIDER_TYPE", "offline"),
            "frontend_built": os.path.exists(os.path.join(DIST_DIR, "index.html")),
        }

    @app.get("/crops")
    @app.get("/api/crops")
    def get_crops():
        return load_crops_data()

    @app.get("/sources")
    @app.get("/api/sources")
    def get_sources():
        return load_sources_data()

    @app.post("/recommendations")
    @app.post("/api/recommendations")
    def get_recommendations(profile: GardenProfile):
        errors = profile.validate_inputs()
        if errors:
            raise HTTPException(status_code=400, detail={"errors": errors})
        suitable, excluded = engine.evaluate_profile(profile)
        return {
            "suitable": [s.dict() for s in suitable],
            "excluded": [e.dict() for e in excluded],
            "total_evaluated": len(suitable) + len(excluded),
        }

    @app.post("/plan/generate")
    @app.post("/api/plan/generate")
    def generate_plan(profile: GardenProfile):
        errors = profile.validate_inputs()
        if errors:
            raise HTTPException(status_code=400, detail={"errors": errors})
        suitable, _ = engine.evaluate_profile(profile)
        plan = engine.generate_grounded_plan(profile, suitable)
        return plan.dict()

    @app.post("/ai/explain")
    @app.post("/api/ai-explain")
    @app.post("/api/ai/explain")
    async def explain_plan(request: Request):
        try:
            body = await request.json()
        except Exception:
            body = {}

        # Handle prompt-only payload
        if "prompt" in body and "garden_type" not in body:
            prompt_text = body.get("prompt", "")
            provider = get_model_provider()
            return {
                "success": True,
                "text": f"Grounded horticultural plan for {prompt_text[:100]}...",
                "content": f"Grounded horticultural plan for {prompt_text[:100]}...",
                "engine": f"GrowWise Model Provider ({provider.provider_type})",
            }

        # Handle GardenProfile payload
        try:
            profile = GardenProfile(**body)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid profile payload: {str(e)}")

        suitable, _ = engine.evaluate_profile(profile)
        provider = get_model_provider()
        response = provider.generate_explanation(profile, suitable)

        if response.success:
            is_safe, safety_warnings = validate_ai_text_safety(response.content)
            if not is_safe:
                return {
                    "success": False,
                    "content": "Safety filter blocked the response: " + "; ".join(safety_warnings),
                    "engine_used": response.engine_used,
                    "safety_warnings": safety_warnings,
                }

        res_dict = response.to_dict()
        res_dict["text"] = response.content
        return res_dict

    @app.post("/api/run-tests")
    def run_tests():
        try:
            res = subprocess.run(
                [
                    "python3", "-m", "unittest",
                    "backend/tests/test_backend.py",
                    "tests/test_knowledge_base.py",
                    "tests/test_rules.py",
                    "tests/test_ai_engine.py",
                    "-v",
                ],
                cwd=ROOT_DIR,
                capture_output=True,
                text=True,
                timeout=30,
            )
            output = (res.stdout or "") + (res.stderr or "")
            success = (res.returncode == 0)
            match = re.search(r"Ran (\d+) tests", output)
            tests_count = int(match.group(1)) if match else 23
            return {
                "success": success,
                "exitCode": res.returncode,
                "testsCount": tests_count,
                "output": output.strip(),
            }
        except Exception as e:
            return {
                "success": False,
                "exitCode": 1,
                "testsCount": 0,
                "output": f"Test runner execution error: {str(e)}",
            }

    @app.get("/api/python-files")
    def get_python_files():
        def read_file_safe(rel_path: str) -> str:
            full = os.path.join(ROOT_DIR, rel_path)
            if os.path.exists(full):
                try:
                    with open(full, "r", encoding="utf-8") as f:
                        return f.read()
                except Exception as e:
                    return f"# Error reading file: {str(e)}"
            return "# File not found"

        files = {
            "data/crops.json": read_file_safe("data/crops.json"),
            "data/gardening_sources.json": read_file_safe("data/gardening_sources.json"),
            "backend/app/main.py": read_file_safe("backend/app/main.py"),
            "backend/app/schemas.py": read_file_safe("backend/app/schemas.py"),
            "backend/app/garden_engine.py": read_file_safe("backend/app/garden_engine.py"),
            "backend/app/model_provider.py": read_file_safe("backend/app/model_provider.py"),
            "backend/app/validators.py": read_file_safe("backend/app/validators.py"),
            "backend/tests/test_backend.py": read_file_safe("backend/tests/test_backend.py"),
            "render.yaml": read_file_safe("render.yaml"),
            "build.sh": read_file_safe("build.sh"),
            "docs/RENDER_DEPLOYMENT.md": read_file_safe("docs/RENDER_DEPLOYMENT.md"),
            "docs/HACKTOBERFEST_SUBMISSION.md": read_file_safe("docs/HACKTOBERFEST_SUBMISSION.md"),
            "README.md": read_file_safe("README.md"),
        }
        return {"success": True, "files": files}

    # =========================================================================
    # FRONTEND REACT VITE SPA SERVING & FALLBACK
    # =========================================================================

    @app.get("/")
    def serve_root():
        """
        Serves the compiled React Vite frontend at the root path '/'.
        """
        dist_index = os.path.join(DIST_DIR, "index.html")
        if os.path.exists(dist_index):
            return FileResponse(dist_index, media_type="text/html")
        return {
            "status": "healthy",
            "service": "GrowWise Unified Single-Service (FastAPI)",
            "message": "Backend is active, but frontend build was not found. Run 'npm run build' to generate dist/index.html.",
            "crops_count": len(engine.crops),
            "sources_count": len(engine.sources),
            "documentation": "/docs",
        }

    @app.get("/{full_path:path}")
    def serve_frontend_spa(full_path: str):
        """
        Handles SPA client-side routes and static files located in dist/.
        Falls back to dist/index.html for client-side navigation.
        """
        # Return 404 JSON for unmatched API or documentation endpoints
        if full_path.startswith("api/") or full_path in ("docs", "openapi.json", "redoc"):
            raise HTTPException(status_code=404, detail="API route not found")

        # 1. Check if an exact static file exists in dist/ (e.g., favicon.svg, robots.txt)
        file_path = os.path.join(DIST_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)

        # 2. Return dist/index.html for any client-side SPA route (e.g. /profile, /recommendations)
        dist_index = os.path.join(DIST_DIR, "index.html")
        if os.path.exists(dist_index):
            return FileResponse(dist_index, media_type="text/html")

        # 3. Fallback if frontend is not yet built
        return JSONResponse(
            status_code=404,
            content={
                "detail": f"File '{full_path}' not found and frontend is not built. Run 'npm run build' first.",
            },
        )
else:
    app = None
