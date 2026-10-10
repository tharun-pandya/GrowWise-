"""
Unit tests for growwise.ai_engine
Tests offline grounded synthesis, context formatting, and error handling.
"""

import unittest
from growwise.knowledge_base import GardenType
from growwise.rules import UserGardenInput, recommend_garden_plan
from growwise.ai_engine import (
    build_grounded_garden_context,
    offline_grounded_explanation,
    offline_grounded_checklist,
    generate_garden_explanation,
    generate_weekly_checklist,
    check_ollama_status,
)


class TestAiEngine(unittest.TestCase):
    def setUp(self):
        self.user_input = UserGardenInput(
            location_name="Portland Patio",
            hardiness_zone=8,
            garden_type=GardenType.CONTAINER,
            sunlight_hours=7.0,
            space_sq_ft=12.0,
            preferred_plant_ids=["sweet_basil", "cherry_tomato"],
        )
        self.plan = recommend_garden_plan(self.user_input)

    def test_build_grounded_context(self):
        ctx = build_grounded_garden_context(self.plan)
        self.assertIn("Portland Patio", ctx)
        self.assertIn("Sweet Basil", ctx)
        self.assertIn("VERIFIED GARDEN PARAMETERS", ctx)

    def test_offline_grounded_explanation(self):
        text = offline_grounded_explanation(self.plan)
        self.assertIn("Horticultural Rationale", text)
        self.assertIn("Sweet Basil", text)
        self.assertIn("12.0 sq ft", text)

    def test_offline_grounded_checklist(self):
        checklist = offline_grounded_checklist(self.plan, weeks=4)
        self.assertIn("Week 1", checklist)
        self.assertIn("Week 2", checklist)
        self.assertIn("Week 3", checklist)
        self.assertIn("Week 4", checklist)
        self.assertIn("- [ ]", checklist)

    def test_generate_garden_explanation_fallback(self):
        # Force offline provider to verify deterministic fallback
        text, engine = generate_garden_explanation(self.plan, provider="offline")
        self.assertIn("Offline Grounded", engine)
        self.assertIn("Sweet Basil", text)

    def test_check_ollama_inactive(self):
        # Local non-existent port should return gracefully without crashing
        is_up, msg, models = check_ollama_status("http://127.0.0.1:59999")
        self.assertFalse(is_up)
        self.assertIsInstance(msg, str)
        self.assertEqual(models, [])


if __name__ == "__main__":
    unittest.main()
