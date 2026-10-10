"""
GrowWise AI Engine
Supports open-weights Gemma (via local Ollama / llama.cpp REST API)
with optional Google Gemini cloud fallback and 100% offline grounded synthesizer.
Designed specifically for <= 8GB RAM machines with zero PyTorch dependencies.
"""

import json
import os
import urllib.request
import urllib.error
from typing import Dict, Any, Optional, Tuple, List
from growwise.rules import GardenPlanRecommendation, PlantSuitabilityResult
from growwise.knowledge_base import PlantProfile, get_plant_by_id


DEFAULT_OLLAMA_URL = "http://localhost:11434"
DEFAULT_GEMMA_MODEL = "gemma2:2b"  # 1.6GB RAM footprint, perfect for <=8GB PCs


def check_ollama_status(base_url: str = DEFAULT_OLLAMA_URL) -> Tuple[bool, str, List[str]]:
    """
    Checks if Ollama is running locally and inspects installed open-weight models.
    Returns (is_running, status_message, list_of_installed_models).
    """
    try:
        req = urllib.request.Request(f"{base_url}/api/tags", headers={"User-Agent": "GrowWise/1.0"})
        with urllib.request.urlopen(req, timeout=1.5) as response:
            if response.status == 200:
                data = json.loads(response.read().decode("utf-8"))
                models = [m.get("name", "") for m in data.get("models", [])]
                return True, "Ollama is running locally.", models
    except urllib.error.URLError:
        pass
    except Exception as e:
        return False, f"Ollama connection error: {str(e)}", []

    return False, "Ollama service not detected at " + base_url, []


def call_ollama_generate(
    prompt: str,
    model: str = DEFAULT_GEMMA_MODEL,
    base_url: str = DEFAULT_OLLAMA_URL,
    system_instruction: Optional[str] = None,
    timeout: int = 30,
) -> Tuple[bool, str]:
    """
    Invokes local Ollama inference using standard library urllib.
    Zero heavy dependencies; runs entirely in RAM budget.
    """
    payload: Dict[str, Any] = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.2,       # Low temperature to prevent hallucinations
            "top_p": 0.9,
            "num_predict": 700,
        },
    }
    if system_instruction:
        payload["system"] = system_instruction

    try:
        data_bytes = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            f"{base_url}/api/generate",
            data=data_bytes,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=timeout) as response:
            result = json.loads(response.read().decode("utf-8"))
            return True, result.get("response", "").strip()
    except urllib.error.URLError as e:
        return False, f"Local Ollama connection failed ({e.reason}). Ensure Ollama is running with 'ollama run {model}'."
    except Exception as e:
        return False, f"Inference error: {str(e)}"


def call_gemini_rest(
    prompt: str,
    api_key: Optional[str] = None,
    system_instruction: Optional[str] = None,
    timeout: int = 20,
) -> Tuple[bool, str]:
    """
    Optional cloud fallback using Gemini 2.5 Flash via REST.
    """
    key = api_key or os.environ.get("GEMINI_API_KEY", "")
    if not key:
        return False, "GEMINI_API_KEY environment variable not set."

    endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={key}"
    contents = []
    if system_instruction:
        contents.append({"role": "user", "parts": [{"text": f"SYSTEM INSTRUCTION: {system_instruction}"}]})
        contents.append({"role": "model", "parts": [{"text": "Understood. I will strictly obey these gardening constraints."}]})
    contents.append({"role": "user", "parts": [{"text": prompt}]})

    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 800,
        },
    }

    try:
        data_bytes = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            endpoint,
            data=data_bytes,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=timeout) as response:
            res_json = json.loads(response.read().decode("utf-8"))
            candidates = res_json.get("candidates", [])
            if candidates:
                text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                return True, text.strip()
            return False, "Empty response from Gemini API."
    except Exception as e:
        return False, f"Gemini API request failed: {str(e)}"


def build_grounded_garden_context(rec: GardenPlanRecommendation) -> str:
    """
    Constructs a strictly grounded factual brief from deterministic results.
    """
    u = rec.user_input
    lines = [
        "--- VERIFIED GARDEN PARAMETERS ---",
        f"Location: {u.location_name} (USDA Hardiness Zone {u.hardiness_zone})",
        f"Garden Type: {u.garden_type.value}",
        f"Daily Direct Sunlight: {u.sunlight_hours:.1f} hours",
        f"Total Space: {u.space_sq_ft:.1f} sq ft",
        f"Allocated Crops ({rec.space_utilization_pct}% space used):",
    ]

    for plant_id, count in rec.allocated_plants.items():
        p = get_plant_by_id(plant_id)
        if p:
            lines.append(
                f"- {p.common_name} ({p.botanical_name}): {count} plant(s), "
                f"Needs {p.min_sunlight_hours}h sun, Watering: {p.watering_need}, "
                f"Soil: {p.soil_preference}. Note: {p.care_summary}"
            )

    if rec.companion_synergies:
        lines.append("Verified Synergies:")
        for s in rec.companion_synergies:
            lines.append(f"  * {s}")

    if rec.companion_warnings:
        lines.append("Verified Separation Rules:")
        for w in rec.companion_warnings:
            lines.append(f"  * {w}")

    return "\n".join(lines)


def offline_grounded_explanation(rec: GardenPlanRecommendation) -> str:
    """
    Deterministic synthesizer when no LLM is running. 100% factual and reliable.
    """
    u = rec.user_input
    crops_text = ", ".join(
        f"{count}x {get_plant_by_id(pid).common_name if get_plant_by_id(pid) else pid}"
        for pid, count in rec.allocated_plants.items()
    )

    parts = [
        f"### 🌱 Grounded Garden Strategy for {u.location_name}",
        f"Your {u.space_sq_ft:.1f} sq ft {u.garden_type.value} setup receives {u.sunlight_hours:.1f} hours of direct sunlight in USDA Zone {u.hardiness_zone}.",
        f"The deterministic suitability rules allocated **{crops_text}**, utilizing **{rec.space_utilization_pct}%** of your available area.",
        "",
        "#### 🔬 Horticultural Rationale:",
    ]

    for pid, count in rec.allocated_plants.items():
        p = get_plant_by_id(pid)
        if not p:
            continue
        parts.append(
            f"- **{p.common_name}**: Matches your {u.garden_type.value} conditions. "
            f"Requires at least {p.min_sunlight_hours}h sun (you have {u.sunlight_hours}h). "
            f"Needs {p.min_container_depth_inches}\" soil depth. *{p.care_summary}*"
        )

    if rec.companion_synergies:
        parts.append("\n#### 🤝 Companion Synergies:")
        for s in rec.companion_synergies:
            parts.append(f"- {s}")

    if rec.companion_warnings:
        parts.append("\n#### ⚠️ Spatial Separation Requirements:")
        for w in rec.companion_warnings:
            parts.append(f"- {w}")

    return "\n".join(parts)


def offline_grounded_checklist(rec: GardenPlanRecommendation, weeks: int = 4) -> str:
    """
    Generates a weekly checklist synthesized directly from plant weekly schedules.
    """
    output_lines = [
        "### 📅 Weekly Horticultural Checklist (Grounded in Verified Data)",
        "",
    ]

    for week_num in range(1, weeks + 1):
        output_lines.append(f"#### Week {week_num}")
        tasks = []
        for pid in rec.allocated_plants.keys():
            p = get_plant_by_id(pid)
            if p and week_num in p.weekly_care_schedule:
                tasks.append(f"- [ ] **{p.common_name}**: {p.weekly_care_schedule[week_num]}")
        if tasks:
            output_lines.extend(tasks)
        else:
            output_lines.append("- [ ] Monitor general soil moisture and sunlight hours.")
        output_lines.append("")

    return "\n".join(output_lines)


def generate_garden_explanation(
    rec: GardenPlanRecommendation,
    provider: str = "auto",  # 'auto', 'gemma', 'gemini', 'offline'
    gemma_model: str = DEFAULT_GEMMA_MODEL,
    ollama_url: str = DEFAULT_OLLAMA_URL,
    gemini_api_key: Optional[str] = None,
) -> Tuple[str, str]:
    """
    Generates an explanation of the garden plan.
    Returns (explanation_text, engine_used).
    """
    if not rec.allocated_plants:
        return (
            "No crops could be safely allocated with your current sunlight and space parameters. "
            "Try adjusting sunlight exposure or expanding container size.",
            "rule_validator",
        )

    context = build_grounded_garden_context(rec)
    system_prompt = (
        "You are GrowWise, a grounded horticultural AI assistant. "
        "Strictly adhere to the verified garden parameters provided. "
        "Explain WHY the deterministic rules recommended these crops in warm, encouraging language. "
        "Never invent botanical facts or contradict the provided sunlight, soil, or space values."
    )
    user_prompt = f"{context}\n\nPlease explain why this layout works well and provide 3 key tips for success."

    # Try Gemma if requested or auto
    if provider in ("auto", "gemma"):
        is_up, _, models = check_ollama_status(ollama_url)
        if is_up:
            success, result = call_ollama_generate(
                prompt=user_prompt,
                model=gemma_model,
                base_url=ollama_url,
                system_instruction=system_prompt,
            )
            if success:
                return result, f"Local Open-Weight ({gemma_model} via Ollama)"
        elif provider == "gemma":
            return (
                f"Error: Ollama is not reachable at {ollama_url}. Run 'ollama run {gemma_model}' first, or switch provider to offline mode.",
                "error",
            )

    # Try Gemini if requested or auto
    if provider in ("auto", "gemini"):
        success, result = call_gemini_rest(
            prompt=user_prompt,
            api_key=gemini_api_key,
            system_instruction=system_prompt,
        )
        if success:
            return result, "Cloud Gemini 2.5 Flash"
        elif provider == "gemini":
            return f"Error connecting to Gemini API: {result}", "error"

    # Offline Grounded Fallback
    return offline_grounded_explanation(rec), "Offline Grounded Synthesizer (Zero LLM Required)"


def generate_weekly_checklist(
    rec: GardenPlanRecommendation,
    weeks: int = 4,
    provider: str = "auto",
    gemma_model: str = DEFAULT_GEMMA_MODEL,
    ollama_url: str = DEFAULT_OLLAMA_URL,
    gemini_api_key: Optional[str] = None,
) -> Tuple[str, str]:
    """
    Generates an actionable weekly checklist.
    Returns (checklist_markdown, engine_used).
    """
    if not rec.allocated_plants:
        return "No plants allocated.", "rule_validator"

    context = build_grounded_garden_context(rec)
    system_prompt = (
        "You are GrowWise weekly garden task planner. "
        f"Generate a clear, markdown-formatted {weeks}-week task checklist for the gardener. "
        "Keep all tasks strictly grounded in the verified care schedules provided."
    )
    user_prompt = f"{context}\n\nGenerate a detailed Week 1 to Week {weeks} action checklist with checkboxes."

    if provider in ("auto", "gemma"):
        is_up, _, _ = check_ollama_status(ollama_url)
        if is_up:
            success, result = call_ollama_generate(
                prompt=user_prompt,
                model=gemma_model,
                base_url=ollama_url,
                system_instruction=system_prompt,
            )
            if success:
                return result, f"Local Open-Weight ({gemma_model} via Ollama)"

    if provider in ("auto", "gemini"):
        success, result = call_gemini_rest(
            prompt=user_prompt,
            api_key=gemini_api_key,
            system_instruction=system_prompt,
        )
        if success:
            return result, "Cloud Gemini 2.5 Flash"

    # Always reliable offline synthesizer
    return offline_grounded_checklist(rec, weeks=weeks), "Offline Grounded Synthesizer (Zero LLM Required)"
