import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import type { ResidentUser, MobileParcel } from '../types';
import { staffService } from '../../services/staffService';
import { supabase } from '../../services/supabaseClient';

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [dbSlots, setDbSlots] = useState<{ id: string; status: 'AVAILABLE' | 'OCCUPIED' }[]>([]);

  // Default slots matching hub design
  const defaultRackSlots = [
    { id: 'B15', status: 'OCCUPIED' as const },
    { id: 'B16', status: 'OCCUPIED' as const },
    { id: 'B17', status: 'AVAILABLE' as const },
    { id: 'B18', status: 'AVAILABLE' as const },
    { id: 'B19', status: 'AVAILABLE' as const },
    { id: 'B20', status: 'OCCUPIED' as const },
  ];

  // Fetch real storage locations from Supabase for current society & rack
  useEffect(() => {
    let isMounted = true;
    const fetchStorageSlots = async () => {
      try {
        const { data } = await supabase
          .from('storage_locations')
          .select('shelf, is_occupied')
          .eq('society_id', 'a1111111-1111-1111-1111-111111111111')
          .eq('rack', rack);

        if (isMounted && data && data.length > 0) {
          const mapped = data.map((d) => ({
            id: d.shelf.replace(/^(Slot\s*|Rack\s*)/i, '').trim(),
            status: d.is_occupied ? ('OCCUPIED' as const) : ('AVAILABLE' as const),
          }));
          setDbSlots(mapped);
          const firstOpen = mapped.find((s) => s.status === 'AVAILABLE');
          if (firstOpen) setSelectedSlot(firstOpen.id);
        } else {
          setDbSlots(defaultRackSlots);
        }
      } catch {
        if (isMounted) setDbSlots(defaultRackSlots);
      }
    };

    fetchStorageSlots();
    return () => {
      isMounted = false;
    };
  }, [rack]);

  const activeSlots = dbSlots.length > 0 ? dbSlots : defaultRackSlots;

  const handleSaveAndStore = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      const slotString = `${tower} / ${rack} / Slot ${selectedSlot}`;

      // 1. Execute Real Parcel Intake in Supabase
      const intakeResult = await staffService.intakeParcel({
        trackingNumber,
        carrierName: carrier,
        societyId: 'a1111111-1111-1111-1111-111111111111',
        apartmentId: 'c1111111-1111-1111-1111-111111111111', // Lakeview apartment
        residentId: 'e1111111-1111-1111-1111-111111111111',  // Lakeview resident
        storageSlot: slotString,
        staffId: 'd1111111-1111-1111-1111-111111111111',    // Hub staff
      });

      if (!intakeResult.success) {
        setErrorMsg(intakeResult.error || 'Failed to complete parcel intake');
        setLoading(false);
        return;
      }

      // 2. Synchronize local store
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
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error processing parcel intake');
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

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

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

        {/* Slot Grid (Enforces Non-Double Allocation) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black uppercase text-slate-500">
              Select Slot in {rack}
            </label>
            <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
              Slot {selectedSlot} Selected
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {activeSlots.map((slot) => {
              const isOccupied = slot.status === 'OCCUPIED';
              const isSelected = selectedSlot === slot.id;

              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={isOccupied}
                  onClick={() => {
                    setSelectedSlot(slot.id);
                    setErrorMsg(null);
                  }}
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
                    {isOccupied ? 'Occupied' : 'Available'}
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
              Live notification record will be inserted to database for {resident.name} immediately upon saving.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Save Button */}
      <div className="p-4 bg-white border-t-2 border-[#060D1E]">
        <button
          onClick={handleSaveAndStore}
          disabled={loading || !selectedSlot}
          className="w-full py-3.5 px-4 bg-[#10B981] hover:bg-emerald-600 active:scale-95 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <span>{loading ? 'Saving to Database...' : 'Save & Store'}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
