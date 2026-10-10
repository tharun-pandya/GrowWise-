export interface PlantProfile {
  id: string;
  commonName: string;
  botanicalName: string;
  category: 'herb' | 'leafy_green' | 'fruiting' | 'root' | 'legume' | 'flower';
  minSunlightHours: number;
  sunlightLevels: ('full_sun' | 'partial_sun' | 'full_shade')[];
  compatibleGardenTypes: ('container' | 'raised_bed' | 'in_ground' | 'windowsill' | 'greenhouse')[];
  minSpaceSqFt: number;
  minContainerDepthInches: number;
  hardinessZones: number[];
  wateringNeed: 'low' | 'moderate' | 'high';
  daysToMaturity: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  verifiedCompanions: string[];
  incompatibleNeighbors: string[];
  soilPreference: string;
  sourceCitation: string;
  careSummary: string;
  weeklyCareSchedule: Record<number, string>;
}

export const PLANT_DATABASE: Record<string, PlantProfile> = {
  sweet_basil: {
    id: 'sweet_basil',
    commonName: 'Sweet Basil',
    botanicalName: 'Ocimum basilicum',
    category: 'herb',
    minSunlightHours: 6.0,
    sunlightLevels: ['full_sun'],
    compatibleGardenTypes: ['container', 'raised_bed', 'in_ground', 'windowsill'],
    minSpaceSqFt: 1.0,
    minContainerDepthInches: 8,
    hardinessZones: [4, 5, 6, 7, 8, 9, 10],
    wateringNeed: 'moderate',
    daysToMaturity: 60,
    difficulty: 'beginner',
    verifiedCompanions: ['cherry_tomato', 'bell_pepper'],
    incompatibleNeighbors: ['peppermint'],
    soilPreference: 'Rich, moist, well-draining soil with pH 6.0-7.0',
    sourceCitation: 'USDA Extension / RHS Plant Bulletin #H-24',
    careSummary: 'Needs warm air (>60°F/15°C) and consistent moisture. Water at base to avoid leaf fungal spots.',
    weeklyCareSchedule: {
      1: 'Sow seeds 1/4-inch deep or plant transplants in warm potting mix.',
      2: 'Keep soil lightly moist; ensure 6+ hours of direct sunny exposure.',
      3: 'Pinch top center stem once plant is 6 inches tall to encourage bushy branching.',
      4: 'Harvest outer leaves frequently; promptly pinch off any flowering spikes.',
    },
  },
  cherry_tomato: {
    id: 'cherry_tomato',
    commonName: 'Cherry Tomato',
    botanicalName: 'Solanum lycopersicum var. cerasiforme',
    category: 'fruiting',
    minSunlightHours: 6.5,
    sunlightLevels: ['full_sun'],
    compatibleGardenTypes: ['container', 'raised_bed', 'in_ground', 'greenhouse'],
    minSpaceSqFt: 3.0,
    minContainerDepthInches: 14,
    hardinessZones: [4, 5, 6, 7, 8, 9, 10, 11],
    wateringNeed: 'high',
    daysToMaturity: 65,
    difficulty: 'intermediate',
    verifiedCompanions: ['sweet_basil', 'french_marigold', 'butterhead_lettuce'],
    incompatibleNeighbors: ['danvers_carrot'],
    soilPreference: 'Deep, fertile, well-drained loam high in organic matter, pH 6.2-6.8',
    sourceCitation: 'Texas A&M AgriLife Extension / Cornell Garden Guides',
    careSummary: 'Heavy feeder needing 6+ hours full sun and sturdy support stakes or tomato cage.',
    weeklyCareSchedule: {
      1: 'Transplant deep (bury up to top leaves) in 5-gallon+ container; insert stake immediately.',
      2: 'Water deeply and evenly at base; apply 2-inch organic straw mulch around base.',
      3: 'Prune bottom suckers (side shoots in leaf axils) below first flower cluster.',
      4: 'Inspect for hornworms and blossom end rot; side-dress with organic balanced fertilizer.',
    },
  },
  butterhead_lettuce: {
    id: 'butterhead_lettuce',
    commonName: 'Butterhead Lettuce',
    botanicalName: 'Lactuca sativa var. capitata',
    category: 'leafy_green',
    minSunlightHours: 4.0,
    sunlightLevels: ['partial_sun', 'full_sun'],
    compatibleGardenTypes: ['container', 'raised_bed', 'in_ground', 'windowsill'],
    minSpaceSqFt: 0.75,
    minContainerDepthInches: 6,
    hardinessZones: [3, 4, 5, 6, 7, 8, 9, 10],
    wateringNeed: 'moderate',
    daysToMaturity: 48,
    difficulty: 'beginner',
    verifiedCompanions: ['french_radish', 'danvers_carrot', 'cherry_tomato'],
    incompatibleNeighbors: [],
    soilPreference: 'Cool, loose, moisture-retentive loam with good drainage, pH 6.0-7.0',
    sourceCitation: 'Penn State Extension Cool-Season Vegetable Guide',
    careSummary: 'Shallow roots; thrives in partial sun or cool weather; prone to bolting in extreme heat.',
    weeklyCareSchedule: {
      1: 'Scatter seeds thinly (1/8 inch deep) or space transplants 8 inches apart.',
      2: 'Thin crowded seedlings to 6-8 inches apart; keep shallow root zone moist.',
      3: 'Shield from intense afternoon sun if temperatures exceed 75°F (24°C).',
      4: 'Begin "cut-and-come-again" harvest of tender outer leaves.',
    },
  },
  spinach: {
    id: 'spinach',
    commonName: 'Baby Spinach',
    botanicalName: 'Spinacia oleracea',
    category: 'leafy_green',
    minSunlightHours: 3.0,
    sunlightLevels: ['partial_sun', 'full_shade'],
    compatibleGardenTypes: ['container', 'raised_bed', 'in_ground', 'windowsill'],
    minSpaceSqFt: 0.5,
    minContainerDepthInches: 6,
    hardinessZones: [2, 3, 4, 5, 6, 7, 8, 9],
    wateringNeed: 'moderate',
    daysToMaturity: 40,
    difficulty: 'beginner',
    verifiedCompanions: ['alpine_strawberry', 'french_radish'],
    incompatibleNeighbors: [],
    soilPreference: 'Humus-rich, neutral to slightly alkaline soil (pH 6.5-7.5)',
    sourceCitation: 'University of Minnesota Extension Yard & Garden',
    careSummary: 'Exceptional cool-weather crop. Tolerates partial shade and frost down to 20°F (-6°C).',
    weeklyCareSchedule: {
      1: 'Direct-seed 1/2-inch deep in cool soil; water gently with a fine rose spray.',
      2: 'Thin seedlings to 3-4 inches apart; eat the thinnings as microgreens.',
      3: 'Maintain cool soil temperature with a light layer of leaf mold or straw.',
      4: 'Harvest outer mature leaves to allow inner rosette leaves to continue growing.',
    },
  },
  peppermint: {
    id: 'peppermint',
    commonName: 'Peppermint',
    botanicalName: 'Mentha × piperita',
    category: 'herb',
    minSunlightHours: 3.5,
    sunlightLevels: ['partial_sun', 'full_sun'],
    compatibleGardenTypes: ['container', 'windowsill'],
    minSpaceSqFt: 1.0,
    minContainerDepthInches: 8,
    hardinessZones: [3, 4, 5, 6, 7, 8, 9, 10, 11],
    wateringNeed: 'high',
    daysToMaturity: 60,
    difficulty: 'beginner',
    verifiedCompanions: [],
    incompatibleNeighbors: ['sweet_basil'],
    soilPreference: 'Moist, fertile, rich potting compost',
    sourceCitation: 'RHS Herb Cultivation Guide & UC Davis IPM',
    careSummary: 'VERY aggressive spreader via underground stolons. Always grow in a dedicated container to avoid garden takeover.',
    weeklyCareSchedule: {
      1: 'Plant runner or division into dedicated pot with drainage hole.',
      2: 'Keep soil consistently damp; peppermint thrives near moist container margins.',
      3: 'Snip runner tips to promote dense bushy leaf growth instead of long vines.',
      4: 'Harvest fresh sprigs for tea; never plant directly in open garden ground.',
    },
  },
  french_radish: {
    id: 'french_radish',
    commonName: 'French Breakfast Radish',
    botanicalName: 'Raphanus sativus',
    category: 'root',
    minSunlightHours: 4.5,
    sunlightLevels: ['partial_sun', 'full_sun'],
    compatibleGardenTypes: ['container', 'raised_bed', 'in_ground', 'windowsill'],
    minSpaceSqFt: 0.2,
    minContainerDepthInches: 6,
    hardinessZones: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    wateringNeed: 'moderate',
    daysToMaturity: 25,
    difficulty: 'beginner',
    verifiedCompanions: ['butterhead_lettuce', 'spinach', 'bush_bean'],
    incompatibleNeighbors: [],
    soilPreference: 'Loose, sandy loam free of debris, pH 6.0-7.0',
    sourceCitation: 'Purdue Extension Fast-Crop Fact Sheet',
    careSummary: 'Ultra-fast harvest (under 4 weeks). Essential companion for breaking up surface crust for slower crops.',
    weeklyCareSchedule: {
      1: 'Sow seeds 1/2 inch deep and 1 inch apart in fine, rock-free soil.',
      2: 'Thin rigorously to 2 inches apart—failure to thin prevents root bulbing.',
      3: 'Keep moisture uniform; sporadic watering causes woody texture and split skins.',
      4: 'Harvest crisp roots when shoulders emerge approx 1-inch thick at soil line.',
    },
  },
  bell_pepper: {
    id: 'bell_pepper',
    commonName: 'Bell Pepper',
    botanicalName: 'Capsicum annuum',
    category: 'fruiting',
    minSunlightHours: 6.5,
    sunlightLevels: ['full_sun'],
    compatibleGardenTypes: ['container', 'raised_bed', 'in_ground', 'greenhouse'],
    minSpaceSqFt: 2.0,
    minContainerDepthInches: 12,
    hardinessZones: [4, 5, 6, 7, 8, 9, 10, 11],
    wateringNeed: 'moderate',
    daysToMaturity: 75,
    difficulty: 'intermediate',
    verifiedCompanions: ['sweet_basil', 'french_marigold'],
    incompatibleNeighbors: [],
    soilPreference: 'Warm, well-aerated, fertile loam, pH 6.2-7.0',
    sourceCitation: 'University of Florida IFAS Extension',
    careSummary: 'Requires soil temperatures >65°F (18°C). Sensitive to cool spring breezes and waterlogged roots.',
    weeklyCareSchedule: {
      1: 'Set out sturdy transplants only after nighttime temperatures exceed 55°F (13°C).',
      2: 'Provide light stake support for fruit load; keep moisture consistent.',
      3: 'Feed with balanced organic compost tea when first flowers form.',
      4: 'Harvest firm green peppers early or leave on vine to ripen to sweet red/yellow.',
    },
  },
  danvers_carrot: {
    id: 'danvers_carrot',
    commonName: 'Danvers Half-Long Carrot',
    botanicalName: 'Daucus carota subsp. sativus',
    category: 'root',
    minSunlightHours: 6.0,
    sunlightLevels: ['full_sun'],
    compatibleGardenTypes: ['container', 'raised_bed', 'in_ground'],
    minSpaceSqFt: 0.25,
    minContainerDepthInches: 10,
    hardinessZones: [3, 4, 5, 6, 7, 8, 9, 10],
    wateringNeed: 'moderate',
    daysToMaturity: 72,
    difficulty: 'intermediate',
    verifiedCompanions: ['rosemary', 'butterhead_lettuce'],
    incompatibleNeighbors: ['cherry_tomato'],
    soilPreference: 'Deep, sandy, pebble-free loam; avoids fresh manure to prevent root splitting',
    sourceCitation: 'Oregon State University Extension Service',
    careSummary: 'Requires stones and heavy clay to be sifted out; compact soil causes bifurcated roots.',
    weeklyCareSchedule: {
      1: 'Sow seeds 1/4 inch deep in deeply loosened soil; keep seedbed continuously moist.',
      2: 'Gently weed by hand; carrot seedlings are delicate and emerge slowly (10-14 days).',
      3: 'Thin seedlings to 2-3 inches apart using small scissors to avoid root disturbance.',
      4: 'Hill up a little loose soil around crowns to prevent green shoulders from sun exposure.',
    },
  },
  bush_bean: {
    id: 'bush_bean',
    commonName: 'Provider Bush Green Bean',
    botanicalName: 'Phaseolus vulgaris',
    category: 'legume',
    minSunlightHours: 6.0,
    sunlightLevels: ['full_sun'],
    compatibleGardenTypes: ['container', 'raised_bed', 'in_ground'],
    minSpaceSqFt: 1.0,
    minContainerDepthInches: 8,
    hardinessZones: [3, 4, 5, 6, 7, 8, 9, 10],
    wateringNeed: 'moderate',
    daysToMaturity: 52,
    difficulty: 'beginner',
    verifiedCompanions: ['french_radish', 'rosemary'],
    incompatibleNeighbors: [],
    soilPreference: 'Well-drained loam, pH 6.0-6.8; does not need synthetic nitrogen',
    sourceCitation: 'Iowa State University Extension and Outreach',
    careSummary: 'Self-supporting bush habit (no trellising required). Fixes atmospheric nitrogen through root nodules.',
    weeklyCareSchedule: {
      1: 'Direct-sow seeds 1 inch deep in warm soil (minimum 60°F/15°C); do not pre-soak.',
      2: 'Cultivate shallowly around stems to suppress weeds without harming surface roots.',
      3: 'Ensure 1 inch of water per week while flowers blossom.',
      4: 'Pick slender pods daily to stimulate continuous blossom and pod production.',
    },
  },
  rosemary: {
    id: 'rosemary',
    commonName: 'Tuscan Rosemary',
    botanicalName: 'Salvia rosmarinus',
    category: 'herb',
    minSunlightHours: 6.5,
    sunlightLevels: ['full_sun'],
    compatibleGardenTypes: ['container', 'raised_bed', 'in_ground', 'windowsill'],
    minSpaceSqFt: 2.0,
    minContainerDepthInches: 10,
    hardinessZones: [7, 8, 9, 10],
    wateringNeed: 'low',
    daysToMaturity: 85,
    difficulty: 'beginner',
    verifiedCompanions: ['danvers_carrot', 'bush_bean'],
    incompatibleNeighbors: [],
    soilPreference: 'Gritty, sharply drained sandy soil, pH 6.5-7.5; very susceptible to root rot in soggy soil',
    sourceCitation: 'RHS Award of Garden Merit & Clemson Cooperative Extension',
    careSummary: 'Mediterranean evergreen shrub. Thrives on dry periods between waterings and intense sunlight.',
    weeklyCareSchedule: {
      1: 'Plant rooted cutting in sandy potting mix with 20% coarse perlite or grit.',
      2: 'Place in sunniest position; allow top 2 inches of soil to dry completely before watering.',
      3: 'Snip 2-inch branch tips to maintain compact structural growth.',
      4: 'Avoid high-nitrogen fertilizers which weaken essential oil concentration and aroma.',
    },
  },
  alpine_strawberry: {
    id: 'alpine_strawberry',
    commonName: 'Alpine Strawberry',
    botanicalName: 'Fragaria vesca',
    category: 'fruiting',
    minSunlightHours: 5.0,
    sunlightLevels: ['partial_sun', 'full_sun'],
    compatibleGardenTypes: ['container', 'raised_bed', 'in_ground', 'windowsill'],
    minSpaceSqFt: 1.0,
    minContainerDepthInches: 8,
    hardinessZones: [4, 5, 6, 7, 8, 9],
    wateringNeed: 'moderate',
    daysToMaturity: 80,
    difficulty: 'intermediate',
    verifiedCompanions: ['spinach', 'butterhead_lettuce'],
    incompatibleNeighbors: [],
    soilPreference: 'Rich, slightly acidic, moisture-retentive loam with leaf compost, pH 5.8-6.5',
    sourceCitation: 'Cornell University Berry Diagnostic Guide',
    careSummary: 'Clump-forming (does not send out wild aggressive runners); ideal for patio pots.',
    weeklyCareSchedule: {
      1: 'Plant crown exactly level with soil surface—never bury the central growing crown.',
      2: 'Mulch with clean straw or cocoa shells to keep maturing berries off damp soil.',
      3: 'Monitor soil moisture; strawberry fruit yields drop sharply if allowed to dry out.',
      4: 'Harvest intensely aromatic miniature fruits when deep red and tender.',
    },
  },
  french_marigold: {
    id: 'french_marigold',
    commonName: 'French Marigold',
    botanicalName: 'Tagetes patula',
    category: 'flower',
    minSunlightHours: 6.0,
    sunlightLevels: ['full_sun'],
    compatibleGardenTypes: ['container', 'raised_bed', 'in_ground', 'windowsill'],
    minSpaceSqFt: 0.75,
    minContainerDepthInches: 6,
    hardinessZones: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    wateringNeed: 'low',
    daysToMaturity: 50,
    difficulty: 'beginner',
    verifiedCompanions: ['cherry_tomato', 'bell_pepper'],
    incompatibleNeighbors: [],
    soilPreference: 'Average, well-draining garden soil, pH 6.0-7.5',
    sourceCitation: 'NC State University Extension Pollinator & Trap Crop Guide',
    careSummary: 'Essential companion plant; roots produce alpha-terthienyl which suppresses root-knot nematodes.',
    weeklyCareSchedule: {
      1: 'Transplant seedlings alongside tomatoes or peppers 8 inches apart.',
      2: 'Provide full sun; water moderately until root system establishes.',
      3: 'Deadhead spent flower blooms weekly to induce continuous flowering flushes.',
      4: 'Enjoy prolific blooms that attract syrphid flies, bees, and beneficial insects.',
    },
  },
};

export interface SuitabilityResult {
  plant: PlantProfile;
  isSuitable: boolean;
  score: number;
  sunlightPassed: boolean;
  gardenTypePassed: boolean;
  zonePassed: boolean;
  spacePassed: boolean;
  maxCount: number;
  disqualifications: string[];
  positives: string[];
}

export function evaluateSuitability(
  plant: PlantProfile,
  params: {
    gardenType: 'container' | 'raised_bed' | 'in_ground' | 'windowsill' | 'greenhouse';
    sunlightHours: number;
    hardinessZone: number;
    spaceSqFt: number;
    preferredPlantIds: string[];
  }
): SuitabilityResult {
  const disqualifications: string[] = [];
  const positives: string[] = [];

  const gardenTypePassed = plant.compatibleGardenTypes.includes(params.gardenType);
  if (!gardenTypePassed) {
    disqualifications.push(
      `Not suitable for ${params.gardenType}. Requires: ${plant.compatibleGardenTypes.join(', ')}.`
    );
  }

  const sunlightPassed = params.sunlightHours >= (plant.minSunlightHours - 0.25);
  if (!sunlightPassed) {
    disqualifications.push(
      `Requires at least ${plant.minSunlightHours}h sun, but space receives ${params.sunlightHours}h.`
    );
  } else {
    positives.push(`Meets sunlight threshold (${plant.minSunlightHours}h required).`);
  }

  const zonePassed = plant.hardinessZones.includes(params.hardinessZone);
  if (!zonePassed) {
    disqualifications.push(
      `Outside verified hardiness zone range (${Math.min(...plant.hardinessZones)}-${Math.max(...plant.hardinessZones)}). Selected: Zone ${params.hardinessZone}.`
    );
  } else {
    positives.push(`Adapted to USDA Zone ${params.hardinessZone}.`);
  }

  const spacePassed = params.spaceSqFt >= plant.minSpaceSqFt;
  const maxCount = spacePassed ? Math.floor(params.spaceSqFt / plant.minSpaceSqFt) : 0;
  if (!spacePassed) {
    disqualifications.push(
      `Needs at least ${plant.minSpaceSqFt} sq ft per plant, but total area is ${params.spaceSqFt} sq ft.`
    );
  }

  const isSuitable = gardenTypePassed && sunlightPassed && zonePassed && spacePassed;
  let score = 0;

  if (isSuitable) {
    score = 60;
    const sunRatio = Math.min(params.sunlightHours / plant.minSunlightHours, 1.5);
    score += (sunRatio - 1.0) * 20;

    if (plant.difficulty === 'beginner') {
      score += 10;
      positives.push('Beginner-friendly crop with high resilience.');
    }

    if (params.preferredPlantIds.includes(plant.id)) {
      score += 15;
      positives.push('Matches user preference.');
    }

    score = Math.max(0, Math.min(100, Math.round(score)));
  }

  return {
    plant,
    isSuitable,
    score,
    sunlightPassed,
    gardenTypePassed,
    zonePassed,
    spacePassed,
    maxCount,
    disqualifications,
    positives,
  };
}
