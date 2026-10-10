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

  // API Route: Run real Python unit tests
  app.post('/api/run-tests', async (_req, res) => {
    exec('python3 -m unittest discover tests -v', { cwd: __dirname }, (error, stdout, stderr) => {
      const output = (stdout || '') + (stderr || '');
      const isSuccess = !error;
      const testsCountMatch = output.match(/Ran (\d+) tests/);
      const testsCount = testsCountMatch ? parseInt(testsCountMatch[1], 10) : 0;

      res.json({
        success: isSuccess,
        exitCode: error ? error.code : 0,
        testsCount,
        output: output.trim(),
      });
    });
  });

  // API Route: Fetch Python files for in-browser inspection & copy
  app.get('/api/python-files', (_req, res) => {
    try {
      const files: Record<string, string> = {
        'growwise/knowledge_base.py': fs.readFileSync(path.join(__dirname, 'growwise/knowledge_base.py'), 'utf-8'),
        'growwise/rules.py': fs.readFileSync(path.join(__dirname, 'growwise/rules.py'), 'utf-8'),
        'growwise/ai_engine.py': fs.readFileSync(path.join(__dirname, 'growwise/ai_engine.py'), 'utf-8'),
        'app.py': fs.readFileSync(path.join(__dirname, 'app.py'), 'utf-8'),
        'tests/test_knowledge_base.py': fs.readFileSync(path.join(__dirname, 'tests/test_knowledge_base.py'), 'utf-8'),
        'tests/test_rules.py': fs.readFileSync(path.join(__dirname, 'tests/test_rules.py'), 'utf-8'),
        'tests/test_ai_engine.py': fs.readFileSync(path.join(__dirname, 'tests/test_ai_engine.py'), 'utf-8'),
        'requirements.txt': fs.readFileSync(path.join(__dirname, 'requirements.txt'), 'utf-8'),
        'README.md': fs.readFileSync(path.join(__dirname, 'README.md'), 'utf-8'),
      };
      res.json({ success: true, files });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: AI Generation proxy (Gemini with grounded prompt)
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
          systemInstruction: systemInstruction || 'You are GrowWise horticultural planner. Rely strictly on provided facts.',
          temperature: 0.2,
        },
      });

      return res.json({
        success: true,
        text: response.text || '',
        engine: 'Gemini 2.5 Flash (via proxy)',
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
