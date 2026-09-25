import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Trash2,
  Filter,
  CreditCard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PremiumStatusCard } from '../home/PremiumStatusCard';

export const FinanceScreen: React.FC = () => {
  const {
    financeEntries,
    deleteFinanceEntry,
    setIsAddFinanceOpen,
    setIsMakePaymentOpen
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income' | 'savings'>('all');

  const totalIncome = financeEntries
    .filter((e) => e.type === 'income')
    .reduce((acc, e) => acc + e.amount, 0);

  const totalExpense = financeEntries
    .filter((e) => e.type === 'expense')
    .reduce((acc, e) => acc + e.amount, 0);

  const totalSavings = financeEntries
    .filter((e) => e.type === 'savings')
    .reduce((acc, e) => acc + e.amount, 0);

  const filteredEntries = financeEntries.filter((e) => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  return (
    <div className="pb-6">
      {/* Top Header Card */}
      <div className="mx-4 mt-2 mb-3 bg-white dark:bg-[#101b33] rounded-2xl border border-slate-100 dark:border-slate-800/90 p-4 text-left shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                Health & Personal Finances
              </h3>
              <p className="text-[10px] text-slate-500">
                Private offline tracking • No bank logins required
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddFinanceOpen(true)}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Entry</span>
          </button>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Income</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              +₹ {totalIncome.toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Expenses</span>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums">
              -₹ {totalExpense.toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Reserve</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              ₹ {totalSavings.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Premium Status Donut matching screenshot */}
      <PremiumStatusCard />

      {/* Filter Tabs & Transactions */}
      <div className="mx-4 mt-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Recent Records
          </span>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/80 p-0.5 rounded-lg text-[10px]">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white dark:bg-[#101b33] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterType === 'expense'
                  ? 'bg-white dark:bg-[#101b33] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterType === 'income'
                  ? 'bg-white dark:bg-[#101b33] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setFilterType('savings')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterType === 'savings'
                  ? 'bg-white dark:bg-[#101b33] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Savings
            </button>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="p-6 bg-white dark:bg-[#101b33] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            No financial entries in this category.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-100 dark:border-slate-800/90 p-3.5 flex items-center justify-between text-left shadow-xs transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      entry.type === 'income'
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400'
                        : entry.type === 'expense'
                        ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400'
                        : 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {entry.type === 'income' ? (
                      <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
                    ) : entry.type === 'expense' ? (
                      <ArrowDownRight className="w-4 h-4 stroke-[2.2]" />
                    ) : (
                      <PiggyBank className="w-4 h-4 stroke-[2]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {entry.title}
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span>{entry.category}</span>
                      <span>•</span>
                      <span>{entry.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-bold tabular-nums ${
                      entry.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : entry.type === 'expense'
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {entry.type === 'income' ? '+' : entry.type === 'expense' ? '-' : ''}₹{' '}
                    {entry.amount.toLocaleString('en-IN')}
                  </span>

                  <button
                    onClick={() => deleteFinanceEntry(entry.id)}
                    className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
