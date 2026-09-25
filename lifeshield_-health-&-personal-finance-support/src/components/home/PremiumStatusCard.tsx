import React from 'react';
import { Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PremiumStatusCard: React.FC = () => {
  const { premiumStatus, setIsMakePaymentOpen } = useApp();

  // Circular progress calculations (radius 34, perimeter = 2 * PI * 34 ≈ 213.63)
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (premiumStatus.percentage / 100) * circumference;

  return (
    <div className="mx-4 my-2.5 bg-white dark:bg-[#101b33] rounded-2xl border border-slate-100 dark:border-slate-800/90 shadow-sm p-4 transition-colors">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 mb-3.5">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-500/20">
          <Calendar className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div className="text-left">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
            Premium Payment Status
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
            On track for your protection
          </p>
        </div>
      </div>

      {/* Donut Chart & Legend Row */}
      <div className="flex items-center justify-between gap-4 py-1.5 px-2">
        {/* Donut Chart */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 88 88">
            {/* Background track */}
            <circle
              cx="44"
              cy="44"
              r={radius}
              stroke="currentColor"
              strokeWidth="9"
              className="text-slate-100 dark:text-slate-800/90"
              fill="transparent"
            />
            {/* Progress stroke */}
            <circle
              cx="44"
              cy="44"
              r={radius}
              stroke="#0284c7"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out dark:stroke-sky-400"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-bold text-slate-900 dark:text-white leading-tight tabular-nums">
              {premiumStatus.percentage}%
            </span>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Paid
            </span>
          </div>
        </div>

        {/* Legend & Breakdown */}
        <div className="flex-1 space-y-2 text-left pl-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 dark:bg-sky-400"></span>
              <span className="text-slate-600 dark:text-slate-400 font-medium">Paid</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums">
              ₹ {premiumStatus.paidAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <span className="text-slate-600 dark:text-slate-400 font-medium">Pending</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums">
              ₹ {premiumStatus.pendingAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">
              Total Premium
            </span>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums text-xs">
              ₹ {premiumStatus.totalPremium.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Next Payment Subcard */}
      <div
        onClick={() => setIsMakePaymentOpen(true)}
        className="mt-3.5 bg-slate-50/90 dark:bg-[#0c162b] hover:bg-slate-100/90 dark:hover:bg-[#13223f] border border-slate-100 dark:border-slate-800/80 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="text-left min-w-0">
            <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              Next payment due on {premiumStatus.nextDueDate}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
              <span>{premiumStatus.autoDebitEnabled ? 'Auto-debit enabled' : 'Auto-debit disabled'}</span>
              <span>•</span>
              <span>{premiumStatus.bankAccount}</span>
            </div>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 group-hover:text-blue-500 transition-all shrink-0 ml-2" />
      </div>
    </div>
  );
};
