import React from 'react';
import { Sun, Moon, Shield, PhoneCall, User, Lock, Smartphone, Monitor } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppHeader } from './AppHeader';
import { BottomTabBar } from './BottomTabBar';
import { TabType } from '../../types';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const {
    theme,
    toggleTheme,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    authUser,
    setIsAuthModalOpen,
    setSelectedEmergencyId
  } = useApp();

  const navLinks: { key: TabType; label: string }[] = [
    { key: 'home', label: 'Dashboard' },
    { key: 'policies', label: 'Insurance Plans' },
    { key: 'finance', label: 'Financial Ledger' },
    { key: 'health', label: 'Health Vault' },
    { key: 'claims', label: 'Claims Desk' },
    { key: 'support', label: 'Care Directory' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070e1c] text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-blue-600 selection:text-white">
      {/* 1. Universal Desktop Navigation Top Bar (3-Zone Contract) */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0b1326]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
                <Shield className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white block leading-none">
                  LifeShield
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5 block">
                  Health & Personal Finance Support
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean Navigation Links (Desktop/Tablet) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.key;
              return (
                <button
                  key={link.key}
                  onClick={() => setActiveTab(link.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions (Emergency Hotline, Account, Theme, Viewport Toggle) */}
          <div className="flex items-center gap-2">
            {/* Quick Emergency Triage Hotline Button */}
            <button
              onClick={() => {
                setActiveTab('support');
                setSelectedEmergencyId('em-amb');
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60 text-xs font-bold transition-colors cursor-pointer"
              title="Emergency Medical Hotline (100 / 102)"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              <span>Emergency 102</span>
            </button>

            {/* Auth / Account Profile Button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200/80 dark:border-slate-800 transition-colors cursor-pointer"
            >
              {authUser ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="truncate max-w-[80px] sm:max-w-[120px]">{authUser.name}</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 transition-colors cursor-pointer"
              title="Toggle Color Theme"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* View Mode Toggle (Responsive Full View vs Mobile Simulator) */}
            <button
              onClick={() => setViewMode(viewMode === 'full' ? 'frame' : 'full')}
              className="hidden lg:flex p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 transition-colors cursor-pointer"
              title={viewMode === 'full' ? 'Preview in Mobile Simulator' : 'Switch to Responsive Desktop'}
              aria-label="Switch layout view"
            >
              {viewMode === 'full' ? (
                <Smartphone className="w-4 h-4" />
              ) : (
                <Monitor className="w-4 h-4 text-blue-500" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Viewport Container */}
      <div className="flex-1 flex flex-col items-center w-full">
        {viewMode === 'frame' ? (
          // Mobile Phone Simulator Mode (For mobile ergonomics testing)
          <div className="my-6 w-full max-w-[420px] rounded-[44px] ring-8 ring-slate-800/90 shadow-2xl overflow-hidden border-[3px] border-slate-700/60 bg-white dark:bg-[#091124] flex flex-col">
            <AppHeader />
            <main className="flex-1 overflow-y-auto px-1 pb-4">
              {children}
            </main>
            <BottomTabBar />
          </div>
        ) : (
          // Responsive Standard Production Layout (Scales fluidly from mobile to 1440px desktop)
          <div className="w-full flex-1 flex flex-col">
            {/* Mobile Header (Only visible on small screens where desktop top bar nav is hidden) */}
            <div className="md:hidden">
              <AppHeader />
            </div>

            {/* Centralized Content Viewport */}
            <main className="w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1">
              {children}
            </main>

            {/* Mobile Bottom Tab Bar */}
            <BottomTabBar />
          </div>
        )}
      </div>

      {/* 3. Quiet Production Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070d1a] py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">LifeShield</span>
            <span>·</span>
            <span>IRDAI & Health Data Privacy Compliant</span>
            <span>·</span>
            <span>256-Bit Encrypted Vault</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Emergency Services: 100 / 102</span>
            <span>·</span>
            <button
              onClick={() => setActiveTab('more')}
              className="hover:underline cursor-pointer"
            >
              Privacy Policy & Terms
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
