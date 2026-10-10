export type GardenType = 'balcony' | 'container' | 'backyard' | 'raised_bed' | 'indoor';
export type SunlightType = 'full_sun' | 'partial_sun' | 'shade';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'experienced';
export type SoilType = 'potting_mix' | 'loamy' | 'sandy' | 'clay';
export type WaterAccess = 'watering_can' | 'garden_hose' | 'drip_irrigation' | 'rainwater';

export interface GardenProfileData {
  location: string;
  gardenType: GardenType;
  sunlight: SunlightType;
  growingSpaceSqFt: number;
  preferredCategories: string[];
  preferredCropIds: string[];
  experienceLevel: ExperienceLevel;
  weeklyHoursAvailable: number;
  soilType: SoilType;
  waterAccess: WaterAccess;
}

export interface CropRecord {
  id: string;
  common_name: string;
  botanical_name: string;
  category: string;
  sunlight: SunlightType;
  min_sunlight_hours: number;
  compatible_garden_types: string[];
  min_space_sq_ft: number;
  min_container_depth_inches: number;
  hardiness_zones: number[];
  watering_need: string;
  days_to_maturity: number;
  difficulty: string;
  preferred_soils: string[];
  verified_companions: string[];
  incompatible_neighbors: string[];
  outdoor_suitability: string;
  care_guidance: string;
  known_constraints: string;
  source_id: string;
  source_reference: string;
}

export interface CropEvaluation {
  crop: CropRecord;
  isSuitable: boolean;
  score: number;
  reasonsRecommended: string[];
  reasonsExcluded: string[];
}

export interface GardeningTaskItem {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  estimatedDurationMinutes: number;
  requiredSupplies: string[];
  cropName: string;
  safetyNotes: string;
  outdoorActivity: boolean;
  completed: boolean;
}

export interface WeeklyPlanData {
  location: string;
  gardenType: string;
  totalAllocatedCrops: string[];
  tasks: GardeningTaskItem[];
  outdoorMinutesGoal: number;
  companionSynergies: string[];
  spacingWarnings: string[];
  disclaimer: string;
}

export interface OutdoorSession {
  id: string;
  date: string;
  minutes: number;
  notes: string;
  cropName?: string;
}

export interface SourceReference {
  id: string;
  organization: string;
  title: string;
  url: string;
  relevant_crops: string[];
  topic: string;
  region: string;
  date_checked: string;
  verification_status: string;
}
