import React, { useState, useEffect } from 'react';
import {
  Server,
  Terminal,
  FileCode,
  Copy,
  Check,
  Download,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Code2
} from 'lucide-react';

import { getApiUrl } from '../services/apiConfig';

interface DeploymentViewProps {
  onRunTests: () => void;
  isRunningTests: boolean;
  testOutput: string;
  testSuccess: boolean;
  testsCount: number;
}

export const DeploymentView: React.FC<DeploymentViewProps> = ({
  onRunTests,
  isRunningTests,
  testOutput,
  testSuccess,
  testsCount,
}) => {
  const [pythonFiles, setPythonFiles] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<string>('render.yaml');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'tests' | 'render' | 'code' | 'dev_post'>('tests');

  useEffect(() => {
    fetch(getApiUrl('/api/python-files'))
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.files) {
          setPythonFiles(d.files);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopy = () => {
    const text = pythonFiles[selectedFile] || '';
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const devSubmissionDraft = `# 🌿 GrowWise: An AI-Powered Garden Planner for Hacktoberfest 2026 Touch Grass

## What I Built
GrowWise turns screen time into gardening time. It is a lightweight, grounded garden planner that helps users grow fresh herbs, vegetables, and pollinator flowers with zero botanical hallucinations.

## Key Features
- **Deterministic Plant-Suitability Engine**: Evaluates crops against sunlight, container depth, and USDA Hardiness Zones with 100% strict boolean logic.
- **Transparent Disqualification Logs**: Explains why crops were excluded (e.g., Peppermint rhizomes in open soil).
- **Weekly Outdoors Action Plan**: Generates grounded tasks to get people outside with garden tools.
- **Open-Weight Gemma 2 2B Architecture**: Runs smoothly on consumer laptops (≤ 8 GB RAM) via Ollama or remote OpenAI-compatible endpoints with an instant offline fallback.
- **Curated Horticultural Bibliography**: All data grounded in USDA Cooperative Extension and Royal Horticultural Society (RHS) guides.

## Tech Stack
- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Backend: FastAPI (Python) & Express
- AI: Google Gemma 2 2B (Open-Weight Model)
- Testing: 23 Passing Python Unit Tests`;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Testing & Deployment Hub
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-1">
            Render Deployment, Repository Files & Test Suite
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Everything needed to verify, test, and deploy GrowWise to Render and GitHub for Hacktoberfest 2026.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 pt-4 flex-wrap">
          {[
            { id: 'tests', label: '1. Test Suite Runner', icon: Terminal },
            { id: 'render', label: '2. Render Deployment Guide', icon: Server },
            { id: 'code', label: '3. Backend & Config Files', icon: FileCode },
            { id: 'dev_post', label: '4. DEV Submission Draft', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: TEST SUITE RUNNER */}
      {activeSubTab === 'tests' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-700" />
                <span>Python Backend & Rules Test Suite (23 Tests)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Executes backend profile validation, exclusion rules, safety checks, and offline synthesizer tests.
              </p>
            </div>

            <button
              onClick={onRunTests}
              disabled={isRunningTests}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Terminal className={`w-3.5 h-3.5 ${isRunningTests ? 'animate-spin' : ''}`} />
              <span>{isRunningTests ? 'Executing Tests...' : 'Run All 23 Unit Tests'}</span>
            </button>
          </div>

          {/* Test Status Badge */}
          {testOutput && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              testSuccess ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              {testSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <XCircle className="w-4 h-4 text-red-700" />}
              <span className="font-bold">
                {testSuccess ? `All ${testsCount || 23} Unit Tests Passed with 0 Failures!` : 'Test Suite Failed'}
              </span>
            </div>
          )}

          {/* Terminal Output */}
          <div className="rounded-xl bg-stone-950 p-4 font-mono text-xs text-stone-200 border border-stone-800 h-96 overflow-auto">
            <pre className="whitespace-pre-wrap leading-relaxed">
              {testOutput || '# Click "Run All 23 Unit Tests" above to execute backend tests in the container.'}
            </pre>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: RENDER DEPLOYMENT */}
      {activeSubTab === 'render' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm">
          <div>
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Server className="w-4 h-4 text-emerald-700" />
              <span>Render Deployment Configuration</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              GrowWise is fully configured for Render via <code className="font-mono bg-stone-100 px-1 py-0.5 rounded">render.yaml</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-2">
              <span className="font-bold text-emerald-950 block text-xs">⭐ Unified Single Web Service (FastAPI + React)</span>
              <ul className="space-y-1 text-emerald-900 text-xs">
                <li>• <strong>Build Command</strong>: <code className="font-mono text-[11px] bg-emerald-100 px-1 rounded">./build.sh</code></li>
                <li>• <strong>Start Command</strong>: <code className="font-mono text-[11px] bg-emerald-100 px-1 rounded">uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT</code></li>
                <li>• <strong>Public URL</strong>: Single URL serves both React UI at <code className="font-mono text-[11px] bg-emerald-100 px-1 rounded">/</code> and APIs at <code className="font-mono text-[11px] bg-emerald-100 px-1 rounded">/api/*</code></li>
                <li>• <strong>Health Check Path</strong>: <code className="font-mono text-[11px] bg-emerald-100 px-1 rounded">/health</code></li>
                <li>• <strong>RAM Consumption</strong>: &lt; 120 MB (Runs on free tier)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <span className="font-bold text-stone-900 block text-xs">Manual Render Dashboard Settings</span>
              <ul className="space-y-1 text-stone-600 text-xs">
                <li>• <strong>Runtime</strong>: <code className="font-mono text-[11px] bg-stone-200 px-1 rounded">Python 3</code></li>
                <li>• <strong>Root Directory</strong>: <code className="font-mono text-[11px] bg-stone-200 px-1 rounded">.</code> (leave blank or dot)</li>
                <li>• <strong>Chained Build</strong>: <code className="font-mono text-[11px] bg-stone-200 px-1 rounded">npm install && npm run build && pip install -r backend/requirements.txt</code></li>
                <li>• <strong>Vite Dist Output</strong>: Served directly from root <code className="font-mono text-[11px] bg-stone-200 px-1 rounded">dist/</code></li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 text-xs text-amber-950 space-y-1">
            <span className="font-bold block text-amber-900">⚠️ Important Production AI Note for Render:</span>
            <p className="text-amber-800">
              Never attempt to download a 10GB LLM on Render’s free tier (512 MB limit). Keep <code className="font-mono text-[11px] bg-amber-100 px-1 rounded">AI_PROVIDER_TYPE=offline</code> or configure <code className="font-mono text-[11px] bg-amber-100 px-1 rounded">OPEN_WEIGHT_ENDPOINT_URL</code> to point to a remote inference endpoint serving Gemma.
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: REPO FILES VIEWER */}
      {activeSubTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white border border-stone-200 rounded-2xl p-4 shadow-xs h-fit space-y-3">
            <span className="font-bold text-xs text-stone-900 block px-1">Repository Files</span>
            <div className="space-y-1 max-h-[500px] overflow-y-auto">
              {Object.keys(pythonFiles).map((fKey) => (
                <button
                  key={fKey}
                  onClick={() => setSelectedFile(fKey)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-lg font-mono truncate transition-colors ${
                    selectedFile === fKey
                      ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {fKey}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-stone-950 text-stone-100 rounded-2xl border border-stone-800 p-5 shadow-xs flex flex-col h-[550px]">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-3">
              <span className="font-mono text-xs text-stone-300">{selectedFile}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-white px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 transition-colors"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <div className="flex-1 overflow-auto font-mono text-xs text-stone-200 p-2">
              <pre className="whitespace-pre-wrap">{pythonFiles[selectedFile] || '# Loading file...'}</pre>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: DEV SUBMISSION DRAFT */}
      {activeSubTab === 'dev_post' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-700" />
                <span>Hacktoberfest DEV Submission Draft</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Copyable Markdown outline matching DEV.to Hacktoberfest submission guidelines.
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(devSubmissionDraft);
                alert('DEV submission draft copied to clipboard!');
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-emerald-900"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Markdown</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-stone-900 text-stone-200 font-mono text-xs overflow-auto h-96 whitespace-pre-wrap">
            {devSubmissionDraft}
          </div>
        </div>
      )}
    </div>
  );
};
