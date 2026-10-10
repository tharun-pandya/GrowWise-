"""
GrowWise - FastAPI Backend Application
Entry point for REST API endpoints.
"""

import os
from typing import Dict, Any, List, Optional
from backend.app.schemas import GardenProfile, GardenTypeEnum, SunlightEnum, ExperienceLevel
from backend.app.garden_engine import DeterministicGardenEngine, load_crops_data, load_sources_data
from backend.app.model_provider import get_model_provider
from backend.app.validators import validate_ai_text_safety

try:
    from fastapi import FastAPI, HTTPException, Body
    from fastapi.middleware.cors import CORSMiddleware
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False

engine = DeterministicGardenEngine()

if HAS_FASTAPI:
    app = FastAPI(
        title="GrowWise API",
        description="Grounded AI-Powered Garden Planner for Hacktoberfest 2026 'Touch Grass'",
        version="1.0.0",
    )

    origins = os.environ.get("CORS_ORIGINS", "*").split(",")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    @app.get("/api/health")
    def health_check():
        return {
            "status": "healthy",
            "service": "GrowWise API",
            "crops_count": len(engine.crops),
            "sources_count": len(engine.sources),
            "ai_provider": os.environ.get("AI_PROVIDER_TYPE", "offline"),
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
    def explain_plan(profile: GardenProfile):
        suitable, _ = engine.evaluate_profile(profile)
        provider = get_model_provider()
        response = provider.generate_explanation(profile, suitable)

        # Validate output safety
        if response.success:
            is_safe, safety_warnings = validate_ai_text_safety(response.content)
            if not is_safe:
                return {
                    "success": False,
                    "content": "Safety filter blocked the response: " + "; ".join(safety_warnings),
                    "engine_used": response.engine_used,
                    "safety_warnings": safety_warnings,
                }

        return response.to_dict()
else:
    app = None
