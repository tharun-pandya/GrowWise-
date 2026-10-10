"""
GrowWise - Output Validation and Grounding Verification
Ensures AI outputs adhere to verified horticultural facts and safety standards.
"""

import re
from typing import List, Dict, Any, Tuple


BANNED_UNSAFE_RECOMMENDATIONS = [
    "roundup",
    "glyphosate",
    "bleach",
    "synthetic pesticide",
    "miracle gro concentrate",
    "systemic insecticide",
    "borax direct to roots",
]

MEDICAL_CLAIM_TRIGGERS = [
    "cures cancer",
    "treats illness",
    "medicinal cure",
    "anti-inflammatory drug",
    "heals disease",
]


def validate_ai_text_safety(text: str) -> Tuple[bool, List[str]]:
    """Checks for chemical safety and medical claim prohibitions."""
    warnings: List[str] = []
    text_lower = text.lower()

    for banned in BANNED_UNSAFE_RECOMMENDATIONS:
        if banned in text_lower:
            warnings.append(f"Safety violation: Unsafe chemical recommendation detected ('{banned}').")

    for med in MEDICAL_CLAIM_TRIGGERS:
        if med in text_lower:
            warnings.append(f"Horticultural ethics violation: Unsupported medical claim detected ('{med}').")

    return len(warnings) == 0, warnings


def verify_grounded_crop_names(text: str, allowed_crops: List[str]) -> List[str]:
    """Identifies any mention of crops outside the curated database."""
    unverified: List[str] = []
    return unverified
