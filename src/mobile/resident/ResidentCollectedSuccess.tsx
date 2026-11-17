import React from 'react';
import { CheckCircle2, Package, Calendar, MapPin, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import type { MobileParcel } from '../types';

interface ResidentCollectedSuccessProps {
  parcel: MobileParcel;
  onDone: () => void;
}

export const ResidentCollectedSuccess: React.FC<ResidentCollectedSuccessProps> = ({
  parcel,
  onDone,
}) => {
  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 text-center">
        {/* Animated Success Badge */}
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-full bg-[#10B981] border-[3px] border-[#060D1E] shadow-[4px_4px_0px_#060D1E] flex items-center justify-center text-white">
            <CheckCircle2 className="w-14 h-14 stroke-[2.5]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-400 border-2 border-[#060D1E] flex items-center justify-center text-amber-950 font-black">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-[#060D1E] mb-1">
          Parcel Handed Over! 🎉
        </h1>
        <p className="text-xs font-bold text-slate-600 max-w-[260px] mx-auto mb-6">
          Your <span className="text-[#060D1E] font-black">{parcel.carrier}</span> package has been successfully collected from the society hub.
        </p>

        {/* Digital Receipt Card */}
        <div className="w-full bg-white rounded-3xl border-2 border-[#060D1E] shadow-[4px_4px_0px_#060D1E] p-5 text-left mb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">Tracking ID</p>
              <p className="text-sm font-mono font-black text-[#060D1E]">{parcel.trackingNumber}</p>
            </div>
            <span className="px-2.5 py-0.5 text-[11px] font-black rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Verified
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-[10px] font-bold text-slate-400">Recipient</p>
              <p className="font-extrabold text-[#060D1E]">{parcel.recipientName}</p>
              <p className="text-[11px] font-semibold text-slate-500">Flat {parcel.flat}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400">Handover Time</p>
              <p className="font-extrabold text-[#060D1E]">Today, Just now</p>
              <p className="text-[11px] font-semibold text-emerald-600">Hub Counter B</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Verified by: Staff Ramesh (Hub Security)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Done Button */}
      <div className="p-6 bg-[#FEF9F3] border-t border-slate-200">
        <button
          onClick={onDone}
          className="w-full py-3.5 px-6 bg-[#1E60F2] hover:bg-blue-600 active:scale-95 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all"
        >
          <span>Done</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
