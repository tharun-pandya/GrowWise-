import React, { useState } from 'react';
import {
  MapPin,
  Sun,
  Ruler,
  Clock,
  Sparkles,
  Droplets,
  Layers,
  Award,
  AlertCircle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { GardenProfileData, GardenType, SunlightType, ExperienceLevel, SoilType, WaterAccess } from '../types';
import { LOCAL_CROPS_DATABASE } from '../services/recommendationEngine';

interface GardenProfileFormProps {
  initialProfile: GardenProfileData;
  onSaveProfile: (profile: GardenProfileData) => void;
}

export const GardenProfileForm: React.FC<GardenProfileFormProps> = ({
  initialProfile,
  onSaveProfile,
}) => {
  const [profile, setProfile] = useState<GardenProfileData>(initialProfile);
  const [errors, setErrors] = useState<string[]>([]);
  const [savedNotice, setSavedNotice] = useState(false);

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!profile.location || profile.location.trim().length < 2) {
      errs.push('Please enter a valid location or climate region (at least 2 characters).');
    }
    if (profile.growingSpaceSqFt <= 0 || isNaN(profile.growingSpaceSqFt)) {
      errs.push('Growing space must be greater than 0 square feet.');
    }
    if (profile.weeklyHoursAvailable < 0.25 || isNaN(profile.weeklyHoursAvailable)) {
      errs.push('Available gardening time must be at least 15 minutes (0.25 hours) per week.');
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSaveProfile(profile);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    }
  };

  const spacePresets = [
    { label: 'Window Sill (4 sq ft)', value: 4 },
    { label: 'Small Balcony (12 sq ft)', value: 12 },
    { label: 'Raised Bed 4x8 (32 sq ft)', value: 32 },
    { label: 'Backyard Plot (80 sq ft)', value: 80 },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
      {/* Header */}
      <div className="border-b border-stone-100 pb-4">
        <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <span>Garden Profile & Environmental Constraints</span>
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Provide your local growing conditions. GrowWise uses these parameters to deterministically filter verified crops. No precise GPS coordinates or personal identity are required.
        </p>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-red-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Please correct the following inputs:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 pl-2 text-red-700">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Saved Notice */}
      {savedNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Garden profile updated and saved to local storage!</span>
        </div>
      )}

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-stone-800 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>Location / Region</span>
          </label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            placeholder="e.g. Seattle, WA or USDA Zone 7 or Mediterranean"
            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none"
          />
          <span className="text-[11px] text-stone-400 mt-1 block">
            Used for general frost tolerance; precise GPS coordinates are never collected.
          </span>
        </div>

        {/* Garden Type */}
        <div>
          <label className="block text-xs font-semibold text-stone-800 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>Garden Type</span>
          </label>
          <select
            value={profile.gardenType}
            onChange={(e) => setProfile({ ...profile, gardenType: e.target.value as GardenType })}
            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none bg-white"
          >
            <option value="container">Container / Patio Pots</option>
            <option value="balcony">Apartment Balcony</option>
            <option value="raised_bed">Raised Garden Bed</option>
            <option value="backyard">In-Ground Backyard Plot</option>
            <option value="indoor">Indoor Windowsill / Sunroom</option>
          </select>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {profile.gardenType === 'backyard'
              ? 'Note: Peppermint is prohibited in-ground due to invasive rhizomes.'
              : 'Container depth checks will apply automatically.'}
          </span>
        </div>

        {/* Sunlight */}
        <div>
          <label className="block text-xs font-semibold text-stone-800 mb-1.5 flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Available Direct Sunlight</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'full_sun', label: 'Full Sun', sub: '6+ hours' },
              { id: 'partial_sun', label: 'Partial Sun', sub: '3 to 6 hours' },
              { id: 'shade', label: 'Shade', sub: 'Under 3 hours' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setProfile({ ...profile, sunlight: opt.id as SunlightType })}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  profile.sunlight === opt.id
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-semibold'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <span className="block text-xs">{opt.label}</span>
                <span className="text-[10px] text-stone-500">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Growing Space */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-emerald-700" />
              <span>Available Growing Space (sq ft)</span>
            </label>
            <span className="text-xs font-bold text-emerald-800">
              {profile.growingSpaceSqFt} sq ft
            </span>
          </div>
          <input
            type="number"
            min="1"
            max="1000"
            step="0.5"
            value={profile.growingSpaceSqFt}
            onChange={(e) => setProfile({ ...profile, growingSpaceSqFt: parseFloat(e.target.value) || 1 })}
            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none"
          />
          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {spacePresets.map((sp) => (
              <button
                key={sp.value}
                type="button"
                onClick={() => setProfile({ ...profile, growingSpaceSqFt: sp.value })}
                className={`text-[10px] px-2 py-0.5 rounded border ${
                  profile.growingSpaceSqFt === sp.value
                    ? 'bg-stone-800 text-white border-stone-800'
                    : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-xs font-semibold text-stone-800 mb-1.5 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>Gardening Experience</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'beginner', label: 'Beginner' },
              { id: 'intermediate', label: 'Intermediate' },
              { id: 'experienced', label: 'Experienced' },
            ].map((exp) => (
              <button
                key={exp.id}
                type="button"
                onClick={() => setProfile({ ...profile, experienceLevel: exp.id as ExperienceLevel })}
                className={`py-2 px-3 rounded-lg border text-xs text-center transition-colors ${
                  profile.experienceLevel === exp.id
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-semibold'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                {exp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Available Weekly Time */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Available Time per Week</span>
            </label>
            <span className="text-xs font-bold text-emerald-800">
              {profile.weeklyHoursAvailable} hours / week
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.5"
            value={profile.weeklyHoursAvailable}
            onChange={(e) => setProfile({ ...profile, weeklyHoursAvailable: parseFloat(e.target.value) })}
            className="w-full accent-emerald-700 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
            <span>30 mins (low maintenance)</span>
            <span>2.5 hrs (balanced)</span>
            <span>10 hrs (intensive)</span>
          </div>
        </div>

        {/* Soil Type */}
        <div>
          <label className="block text-xs font-semibold text-stone-800 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-stone-500" />
            <span>Soil Type (Optional)</span>
          </label>
          <select
            value={profile.soilType}
            onChange={(e) => setProfile({ ...profile, soilType: e.target.value as SoilType })}
            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none bg-white"
          >
            <option value="potting_mix">Quality Container Potting Mix</option>
            <option value="loamy">Rich Loamy Topsoil</option>
            <option value="sandy">Sandy Well-Draining Soil</option>
            <option value="clay">Dense Clay Soil</option>
          </select>
        </div>

        {/* Water Access */}
        <div>
          <label className="block text-xs font-semibold text-stone-800 mb-1.5 flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-sky-600" />
            <span>Water Access (Optional)</span>
          </label>
          <select
            value={profile.waterAccess}
            onChange={(e) => setProfile({ ...profile, waterAccess: e.target.value as WaterAccess })}
            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none bg-white"
          >
            <option value="watering_can">Handheld Watering Can</option>
            <option value="garden_hose">Garden Hose with Spray Nozzle</option>
            <option value="drip_irrigation">Automatic Drip Line</option>
            <option value="rainwater">Rainwater Barrel Collection</option>
          </select>
        </div>
      </div>

      {/* Preferred Crops Multiselect */}
      <div className="border-t border-stone-100 pt-6">
        <label className="block text-xs font-semibold text-stone-800 mb-2">
          Preferred Vegetables, Herbs & Flowers (Optional Priority Boost)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {LOCAL_CROPS_DATABASE.map((c) => {
            const isSelected = profile.preferredCropIds.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  const updated = isSelected
                    ? profile.preferredCropIds.filter((id) => id !== c.id)
                    : [...profile.preferredCropIds, c.id];
                  setProfile({ ...profile, preferredCropIds: updated });
                }}
                className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-semibold'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <span className="block font-medium truncate">{c.common_name}</span>
                <span className="text-[10px] text-stone-400 capitalize">{c.category} · {c.sunlight.replace('_', ' ')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Submission */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Save Profile & Evaluate Suitability</span>
        </button>
      </div>
    </form>
  );
};
