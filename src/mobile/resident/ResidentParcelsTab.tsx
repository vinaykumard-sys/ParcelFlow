import React, { useState } from 'react';
import {
  Search,
  Package,
  Plus,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  QrCode,
  CheckCircle2,
  ChevronRight,
  Inbox,
} from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import type { MobileParcel, ParcelStatus } from '../types';
import { AddOrderModal } from './AddOrderModal';
import { ShoppingDeliveriesModal } from './ShoppingDeliveriesModal';
import { CarrierLogo } from '../components/design-system';
import { StatusPill } from './ResidentUIComponents';

interface ResidentParcelsTabProps {
  onSelectParcel: (parcel: MobileParcel) => void;
  onScheduleSlot: (parcel: MobileParcel) => void;
  onShowPickupCode: (parcel: MobileParcel) => void;
}

type FilterChipType = 'ALL' | 'EXPECTED' | 'RECEIVED' | 'STORED' | 'READY' | 'COLLECTED';

export const ResidentParcelsTab: React.FC<ResidentParcelsTabProps> = ({
  onSelectParcel,
  onScheduleSlot,
  onShowPickupCode,
}) => {
  const { parcels, currentUser } = useMobileStore();
  const [filter, setFilter] = useState<FilterChipType>('ALL');
  const [search, setSearch] = useState('');
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [isShoppingModalOpen, setIsShoppingModalOpen] = useState(false);

  // Filter parcels for current resident (or all in test mode)
  const residentParcels = parcels.filter((p) => {
    if (!currentUser) return true;
    if (
      currentUser.flatNumber &&
      p.flat &&
      p.flat.toLowerCase() === currentUser.flatNumber.toLowerCase()
    )
      return true;
    if (
      currentUser.name &&
      p.recipientName &&
      p.recipientName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])
    )
      return true;
    if (currentUser.phone && p.recipientPhone && p.recipientPhone === currentUser.phone) return true;
    return true;
  });

  // De-duplicate by id
  const seen = new Set<string>();
  const activeList = residentParcels.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  // Apply filter chip
  const filtered = activeList.filter((p) => {
    if (filter === 'EXPECTED') {
      const isExpected =
        p.status === 'WAITING' &&
        (!p.storageLocation || p.storageLocation === 'Awaiting Hub Intake');
      if (!isExpected) return false;
    } else if (filter === 'RECEIVED') {
      const isReceived =
        p.status === 'WAITING' &&
        p.storageLocation &&
        p.storageLocation !== 'Awaiting Hub Intake';
      if (!isReceived) return false;
    } else if (filter === 'STORED') {
      const isStored =
        p.storageLocation &&
        p.storageLocation !== 'Awaiting Hub Intake' &&
        p.status !== 'COLLECTED';
      if (!isStored) return false;
    } else if (filter === 'READY') {
      const isReady = p.status === 'READY_FOR_PICKUP' || p.status === 'SCHEDULED';
      if (!isReady) return false;
    } else if (filter === 'COLLECTED') {
      if (p.status !== 'COLLECTED') return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.trackingNumber.toLowerCase().includes(q) ||
        p.carrier.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.storageLocation && p.storageLocation.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const filterChips: { id: FilterChipType; label: string }[] = [
    { id: 'ALL', label: 'All' },
    { id: 'EXPECTED', label: 'Expected' },
    { id: 'RECEIVED', label: 'Received' },
    { id: 'STORED', label: 'Stored' },
    { id: 'READY', label: 'Ready' },
    { id: 'COLLECTED', label: 'Collected' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#0B1E3F] select-none">
      {/* Top Header Bar */}
      <div className="px-5 pt-3 pb-3 bg-white border-b-2 border-slate-100 sticky top-0 z-20 flex items-center justify-between">
        <div>
          <h1 className="text-base font-black text-[#0B1E3F] tracking-tight">Your Society Parcels</h1>
          <p className="text-[11px] font-bold text-slate-500">Live incoming & stored hub deliveries</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsShoppingModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#FFC72C] hover:bg-[#F59E0B] text-[#0B1E3F] rounded-xl text-xs font-black border-2 border-[#0B1E3F] shadow-[1.5px_1.5px_0px_#0B1E3F] active:scale-95 transition-all"
            title="Auto-discover online orders"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Sync</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddOrderOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-black border-2 border-[#0B1E3F] shadow-[1.5px_1.5px_0px_#0B1E3F] active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Order</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24 space-y-3.5">
        {/* Screen 2 Spec: Search bar */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracking ID, carrier, item..."
            className="w-full bg-white text-xs font-bold text-[#0B1E3F] py-2.5 pl-9 pr-3 rounded-2xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Screen 2 Spec: Filter chips: All, Expected, Received, Stored, Ready, Collected */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {filterChips.map((chip) => {
            const isActive = filter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setFilter(chip.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#0B1E3F] text-white border-2 border-[#0B1E3F] shadow-[1.5px_1.5px_0px_#0B1E3F]'
                    : 'bg-white text-slate-600 border border-slate-300 hover:border-[#0B1E3F]'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Screen 2 Spec: Redesigned parcel cards matching the reference design language */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-[#0B1E3F] flex items-center justify-center mx-auto text-amber-800">
              <Package className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#0B1E3F]">
                {search.trim() ? 'No parcels match your search' : 'No parcels in this category'}
              </h3>
              <p className="text-xs font-bold text-slate-500 mt-1">
                {search.trim()
                  ? `No deliveries matching "${search}" were found.`
                  : 'Add an expected order or auto-sync with Amazon, Flipkart, or Gmail.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddOrderOpen(true)}
              className="py-2 px-4 bg-[#FFC72C] hover:bg-[#F59E0B] text-[#0B1E3F] rounded-xl text-xs font-black border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] active:scale-95 transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Add Expected Order</span>
            </button>
          </div>
        ) : (
          filtered.map((parcel) => {
            const isReady =
              parcel.status === 'READY_FOR_PICKUP' || parcel.status === 'SCHEDULED';
            const isStored =
              parcel.storageLocation && parcel.storageLocation !== 'Awaiting Hub Intake';

            return (
              <div
                key={parcel.id}
                onClick={() => onSelectParcel(parcel)}
                className="bg-white rounded-3xl border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] p-4 space-y-3 cursor-pointer hover:translate-y-[-1px] transition-transform group"
              >
                {/* Card Top: Carrier Logo + Name + Tracking ID + Status Pill */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CarrierLogo carrier={parcel.carrier} size="md" />
                    <div className="min-w-0">
                      <span className="text-xs font-mono font-black text-slate-500 truncate block">
                        {parcel.carrier} • #{parcel.trackingNumber}
                      </span>
                    </div>
                  </div>

                  <StatusPill
                    status={parcel.status}
                    labelOverride={
                      isReady
                        ? 'Ready for Pickup'
                        : isStored
                        ? 'Stored in Hub'
                        : 'Expected'
                    }
                  />
                </div>

                {/* Parcel Name */}
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-black text-[#0B1E3F] leading-snug line-clamp-1 group-hover:text-[#2563EB] transition-colors">
                    {parcel.description || `${parcel.carrier} Parcel`}
                  </h3>
                  {parcel.orderAmount && (
                    <span className="text-xs font-black text-[#0B1E3F] shrink-0">
                      ₹{parcel.orderAmount.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Metadata Row: Storage Location & Time */}
                <div className="bg-[#FEF9F3] p-2.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    <span>
                      Storage:{' '}
                      <strong className="text-[#0B1E3F] font-black">
                        {parcel.storageLocation || 'Awaiting Hub Intake'}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px]">
                      {parcel.status === 'COLLECTED'
                        ? parcel.collectedAt || 'Collected'
                        : parcel.scheduledSlot
                        ? parcel.scheduledSlot
                        : parcel.receivedAt || 'Today'}
                    </span>
                  </div>
                </div>

                {/* Card Actions Row */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectParcel(parcel);
                    }}
                    className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-[#0B1E3F] rounded-xl text-xs font-black border border-slate-300 flex items-center justify-center gap-1 active:scale-95 transition-transform"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isReady ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowPickupCode(parcel);
                      }}
                      className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black border-2 border-[#0B1E3F] shadow-[1.5px_1.5px_0px_#0B1E3F] flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                    >
                      <QrCode className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Show Pass</span>
                    </button>
                  ) : parcel.status === 'WAITING' && isStored ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onScheduleSlot(parcel);
                      }}
                      className="flex-1 py-2 px-3 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-black border-2 border-[#0B1E3F] shadow-[1.5px_1.5px_0px_#0B1E3F] flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Schedule Slot</span>
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Expected Order Modal */}
      {isAddOrderOpen && (
        <AddOrderModal
          onClose={() => setIsAddOrderOpen(false)}
          onSuccess={(newParcel) => {
            setIsAddOrderOpen(false);
            if (newParcel) onSelectParcel(newParcel);
          }}
        />
      )}

      {/* Shopping & Deliveries Auto-Aggregation Modal */}
      <ShoppingDeliveriesModal
        isOpen={isShoppingModalOpen}
        onClose={() => setIsShoppingModalOpen(false)}
      />
    </div>
  );
};
