import React from 'react';
import { Package, Clock, Calendar, CheckCircle2, ChevronRight, QrCode, MapPin, Sparkles, Tag } from 'lucide-react';
import type { MobileParcel, ParcelStatus } from '../types';

interface ParcelCardProps {
  parcel: MobileParcel;
  onSelect?: (parcel: MobileParcel) => void;
  onScheduleSlot?: (parcel: MobileParcel) => void;
  onShowPickupCode?: (parcel: MobileParcel) => void;
  compact?: boolean;
}

export const ParcelCard: React.FC<ParcelCardProps> = ({
  parcel,
  onSelect,
  onScheduleSlot,
  onShowPickupCode,
  compact = false,
}) => {
  const getCarrierBadgeColor = (carrier: string) => {
    switch (carrier?.toLowerCase()) {
      case 'amazon':
        return 'bg-amber-500 text-white border-amber-600';
      case 'flipkart':
        return 'bg-blue-600 text-white border-blue-700';
      case 'myntra':
        return 'bg-pink-600 text-white border-pink-700';
      case 'blue dart':
        return 'bg-red-600 text-white border-red-700';
      case 'delhivery':
        return 'bg-slate-900 text-white border-black';
      default:
        return 'bg-indigo-600 text-white border-indigo-700';
    }
  };

  const getStatusBadge = (status: ParcelStatus) => {
    switch (status) {
      case 'WAITING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Waiting at Hub</span>
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300">
            <Calendar className="w-3 h-3 text-blue-600" />
            <span>Scheduled</span>
          </span>
        );
      case 'READY_FOR_PICKUP':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-900 border border-indigo-300">
            <QrCode className="w-3 h-3 text-indigo-600" />
            <span>Ready for Pickup</span>
          </span>
        );
      case 'COLLECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Collected</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(parcel)}
      className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4 transition-all hover:translate-y-[-1px] select-none cursor-pointer"
    >
      {/* Carrier & Tracking Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getCarrierBadgeColor(
              parcel.carrier
            )}`}
          >
            {parcel.carrier || 'Courier'}
          </span>
          <span className="text-xs font-mono font-bold text-slate-600">
            {parcel.trackingNumber}
          </span>
        </div>
        {getStatusBadge(parcel.status)}
      </div>

      {/* Item Description / Parcel Title */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-black text-[#060D1E] leading-snug line-clamp-1 flex-1">
          {parcel.description || `${parcel.carrier} Parcel`}
        </h3>
        {parcel.orderAmount && (
          <span className="text-xs font-black text-slate-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 shrink-0">
            ₹{parcel.orderAmount.toLocaleString('en-IN')}
          </span>
        )}
      </div>

      {/* Auto-sync source indicator */}
      {parcel.syncedFromProvider && (
        <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold text-blue-700 bg-blue-50/70 px-2 py-0.5 rounded-md border border-blue-100 w-fit">
          <Sparkles className="w-3 h-3 text-blue-500" />
          <span>Auto-synced via {parcel.syncedFromProvider}</span>
        </div>
      )}

      {/* Metadata: Location, Scheduled Slot & Estimated Arrival */}
      <div className="space-y-1 mb-3 text-[11px] font-bold text-slate-600">
        {parcel.estimatedDelivery && parcel.status !== 'COLLECTED' && (
          <div className="flex items-center gap-1.5 text-slate-700">
            <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>ETA: <strong className="text-slate-900 font-extrabold">{parcel.estimatedDelivery}</strong></span>
          </div>
        )}

        {parcel.storageLocation && parcel.status !== 'COLLECTED' && (
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Location: <strong className="text-slate-800 font-extrabold">{parcel.storageLocation}</strong></span>
          </div>
        )}

        {parcel.status === 'SCHEDULED' && parcel.scheduledSlot && (
          <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2 py-1 rounded-xl border border-blue-200">
            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Slot: <strong className="font-black text-blue-900">{parcel.scheduledSlot}</strong></span>
          </div>
        )}

        {parcel.status === 'COLLECTED' && (
          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Collected: <strong className="font-black text-emerald-900">{parcel.collectedAt || 'Verified at Hub'}</strong></span>
          </div>
        )}
      </div>

      {/* Action Buttons Row */}
      {!compact && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect && onSelect(parcel);
            }}
            className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-black border border-slate-300 flex items-center justify-center gap-1 active:scale-95 transition-transform"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {parcel.status === 'WAITING' && onScheduleSlot && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onScheduleSlot(parcel);
              }}
              className="flex-1 py-2 px-3 bg-[#1E60F2] hover:bg-blue-600 text-white rounded-xl text-xs font-black border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-1 active:scale-95 transition-transform"
            >
              <Calendar className="w-3.5 h-3.5 text-white" />
              <span>Schedule Slot</span>
            </button>
          )}

          {(parcel.status === 'SCHEDULED' || parcel.status === 'READY_FOR_PICKUP') && onShowPickupCode && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShowPickupCode(parcel);
              }}
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-1 active:scale-95 transition-transform"
            >
              <QrCode className="w-3.5 h-3.5 text-white" />
              <span>Pickup Pass</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
