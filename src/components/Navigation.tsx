import React from 'react';
import {
  Sprout,
  CalendarCheck,
  BookOpen,
  Activity,
  ShieldCheck,
  Info,
  Server,
  Terminal,
  ExternalLink
} from 'lucide-react';

export type ActiveView =
  | 'profile'
  | 'recommendations'
  | 'plan'
  | 'progress'
  | 'sources'
  | 'privacy'
  | 'about'
  | 'deployment';

interface NavigationProps {
  currentView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  onRunTests: () => void;
  isRunningTests: boolean;
  hasRunTests: boolean;
  testsSuccess: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onSelectView,
  onRunTests,
  isRunningTests,
  hasRunTests,
  testsSuccess,
}) => {
  const navItems: { id: ActiveView; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Garden Profile', icon: Sprout },
    { id: 'recommendations', label: 'Crop Recommendations', icon: ShieldCheck },
    { id: 'plan', label: 'Weekly Plan', icon: CalendarCheck },
    { id: 'progress', label: 'Outdoor Progress', icon: Activity },
    { id: 'sources', label: 'Knowledge & Sources', icon: BookOpen },
    { id: 'privacy', label: 'AI & Privacy', icon: ShieldCheck },
    { id: 'deployment', label: 'Repo & Render Deploy', icon: Server },
    { id: 'about', label: 'About GrowWise', icon: Info },
  ];

  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div
          onClick={() => onSelectView('profile')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-900 transition-colors">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-emerald-950 tracking-tight">GrowWise</span>
              <span className="text-stone-300 font-bold">·</span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                Hacktoberfest 2026: Touch Grass
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Grounded AI Garden Planner · Open-Weight Gemma Architecture
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRunTests}
            disabled={isRunningTests}
            className={`flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-lg border transition-colors shadow-xs ${
              hasRunTests
                ? testsSuccess
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-red-50 text-red-800 border-red-300'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
            title="Runs full Python backend and rules test suite in container"
          >
            <Terminal className={`w-3.5 h-3.5 ${isRunningTests ? 'animate-spin text-emerald-700' : ''}`} />
            <span>
              {isRunningTests ? 'Running Tests...' : hasRunTests ? (testsSuccess ? 'Tests Passed (23/23)' : 'Tests Failed') : 'Run Test Suite (23 Tests)'}
            </span>
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center space-x-1 overflow-x-auto border-t border-stone-100 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-emerald-700 text-emerald-950 bg-emerald-50/60 font-semibold'
                  : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
