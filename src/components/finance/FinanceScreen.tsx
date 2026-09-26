import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Trash2,
  CreditCard,
  Receipt
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PremiumStatusCard } from '../home/PremiumStatusCard';

export const FinanceScreen: React.FC = () => {
  const {
    financeEntries,
    deleteFinanceEntry,
    setIsAddFinanceOpen,
    setIsMakePaymentOpen,
    latestReceipt
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

  const netBalance = totalIncome - totalExpense;

  const filteredEntries = financeEntries.filter((e) => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  return (
    <div className="space-y-4 text-left">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Personal Financial Ledger
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Track personal expenses, healthcare costs, and savings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMakePaymentOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Pay Premium</span>
            </button>

            <button
              onClick={() => setIsAddFinanceOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Entry</span>
            </button>
          </div>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Inflow</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              +₹ {totalIncome.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Expenses</span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400 tabular-nums">
              -₹ {totalExpense.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Savings / Reserve</span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              ₹ {totalSavings.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Net Balance</span>
            <span className={`text-sm font-bold tabular-nums ${netBalance >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600'}`}>
              ₹ {netBalance.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Latest Verified Gateway Receipt Notification if available */}
      {latestReceipt && (
        <div className="p-3 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Receipt className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="truncate">
              <span className="font-bold text-emerald-900 dark:text-emerald-300">Latest Payment: </span>
              <span className="font-mono text-emerald-800 dark:text-emerald-400">{latestReceipt.txnId}</span>
              <span className="text-slate-500 ml-1.5">({latestReceipt.method} • ₹{latestReceipt.amount.toLocaleString('en-IN')})</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full shrink-0">
            SETTLED
          </span>
        </div>
      )}

      {/* Main Grid: Left: Ledger, Right: Premium Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Records Ledger (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Transactions ({filteredEntries.length})
            </h2>

            {/* Segmented Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/80 p-0.5 rounded-lg text-[10px]">
              {(['all', 'expense', 'income', 'savings'] as const).map((ft) => (
                <button
                  key={ft}
                  onClick={() => setFilterType(ft)}
                  className={`px-2.5 py-0.5 rounded-md font-medium transition-colors cursor-pointer capitalize ${
                    filterType === ft
                      ? 'bg-white dark:bg-[#101b33] text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                  }`}
                >
                  {ft}
                </button>
              ))}
            </div>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="p-8 bg-white dark:bg-[#101b33] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
              <Wallet className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No financial records found
              </p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                Record your income, medical expenses, or emergency savings.
              </p>
              <button
                onClick={() => setIsAddFinanceOpen(true)}
                className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium cursor-pointer"
              >
                Add First Transaction
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-100 dark:border-slate-800/90 p-3.5 flex items-center justify-between text-left shadow-xs transition-colors hover:border-slate-200 dark:hover:border-slate-700"
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
                        <span>·</span>
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

        {/* Right Column: Premium Status Card (5 cols on lg) */}
        <div className="lg:col-span-5">
          <PremiumStatusCard />
        </div>
      </div>
    </div>
  );
};
