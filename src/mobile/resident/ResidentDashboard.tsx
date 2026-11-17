import React from 'react';
import { Package, Clock, CheckCircle2, ChevronRight, Calendar, QrCode, Shield, Bell, Sparkles } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import type { MobileParcel } from '../types';

interface ResidentDashboardProps {
  onSelectParcel: (parcel: MobileParcel) => void;
  onScheduleSlot: (parcel: MobileParcel) => void;
  onShowPickupCode: (parcel: MobileParcel) => void;
  onOpenNotifications?: () => void;
}

export const ResidentDashboard: React.FC<ResidentDashboardProps> = ({
  onSelectParcel,
  onScheduleSlot,
  onShowPickupCode,
  onOpenNotifications,
}) => {
  const { parcels, selectedSociety } = useMobileStore();

  const residentParcels = parcels.filter(
    (p) => p.recipientName.includes('Vinay') || p.flat === 'B-402'
  );

  const waitingCount = residentParcels.filter((p) => p.status === 'WAITING').length;
  const scheduledCount = residentParcels.filter((p) => p.status === 'SCHEDULED').length;
  const collectedCount = residentParcels.filter((p) => p.status === 'COLLECTED').length;

  const getCarrierColor = (carrier: string) => {
    switch (carrier.toLowerCase()) {
      case 'amazon':
        return 'bg-amber-500 text-white';
      case 'flipkart':
        return 'bg-blue-600 text-white';
      case 'myntra':
        return 'bg-pink-600 text-white';
      case 'blue dart':
        return 'bg-red-600 text-white';
      default:
        return 'bg-indigo-600 text-white';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Top Bar with Resident Profile and Society Badge */}
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#1E60F2] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center font-black text-white text-base">
              V
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-black text-[#060D1E] leading-tight">
                  Good Day 👋
                </h1>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                <span>{selectedSociety.name}</span>
                <span className="text-slate-400">•</span>
                <span className="text-[#1E60F2] font-black">Flat B-402</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenNotifications}
            className="w-9 h-9 rounded-xl bg-white border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center relative active:scale-95 transition-transform"
          >
            <Bell className="w-4 h-4 text-[#060D1E]" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white" />
          </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Stats Badges Row: 2 Waiting, 1 Scheduled, 12 Collected */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-white p-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-amber-600">Waiting</span>
              <Package className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-[#060D1E]">{waitingCount}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">At Hub</div>
          </div>

          <div className="bg-white p-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-[#1E60F2]">Scheduled</span>
              <Calendar className="w-3.5 h-3.5 text-[#1E60F2]" />
            </div>
            <div className="text-2xl font-black text-[#060D1E]">{scheduledCount}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">Tonight</div>
          </div>

          <div className="bg-white p-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-emerald-600">Collected</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-[#060D1E]">{collectedCount}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">Total</div>
          </div>
        </div>

        {/* Quick Announcement Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-[#1E60F2] text-white border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-black uppercase tracking-wider text-blue-100">
                  Smart Hub Active
                </span>
              </div>
              <p className="text-xs font-extrabold leading-tight">
                Hub open till 9:30 PM. 1 parcel scheduled for collection tonight!
              </p>
            </div>
          </div>
        </div>

        {/* "Your Parcels" Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-[#060D1E] uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#1E60F2]" />
              Your Parcels ({residentParcels.filter((p) => p.status !== 'COLLECTED').length})
            </h2>
            <span className="text-[11px] font-bold text-[#1E60F2]">Tower B Hub</span>
          </div>

          <div className="space-y-3">
            {residentParcels
              .filter((p) => p.status !== 'COLLECTED')
              .map((parcel) => (
                <div
                  key={parcel.id}
                  className="bg-white rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4 transition-all hover:-translate-y-0.5"
                >
                  {/* Top card row: Carrier & Tracking + Status Badge */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg border border-[#060D1E] ${getCarrierColor(
                          parcel.carrier
                        )}`}
                      >
                        {parcel.carrier}
                      </span>
                      <span className="text-xs font-mono font-black text-[#060D1E]">
                        {parcel.trackingNumber}
                      </span>
                    </div>

                    {parcel.status === 'SCHEDULED' ? (
                      <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#1E60F2]" />
                        Scheduled
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        Ready for Pickup
                      </span>
                    )}
                  </div>

                  {/* Parcel Details row */}
                  <div className="mb-3">
                    <p className="text-xs font-bold text-[#060D1E] mb-0.5">
                      {parcel.description || 'Package parcel'}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-500">
                      Location: <span className="text-[#060D1E] font-bold">{parcel.storageLocation}</span>
                    </p>
                    {parcel.scheduledSlot && (
                      <p className="text-[11px] font-extrabold text-[#1E60F2] mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Slot: {parcel.scheduledSlot}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => onSelectParcel(parcel)}
                      className="flex-1 py-2 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 flex items-center justify-center gap-1"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {parcel.status === 'SCHEDULED' ? (
                      <button
                        onClick={() => onShowPickupCode(parcel)}
                        className="flex-1 py-2 px-3 text-xs font-black text-white bg-[#10B981] hover:bg-emerald-600 rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                      >
                        <QrCode className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Pickup Code</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onScheduleSlot(parcel)}
                        className="flex-1 py-2 px-3 text-xs font-black text-white bg-[#1E60F2] hover:bg-blue-600 rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                      >
                        <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Schedule Pickup</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Society Hub Info Pill */}
        <div className="p-3 bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-[#060D1E] flex items-center justify-center">
              <Shield className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <p className="text-xs font-black text-[#060D1E]">Society Hub Timings</p>
              <p className="text-[10px] font-bold text-slate-500">Counter Open: 8:00 AM – 10:00 PM Daily</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
            Active Now
          </span>
        </div>
      </div>
    </div>
  );
};
