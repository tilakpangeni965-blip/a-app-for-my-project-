import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HeroBanner: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div
      onClick={() => setActiveTab('policies')}
      className="relative overflow-hidden rounded-2xl mx-4 my-2.5 shadow-sm cursor-pointer group transition-transform active:scale-[0.99]"
      style={{ minHeight: '100px' }}
    >
      {/* Background Image with Fallback Gradient */}
      <img
        src="/src/assets/images/hero_landscape_mountain_1790311946565.jpg"
        alt="Mountain landscape"
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
      {/* Visual Overlay matching image blue mood */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/75 to-cyan-900/60 dark:from-slate-950/95 dark:via-blue-950/85 dark:to-cyan-950/70" />

      {/* Content */}
      <div className="relative z-10 px-5 py-4 flex items-center justify-between text-white">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold tracking-tight text-white drop-shadow-sm">
            Secure your future
          </h2>
          <p className="text-xs text-blue-100/90 dark:text-blue-200/80 font-normal">
            Better health, stronger tomorrow.
          </p>
        </div>

        <div className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shrink-0 transition-all group-hover:translate-x-0.5">
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
};
