import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle2, ChevronRight, Package, Sparkles } from 'lucide-react';
import { Sticker } from './Sticker';
import { mobileStore, AVAILABLE_SLOTS, PickupSlotOption, MobileParcel } from '../services/supabaseService';

export const SlotScheduler: React.FC = () => {
  const parcels = mobileStore.getParcels().filter((p) => p.status === 'READY_FOR_PICKUP');
  const [selectedParcelId, setSelectedParcelId] = useState<string>(parcels[0]?.id || '');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot-1');
  const [bookedSuccess, setBookedSuccess] = useState<string | null>(null);

  const handleBookSlot = (slot: PickupSlotOption) => {
    if (!selectedParcelId) return;
    const ok = mobileStore.scheduleSlot(selectedParcelId, `${slot.dateStr} ${slot.timeWindow}`);
    if (ok) {
      setBookedSuccess(`${slot.dateStr} · ${slot.timeWindow}`);
      setTimeout(() => setBookedSuccess(null), 3500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#0A1128] flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Pickup Slot Scheduler</span>
          </h2>
          <p className="text-xs font-semibold text-slate-600">
            Reserve dedicated counter window to skip apartment hub queues
          </p>
        </div>
        <Sticker color="mint" rotate="slight-left" size="xs">
          1-Hr Windows
        </Sticker>
      </div>

      {/* Select Target Parcel */}
      {parcels.length > 0 ? (
        <div className="p-4 rounded-2xl bg-white border-[2.5px] border-[#0A1128] shadow-[4px_4px_0px_#0A1128] space-y-2">
          <label className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-blue-600" />
            <span>Select Ready Parcel:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {parcels.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedParcelId(p.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  selectedParcelId === p.id
                    ? 'bg-blue-50 border-blue-600 shadow-[3px_3px_0px_#1D4ED8]'
                    : 'bg-[#FEF9F3] border-[#0A1128] shadow-[2px_2px_0px_#0A1128]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-[#0A1128]">{p.tracking_number}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-[#0A1128]">
                    {p.carrier}
                  </span>
                </div>
                <div className="text-[11px] font-medium text-slate-600 mt-1">
                  Loc: {p.storage_location}
                </div>
                {p.scheduled_slot && (
                  <div className="text-[10px] font-bold text-blue-700 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    <span>Slot: {p.scheduled_slot}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-white border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] text-center text-xs font-semibold text-slate-600">
          No parcels currently pending pickup at Lakeview Hub.
        </div>
      )}

      {/* Booking Success Banner */}
      {bookedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-100 border-[2.5px] border-[#0A1128] shadow-[4px_4px_0px_#0A1128] flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center border-2 border-[#0A1128] shadow-[1px_1px_0px_#0A1128]">
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs font-black text-emerald-950">Pickup Slot Confirmed!</p>
            <p className="text-[11px] font-semibold text-emerald-800">
              Reserved for {bookedSuccess}. Hub counter staff notified.
            </p>
          </div>
        </div>
      )}

      {/* Available Slots List */}
      <div className="space-y-2.5">
        <div className="text-xs font-black uppercase text-slate-700 px-1">
          Available Society Windows
        </div>

        {AVAILABLE_SLOTS.map((slot) => {
          const isSelected = selectedSlotId === slot.id;
          const isFillingFast = slot.availableCapacity <= 5;

          return (
            <div
              key={slot.id}
              onClick={() => setSelectedSlotId(slot.id)}
              className={`p-4 rounded-2xl border-[2.5px] transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-50 border-[#0A1128] shadow-[5px_5px_0px_#0A1128] -translate-y-0.5'
                  : 'bg-white border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:shadow-[4px_4px_0px_#0A1128]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 border-2 border-[#0A1128] flex items-center justify-center text-blue-700 shadow-[2px_2px_0px_#0A1128]">
                    <Calendar className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-[#0A1128]">{slot.timeWindow}</h4>
                      {isFillingFast && (
                        <span className="text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-300 px-1.5 py-0.2 rounded">
                          Filling Fast
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-500">{slot.dateStr} · {slot.label}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                    {slot.availableCapacity}/{slot.totalCapacity} left
                  </span>
                </div>
              </div>

              {/* Action Button inside slot card when selected */}
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Instant counter pass sync</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookSlot(slot);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] active:translate-y-0.5 transition-all flex items-center gap-1.5"
                  >
                    <span>Confirm Window</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
