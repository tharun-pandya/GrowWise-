import React from 'react';
import { Sprout, Compass, Heart, Github, Award, CheckCircle2 } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Hacktoberfest 2026 Open-Source AI Challenge
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-1">
            About GrowWise: Touch Grass & Build Soil
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Week 1: &quot;Touch Grass&quot; · Turning digital AI intelligence into tangible real-world dirt and fresh air.
          </p>
        </div>

        <div className="space-y-4 pt-5 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            The world has an abundance of chat interfaces that keep users glued to glowing rectangles.
            <strong>GrowWise was born from a simple thesis:</strong> Artificial intelligence is at its best when it encourages human beings to log off, step outside into their gardens, and touch grass.
          </p>

          <p>
            Whether you have a 12 sq ft apartment balcony or an 80 sq ft raised bed in your backyard, GrowWise strips away confusing jargon and gives you immediate, grounded steps to grow healthy plants without synthetic chemicals or guesswork.
          </p>
        </div>
      </div>

      {/* 3 Core Tenets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-2 text-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="font-bold text-sm text-stone-900">Anti-Screen Time</h3>
          <p className="text-stone-600 text-[11px] leading-relaxed">
            Every feature in GrowWise is measured by how quickly it helps you close your laptop and step outside.
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-2 text-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="font-bold text-sm text-stone-900">Zero Hallucinations</h3>
          <p className="text-stone-600 text-[11px] leading-relaxed">
            We use pure deterministic filters for plant physics (sunlight, space, root depth). The AI never invents facts.
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-2 text-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="font-bold text-sm text-stone-900">Open-Weight AI</h3>
          <p className="text-stone-600 text-[11px] leading-relaxed">
            Accessible on consumer hardware (≤ 8 GB RAM) using Google Gemma 2 2B with no vendor lock-in.
          </p>
        </div>
      </div>

      {/* Hacktoberfest Details */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4 text-xs sm:text-sm">
        <h3 className="font-bold text-base text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
          <Award className="w-4 h-4 text-emerald-700" />
          <span>Hacktoberfest 2026 Submission Summary</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700">
          <div>
            <span className="font-bold text-stone-900 block">Challenge Week:</span>
            <span>Week 1: &quot;Touch Grass&quot; (Outdoor real-world AI impact)</span>
          </div>
          <div>
            <span className="font-bold text-stone-900 block">Primary Model:</span>
            <span>Google Gemma 2 2B (Open-Weight Architecture)</span>
          </div>
          <div>
            <span className="font-bold text-stone-900 block">Frontend Stack:</span>
            <span>React 19, TypeScript, Vite, Tailwind CSS v4</span>
          </div>
          <div>
            <span className="font-bold text-stone-900 block">Backend Stack:</span>
            <span>FastAPI Python Service + Express proxy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
