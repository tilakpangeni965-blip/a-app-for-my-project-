import React from 'react';
import { Shield, Plus, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActivePoliciesCard } from '../home/ActivePoliciesCard';
import { PremiumStatusCard } from '../home/PremiumStatusCard';

export const PoliciesScreen: React.FC = () => {
  const { policies, setSelectedPolicyForDetail, setIsMakePaymentOpen } = useApp();

  const totalCoverage = policies.reduce((acc, p) => acc + p.coverageAmount, 0);

  return (
    <div className="pb-6">
      {/* Top Banner */}
      <div className="mx-4 mt-2 mb-3 bg-white dark:bg-[#101b33] rounded-2xl border border-slate-100 dark:border-slate-800/90 p-4 text-left shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total Protection Portfolio
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            3 Active Plans
          </span>
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
          ₹ {totalCoverage.toLocaleString('en-IN')}
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          Combined Health, Life & Wealth protection across verified insurers.
        </p>
      </div>

      {/* Active Policies Component */}
      <ActivePoliciesCard />

      {/* Premium Payment Status Card */}
      <PremiumStatusCard />

      {/* Renewal Calendar & Cashless Network */}
      <div className="mx-4 mt-3 bg-white dark:bg-[#101b33] rounded-2xl border border-slate-100 dark:border-slate-800/90 p-4 text-left shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
          Upcoming Schedule & Verification
        </h4>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-slate-600 dark:text-slate-400">Health Floater Renewal</span>
            <span className="font-semibold text-slate-900 dark:text-white">25 Oct 2026</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-slate-600 dark:text-slate-400">Term Life Renewal</span>
            <span className="font-semibold text-slate-900 dark:text-white">15 Nov 2026</span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-slate-600 dark:text-slate-400">ULIP Investment Renewal</span>
            <span className="font-semibold text-slate-900 dark:text-white">05 Dec 2026</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setIsMakePaymentOpen(true)}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          >
            Review Premium Dues & Auto-Debit →
          </button>
        </div>
      </div>
    </div>
  );
};
