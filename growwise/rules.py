"""
GrowWise Deterministic Rules Engine
Pure boolean and mathematical logic for plant suitability and space allocation.
Zero probabilistic hallucination: clear pass/fail criteria and exact disqualification logs.
"""

from dataclasses import dataclass, field
from typing import List, Dict, Tuple, Optional
from growwise.knowledge_base import (
    PlantProfile,
    SunlightLevel,
    GardenType,
    PlantCategory,
    get_all_plants,
    get_plant_by_id,
)


@dataclass
class UserGardenInput:
    location_name: str
    hardiness_zone: int                      # e.g., 6 (USDA Zone 6)
    garden_type: GardenType                  # container, raised_bed, in_ground, windowsill, greenhouse
    sunlight_hours: float                    # e.g., 5.5 hours of direct sunlight
    space_sq_ft: float                       # Total usable garden space in square feet
    preferred_categories: List[PlantCategory] = field(default_factory=list)
    preferred_plant_ids: List[str] = field(default_factory=list)


@dataclass
class PlantSuitabilityResult:
    plant: PlantProfile
    is_suitable: bool
    score: float                             # 0 to 100
    sunlight_passed: bool
    garden_type_passed: bool
    zone_passed: bool
    space_passed: bool
    max_count_in_space: int
    disqualification_reasons: List[str]
    positive_factors: List[str]


@dataclass
class GardenPlanRecommendation:
    user_input: UserGardenInput
    suitable_plants: List[PlantSuitabilityResult]
    unsuitable_plants: List[PlantSuitabilityResult]
    allocated_plants: Dict[str, int]         # Plant ID -> recommended count
    total_space_used_sq_ft: float
    space_utilization_pct: float
    companion_synergies: List[str]
    companion_warnings: List[str]


def evaluate_single_plant(
    plant: PlantProfile,
    user_input: UserGardenInput
) -> PlantSuitabilityResult:
    """
    Evaluates whether a single plant satisfies physical conditions deterministically.
    """
    disqualifications: List[str] = []
    positives: List[str] = []

    # 1. Garden Type Compatibility
    garden_type_passed = user_input.garden_type in plant.compatible_garden_types
    if not garden_type_passed:
        allowed = ", ".join(gt.value for gt in plant.compatible_garden_types)
        disqualifications.append(
            f"Not compatible with '{user_input.garden_type.value}' gardening. "
            f"Requires one of: {allowed}."
        )

    # 2. Sunlight Availability
    # We allow a small tolerance of 0.25 hrs if user is very close
    sunlight_passed = user_input.sunlight_hours >= (plant.min_sunlight_hours - 0.25)
    if not sunlight_passed:
        disqualifications.append(
            f"Requires at least {plant.min_sunlight_hours:.1f} hrs of direct sun, "
            f"but location only receives {user_input.sunlight_hours:.1f} hrs."
        )
    else:
        surplus = user_input.sunlight_hours - plant.min_sunlight_hours
        if surplus >= 1.0:
            positives.append(f"Ample sunlight surplus (+{surplus:.1f} hrs above minimum).")
        else:
            positives.append("Meets minimum sunlight threshold.")

    # 3. Hardiness Zone Compatibility
    zone_passed = user_input.hardiness_zone in plant.hardiness_zones
    if not zone_passed:
        min_z, max_z = min(plant.hardiness_zones), max(plant.hardiness_zones)
        disqualifications.append(
            f"Outside verified hardiness range (Zones {min_z}-{max_z}). "
            f"Location is Zone {user_input.hardiness_zone}."
        )
    else:
        positives.append(f"Grows well in USDA Zone {user_input.hardiness_zone}.")

    # 4. Physical Space Viability
    # Must have space for at least 1 specimen
    space_passed = user_input.space_sq_ft >= plant.min_space_sq_ft
    max_count = int(user_input.space_sq_ft // plant.min_space_sq_ft) if space_passed else 0
    if not space_passed:
        disqualifications.append(
            f"Needs minimum {plant.min_space_sq_ft:.2f} sq ft per plant, "
            f"but total garden space is only {user_input.space_sq_ft:.2f} sq ft."
        )

    # Overall suitability determination
    is_suitable = (
        garden_type_passed
        and sunlight_passed
        and zone_passed
        and space_passed
    )

    # Compute deterministic suitability score (0 - 100)
    score = 0.0
    if is_suitable:
        # Base viability score
        score = 60.0

        # Sunlight comfort (up to +15 pts)
        sun_ratio = min(user_input.sunlight_hours / plant.min_sunlight_hours, 1.5)
        score += (sun_ratio - 1.0) * 20.0

        # Beginner friendliness (+10 pts)
        if plant.difficulty == "beginner":
            score += 10.0
            positives.append("Beginner-friendly crop with high resilience.")
        elif plant.difficulty == "intermediate":
            score += 5.0

        # User preference match (+15 pts for category, +20 pts for exact plant)
        if plant.id in user_input.preferred_plant_ids:
            score += 15.0
            positives.append("Matches user's explicitly requested plants.")
        elif plant.category in user_input.preferred_categories:
            score += 10.0
            positives.append(f"Matches preferred category '{plant.category.value}'.")

        # Cap score between 0 and 100
        score = max(0.0, min(100.0, round(score, 1)))

    return PlantSuitabilityResult(
        plant=plant,
        is_suitable=is_suitable,
        score=score,
        sunlight_passed=sunlight_passed,
        garden_type_passed=garden_type_passed,
        zone_passed=zone_passed,
        space_passed=space_passed,
        max_count_in_space=max_count,
        disqualification_reasons=disqualifications,
        positive_factors=positives,
    )


def recommend_garden_plan(
    user_input: UserGardenInput,
    max_distinct_crops: int = 5
) -> GardenPlanRecommendation:
    """
    Evaluates all crops in knowledge base, filters by deterministic rules,
    sorts by suitability score, calculates companion synergies, and allocates space.
    """
    all_plants = get_all_plants()
    evaluations = [evaluate_single_plant(p, user_input) for p in all_plants]

    suitable = [e for e in evaluations if e.is_suitable]
    unsuitable = [e for e in evaluations if not e.is_suitable]

    # Sort suitable plants by score descending
    suitable.sort(key=lambda x: x.score, reverse=True)

    # Select top crops up to max_distinct_crops
    selected_evals = suitable[:max_distinct_crops]
    selected_ids = {e.plant.id for e in selected_evals}

    # Detect companion synergies and warnings among selected crops
    synergies: List[str] = []
    warnings: List[str] = []

    for ev in selected_evals:
        p = ev.plant
        # Check verified companions
        for comp_id in p.verified_companions:
            if comp_id in selected_ids:
                comp_plant = get_plant_by_id(comp_id)
                comp_name = comp_plant.common_name if comp_plant else comp_id
                pair_msg = f"{p.common_name} + {comp_name} benefit each other (natural pest deterrence or root zoning)."
                if pair_msg not in synergies:
                    synergies.append(pair_msg)

        # Check incompatible neighbors
        for inc_id in p.incompatible_neighbors:
            if inc_id in selected_ids:
                inc_plant = get_plant_by_id(inc_id)
                inc_name = inc_plant.common_name if inc_plant else inc_id
                warn_msg = f"Caution: Keep {p.common_name} and {inc_name} in separate beds/containers (antagonistic root exudates or vigor mismatch)."
                if warn_msg not in warnings:
                    warnings.append(warn_msg)

    # Deterministic Space Allocation Algorithm
    # Allocate at least 1 specimen of each top crop, then distribute remaining space
    allocated: Dict[str, int] = {}
    remaining_space = user_input.space_sq_ft

    if selected_evals:
        # Pass 1: Allocate 1 unit of each selected crop if space allows
        for ev in selected_evals:
            p = ev.plant
            if remaining_space >= p.min_space_sq_ft:
                allocated[p.id] = 1
                remaining_space -= p.min_space_sq_ft
            else:
                allocated[p.id] = 0

        # Pass 2: Greedily allocate remaining space to highest scoring crops
        for ev in selected_evals:
            p = ev.plant
            if remaining_space < p.min_space_sq_ft:
                continue
            # Allow up to 3 more or whatever fits
            extra_fits = int(remaining_space // p.min_space_sq_ft)
            add_count = min(extra_fits, 4)
            if add_count > 0:
                allocated[p.id] += add_count
                remaining_space -= add_count * p.min_space_sq_ft

    total_used = user_input.space_sq_ft - remaining_space
    utilization = round((total_used / user_input.space_sq_ft) * 100.0, 1) if user_input.space_sq_ft > 0 else 0.0

    return GardenPlanRecommendation(
        user_input=user_input,
        suitable_plants=suitable,
        unsuitable_plants=unsuitable,
        allocated_plants={k: v for k, v in allocated.items() if v > 0},
        total_space_used_sq_ft=round(total_used, 2),
        space_utilization_pct=utilization,
        companion_synergies=synergies,
        companion_warnings=warnings,
    )
