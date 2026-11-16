import React, { useState } from 'react';
import { Boxes, PackageCheck, Clock, Archive, CheckCircle2, AlertCircle, ArrowRight, Scan, Filter } from 'lucide-react';
import { Sticker } from '../components/Sticker';
import { adminService } from '../services/adminService';
import type { HubInventorySlot } from '../types';

interface ParcelHubInventoryScreenProps {
  onOpenScanModal: () => void;
  onOpenReceiveModal: () => void;
  refreshTrigger: number;
}

export const ParcelHubInventoryScreen: React.FC<ParcelHubInventoryScreenProps> = ({
  onOpenScanModal,
  onOpenReceiveModal,
  refreshTrigger,
}) => {
  const [selectedRack, setSelectedRack] = useState<'ALL' | 'Rack A' | 'Rack B'>('ALL');
  const [selectedSlot, setSelectedSlot] = useState<HubInventorySlot | null>(null);

  const inventory = adminService.getHubInventory();
  const kpis = inventory.kpis;
  const slots = inventory.slots;

  const filteredSlots = slots.filter((s) => selectedRack === 'ALL' || s.rack === selectedRack);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-[#0A1128] tracking-tight">Parcel Hub Inventory</h2>
            <Sticker color="orange" rotate="right" size="xs">
              112 Storage Units
            </Sticker>
          </div>
          <p className="text-xs font-semibold text-slate-600">
            Realtime visual storage mapping across Rack A & Rack B at Society Central Hub.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReceiveModal}
            className="py-2 px-3.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 transition-all"
          >
            <span>Assign Storage Slot</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (112 Total, 61 Ready, 18 Scheduled, 33 In Storage) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white border-2.5 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] p-4 text-center">
          <span className="block text-[11px] font-black uppercase text-slate-500">112 Total Capacity</span>
          <span className="text-2xl sm:text-3xl font-black text-[#0A1128] mt-1 block">112</span>
          <span className="text-[10px] font-semibold text-slate-500">Racks A & B combined</span>
        </div>

        <div className="rounded-2xl bg-emerald-50 border-2.5 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] p-4 text-center">
          <span className="block text-[11px] font-black uppercase text-emerald-800">61 Ready</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1 block">61</span>
          <span className="text-[10px] font-semibold text-emerald-700">Awaiting resident pickup</span>
        </div>

        <div className="rounded-2xl bg-blue-50 border-2.5 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] p-4 text-center">
          <span className="block text-[11px] font-black uppercase text-blue-800">18 Scheduled</span>
          <span className="text-2xl sm:text-3xl font-black text-blue-950 mt-1 block">18</span>
          <span className="text-[10px] font-semibold text-blue-700">Time-window reserved</span>
        </div>

        <div className="rounded-2xl bg-amber-50 border-2.5 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] p-4 text-center">
          <span className="block text-[11px] font-black uppercase text-amber-800">33 In Storage</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-950 mt-1 block">33</span>
          <span className="text-[10px] font-semibold text-amber-700">Safely racked & locked</span>
        </div>
      </div>

      {/* Rack Filter Buttons */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(['ALL', 'Rack A', 'Rack B'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRack(r)}
              className={`py-1.5 px-4 rounded-xl text-xs font-black border-2 border-[#0A1128] transition-all ${
                selectedRack === r
                  ? 'bg-orange-500 text-white shadow-[2px_2px_0px_#0A1128]'
                  : 'bg-white hover:bg-slate-100 text-[#0A1128]'
              }`}
            >
              {r === 'ALL' ? 'All Racks (A & B)' : r}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-400 border border-[#0A1128]" />
            <span>Ready / Scheduled</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-300 border border-[#0A1128]" />
            <span>In Storage</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-white border border-[#0A1128]" />
            <span>Empty Slot</span>
          </span>
        </div>
      </div>

      {/* Visual Hub Locker Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {filteredSlots.map((slot) => {
          const isSelected = selectedSlot?.code === slot.code;
          return (
            <div
              key={slot.code}
              onClick={() => setSelectedSlot(slot)}
              className={`cursor-pointer rounded-2xl border-2.5 p-3.5 transition-all relative flex flex-col justify-between min-h-[140px] ${
                isSelected
                  ? 'ring-3 ring-blue-600 border-[#0A1128] shadow-[5px_5px_0px_#0A1128] -translate-y-1'
                  : 'border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5'
              } ${
                slot.occupied
                  ? slot.status === 'READY_FOR_PICKUP' || slot.status === 'SCHEDULED'
                    ? 'bg-emerald-50/90'
                    : 'bg-amber-50/90'
                  : 'bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-black text-sm text-[#0A1128] px-2 py-0.5 rounded bg-white border border-[#0A1128]">
                    {slot.code}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">{slot.size}</span>
                </div>

                {slot.occupied ? (
                  <div className="space-y-1">
                    <p className="font-extrabold text-xs text-[#0A1128] truncate">{slot.residentName}</p>
                    <p className="font-mono text-[11px] font-bold text-blue-700">{slot.flatNumber}</p>
                    <p className="text-[10px] font-semibold text-slate-500 truncate">{slot.trackingNumber}</p>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Available</span>
                  </div>
                )}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-bold">
                <span className="text-slate-500">{slot.rack}</span>
                {slot.occupied ? (
                  <span className="text-emerald-700 font-extrabold">Occupied</span>
                ) : (
                  <span className="text-blue-600">Free</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Slot Drawer / Inspection Card */}
      {selectedSlot && (
        <div className="rounded-2xl bg-white border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] p-5 animate-slide-up flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-lg px-2.5 py-0.5 rounded-lg bg-blue-600 text-white border border-[#0A1128]">
                Slot {selectedSlot.code}
              </span>
              <span className="text-xs font-bold text-slate-600">
                {selectedSlot.rack} • {selectedSlot.shelf} • Compartment Size: {selectedSlot.size}
              </span>
            </div>
            {selectedSlot.occupied ? (
              <p className="text-xs font-semibold text-slate-700">
                Assigned to <span className="font-bold text-[#0A1128]">{selectedSlot.residentName}</span> (Flat {selectedSlot.flatNumber}) • Package {selectedSlot.trackingNumber} • Window: {selectedSlot.timeWindow || '8:00 PM – 8:30 PM'}
              </p>
            ) : (
              <p className="text-xs font-semibold text-emerald-700">
                Slot is currently unoccupied and sanitized. Ready for incoming parcel intake.
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedSlot.occupied ? (
              <button
                onClick={onOpenScanModal}
                className="py-2 px-4 rounded-xl bg-orange-500 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <Scan className="w-3.5 h-3.5" />
                <span>Verify Handover</span>
              </button>
            ) : (
              <button
                onClick={onOpenReceiveModal}
                className="py-2 px-4 rounded-xl bg-blue-600 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <span>Store Parcel in {selectedSlot.code}</span>
              </button>
            )}
            <button
              onClick={() => setSelectedSlot(null)}
              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0A1128] font-bold text-xs border-2 border-[#0A1128]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
