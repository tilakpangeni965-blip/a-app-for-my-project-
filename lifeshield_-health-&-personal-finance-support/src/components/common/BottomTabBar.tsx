import React from 'react';
import { Home, Shield, Heart, FileCheck2, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';

interface TabItem {
  key: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabItem[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'policies', label: 'Policies', icon: Shield },
  { key: 'health', label: 'Health', icon: Heart },
  { key: 'claims', label: 'Claims', icon: FileCheck2 },
  { key: 'more', label: 'More', icon: Menu },
];

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="sticky bottom-0 z-40 w-full bg-white/95 dark:bg-[#0b1329]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 flex items-center justify-around shrink-0 transition-colors">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
                }`}
              />
              {tab.key === 'claims' && (
                <span className="sr-only">Claims updates</span>
              )}
            </div>
            <span
              className={`text-[10px] mt-1 tracking-tight leading-none ${
                isActive ? 'font-semibold' : 'font-medium'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
