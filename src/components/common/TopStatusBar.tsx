import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

export const TopStatusBar: React.FC = () => {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours % 12 || 12}:${mins}`);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-11 px-7 flex items-center justify-between text-xs font-semibold select-none z-30 text-slate-800 dark:text-slate-100 shrink-0">
      <span>{time}</span>
      <div className="flex items-center gap-1.5">
        {/* Cellular signal bars */}
        <div className="flex items-end gap-[1.5px] h-3">
          <div className="w-[3px] h-1.5 bg-current rounded-[0.5px]"></div>
          <div className="w-[3px] h-2 bg-current rounded-[0.5px]"></div>
          <div className="w-[3px] h-2.5 bg-current rounded-[0.5px]"></div>
          <div className="w-[3px] h-3 bg-current rounded-[0.5px]"></div>
        </div>
        <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
        <div className="flex items-center">
          <Battery className="w-5 h-5 fill-current" />
        </div>
      </div>
    </div>
  );
};
