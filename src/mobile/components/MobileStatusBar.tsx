import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export const MobileStatusBar: React.FC<{ light?: boolean }> = ({ light = false }) => {
  return (
    <div
      className={`w-full flex items-center justify-between px-6 pt-3 pb-1 text-xs font-semibold select-none z-30 ${
        light ? 'text-white' : 'text-[#060D1E]'
      }`}
    >
      <span className="tracking-tight font-bold">9:41</span>
      <div className="w-20 h-4 bg-black/10 rounded-full mx-auto hidden sm:block opacity-30" />
      <div className="flex items-center gap-1.5">
        <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
        <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
        <BatteryMedium className="w-4 h-4 stroke-[2.5]" />
      </div>
    </div>
  );
};
