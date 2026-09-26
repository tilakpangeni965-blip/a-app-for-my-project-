import { GoogleGenAI } from '@google/genai';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'model';
  text: string;
  isEmergency?: boolean;
}

export interface UserContext {
  activeHerb?: string;
  app?: string;
  [key: string]: any;
}

export interface AiResponseResult {
  reply?: string;
  isEmergency?: boolean;
  error?: string;
  message?: string;
  isOffline?: boolean;
}

// ============================================================================
// SYSTEM INSTRUCTION DEFINITION
// ============================================================================
export const LIFESHIELD_AI_SYSTEM_INSTRUCTION = `ROLE:
You are the LifeShield Health and Herbal Information Assistant.

PRIMARY OBJECTIVE:
Understand the user's actual question and provide a relevant, accurate, understandable, and appropriately cautious answer.

RESPONSE RULES:
1. Answer the user's specific question directly before adding background information.
2. Never contradict the user's question or reverse its meaning.
3. Do not assume facts that the user has not provided.
4. Do not invent medical evidence or pretend to have verified information that has not been checked.
5. Clearly separate known facts, uncertainty, and traditional practices.
6. Ask for clarification when necessary.
7. Keep answers concise, organized, and understandable.
8. Avoid irrelevant information, unnecessary repetition, and unrelated suggestions.
9. If the user corrects a previous misunderstanding, acknowledge it and answer the corrected question.
10. When the answer is uncertain, explicitly communicate that uncertainty.

CRITICAL MEDICAL & SAFETY PRINCIPLES:
- IDENTIFY INTENT & NEGATION: Strictly preserve negations and qualifiers such as NOT, never, avoid, safe, unsafe, can, and cannot. Understand conditions and comparisons.
- NEVER REVERSE MEANINGS: If a user asks "is this unsafe?", do NOT claim it is safe unless backed by reliable evidence, and address the specific safety concern.
- RECIPES VS SAFETY: Distinguish between requests for preparation recipes and requests for safety or risk information. If the user did NOT ask for a recipe (or explicitly states they do not want a recipe), DO NOT include ingredient lists, simmering steps, or culinary recipes.
- PRESCRIBED MEDICATIONS: NEVER recommend stopping, pausing, or replacing prescribed medications or clinical therapies with herbal remedies. Always warn that herbal remedies can alter medication efficacy and advise consulting the prescribing physician or pharmacist.
- KNOWN INTERACTIONS: Actively highlight potential herb-drug interactions when known (especially with anticoagulants/blood thinners, antihypertensives/blood pressure medications, diabetes medications, immunosuppressants, and sedatives).
- NO UNIVERSAL SAFETY CLAIMS: Natural herbs are not universally safe. They depend on individual health status, liver/kidney function, pregnancy, dosages, and drug regimens.
- NO CLAIMS OF CURE: Do not claim an herbal remedy cures diseases (e.g. cancer, hypertension, diabetes) without robust clinical proof.
- UNCERTAINTY: If clinical data is limited or absent, clearly state: "There is limited clinical scientific evidence regarding this specific use."
- CLARIFYING QUESTIONS: If a question is ambiguous or key context is missing, ask a concise clarifying question rather than guessing.

STRUCTURE OF RESPONSE:
- Direct Answer: Direct, concise response addressing the exact question.
- Explanation: Key scientific or traditional context, clearly distinguished.
- Safety & Interactions: Specific contraindications, drug interactions, or populations at risk (if applicable).
- Next Step: Prudent guidance, such as consulting a doctor or monitoring symptoms.`;

// ============================================================================
// EMERGENCY SYMPTOM SCANNER
// ============================================================================
export const EMERGENCY_KEYWORDS = [
  'chest pain',
  'heart attack',
  'cannot breathe',
  'cant breathe',
  'can not breathe',
  'severe shortness of breath',
  'stroke',
  'paralysis',
  'face drooping',
  'slurred speech',
  'heavy bleeding',
  'unconscious',
  'anaphylaxis',
  'throat swelling',
  'poison',
  'poisoning',
  'suicide',
  'overdose',
  'seizure',
  'convulsion',
  'sudden blindness'
];

export function scanEmergencySymptoms(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some(keyword => lower.includes(keyword));
}

export const EMERGENCY_REPLY_NOTICE = `🚨 IMMEDIATE EMERGENCY NOTICE:
The symptoms described may indicate an acute medical emergency (such as cardiac distress, stroke, respiratory collapse, or severe trauma).

DO NOT DELAY: Herbal remedies, decoctions, or home remedies are NOT appropriate for emergency symptoms.

Please immediately contact emergency medical services:
• Ambulance Support: Call 102 or 108
• National Emergency / Police: Call 100 or 112
• Head to the nearest Hospital Emergency Room right away.`;

// ============================================================================
// SANITIZATION & INPUT VALIDATION
// ============================================================================
export function sanitizeText(val: unknown): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

export function validateQuery(query: unknown): { valid: boolean; error?: string; cleanQuery?: string } {
  if (query === undefined || query === null || typeof query !== 'string') {
    return { valid: false, error: 'Query is required and must be text' };
  }
  const clean = sanitizeText(query);
  if (!clean || clean.length === 0) {
    return { valid: false, error: 'Query cannot be empty or contain only invalid characters' };
  }
  if (clean.length > 1000) {
    return { valid: false, error: 'Query exceeds maximum allowed length of 1000 characters' };
  }
  return { valid: true, cleanQuery: clean };
}

// ============================================================================
// STRUCTURED GEMINI CONTENTS BUILDER
// ============================================================================
export interface GeminiContentPart {
  text: string;
}

export interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiContentPart[];
}

export function buildGeminiContents(
  cleanQuery: string,
  history: ChatMessage[] = [],
  context?: UserContext
): GeminiContent[] {
  const contents: GeminiContent[] = [];

  // Limit conversation history to the most recent 10 messages to keep context focused
  const recentHistory = Array.isArray(history) ? history.slice(-10) : [];

  for (const msg of recentHistory) {
    if (!msg || typeof msg.text !== 'string') continue;
    const sanitized = sanitizeText(msg.text);
    if (!sanitized) continue;

    // Map roles to Gemini standard 'user' and 'model'
    const role: 'user' | 'model' = msg.role === 'user' ? 'user' : 'model';

    // Avoid duplicate adjacent roles in Gemini multi-turn format
    const lastContent = contents[contents.length - 1];
    if (lastContent && lastContent.role === role) {
      lastContent.parts.push({ text: sanitized });
    } else {
      contents.push({
        role,
        parts: [{ text: sanitized }]
      });
    }
  }

  // Build the current prompt content
  let userTurnText = cleanQuery;
  if (context?.activeHerb) {
    const cleanHerb = sanitizeText(context.activeHerb);
    if (cleanHerb) {
      userTurnText = `[User reference context: ${cleanHerb}]\n${cleanQuery}`;
    }
  }

  // Ensure conversation ends with user turn
  const lastContent = contents[contents.length - 1];
  if (lastContent && lastContent.role === 'user') {
    lastContent.parts.push({ text: userTurnText });
  } else {
    contents.push({
      role: 'user',
      parts: [{ text: userTurnText }]
    });
  }

  return contents;
}

// ============================================================================
// AI SERVICE PROCESSOR
// ============================================================================
export interface ProcessQueryOptions {
  query: unknown;
  conversationHistory?: ChatMessage[];
  userContext?: UserContext;
  aiClient?: GoogleGenAI;
  apiKey?: string;
  modelName?: string;
}

export async function processAiQuery(options: ProcessQueryOptions): Promise<AiResponseResult> {
  const { query, conversationHistory = [], userContext, aiClient, apiKey, modelName = 'gemini-3.8-flash' } = options;

  // 1. Validation check
  const valResult = validateQuery(query);
  if (!valResult.valid || !valResult.cleanQuery) {
    return {
      error: 'Validation Error',
      message: valResult.error || 'Invalid query provided'
    };
  }

  const cleanQuery = valResult.cleanQuery;

  // 2. Immediate Emergency Symptom Scan
  if (scanEmergencySymptoms(cleanQuery)) {
    return {
      isEmergency: true,
      reply: EMERGENCY_REPLY_NOTICE
    };
  }

  // 3. Build Structured Gemini multi-turn contents
  const contents = buildGeminiContents(cleanQuery, conversationHistory, userContext);

  // 4. Determine API Key
  const activeKey = apiKey !== undefined ? apiKey : (process.env.GEMINI_API_KEY || '');
  if (!activeKey) {
    return {
      error: 'API Key Missing',
      message: 'Gemini API key is not configured on the server. Please check environment configuration.'
    };
  }

  const client = aiClient || new GoogleGenAI({
    apiKey: activeKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  // 5. Call Gemini (gemini-3.8-flash is the active supported model)
  const candidateModels = [modelName, 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await client.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: LIFESHIELD_AI_SYSTEM_INSTRUCTION,
          temperature: 0.2
        }
      });

      const replyText = response.text?.trim();
      if (replyText) {
        return { reply: replyText };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[LifeShield AI] Model ${model} generation attempt failed:`, err?.message || err);
      // If error is not a model not found / overload, we can break or try next model
    }
  }

  // 6. Transparent, Safe Error Response (NO fake recipe hallucinations!)
  console.error('[LifeShield AI] All model attempts failed:', lastError?.message || lastError);
  return {
    error: 'AI Service Temporarily Unavailable',
    message: 'The AI assistant is temporarily unavailable due to high service demand. Please try again shortly or consult a healthcare professional.'
  };
}
