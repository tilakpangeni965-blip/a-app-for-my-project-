import React from 'react';
import { Shield, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActivePoliciesCard } from '../home/ActivePoliciesCard';
import { PremiumStatusCard } from '../home/PremiumStatusCard';

export const PoliciesScreen: React.FC = () => {
  const { policies, setIsAddPolicyOpen, setIsMakePaymentOpen } = useApp();

  const totalCoverage = policies.reduce((acc, p) => acc + p.coverageAmount, 0);

  return (
    <div className="space-y-4 text-left">
      {/* Portfolio Header */}
      <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-semibold text-slate-500">
              Total Protection Portfolio
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight mt-0.5">
              ₹ {totalCoverage.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {policies.length > 0
                ? `${policies.length} active coverage policy${policies.length > 1 ? 'ies' : ''} linked to your vault`
                : 'No insurance policies linked yet'}
            </p>
          </div>

          <button
            onClick={() => setIsAddPolicyOpen(true)}
            className="self-start sm:self-auto flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Link New Plan</span>
          </button>
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left column: Policies List */}
        <div className="lg:col-span-7 space-y-4">
          <ActivePoliciesCard />

          {/* Actual Policy Due Dates (Only show if policies exist) */}
          {policies.length > 0 && (
            <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 shadow-xs">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white mb-2.5">
                Upcoming Policy Schedule
              </h2>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {policies.map((p) => (
                  <div key={p.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block">
                        {p.title}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {p.insurer} • Renewal: {p.renewalDate}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Due Date</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {p.nextDueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Premium Status */}
        <div className="lg:col-span-5 space-y-4">
          <PremiumStatusCard />
        </div>
      </div>
    </div>
  );
};
