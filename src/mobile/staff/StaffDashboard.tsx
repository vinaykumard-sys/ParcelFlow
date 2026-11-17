import React from 'react';
import { Package, Clock, QrCode, Search, AlertTriangle, ArrowRight, CheckCircle2, Shield, PlusCircle, ScanLine } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';

interface StaffDashboardProps {
  onReceiveParcel: () => void;
  onHandoverParcel: () => void;
  onOpenParcelList: () => void;
  onFindResident: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  onReceiveParcel,
  onHandoverParcel,
  onOpenParcelList,
  onFindResident,
}) => {
  const { selectedSociety, parcels } = useMobileStore();

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Top Header */}
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#060D1E] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center font-black text-white text-base">
              R
            </div>
            <div>
              <h1 className="text-base font-black text-[#060D1E] leading-tight">
                Good Morning, Ramesh 👋
              </h1>
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                <span>{selectedSociety.name}</span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-700 font-black">Gate Hub #1</span>
              </div>
            </div>
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
            On Duty
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* KPI Stats Grid (24 Total, 12 Awaiting, 8 Scheduled, 4 Overdue) */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-slate-500">Total Parcels</span>
              <Package className="w-4 h-4 text-[#1E60F2]" />
            </div>
            <div className="text-2xl font-black text-[#060D1E]">24</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">In Hub Today</div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-amber-600">Awaiting Storage</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-[#060D1E]">12</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">Needs Rack Assignment</div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-[#1E60F2]">Scheduled Today</span>
              <CheckCircle2 className="w-4 h-4 text-[#1E60F2]" />
            </div>
            <div className="text-2xl font-black text-[#060D1E]">8</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">Staged for Evening</div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-rose-600">Overdue (&gt;48h)</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-[#060D1E]">4</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">Reminder Triggered</div>
          </div>
        </div>

        {/* Primary Action Buttons: [Receive Parcel] & [Handover Parcel] */}
        <div className="space-y-2.5">
          <button
            onClick={onReceiveParcel}
            className="w-full p-4 bg-[#1E60F2] hover:bg-blue-600 active:scale-95 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/40 flex items-center justify-center">
                <PlusCircle className="w-6 h-6 text-white stroke-[2.5]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black leading-tight">Receive Parcel</p>
                <p className="text-[11px] text-blue-100 font-medium">Scan courier barcode & assign rack</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            onClick={onHandoverParcel}
            className="w-full p-4 bg-[#10B981] hover:bg-emerald-600 active:scale-95 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/40 flex items-center justify-center">
                <QrCode className="w-6 h-6 text-white stroke-[2.5]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black leading-tight">Handover Parcel</p>
                <p className="text-[11px] text-emerald-100 font-medium">Verify resident 6-digit OTP or scan QR</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Quick Actions Row: [Parcel List] & [Find Resident] */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onOpenParcelList}
              className="p-3 bg-white hover:bg-slate-50 text-[#060D1E] rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center gap-2.5 text-left"
            >
              <Package className="w-4 h-4 text-[#1E60F2]" />
              <div>
                <p className="text-xs font-black">Parcel List</p>
                <p className="text-[10px] text-slate-500 font-bold">24 in inventory</p>
              </div>
            </button>

            <button
              onClick={onFindResident}
              className="p-3 bg-white hover:bg-slate-50 text-[#060D1E] rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center gap-2.5 text-left"
            >
              <Search className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-xs font-black">Find Resident</p>
                <p className="text-[10px] text-slate-500 font-bold">Directory search</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#060D1E] mb-3 flex items-center justify-between">
            <span>Recent Hub Activity</span>
            <span className="text-[10px] text-[#1E60F2] font-black">Live</span>
          </h3>

          <div className="space-y-2.5 divide-y divide-slate-100 text-xs">
            <div className="pt-2 first:pt-0 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-[#060D1E]">Amazon (PF-8921-IN)</p>
                <p className="text-[10px] text-slate-500">Stored in Rack B-17 for Vinay (B-402)</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400">10:45 AM</span>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-[#060D1E]">Flipkart (PF-8922-IN)</p>
                <p className="text-[10px] text-slate-500">Scheduled for 8:00 PM collection</p>
              </div>
              <span className="text-[10px] font-bold text-[#1E60F2]">1:15 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
