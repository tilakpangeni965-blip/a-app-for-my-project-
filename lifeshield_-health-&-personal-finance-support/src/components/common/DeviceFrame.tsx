import React from 'react';
import { Sun, Moon, Smartphone, Maximize2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TopStatusBar } from './TopStatusBar';
import { AppHeader } from './AppHeader';
import { BottomTabBar } from './BottomTabBar';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { theme, toggleTheme, viewMode, setViewMode } = useApp();

  return (
    <div className="min-h-screen bg-slate-200/70 dark:bg-slate-950 flex flex-col items-center justify-start p-0 md:p-6 transition-colors font-sans antialiased">
      {/* Top Floating Control Bar for Demo / Testing */}
      <aside aria-label="Demo controls" className="w-full max-w-md mx-auto mb-3 px-4 pt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">LifeShield</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-medium">
            Health & Wealth
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Light/Dark Mode Switcher */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer font-medium"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span>Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light</span>
              </>
            )}
          </button>

          {/* Device Frame / Full Width Viewport Switcher */}
          <button
            onClick={() => setViewMode(viewMode === 'frame' ? 'full' : 'frame')}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer font-medium"
            title="Toggle Device Frame"
          >
            {viewMode === 'frame' ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expand</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Container: either iPhone Chassis Frame or Full Width Container */}
      <main
        className={`w-full transition-all duration-300 ${
          viewMode === 'frame'
            ? 'max-w-[420px] rounded-[48px] ring-12 ring-slate-900 dark:ring-slate-800/90 shadow-2xl overflow-hidden border-[4px] border-slate-800/40 dark:border-slate-700/50'
            : 'max-w-md md:rounded-3xl shadow-lg overflow-hidden'
        } bg-[#f8fafc] dark:bg-[#070e20] flex flex-col`}
        style={{ minHeight: '850px', maxHeight: viewMode === 'frame' ? '920px' : 'none' }}
      >
        {/* Dynamic Island / iPhone Speaker Notch Header in Frame mode */}
        {viewMode === 'frame' && (
          <div className="relative w-full flex justify-center pt-2 select-none pointer-events-none z-40">
            <div className="w-28 h-6 bg-slate-950 rounded-full flex items-center justify-between px-3 shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-blue-950/60 ring-1 ring-blue-900/30"></div>
            </div>
          </div>
        )}

        {/* Top Status Bar (9:41, wifi, battery) */}
        <TopStatusBar />

        {/* App Header (User avatar, Greeting, notification bell, settings) */}
        <AppHeader />

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth pb-4">
          {children}
        </div>

        {/* Bottom Tab Navigation Bar */}
        <BottomTabBar />

        {/* iPhone Home Indicator bar in frame mode */}
        {viewMode === 'frame' && (
          <div className="w-full flex justify-center pb-2 pt-1 bg-white/95 dark:bg-[#0b1329]/95">
            <div className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
          </div>
        )}
      </main>
    </div>
  );
};
