import React, { useState } from 'react';
import { Package, Search, Filter, Clock, CheckCircle2, ChevronRight, QrCode, Plus, PackagePlus } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import type { MobileParcel } from '../types';
import { AddOrderModal } from './AddOrderModal';

interface ResidentParcelsTabProps {
  onSelectParcel: (parcel: MobileParcel) => void;
  onScheduleSlot: (parcel: MobileParcel) => void;
  onShowPickupCode: (parcel: MobileParcel) => void;
}

export const ResidentParcelsTab: React.FC<ResidentParcelsTabProps> = ({
  onSelectParcel,
  onScheduleSlot,
  onShowPickupCode,
}) => {
  const { parcels } = useMobileStore();
  const [filter, setFilter] = useState<'ALL' | 'READY' | 'SCHEDULED'>('ALL');
  const [search, setSearch] = useState('');
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);

  const residentParcels = parcels.filter(
    (p) => p.recipientName.toLowerCase().includes('vinay') || p.flat === 'B-402'
  );
  const rawList = residentParcels.length > 0 ? residentParcels : parcels;
  // De-duplicate by id before rendering to prevent duplicate cards
  const seen = new Set<string>();
  const activeList = rawList.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  const filtered = activeList.filter((p) => {
    if (filter === 'READY' && p.status !== 'WAITING') return false;
    if (filter === 'SCHEDULED' && p.status !== 'SCHEDULED') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.trackingNumber.toLowerCase().includes(q) ||
        p.carrier.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] sticky top-0 z-20 flex items-center justify-between">
        <div>
          <h1 className="text-base font-black text-[#060D1E] tracking-tight">Your Society Parcels</h1>
          <p className="text-[11px] font-bold text-slate-500">Live incoming & stored hub inventory</p>
        </div>
        <button
          onClick={() => setIsAddOrderOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B4A] hover:bg-[#ff552e] text-white rounded-xl text-xs font-black border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] active:scale-95 transition-all"
        >
          <PackagePlus className="w-3.5 h-3.5" />
          <span>+ Add Order</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracking ID, carrier..."
            className="w-full bg-white text-xs font-bold text-[#060D1E] py-2.5 pl-9 pr-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(['ALL', 'READY', 'SCHEDULED'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                filter === mode
                  ? 'bg-[#1E60F2] text-white border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                  : 'bg-white text-slate-600 border border-slate-300 hover:border-[#060D1E]'
              }`}
            >
              {mode === 'ALL' ? 'All Parcels' : mode === 'READY' ? 'Ready for Pickup' : 'Scheduled'}
            </button>
          ))}
        </div>

        {/* Parcels List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border-2 border-dashed border-slate-300">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-black text-slate-700">No parcels found</p>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">
                No packages match the selected status or search query.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilter('ALL');
                  setSearch('');
                }}
                className="mt-3 px-3.5 py-1.5 bg-[#1E60F2] text-white text-[11px] font-black rounded-xl border border-[#060D1E] shadow-[2px_2px_0px_#060D1E] active:scale-95 transition-all"
              >
                Reset Search Filters
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
                      At Hub
                    </span>
                  )}
                </div>

                <p className="text-xs font-bold text-[#060D1E] mb-1">{parcel.description}</p>
                <p className="text-[11px] font-semibold text-slate-500 mb-3">
                  Location: <span className="font-bold text-[#060D1E]">{parcel.storageLocation}</span>
                </p>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onSelectParcel(parcel)}
                    className="flex-1 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300"
                  >
                    View Timeline
                  </button>
                  {parcel.status === 'SCHEDULED' ? (
                    <button
                      onClick={() => onShowPickupCode(parcel)}
                      className="flex-1 py-2 text-xs font-black text-white bg-[#10B981] hover:bg-emerald-600 rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-1"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Pickup Code</span>
                    </button>
                  ) : parcel.status !== 'COLLECTED' ? (
                    <button
                      onClick={() => onScheduleSlot(parcel)}
                      className="flex-1 py-2 text-xs font-black text-white bg-[#1E60F2] hover:bg-blue-600 rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-1"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Schedule Slot</span>
                    </button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AddOrderModal
        isOpen={isAddOrderOpen}
        onClose={() => setIsAddOrderOpen(false)}
      />
    </div>
  );
};
