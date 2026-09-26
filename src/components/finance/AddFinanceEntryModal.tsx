import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, PiggyBank, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FinanceEntry } from '../../types';

export const AddFinanceEntryModal: React.FC = () => {
  const { isAddFinanceOpen, setIsAddFinanceOpen, addFinanceEntry } = useApp();

  const [type, setType] = useState<FinanceEntry['type']>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<FinanceEntry['category']>('Medical Bills');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAddFinanceOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const numAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid title and amount greater than zero.');
      return;
    }

    setIsSubmitting(true);
    const result = await addFinanceEntry({
      title: title.trim(),
      type,
      amount: numAmount,
      category,
      date: new Date().toISOString().split('T')[0],
      notes: notes.trim() || undefined
    });
    setIsSubmitting(false);

    if (result.success) {
      handleClose();
    } else {
      setErrorMessage(result.error || 'Failed to record entry');
    }
  };

  const handleClose = () => {
    setIsAddFinanceOpen(false);
    setTitle('');
    setAmount('');
    setNotes('');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              Add Financial Record
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
              Record health expenses, personal income, or savings
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-left">
          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Type Selector: Expense, Income, Savings */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory('Medical Bills');
              }}
              className={`py-2 px-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                type === 'expense'
                  ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span className="text-[11px]">Expense</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Salary/Income');
              }}
              className={`py-2 px-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                type === 'income'
                  ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-[11px]">Income</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('savings');
                setCategory('Emergency Fund');
              }}
              className={`py-2 px-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                type === 'savings'
                  ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <PiggyBank className="w-4 h-4" />
              <span className="text-[11px]">Savings</span>
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Amount (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                required
                min="1"
                step="any"
                placeholder="e.g. 1500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Description / Payee *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Doctor consultation fee, Pharmacy prescription"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            >
              <option value="Health Insurance">Health Insurance Premium</option>
              <option value="Life Insurance">Life Insurance Premium</option>
              <option value="Medical Bills">Hospital & Diagnostic Bills</option>
              <option value="Doctor Consult">Doctor Consultation</option>
              <option value="Pharmacy">Pharmacy & Medicines</option>
              <option value="Emergency Fund">Emergency Health Reserve</option>
              <option value="Salary/Income">Salary & Direct Inflow</option>
              <option value="General Living">General Living / Other</option>
            </select>
          </div>

          {/* Optional Note */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Optional Note
            </label>
            <input
              type="text"
              placeholder="e.g. Paid via UPI, receipt saved"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            {isSubmitting ? 'Saving Transaction...' : 'Save Financial Record'}
          </button>
        </form>
      </div>
    </div>
  );
};
