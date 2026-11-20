import React, { useState } from 'react';
import { Package, Search, Filter, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import type { MobileParcel } from '../types';

interface StaffParcelsTabProps {
  onSelectParcel?: (p: MobileParcel) => void;
  onVerifyHandover?: (p: MobileParcel) => void;
}

export const StaffParcelsTab: React.FC<StaffParcelsTabProps> = ({ onVerifyHandover }) => {
  const { parcels } = useMobileStore();
  const [filter, setFilter] = useState<'ALL' | 'WAITING' | 'SCHEDULED' | 'COLLECTED'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = parcels.filter((p) => {
    if (filter !== 'ALL' && p.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.trackingNumber.toLowerCase().includes(q) ||
        p.recipientName.toLowerCase().includes(q) ||
        p.flat.toLowerCase().includes(q) ||
        p.carrier.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] sticky top-0 z-20">
        <h1 className="text-base font-black text-[#060D1E] tracking-tight">Hub Inventory</h1>
        <p className="text-[11px] font-bold text-slate-500">All registered parcels across racks</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20 space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracking, resident, or flat..."
            className="w-full bg-white text-xs font-bold text-[#060D1E] py-2.5 pl-9 pr-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['ALL', 'WAITING', 'SCHEDULED', 'COLLECTED'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setFilter(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                filter === m
                  ? 'bg-[#1E60F2] text-white border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                  : 'bg-white text-slate-600 border border-slate-300'
              }`}
            >
              {m === 'ALL' ? 'All (24)' : m === 'WAITING' ? 'Waiting (12)' : m === 'SCHEDULED' ? 'Scheduled (8)' : 'Collected'}
            </button>
          ))}
        </div>

        {/* Parcels list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border-2 border-dashed border-slate-300">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-black text-slate-700">No parcels match this filter</p>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">
                Try selecting "All" or check a different search term.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilter('ALL');
                  setSearch('');
                }}
                className="mt-3 px-3 py-1.5 bg-[#1E60F2] text-white text-[11px] font-black rounded-xl border border-[#060D1E] shadow-[2px_2px_0px_#060D1E] active:scale-95"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            filtered.map((parcel) => (
            <div
              key={parcel.id}
              className="bg-white rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#1E60F2] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                    {parcel.carrier}
                  </span>
                  <span className="text-xs font-mono font-black">{parcel.trackingNumber}</span>
                </div>
                {parcel.status === 'COLLECTED' ? (
                  <span className="px-2 py-0.5 text-[10px] font-black bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                    Collected
                  </span>
                ) : parcel.status === 'SCHEDULED' ? (
                  <span className="px-2 py-0.5 text-[10px] font-black bg-blue-100 text-blue-800 rounded-full border border-blue-300">
                    Scheduled
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-black bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                    Waiting
                  </span>
                )}
              </div>

              <div className="space-y-0.5 text-xs font-bold mb-3">
                <p className="text-[#060D1E]">
                  Resident: <span className="font-black">{parcel.recipientName}</span> ({parcel.flat})
                </p>
                <p className="text-slate-500 font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1E60F2]" /> Location: {parcel.storageLocation}
                </p>
              </div>

              {parcel.status !== 'COLLECTED' && onVerifyHandover && (
                <button
                  onClick={() => onVerifyHandover(parcel)}
                  className="w-full py-2 bg-[#10B981] hover:bg-emerald-600 text-white font-black text-xs rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify Handover</span>
                </button>
              )}
            </div>
          )))
        }
        </div>
      </div>
    </div>
  );
};
