import React from 'react';
import { Home, Shield, Wallet, Heart, FileCheck2, Headphones, Menu } from 'lucide-react';
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
  { key: 'finance', label: 'Finance', icon: Wallet },
  { key: 'health', label: 'Health', icon: Heart },
  { key: 'claims', label: 'Claims', icon: FileCheck2 },
  { key: 'support', label: 'Support', icon: Headphones },
  { key: 'more', label: 'Profile', icon: Menu },
];

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="md:hidden sticky bottom-0 z-40 w-full bg-white/95 dark:bg-[#0b1329]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-1 py-1.5 flex items-center justify-around shrink-0 transition-colors">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-col items-center justify-center min-w-[44px] py-1 px-1 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Icon
              className={`w-5 h-5 transition-transform ${
                isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
              }`}
            />
            <span
              className={`text-[9.5px] mt-0.5 tracking-tight leading-none ${
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
