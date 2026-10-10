"""
GrowWise - Deterministic Garden Engine
Evaluates plant suitability against curated agricultural data without hallucination.
"""

import json
import os
from typing import List, Dict, Any, Tuple
from backend.app.schemas import GardenProfile, CropEvaluation, GardeningTask, WeeklyPlan, SunlightEnum, GardenTypeEnum


CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", "data"))


def load_crops_data() -> List[Dict[str, Any]]:
    crops_path = os.path.join(DATA_DIR, "crops.json")
    if os.path.exists(crops_path):
        with open(crops_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def load_sources_data() -> List[Dict[str, Any]]:
    sources_path = os.path.join(DATA_DIR, "gardening_sources.json")
    if os.path.exists(sources_path):
        with open(sources_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


class DeterministicGardenEngine:
    def __init__(self):
        self.crops = load_crops_data()
        self.sources = {s["id"]: s for s in load_sources_data()}

    def evaluate_profile(self, profile: GardenProfile) -> Tuple[List[CropEvaluation], List[CropEvaluation]]:
        """Evaluates all crops into (suitable, excluded) with exact deterministic reasons."""
        suitable: List[CropEvaluation] = []
        excluded: List[CropEvaluation] = []

        sun_hours_map = {
            SunlightEnum.FULL_SUN: 7.0,
            SunlightEnum.PARTIAL_SUN: 4.5,
            SunlightEnum.SHADE: 2.5,
        }
        user_sun_hours = sun_hours_map.get(profile.sunlight, 5.0)

        for crop in self.crops:
            crop_id = crop["id"]
            name = crop["common_name"]
            botanical = crop["botanical_name"]
            min_sun = crop["min_sunlight_hours"]
            min_space = crop["min_space_sq_ft"]
            compatible_types = crop["compatible_garden_types"]

            reasons_pos: List[str] = []
            reasons_neg: List[str] = []

            # 1. Garden Type Constraint
            gt_val = profile.garden_type.value if hasattr(profile.garden_type, "value") else str(profile.garden_type)
            if gt_val not in compatible_types:
                reasons_neg.append(
                    f"Not suitable for {gt_val}. Requires one of: {', '.join(compatible_types)}."
                )
            else:
                reasons_pos.append(f"Well-adapted to {gt_val} cultivation.")

            # In-ground peppermint rule
            if gt_val == "backyard" and crop_id == "peppermint":
                reasons_neg.append("Disqualified from in-ground soil: Peppermint spreads invasively via underground stolons.")

            # 2. Sunlight Constraint
            # Crops marked as shade-tolerant can thrive with 2.5+ hours of dappled or indirect sun
            min_effective_sun = (min_sun - 0.5) if crop.get("sunlight") == "shade" else (min_sun - 0.25)
            if user_sun_hours < min_effective_sun:
                reasons_neg.append(
                    f"Insufficient sunlight: Requires {min_sun}h direct sun; current area receives ~{user_sun_hours}h ({profile.sunlight.value})."
                )
            else:
                reasons_pos.append(f"Meets daily sunlight requirement ({min_sun}h minimum or shade-tolerant).")

            # 3. Space Constraint
            if profile.growing_space_sq_ft < min_space:
                reasons_neg.append(
                    f"Insufficient space: Needs at least {min_space} sq ft per plant; total area is {profile.growing_space_sq_ft} sq ft."
                )
            else:
                reasons_pos.append(f"Fits within available growing space ({min_space} sq ft required).")

            # Experience match
            if profile.experience_level.value == "beginner" and crop.get("difficulty") == "beginner":
                reasons_pos.append("Beginner-friendly crop with high tolerance for minor care variations.")

            # User preference
            if crop_id in profile.preferred_crop_ids:
                reasons_pos.append("Matches user preferred plant selection.")
            elif crop.get("category") in profile.preferred_categories:
                reasons_pos.append(f"Matches preferred category '{crop.get('category')}'.")

            is_ok = len(reasons_neg) == 0

            # Score calculation
            score = 0.0
            if is_ok:
                score = 65.0
                if crop_id in profile.preferred_crop_ids:
                    score += 15.0
                if crop.get("difficulty") == "beginner":
                    score += 10.0
                score += min(10.0, (user_sun_hours - min_sun) * 5.0)
                score = round(min(100.0, max(0.0, score)), 1)

            evaluation = CropEvaluation(
                crop_id=crop_id,
                common_name=name,
                botanical_name=botanical,
                category=crop.get("category", "vegetable"),
                is_suitable=is_ok,
                suitability_score=score,
                min_sunlight_hours=min_sun,
                min_space_sq_ft=min_space,
                min_container_depth_inches=crop.get("min_container_depth_inches", 8),
                watering_need=crop.get("watering_need", "moderate"),
                days_to_maturity=crop.get("days_to_maturity", 60),
                difficulty=crop.get("difficulty", "beginner"),
                reasons_recommended=reasons_pos,
                reasons_excluded=reasons_neg,
                source_reference=crop.get("source_reference", ""),
            )

            if is_ok:
                suitable.append(evaluation)
            else:
                excluded.append(evaluation)

        suitable.sort(key=lambda x: x.suitability_score, reverse=True)
        return suitable, excluded

    def generate_grounded_plan(self, profile: GardenProfile, suitable_crops: List[CropEvaluation]) -> WeeklyPlan:
        """Generates a practical 4-week outdoor task plan based on verified crop profiles."""
        selected_crops = suitable_crops[:4]
        selected_ids = {c.crop_id for c in selected_crops}
        crop_dict = {c["id"]: c for c in self.crops}

        # Companion synergies and warnings
        synergies: List[str] = []
        warnings: List[str] = []

        for c in selected_crops:
            raw = crop_dict.get(c.crop_id, {})
            for comp_id in raw.get("verified_companions", []):
                if comp_id in selected_ids:
                    comp_name = crop_dict.get(comp_id, {}).get("common_name", comp_id)
                    s_msg = f"{c.common_name} + {comp_name} mutually benefit root zoning and pest resistance."
                    if s_msg not in synergies:
                        synergies.append(s_msg)

            for inc_id in raw.get("incompatible_neighbors", []):
                if inc_id in selected_ids:
                    inc_name = crop_dict.get(inc_id, {}).get("common_name", inc_id)
                    w_msg = f"Keep {c.common_name} and {inc_name} in separate pots or bed quadrants."
                    if w_msg not in warnings:
                        warnings.append(w_msg)

        tasks: List[GardeningTask] = []

        # Week 1: Soil Prep and Outdoor Sowing
        for c in selected_crops:
            raw = crop_dict.get(c.crop_id, {})
            tasks.append(
                GardeningTask(
                    id=f"w1_{c.crop_id}",
                    week_number=1,
                    title=f"Outdoor Setup & Planting: {c.common_name}",
                    description=f"Step outside to prepare the {profile.garden_type.value}. Ensure pots or beds have at least {c.min_container_depth_inches}\" depth. Sow seeds or transplant into moist soil.",
                    estimated_duration_minutes=25,
                    required_supplies=["Potting mix / clean soil", "Hand trowel", "Gardening gloves", "Seed packet or starter"],
                    crop_name=c.common_name,
                    safety_notes="Always wear gloves when handling potting mix to avoid inhaling dust particles.",
                    outdoor_activity=True,
                )
            )

        # Week 2: Moisture Check & Thinning
        for c in selected_crops:
            tasks.append(
                GardeningTask(
                    id=f"w2_{c.crop_id}",
                    week_number=2,
                    title=f"Root Moisture & Seedling Thinning: {c.common_name}",
                    description=f"Spend 15 minutes outdoors observing soil moisture and morning sun angles. Gently thin crowded seedlings to leave adequate spacing ({c.min_space_sq_ft} sq ft per mature plant).",
                    estimated_duration_minutes=15,
                    required_supplies=["Small garden snips or scissors", "Watering can with fine rose spray"],
                    crop_name=c.common_name,
                    safety_notes="Cut thinnings at soil level with snips instead of pulling to prevent root damage to adjacent seedlings.",
                    outdoor_activity=True,
                )
            )

        # Week 3: Support & Organic Mulching
        for c in selected_crops:
            raw = crop_dict.get(c.crop_id, {})
            tasks.append(
                GardeningTask(
                    id=f"w3_{c.crop_id}",
                    week_number=3,
                    title=f"Mulch Layering & Pest Inspection: {c.common_name}",
                    description=f"Inspect undersides of leaves for aphids or flea beetles. Apply a 1-inch straw or leaf mulch layer to preserve root moisture and regulate soil temperature outdoors.",
                    estimated_duration_minutes=20,
                    required_supplies=["Organic straw or untreated wood chips", "Natural neem oil or mild insecticidal soap if needed"],
                    crop_name=c.common_name,
                    safety_notes="Avoid chemical pesticide sprays that harm beneficial bees and pollinating syrphid flies.",
                    outdoor_activity=True,
                )
            )

        # Week 4: Leaf Pruning, Harvest & Succession
        for c in selected_crops:
            tasks.append(
                GardeningTask(
                    id=f"w4_{c.crop_id}",
                    week_number=4,
                    title=f"Pruning & Early Harvesting: {c.common_name}",
                    description=f"Step outside to harvest mature outer leaves or pinch terminal buds to promote dense growth. Enjoy fresh outdoor harvest directly from your {profile.garden_type.value}!",
                    estimated_duration_minutes=25,
                    required_supplies=["Clean harvest basket or colander", "Sharp garden scissors"],
                    crop_name=c.common_name,
                    safety_notes="Wash all harvested leaves and vegetables with clean tap water before kitchen consumption.",
                    outdoor_activity=True,
                )
            )

        outdoor_target = sum(t.estimated_duration_minutes for t in tasks)

        return WeeklyPlan(
            location=profile.location,
            garden_type=profile.garden_type.value,
            total_allocated_crops=[c.common_name for c in selected_crops],
            tasks=tasks,
            outdoor_minutes_goal=outdoor_target,
            companion_synergies=synergies,
            spacing_warnings=warnings,
        )
