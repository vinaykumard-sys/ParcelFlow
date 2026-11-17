import React, { useState } from 'react';
import { ArrowLeft, Search, User, CheckCircle2, ArrowRight, Building, Phone } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import type { ResidentUser } from '../types';

interface StaffAssignResidentProps {
  trackingNumber: string;
  carrier: string;
  onBack: () => void;
  onNext: (resident: ResidentUser) => void;
}

export const StaffAssignResident: React.FC<StaffAssignResidentProps> = ({
  trackingNumber,
  carrier,
  onBack,
  onNext,
}) => {
  const { residents } = useMobileStore();
  const [search, setSearch] = useState('Aarav');
  const [selectedResident, setSelectedResident] = useState<ResidentUser | null>(
    residents.find((r) => r.name.includes('Aarav')) || residents[0]
  );

  const filtered = residents.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.flat.toLowerCase().includes(q) ||
      r.phone.includes(q)
    );
  });

  const handleContinue = () => {
    if (!selectedResident) return;
    onNext(selectedResident);
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
        <h1 className="text-sm font-black text-[#060D1E] tracking-tight">Step 2: Assign Resident</h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Scanned Parcel Pill */}
        <div className="bg-white p-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#1E60F2] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
              {carrier}
            </span>
            <span className="text-xs font-mono font-black">{trackingNumber}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500">Scanned OK</span>
        </div>

        {/* Search Input */}
        <div>
          <label className="text-xs font-black uppercase text-slate-500 block mb-1.5">
            Search Resident by Name, Flat or Phone
          </label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Aarav Mehta, Tower B - #704"
              className="w-full bg-white text-xs font-bold text-[#060D1E] py-3 pl-9 pr-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none focus:border-[#1E60F2]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </div>
        </div>

        {/* Resident Suggestions List */}
        <div className="space-y-2.5">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Matching Directory Residents ({filtered.length})
          </p>

          {filtered.map((resident) => {
            const isSelected = selectedResident?.id === resident.id;

            return (
              <div
                key={resident.id}
                onClick={() => setSelectedResident(resident)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-white border-[#1E60F2] ring-2 ring-[#1E60F2] shadow-[3px_3px_0px_#1E60F2]'
                    : 'bg-white border-[#060D1E] shadow-[2px_2px_0px_#060D1E] hover:border-[#1E60F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-sm ${
                      isSelected
                        ? 'bg-[#1E60F2] text-white border-[#060D1E]'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {resident.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-[#060D1E]">{resident.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold mt-0.5">
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-[#1E60F2]" /> {resident.flat}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" /> {resident.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-[#1E60F2] stroke-[2.5]" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Next Button */}
      <div className="p-4 bg-white border-t-2 border-[#060D1E]">
        <button
          onClick={handleContinue}
          disabled={!selectedResident}
          className="w-full py-3.5 px-4 bg-[#1E60F2] hover:bg-blue-600 active:scale-95 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <span>Next: Select Storage Location</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
