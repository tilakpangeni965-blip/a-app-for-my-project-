import React from 'react';
import { Calendar, CheckCircle2, ChevronRight, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PremiumStatusCard: React.FC = () => {
  const { premiumStatus, setIsMakePaymentOpen } = useApp();

  const hasDues = premiumStatus.totalPremium > 0;
  const isPaidInFull = hasDues && premiumStatus.pendingAmount === 0;

  return (
    <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 shadow-xs transition-colors text-left">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
            <Calendar className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              Premium Schedule
            </h2>
            <p className="text-[11px] text-slate-500 leading-none mt-0.5">
              {isPaidInFull
                ? 'All premiums up to date'
                : hasDues
                ? `Next due on ${premiumStatus.nextDueDate}`
                : 'No pending dues'}
            </p>
          </div>
        </div>

        {hasDues && (
          <button
            onClick={() => setIsMakePaymentOpen(true)}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Pay Now →
          </button>
        )}
      </div>

      {!hasDues ? (
        <div className="py-4 text-center text-xs text-slate-500">
          No insurance premium payments are currently due.
        </div>
      ) : (
        <div className="space-y-3">
          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 font-medium">Payment Progress</span>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                {premiumStatus.percentage}% Paid
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, premiumStatus.percentage)}%` }}
              />
            </div>
          </div>

          {/* Breakdown numbers */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
              <span className="text-[10px] text-slate-400 block font-medium">Paid Amount</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                ₹ {premiumStatus.paidAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
              <span className="text-[10px] text-slate-400 block font-medium">Pending Dues</span>
              <span className={`text-xs font-bold tabular-nums ${premiumStatus.pendingAmount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                ₹ {premiumStatus.pendingAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsMakePaymentOpen(true)}
            className="w-full py-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Make a Payment</span>
          </button>
        </div>
      )}
    </div>
  );
};
