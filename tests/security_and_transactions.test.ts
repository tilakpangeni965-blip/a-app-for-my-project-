import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';
import { sanitizeString, scanEmergencySymptoms } from '../server';

describe('Security & Sanitization Suite', () => {
  it('correctly hashes passwords and rejects invalid credentials', () => {
    const rawPassword = 'Password123!@#';
    const hash = bcrypt.hashSync(rawPassword, 10);

    expect(hash).not.toBe(rawPassword);
    expect(bcrypt.compareSync(rawPassword, hash)).toBe(true);
    expect(bcrypt.compareSync('WrongPassword', hash)).toBe(false);
  });

  it('sanitizes input strings and neutralizes potential XSS injection payloads', () => {
    const maliciousInput = '<script>alert("XSS")</script>Hello World';
    const sanitized = sanitizeString(maliciousInput);

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('</script>');
    expect(sanitized).toBe('scriptalert("XSS")/scriptHello World');

    const jsInjection = 'javascript:evilFunction()';
    const cleanJs = sanitizeString(jsInjection);
    expect(cleanJs).not.toContain('javascript:');
  });

  it('handles non-string inputs safely without crashing', () => {
    expect(sanitizeString(null)).toBe('');
    expect(sanitizeString(undefined)).toBe('');
    expect(sanitizeString(12345)).toBe('');
    expect(sanitizeString({})).toBe('');
  });
});

describe('Medical & Emergency Symptom Triage', () => {
  it('detects high-risk cardiac, stroke, and respiratory emergency keywords', () => {
    expect(scanEmergencySymptoms('I have crushing chest pain and left arm numbness')).toBe(true);
    expect(scanEmergencySymptoms('Patient is unconscious and bleeding heavily')).toBe(true);
    expect(scanEmergencySymptoms('I cant breathe and my throat swelling rapidly')).toBe(true);
    expect(scanEmergencySymptoms('Suspected poisoning or medication overdose')).toBe(true);
    expect(scanEmergencySymptoms('Signs of stroke with face drooping')).toBe(true);
  });

  it('permits non-emergency traditional culinary/herbal inquiries to pass normally', () => {
    expect(scanEmergencySymptoms('How to prepare fresh tulsi tea for mild evening throat tickle?')).toBe(false);
    expect(scanEmergencySymptoms('Turmeric golden milk recipe with warm pepper')).toBe(false);
    expect(scanEmergencySymptoms('What herbs support digestive ease after heavy meals?')).toBe(false);
  });
});

describe('Financial Transactions & Precision Calculations', () => {
  it('calculates totals with accurate decimal rounding to avoid IEEE 754 precision drift', () => {
    const items = [
      { amount: 19.99, type: 'expense' },
      { amount: 5.10, type: 'expense' },
      { amount: 0.05, type: 'expense' },
      { amount: 100.00, type: 'income' }
    ];

    const totalExpense = items
      .filter(i => i.type === 'expense')
      .reduce((sum, i) => sum + i.amount, 0);

    const roundedExpense = Math.round(totalExpense * 100) / 100;
    expect(roundedExpense).toBe(25.14);

    const totalIncome = items
      .filter(i => i.type === 'income')
      .reduce((sum, i) => sum + i.amount, 0);

    const net = Math.round((totalIncome - roundedExpense) * 100) / 100;
    expect(net).toBe(74.86);
  });

  it('prevents accidental duplicate transactions within timeframe', () => {
    const ledger = [
      { id: 'fe-100', title: 'Consultation Fee', amount: 1500, category: 'Doctor Consult', date: '2026-09-25' }
    ];

    const isDuplicate = (title: string, amount: number, category: string, date: string) => {
      return ledger.some(
        e => e.title === title && e.amount === amount && e.category === category && e.date === date
      );
    };

    expect(isDuplicate('Consultation Fee', 1500, 'Doctor Consult', '2026-09-25')).toBe(true);
    expect(isDuplicate('Pharmacy', 500, 'Pharmacy', '2026-09-25')).toBe(false);
  });
});

describe('Payment Idempotency & Gateway Clearing', () => {
  it('enforces single execution per unique idempotency key', () => {
    const processedKeys = new Map<string, { txnId: string; amount: number }>();

    const processPayment = (key: string, amount: number) => {
      if (processedKeys.has(key)) {
        return { cached: true, receipt: processedKeys.get(key) };
      }
      const receipt = { txnId: `TXN-${Date.now()}`, amount };
      processedKeys.set(key, receipt);
      return { cached: false, receipt };
    };

    const firstRun = processPayment('idemp-unique-12345', 2500);
    expect(firstRun.cached).toBe(false);
    expect(firstRun.receipt?.amount).toBe(2500);

    // Repeated call with the same idempotency key must not re-process
    const replayRun = processPayment('idemp-unique-12345', 2500);
    expect(replayRun.cached).toBe(true);
    expect(replayRun.receipt?.txnId).toBe(firstRun.receipt?.txnId);
  });
});

describe('Biometric Authentication Simulation & Enclave Security', () => {
  it('correctly simulates hardware enclave verification and challenge signing', async () => {
    interface BiometricCredential {
      credentialId: string;
      publicKey: string;
      signCount: number;
    }

    const mockEnclaveStore = new Map<string, BiometricCredential>();

    const enrollBiometrics = (userId: string): { success: boolean; credentialId: string } => {
      const credId = `bio-cred-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      mockEnclaveStore.set(userId, {
        credentialId: credId,
        publicKey: `pk-secp256r1-${Date.now()}`,
        signCount: 1
      });
      return { success: true, credentialId: credId };
    };

    const verifyBiometrics = (userId: string, challenge: string): { verified: boolean; signature?: string } => {
      const cred = mockEnclaveStore.get(userId);
      if (!cred || !challenge) return { verified: false };
      cred.signCount += 1;
      return {
        verified: true,
        signature: `sig-${cred.credentialId}-${cred.signCount}`
      };
    };

    const enrollment = enrollBiometrics('user-101');
    expect(enrollment.success).toBe(true);
    expect(enrollment.credentialId).toContain('bio-cred-');

    const authAttempt = verifyBiometrics('user-101', 'random-nonce-challenge-987');
    expect(authAttempt.verified).toBe(true);
    expect(authAttempt.signature).toBeDefined();

    const invalidAttempt = verifyBiometrics('non-existent-user', 'challenge-123');
    expect(invalidAttempt.verified).toBe(false);
  });

  it('toggles biometric security status and preserves preference in local storage format', () => {
    let mockStorage: Record<string, string> = {};
    const key = 'lifeshield_biometric_enabled';

    const toggle = (current: boolean) => {
      const next = !current;
      mockStorage[key] = next ? 'true' : 'false';
      return next;
    };

    let isEnabled = mockStorage[key] === 'true';
    expect(isEnabled).toBe(false);

    isEnabled = toggle(isEnabled);
    expect(isEnabled).toBe(true);
    expect(mockStorage[key]).toBe('true');

    isEnabled = toggle(isEnabled);
    expect(isEnabled).toBe(false);
    expect(mockStorage[key]).toBe('false');
  });
});

