import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
}) : null;

// Helper to check AI availability
function checkAIClient(res: Response): boolean {
  if (!ai) {
    res.status(503).json({
      error: 'GEMINI_API_KEY is not configured. The System operates in autonomous offline protocol.',
    });
    return false;
  }
  return true;
}

// 1. AI Coach Endpoint (Goggins / System Protocol)
app.post('/api/ai/coach', async (req: Request, res: Response) => {
  try {
    if (!checkAIClient(res)) return;

    const { message, mode, callToDarkness, hunterContext, history } = req.body;

    const isGoggins = mode === 'GOGGINS' || callToDarkness === true;

    const systemPrompt = isGoggins
      ? `You are "THE SYSTEM" operating under the brutal GOGGINS PROTOCOL inside the Solo Leveling universe.
You speak with absolute discipline, cold authority, and David Goggins' relentless, zero-excuse mentality.
The user is a registered Hunter in the System.
Current Hunter Stats & Status:
- Name: ${hunterContext?.name || 'Hunter'}
- Rank: ${hunterContext?.rank || 'E-Rank'}
- Level: ${hunterContext?.level || 1}
- Primary Class: ${hunterContext?.classType || 'Warrior'}
- Current Goal: ${hunterContext?.goal || 'Total Transformation'}
- Active Challenge: ${hunterContext?.activeChallenge || 'None'}

RULES OF ENGAGEMENT:
1. NO SOFT WORDS. No participation trophies. No excuses accepted.
2. Emphasize progressive overload, suffering as a crucible, mental callus, and unbreakable discipline.
3. Keep the tone like an anime System notification mixed with Goggins: intense, commanding, punchy, concise, formatted with system alerts, bulleted mandates, or direct challenges.
4. If the user complains of fatigue, soreness, doubt, or wanting to quit: dismantle their weakness instantly. Call them out. Demand they take souls and get after it.
5. Provide actionable physical protocols, recovery advice with mental discipline, and diet standards when asked.`
      : `You are "THE SYSTEM" from Solo Leveling: an ancient, authoritative, holographic intelligence that guides the user's awakening and evolution.
Current Hunter Profile:
- Name: ${hunterContext?.name || 'Hunter'}
- Rank: ${hunterContext?.rank || 'E-Rank'}
- Level: ${hunterContext?.level || 1}
- Class: ${hunterContext?.classType || 'Warrior'}
- Active Challenge: ${hunterContext?.activeChallenge || 'Daily System Quest'}

RULES:
1. Speak with chilling composure, cosmic authority, and regal gravitas.
2. Address the user as Hunter or their designation.
3. Give precise, disciplined guidance on workouts, nutrition, recovery protocols, and mental focus.
4. Format responses cleanly using System Terminal brackets [SYSTEM NOTICE], [DIRECTIVE], or [REQUIREMENT] where appropriate.
5. Maximize discipline and real-world results.`;

    const formattedContents = [];
    if (Array.isArray(history) && history.length > 0) {
      // Include last 6 messages for context
      for (const h of history.slice(-6)) {
        formattedContents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      }
    }

    formattedContents.push({
      role: 'user',
      parts: [{ text: message || 'Hunter status check.' }],
    });

    const response = await ai!.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemPrompt,
        temperature: isGoggins ? 0.9 : 0.6,
      },
    });

    res.json({
      text: response.text || '[SYSTEM ERROR: Telemetry disrupted. Regroup and execute.]',
      mode: isGoggins ? 'GOGGINS' : 'STANDARD',
    });
  } catch (error: any) {
    console.error('Error in /api/ai/coach:', error);
    res.status(500).json({
      error: error?.message || 'Failed to communicate with System intelligence',
    });
  }
});

// 2. Gate Library Paranormal Research Endpoint
app.post('/api/ai/research', async (req: Request, res: Response) => {
  try {
    if (!checkAIClient(res)) return;

    const { query, category } = req.body;

    const systemPrompt = `You are the ARCHIVIST of "THE GATE LIBRARY" inside the Solo Leveling system.
You analyze paranormal phenomena, higher dimensions (4D space-time), consciousness anomalies, astral mechanics, quantum entanglement, and esoteric metaphysical phenomena.
Style requirements:
- Highly rigorous, academic yet arcane, disciplined, and empirical.
- Treat paranormal and metaphysical phenomena not as silly folklore, but with serious investigative depth, quantum physics analogies, cognitive science frameworks, and historical documentation.
- Provide structured dossiers:
  1. CLASSIFICATION & SUMMARY
  2. THEORETICAL MECHANISM (physics / consciousness basis)
  3. RECORDED PROTOCOLS & DISCIPLINARY PRACTICES
  4. GATE ASSESSMENT / HAZARDS
- Keep it intriguing, grounded in discipline, and profoundly atmospheric.`;

    const response = await ai!.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Category: ${category || 'Paranormal Phenomena'}\nResearch Subject: ${query}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({
      text: response.text || 'Archive records incomplete.',
    });
  } catch (error: any) {
    console.error('Error in /api/ai/research:', error);
    res.status(500).json({
      error: error?.message || 'Archive query failed',
    });
  }
});

// 3. AI Dynamic Quest Generator
app.post('/api/ai/generate-quest', async (req: Request, res: Response) => {
  try {
    if (!checkAIClient(res)) return;

    const { hunterRank, classType, weakness, preferredDomain } = req.body;

    const systemPrompt = `You generate a brutal, disciplined quest for a Hunter in the Solo Leveling System.
Rank: ${hunterRank || 'E-Rank'}
Class: ${classType || 'Warrior'}
Weakness to target: ${weakness || 'General endurance'}
Domain: ${preferredDomain || 'Physical conditioning'}

Respond ONLY with valid JSON in this format:
{
  "title": "Quest title (e.g., Crucible of the Iron Core)",
  "description": "2-sentence brutal mandate explaining the objective and why it builds the Hunter",
  "category": "Fitness" | "Mental" | "Discipline" | "Recovery",
  "xpReward": 250,
  "difficulty": 1 to 5,
  "requirements": [
    "Requirement 1 (e.g., 75 Slow-Cadence Pushups)",
    "Requirement 2 (e.g., 100 Bodyweight Squats)",
    "Requirement 3 (e.g., 10-Minute Cold Water Recovery)"
  ],
  "penalty": "Description of consequence if failed before midnight"
}`;

    const response = await ai!.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Generate an authentic System Quest now.',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/generate-quest:', error);
    res.status(500).json({
      error: 'Failed to synthesize quest',
    });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SOLO ARISE] System core listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
