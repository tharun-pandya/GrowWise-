import React from 'react';
import { Sprout, Sun, ShieldCheck, HeartHandshake, ArrowRight, Compass } from 'lucide-react';

interface LandingHeroProps {
  onStartPlanning: () => void;
  onExploreKnowledge: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartPlanning,
  onExploreKnowledge,
}) => {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8 overflow-hidden relative">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          <Compass className="w-3.5 h-3.5" />
          <span>Hacktoberfest 2026 Open-Source AI Challenge · Week 1: Touch Grass</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
          Turn gardening questions into practical <span className="text-emerald-800">outdoor activities</span>.
        </h1>

        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          GrowWise helps you spend less time staring at screens and more time outside with dirt on your hands.
          Receive deterministic, scientifically-grounded plant recommendations, transparent disqualification logs, and a 4-week outdoor task plan powered by open-weight AI.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onStartPlanning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
          >
            <Sprout className="w-4 h-4" />
            <span>Customize My Garden Profile</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={onExploreKnowledge}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-medium text-xs sm:text-sm transition-colors"
          >
            <span>Explore Verified Sources</span>
          </button>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 mt-6 border-t border-stone-100 text-xs">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-stone-900 block">Deterministic Rules</span>
            <span className="text-stone-500 text-[11px]">Strict boolean logic; zero botanical hallucinations.</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-800 shrink-0">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-stone-900 block">Grounded Data</span>
            <span className="text-stone-500 text-[11px]">USDA & RHS agricultural extension verified facts.</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 shrink-0">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-stone-900 block">Open-Weight AI</span>
            <span className="text-stone-500 text-[11px]">Gemma 2 2B architecture with offline fallback.</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-stone-100 text-stone-800 shrink-0">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-stone-900 block">Privacy-First</span>
            <span className="text-stone-500 text-[11px]">Local browser storage; no GPS or personal tracking.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
