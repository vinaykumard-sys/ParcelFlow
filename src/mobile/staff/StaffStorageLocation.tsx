import React, { useState } from 'react';
import { ArrowLeft, MapPin, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import type { ResidentUser, MobileParcel } from '../types';

interface StaffStorageLocationProps {
  trackingNumber: string;
  carrier: 'Amazon' | 'Flipkart' | 'Myntra' | 'Blue Dart' | 'Delhivery' | 'Other';
  resident: ResidentUser;
  onBack: () => void;
  onSaved: (parcel: MobileParcel) => void;
}

export const StaffStorageLocation: React.FC<StaffStorageLocationProps> = ({
  trackingNumber,
  carrier,
  resident,
  onBack,
  onSaved,
}) => {
  const { receiveParcel } = useMobileStore();
  const [tower, setTower] = useState('Tower B');
  const [rack, setRack] = useState<'Rack A' | 'Rack B' | 'Cold Storage'>('Rack B');
  const [selectedSlot, setSelectedSlot] = useState('B17');
  const [loading, setLoading] = useState(false);

  const availableSlots = [
    { id: 'B15', status: 'OCCUPIED' },
    { id: 'B16', status: 'OCCUPIED' },
    { id: 'B17', status: 'AVAILABLE' }, // Prompt exact requirement
    { id: 'B18', status: 'AVAILABLE' },
    { id: 'B19', status: 'AVAILABLE' },
    { id: 'B20', status: 'OCCUPIED' },
  ];

  const handleSaveAndStore = () => {
    setLoading(true);
    setTimeout(() => {
      const location = `${tower}, ${rack}, Slot ${selectedSlot}`;
      const savedParcel = receiveParcel({
        trackingNumber,
        carrier,
        recipientName: resident.name,
        recipientPhone: resident.phone,
        flat: resident.flat,
        tower,
        storageLocation: location,
      });
      setLoading(false);
      onSaved(savedParcel);
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
        <h1 className="text-sm font-black text-[#060D1E] tracking-tight">Step 3: Storage Location</h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Recipient & Parcel Summary */}
        <div className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-[#1E60F2]">
              {carrier} • {trackingNumber}
            </span>
            <p className="text-xs font-black text-[#060D1E] mt-0.5">
              Recipient: {resident.name} ({resident.flat})
            </p>
          </div>
          <span className="text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-0.5 rounded-full">
            Inbound
          </span>
        </div>

        {/* Tower Selector */}
        <div>
          <label className="text-xs font-black uppercase text-slate-500 block mb-1.5">
            Select Society Tower
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Tower A', 'Tower B', 'Tower C'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTower(t)}
                className={`py-2 text-xs font-black rounded-xl border-2 transition-all ${
                  tower === t
                    ? 'bg-[#1E60F2] text-white border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#060D1E]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Rack Selector */}
        <div>
          <label className="text-xs font-black uppercase text-slate-500 block mb-1.5">
            Select Hub Rack / Section
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Rack A', 'Rack B', 'Cold Storage'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRack(r)}
                className={`py-2 text-xs font-black rounded-xl border-2 transition-all ${
                  rack === r
                    ? 'bg-[#060D1E] text-white border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#060D1E]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Slot Grid (Highlighting Slot B17 Available) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black uppercase text-slate-500">
              Select Slot in {rack}
            </label>
            <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
              Slot B17 Available
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {availableSlots.map((slot) => {
              const isOccupied = slot.status === 'OCCUPIED';
              const isSelected = selectedSlot === slot.id;

              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={isOccupied}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                    isOccupied
                      ? 'bg-slate-100 border-slate-300 opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500 shadow-[2px_2px_0px_#10B981]'
                      : 'bg-white border-[#060D1E] shadow-[2px_2px_0px_#060D1E] hover:border-emerald-500'
                  }`}
                >
                  <span
                    className={`text-sm font-black ${
                      isSelected ? 'text-emerald-700' : isOccupied ? 'text-slate-400' : 'text-[#060D1E]'
                    }`}
                  >
                    Slot {slot.id}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">
                    {isOccupied ? 'In Use' : 'Empty'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Assigned Location Confirmation Pill */}
        <div className="p-3.5 bg-emerald-50 rounded-2xl border-2 border-emerald-500 shadow-[2px_2px_0px_#10B981] flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="text-xs font-black text-emerald-950">
              Assigned: {tower}, {rack}, Slot {selectedSlot}
            </p>
            <p className="text-[11px] text-emerald-800 font-semibold">
              Notification will be dispatched to resident {resident.name} immediately upon saving.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Save Button */}
      <div className="p-4 bg-white border-t-2 border-[#060D1E]">
        <button
          onClick={handleSaveAndStore}
          disabled={loading || !selectedSlot}
          className="w-full py-3.5 px-4 bg-[#10B981] hover:bg-emerald-600 active:scale-95 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all"
        >
          <span>{loading ? 'Saving & Storing...' : 'Save & Store'}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
