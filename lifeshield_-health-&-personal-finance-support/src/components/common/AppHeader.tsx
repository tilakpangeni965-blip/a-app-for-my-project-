import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AppHeader: React.FC = () => {
  const { user, setIsNotificationsOpen, setActiveTab } = useApp();

  return (
    <header className="px-5 pt-1 pb-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('more')}
          className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-blue-500/20 dark:border-blue-400/30 flex items-center justify-center bg-blue-100 dark:bg-blue-950 transition-transform active:scale-95 cursor-pointer shadow-sm"
          title="Open Profile Settings"
          aria-label="Open profile settings"
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // fallback if image not loaded
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm pointer-events-none">
            {user.name.charAt(0)}
          </div>
        </button>

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-tight">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {user.greeting}
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {user.name}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tracking-tight font-normal">
            Your health. Your wealth. Our priority.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 active:scale-95 transition-all cursor-pointer"
          title="Notifications"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5 stroke-[1.8]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
        </button>

        <button
          onClick={() => setActiveTab('more')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 active:scale-95 transition-all cursor-pointer"
          title="Settings and Profile"
          aria-label="Open settings"
        >
          <Settings className="w-5 h-5 stroke-[1.8]" />
        </button>
      </div>
    </header>
  );
};
