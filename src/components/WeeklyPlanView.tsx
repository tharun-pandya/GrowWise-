import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Download,
  Sparkles,
  ShieldAlert,
  Compass,
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';
import { WeeklyPlanData, GardenProfileData, CropEvaluation } from '../types';
import { aiProviderService, AIExplanationResult } from '../services/aiProviderService';

interface WeeklyPlanViewProps {
  plan: WeeklyPlanData;
  profile: GardenProfileData;
  suitableCrops: CropEvaluation[];
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
  onLogSessionForTask: (taskTitle: string, minutes: number, cropName: string) => void;
}

export const WeeklyPlanView: React.FC<WeeklyPlanViewProps> = ({
  plan,
  profile,
  suitableCrops,
  completedTaskIds,
  onToggleTask,
  onLogSessionForTask,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [aiProviderType, setAiProviderType] = useState<'offline' | 'gemma' | 'gemini'>('offline');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AIExplanationResult | null>(null);
  const [showPromptDetails, setShowPromptDetails] = useState<boolean>(false);
  const [loggedNotice, setLoggedNotice] = useState<string | null>(null);

  // Filter tasks by week
  const weekTasks = plan.tasks.filter((t) => t.weekNumber === selectedWeek);
  const totalTasks = plan.tasks.length;
  const completedCount = plan.tasks.filter((t) => completedTaskIds.includes(t.id)).length;
  const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Handle AI Explanation
  const handleGenerateAi = async () => {
    setIsAiGenerating(true);
    try {
      const res = await aiProviderService.generateExplanation(profile, suitableCrops, aiProviderType);
      setAiResult(res);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Export Markdown
  const handleExportMarkdown = () => {
    let md = `# GrowWise 4-Week Outdoor Gardening Plan\n`;
    md += `**Location**: ${plan.location} | **Garden Type**: ${plan.gardenType}\n`;
    md += `**Target Outdoor Time**: ${plan.outdoorMinutesGoal} minutes total\n\n`;
    md += `## Allocated Crops\n`;
    plan.totalAllocatedCrops.forEach((c) => {
      md += `- ${c}\n`;
    });
    md += `\n## Weekly Task Schedule\n\n`;

    [1, 2, 3, 4].forEach((w) => {
      md += `### Week ${w}\n`;
      plan.tasks
        .filter((t) => t.weekNumber === w)
        .forEach((t) => {
          const isDone = completedTaskIds.includes(t.id) ? '[x]' : '[ ]';
          md += `- ${isDone} **${t.title}** (${t.estimatedDurationMinutes}m)\n`;
          md += `  - Crop: ${t.cropName}\n`;
          md += `  - Description: ${t.description}\n`;
          md += `  - Supplies: ${t.requiredSupplies.join(', ')}\n`;
          md += `  - Safety: ${t.safetyNotes}\n\n`;
        });
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `growwise_plan_${profile.location.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Plan Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                4-Week Actionable Outdoors Schedule
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500 font-medium">Touch Grass Goal: {plan.outdoorMinutesGoal} mins</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-1">
              Weekly Gardening Plan & Outdoors Action Checklist
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Practical, grounded tasks designed to get you outside in your {profile.gardenType}. No toxic chemicals or screen distractions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Markdown</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="pt-4">
          <div className="flex justify-between items-center text-xs font-medium text-stone-700 mb-1.5">
            <span>Overall Plan Progress</span>
            <span className="font-bold text-emerald-800">{completedCount} of {totalTasks} tasks completed ({progressPct}%)</span>
          </div>
          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${progressPct}%` }}
              className="h-full bg-emerald-700 rounded-full transition-all duration-300"
            />
          </div>
        </div>

        {/* Logged notice */}
        {loggedNotice && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{loggedNotice}</span>
          </div>
        )}
      </div>

      {/* Week Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        {[1, 2, 3, 4].map((w) => {
          const wTasks = plan.tasks.filter((t) => t.weekNumber === w);
          const wDone = wTasks.filter((t) => completedTaskIds.includes(t.id)).length;
          return (
            <button
              key={w}
              onClick={() => setSelectedWeek(w)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
                selectedWeek === w
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Week {w}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedWeek === w ? 'bg-emerald-950 text-emerald-200' : 'bg-stone-100 text-stone-600'}`}>
                {wDone}/{wTasks.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Week Tasks List */}
      <div className="space-y-4">
        {weekTasks.map((task) => {
          const isDone = completedTaskIds.includes(task.id);
          return (
            <div
              key={task.id}
              className={`border rounded-2xl p-5 transition-all shadow-xs ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-200 text-stone-600'
                  : 'bg-white border-stone-200 hover:border-emerald-300 text-stone-900'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => onToggleTask(task.id)}
                    className="mt-1 w-4 h-4 accent-emerald-700 cursor-pointer rounded"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-bold text-sm sm:text-base ${isDone ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                        {task.title}
                      </h3>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {task.cropName}
                      </span>
                      {task.outdoorActivity && (
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                          <Compass className="w-3 h-3" />
                          <span>Outdoor Activity</span>
                        </span>
                      )}
                    </div>

                    <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${isDone ? 'text-stone-500' : 'text-stone-600'}`}>
                      {task.description}
                    </p>

                    {/* Supplies and safety */}
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
                        <span className="font-semibold text-stone-700 block text-[11px] mb-1">Supplies Needed:</span>
                        <span className="text-stone-600 text-[11px]">{task.requiredSupplies.join(' · ')}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
                        <span className="font-semibold text-stone-700 block text-[11px] mb-1 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-amber-600" />
                          <span>Safety & Good Practices:</span>
                        </span>
                        <span className="text-stone-600 text-[11px]">{task.safetyNotes}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right action controls */}
                <div className="text-right shrink-0 space-y-2">
                  <span className="text-xs font-semibold text-stone-500 flex items-center justify-end gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>~{task.estimatedDurationMinutes}m</span>
                  </span>

                  <button
                    onClick={() => {
                      onLogSessionForTask(task.title, task.estimatedDurationMinutes, task.cropName);
                      setLoggedNotice(`Logged ${task.estimatedDurationMinutes} minutes outdoor time for "${task.title}"!`);
                      setTimeout(() => setLoggedNotice(null), 3000);
                    }}
                    className="block text-[11px] text-emerald-800 hover:text-emerald-950 font-medium underline"
                  >
                    Log Outdoor Time
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Strategy & Narrative Synthesizer Section */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>AI Gardening Strategy Synthesizer</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Powered by replaceable model provider: Local Open-Weight Gemma, Offline Synthesizer, or Gemini proxy.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={aiProviderType}
              onChange={(e: any) => setAiProviderType(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white outline-none focus:border-emerald-700"
            >
              <option value="offline">Offline Grounded Synthesizer (Instant, 0 MB RAM)</option>
              <option value="gemma">Local Gemma 2 2B (Ollama Endpoint)</option>
              <option value="gemini">Gemini Development Assistant (Cloud Proxy)</option>
            </select>

            <button
              onClick={handleGenerateAi}
              disabled={isAiGenerating}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {isAiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isAiGenerating ? 'Generating...' : 'Synthesize Strategy'}</span>
            </button>
          </div>
        </div>

        {/* AI Output Result */}
        {aiResult && (
          <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-200/60 pb-2">
              <span>Engine: <strong className="text-emerald-900">{aiResult.engineUsed}</strong></span>
              <button
                onClick={() => setShowPromptDetails(!showPromptDetails)}
                className="flex items-center gap-1 text-[11px] text-stone-600 hover:text-stone-900 underline"
              >
                <Eye className="w-3 h-3" />
                <span>{showPromptDetails ? 'Hide Grounded Prompt' : 'Inspect Grounded Prompt'}</span>
              </button>
            </div>

            {showPromptDetails && aiResult.promptSent && (
              <pre className="p-3 rounded-lg bg-stone-900 text-stone-200 text-[11px] font-mono whitespace-pre-wrap overflow-x-auto">
                {aiResult.promptSent}
              </pre>
            )}

            <div className="text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">
              {aiResult.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
