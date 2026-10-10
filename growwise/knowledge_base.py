"""
GrowWise Knowledge Base Module
Contains verified, ground-truth horticultural data from USDA Extension and RHS.
Zero external dependencies; uses Python standard library dataclasses.
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional
from enum import Enum


class SunlightLevel(str, Enum):
    FULL_SUN = "full_sun"           # 6+ hours direct sunlight
    PARTIAL_SUN = "partial_sun"     # 3-6 hours direct sunlight
    FULL_SHADE = "full_shade"       # < 3 hours direct sunlight


class GardenType(str, Enum):
    CONTAINER = "container"         # Pots, planters, windowboxes
    RAISED_BED = "raised_bed"       # Elevated garden beds
    IN_GROUND = "in_ground"         # Direct backyard / plot soil
    WINDOWSILL = "windowsill"       # Indoor or sill containers
    GREENHOUSE = "greenhouse"       # Controlled glass/polyhouse


class PlantCategory(str, Enum):
    HERB = "herb"
    LEAFY_GREEN = "leafy_green"
    FRUITING = "fruiting"
    ROOT = "root"
    LEGUME = "legume"
    FLOWER = "flower"


@dataclass(frozen=True)
class PlantProfile:
    id: str
    common_name: str
    botanical_name: str
    category: PlantCategory
    min_sunlight_hours: float
    sunlight_levels: List[SunlightLevel]
    compatible_garden_types: List[GardenType]
    min_space_sq_ft: float
    min_container_depth_inches: int
    hardiness_zones: List[int]       # USDA Hardiness zones (e.g. [3, 4, 5, 6, 7, 8, 9, 10])
    watering_need: str               # "low", "moderate", "high"
    days_to_maturity: int
    difficulty: str                  # "beginner", "intermediate", "advanced"
    verified_companions: List[str]
    incompatible_neighbors: List[str]
    soil_preference: str
    source_citation: str
    care_summary: str
    weekly_care_schedule: Dict[int, str]


# Ground-truth verified crop database (USDA Cooperative Extension & Royal Horticultural Society)
PLANT_DATABASE: Dict[str, PlantProfile] = {
    "sweet_basil": PlantProfile(
        id="sweet_basil",
        common_name="Sweet Basil",
        botanical_name="Ocimum basilicum",
        category=PlantCategory.HERB,
        min_sunlight_hours=6.0,
        sunlight_levels=[SunlightLevel.FULL_SUN],
        compatible_garden_types=[
            GardenType.CONTAINER,
            GardenType.RAISED_BED,
            GardenType.IN_GROUND,
            GardenType.WINDOWSILL,
        ],
        min_space_sq_ft=1.0,
        min_container_depth_inches=8,
        hardiness_zones=[4, 5, 6, 7, 8, 9, 10],
        watering_need="moderate",
        days_to_maturity=60,
        difficulty="beginner",
        verified_companions=["cherry_tomato", "bell_pepper"],
        incompatible_neighbors=["peppermint"],
        soil_preference="Rich, moist, well-draining soil with pH 6.0-7.0",
        source_citation="USDA Extension / RHS Plant Bulletin #H-24",
        care_summary="Needs warm air (>60°F/15°C) and consistent moisture. Water at base to avoid leaf fungal spots.",
        weekly_care_schedule={
            1: "Sow seeds 1/4-inch deep or plant transplants in warm potting mix.",
            2: "Keep soil lightly moist; ensure 6+ hours of direct sunny exposure.",
            3: "Pinch top center stem once plant is 6 inches tall to encourage bushy branching.",
            4: "Harvest outer leaves frequently; promptly pinch off any flowering spikes.",
        },
    ),
    "cherry_tomato": PlantProfile(
        id="cherry_tomato",
        common_name="Cherry Tomato",
        botanical_name="Solanum lycopersicum var. cerasiforme",
        category=PlantCategory.FRUITING,
        min_sunlight_hours=6.5,
        sunlight_levels=[SunlightLevel.FULL_SUN],
        compatible_garden_types=[
            GardenType.CONTAINER,
            GardenType.RAISED_BED,
            GardenType.IN_GROUND,
            GardenType.GREENHOUSE,
        ],
        min_space_sq_ft=3.0,
        min_container_depth_inches=14,  # Needs at least 5-gallon container
        hardiness_zones=[4, 5, 6, 7, 8, 9, 10, 11],
        watering_need="high",
        days_to_maturity=65,
        difficulty="intermediate",
        verified_companions=["sweet_basil", "french_marigold", "butterhead_lettuce"],
        incompatible_neighbors=["danvers_carrot"],
        soil_preference="Deep, fertile, well-drained loam high in organic matter, pH 6.2-6.8",
        source_citation="Texas A&M AgriLife Extension / Cornell Garden Guides",
        care_summary="Heavy feeder needing 6+ hours full sun and sturdy support stakes or tomato cage.",
        weekly_care_schedule={
            1: "Transplant deep (bury up to top leaves) in 5-gallon+ container or bed; insert stake immediately.",
            2: "Water deeply and evenly at base; apply 2-inch organic straw mulch around base.",
            3: "Prune bottom suckers (side shoots in leaf axils) below first flower cluster.",
            4: "Inspect for hornworms and blossom end rot; side-dress with organic balanced fertilizer.",
        },
    ),
    "butterhead_lettuce": PlantProfile(
        id="butterhead_lettuce",
        common_name="Butterhead Lettuce",
        botanical_name="Lactuca sativa var. capitata",
        category=PlantCategory.LEAFY_GREEN,
        min_sunlight_hours=4.0,
        sunlight_levels=[SunlightLevel.PARTIAL_SUN, SunlightLevel.FULL_SUN],
        compatible_garden_types=[
            GardenType.CONTAINER,
            GardenType.RAISED_BED,
            GardenType.IN_GROUND,
            GardenType.WINDOWSILL,
        ],
        min_space_sq_ft=0.75,
        min_container_depth_inches=6,
        hardiness_zones=[3, 4, 5, 6, 7, 8, 9, 10],
        watering_need="moderate",
        days_to_maturity=48,
        difficulty="beginner",
        verified_companions=["french_radish", "danvers_carrot", "cherry_tomato"],
        incompatible_neighbors=[],
        soil_preference="Cool, loose, moisture-retentive loam with good drainage, pH 6.0-7.0",
        source_citation="Penn State Extension Cool-Season Vegetable Guide",
        care_summary="Shallow roots; thrives in partial sun or cool spring/autumn weather; prone to bolting in extreme heat.",
        weekly_care_schedule={
            1: "Scatter seeds thinly (1/8 inch deep) or space transplants 8 inches apart.",
            2: "Thin crowded seedlings to 6-8 inches apart; keep shallow root zone moist.",
            3: "Shield from intense afternoon sun if temperatures exceed 75°F (24°C).",
            4: "Begin 'cut-and-come-again' harvest of tender outer leaves.",
        },
    ),
    "spinach": PlantProfile(
        id="spinach",
        common_name="Baby Spinach",
        botanical_name="Spinacia oleracea",
        category=PlantCategory.LEAFY_GREEN,
        min_sunlight_hours=3.0,
        sunlight_levels=[SunlightLevel.PARTIAL_SUN, SunlightLevel.FULL_SHADE],
        compatible_garden_types=[
            GardenType.CONTAINER,
            GardenType.RAISED_BED,
            GardenType.IN_GROUND,
            GardenType.WINDOWSILL,
        ],
        min_space_sq_ft=0.5,
        min_container_depth_inches=6,
        hardiness_zones=[2, 3, 4, 5, 6, 7, 8, 9],
        watering_need="moderate",
        days_to_maturity=40,
        difficulty="beginner",
        verified_companions=["alpine_strawberry", "french_radish"],
        incompatible_neighbors=[],
        soil_preference="Humus-rich, neutral to slightly alkaline soil (pH 6.5-7.5)",
        source_citation="University of Minnesota Extension Yard & Garden",
        care_summary="Exceptional cool-weather crop. Tolerates partial shade and frost down to 20°F (-6°C).",
        weekly_care_schedule={
            1: "Direct-seed 1/2-inch deep in cool soil; water gently with a fine rose spray.",
            2: "Thin seedlings to 3-4 inches apart; eat the thinnings as microgreens.",
            3: "Maintain cool soil temperature with a light layer of leaf mold or straw.",
            4: "Harvest outer mature leaves to allow inner rosette leaves to continue growing.",
        },
    ),
    "peppermint": PlantProfile(
        id="peppermint",
        common_name="Peppermint",
        botanical_name="Mentha × piperita",
        category=PlantCategory.HERB,
        min_sunlight_hours=3.5,
        sunlight_levels=[SunlightLevel.PARTIAL_SUN, SunlightLevel.FULL_SUN],
        compatible_garden_types=[
            GardenType.CONTAINER,
            GardenType.WINDOWSILL,
        ],  # Disallowed in open ground to prevent aggressive invasiveness
        min_space_sq_ft=1.0,
        min_container_depth_inches=8,
        hardiness_zones=[3, 4, 5, 6, 7, 8, 9, 10, 11],
        watering_need="high",
        days_to_maturity=60,
        difficulty="beginner",
        verified_companions=[],
        incompatible_neighbors=["sweet_basil"],
        soil_preference="Moist, fertile, rich potting compost",
        source_citation="RHS Herb Cultivation Guide & UC Davis IPM",
        care_summary="VERY aggressive spreader via underground stolons. Always grow in a dedicated container to avoid garden takeover.",
        weekly_care_schedule={
            1: "Plant runner or division into dedicated pot with drainage hole.",
            2: "Keep soil consistently damp; peppermint thrives near moist container margins.",
            3: "Snip runner tips to promote dense bushy leaf growth instead of long vines.",
            4: "Harvest fresh sprigs for tea; never plant directly in garden soil.",
        },
    ),
    "french_radish": PlantProfile(
        id="french_radish",
        common_name="French Breakfast Radish",
        botanical_name="Raphanus sativus",
        category=PlantCategory.ROOT,
        min_sunlight_hours=4.5,
        sunlight_levels=[SunlightLevel.PARTIAL_SUN, SunlightLevel.FULL_SUN],
        compatible_garden_types=[
            GardenType.CONTAINER,
            GardenType.RAISED_BED,
            GardenType.IN_GROUND,
            GardenType.WINDOWSILL,
        ],
        min_space_sq_ft=0.2,
        min_container_depth_inches=6,
        hardiness_zones=[2, 3, 4, 5, 6, 7, 8, 9, 10],
        watering_need="moderate",
        days_to_maturity=25,
        difficulty="beginner",
        verified_companions=["butterhead_lettuce", "spinach", "bush_bean"],
        incompatible_neighbors=[],
        soil_preference="Loose, sandy loam free of debris, pH 6.0-7.0",
        source_citation="Purdue Extension Fast-Crop Fact Sheet",
        care_summary="Ultra-fast harvest (under 4 weeks). Essential companion for breaking up surface crust for slower crops.",
        weekly_care_schedule={
            1: "Sow seeds 1/2 inch deep and 1 inch apart in fine, rock-free soil.",
            2: "Thin rigorously to 2 inches apart—failure to thin prevents root bulbing.",
            3: "Keep moisture uniform; sporadic watering causes woody texture and split skins.",
            4: "Harvest crisp roots when shoulders emerge approx 1-inch thick at soil line.",
        },
    ),
    "bell_pepper": PlantProfile(
        id="bell_pepper",
        common_name="Bell Pepper",
        botanical_name="Capsicum annuum",
        category=PlantCategory.FRUITING,
        min_sunlight_hours=6.5,
        sunlight_levels=[SunlightLevel.FULL_SUN],
        compatible_garden_types=[
            GardenType.CONTAINER,
            GardenType.RAISED_BED,
            GardenType.IN_GROUND,
            GardenType.GREENHOUSE,
        ],
        min_space_sq_ft=2.0,
        min_container_depth_inches=12,
        hardiness_zones=[4, 5, 6, 7, 8, 9, 10, 11],
        watering_need="moderate",
        days_to_maturity=75,
        difficulty="intermediate",
        verified_companions=["sweet_basil", "french_marigold"],
        incompatible_neighbors=[],
        soil_preference="Warm, well-aerated, fertile loam, pH 6.2-7.0",
        source_citation="University of Florida IFAS Extension",
        care_summary="Requires soil temperatures >65°F (18°C). Sensitive to cool spring breezes and prolonged wet roots.",
        weekly_care_schedule={
            1: "Set out sturdy transplants only after nighttime temperatures exceed 55°F (13°C).",
            2: "Provide light stake support for fruit load; keep moisture consistent.",
            3: "Feed with balanced organic compost tea when first flowers form.",
            4: "Harvest firm green peppers early or leave on vine to ripen to sweet red/yellow.",
        },
    ),
    "danvers_carrot": PlantProfile(
        id="danvers_carrot",
        common_name="Danvers Half-Long Carrot",
        botanical_name="Daucus carota subsp. sativus",
        category=PlantCategory.ROOT,
        min_sunlight_hours=6.0,
        sunlight_levels=[SunlightLevel.FULL_SUN],
        compatible_garden_types=[
            GardenType.CONTAINER,
            GardenType.RAISED_BED,
            GardenType.IN_GROUND,
        ],
        min_space_sq_ft=0.25,
        min_container_depth_inches=10,  # Requires deep loose soil
        hardiness_zones=[3, 4, 5, 6, 7, 8, 9, 10],
        watering_need="moderate",
        days_to_maturity=72,
        difficulty="intermediate",
        verified_companions=["rosemary", "butterhead_lettuce"],
        incompatible_neighbors=["cherry_tomato"],
        soil_preference="Deep, sandy, pebble-free loam; avoids fresh manure to prevent root splitting",
        source_citation="Oregon State University Extension Service",
        care_summary="Requires stones and heavy clay to be sifted out; compact soil causes bifurcated roots.",
        weekly_care_schedule={
            1: "Sow seeds 1/4 inch deep in deeply loosened soil; keep seedbed continuously moist.",
            2: "Gently weed by hand; carrot seedlings are delicate and emerge slowly (10-14 days).",
            3: "Thin seedlings to 2-3 inches apart using small scissors to avoid root disturbance.",
            4: "Hill up a little loose soil around crowns to prevent green shoulders from sun exposure.",
        },
    ),
    "bush_bean": PlantProfile(
        id="bush_bean",
        common_name="Provider Bush Green Bean",
        botanical_name="Phaseolus vulgaris",
        category=PlantCategory.LEGUME,
        min_sunlight_hours=6.0,
        sunlight_levels=[SunlightLevel.FULL_SUN],
        compatible_garden_types=[
            GardenType.CONTAINER,
            GardenType.RAISED_BED,
            GardenType.IN_GROUND,
        ],
        min_space_sq_ft=1.0,
        min_container_depth_inches=8,
        hardiness_zones=[3, 4, 5, 6, 7, 8, 9, 10],
        watering_need="moderate",
        days_to_maturity=52,
        difficulty="beginner",
        verified_companions=["french_radish", "rosemary"],
        incompatible_neighbors=[],
        soil_preference="Well-drained loam, pH 6.0-6.8; does not need synthetic nitrogen",
        source_citation="Iowa State University Extension and Outreach",
        care_summary="Self-supporting bush habit (no trellising required). Fixes atmospheric nitrogen through root nodules.",
        weekly_care_schedule={
            1: "Direct-sow seeds 1 inch deep in warm soil (minimum 60°F/15°C); do not pre-soak.",
            2: "Cultivate shallowly around stems to suppress weeds without harming surface feeder roots.",
            3: "Ensure 1 inch of water per week while flowers blossom.",
            4: "Pick slender pods daily to stimulate continuous blossom and pod production.",
        },
    ),
    "rosemary": PlantProfile(
        id="rosemary",
        common_name="Tuscan Rosemary",
        botanical_name="Salvia rosmarinus",
        category=PlantCategory.HERB,
        min_sunlight_hours=6.5,
        sunlight_levels=[SunlightLevel.FULL_SUN],
        compatible_garden_types=[
            GardenType.CONTAINER,
            GardenType.RAISED_BED,
            GardenType.IN_GROUND,
            GardenType.WINDOWSILL,
        ],
        min_space_sq_ft=2.0,
        min_container_depth_inches=10,
        hardiness_zones=[7, 8, 9, 10],  # Perennial in mild zones; container indoor overwinter in cold
        watering_need="low",
        days_to_maturity=85,
        difficulty="beginner",
        verified_companions=["danvers_carrot", "bush_bean"],
        incompatible_neighbors=[],
        soil_preference="Gritty, sharply drained sandy soil, pH 6.5-7.5; very susceptible to root rot in soggy soil",
        source_citation="RHS Award of Garden Merit & Clemson Cooperative Extension",
        care_summary="Mediterranean evergreen shrub. Thrives on dry periods between waterings and intense sunlight.",
        weekly_care_schedule={
            1: "Plant rooted cutting in sandy potting mix with 20% coarse perlite or grit.",
            2: "Place in sunniest position; allow top 2 inches of soil to dry completely before watering.",
            3: "Snip 2-inch branch tips to maintain compact structural growth.",
            4: "Avoid high-nitrogen fertilizers which weaken essential oil concentration and aroma.",
        },
    ),
    "alpine_strawberry": PlantProfile(
        id="alpine_strawberry",
        common_name="Alpine Strawberry",
        botanical_name="Fragaria vesca",
        category=PlantCategory.FRUITING,
        min_sunlight_hours=5.0,
        sunlight_levels=[SunlightLevel.PARTIAL_SUN, SunlightLevel.FULL_SUN],
        compatible_garden_types=[
            GardenType.CONTAINER,
            GardenType.RAISED_BED,
            GardenType.IN_GROUND,
            GardenType.WINDOWSILL,
        ],
        min_space_sq_ft=1.0,
        min_container_depth_inches=8,
        hardiness_zones=[4, 5, 6, 7, 8, 9],
        watering_need="moderate",
        days_to_maturity=80,
        difficulty="intermediate",
        verified_companions=["spinach", "butterhead_lettuce"],
        incompatible_neighbors=[],
        soil_preference="Rich, slightly acidic, moisture-retentive loam with leaf compost, pH 5.8-6.5",
        source_citation="Cornell University Berry Diagnostic Guide",
        care_summary="Clump-forming (does not send out wild aggressive runners like commercial hybrids); ideal for patio pots.",
        weekly_care_schedule={
            1: "Plant crown exactly level with soil surface—never bury the central growing crown.",
            2: "Mulch with clean straw or cocoa shells to keep maturing berries off damp soil.",
            3: "Monitor soil moisture; strawberry fruit yields drop sharply if allowed to dry out.",
            4: "Harvest intensely aromatic miniature fruits when deep red and tender.",
        },
    ),
    "french_marigold": PlantProfile(
        id="french_marigold",
        common_name="French Marigold",
        botanical_name="Tagetes patula",
        category=PlantCategory.FLOWER,
        min_sunlight_hours=6.0,
        sunlight_levels=[SunlightLevel.FULL_SUN],
        compatible_garden_types=[
            GardenType.CONTAINER,
            GardenType.RAISED_BED,
            GardenType.IN_GROUND,
            GardenType.WINDOWSILL,
        ],
        min_space_sq_ft=0.75,
        min_container_depth_inches=6,
        hardiness_zones=[2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        watering_need="low",
        days_to_maturity=50,
        difficulty="beginner",
        verified_companions=["cherry_tomato", "bell_pepper"],
        incompatible_neighbors=[],
        soil_preference="Average, well-draining garden soil, pH 6.0-7.5",
        source_citation="NC State University Extension Pollinator & Trap Crop Guide",
        care_summary="Essential organic companion plant; roots produce alpha-terthienyl which suppresses root-knot nematodes.",
        weekly_care_schedule={
            1: "Transplant seedlings alongside tomatoes or peppers 8 inches apart.",
            2: "Provide full sun; water moderately until root system establishes.",
            3: "Deadhead spent flower blooms weekly to induce continuous flowering flushes.",
            4: "Enjoy prolific blooms that attract syrphid flies, bees, and predatory beneficial insects.",
        },
    ),
}


def get_all_plants() -> List[PlantProfile]:
    """Returns the full list of verified plant profiles."""
    return list(PLANT_DATABASE.values())


def get_plant_by_id(plant_id: str) -> Optional[PlantProfile]:
    """Retrieve a single plant profile by its unique ID."""
    return PLANT_DATABASE.get(plant_id)


def get_categories() -> List[str]:
    """Returns all available plant categories."""
    return [c.value for c in PlantCategory]
