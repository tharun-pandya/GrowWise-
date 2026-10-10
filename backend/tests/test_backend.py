"""
GrowWise Backend Unit Tests
Zero external dependencies; uses Python standard library unittest.
"""

import unittest
from backend.app.schemas import GardenProfile, GardenTypeEnum, SunlightEnum, ExperienceLevel
from backend.app.garden_engine import DeterministicGardenEngine, load_crops_data, load_sources_data
from backend.app.validators import validate_ai_text_safety
from backend.app.model_provider import OfflineGroundedSynthesizerProvider, OpenWeightGemmaProvider


class TestBackendEngine(unittest.TestCase):
    def setUp(self):
        self.engine = DeterministicGardenEngine()

    def test_crops_database_integrity(self):
        crops = load_crops_data()
        self.assertGreaterEqual(len(crops), 10, "Crops database should contain at least 10 verified plants.")
        for c in crops:
            self.assertTrue(c["id"])
            self.assertTrue(c["common_name"])
            self.assertTrue(c["botanical_name"])
            self.assertIn("sunlight", c)
            self.assertGreater(c["min_sunlight_hours"], 0)
            self.assertGreater(c["min_space_sq_ft"], 0)
            self.assertTrue(c["source_reference"])

    def test_sources_database_integrity(self):
        sources = load_sources_data()
        self.assertGreaterEqual(len(sources), 10, "Sources database should contain at least 10 references.")
        for s in sources:
            self.assertTrue(s["id"])
            self.assertTrue(s["organization"])
            self.assertTrue(s["title"])
            self.assertTrue(s["url"].startswith("http"))
            self.assertEqual(s["verification_status"], "verified")

    def test_garden_profile_validation(self):
        # Invalid: empty location
        p1 = GardenProfile(
            location="",
            garden_type=GardenTypeEnum.BALCONY,
            sunlight=SunlightEnum.FULL_SUN,
            growing_space_sq_ft=10.0,
        )
        errors = p1.validate_inputs()
        self.assertTrue(any("Location" in e for e in errors))

        # Invalid: zero space
        p2 = GardenProfile(
            location="Seattle",
            garden_type=GardenTypeEnum.BALCONY,
            sunlight=SunlightEnum.FULL_SUN,
            growing_space_sq_ft=0.0,
        )
        errors = p2.validate_inputs()
        self.assertTrue(any("space" in e.lower() for e in errors))

        # Valid profile
        p3 = GardenProfile(
            location="Denver, CO",
            garden_type=GardenTypeEnum.CONTAINER,
            sunlight=SunlightEnum.PARTIAL_SUN,
            growing_space_sq_ft=15.0,
        )
        self.assertEqual(len(p3.validate_inputs()), 0)

    def test_sunlight_exclusion_rule(self):
        # Shade balcony (<3 hrs sun)
        profile = GardenProfile(
            location="Portland, OR",
            garden_type=GardenTypeEnum.BALCONY,
            sunlight=SunlightEnum.SHADE,
            growing_space_sq_ft=12.0,
        )
        suitable, excluded = self.engine.evaluate_profile(profile)

        suitable_ids = [c.crop_id for c in suitable]
        excluded_ids = [c.crop_id for c in excluded]

        # Cherry tomato and sweet basil need full sun; must be excluded
        self.assertIn("cherry_tomato", excluded_ids)
        self.assertIn("sweet_basil", excluded_ids)
        # Spinach tolerates shade; must be suitable
        self.assertIn("baby_spinach", suitable_ids)

    def test_invasive_peppermint_inground_exclusion(self):
        # Backyard in-ground garden
        profile = GardenProfile(
            location="Austin, TX",
            garden_type=GardenTypeEnum.BACKYARD,
            sunlight=SunlightEnum.FULL_SUN,
            growing_space_sq_ft=50.0,
        )
        _, excluded = self.engine.evaluate_profile(profile)
        mint_eval = next((e for e in excluded if e.crop_id == "peppermint"), None)
        self.assertIsNotNone(mint_eval)
        self.assertTrue(any("rhizome" in r.lower() or "invasive" in r.lower() for r in mint_eval.reasons_excluded))

    def test_weekly_plan_outdoors_generation(self):
        profile = GardenProfile(
            location="Chicago, IL",
            garden_type=GardenTypeEnum.RAISED_BED,
            sunlight=SunlightEnum.FULL_SUN,
            growing_space_sq_ft=32.0,
        )
        suitable, _ = self.engine.evaluate_profile(profile)
        plan = self.engine.generate_grounded_plan(profile, suitable)

        self.assertGreater(len(plan.tasks), 0)
        self.assertGreater(plan.outdoor_minutes_goal, 0)
        # Verify tasks have safety notes and supplies
        for task in plan.tasks:
            self.assertTrue(task.safety_notes)
            self.assertGreater(len(task.required_supplies), 0)
            self.assertTrue(task.outdoor_activity)

    def test_offline_synthesizer_provider(self):
        profile = GardenProfile(
            location="Boston, MA",
            garden_type=GardenTypeEnum.CONTAINER,
            sunlight=SunlightEnum.FULL_SUN,
            growing_space_sq_ft=10.0,
        )
        suitable, _ = self.engine.evaluate_profile(profile)
        provider = OfflineGroundedSynthesizerProvider()
        res = provider.generate_explanation(profile, suitable)

        self.assertTrue(res.success)
        self.assertIn("Touch Grass", res.content)
        self.assertIn("Zero LLM Overhead", res.engine_used)

    def test_safety_validator_blocks_harmful_chemicals(self):
        unsafe_text = "Apply roundup and synthetic pesticide across the soil bed."
        is_safe, warnings = validate_ai_text_safety(unsafe_text)
        self.assertFalse(is_safe)
        self.assertGreater(len(warnings), 0)

        safe_text = "Mulch with clean straw and use gentle water from a watering can."
        is_safe, warnings = validate_ai_text_safety(safe_text)
        self.assertTrue(is_safe)
        self.assertEqual(len(warnings), 0)


if __name__ == "__main__":
    unittest.main()
