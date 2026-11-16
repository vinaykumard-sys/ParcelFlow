import React, { useState } from 'react';
import { Clock, Sliders, CheckCircle2, AlertTriangle, ShieldCheck, Power, Users } from 'lucide-react';
import { Sticker } from '../components/Sticker';
import { adminService } from '../services/adminService';
import type { PickupWindowSlotConfig } from '../types';

interface PickupSlotConfigScreenProps {
  refreshTrigger: number;
}

export const PickupSlotConfigScreen: React.FC<PickupSlotConfigScreenProps> = ({ refreshTrigger }) => {
  const [slots, setSlots] = useState<PickupWindowSlotConfig[]>(adminService.getPickupSlots());
  const [saveToast, setSaveToast] = useState(false);

  const activeSociety = adminService.getActiveSociety();

  const handleToggle = (id: string) => {
    adminService.togglePickupSlot(id);
    setSlots(adminService.getPickupSlots());
    triggerToast();
  };

  const handleCapacityChange = (id: string, newCap: number) => {
    adminService.updateSlotCapacity(id, newCap);
    setSlots(adminService.getPickupSlots());
    triggerToast();
  };

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-[#0A1128] tracking-tight">Pickup-Slot Configuration</h2>
            <Sticker color="yellow" rotate="right" size="xs">
              Evening Dispatch Windows
            </Sticker>
          </div>
          <p className="text-xs font-semibold text-slate-600">
            Control available evening collection windows and maximum resident capacity for {activeSociety.name}.
          </p>
        </div>

        {saveToast && (
          <div className="py-1 px-3 rounded-xl bg-emerald-100 border-2 border-[#0A1128] text-emerald-900 font-extrabold text-xs shadow-[2px_2px_0px_#0A1128] flex items-center gap-1.5 animate-slide-up">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Slot rules synced to resident app!</span>
          </div>
        )}
      </div>

      {/* Slots List */}
      <div className="space-y-4">
        {slots.map((slot) => {
          const available = Math.max(0, slot.maxCapacity - slot.bookedCount);
          const percentBooked = Math.round((slot.bookedCount / slot.maxCapacity) * 100);

          return (
            <div
              key={slot.id}
              className={`rounded-2xl border-3 p-5 sm:p-6 transition-all ${
                slot.enabled
                  ? 'bg-white border-[#0A1128] shadow-[5px_5px_0px_#0A1128]'
                  : 'bg-slate-100/70 border-slate-400 opacity-60 shadow-none'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-base sm:text-lg text-[#0A1128]">
                      {slot.timeWindow}
                    </span>
                    <span
                      className={`text-[11px] font-black px-2 py-0.5 rounded-full border border-[#0A1128] ${
                        slot.enabled ? 'bg-emerald-300 text-emerald-950' : 'bg-rose-200 text-rose-900'
                      }`}
                    >
                      {slot.enabled ? 'Active Window' : 'Blackout / Inactive'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600">
                    Max Capacity: <span className="font-bold text-[#0A1128]">{slot.maxCapacity} parcels</span> • Booked: <span className="font-bold text-blue-700">{slot.bookedCount}</span> • Available: <span className="font-bold text-emerald-700">{available}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Capacity Slider / Input */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-slate-500">Capacity:</span>
                    <input
                      type="number"
                      min={10}
                      max={60}
                      value={slot.maxCapacity}
                      onChange={(e) => handleCapacityChange(slot.id, parseInt(e.target.value) || 20)}
                      className="w-16 text-center font-mono font-bold text-xs py-1.5 px-2 rounded-lg border-2 border-[#0A1128] bg-[#FEF9F3] text-[#0A1128]"
                      disabled={!slot.enabled}
                    />
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => handleToggle(slot.id)}
                    className={`py-2 px-4 rounded-xl font-extrabold text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 transition-all flex items-center gap-1.5 ${
                      slot.enabled ? 'bg-orange-500 text-white' : 'bg-slate-200 text-[#0A1128]'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{slot.enabled ? 'Disable' : 'Enable'}</span>
                  </button>
                </div>
              </div>

              {/* Progress Bar of Capacity */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                  <span>Slot Booking Demand</span>
                  <span className="font-mono">{percentBooked}% Capacity Utilized</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full border border-[#0A1128] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      percentBooked > 85 ? 'bg-orange-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${percentBooked}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
