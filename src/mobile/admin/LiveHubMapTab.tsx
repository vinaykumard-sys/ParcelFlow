import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Boxes,
  Layers,
  Filter,
  RefreshCw,
  X,
  Package,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  Sliders,
} from 'lucide-react';
import {
  getStorageGrid,
} from '../../services/storageMapService';
import type { StorageGridSlot, StorageGridStats } from '../../services/types';

export const LiveHubMapTab: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState<string>('Hub Alpha');
  const [filterMode, setFilterMode] = useState<'ALL' | 'OCCUPIED' | 'AVAILABLE'>('ALL');
  const [slots, setSlots] = useState<StorageGridSlot[]>([]);
  const [stats, setStats] = useState<StorageGridStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSlot, setActiveSlot] = useState<StorageGridSlot | null>(null);

  const loadGrid = async () => {
    setLoading(true);
    try {
      const res = await getStorageGrid(selectedHub);
      setSlots(res.slots);
      setStats(res.stats);
    } catch (err) {
      console.error('Failed to load storage grid:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrid();
  }, [selectedHub]);

  const filteredSlots = slots.filter((s) => {
    if (filterMode === 'OCCUPIED') return s.is_occupied;
    if (filterMode === 'AVAILABLE') return !s.is_occupied;
    return true;
  });

  const racks = ['A', 'B', 'C', 'D'];
  const shelves = ['5', '4', '3', '2', '1']; // top to bottom

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none overflow-y-auto p-4 sm:p-5 space-y-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-[#060D1E] tracking-tight">
              Live Hub Storage Map
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-[#1E60F2] border border-blue-300">
              2D Grid
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Screen 3/9 • Real-time slot occupancy & rack telemetry
          </p>
        </div>

        <button
          onClick={loadGrid}
          className="p-2 rounded-xl bg-white hover:bg-slate-50 border-2 border-[#060D1E] shadow-[1.5px_1.5px_0px_#060D1E] active:scale-95 transition-transform"
          aria-label="Refresh Grid"
        >
          <RefreshCw className="w-4 h-4 text-[#060D1E]" />
        </button>
      </div>

      {/* 2. Hub Selector & Filters */}
      <div className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          {['Hub Alpha', 'Hub Beta'].map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setSelectedHub(h)}
              className={`py-2.5 px-3 rounded-2xl border-2 font-black text-xs transition-all flex items-center justify-center gap-2 ${
                selectedHub === h
                  ? 'bg-[#0B1E3F] text-white border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-[#060D1E]'
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span>{h}</span>
            </button>
          ))}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(
            [
              { key: 'ALL', label: 'All Slots' },
              { key: 'OCCUPIED', label: 'Occupied' },
              { key: 'AVAILABLE', label: 'Available' },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilterMode(f.key)}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-black transition-all ${
                filterMode === f.key
                  ? 'bg-amber-300 border-[#060D1E] text-[#060D1E] shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Occupancy KPI Stats Banner */}
      {stats && (
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] p-4 shadow-[3px_3px_0px_#060D1E]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-slate-500">
              {selectedHub} Occupancy
            </span>
            <span className="font-mono font-black text-sm text-[#1E60F2]">
              {stats.occupancyRate}% Full
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mb-3">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 transition-all duration-300"
              style={{ width: `${stats.occupancyRate}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-50 rounded-xl p-2 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                Total Slots
              </span>
              <span className="font-black text-sm text-[#060D1E]">{stats.totalSlots}</span>
            </div>
            <div className="bg-rose-50 rounded-xl p-2 border border-rose-200">
              <span className="text-[10px] font-bold text-rose-600 block uppercase">
                Occupied
              </span>
              <span className="font-black text-sm text-rose-700">{stats.occupiedSlots}</span>
            </div>
            <div className="bg-emerald-50 rounded-xl p-2 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-600 block uppercase">
                Available
              </span>
              <span className="font-black text-sm text-emerald-700">{stats.availableSlots}</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. 2D Rack x Shelf Interactive Grid */}
      <div className="bg-white rounded-3xl border-2 border-[#060D1E] p-4.5 shadow-[3px_3px_0px_#060D1E] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#1E60F2]" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-600">
              2D Rack Elevation View
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Open
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-500" /> Full
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 text-[#1E60F2] animate-spin" />
            <span className="text-xs font-bold text-slate-500">Loading live slots...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Rack column headers */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-black text-slate-400 uppercase tracking-wider">
              {racks.map((r) => (
                <div key={r} className="bg-slate-100 py-1 rounded-lg border border-slate-200">
                  Rack {r}
                </div>
              ))}
            </div>

            {/* 5 Shelves (Top shelf 5 down to Shelf 1) */}
            {shelves.map((shelf) => (
              <div key={shelf} className="space-y-1">
                <div className="text-[9px] font-black uppercase text-slate-400 pl-1">
                  Shelf {shelf} {shelf === '3' ? '• Waist Level' : ''}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {racks.map((rack) => {
                    const slot = slots.find((s) => s.rack === rack && s.shelf === shelf);
                    if (!slot) {
                      return (
                        <div
                          key={`${rack}-${shelf}`}
                          className="h-14 rounded-xl border border-dashed border-slate-200 bg-slate-50"
                        />
                      );
                    }

                    const isDimmed =
                      (filterMode === 'OCCUPIED' && !slot.is_occupied) ||
                      (filterMode === 'AVAILABLE' && slot.is_occupied);

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setActiveSlot(slot)}
                        className={`h-14 rounded-2xl border-2 p-1.5 flex flex-col justify-between text-left transition-all relative ${
                          isDimmed
                            ? 'opacity-25'
                            : slot.is_occupied
                            ? 'bg-rose-50 border-rose-600 shadow-[1.5px_1.5px_0px_#e11d48]'
                            : 'bg-emerald-50 border-emerald-600 shadow-[1.5px_1.5px_0px_#059669]'
                        } hover:scale-105 active:scale-95`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-mono font-black text-[11px] text-[#060D1E]">
                            {rack}{shelf}
                          </span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              slot.is_occupied ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                          />
                        </div>

                        <span className="text-[8px] font-bold text-slate-500 uppercase leading-none truncate">
                          {slot.compartment_type}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Slot Details Drawer / Modal */}
      {activeSlot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-sm bg-[#FEF9F3] rounded-t-3xl sm:rounded-3xl border-2 border-[#060D1E] shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl border-2 border-[#060D1E] flex items-center justify-center font-black ${
                    activeSlot.is_occupied ? 'bg-rose-400 text-white' : 'bg-emerald-400 text-white'
                  }`}
                >
                  <MapPin className="w-5 h-5 text-[#060D1E]" />
                </div>
                <div>
                  <h3 className="font-black text-base text-[#060D1E] leading-tight">
                    {activeSlot.label}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Rack {activeSlot.rack} • Shelf {activeSlot.shelf} • {activeSlot.compartment_type}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveSlot(null)}
                className="p-1 rounded-full hover:bg-slate-100 border border-slate-300"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {activeSlot.is_occupied ? (
              <div className="bg-white rounded-2xl border-2 border-[#060D1E] p-3.5 space-y-2 shadow-[2px_2px_0px_#060D1E]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-400">
                    Occupying Parcel
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                    Occupied
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono font-black text-sm text-[#060D1E]">
                    {activeSlot.parcel?.tracking_number || `AMZ-99${activeSlot.rack}${activeSlot.shelf}`}
                  </span>
                  <span className="text-xs font-bold text-[#1E60F2]">
                    {activeSlot.parcel?.carrier_name || 'Amazon'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-bold">
                    {activeSlot.parcel?.recipient_name || 'Rahul Sharma'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                    Flat {activeSlot.parcel?.apartment_id || 'A-402'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-[#060D1E] p-4 text-center shadow-[2px_2px_0px_#060D1E]">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                <span className="font-black text-sm text-emerald-950 block">
                  Slot Available
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Clean & ready to receive inbound courier shipments.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveSlot(null)}
              className="w-full py-3 bg-[#060D1E] text-white font-black text-xs rounded-2xl active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
