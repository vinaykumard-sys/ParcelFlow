import React, { useState } from 'react';
import {
  Boxes,
  PackageCheck,
  CheckCircle2,
  AlertCircle,
  Filter,
  Shield,
  Snowflake,
  Lock,
  Layers,
  X,
  RefreshCw,
} from 'lucide-react';
import { useMobileStore } from '../services/mobileState';

export interface StorageSlot {
  id: string;
  rack: 'Rack A' | 'Rack B' | 'Cold Storage' | 'Secure Locker';
  shelf: string;
  type: 'SMALL' | 'MEDIUM' | 'LARGE' | 'OVERSIZE' | 'COLD_STORAGE' | 'SECURE_LOCKER';
  isOccupied: boolean;
  trackingNumber?: string;
  residentName?: string;
  flatNumber?: string;
  carrier?: string;
}

const INITIAL_STORAGE_SLOTS: StorageSlot[] = [
  // Rack A (Towers A & B)
  { id: 'sl-1', rack: 'Rack A', shelf: 'A-01', type: 'SMALL', isOccupied: false },
  { id: 'sl-2', rack: 'Rack A', shelf: 'A-02', type: 'MEDIUM', isOccupied: false },
  { id: 'sl-3', rack: 'Rack A', shelf: 'A-03', type: 'MEDIUM', isOccupied: true, trackingNumber: 'PF-8922-IN', residentName: 'Priya Sharma', flatNumber: 'B-104', carrier: 'Flipkart' },
  { id: 'sl-4', rack: 'Rack A', shelf: 'A-04', type: 'LARGE', isOccupied: false },
  { id: 'sl-5', rack: 'Rack A', shelf: 'A-05', type: 'SMALL', isOccupied: false },
  { id: 'sl-6', rack: 'Rack A', shelf: 'A-06', type: 'MEDIUM', isOccupied: true, trackingNumber: 'PF-4412-IN', residentName: 'Neha Patel', flatNumber: 'A-302', carrier: 'Zara' },
  { id: 'sl-7', rack: 'Rack A', shelf: 'A-07', type: 'SMALL', isOccupied: false },
  { id: 'sl-8', rack: 'Rack A', shelf: 'A-08', type: 'MEDIUM', isOccupied: false },

  // Rack B (Tower C & Oversize)
  { id: 'sl-9', rack: 'Rack B', shelf: 'B-01', type: 'SMALL', isOccupied: false },
  { id: 'sl-10', rack: 'Rack B', shelf: 'B-02', type: 'MEDIUM', isOccupied: false },
  { id: 'sl-11', rack: 'Rack B', shelf: 'B-03', type: 'LARGE', isOccupied: false },
  { id: 'sl-12', rack: 'Rack B', shelf: 'B-08', type: 'MEDIUM', isOccupied: true, trackingNumber: 'PF-8921-IN', residentName: 'Arjun Kumar', flatNumber: 'A-402', carrier: 'Amazon' },
  { id: 'sl-13', rack: 'Rack B', shelf: 'B-12', type: 'LARGE', isOccupied: true, trackingNumber: 'PF-8923-IN', residentName: 'Rahul Verma', flatNumber: 'C-801', carrier: 'Blue Dart' },
  { id: 'sl-14', rack: 'Rack B', shelf: 'B-17', type: 'OVERSIZE', isOccupied: false },
  { id: 'sl-15', rack: 'Rack B', shelf: 'B-18', type: 'OVERSIZE', isOccupied: false },

  // Cold Storage & Secure
  { id: 'sl-16', rack: 'Cold Storage', shelf: 'CS-01', type: 'COLD_STORAGE', isOccupied: false },
  { id: 'sl-17', rack: 'Cold Storage', shelf: 'CS-02', type: 'COLD_STORAGE', isOccupied: true, trackingNumber: 'PF-9021-IN', residentName: 'Vikram Mehta', flatNumber: 'B-502', carrier: 'BigBasket' },
  { id: 'sl-18', rack: 'Secure Locker', shelf: 'SEC-01', type: 'SECURE_LOCKER', isOccupied: true, trackingNumber: 'PF-7731-IN', residentName: 'Sneha Iyer', flatNumber: 'A-203', carrier: 'Tanishq' },
  { id: 'sl-19', rack: 'Secure Locker', shelf: 'SEC-02', type: 'SECURE_LOCKER', isOccupied: false },
];

export const AdminLockersTab: React.FC = () => {
  const { selectedSociety } = useMobileStore();
  const [slots, setSlots] = useState<StorageSlot[]>(INITIAL_STORAGE_SLOTS);
  const [filterRack, setFilterRack] = useState<string>('ALL');
  const [selectedSlot, setSelectedSlot] = useState<StorageSlot | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalCount = slots.length;
  const occupiedCount = slots.filter((s) => s.isOccupied).length;
  const availableCount = totalCount - occupiedCount;
  const utilization = Math.round((occupiedCount / totalCount) * 100);

  const filteredSlots =
    filterRack === 'ALL' ? slots : slots.filter((s) => s.rack === filterRack);

  const handleReleaseSlot = (slotId: string) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.id === slotId
          ? {
              ...s,
              isOccupied: false,
              trackingNumber: undefined,
              residentName: undefined,
              flatNumber: undefined,
              carrier: undefined,
            }
          : s
      )
    );
    setSelectedSlot(null);
    showToast('Storage slot released and marked available.');
  };

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Header */}
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Boxes className="w-4 h-4 text-[#1E60F2]" />
              <span className="text-xs font-bold text-slate-500">Storage Hub Racks</span>
            </div>
            <h1 className="text-lg font-black text-[#060D1E]">
              {selectedSociety.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2.5 py-1 bg-amber-100 text-amber-900 rounded-xl border border-amber-300">
              {utilization}% Full
            </span>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="mx-5 mt-2 p-2.5 bg-emerald-50 border-2 border-emerald-500 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24 space-y-4">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white p-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] text-center">
            <span className="text-[10px] font-black uppercase text-slate-500">Total Slots</span>
            <div className="text-xl font-black text-[#060D1E]">{totalCount}</div>
            <span className="text-[9px] font-bold text-slate-400">Hub Capacity</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] text-center">
            <span className="text-[10px] font-black uppercase text-amber-600">Occupied</span>
            <div className="text-xl font-black text-amber-700">{occupiedCount}</div>
            <span className="text-[9px] font-bold text-slate-400">With Parcels</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] text-center">
            <span className="text-[10px] font-black uppercase text-emerald-600">Available</span>
            <div className="text-xl font-black text-emerald-700">{availableCount}</div>
            <span className="text-[9px] font-bold text-slate-400">Ready for Intake</span>
          </div>
        </div>

        {/* Rack Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {['ALL', 'Rack A', 'Rack B', 'Cold Storage', 'Secure Locker'].map((rack) => (
            <button
              key={rack}
              onClick={() => setFilterRack(rack)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border-2 border-[#060D1E] ${
                filterRack === rack
                  ? 'bg-[#1E60F2] text-white shadow-[2px_2px_0px_#060D1E]'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {rack === 'ALL' ? 'All Units' : rack}
            </button>
          ))}
        </div>

        {/* Visual Locker Grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Compartments ({filteredSlots.length})
            </h2>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Occupied
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {filteredSlots.map((slot) => {
              const isOccupied = slot.isOccupied;
              return (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] cursor-pointer transition-all active:scale-95 ${
                    isOccupied
                      ? 'bg-amber-50/80 hover:bg-amber-100/70'
                      : 'bg-white hover:bg-emerald-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-[#060D1E]">
                      {slot.shelf}
                    </span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                        isOccupied
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isOccupied ? 'BUSY' : 'FREE'}
                    </span>
                  </div>

                  <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    {slot.type === 'COLD_STORAGE' ? (
                      <Snowflake className="w-3 h-3 text-cyan-600" />
                    ) : slot.type === 'SECURE_LOCKER' ? (
                      <Lock className="w-3 h-3 text-purple-600" />
                    ) : (
                      <Layers className="w-3 h-3 text-slate-400" />
                    )}
                    <span>{slot.type.replace('_', ' ')}</span>
                  </div>

                  {isOccupied ? (
                    <div className="mt-2 pt-1.5 border-t border-amber-200/80 text-[10px]">
                      <div className="font-black text-[#060D1E] truncate">
                        {slot.trackingNumber}
                      </div>
                      <div className="text-slate-600 truncate">
                        {slot.residentName} ({slot.flatNumber})
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-emerald-700 font-bold">
                      Available for intake
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Slot Details Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FEF9F3] border-3 border-[#060D1E] rounded-3xl max-w-sm w-full p-5 shadow-[6px_6px_0px_#060D1E] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-500">
                  {selectedSlot.rack}
                </span>
                <h3 className="text-xl font-black text-[#060D1E]">
                  Compartment {selectedSlot.shelf}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSlot(null)}
                className="w-8 h-8 rounded-full bg-white border-2 border-[#060D1E] flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="font-bold text-slate-500">Compartment Type:</span>
                <span className="font-black text-[#060D1E]">
                  {selectedSlot.type.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="font-bold text-slate-500">Status:</span>
                <span
                  className={`font-black ${
                    selectedSlot.isOccupied ? 'text-amber-700' : 'text-emerald-700'
                  }`}
                >
                  {selectedSlot.isOccupied ? 'Occupied by Parcel' : 'Available'}
                </span>
              </div>

              {selectedSlot.isOccupied && (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="font-bold text-slate-500">Tracking Number:</span>
                    <span className="font-black text-[#060D1E]">
                      {selectedSlot.trackingNumber}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="font-bold text-slate-500">Resident:</span>
                    <span className="font-black text-[#060D1E]">
                      {selectedSlot.residentName} ({selectedSlot.flatNumber})
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="font-bold text-slate-500">Carrier:</span>
                    <span className="font-black text-[#060D1E]">
                      {selectedSlot.carrier}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              {selectedSlot.isOccupied ? (
                <button
                  onClick={() => handleReleaseSlot(selectedSlot.id)}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] active:scale-95 transition-all"
                >
                  Release / Free Slot
                </button>
              ) : (
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="flex-1 py-2.5 bg-[#1E60F2] text-white font-black text-xs rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] active:scale-95 transition-all"
                >
                  Ready for Inbound Intake
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
