import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WellnessPromoCard: React.FC = () => {
  const { setIsHerbalGuideOpen } = useApp();

  return (
    <div
      onClick={() => setIsHerbalGuideOpen(true)}
      className="mx-4 my-2.5 mb-6 bg-gradient-to-r from-blue-50/90 to-sky-50/90 dark:from-[#0d1a38] dark:to-[#091f3d] border border-blue-100 dark:border-blue-900/60 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow transition-all active:scale-[0.99] group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-500/30">
          <Sparkles className="w-5 h-5 stroke-[2]" />
        </div>
        <div className="text-left min-w-0">
          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
            Better Health. Brighter Future.
          </div>
          <div className="text-[11px] text-blue-700/80 dark:text-blue-300/80 truncate mt-0.5 font-medium">
            Explore our health & wellness programs
          </div>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-blue-500 dark:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
    </div>
  );
};
