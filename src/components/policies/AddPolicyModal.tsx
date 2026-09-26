import React, { useState } from 'react';
import { X, Shield, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddPolicyModal: React.FC = () => {
  const { isAddPolicyOpen, setIsAddPolicyOpen, addPolicy } = useApp();

  const [title, setTitle] = useState('');
  const [insurer, setInsurer] = useState('');
  const [type, setType] = useState<'health' | 'life' | 'savings'>('health');
  const [policyNumber, setPolicyNumber] = useState('');
  const [coverageAmount, setCoverageAmount] = useState('');
  const [annualPremium, setAnnualPremium] = useState('');
  const [beneficiary, setBeneficiary] = useState('Self');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAddPolicyOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const parsedCoverage = parseFloat(coverageAmount);
    const parsedPremium = parseFloat(annualPremium);

    if (!title.trim() || !policyNumber.trim()) {
      setErrorMessage('Please provide a policy title and policy number.');
      return;
    }

    if (isNaN(parsedCoverage) || parsedCoverage <= 0) {
      setErrorMessage('Please enter a valid coverage amount.');
      return;
    }

    if (isNaN(parsedPremium) || parsedPremium <= 0) {
      setErrorMessage('Please enter a valid annual premium amount.');
      return;
    }

    setIsSubmitting(true);
    const result = await addPolicy({
      title: title.trim(),
      subtitle: `${insurer.trim() || 'General Insurance'} • ${type.toUpperCase()}`,
      insurer: insurer.trim() || 'General Insurance',
      type,
      policyNumber: policyNumber.trim(),
      coverageAmount: parsedCoverage,
      annualPremium: parsedPremium,
      beneficiary: beneficiary.trim() || 'Self'
    });
    setIsSubmitting(false);

    if (result.success) {
      handleClose();
    } else {
      setErrorMessage(result.error || 'Failed to save policy');
    }
  };

  const handleClose = () => {
    setIsAddPolicyOpen(false);
    setTitle('');
    setInsurer('');
    setPolicyNumber('');
    setCoverageAmount('');
    setAnnualPremium('');
    setBeneficiary('Self');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Link Insurance Plan
              </h3>
              <p className="text-[11px] text-slate-500">
                Track coverage, premiums, and renewals
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-left">
          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Type Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Policy Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['health', 'life', 'savings'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                    type === t
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Policy Title */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Plan Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Family Health Floater"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Insurer Name & Policy Number */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Insurer Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Star Health, LIC"
                value={insurer}
                onChange={(e) => setInsurer(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Policy Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. POL-123456"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Coverage & Premium */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Sum Insured (₹) *
              </label>
              <input
                type="number"
                required
                min="1000"
                placeholder="e.g. 500000"
                value={coverageAmount}
                onChange={(e) => setCoverageAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Annual Premium (₹) *
              </label>
              <input
                type="number"
                required
                min="100"
                placeholder="e.g. 12000"
                value={annualPremium}
                onChange={(e) => setAnnualPremium(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Beneficiary */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Covered Members / Beneficiary
            </label>
            <input
              type="text"
              placeholder="e.g. Self & Spouse"
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            {isSubmitting ? 'Linking Plan...' : 'Link Insurance Plan'}
          </button>
        </form>
      </div>
    </div>
  );
};
