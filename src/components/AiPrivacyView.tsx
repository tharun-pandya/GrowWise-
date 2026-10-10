import React from 'react';
import { ShieldCheck, Cpu, Lock, Eye, AlertTriangle, Server, CheckCircle2 } from 'lucide-react';

export const AiPrivacyView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Open-Weight AI & Privacy Architecture
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-1">
            Open-Source AI Integrity & Privacy Guarantees
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            How GrowWise uses open-weight models like Google Gemma while protecting your data and preventing horticultural hallucinations.
          </p>
        </div>

        {/* 3 Privacy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 text-xs">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <Lock className="w-4 h-4 text-emerald-700" />
              <span>Zero Personal Tracking</span>
            </div>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              No user accounts, no tracking cookies, and no precise GPS coordinates. Location is used solely to identify USDA plant hardiness zones.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <Cpu className="w-4 h-4 text-emerald-700" />
              <span>Replaceable AI Interface</span>
            </div>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              Gemma 2 2B acts as the core open-weight engine. Switch between local Ollama, remote vLLM endpoints, or an offline zero-RAM synthesizer.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Fact Grounding Boundary</span>
            </div>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              The LLM never invents botanical rules. Suitability is computed deterministically first; the model only synthesizes conversational summaries.
            </p>
          </div>
        </div>
      </div>

      {/* Model Provider Architecture */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5 text-xs sm:text-sm">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
          <Server className="w-4 h-4 text-emerald-700" />
          <span>Replaceable Model Provider Architecture</span>
        </h3>

        <div className="space-y-4 text-stone-700 leading-relaxed">
          <p>
            GrowWise is designed with a provider-independent interface (<code className="font-mono text-xs bg-stone-100 px-1.5 py-0.5 rounded">BaseModelProvider</code>) that separates the application from any closed API vendor:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
              <span className="font-bold text-stone-900 block text-xs">1. Local Development (≤ 8 GB RAM)</span>
              <p className="text-stone-600 text-xs mt-1 leading-relaxed">
                Run Google’s open-weight <strong>Gemma 2 2B</strong> locally using <code className="font-mono text-[11px] bg-stone-200 px-1 rounded">ollama run gemma2:2b</code>. The model requires only <strong>~1.6 GB RAM</strong>, leaving ample memory for Windows or macOS.
              </p>
            </div>

            <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
              <span className="font-bold text-stone-900 block text-xs">2. Production Deployment (Render)</span>
              <p className="text-stone-600 text-xs mt-1 leading-relaxed">
                Because free Render instances provide 512 MB RAM, do not run heavy local LLM weights on the instance. Instead, configure an external OpenAI-compatible inference endpoint serving Gemma or use the built-in <strong>Offline Grounded Synthesizer</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What Data is Sent */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4 text-xs sm:text-sm">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
          <Eye className="w-4 h-4 text-emerald-700" />
          <span>What Information is Sent to Remote Inference Services?</span>
        </h3>

        <div className="space-y-3 text-stone-700 text-xs leading-relaxed">
          <p>When an external inference provider is selected, GrowWise transmits <strong>only the minimum anonymous physical context</strong> required to generate the advice:</p>

          <ul className="space-y-1.5 pl-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Transmitted:</strong> Location string (e.g. &quot;Denver, CO&quot;), garden type, sunlight category, growing space in sq ft, and verified crop facts.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>NEVER Transmitted:</strong> Names, email addresses, IP addresses, exact GPS coordinates, browser identifiers, or telemetry cookies.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Safety & Chemical Policy */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4 text-xs sm:text-sm">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Horticultural Safety & Banned Chemicals Policy</span>
        </h3>

        <p className="text-xs text-stone-600 leading-relaxed">
          GrowWise contains a programmatic output validator (<code className="font-mono text-[11px] bg-stone-100 px-1 py-0.5 rounded">validators.py</code>) that screens AI responses:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-red-50/60 border border-red-200 text-red-950">
            <span className="font-bold block text-red-800">Prohibited Hazardous Chemicals:</span>
            <span className="text-[11px] text-red-700 block mt-0.5">Roundup, glyphosate, bleach, and systemic insecticides that damage soil microbiology and pollinators.</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-950">
            <span className="font-bold block text-amber-800">Prohibited Medical Claims:</span>
            <span className="text-[11px] text-amber-700 block mt-0.5">Unverified medical or cure claims regarding herbs (e.g. claiming peppermint cures clinical illnesses).</span>
          </div>
        </div>
      </div>
    </div>
  );
};
