import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google Gen AI with GEMINI_API_KEY from environment
const ai = new GoogleGenAI({});

// API route for AI Herbal Medicine & Doctor Support Assistant
app.post('/api/herbal-assistant', async (req, res) => {
  try {
    const { query, userContext } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    const systemInstruction = `You are the LifeShield Herbal Medicine & Home Care AI Guide.
Your role is to explain traditional home preparation methods (decoctions, infusions, teas, pastes) and rigorously emphasize safety and medical contraindications.

Strict Medical & Safety Rules:
1. Always clarify you provide informational herbal preparation guidance, NOT medical diagnosis or prescription.
2. If the user mentions prescription medications (e.g. anticoagulants/blood thinners, diabetes medication, anti-hypertensives), alert them to potential herb-drug interactions.
3. For acute, high-risk, or severe symptoms (e.g., chest pain, high fever >103°F, severe shortness of breath, sudden neurological deficits), strictly instruct the user to seek immediate emergency medical care (Hotline 108/112).
4. Provide structured, practical preparation steps:
   - Ingredients with safe kitchen measurements.
   - Preparation method (steep time, boiling temperature, simmer instructions).
   - Safe recommended dosage and duration limit (e.g., not longer than 1-2 weeks without physician review).
   - Contraindications & Cautions (pregnancy, chronic kidney/liver conditions, ulcers).
   - When to consult a qualified Doctor/Vaidya.
5. Suggest relevant YouTube preparation search terms or video topics (e.g., "Authentic Tulsi Kadha preparation", "Traditional Golden Milk recipe").
6. Keep the tone calm, respectful, structured, and clear.`;

    const prompt = `User Query: ${query}
${userContext ? `User Health Context: ${JSON.stringify(userContext)}` : ''}

Please provide clear preparation steps, safety cautions, and advice on when to connect with a doctor.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      }
    });

    const reply = response.text || 'Unable to generate herbal guidance at this moment. Please consult a qualified clinician.';

    return res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/herbal-assistant:', error);
    // Graceful fallback response if API key is not yet set or model request fails
    return res.status(500).json({
      error: 'Failed to generate response from AI herbal assistant',
      message: error?.message || 'Server error',
      fallback: `Preparation Guide:
• Ingredients: Use standard measured culinary herbs (e.g., 4-5 fresh tulsi leaves or 1/2 tsp pure turmeric with black pepper).
• Preparation: Simmer in water for 5-8 minutes or steep covered.
• Safety Note: Consult your doctor before using herbal remedies, especially if pregnant or on blood thinners.
• Emergency: If symptoms worsen, call local emergency medical services (108/112).`
    });
  }
});

// Production static files vs Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LifeShield server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
