"""
Unit tests for growwise.rules
Tests deterministic suitability logic, companion synergies, and space calculations.
"""

import unittest
from growwise.knowledge_base import GardenType, PlantCategory, get_plant_by_id
from growwise.rules import (
    UserGardenInput,
    evaluate_single_plant,
    recommend_garden_plan,
)


class TestRulesEngine(unittest.TestCase):
    def test_sunlight_disqualification(self):
        # 3.0 hours sun - shade condition
        low_sun_input = UserGardenInput(
            location_name="Shady Balcony",
            hardiness_zone=6,
            garden_type=GardenType.CONTAINER,
            sunlight_hours=3.0,
            space_sq_ft=15.0,
        )

        basil = get_plant_by_id("sweet_basil")
        tomato = get_plant_by_id("cherry_tomato")
        spinach = get_plant_by_id("spinach")

        eval_basil = evaluate_single_plant(basil, low_sun_input)
        eval_tomato = evaluate_single_plant(tomato, low_sun_input)
        eval_spinach = evaluate_single_plant(spinach, low_sun_input)

        self.assertFalse(eval_basil.is_suitable, "Basil must fail under 3.0 hrs sun")
        self.assertFalse(eval_tomato.is_suitable, "Tomato must fail under 3.0 hrs sun")
        self.assertTrue(eval_spinach.is_suitable, "Spinach must pass under 3.0-3.5 hrs sun tolerance")
        self.assertTrue(any("sun" in r.lower() for r in eval_basil.disqualification_reasons))

    def test_garden_type_restriction(self):
        # In-ground garden should reject peppermint to avoid invasive spread
        in_ground_input = UserGardenInput(
            location_name="Open Plot",
            hardiness_zone=6,
            garden_type=GardenType.IN_GROUND,
            sunlight_hours=7.0,
            space_sq_ft=50.0,
        )
        peppermint = get_plant_by_id("peppermint")
        eval_mint = evaluate_single_plant(peppermint, in_ground_input)

        self.assertFalse(eval_mint.is_suitable)
        self.assertFalse(eval_mint.garden_type_passed)
        self.assertTrue(any("in_ground" in r for r in eval_mint.disqualification_reasons))

    def test_zone_rejection(self):
        # Extreme cold: Zone 2
        cold_input = UserGardenInput(
            location_name="North Alaska",
            hardiness_zone=2,
            garden_type=GardenType.CONTAINER,
            sunlight_hours=8.0,
            space_sq_ft=10.0,
        )
        rosemary = get_plant_by_id("rosemary")  # Zones 7-10
        eval_rosemary = evaluate_single_plant(rosemary, cold_input)
        self.assertFalse(eval_rosemary.is_suitable)
        self.assertFalse(eval_rosemary.zone_passed)

    def test_space_allocation_does_not_exceed_boundary(self):
        space = 6.0
        garden_input = UserGardenInput(
            location_name="Small Patio",
            hardiness_zone=7,
            garden_type=GardenType.CONTAINER,
            sunlight_hours=7.0,
            space_sq_ft=space,
        )
        plan = recommend_garden_plan(garden_input, max_distinct_crops=4)

        self.assertLessEqual(plan.total_space_used_sq_ft, space)
        self.assertGreater(len(plan.allocated_plants), 0)

    def test_companion_synergy_detection(self):
        # Sunny large container garden should recommend basil and tomato together
        input_data = UserGardenInput(
            location_name="Sunny Deck",
            hardiness_zone=7,
            garden_type=GardenType.CONTAINER,
            sunlight_hours=8.0,
            space_sq_ft=20.0,
            preferred_plant_ids=["sweet_basil", "cherry_tomato"],
        )
        plan = recommend_garden_plan(input_data)
        # Should detect synergy between basil and tomato
        synergy_found = any(
            "Sweet Basil" in s and "Cherry Tomato" in s
            for s in plan.companion_synergies
        )
        self.assertTrue(synergy_found, "Expected companion synergy between Basil and Tomato")


if __name__ == "__main__":
    unittest.main()
