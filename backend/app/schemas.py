"""
GrowWise - Schemas and Data Models
Compatible with both Pydantic (FastAPI runtime) and Python standard dataclasses (zero-dependency testing).
"""

from typing import List, Dict, Optional, Any
from enum import Enum

try:
    from pydantic import BaseModel, Field
    HAS_PYDANTIC = True
except ImportError:
    HAS_PYDANTIC = False
    class BaseModel:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
        def dict(self) -> Dict[str, Any]:
            return self.__dict__
    def Field(default=None, **kwargs):
        return default


class GardenTypeEnum(str, Enum):
    BALCONY = "balcony"
    CONTAINER = "container"
    BACKYARD = "backyard"
    RAISED_BED = "raised_bed"
    INDOOR = "indoor"


class SunlightEnum(str, Enum):
    FULL_SUN = "full_sun"       # 6+ hours
    PARTIAL_SUN = "partial_sun" # 3-6 hours
    SHADE = "shade"             # < 3 hours


class ExperienceLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    EXPERIENCED = "experienced"


class GardenProfile(BaseModel):
    location: str
    garden_type: GardenTypeEnum
    sunlight: SunlightEnum
    growing_space_sq_ft: float
    preferred_categories: List[str] = []
    preferred_crop_ids: List[str] = []
    experience_level: ExperienceLevel = ExperienceLevel.BEGINNER
    weekly_hours_available: float = 2.0
    soil_type: Optional[str] = "potting_mix"
    water_access: Optional[str] = "watering_can"

    def validate_inputs(self) -> List[str]:
        """Deterministic input validation rules."""
        errors: List[str] = []
        if not self.location or len(self.location.strip()) < 2:
            errors.append("Location must be at least 2 characters long.")
        if self.growing_space_sq_ft <= 0:
            errors.append("Available growing space must be greater than 0 sq ft.")
        if self.growing_space_sq_ft > 5000:
            errors.append("For large acreage (>5000 sq ft), professional agricultural tools are recommended.")
        if self.weekly_hours_available < 0.25:
            errors.append("Available time must be at least 15 minutes (0.25 hours) per week.")
        return errors


class CropEvaluation(BaseModel):
    crop_id: str
    common_name: str
    botanical_name: str
    category: str
    is_suitable: bool
    suitability_score: float
    min_sunlight_hours: float
    min_space_sq_ft: float
    min_container_depth_inches: int
    watering_need: str
    days_to_maturity: int
    difficulty: str
    reasons_recommended: List[str] = []
    reasons_excluded: List[str] = []
    source_reference: str = ""


class GardeningTask(BaseModel):
    id: str
    week_number: int
    title: str
    description: str
    estimated_duration_minutes: int
    required_supplies: List[str] = []
    crop_name: str
    safety_notes: str
    outdoor_activity: bool = True
    completed: bool = False


class WeeklyPlan(BaseModel):
    location: str
    garden_type: str
    total_allocated_crops: List[str]
    tasks: List[GardeningTask]
    outdoor_minutes_goal: int
    companion_synergies: List[str] = []
    spacing_warnings: List[str] = []
    disclaimer: str = "Recommendations are grounded in agricultural extension guidelines. Adjust for local unexpected frost dates."
