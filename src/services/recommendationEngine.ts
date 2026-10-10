import { CropRecord, CropEvaluation, GardenProfileData, WeeklyPlanData, GardeningTaskItem } from '../types';

export const LOCAL_CROPS_DATABASE: CropRecord[] = [
  {
    id: 'sweet_basil',
    common_name: 'Sweet Basil',
    botanical_name: 'Ocimum basilicum',
    category: 'herb',
    sunlight: 'full_sun',
    min_sunlight_hours: 6.0,
    compatible_garden_types: ['container', 'raised_bed', 'backyard', 'balcony', 'indoor'],
    min_space_sq_ft: 1.0,
    min_container_depth_inches: 8,
    hardiness_zones: [4, 5, 6, 7, 8, 9, 10],
    watering_need: 'moderate',
    days_to_maturity: 60,
    difficulty: 'beginner',
    preferred_soils: ['loamy', 'potting_mix', 'sandy'],
    verified_companions: ['cherry_tomato', 'bell_pepper'],
    incompatible_neighbors: ['peppermint'],
    outdoor_suitability: 'Spring and Summer when nighttime temperatures exceed 10°C (50°F).',
    care_guidance: 'Pinch off terminal flower buds to promote bushy leaf growth. Water at root level to prevent fungal leaf spot.',
    known_constraints: 'Extremely frost-sensitive; leaves blacken below 5°C (41°F). Requires warm soil to germinate.',
    source_id: 'usda_ext_basil',
    source_reference: 'USDA Cooperative Extension / RHS Plant Guide #H-24',
  },
  {
    id: 'cherry_tomato',
    common_name: 'Cherry Tomato',
    botanical_name: 'Solanum lycopersicum var. cerasiforme',
    category: 'vegetable',
    sunlight: 'full_sun',
    min_sunlight_hours: 6.5,
    compatible_garden_types: ['container', 'raised_bed', 'backyard', 'balcony'],
    min_space_sq_ft: 3.0,
    min_container_depth_inches: 14,
    hardiness_zones: [4, 5, 6, 7, 8, 9, 10, 11],
    watering_need: 'high',
    days_to_maturity: 65,
    difficulty: 'intermediate',
    preferred_soils: ['loamy', 'potting_mix'],
    verified_companions: ['sweet_basil', 'french_marigold', 'butterhead_lettuce'],
    incompatible_neighbors: ['danvers_carrot'],
    outdoor_suitability: 'Late spring through early autumn; requires staking or tomato cages.',
    care_guidance: 'Provide consistent, deep watering at ground level to prevent blossom end rot and fruit splitting.',
    known_constraints: 'Cannot thrive in small indoor windowsills. Requires at least 5-gallon containers for balcony growth.',
    source_id: 'cornell_tomato',
    source_reference: 'Cornell University Cooperative Extension Vegetable Growing Guide',
  },
  {
    id: 'butterhead_lettuce',
    common_name: 'Butterhead Lettuce',
    botanical_name: 'Lactuca sativa var. capitata',
    category: 'vegetable',
    sunlight: 'partial_sun',
    min_sunlight_hours: 4.0,
    compatible_garden_types: ['container', 'raised_bed', 'backyard', 'balcony', 'indoor'],
    min_space_sq_ft: 0.75,
    min_container_depth_inches: 6,
    hardiness_zones: [3, 4, 5, 6, 7, 8, 9, 10],
    watering_need: 'moderate',
    days_to_maturity: 48,
    difficulty: 'beginner',
    preferred_soils: ['loamy', 'potting_mix', 'clay'],
    verified_companions: ['french_radish', 'danvers_carrot', 'cherry_tomato'],
    incompatible_neighbors: [],
    outdoor_suitability: 'Cool spring and autumn; tolerates light frost down to -2°C (28°F).',
    care_guidance: 'Harvest outer leaves continuously for cut-and-come-again yields. Keep topsoil cool with light mulch.',
    known_constraints: 'Bolts (turns bitter and produces flowers) when daytime temperatures stay above 25°C (77°F).',
    source_id: 'penn_state_lettuce',
    source_reference: 'Penn State Extension Cool-Season Salad Crops',
  },
  {
    id: 'baby_spinach',
    common_name: 'Baby Spinach',
    botanical_name: 'Spinacia oleracea',
    category: 'vegetable',
    sunlight: 'shade',
    min_sunlight_hours: 3.0,
    compatible_garden_types: ['container', 'raised_bed', 'backyard', 'balcony', 'indoor'],
    min_space_sq_ft: 0.5,
    min_container_depth_inches: 6,
    hardiness_zones: [2, 3, 4, 5, 6, 7, 8, 9],
    watering_need: 'moderate',
    days_to_maturity: 38,
    difficulty: 'beginner',
    preferred_soils: ['loamy', 'potting_mix', 'clay'],
    verified_companions: ['french_radish', 'alpine_strawberry'],
    incompatible_neighbors: [],
    outdoor_suitability: 'Early spring and late autumn crop. Highly cold-tolerant.',
    care_guidance: 'Keep soil evenly damp. Does exceptionally well in dappled sunlight or balcony shade.',
    known_constraints: 'Rapidly bolts during long summer days (>14 hours daylight) with heat.',
    source_id: 'umn_spinach',
    source_reference: 'University of Minnesota Extension Yard & Garden Guide',
  },
  {
    id: 'peppermint',
    common_name: 'Peppermint',
    botanical_name: 'Mentha × piperita',
    category: 'herb',
    sunlight: 'partial_sun',
    min_sunlight_hours: 3.5,
    compatible_garden_types: ['container', 'balcony', 'indoor'],
    min_space_sq_ft: 1.0,
    min_container_depth_inches: 8,
    hardiness_zones: [3, 4, 5, 6, 7, 8, 9, 10, 11],
    watering_need: 'high',
    days_to_maturity: 60,
    difficulty: 'beginner',
    preferred_soils: ['loamy', 'potting_mix'],
    verified_companions: [],
    incompatible_neighbors: ['sweet_basil'],
    outdoor_suitability: 'Spring through autumn; container-only outdoor culture.',
    care_guidance: 'Harvest fresh sprigs regularly to encourage dense side branches. Always provide ample drainage.',
    known_constraints: 'DISQUALIFIED FROM IN-GROUND BACKYARD: Spreads aggressively via underground rhizomes that overtake flowerbeds.',
    source_id: 'rhs_mint',
    source_reference: 'Royal Horticultural Society Herb Cultivation Practice',
  },
  {
    id: 'french_radish',
    common_name: 'French Breakfast Radish',
    botanical_name: 'Raphanus sativus',
    category: 'vegetable',
    sunlight: 'partial_sun',
    min_sunlight_hours: 4.5,
    compatible_garden_types: ['container', 'raised_bed', 'backyard', 'balcony', 'indoor'],
    min_space_sq_ft: 0.2,
    min_container_depth_inches: 6,
    hardiness_zones: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    watering_need: 'moderate',
    days_to_maturity: 25,
    difficulty: 'beginner',
    preferred_soils: ['sandy', 'loamy', 'potting_mix'],
    verified_companions: ['butterhead_lettuce', 'baby_spinach', 'bush_green_bean'],
    incompatible_neighbors: [],
    outdoor_suitability: 'Fast-growing cool-season crop; can be sown every 2 weeks for succession harvests.',
    care_guidance: 'Thin seedlings early to 2 inches apart to allow crisp root bulbing. Keep watering steady.',
    known_constraints: 'Irregular watering leads to cracked, pithy, or overly pungent woody roots.',
    source_id: 'purdue_radish',
    source_reference: 'Purdue University Extension Fast-Season Vegetable Guide',
  },
  {
    id: 'bell_pepper',
    common_name: 'Bell Pepper',
    botanical_name: 'Capsicum annuum',
    category: 'vegetable',
    sunlight: 'full_sun',
    min_sunlight_hours: 6.5,
    compatible_garden_types: ['container', 'raised_bed', 'backyard', 'balcony'],
    min_space_sq_ft: 2.0,
    min_container_depth_inches: 12,
    hardiness_zones: [4, 5, 6, 7, 8, 9, 10, 11],
    watering_need: 'moderate',
    days_to_maturity: 75,
    difficulty: 'intermediate',
    preferred_soils: ['loamy', 'potting_mix'],
    verified_companions: ['sweet_basil', 'french_marigold'],
    incompatible_neighbors: [],
    outdoor_suitability: 'Warm summer season; plant outside only when soil temperature is above 18°C (65°F).',
    care_guidance: 'Support heavy fruiting branches with bamboo canes. Mulch to maintain root moisture.',
    known_constraints: 'Will drop blossoms if night temperatures dip below 13°C (55°F) or exceed 32°C (90°F).',
    source_id: 'uf_ifas_pepper',
    source_reference: 'University of Florida IFAS Extension Home Gardening Bulletin',
  },
  {
    id: 'danvers_carrot',
    common_name: 'Danvers Half-Long Carrot',
    botanical_name: 'Daucus carota subsp. sativus',
    category: 'vegetable',
    sunlight: 'full_sun',
    min_sunlight_hours: 6.0,
    compatible_garden_types: ['raised_bed', 'backyard', 'container'],
    min_space_sq_ft: 0.25,
    min_container_depth_inches: 10,
    hardiness_zones: [3, 4, 5, 6, 7, 8, 9, 10],
    watering_need: 'moderate',
    days_to_maturity: 72,
    difficulty: 'intermediate',
    preferred_soils: ['sandy', 'loamy'],
    verified_companions: ['rosemary', 'butterhead_lettuce'],
    incompatible_neighbors: ['cherry_tomato'],
    outdoor_suitability: 'Spring through autumn; sweetens significantly after light autumn frost.',
    care_guidance: 'Sow in loose, stone-free soil. Keep seedbed moist during slow 10-14 day germination.',
    known_constraints: 'Heavy rocky clay causes forked and stunted roots. Needs at least 10 inches soil depth.',
    source_id: 'osu_carrot',
    source_reference: 'Oregon State University Extension Service Gardening Series',
  },
  {
    id: 'bush_green_bean',
    common_name: 'Bush Green Bean',
    botanical_name: 'Phaseolus vulgaris',
    category: 'vegetable',
    sunlight: 'full_sun',
    min_sunlight_hours: 6.0,
    compatible_garden_types: ['raised_bed', 'backyard', 'container', 'balcony'],
    min_space_sq_ft: 1.0,
    min_container_depth_inches: 8,
    hardiness_zones: [3, 4, 5, 6, 7, 8, 9, 10],
    watering_need: 'moderate',
    days_to_maturity: 55,
    difficulty: 'beginner',
    preferred_soils: ['loamy', 'potting_mix', 'sandy'],
    verified_companions: ['french_radish', 'rosemary'],
    incompatible_neighbors: [],
    outdoor_suitability: 'Late spring and summer; direct sow outdoors once danger of frost has passed.',
    care_guidance: 'Self-supporting compact bush (no trellis needed). Fixes atmospheric nitrogen in soil.',
    known_constraints: 'Seeds rot easily if sown in cold, waterlogged soil below 15°C (60°F).',
    source_id: 'isu_beans',
    source_reference: 'Iowa State University Extension and Outreach Vegetable Crops',
  },
  {
    id: 'rosemary',
    common_name: 'Tuscan Rosemary',
    botanical_name: 'Salvia rosmarinus',
    category: 'herb',
    sunlight: 'full_sun',
    min_sunlight_hours: 6.5,
    compatible_garden_types: ['container', 'raised_bed', 'backyard', 'balcony', 'indoor'],
    min_space_sq_ft: 2.0,
    min_container_depth_inches: 10,
    hardiness_zones: [7, 8, 9, 10],
    watering_need: 'low',
    days_to_maturity: 85,
    difficulty: 'beginner',
    preferred_soils: ['sandy', 'potting_mix'],
    verified_companions: ['danvers_carrot', 'bush_green_bean'],
    incompatible_neighbors: [],
    outdoor_suitability: 'Perennial shrub in mild winter climates (Zones 7+); bring containers indoors in frost zones.',
    care_guidance: 'Drought-tolerant once established. Allow upper 2 inches of soil to dry out between waterings.',
    known_constraints: 'Extremely vulnerable to root rot if potted in poorly draining or waterlogged soil.',
    source_id: 'clemson_rosemary',
    source_reference: 'Clemson University Cooperative Extension Home & Garden Information Center',
  },
  {
    id: 'alpine_strawberry',
    common_name: 'Alpine Strawberry',
    botanical_name: 'Fragaria vesca',
    category: 'fruit',
    sunlight: 'partial_sun',
    min_sunlight_hours: 5.0,
    compatible_garden_types: ['container', 'raised_bed', 'backyard', 'balcony', 'indoor'],
    min_space_sq_ft: 1.0,
    min_container_depth_inches: 8,
    hardiness_zones: [4, 5, 6, 7, 8, 9],
    watering_need: 'moderate',
    days_to_maturity: 80,
    difficulty: 'intermediate',
    preferred_soils: ['loamy', 'potting_mix'],
    verified_companions: ['baby_spinach', 'butterhead_lettuce'],
    incompatible_neighbors: [],
    outdoor_suitability: 'Spring through autumn; produces sweet miniature fruit continually without runners.',
    care_guidance: 'Plant with central crown level with soil surface. Mulch with straw to prevent berry rot.',
    known_constraints: 'Sensitive to drought; shallow roots dry quickly in small hanging baskets on hot days.',
    source_id: 'cornell_berry',
    source_reference: 'Cornell University Berry Diagnostic Tool & Fruit Guide',
  },
  {
    id: 'french_marigold',
    common_name: 'French Marigold',
    botanical_name: 'Tagetes patula',
    category: 'flower',
    sunlight: 'full_sun',
    min_sunlight_hours: 6.0,
    compatible_garden_types: ['container', 'raised_bed', 'backyard', 'balcony', 'indoor'],
    min_space_sq_ft: 0.75,
    min_container_depth_inches: 6,
    hardiness_zones: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    watering_need: 'low',
    days_to_maturity: 50,
    difficulty: 'beginner',
    preferred_soils: ['sandy', 'loamy', 'potting_mix', 'clay'],
    verified_companions: ['cherry_tomato', 'bell_pepper'],
    incompatible_neighbors: ['bush_green_bean'],
    outdoor_suitability: 'Spring to first autumn frost; attracts bees, hoverflies, and beneficial predatory insects.',
    care_guidance: 'Deadhead spent flower heads weekly to trigger continuous blossoming flushes.',
    known_constraints: 'Slugs and snails target young tender seedlings in early spring damp conditions.',
    source_id: 'ncsu_marigold',
    source_reference: 'North Carolina State University Extension Gardener Plant Toolbox',
  },
];

export function evaluateCropsDeterministically(
  profile: GardenProfileData,
  crops: CropRecord[] = LOCAL_CROPS_DATABASE
): { suitable: CropEvaluation[]; excluded: CropEvaluation[] } {
  const suitable: CropEvaluation[] = [];
  const excluded: CropEvaluation[] = [];

  const sunHoursMap = {
    full_sun: 7.0,
    partial_sun: 4.5,
    shade: 2.5,
  };
  const userSunHours = sunHoursMap[profile.sunlight] || 5.0;

  crops.forEach((crop) => {
    const reasonsPos: string[] = [];
    const reasonsNeg: string[] = [];

    // 1. Garden Type Check
    if (!crop.compatible_garden_types.includes(profile.gardenType)) {
      reasonsNeg.push(
        `Incompatible with ${profile.gardenType}. Requires: ${crop.compatible_garden_types.join(', ')}.`
      );
    } else {
      reasonsPos.push(`Well-adapted to ${profile.gardenType} setups.`);
    }

    // In-ground peppermint prohibition
    if (profile.gardenType === 'backyard' && crop.id === 'peppermint') {
      reasonsNeg.push('Excluded from in-ground plots: Peppermint root rhizomes spread aggressively and invade beds.');
    }

    // 2. Sunlight Check
    const minEffectiveSun = crop.sunlight === 'shade' ? crop.min_sunlight_hours - 0.5 : crop.min_sunlight_hours - 0.25;
    if (userSunHours < minEffectiveSun) {
      reasonsNeg.push(
        `Insufficient sunlight: Requires ${crop.min_sunlight_hours}h direct sun, but your space receives ${profile.sunlight} (~${userSunHours}h).`
      );
    } else {
      reasonsPos.push(`Meets daily direct sunlight threshold (${crop.min_sunlight_hours}h minimum or shade-tolerant).`);
    }

    // 3. Space Check
    if (profile.growingSpaceSqFt < crop.min_space_sq_ft) {
      reasonsNeg.push(
        `Requires at least ${crop.min_space_sq_ft} sq ft per plant; available area is ${profile.growingSpaceSqFt} sq ft.`
      );
    } else {
      reasonsPos.push(`Fits within available growing space (${crop.min_space_sq_ft} sq ft per plant).`);
    }

    // 4. Experience match
    if (profile.experienceLevel === 'beginner' && crop.difficulty === 'beginner') {
      reasonsPos.push('Beginner-friendly crop with high resilience.');
    }

    // 5. User preference match
    if (profile.preferredCropIds.includes(crop.id)) {
      reasonsPos.push('Matches explicitly requested target crops.');
    } else if (profile.preferredCategories.includes(crop.category)) {
      reasonsPos.push(`Matches preferred category '${crop.category}'.`);
    }

    const isSuitable = reasonsNeg.length === 0;

    let score = 0;
    if (isSuitable) {
      score = 65;
      if (profile.preferredCropIds.includes(crop.id)) score += 15;
      if (crop.difficulty === 'beginner') score += 10;
      score += Math.min(10, (userSunHours - crop.min_sunlight_hours) * 5);
      score = Math.round(Math.max(0, Math.min(100, score)));
    }

    const evaluation: CropEvaluation = {
      crop,
      isSuitable,
      score,
      reasonsRecommended: reasonsPos,
      reasonsExcluded: reasonsNeg,
    };

    if (isSuitable) {
      suitable.push(evaluation);
    } else {
      excluded.push(evaluation);
    }
  });

  suitable.sort((a, b) => b.score - a.score);
  return { suitable, excluded };
}

export function generateWeeklyPlan(
  profile: GardenProfileData,
  suitableEvaluations: CropEvaluation[]
): WeeklyPlanData {
  const topCrops = suitableEvaluations.slice(0, 4).map((e) => e.crop);
  const selectedIds = topCrops.map((c) => c.id);

  const synergies: string[] = [];
  const warnings: string[] = [];

  topCrops.forEach((c) => {
    c.verified_companions.forEach((comp) => {
      if (selectedIds.includes(comp)) {
        const compCrop = LOCAL_CROPS_DATABASE.find((k) => k.id === comp);
        const text = `${c.common_name} + ${compCrop ? compCrop.common_name : comp} mutually benefit root zoning and natural pest repulsion.`;
        if (!synergies.includes(text)) synergies.push(text);
      }
    });

    c.incompatible_neighbors.forEach((inc) => {
      if (selectedIds.includes(inc)) {
        const incCrop = LOCAL_CROPS_DATABASE.find((k) => k.id === inc);
        const text = `Keep ${c.common_name} and ${incCrop ? incCrop.common_name : inc} in separate containers or quadrants.`;
        if (!warnings.includes(text)) warnings.push(text);
      }
    });
  });

  const tasks: GardeningTaskItem[] = [];

  // Week 1: Soil & Sowing
  topCrops.forEach((c) => {
    tasks.push({
      id: `w1-${c.id}`,
      weekNumber: 1,
      title: `Outdoor Setup & Planting: ${c.common_name}`,
      description: `Step outside to inspect and prepare the ${profile.gardenType}. Ensure containers have at least ${c.min_container_depth_inches}" depth with bottom drain holes. Plant seeds or transplants into moist soil.`,
      estimatedDurationMinutes: 25,
      requiredSupplies: ['Potting mix / loam', 'Hand trowel', 'Gardening gloves', 'Seeds or nursery transplant'],
      cropName: c.common_name,
      safetyNotes: 'Wear gloves when handling potting mix to prevent inhaling dust and mold spores.',
      outdoorActivity: true,
      completed: false,
    });
  });

  // Week 2: Moisture & Thinning
  topCrops.forEach((c) => {
    tasks.push({
      id: `w2-${c.id}`,
      weekNumber: 2,
      title: `Root Moisture Check & Thinning: ${c.common_name}`,
      description: `Spend 15 minutes outdoors feeling topsoil moisture and observing morning sun. Snip crowded seedlings to leave ${c.min_space_sq_ft} sq ft per plant.`,
      estimatedDurationMinutes: 15,
      requiredSupplies: ['Garden snips or small scissors', 'Watering can with fine rose'],
      cropName: c.common_name,
      safetyNotes: 'Cut unwanted thinnings at soil surface rather than pulling to avoid disturbing neighboring roots.',
      outdoorActivity: true,
      completed: false,
    });
  });

  // Week 3: Mulch & Pest Watch
  topCrops.forEach((c) => {
    tasks.push({
      id: `w3-${c.id}`,
      weekNumber: 3,
      title: `Mulch Layering & Pest Inspection: ${c.common_name}`,
      description: `Step outside to inspect undersides of leaves for pests. Apply a 1-inch straw or leaf mulch layer over the soil to preserve moisture during afternoon sun.`,
      estimatedDurationMinutes: 20,
      requiredSupplies: ['Clean organic straw or untreated bark mulch', 'Spray bottle with clean water'],
      cropName: c.common_name,
      safetyNotes: 'Never use synthetic chemical pesticides; encourage natural predatory insects like ladybugs.',
      outdoorActivity: true,
      completed: false,
    });
  });

  // Week 4: Leaf Pruning & Harvesting
  topCrops.forEach((c) => {
    tasks.push({
      id: `w4-${c.id}`,
      weekNumber: 4,
      title: `Pruning & Early Harvesting: ${c.common_name}`,
      description: `Pinch back terminal shoots to induce bushiness or harvest outer mature leaves. Enjoy fresh homegrown produce while touching grass!`,
      estimatedDurationMinutes: 25,
      requiredSupplies: ['Clean harvest basket or colander', 'Sharp pruning scissors'],
      cropName: c.common_name,
      safetyNotes: 'Wash freshly harvested greens and herbs thoroughly with cold tap water before eating.',
      outdoorActivity: true,
      completed: false,
    });
  });

  const outdoorGoal = tasks.reduce((sum, t) => sum + t.estimatedDurationMinutes, 0);

  return {
    location: profile.location,
    gardenType: profile.gardenType,
    totalAllocatedCrops: topCrops.map((c) => c.common_name),
    tasks,
    outdoorMinutesGoal: outdoorGoal,
    companionSynergies: synergies,
    spacingWarnings: warnings,
    disclaimer: 'Grounded in USDA Extension and RHS guides. Adjust for unexpected local frost conditions.',
  };
}
