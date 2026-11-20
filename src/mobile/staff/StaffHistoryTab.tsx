import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';

export const StaffHistoryTab: React.FC = () => {
  const { parcels } = useMobileStore();
  const collected = parcels.filter((p) => p.status === 'COLLECTED' || p.collectedAt);

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] sticky top-0 z-20">
        <h1 className="text-base font-black text-[#060D1E] tracking-tight">Shift Activity Log</h1>
        <p className="text-[11px] font-bold text-slate-500">Handovers and intake during current shift</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20 space-y-3">
        {collected.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border-2 border-dashed border-slate-300">
            <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-black text-slate-700">No handovers completed yet this shift</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">
              Verified OTP and QR handovers will appear in this shift activity log.
            </p>
          </div>
        ) : (
          collected.map((p) => (
            <div
              key={p.id}
              className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-[#060D1E] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-[#060D1E]">{p.carrier}</span>
                    <span className="text-xs font-mono font-bold text-slate-500">{p.trackingNumber}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-semibold">
                    Handed to {p.recipientName} ({p.flat})
                  </p>
                  <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
                    Verified by OTP • {p.collectedAt || 'Today, 5:15 PM'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
