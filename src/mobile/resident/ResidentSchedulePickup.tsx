import React, { useState } from 'react';
import { ArrowLeft, Clock, Calendar, CheckCircle2, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import type { MobileParcel } from '../types';

interface ResidentSchedulePickupProps {
  parcel: MobileParcel;
  onBack: () => void;
  onConfirmSuccess: (parcel: MobileParcel, otp: string) => void;
}

export const ResidentSchedulePickup: React.FC<ResidentSchedulePickupProps> = ({
  parcel,
  onBack,
  onConfirmSuccess,
}) => {
  const { slots, schedulePickup } = useMobileStore();
  const [selectedSlotId, setSelectedSlotId] = useState<string>(
    slots.find((s) => s.isAvailable)?.id || slots[0].id
  );
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      const res = schedulePickup(parcel.id, selectedSlotId);
      setLoading(false);
      onConfirmSuccess(parcel, res.otp);
    }, 400);
  };

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
        <h1 className="text-sm font-black text-[#060D1E] tracking-tight">Schedule Pickup</h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Selected Parcel Summary Header */}
        <div className="bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-[#1E60F2]">
              {parcel.carrier} • {parcel.trackingNumber}
            </span>
            <p className="text-xs font-black text-[#060D1E] mt-0.5">
              Hub Location: {parcel.storageLocation}
            </p>
          </div>
          <span className="text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
            Ready
          </span>
        </div>

        {/* Date Selector Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#060D1E]">
            <Calendar className="w-4 h-4 text-[#1E60F2]" />
            <span>Select Time Window (Today, 17 Nov)</span>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
            30-min Batches
          </span>
        </div>

        {/* Slots List */}
        <div className="space-y-2.5">
          {slots.map((slot) => {
            const isSelected = selectedSlotId === slot.id;
            const isFull = !slot.isAvailable || slot.bookedCount >= slot.capacity;
            const percentage = Math.round((slot.bookedCount / slot.capacity) * 100);

            return (
              <button
                key={slot.id}
                type="button"
                disabled={isFull}
                onClick={() => setSelectedSlotId(slot.id)}
                className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all ${
                  isFull
                    ? 'bg-slate-100 border-slate-300 opacity-60 cursor-not-allowed'
                    : isSelected
                    ? 'bg-white border-[#1E60F2] ring-2 ring-[#1E60F2] shadow-[3px_3px_0px_#1E60F2]'
                    : 'bg-white border-[#060D1E] shadow-[2px_2px_0px_#060D1E] hover:border-[#1E60F2]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-[#1E60F2] bg-[#1E60F2] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-black text-[#060D1E]">{slot.timeWindow}</span>
                  </div>

                  {isFull ? (
                    <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                      Full
                    </span>
                  ) : slot.bookedCount > 20 ? (
                    <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      Filling Fast
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Available
                    </span>
                  )}
                </div>

                {/* Capacity Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div
                    className={`h-full rounded-full ${
                      isFull ? 'bg-rose-500' : percentage > 80 ? 'bg-amber-500' : 'bg-[#10B981]'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] font-semibold text-slate-500">
                  <span>
                    {slot.bookedCount} / {slot.capacity} booked
                  </span>
                  <span>{percentage}% capacity</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-[#1E60F2] shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold text-blue-900 leading-tight">
            Booking a slot guarantees that your package is staged on the express counter, reducing pickup wait time to under 45 seconds!
          </p>
        </div>
      </div>

      {/* Bottom Sticky CTA Button */}
      <div className="p-4 bg-white border-t-2 border-[#060D1E]">
        <button
          onClick={handleConfirm}
          disabled={loading || !selectedSlotId}
          className="w-full py-3.5 px-4 bg-[#1E60F2] hover:bg-blue-600 active:scale-95 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all"
        >
          <span>{loading ? 'Confirming Slot...' : 'Confirm Slot'}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
