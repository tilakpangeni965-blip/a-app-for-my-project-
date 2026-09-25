import React from 'react';
import {
  CreditCard,
  FileText,
  ShieldCheck,
  HeartPulse,
  Activity,
  Headphones
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickActionsGrid: React.FC = () => {
  const {
    setIsMakePaymentOpen,
    setIsFileClaimOpen,
    setActiveTab,
    setIsWellnessOpen,
    setIsHerbalGuideOpen
  } = useApp();

  const actions = [
    {
      id: 'make_payment',
      title: 'Make Payment',
      subtitle: 'Pay your premium',
      icon: CreditCard,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200/80 dark:border-blue-900/60',
      action: () => setIsMakePaymentOpen(true)
    },
    {
      id: 'file_claim',
      title: 'File a Claim',
      subtitle: 'Start your claim',
      icon: FileText,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-900/60',
      action: () => setIsFileClaimOpen(true)
    },
    {
      id: 'view_policy',
      title: 'View Policy',
      subtitle: 'Check details',
      icon: ShieldCheck,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200/80 dark:border-purple-900/60',
      action: () => setActiveTab('policies')
    },
    {
      id: 'health_checkup',
      title: 'Health Checkup',
      subtitle: 'Book appointment',
      icon: HeartPulse,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200/80 dark:border-rose-900/60',
      action: () => setActiveTab('health')
    },
    {
      id: 'track_wellness',
      title: 'Track Wellness',
      subtitle: 'Stay healthy',
      icon: Activity,
      color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200/80 dark:border-cyan-900/60',
      action: () => setIsWellnessOpen(true)
    },
    {
      id: 'support',
      title: 'Support',
      subtitle: 'Talk to us',
      icon: Headphones,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200/80 dark:border-indigo-900/60',
      action: () => setActiveTab('more')
    }
  ];

  return (
    <div className="mx-4 my-2.5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-left">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
            Quick Actions
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
            Get things done, in just a few taps
          </p>
        </div>

        <button
          onClick={() => setActiveTab('health')}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-0.5 cursor-pointer active:scale-95 transition-all"
        >
          See All <span className="text-xs">→</span>
        </button>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="bg-white dark:bg-[#101b33] border border-slate-100 dark:border-slate-800/90 rounded-2xl p-3 flex flex-col items-center text-center shadow-sm hover:shadow transition-all active:scale-[0.97] cursor-pointer group"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 border ${item.color} group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate w-full">
                {item.title}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate w-full">
                {item.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
