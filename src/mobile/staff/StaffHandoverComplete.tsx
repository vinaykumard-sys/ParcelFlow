import React from 'react';
import { CheckCircle2, Package, User, Clock, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import type { MobileParcel } from '../types';

interface StaffHandoverCompleteProps {
  parcel: MobileParcel;
  onDone: () => void;
}

export const StaffHandoverComplete: React.FC<StaffHandoverCompleteProps> = ({
  parcel,
  onDone,
}) => {
  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-[#10B981] border-[3px] border-[#060D1E] shadow-[4px_4px_0px_#060D1E] flex items-center justify-center text-white mb-4">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>

        <h1 className="text-2xl font-black text-[#060D1E] mb-1">
          Handover Verified! ✅
        </h1>
        <p className="text-xs font-bold text-slate-600 mb-6 max-w-[260px] mx-auto">
          OTP verified and package officially logged as delivered to resident.
        </p>

        {/* Handover Details Summary Card */}
        <div className="w-full bg-white rounded-3xl border-2 border-[#060D1E] shadow-[4px_4px_0px_#060D1E] p-5 text-left mb-6 space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">Carrier & Tracking</p>
              <p className="text-sm font-mono font-black text-[#060D1E]">
                {parcel.carrier} • {parcel.trackingNumber}
              </p>
            </div>
            <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
              Complete
            </span>
          </div>

          <div className="space-y-2 text-xs font-bold">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#1E60F2]" /> Resident Name:
              </span>
              <span className="text-[#060D1E] font-black">
                {parcel.recipientName} ({parcel.flat})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#1E60F2]" /> Released Storage Slot:
              </span>
              <span className="text-emerald-700 font-black flex items-center gap-1">
                <span>{parcel.storageLocation}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.2 rounded">
                  VACATED
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#1E60F2]" /> Handover Timestamp:
              </span>
              <span className="text-[#060D1E] font-extrabold">Today, Just now</span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Verified By: On-Duty Hub Staff</span>
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
