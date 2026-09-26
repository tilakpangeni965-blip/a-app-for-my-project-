import React from 'react';
import {
  Wallet,
  Shield,
  Heart,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  CreditCard,
  FileText,
  PhoneCall,
  Activity,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActivePoliciesCard } from './ActivePoliciesCard';
import { PremiumStatusCard } from './PremiumStatusCard';

export const HomeScreen: React.FC = () => {
  const {
    user,
    authUser,
    financeEntries,
    policies,
    healthConcerns,
    wellness,
    setActiveTab,
    setIsAddFinanceOpen,
    setIsAddConcernOpen,
    setIsAddPolicyOpen,
    setIsMakePaymentOpen,
    setIsWellnessOpen,
    setSelectedEmergencyId
  } = useApp();

  const displayName = authUser?.name || user.name || 'User';

  const totalIncome = financeEntries
    .filter((e) => e.type === 'income')
    .reduce((acc, e) => acc + e.amount, 0);

  const totalExpense = financeEntries
    .filter((e) => e.type === 'expense')
    .reduce((acc, e) => acc + e.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const isNewUser =
    financeEntries.length === 0 &&
    policies.length === 0 &&
    healthConcerns.length === 0;

  const recentTransactions = financeEntries.slice(0, 3);
  const recentConcerns = healthConcerns.slice(0, 2);

  return (
    <div className="space-y-4 text-left">
      {/* 1. Minimal Header Greeting */}
      <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Hello, {displayName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Welcome to your LifeShield personal health and financial overview.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('support');
                setSelectedEmergencyId('em-amb');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Emergency 102</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. New User Experience */}
      {isNewUser ? (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-xs text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 stroke-[2]" />
            </div>

            <div className="max-w-md mx-auto">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Get started with your private vault
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your data is stored securely and never shared. Add your first entry below to start tracking your health records, finances, and insurance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-2xl mx-auto">
              <button
                onClick={() => setIsAddFinanceOpen(true)}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-900/40 text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
                  <Wallet className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Record Finance Entry
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Track health expenses, income, or emergency savings.
                </p>
              </button>

              <button
                onClick={() => setIsAddConcernOpen(true)}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-900/40 text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2.5">
                  <Heart className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Log Health Concern
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Record symptoms, upload medical reports, or add notes.
                </p>
              </button>

              <button
                onClick={() => setIsAddPolicyOpen(true)}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-900/40 text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Link Insurance Plan
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Manage health and life coverage and premium dues.
                </p>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 3. Returning User: Real Active Data Dashboard */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Primary Column (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Financial Summary Card */}
            <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      Financial Summary
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Actual tracked cashflow and reserves
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsAddFinanceOpen(true)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>New Entry</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('finance')}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-1.5 py-1 cursor-pointer font-medium"
                  >
                    View All →
                  </button>
                </div>
              </div>

              {/* 3 Metrics */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-800/80">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-left">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Inflow</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    +₹ {totalIncome.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-left">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Expenses</span>
                  <span className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                    -₹ {totalExpense.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-left">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Net Balance</span>
                  <span className={`text-xs sm:text-sm font-bold tabular-nums ${netBalance >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600'}`}>
                    ₹ {netBalance.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Recent Transactions List */}
              {recentTransactions.length > 0 ? (
                <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800/60">
                  {recentTransactions.map((entry) => (
                    <div
                      key={entry.id}
                      className="py-2 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {entry.title}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {entry.category} • {entry.date}
                        </div>
                      </div>
                      <span
                        className={`font-bold tabular-nums shrink-0 ${
                          entry.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {entry.type === 'income' ? '+' : '-'}₹ {entry.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 text-center py-3">
                  No financial records saved yet.
                </p>
              )}
            </div>

            {/* Health Vault & Daily Vitals */}
            <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      Health & Wellness
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Logged concerns and daily vitals
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsAddConcernOpen(true)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Log Concern</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('health')}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-1.5 py-1 cursor-pointer font-medium"
                  >
                    View All →
                  </button>
                </div>
              </div>

              {/* Vitals Snapshot */}
              <div className="grid grid-cols-4 gap-2 py-2 border-y border-slate-100 dark:border-slate-800/80 text-center">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                  <span className="text-[10px] text-slate-400 block font-medium">Steps</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                    {wellness.steps.toLocaleString()}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                  <span className="text-[10px] text-slate-400 block font-medium">Water</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                    {wellness.waterMl} ml
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                  <span className="text-[10px] text-slate-400 block font-medium">Sleep</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                    {wellness.sleepHours} hrs
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                  <span className="text-[10px] text-slate-400 block font-medium">Pulse</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                    {wellness.heartRateBpm > 0 ? `${wellness.heartRateBpm} bpm` : '--'}
                  </span>
                </div>
              </div>

              {/* Recent Concerns */}
              {recentConcerns.length > 0 ? (
                <div className="mt-3 space-y-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Recent Health Entries
                  </span>
                  {recentConcerns.map((c) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {c.title}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {c.category} • Severity: {c.severity}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {c.date}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pt-3 text-center">
                  <p className="text-[11px] text-slate-500">
                    No active health symptoms logged.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Secondary Column (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Active Policies Card */}
            <ActivePoliciesCard />

            {/* Premium Status - Only show if policies exist or dues are recorded */}
            {policies.length > 0 && <PremiumStatusCard />}

            {/* Quick Actions Panel */}
            <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 shadow-xs">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white mb-2.5">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsAddFinanceOpen(true)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-slate-50/50 dark:bg-slate-900/40 text-left transition-colors cursor-pointer"
                >
                  <Wallet className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Add Record
                  </span>
                  <span className="text-[10px] text-slate-500">Track expense/income</span>
                </button>

                <button
                  onClick={() => setIsAddPolicyOpen(true)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-slate-50/50 dark:bg-slate-900/40 text-left transition-colors cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-blue-600 mb-1" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Link Policy
                  </span>
                  <span className="text-[10px] text-slate-500">Insurance plan</span>
                </button>

                <button
                  onClick={() => setIsWellnessOpen(true)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-slate-50/50 dark:bg-slate-900/40 text-left transition-colors cursor-pointer"
                >
                  <Activity className="w-4 h-4 text-cyan-600 mb-1" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Log Vitals
                  </span>
                  <span className="text-[10px] text-slate-500">Daily health stats</span>
                </button>

                <button
                  onClick={() => setActiveTab('support')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-slate-50/50 dark:bg-slate-900/40 text-left transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-purple-600 mb-1" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Care Directory
                  </span>
                  <span className="text-[10px] text-slate-500">Doctors & hospitals</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
