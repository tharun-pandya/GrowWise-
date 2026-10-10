import React, { useState, useEffect } from 'react';
import { Navigation, ActiveView } from './components/Navigation';
import { LandingHero } from './components/LandingHero';
import { GardenProfileForm } from './components/GardenProfileForm';
import { PlantRecommendations } from './components/PlantRecommendations';
import { WeeklyPlanView } from './components/WeeklyPlanView';
import { ProgressDashboard } from './components/ProgressDashboard';
import { KnowledgeSourcesView } from './components/KnowledgeSourcesView';
import { AiPrivacyView } from './components/AiPrivacyView';
import { AboutView } from './components/AboutView';
import { DeploymentView } from './components/DeploymentView';
import { GardenProfileData, OutdoorSession } from './types';
import { storageService, defaultProfile } from './services/storageService';
import {
  evaluateCropsDeterministically,
  generateWeeklyPlan,
  LOCAL_CROPS_DATABASE
} from './services/recommendationEngine';
import { getApiUrl } from './services/apiConfig';

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveView>('profile');
  const [profile, setProfile] = useState<GardenProfileData>(defaultProfile);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [sessions, setSessions] = useState<OutdoorSession[]>([]);

  // Test suite state
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [hasRunTests, setHasRunTests] = useState<boolean>(false);
  const [testsSuccess, setTestsSuccess] = useState<boolean>(false);
  const [testOutput, setTestOutput] = useState<string>('');
  const [testsCount, setTestsCount] = useState<number>(0);

  // Load from storage on mount
  useEffect(() => {
    const p = storageService.getProfile();
    setProfile(p);
    setCompletedTaskIds(storageService.getCompletedTaskIds());
    setSessions(storageService.getOutdoorSessions());
  }, []);

  // Compute deterministic recommendations
  const { suitable, excluded } = evaluateCropsDeterministically(profile, LOCAL_CROPS_DATABASE);
  const weeklyPlan = generateWeeklyPlan(profile, suitable);

  // Save profile handler
  const handleSaveProfile = (newProfile: GardenProfileData) => {
    setProfile(newProfile);
    storageService.saveProfile(newProfile);
    setCurrentView('recommendations');
  };

  // Toggle task completed
  const handleToggleTask = (taskId: string) => {
    const updated = storageService.toggleTaskCompleted(taskId);
    setCompletedTaskIds(updated);
  };

  // Add outdoor session
  const handleAddSession = (session: Omit<OutdoorSession, 'id'>) => {
    const updated = storageService.addOutdoorSession(session);
    setSessions(updated);
  };

  // Log session directly for a task
  const handleLogSessionForTask = (taskTitle: string, minutes: number, cropName: string) => {
    handleAddSession({
      date: new Date().toISOString().split('T')[0],
      minutes,
      notes: `Outdoor task completed: ${taskTitle}`,
      cropName,
    });
  };

  // Clear data
  const handleClearData = () => {
    storageService.clearAllData();
    setProfile(defaultProfile);
    setCompletedTaskIds([]);
    setSessions([]);
  };

  // Run backend unit tests via API
  const handleRunTests = async () => {
    setIsRunningTests(true);
    setHasRunTests(true);
    try {
      const res = await fetch(getApiUrl('/api/run-tests'), { method: 'POST' });
      const data = await res.json();
      setTestsSuccess(data.success);
      setTestOutput(data.output || 'No output recorded');
      setTestsCount(data.testsCount || 23);
    } catch (err: any) {
      setTestsSuccess(false);
      setTestOutput('Failed to execute test runner: ' + err.message);
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navigation
        currentView={currentView}
        onSelectView={setCurrentView}
        onRunTests={handleRunTests}
        isRunningTests={isRunningTests}
        hasRunTests={hasRunTests}
        testsSuccess={testsSuccess}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full">
        {/* Landing Hero (Displayed on Profile view if desired, or quick banner) */}
        {currentView === 'profile' && (
          <LandingHero
            onStartPlanning={() => {
              const el = document.getElementById('profile-form-anchor');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onExploreKnowledge={() => setCurrentView('sources')}
          />
        )}

        {/* View Routing */}
        <div id="profile-form-anchor">
          {currentView === 'profile' && (
            <GardenProfileForm
              initialProfile={profile}
              onSaveProfile={handleSaveProfile}
            />
          )}

          {currentView === 'recommendations' && (
            <PlantRecommendations
              suitable={suitable}
              excluded={excluded}
              profile={profile}
              onGoToPlan={() => setCurrentView('plan')}
              onExplainAi={() => setCurrentView('plan')}
            />
          )}

          {currentView === 'plan' && (
            <WeeklyPlanView
              plan={weeklyPlan}
              profile={profile}
              suitableCrops={suitable}
              completedTaskIds={completedTaskIds}
              onToggleTask={handleToggleTask}
              onLogSessionForTask={handleLogSessionForTask}
            />
          )}

          {currentView === 'progress' && (
            <ProgressDashboard
              completedTaskIds={completedTaskIds}
              totalTasksCount={weeklyPlan.tasks.length}
              sessions={sessions}
              onAddSession={handleAddSession}
              onClearData={handleClearData}
            />
          )}

          {currentView === 'sources' && <KnowledgeSourcesView />}

          {currentView === 'privacy' && <AiPrivacyView />}

          {currentView === 'deployment' && (
            <DeploymentView
              onRunTests={handleRunTests}
              isRunningTests={isRunningTests}
              testOutput={testOutput}
              testSuccess={testsSuccess}
              testsCount={testsCount}
            />
          )}

          {currentView === 'about' && <AboutView />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-3">
          <div>
            <span className="font-semibold text-stone-700">GrowWise</span> · Built for Hacktoberfest 2026 Open-Source AI Challenge (Week 1: Touch Grass)
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('privacy')}
              className="hover:text-stone-900 underline"
            >
              Privacy & AI Disclosures
            </button>
            <button
              onClick={() => setCurrentView('sources')}
              className="hover:text-stone-900 underline"
            >
              Verified Agricultural Sources
            </button>
            <button
              onClick={() => setCurrentView('deployment')}
              className="hover:text-stone-900 underline"
            >
              Render & GitHub Guide
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
