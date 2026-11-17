import React from 'react';
import { ArrowLeft, Package, Clock, CheckCircle2, MapPin, Shield, Calendar, QrCode } from 'lucide-react';
import type { MobileParcel } from '../types';

interface ResidentParcelDetailsProps {
  parcel: MobileParcel;
  onBack: () => void;
  onScheduleSlot: (parcel: MobileParcel) => void;
  onShowPickupCode: (parcel: MobileParcel) => void;
}

export const ResidentParcelDetails: React.FC<ResidentParcelDetailsProps> = ({
  parcel,
  onBack,
  onScheduleSlot,
  onShowPickupCode,
}) => {
  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Top Header */}
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] flex items-center justify-between sticky top-0 z-20">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </button>
        <h1 className="text-sm font-black text-[#060D1E] tracking-tight">Parcel Tracking</h1>
        <div className="w-9" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Main Parcel Overview Card */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#1E60F2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                {parcel.carrier} Express
              </span>
              <h2 className="text-xl font-mono font-black text-[#060D1E] mt-1">
                {parcel.trackingNumber}
              </h2>
              <p className="text-xs font-bold text-slate-600 mt-0.5">{parcel.description || 'Package'}</p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center">
              <Package className="w-6 h-6 text-amber-700" />
            </div>
          </div>

          <div className="p-3 bg-[#FEF9F3] rounded-2xl border border-slate-300 space-y-1.5 text-xs font-bold">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#1E60F2]" /> Society Hub Rack:
              </span>
              <span className="text-[#060D1E] font-black">{parcel.storageLocation}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">Recipient:</span>
              <span className="text-[#060D1E] font-extrabold">{parcel.recipientName} ({parcel.flat})</span>
            </div>
            {parcel.scheduledSlot && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Scheduled Slot:</span>
                <span className="text-[#1E60F2] font-black">{parcel.scheduledSlot}</span>
              </div>
            )}
          </div>
        </div>

        {/* Parcel Lifecycle Timeline */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-5">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#060D1E] mb-4 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#1E60F2]" /> Delivery Lifecycle
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {parcel.timeline.map((step, idx) => {
              const isDone = step.completed;
              const isCurrent = step.current;

              return (
                <div key={idx} className="relative">
                  {/* Step Dot */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${
                      isDone
                        ? 'bg-[#10B981] border-[#060D1E] text-white shadow-[1px_1px_0px_#060D1E]'
                        : isCurrent
                        ? 'bg-[#1E60F2] border-[#060D1E] text-white animate-pulse'
                        : 'bg-white border-slate-300 text-slate-300'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-3 h-3 stroke-[3]" /> : idx + 1}
                  </div>

                  {/* Step Details */}
                  <div>
                    <div className="flex items-baseline justify-between">
                      <p
                        className={`text-xs font-black ${
                          isDone || isCurrent ? 'text-[#060D1E]' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      {step.time && (
                        <span className="text-[10px] font-bold text-slate-400">{step.time}</span>
                      )}
                    </div>
                    {step.sublabel && (
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                        {step.sublabel}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security & Authenticity info */}
        <div className="p-3 bg-emerald-50 rounded-2xl border-2 border-emerald-500 shadow-[2px_2px_0px_#10B981] flex items-center gap-3">
          <Shield className="w-6 h-6 text-emerald-600 shrink-0" />
          <div className="text-[11px] text-emerald-950 font-bold">
            Guaranteed Handover: Society staff will strictly require 6-digit OTP verification or QR scan.
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Button */}
      <div className="p-4 bg-white border-t-2 border-[#060D1E]">
        {parcel.status === 'SCHEDULED' ? (
          <button
            onClick={() => onShowPickupCode(parcel)}
            className="w-full py-3.5 px-4 bg-[#10B981] hover:bg-emerald-600 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4 stroke-[2.5]" />
            <span>Show Pickup Pass & OTP</span>
          </button>
        ) : parcel.status === 'COLLECTED' ? (
          <div className="w-full py-3 px-4 bg-slate-100 text-slate-600 font-black text-xs text-center rounded-2xl border border-slate-300">
            Parcel Already Collected
          </div>
        ) : (
          <button
            onClick={() => onScheduleSlot(parcel)}
            className="w-full py-3.5 px-4 bg-[#1E60F2] hover:bg-blue-600 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Calendar className="w-4 h-4 stroke-[2.5]" />
            <span>Schedule Pickup Slot</span>
          </button>
        )}
      </div>
    </div>
  );
};
