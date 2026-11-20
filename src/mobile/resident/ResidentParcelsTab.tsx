import React, { useState } from 'react';
import { Package, Search, PackagePlus } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import type { MobileParcel } from '../types';
import { AddOrderModal } from './AddOrderModal';
import { ParcelCard } from '../components/ParcelCard';
import { EmptyState } from '../components/EmptyState';

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
  const { parcels, currentUser } = useMobileStore();
  const [filter, setFilter] = useState<'ALL' | 'WAITING' | 'SCHEDULED' | 'COLLECTED'>('ALL');
  const [search, setSearch] = useState('');
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);

  // Filter parcels for current resident (or all in test mode)
  const residentParcels = parcels.filter((p) => {
    if (!currentUser) return true;
    if (currentUser.flatNumber && p.flat && p.flat.toLowerCase() === currentUser.flatNumber.toLowerCase()) return true;
    if (currentUser.name && p.recipientName && p.recipientName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])) return true;
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

  const filtered = activeList.filter((p) => {
    if (filter === 'WAITING' && p.status !== 'WAITING') return false;
    if (filter === 'SCHEDULED' && p.status !== 'SCHEDULED' && p.status !== 'READY_FOR_PICKUP') return false;
    if (filter === 'COLLECTED' && p.status !== 'COLLECTED') return false;

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

  const getEmptyMessage = () => {
    if (search.trim()) {
      return {
        title: 'No parcels match your search',
        description: `No deliveries matching "${search}" were found. Try searching by carrier or tracking ID.`,
      };
    }
    switch (filter) {
      case 'WAITING':
        return {
          title: 'No parcels waiting at hub',
          description: 'All received packages have either been scheduled or collected.',
        };
      case 'SCHEDULED':
        return {
          title: 'No scheduled pickups',
          description: 'You have not scheduled any pickup slots for today yet.',
        };
      case 'COLLECTED':
        return {
          title: 'No collection history yet',
          description: 'When you collect a package from security with your QR or OTP, it will appear here.',
        };
      default:
        return {
          title: 'Your parcel feed is empty',
          description: 'Add an expected delivery tracking code to get notified when courier arrives at the gate.',
        };
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Top Bar with Add Order */}
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] sticky top-0 z-20 flex items-center justify-between">
        <div>
          <h1 className="text-base font-black text-[#060D1E] tracking-tight">Your Society Parcels</h1>
          <p className="text-[11px] font-bold text-slate-500">Live incoming & stored hub inventory</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddOrderOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E60F2] hover:bg-blue-600 text-white rounded-xl text-xs font-black border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] active:scale-95 transition-all"
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
            placeholder="Search tracking ID, carrier, item..."
            className="w-full bg-white text-xs font-bold text-[#060D1E] py-2.5 pl-9 pr-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {(
            [
              { key: 'ALL', label: 'All Parcels' },
              { key: 'WAITING', label: 'Waiting at Hub' },
              { key: 'SCHEDULED', label: 'Scheduled' },
              { key: 'COLLECTED', label: 'Collected' },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 ${
                filter === item.key
                  ? 'bg-[#1E60F2] text-white border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                  : 'bg-white text-slate-600 border border-slate-300 hover:border-[#060D1E]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Parcels List or Empty State */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <EmptyState
              icon={filter === 'SCHEDULED' ? 'calendar' : filter === 'COLLECTED' ? 'history' : 'package'}
              title={getEmptyMessage().title}
              description={getEmptyMessage().description}
              actionLabel={filter === 'ALL' || filter === 'WAITING' ? '+ Add Expected Order' : undefined}
              onAction={() => setIsAddOrderOpen(true)}
            />
          ) : (
            filtered.map((parcel) => (
              <ParcelCard
                key={parcel.id}
                parcel={parcel}
                onSelect={onSelectParcel}
                onScheduleSlot={onScheduleSlot}
                onShowPickupCode={onShowPickupCode}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Expected Order Modal */}
      {isAddOrderOpen && (
        <AddOrderModal
          onClose={() => setIsAddOrderOpen(false)}
          onSuccess={(newParcel) => {
            setIsAddOrderOpen(false);
            if (newParcel) {
              onSelectParcel(newParcel);
            }
          }}
        />
      )}
    </div>
  );
};
