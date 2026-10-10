"""
Unit tests for growwise.knowledge_base
Standard library unittest - zero external dependencies.
"""

import unittest
from growwise.knowledge_base import (
    PLANT_DATABASE,
    get_all_plants,
    get_plant_by_id,
    SunlightLevel,
    GardenType,
    PlantCategory,
)


class TestKnowledgeBase(unittest.TestCase):
    def test_database_not_empty(self):
        plants = get_all_plants()
        self.assertGreaterEqual(len(plants), 10, "Knowledge base should have at least 10 verified crops")

    def test_all_plants_have_botanical_and_citation(self):
        for plant in get_all_plants():
            self.assertTrue(plant.id, "Plant must have an ID")
            self.assertTrue(plant.common_name, f"{plant.id} must have common name")
            self.assertTrue(plant.botanical_name, f"{plant.id} must have botanical name")
            self.assertTrue(plant.source_citation, f"{plant.id} must cite verified extension/RHS data")
            self.assertGreater(plant.min_sunlight_hours, 0.0, f"{plant.id} must require > 0 hours sun")
            self.assertGreater(plant.min_space_sq_ft, 0.0, f"{plant.id} must require > 0 space")
            self.assertGreater(plant.min_container_depth_inches, 0)

    def test_weekly_care_schedule_completeness(self):
        for plant in get_all_plants():
            schedule = plant.weekly_care_schedule
            self.assertIn(1, schedule, f"{plant.id} missing week 1 care")
            self.assertIn(2, schedule, f"{plant.id} missing week 2 care")
            self.assertIn(3, schedule, f"{plant.id} missing week 3 care")
            self.assertIn(4, schedule, f"{plant.id} missing week 4 care")

    def test_peppermint_restricted_from_in_ground(self):
        # Peppermint is invasive and should be restricted to container/windowsill
        peppermint = get_plant_by_id("peppermint")
        self.assertIsNotNone(peppermint)
        self.assertNotIn(GardenType.IN_GROUND, peppermint.compatible_garden_types)
        self.assertIn(GardenType.CONTAINER, peppermint.compatible_garden_types)

    def test_query_by_id(self):
        basil = get_plant_by_id("sweet_basil")
        self.assertIsNotNone(basil)
        self.assertEqual(basil.common_name, "Sweet Basil")
        self.assertEqual(basil.category, PlantCategory.HERB)

        non_existent = get_plant_by_id("moon_plant_fake")
        self.assertIsNone(non_existent)


if __name__ == "__main__":
    unittest.main()
