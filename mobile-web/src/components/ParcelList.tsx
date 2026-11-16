import React, { useState } from 'react';
import { Package, CheckCircle2, Clock, MapPin, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';
import { Sticker } from './Sticker';
import { mobileStore, MobileParcel } from '../services/supabaseService';

interface ParcelListProps {
  onSelectParcelForOtp: (parcel: MobileParcel) => void;
  onNavigateToSlots: () => void;
}

export const ParcelList: React.FC<ParcelListProps> = ({ onSelectParcelForOtp, onNavigateToSlots }) => {
  const [filter, setFilter] = useState<'ALL' | 'READY' | 'COLLECTED'>('ALL');
  const parcels = mobileStore.getParcels();

  const filtered = parcels.filter((p) => {
    if (filter === 'READY') return p.status === 'READY_FOR_PICKUP';
    if (filter === 'COLLECTED') return p.status === 'COLLECTED';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header with Quick Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#0A1128] flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <span>My Society Deliveries</span>
          </h2>
          <p className="text-xs font-semibold text-slate-600">
            Real-time tracking for Flat B-402, Lakeview Residency
          </p>
        </div>

        <div className="flex rounded-xl border-2 border-[#0A1128] bg-white p-1 self-start sm:self-auto">
          {(['ALL', 'READY', 'COLLECTED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                filter === tab
                  ? 'bg-blue-600 text-white shadow-[2px_2px_0px_#0A1128]'
                  : 'text-slate-600 hover:text-[#0A1128]'
              }`}
            >
              {tab === 'ALL' ? 'All (4)' : tab === 'READY' ? 'Ready (2)' : 'Collected'}
            </button>
          ))}
        </div>
      </div>

      {/* Parcel Cards */}
      <div className="space-y-3">
        {filtered.map((parcel) => {
          const isReady = parcel.status === 'READY_FOR_PICKUP';
          const isCollected = parcel.status === 'COLLECTED';

          return (
            <div
              key={parcel.id}
              className={`p-4 rounded-2xl border-[2.5px] transition-all relative overflow-hidden ${
                isReady
                  ? 'bg-white border-[#0A1128] shadow-[4px_4px_0px_#0A1128]'
                  : isCollected
                  ? 'bg-slate-50 border-slate-300 shadow-[2px_2px_0px_#94A3B8] opacity-80'
                  : 'bg-amber-50 border-[#0A1128] shadow-[3px_3px_0px_#0A1128]'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-11 h-11 rounded-xl border-2 border-[#0A1128] flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#0A1128] ${
                      parcel.carrier === 'AMAZON'
                        ? 'bg-amber-300 text-[#0A1128]'
                        : parcel.carrier === 'FLIPKART'
                        ? 'bg-blue-500 text-white'
                        : 'bg-emerald-400 text-[#0A1128]'
                    }`}
                  >
                    {parcel.carrier.slice(0, 4)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-black text-[#0A1128]">
                        {parcel.tracking_number}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                      Carrier: {parcel.carrier} {parcel.weight_kg ? `· ${parcel.weight_kg} kg` : ''}
                    </p>
                  </div>
                </div>

                <Sticker
                  color={isReady ? 'mint' : isCollected ? 'white' : 'yellow'}
                  rotate="none"
                  size="xs"
                >
                  {isReady ? 'Ready for Pickup' : isCollected ? 'Collected' : 'In Transit'}
                </Sticker>
              </div>

              {/* Location & Slot Info */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold py-2 my-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{parcel.storage_location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{parcel.scheduled_slot || 'No slot booked'}</span>
                </div>
              </div>

              {/* Ready Actions */}
              {isReady && (
                <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onSelectParcelForOtp(parcel)}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0A1128] font-black text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Get Handover OTP</span>
                  </button>
                  <button
                    onClick={onNavigateToSlots}
                    className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-[#0A1128] font-black text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] active:translate-y-0.5 transition-all flex items-center gap-1"
                  >
                    <span>Schedule</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
