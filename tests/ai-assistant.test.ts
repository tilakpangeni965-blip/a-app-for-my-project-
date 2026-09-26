import { describe, it, expect, vi } from 'vitest';
import {
  processAiQuery,
  validateQuery,
  scanEmergencySymptoms,
  buildGeminiContents,
  LIFESHIELD_AI_SYSTEM_INSTRUCTION,
  EMERGENCY_REPLY_NOTICE,
  ChatMessage
} from '../src/services/aiAssistantService';

describe('LifeShield AI Assistant - Comprehensive Safety & Accuracy Tests', () => {

  // ==========================================================================
  // Test F: Input Validation & Malformed Request Handling
  // ==========================================================================
  describe('Test F: Empty or Invalid Query Handling', () => {
    it('returns validation error for empty string without calling Gemini', async () => {
      const res = await processAiQuery({ query: '' });
      expect(res.error).toBe('Validation Error');
      expect(res.message).toContain('empty');
      expect(res.reply).toBeUndefined();
    });

    it('returns validation error for whitespace-only query', async () => {
      const res = await processAiQuery({ query: '    ' });
      expect(res.error).toBe('Validation Error');
      expect(res.message).toContain('empty');
    });

    it('returns validation error for non-string or null queries', async () => {
      const resNull = await processAiQuery({ query: null });
      expect(resNull.error).toBe('Validation Error');

      const resObj = await processAiQuery({ query: { prompt: 'hello' } as any });
      expect(resObj.error).toBe('Validation Error');
    });

    it('rejects queries exceeding length safety bounds (>1000 chars)', async () => {
      const longQuery = 'a'.repeat(1005);
      const res = await processAiQuery({ query: longQuery });
      expect(res.error).toBe('Validation Error');
      expect(res.message).toContain('maximum allowed length');
    });

    it('sanitizes malicious script tags and HTML in input safely', () => {
      const val = validateQuery('<script>alert("xss")</script>Is ginger safe?');
      expect(val.valid).toBe(true);
      expect(val.cleanQuery).toBe('scriptalert("xss")/scriptIs ginger safe?');
      expect(val.cleanQuery).not.toContain('<script>');
    });
  });

  // ==========================================================================
  // Emergency Triage
  // ==========================================================================
  describe('Emergency Symptoms Triage', () => {
    it('detects emergency cardiac and respiratory symptoms immediately', async () => {
      const res = await processAiQuery({ query: 'I have severe chest pain and left arm numbness' });
      expect(res.isEmergency).toBe(true);
      expect(res.reply).toContain('IMMEDIATE EMERGENCY NOTICE');
      expect(res.reply).toContain('102');
    });

    it('detects anaphylaxis and poisoning symptoms immediately', async () => {
      const res = await processAiQuery({ query: 'Patient is having anaphylaxis and throat swelling' });
      expect(res.isEmergency).toBe(true);
      expect(res.reply).toContain('Hospital Emergency Room');
    });
  });

  // ==========================================================================
  // Structured Multi-Turn History & Content Builder
  // ==========================================================================
  describe('Conversation Context & Multi-turn Formatting', () => {
    it('constructs well-formed Gemini contents array preserving turn history', () => {
      const history: ChatMessage[] = [
        { role: 'user', text: 'Can I take ashwagandha?' },
        { role: 'assistant', text: 'Ashwagandha is used traditionally, but may interact with sedatives.' }
      ];

      const contents = buildGeminiContents('What about with blood pressure drugs?', history);

      expect(contents.length).toBe(3);
      expect(contents[0]).toEqual({
        role: 'user',
        parts: [{ text: 'Can I take ashwagandha?' }]
      });
      expect(contents[1]).toEqual({
        role: 'model',
        parts: [{ text: 'Ashwagandha is used traditionally, but may interact with sedatives.' }]
      });
      expect(contents[2]).toEqual({
        role: 'user',
        parts: [{ text: 'What about with blood pressure drugs?' }]
      });
    });

    it('appends reference herb context safely without forcing recipes', () => {
      const contents = buildGeminiContents('Is it safe during pregnancy?', [], { activeHerb: 'Tulsi' });
      expect(contents.length).toBe(1);
      expect(contents[0].parts[0].text).toContain('[User reference context: Tulsi]');
      expect(contents[0].parts[0].text).toContain('Is it safe during pregnancy?');
      expect(contents[0].parts[0].text).not.toContain('simmer');
      expect(contents[0].parts[0].text).not.toContain('ingredients');
    });
  });

  // ==========================================================================
  // System Instruction Verification
  // ==========================================================================
  describe('System Instruction Compliance Rules', () => {
    it('contains all 10 mandatory LifeShield response rules', () => {
      expect(LIFESHIELD_AI_SYSTEM_INSTRUCTION).toContain('ROLE:');
      expect(LIFESHIELD_AI_SYSTEM_INSTRUCTION).toContain('You are the LifeShield Health and Herbal Information Assistant.');
      expect(LIFESHIELD_AI_SYSTEM_INSTRUCTION).toContain('PRIMARY OBJECTIVE:');
      expect(LIFESHIELD_AI_SYSTEM_INSTRUCTION).toContain('1. Answer the user\'s specific question directly before adding background information.');
      expect(LIFESHIELD_AI_SYSTEM_INSTRUCTION).toContain('2. Never contradict the user\'s question or reverse its meaning.');
      expect(LIFESHIELD_AI_SYSTEM_INSTRUCTION).toContain('3. Do not assume facts that the user has not provided.');
      expect(LIFESHIELD_AI_SYSTEM_INSTRUCTION).toContain('4. Do not invent medical evidence or pretend to have verified information that has not been checked.');
      expect(LIFESHIELD_AI_SYSTEM_INSTRUCTION).toContain('5. Clearly separate known facts, uncertainty, and traditional practices.');
      expect(LIFESHIELD_AI_SYSTEM_INSTRUCTION).toContain('6. Ask for clarification when necessary.');
      expect(LIFESHIELD_AI_SYSTEM_INSTRUCTION).toContain('7. Keep answers concise, organized, and understandable.');
      expect(LIFESHIELD_AI_SYSTEM_INSTRUCTION).toContain('8. Avoid irrelevant information, unnecessary repetition, and unrelated suggestions.');
      expect(LIFESHIELD_AI_SYSTEM_INSTRUCTION).toContain('9. If the user corrects a previous misunderstanding, acknowledge it and answer the corrected question.');
      expect(LIFESHIELD_AI_SYSTEM_INSTRUCTION).toContain('10. When the answer is uncertain, explicitly communicate that uncertainty.');
    });

    it('strictly forbids unsolicited recipes and stopping prescribed medication', () => {
      expect(LIFESHIELD_AI_SYSTEM_INSTRUCTION).toContain('RECIPES VS SAFETY');
      expect(LIFESHIELD_AI_SYSTEM_INSTRUCTION).toContain('PRESCRIBED MEDICATIONS');
      expect(LIFESHIELD_AI_SYSTEM_INSTRUCTION).toContain('NEVER recommend stopping, pausing, or replacing prescribed medications');
      expect(LIFESHIELD_AI_SYSTEM_INSTRUCTION).toContain('NO UNIVERSAL SAFETY CLAIMS');
    });
  });

  // ==========================================================================
  // Test A: Is turmeric safe for everyone?
  // ==========================================================================
  describe('Test A: Question on Universal Safety ("Is turmeric safe for everyone?")', () => {
    it('verifies that response addresses individual conditions and rejects universal safety', async () => {
      const mockGenerateContent = vi.fn().mockResolvedValue({
        text: `Turmeric is not safe for everyone. While commonly used as a culinary spice, supplemental or therapeutic amounts carry significant cautions:
• Gallbladder Disorders: Turmeric can trigger gallbladder contractions and is contraindicated in gallstones or bile duct obstructions.
• Bleeding Disorders: High doses can slow blood clotting and interact dangerously with blood thinners like warfarin or aspirin.
• Pregnancy: Culinary amounts are generally safe, but medicinal supplements should be avoided due to potential uterine stimulation.
Always consult a doctor before starting daily turmeric extracts.`
      });

      const mockClient: any = {
        models: { generateContent: mockGenerateContent }
      };

      const res = await processAiQuery({
        query: 'Is turmeric safe for everyone?',
        aiClient: mockClient,
        apiKey: 'test-key'
      });

      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.config.systemInstruction).toBe(LIFESHIELD_AI_SYSTEM_INSTRUCTION);
      expect(callArgs.contents[0].parts[0].text).toBe('Is turmeric safe for everyone?');

      expect(res.reply).toBeDefined();
      expect(res.reply?.toLowerCase()).toContain('not safe for everyone');
      expect(res.reply?.toLowerCase()).not.toContain('safe for all people without exception');
    });
  });

  // ==========================================================================
  // Test B: Can herbal medicine replace prescribed medication?
  // ==========================================================================
  describe('Test B: Replacing Prescribed Medication ("Can herbal medicine replace my prescribed medication?")', () => {
    it('clearly explains user must not stop or replace medication without healthcare professional', async () => {
      const mockGenerateContent = vi.fn().mockResolvedValue({
        text: `No, you should never stop or replace your prescribed medication with herbal remedies.
Prescription pharmaceuticals undergo rigorous clinical trials for specific dosages and proven efficacy. Herbal remedies cannot substitute for professional medical treatment and doing so can lead to serious health complications or disease progression.
If you are interested in complementary wellness approaches, speak directly with your prescribing physician or pharmacist before making any changes.`
      });

      const mockClient: any = {
        models: { generateContent: mockGenerateContent }
      };

      const res = await processAiQuery({
        query: 'Can herbal medicine replace my prescribed medication?',
        aiClient: mockClient,
        apiKey: 'test-key'
      });

      expect(res.reply).toBeDefined();
      expect(res.reply?.toLowerCase()).toContain('never stop or replace');
      expect(res.reply?.toLowerCase()).toContain('prescribed medication');
      expect(res.reply?.toLowerCase()).toContain('physician');
    });
  });

  // ==========================================================================
  // Test C: Constraint Preservation ("I do not want a recipe. Explain the risks.")
  // ==========================================================================
  describe('Test C: Preserving Constraints & Avoiding Unsolicited Recipes', () => {
    it('verifies that prompt builder passes negative constraint without adding recipe prompt', () => {
      const contents = buildGeminiContents('I do not want a recipe. Explain the risks.');
      expect(contents[0].parts[0].text).toBe('I do not want a recipe. Explain the risks.');
      expect(contents[0].parts[0].text).not.toContain('preparation steps');
    });

    it('verifies response explains risks without culinary recipe instructions', async () => {
      const mockGenerateContent = vi.fn().mockResolvedValue({
        text: `Risks and Contraindications:
1. Gastrointestinal Irritation: Concentrated intake can irritate gastric mucosa, causing nausea or acid reflux.
2. Blood Thinning Risk: May amplify the effects of antiplatelet or anticoagulant medications.
3. Liver & Kidney Clearance: High doses place metabolic load on hepatic pathways.
No recipe provided per your request. Consult your physician regarding your specific medical history.`
      });

      const mockClient: any = {
        models: { generateContent: mockGenerateContent }
      };

      const res = await processAiQuery({
        query: 'I do not want a recipe. Explain the risks.',
        aiClient: mockClient,
        apiKey: 'test-key'
      });

      expect(res.reply).toBeDefined();
      expect(res.reply).not.toContain('tsp');
      expect(res.reply).not.toContain('tablespoon');
      expect(res.reply).not.toContain('simmer for');
      expect(res.reply?.toLowerCase()).toContain('risk');
    });
  });

  // ==========================================================================
  // Test D: Drug Interactions ("What are the possible risks of taking herbs with blood pressure medication?")
  // ==========================================================================
  describe('Test D: Herb-Drug Interaction & Blood Pressure Medication', () => {
    it('addresses interactions and uncertainty without advising to stop medication', async () => {
      const mockGenerateContent = vi.fn().mockResolvedValue({
        text: `Potential Herb-Drug Interactions and Risks with Blood Pressure Medications:
• Additive Hypotension: Herbs such as garlic, hawthorn, or high-dose ginger have mild hypotensive effects and can cause blood pressure to drop dangerously low when combined with antihypertensives.
• Antagonistic Effects: Licorice root (glycyrrhizin) raises blood pressure and counteracts medications.
• Medication Integrity: Do NOT stop or adjust your blood pressure medication. Always inform your doctor before using herbal supplements.`
      });

      const mockClient: any = {
        models: { generateContent: mockGenerateContent }
      };

      const res = await processAiQuery({
        query: 'What are the possible risks of taking herbs with blood pressure medication?',
        aiClient: mockClient,
        apiKey: 'test-key'
      });

      expect(res.reply).toBeDefined();
      expect(res.reply?.toLowerCase()).toContain('interaction');
      expect(res.reply).toContain('Do NOT stop');
      expect(res.reply?.toLowerCase()).not.toContain('stop taking your blood pressure');
    });
  });

  // ==========================================================================
  // Test E: Misunderstanding Correction ("You misunderstood me. I asked whether it is safe...")
  // ==========================================================================
  describe('Test E: Misunderstanding Correction in Multi-turn Context', () => {
    it('passes conversation context and allows assistant to address the corrected safety question', async () => {
      const history: ChatMessage[] = [
        { role: 'user', text: 'Can I take licorice root?' },
        { role: 'assistant', text: 'To prepare licorice root tea: take 1 tsp dried root and simmer in water for 10 minutes.' }
      ];

      const correctionQuery = 'You misunderstood me. I asked whether it is safe, not how to prepare it.';
      const contents = buildGeminiContents(correctionQuery, history);

      expect(contents.length).toBe(3);
      expect(contents[1].parts[0].text).toContain('simmer in water');
      expect(contents[2].parts[0].text).toBe(correctionQuery);

      const mockGenerateContent = vi.fn().mockResolvedValue({
        text: `I apologize for the misunderstanding. Regarding safety:
Licorice root containing glycyrrhizin is NOT safe for extended or high-dose use. It can cause potassium depletion (hypokalemia), elevated blood pressure, and cardiac arrhythmias, especially in people with hypertension, kidney disease, or heart conditions.
If you have high blood pressure or take cardiac medications, avoid licorice root.`
      });

      const mockClient: any = {
        models: { generateContent: mockGenerateContent }
      };

      const res = await processAiQuery({
        query: correctionQuery,
        conversationHistory: history,
        aiClient: mockClient,
        apiKey: 'test-key'
      });

      expect(res.reply).toBeDefined();
      expect(res.reply?.toLowerCase()).toContain('apologize');
      expect(res.reply?.toLowerCase()).toContain('safe');
      expect(res.reply?.toLowerCase()).not.toContain('boil for 10 minutes');
    });
  });

  // ==========================================================================
  // Test G: Simulating Gemini API Failure & Fallback Handling
  // ==========================================================================
  describe('Test G: Gemini API Failure & Safe Fallback Handling', () => {
    it('returns a safe, transparent error message without inventing medical answers or fake recipes', async () => {
      const mockFailingClient: any = {
        models: {
          generateContent: vi.fn().mockRejectedValue(new Error('Quota exceeded 429: Resource exhausted'))
        }
      };

      const res = await processAiQuery({
        query: 'What herbs can I take for diabetes?',
        aiClient: mockFailingClient,
        apiKey: 'test-key'
      });

      // Crucial: Must NEVER return a fabricated herbal recipe or fake cure when Gemini fails!
      expect(res.error).toBe('AI Service Temporarily Unavailable');
      expect(res.message).toContain('temporarily unavailable');
      expect(res.reply).toBeUndefined();

      // Ensure no fake recipes or medical claims were returned
      expect(JSON.stringify(res)).not.toContain('4-5 fresh leaves');
      expect(JSON.stringify(res)).not.toContain('Tulsi Kadha');
      expect(JSON.stringify(res)).not.toContain('simmer gently');
    });

    it('returns an API Key Missing error when no key is configured', async () => {
      const res = await processAiQuery({
        query: 'Is ginger safe?',
        apiKey: ''
      });

      expect(res.error).toBe('API Key Missing');
      expect(res.message).toContain('API key is not configured');
      expect(res.reply).toBeUndefined();
    });
  });

});
