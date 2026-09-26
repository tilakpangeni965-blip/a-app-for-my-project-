import { describe, it, expect } from 'vitest';
import { sanitizeString } from '../../server';

describe('LifeShield Core Logic & Security Tests', () => {
  describe('Input Sanitization & Security', () => {
    it('strips dangerous HTML tags and script injections', () => {
      const maliciousInput = '<script>alert("hack")</script>Doctor Consultation';
      const clean = sanitizeString(maliciousInput);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('</script>');
      expect(clean).toBe('scriptalert("hack")/scriptDoctor Consultation');
    });

    it('strips javascript: protocol pseudo-URLs', () => {
      const payload = 'javascript:evilCode()';
      const clean = sanitizeString(payload);
      expect(clean).toBe('evilCode()');
    });

    it('handles non-string values gracefully', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
      expect(sanitizeString(12345)).toBe('');
    });
  });

  describe('Financial Calculations Integrity', () => {
    it('calculates net operating balance accurately', () => {
      const entries = [
        { type: 'income', amount: 50000 },
        { type: 'expense', amount: 12500 },
        { type: 'expense', amount: 4500 },
        { type: 'savings', amount: 10000 }
      ];

      const totalIncome = entries
        .filter((e) => e.type === 'income')
        .reduce((sum, e) => sum + e.amount, 0);

      const totalExpense = entries
        .filter((e) => e.type === 'expense')
        .reduce((sum, e) => sum + e.amount, 0);

      const totalSavings = entries
        .filter((e) => e.type === 'savings')
        .reduce((sum, e) => sum + e.amount, 0);

      const netBalance = totalIncome - totalExpense;

      expect(totalIncome).toBe(50000);
      expect(totalExpense).toBe(17000);
      expect(totalSavings).toBe(10000);
      expect(netBalance).toBe(33000);
    });

    it('handles zero entries without NaN or null errors', () => {
      const emptyEntries: Array<{ type: string; amount: number }> = [];

      const totalIncome = emptyEntries
        .filter((e) => e.type === 'income')
        .reduce((sum, e) => sum + e.amount, 0);

      const totalExpense = emptyEntries
        .filter((e) => e.type === 'expense')
        .reduce((sum, e) => sum + e.amount, 0);

      const netBalance = totalIncome - totalExpense;

      expect(totalIncome).toBe(0);
      expect(totalExpense).toBe(0);
      expect(netBalance).toBe(0);
      expect(isNaN(netBalance)).toBe(false);
    });
  });

  describe('Policy Coverage Aggregation', () => {
    it('accurately computes total coverage for active policies', () => {
      const policies = [
        { id: '1', coverageAmount: 500000, annualPremium: 14000 },
        { id: '2', coverageAmount: 10000000, annualPremium: 22000 }
      ];

      const totalCoverage = policies.reduce((acc, p) => acc + p.coverageAmount, 0);
      const totalAnnualPremium = policies.reduce((acc, p) => acc + p.annualPremium, 0);

      expect(totalCoverage).toBe(10500000);
      expect(totalAnnualPremium).toBe(36000);
    });

    it('handles empty policies portfolio gracefully', () => {
      const policies: Array<{ coverageAmount: number }> = [];
      const totalCoverage = policies.reduce((acc, p) => acc + p.coverageAmount, 0);
      expect(totalCoverage).toBe(0);
    });
  });

  describe('Wellness Daily Vitals Progress', () => {
    it('calculates step and hydration completion percentages correctly', () => {
      const steps = 7500;
      const stepGoal = 10000;
      const stepPct = Math.round((steps / stepGoal) * 100);
      expect(stepPct).toBe(75);

      const waterMl = 2000;
      const waterGoalMl = 2500;
      const waterPct = Math.round((waterMl / waterGoalMl) * 100);
      expect(waterPct).toBe(80);
    });
  });
});
