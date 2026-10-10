import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sun,
  Ruler,
  Clock,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';
import { CropEvaluation, GardenProfileData } from '../types';

interface PlantRecommendationsProps {
  suitable: CropEvaluation[];
  excluded: CropEvaluation[];
  profile: GardenProfileData;
  onGoToPlan: () => void;
  onExplainAi: () => void;
}

export const PlantRecommendations: React.FC<PlantRecommendationsProps> = ({
  suitable,
  excluded,
  profile,
  onGoToPlan,
  onExplainAi,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showExcluded, setShowExcluded] = useState<boolean>(true);

  // Filter suitable crops
  const filteredSuitable = filterCategory === 'all'
    ? suitable
    : suitable.filter((s) => s.crop.category === filterCategory);

  const categories = ['all', 'vegetable', 'herb', 'fruit', 'flower'];

  // Synergies and warnings
  const selectedCrops = suitable.slice(0, 4).map((s) => s.crop);
  const selectedIds = selectedCrops.map((c) => c.id);

  const synergies: string[] = [];
  const warnings: string[] = [];

  selectedCrops.forEach((c) => {
    c.verified_companions.forEach((comp) => {
      if (selectedIds.includes(comp)) {
        const text = `${c.common_name} and ${comp.replace('_', ' ')} are verified companion plants (natural pest reduction & soil root complement).`;
        if (!synergies.includes(text)) synergies.push(text);
      }
    });

    c.incompatible_neighbors.forEach((inc) => {
      if (selectedIds.includes(inc)) {
        const text = `Caution: Plant ${c.common_name} and ${inc.replace('_', ' ')} in separate beds or pots.`;
        if (!warnings.includes(text)) warnings.push(text);
      }
    });
  });

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Deterministic Horticultural Evaluation
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500 font-medium">100% Factually Grounded</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-1">
              Plant Suitability Results for {profile.location}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Evaluated against your {profile.growingSpaceSqFt} sq ft {profile.gardenType} with {profile.sunlight.replace('_', ' ')} conditions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExplainAi}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Synthesize with AI</span>
            </button>
            <button
              onClick={onGoToPlan}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white transition-colors shadow-xs"
            >
              <span>Build 4-Week Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500 text-[11px] block">Suitable Candidates</span>
            <span className="text-lg font-bold text-emerald-800">{suitable.length} crops</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500 text-[11px] block">Excluded Crops</span>
            <span className="text-lg font-bold text-stone-700">{excluded.length} crops</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500 text-[11px] block">Max Garden Capacity</span>
            <span className="text-lg font-bold text-stone-900">{profile.growingSpaceSqFt} sq ft</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500 text-[11px] block">Companion Synergies</span>
            <span className="text-lg font-bold text-emerald-700">{synergies.length} active</span>
          </div>
        </div>

        {/* Companion Alerts */}
        {synergies.length > 0 && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-emerald-900">Verified Companion Synergies Detected:</span>
              <ul className="list-disc list-inside space-y-0.5 mt-0.5 text-emerald-800">
                {synergies.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="mt-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-amber-900">Spatial Separation Guidance:</span>
              <ul className="list-disc list-inside space-y-0.5 mt-0.5 text-amber-800">
                {warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl text-xs font-medium">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                filterCategory === cat
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowExcluded(!showExcluded)}
          className="text-xs text-stone-600 hover:text-stone-900 underline font-medium"
        >
          {showExcluded ? 'Hide Disqualification Log' : `View ${excluded.length} Disqualified Crops`}
        </button>
      </div>

      {/* Suitable Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSuitable.map(({ crop, score, reasonsRecommended }) => (
          <div
            key={crop.id}
            className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:border-emerald-300 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-bold text-base text-stone-900">{crop.common_name}</h3>
                  <span className="text-xs text-stone-400 italic block">{crop.botanical_name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md inline-block">
                    Score: {score}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5 capitalize">{crop.category}</span>
                </div>
              </div>

              {/* Care summary */}
              <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                {crop.care_guidance}
              </p>

              {/* Verified Parameters */}
              <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 mt-4 bg-stone-50/70 p-3 rounded-xl border border-stone-100">
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{crop.min_sunlight_hours}h direct sun</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{crop.min_space_sq_ft} sq ft space</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{crop.days_to_maturity}d maturity</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="capitalize">{crop.difficulty} level</span>
                </div>
              </div>

              {/* Why Recommended */}
              <div className="mt-3 text-xs space-y-1">
                <span className="font-semibold text-stone-800 text-[11px] block">Verified Compatibility:</span>
                <ul className="space-y-0.5 text-stone-600 text-[11px]">
                  {reasonsRecommended.slice(0, 3).map((r, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Source citation */}
            <div className="mt-4 pt-3 border-t border-stone-100 text-[10px] text-stone-400 flex items-center justify-between">
              <span className="truncate max-w-[200px]" title={crop.source_reference}>
                Source: {crop.source_reference}
              </span>
              <span className="text-emerald-700 font-semibold">Verified</span>
            </div>
          </div>
        ))}
      </div>

      {/* Transparent Disqualification Log */}
      {showExcluded && excluded.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-stone-500" />
              <span>Transparent Disqualification Log ({excluded.length} Crops Excluded)</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              GrowWise explains exactly why incompatible plants are excluded using verified botanical facts—no black-box guessing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {excluded.map(({ crop, reasonsExcluded }) => (
              <div
                key={crop.id}
                className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/40 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">
                    {crop.common_name} <span className="italic text-stone-400 font-normal">({crop.botanical_name})</span>
                  </span>
                  <span className="text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    Excluded
                  </span>
                </div>
                <ul className="space-y-1 text-stone-600 text-[11px]">
                  {reasonsExcluded.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-stone-600">
                      <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-[10px] text-stone-400 pt-1">
                  Constraint Note: {crop.known_constraints}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
