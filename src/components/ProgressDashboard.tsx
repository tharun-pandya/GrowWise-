import React, { useState } from 'react';
import {
  Activity,
  Clock,
  CheckCircle2,
  Calendar,
  Plus,
  Compass,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { OutdoorSession } from '../types';

interface ProgressDashboardProps {
  completedTaskIds: string[];
  totalTasksCount: number;
  sessions: OutdoorSession[];
  onAddSession: (session: Omit<OutdoorSession, 'id'>) => void;
  onClearData: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  completedTaskIds,
  totalTasksCount,
  sessions,
  onAddSession,
  onClearData,
}) => {
  const [minutesInput, setMinutesInput] = useState<number>(30);
  const [cropInput, setCropInput] = useState<string>('General Garden Maintenance');
  const [notesInput, setNotesInput] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const totalOutdoorMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
  const totalHours = (totalOutdoorMinutes / 60).toFixed(1);

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (minutesInput > 0) {
      onAddSession({
        date: new Date().toISOString().split('T')[0],
        minutes: minutesInput,
        notes: notesInput || 'Step outside to care for the garden.',
        cropName: cropInput,
      });
      setNotesInput('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Outdoor Activity & Touch-Grass Tracker
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-1">
            Gardening Progress & Outdoor Time Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Track your real-world progress away from screens. Every minute logged represents real dirt, fresh air, and outdoor activity.
          </p>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-stone-500 text-xs flex items-center gap-1.5 font-medium">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>Total Outdoor Time</span>
            </span>
            <div className="mt-1">
              <span className="text-2xl font-extrabold text-emerald-950">{totalOutdoorMinutes} mins</span>
              <span className="text-xs text-emerald-700 block mt-0.5">({totalHours} hours touching grass)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500 text-xs flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Tasks Completed</span>
            </span>
            <div className="mt-1">
              <span className="text-2xl font-extrabold text-stone-900">{completedTaskIds.length} tasks</span>
              <span className="text-xs text-stone-500 block mt-0.5">out of {totalTasksCount} scheduled</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500 text-xs flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-stone-500" />
              <span>Gardening Sessions Logged</span>
            </span>
            <div className="mt-1">
              <span className="text-2xl font-extrabold text-stone-900">{sessions.length} sessions</span>
              <span className="text-xs text-stone-500 block mt-0.5">Recorded in browser</span>
            </div>
          </div>
        </div>

        {/* Privacy & Local Storage Disclosure */}
        <div className="mt-5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <span>
            <strong>Local Storage Guarantee:</strong> Your progress and outdoor sessions are stored strictly on your device’s browser storage (<code className="font-mono text-[11px] bg-stone-200 px-1 py-0.5 rounded">localStorage</code>). Data does not sync between computers and will be cleared if your browser cache is wiped.
          </span>
        </div>
      </div>

      {/* Log a New Session */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Outdoor Gardening Sessions Log</span>
          </h3>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Cancel' : 'Log Outdoor Session'}</span>
          </button>
        </div>

        {/* Add Session Form */}
        {isAdding && (
          <form onSubmit={handleAddSession} className="p-4 rounded-xl bg-stone-50 border border-stone-200 mb-6 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Minutes Spent Outdoors</label>
                <input
                  type="number"
                  min="5"
                  max="480"
                  step="5"
                  value={minutesInput}
                  onChange={(e) => setMinutesInput(parseInt(e.target.value) || 15)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Focus Crop or Activity</label>
                <input
                  type="text"
                  value={cropInput}
                  onChange={(e) => setCropInput(e.target.value)}
                  placeholder="e.g. Cherry Tomato pruning or soil prep"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Notes / Observations (Optional)</label>
              <textarea
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="What did you observe? Did seedlings emerge? How did the soil feel?"
                rows={2}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors"
              >
                Save Session
              </button>
            </div>
          </form>
        )}

        {/* Session history */}
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-6">
              No outdoor sessions logged yet. Step outside and record your first gardening session!
            </p>
          ) : (
            sessions.map((sess) => (
              <div
                key={sess.id}
                className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/40 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{sess.cropName || 'Garden Maintenance'}</span>
                    <span className="text-[10px] text-stone-400">·</span>
                    <span className="text-stone-500">{sess.date}</span>
                  </div>
                  <p className="text-stone-600 mt-1">{sess.notes}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                    +{sess.minutes} mins
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Clear Data Button */}
        <div className="pt-6 border-t border-stone-100 flex justify-end">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset your local progress and outdoor sessions?')) {
                onClearData();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Local Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
