"""
GrowWise - Replaceable Model Provider Interface
Enables running open-weight models (e.g. Gemma 2 2B / 9B) via any standard inference runtime
(Ollama, vLLM, HuggingFace TGI, Together AI, or remote OpenAI-compatible endpoints)
with fallback to the offline grounded synthesizer.
"""

import os
import json
import urllib.request
import urllib.error
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, Tuple
from backend.app.schemas import GardenProfile, CropEvaluation, WeeklyPlan


class AIProviderResponse:
    def __init__(self, success: bool, content: str, engine_used: str, error_message: Optional[str] = None, parsed_json: Optional[Dict[str, Any]] = None):
        self.success = success
        self.content = content
        self.engine_used = engine_used
        self.error_message = error_message
        self.parsed_json = parsed_json

    def to_dict(self) -> Dict[str, Any]:
        return {
            "success": self.success,
            "content": self.content,
            "engine_used": self.engine_used,
            "error_message": self.error_message,
            "parsed_json": self.parsed_json,
        }


class BaseModelProvider(ABC):
    @abstractmethod
    def generate_explanation(self, profile: GardenProfile, suitable_crops: List[CropEvaluation]) -> AIProviderResponse:
        pass


class OpenWeightGemmaProvider(BaseModelProvider):
    """
    Connects to an open-weight Gemma inference endpoint via standard OpenAI-compatible API.
    Can be local Ollama (http://localhost:11434/v1) or remote endpoint (vLLM / Render private service / API).
    """
    def __init__(
        self,
        endpoint_url: Optional[str] = None,
        api_key: Optional[str] = None,
        model_name: Optional[str] = None,
        timeout: int = 25
    ):
        self.endpoint_url = endpoint_url or os.environ.get("OPEN_WEIGHT_ENDPOINT_URL", "http://localhost:11434/v1/chat/completions")
        self.api_key = api_key or os.environ.get("OPEN_WEIGHT_API_KEY", "")
        self.model_name = model_name or os.environ.get("OPEN_WEIGHT_MODEL_NAME", "gemma2:2b")
        self.timeout = timeout

    def generate_explanation(self, profile: GardenProfile, suitable_crops: List[CropEvaluation]) -> AIProviderResponse:
        crops_context = "\n".join([
            f"- {c.common_name} ({c.botanical_name}): Category={c.category}, Sun={c.min_sunlight_hours}h, Space={c.min_space_sq_ft} sq ft, Depth={c.min_container_depth_inches}\", Maturity={c.days_to_maturity}d. Source={c.source_reference}"
            for c in suitable_crops[:4]
        ])

        system_instruction = (
            "You are GrowWise, an outdoor-focused horticultural assistant for Hacktoberfest 2026 'Touch Grass'. "
            "Your purpose is to get the user outdoors into the soil. "
            "STRICT GROUNDING CONSTRAINT: Never invent plant facts or contradict the verified parameters provided. "
            "Explain why these crops suit their setup and give 3 encouraging outdoor tips."
        )

        user_content = (
            f"GARDEN PROFILE:\n"
            f"Location: {profile.location}\n"
            f"Garden Type: {profile.garden_type.value}\n"
            f"Sunlight: {profile.sunlight.value}\n"
            f"Available Area: {profile.growing_space_sq_ft} sq ft\n"
            f"Experience: {profile.experience_level.value}\n\n"
            f"VERIFIED SUITABLE CROPS:\n{crops_context}\n\n"
            f"Please write a concise outdoor gardening action brief."
        )

        payload = {
            "model": self.model_name,
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": user_content}
            ],
            "temperature": 0.2,
            "max_tokens": 600,
        }

        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        try:
            req = urllib.request.Request(
                self.endpoint_url,
                data=json.dumps(payload).encode("utf-8"),
                headers=headers,
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                choices = data.get("choices", [])
                if choices:
                    content = choices[0].get("message", {}).get("content", "").strip()
                    return AIProviderResponse(
                        success=True,
                        content=content,
                        engine_used=f"Open-Weight Gemma ({self.model_name} via {self.endpoint_url.split('/')[2]})"
                    )
                return AIProviderResponse(
                    success=False,
                    content="",
                    engine_used="Open-Weight Gemma",
                    error_message="Empty choices received from inference endpoint."
                )
        except urllib.error.URLError as e:
            return AIProviderResponse(
                success=False,
                content="",
                engine_used="Open-Weight Gemma",
                error_message=f"Endpoint unreachable at {self.endpoint_url}: {e.reason}. (Make sure Ollama or remote inference service is running)."
            )
        except Exception as e:
            return AIProviderResponse(
                success=False,
                content="",
                engine_used="Open-Weight Gemma",
                error_message=f"Inference error: {str(e)}"
            )


class OfflineGroundedSynthesizerProvider(BaseModelProvider):
    """
    100% Deterministic Offline Provider. Zero RAM overhead, zero remote API reliance.
    Synthesizes facts directly from curated agricultural data.
    """
    def generate_explanation(self, profile: GardenProfile, suitable_crops: List[CropEvaluation]) -> AIProviderResponse:
        selected = suitable_crops[:4]
        if not selected:
            return AIProviderResponse(
                success=True,
                content="No crops safely matched the physical parameters of your space. Consider increasing sunlight exposure or expanding container depth.",
                engine_used="Offline Grounded Synthesizer (Zero LLM Overhead)"
            )

        crop_names = ", ".join(f"{c.common_name}" for c in selected)
        lines = [
            f"### 🌱 Outdoor Garden Strategy: {profile.location}",
            f"Your **{profile.growing_space_sq_ft} sq ft {profile.garden_type.value}** receives **{profile.sunlight.value}** conditions.",
            f"The deterministic evaluation identified **{crop_names}** as verified matches for your space.",
            "",
            "#### 🔬 Horticultural Grounding:",
        ]

        for c in selected:
            lines.append(
                f"- **{c.common_name}** (*{c.botanical_name}*): Requires {c.min_sunlight_hours}h sun and at least {c.min_container_depth_inches}\" soil depth. Matures in ~{c.days_to_maturity} days. *Source: {c.source_reference}*"
            )

        lines.extend([
            "",
            "#### 🌿 Practical Outdoor Next Steps:",
            "1. **Touch Grass & Prepare Soil**: Head outdoors to inspect your container drainage holes or clear surface weeds from your garden bed.",
            "2. **Check Morning Moisture**: Touch the top inch of soil before watering; only water when dry to the touch.",
            "3. **Pinch & Prune**: Gently pinch back leaf tips every week to stimulate dense foliage and delay bolting.",
        ])

        return AIProviderResponse(
            success=True,
            content="\n".join(lines),
            engine_used="Offline Grounded Synthesizer (Zero LLM Overhead)"
        )


def get_model_provider(provider_type: Optional[str] = None) -> BaseModelProvider:
    """
    Factory function for model providers.
    Defaults to open_weight if configured, with automatic fallback to offline grounded synthesizer.
    """
    p_type = (provider_type or os.environ.get("AI_PROVIDER_TYPE", "offline")).lower()

    if p_type in ("gemma", "open_weight"):
        return OpenWeightGemmaProvider()
    return OfflineGroundedSynthesizerProvider()
