import React, { useState } from 'react';
import { Search, User, Phone, Building, ArrowLeft, Package } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import type { ResidentUser } from '../types';

interface StaffFindResidentTabProps {
  onBack?: () => void;
  onSelectResident?: (res: ResidentUser) => void;
}

export const StaffFindResidentTab: React.FC<StaffFindResidentTabProps> = ({
  onBack,
  onSelectResident,
}) => {
  const { residents, parcels } = useMobileStore();
  const [search, setSearch] = useState('');

  const filtered = residents.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.flat.toLowerCase().includes(q) ||
      r.phone.includes(q)
    );
  });

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] flex items-center justify-between sticky top-0 z-20">
        {onBack ? (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-2" />
        )}
        <h1 className="text-base font-black text-[#060D1E] tracking-tight">Resident Directory</h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by resident name, flat or phone..."
            className="w-full bg-white text-xs font-bold text-[#060D1E] py-2.5 pl-9 pr-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="space-y-3">
          {filtered.map((resident) => {
            const residentParcels = parcels.filter(
              (p) =>
                (p.recipientName === resident.name || p.flat === resident.flat) &&
                p.status !== 'COLLECTED'
            );

            return (
              <div
                key={resident.id}
                onClick={() => onSelectResident && onSelectResident(resident)}
                className="bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] p-3.5 flex items-center justify-between cursor-pointer hover:border-[#1E60F2]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 border border-[#060D1E] flex items-center justify-center font-black text-sm text-[#1E60F2]">
                    {resident.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-[#060D1E]">{resident.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mt-0.5">
                      <span>{resident.flat}</span>
                      <span>•</span>
                      <span>{resident.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    {residentParcels.length} Parcels
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
