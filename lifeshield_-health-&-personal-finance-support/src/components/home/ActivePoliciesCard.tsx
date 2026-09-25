import React from 'react';
import { Shield, Heart, PiggyBank, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Policy } from '../../types';

export const ActivePoliciesCard: React.FC = () => {
  const { policies, setActiveTab, setSelectedPolicyForDetail } = useApp();

  const getPolicyIcon = (type: Policy['type']) => {
    switch (type) {
      case 'health':
        return (
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Heart className="w-5 h-5 fill-blue-500/20 stroke-[2]" />
          </div>
        );
      case 'life':
        return (
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Shield className="w-5 h-5 fill-emerald-500/20 stroke-[2]" />
          </div>
        );
      case 'savings':
        return (
          <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <PiggyBank className="w-5 h-5 fill-purple-500/20 stroke-[2]" />
          </div>
        );
    }
  };

  return (
    <div className="mx-4 my-2.5 bg-white dark:bg-[#101b33] rounded-2xl border border-slate-100 dark:border-slate-800/90 shadow-sm p-4 transition-colors">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-500/20">
            <Shield className="w-4 h-4 fill-white/20 stroke-[2.2]" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              Active Policies
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
              View and manage your policies
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('policies')}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-0.5 cursor-pointer active:scale-95 transition-all"
        >
          View All <span className="text-xs">→</span>
        </button>
      </div>

      {/* Policy Items List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {policies.map((policy) => (
          <div
            key={policy.id}
            onClick={() => {
              setSelectedPolicyForDetail(policy);
            }}
            className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-2.5 cursor-pointer group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 rounded-xl px-1 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              {getPolicyIcon(policy.type)}
              <div className="text-left min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {policy.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {policy.subtitle}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-right shrink-0">
              <div className="flex flex-col items-end">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 mb-0.5">
                  {policy.status}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {policy.coverageFormatted}
                  <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 ml-1">
                    {policy.coverageLabel}
                  </span>
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 group-hover:text-blue-500 transition-all shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
