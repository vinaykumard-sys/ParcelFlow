import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, CheckCircle2, ArrowRight, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import type { MobileParcel } from '../types';
import { pickupService, type EnrichedPickupSlot } from '../../services/pickupService';
import { otpQrService } from '../../services/otpQrService';

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
  const { slots: fallbackSlots, schedulePickup } = useMobileStore();
  const [liveSlots, setLiveSlots] = useState<EnrichedPickupSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load live slots from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    pickupService.getPickupSlots('a1111111-1111-1111-1111-111111111111').then((slots) => {
      if (isMounted && slots.length > 0) {
        setLiveSlots(slots);
        const firstAvailable = slots.find((s) => s.isBookable);
        if (firstAvailable) {
          setSelectedSlotId(firstAvailable.id);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Display live slots or fallback slots mapped to uniform view
  const displaySlots = liveSlots.length > 0
    ? liveSlots.map((s) => ({
        id: s.id,
        timeWindow: s.label,
        capacity: s.max_capacity,
        bookedCount: s.current_bookings_count,
        isAvailable: s.isBookable,
        isFull: !s.isBookable || s.current_bookings_count >= s.max_capacity || s.status === 'FULL',
      }))
    : fallbackSlots.map((s) => ({
        ...s,
        isFull: !s.isAvailable || s.bookedCount >= s.capacity,
      }));

  const handleConfirm = async () => {
    if (loading) return; // Prevent double-tap submission
    setErrorMsg(null);
    const chosenSlot = displaySlots.find((s) => s.id === selectedSlotId);
    if (!chosenSlot) return;

    // Strict capacity enforcement: reject if full
    if (chosenSlot.isFull) {
      setErrorMsg(`FULL: The selected pickup window (${chosenSlot.timeWindow}) is at maximum capacity. Please select another slot.`);
      return;
    }

    setLoading(true);
    try {
      // 1. Book in Supabase
      const residentId = 'e1111111-1111-1111-1111-111111111111'; // Linked resident ID
      const bookingResult = await pickupService.bookPickupSlot({
        parcelId: parcel.id,
        residentId,
        slotId: chosenSlot.id,
        timeWindow: chosenSlot.timeWindow,
      });

      if (!bookingResult.success) {
        setErrorMsg(bookingResult.error || 'Failed to book slot');
        setLoading(false);
        return;
      }

      // 2. Generate database-backed 6-digit OTP & QR token
      const tokenResult = await otpQrService.generateHandoverToken(parcel.id, residentId);
      const generatedOtp = tokenResult.data?.otpCode || Math.floor(100000 + Math.random() * 900000).toString();

      // 3. Sync local store
      schedulePickup(parcel.id, chosenSlot.id);

      setLoading(false);
      onConfirmSuccess(
        {
          ...parcel,
          status: 'SCHEDULED',
          scheduledSlot: `Today, ${chosenSlot.timeWindow}`,
          otpCode: generatedOtp,
        },
        generatedOtp
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error confirming pickup slot');
      setLoading(false);
    }
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
            <span>Select Time Window (Today)</span>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
            30-min Batches
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Slots List with Live Capacity Enforcement */}
        <div className="space-y-2.5">
          {displaySlots.map((slot) => {
            const isSelected = selectedSlotId === slot.id;
            const percentage = Math.min(100, Math.round((slot.bookedCount / slot.capacity) * 100));

            return (
              <button
                key={slot.id}
                type="button"
                disabled={slot.isFull}
                onClick={() => {
                  if (!slot.isFull) {
                    setSelectedSlotId(slot.id);
                    setErrorMsg(null);
                  }
                }}
                className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all ${
                  slot.isFull
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

                  {slot.isFull ? (
                    <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                      FULL
                    </span>
                  ) : slot.bookedCount >= slot.capacity - 3 ? (
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
                      slot.isFull ? 'bg-rose-500' : percentage > 80 ? 'bg-amber-500' : 'bg-[#10B981]'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] font-semibold text-slate-500">
                  <span>
                    {slot.bookedCount} / {slot.capacity} booked
                  </span>
                  <span>{slot.isFull ? '100% (No Capacity)' : `${percentage}% capacity`}</span>
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
          className="w-full py-3.5 px-4 bg-[#1E60F2] hover:bg-blue-600 active:scale-95 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <span>{loading ? 'Confirming Slot...' : 'Confirm Slot'}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
