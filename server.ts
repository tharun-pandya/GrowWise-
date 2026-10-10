import express from 'express';
import { createServer as createViteServer } from 'vite';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Helper to load JSON files
  const loadJsonFile = (relPath: string) => {
    const fullPath = path.join(__dirname, relPath);
    if (fs.existsSync(fullPath)) {
      return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    }
    return [];
  };

  // API Route: Health check
  app.get('/api/health', (_req, res) => {
    const crops = loadJsonFile('data/crops.json');
    const sources = loadJsonFile('data/gardening_sources.json');
    res.json({
      status: 'healthy',
      app: 'GrowWise - AI Garden Planner',
      cropsCount: crops.length,
      sourcesCount: sources.length,
      aiProvider: process.env.AI_PROVIDER_TYPE || 'offline',
    });
  });

  // API Route: Crops database
  app.get('/api/crops', (_req, res) => {
    const crops = loadJsonFile('data/crops.json');
    res.json(crops);
  });

  // API Route: Gardening sources
  app.get('/api/sources', (_req, res) => {
    const sources = loadJsonFile('data/gardening_sources.json');
    res.json(sources);
  });

  // API Route: Run full Python test suites
  app.post('/api/run-tests', (_req, res) => {
    exec(
      'python3 -m unittest backend/tests/test_backend.py tests/test_knowledge_base.py tests/test_rules.py tests/test_ai_engine.py -v',
      { cwd: __dirname },
      (error, stdout, stderr) => {
        const output = (stdout || '') + (stderr || '');
        const isSuccess = !error;
        const testsCountMatch = output.match(/Ran (\d+) tests/);
        const testsCount = testsCountMatch ? parseInt(testsCountMatch[1], 10) : 23;

        res.json({
          success: isSuccess,
          exitCode: error ? error.code : 0,
          testsCount,
          output: output.trim(),
        });
      }
    );
  });

  // API Route: Fetch Python and config files for in-browser inspection & copy
  app.get('/api/python-files', (_req, res) => {
    try {
      const readFileSafe = (p: string) => {
        const full = path.join(__dirname, p);
        return fs.existsSync(full) ? fs.readFileSync(full, 'utf-8') : '# File not found';
      };

      const files: Record<string, string> = {
        'data/crops.json': readFileSafe('data/crops.json'),
        'data/gardening_sources.json': readFileSafe('data/gardening_sources.json'),
        'backend/app/main.py': readFileSafe('backend/app/main.py'),
        'backend/app/schemas.py': readFileSafe('backend/app/schemas.py'),
        'backend/app/garden_engine.py': readFileSafe('backend/app/garden_engine.py'),
        'backend/app/model_provider.py': readFileSafe('backend/app/model_provider.py'),
        'backend/app/validators.py': readFileSafe('backend/app/validators.py'),
        'backend/tests/test_backend.py': readFileSafe('backend/tests/test_backend.py'),
        'render.yaml': readFileSafe('render.yaml'),
        'docs/RENDER_DEPLOYMENT.md': readFileSafe('docs/RENDER_DEPLOYMENT.md'),
        'docs/HACKTOBERFEST_SUBMISSION.md': readFileSafe('docs/HACKTOBERFEST_SUBMISSION.md'),
        'README.md': readFileSafe('README.md'),
      };
      res.json({ success: true, files });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: AI Generation proxy (Optional Gemini assistant / open-weight fallback)
  app.post('/api/ai-explain', async (req, res) => {
    const { prompt, systemInstruction } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        success: false,
        fallback: true,
        message: 'No GEMINI_API_KEY configured. Falling back to offline grounded synthesizer.',
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction:
            systemInstruction ||
            'You are GrowWise horticultural planner for Hacktoberfest Touch Grass. Rely strictly on provided facts.',
          temperature: 0.2,
        },
      });

      return res.json({
        success: true,
        text: response.text || '',
        engine: 'Gemini 2.5 Flash (Development Assistant Proxy)',
      });
    } catch (err: any) {
      return res.json({
        success: false,
        error: err.message,
        fallback: true,
      });
    }
  });

  // Attach Vite middleware for frontend development
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GrowWise server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
