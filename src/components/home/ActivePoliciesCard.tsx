import React from 'react';
import { Shield, Heart, PiggyBank, ChevronRight, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Policy } from '../../types';

export const ActivePoliciesCard: React.FC = () => {
  const { policies, setIsAddPolicyOpen, setSelectedPolicyForDetail } = useApp();

  const getPolicyIcon = (type: Policy['type']) => {
    switch (type) {
      case 'health':
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4 stroke-[2]" />
          </div>
        );
      case 'life':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 stroke-[2]" />
          </div>
        );
      case 'savings':
        return (
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <PiggyBank className="w-4 h-4 stroke-[2]" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 shadow-xs transition-colors text-left">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
            <Shield className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              Insurance Plans
            </h2>
            <p className="text-[11px] text-slate-500 leading-none mt-0.5">
              {policies.length > 0 ? `${policies.length} active coverage plan${policies.length > 1 ? 's' : ''}` : 'No active policies'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddPolicyOpen(true)}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Plan</span>
        </button>
      </div>

      {/* Policy List or Clean Minimalist Empty State */}
      {policies.length === 0 ? (
        <div className="py-5 px-3 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            No insurance policies linked yet
          </p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
            Link your health, term life, or savings insurance policy to track coverage and due dates.
          </p>
          <button
            onClick={() => setIsAddPolicyOpen(true)}
            className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Link Your Insurance Plan</span>
          </button>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {policies.map((policy) => (
            <div
              key={policy.id}
              onClick={() => setSelectedPolicyForDetail(policy)}
              className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between gap-2.5 cursor-pointer group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 rounded-xl px-1 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {getPolicyIcon(policy.type)}
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {policy.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {policy.insurer} • {policy.policyNumber}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-right shrink-0">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {policy.status}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {policy.coverageFormatted}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-500 transition-all shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
