import React, { useState } from 'react';
import { Package, Clock, CheckCircle2, Calendar, QrCode, Sparkles, Plus, PackagePlus, Shield } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import type { MobileParcel } from '../types';
import { AddOrderModal } from './AddOrderModal';
import { MobileHeader } from '../components/MobileHeader';
import { ParcelCard } from '../components/ParcelCard';
import { EmptyState } from '../components/EmptyState';

interface ResidentDashboardProps {
  onSelectParcel: (parcel: MobileParcel) => void;
  onScheduleSlot: (parcel: MobileParcel) => void;
  onShowPickupCode: (parcel: MobileParcel) => void;
  onOpenNotifications?: () => void;
}

export const ResidentDashboard: React.FC<ResidentDashboardProps> = ({
  onSelectParcel,
  onScheduleSlot,
  onShowPickupCode,
  onOpenNotifications,
}) => {
  const { parcels, selectedSociety, currentUser } = useMobileStore();
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);

  // Filter parcels belonging to current resident (or all in test mode)
  const residentParcels = parcels.filter((p) => {
    if (!currentUser) return true;
    if (currentUser.flatNumber && p.flat && p.flat.toLowerCase() === currentUser.flatNumber.toLowerCase()) return true;
    if (currentUser.name && p.recipientName && p.recipientName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])) return true;
    if (currentUser.phone && p.recipientPhone && p.recipientPhone === currentUser.phone) return true;
    return true; // Show in feed for society
  });

  // De-duplicate by id
  const seenIds = new Set<string>();
  const activeParcels = residentParcels.filter((p) => {
    if (seenIds.has(p.id)) return false;
    seenIds.add(p.id);
    return true;
  });

  const waitingParcels = activeParcels.filter((p) => p.status === 'WAITING');
  const scheduledParcels = activeParcels.filter((p) => p.status === 'SCHEDULED' || p.status === 'READY_FOR_PICKUP');
  const collectedParcels = activeParcels.filter((p) => p.status === 'COLLECTED');
  const inboundParcels = activeParcels.filter((p) => p.status !== 'COLLECTED');

  const nextScheduledParcel = scheduledParcels[0] || null;

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Top Header — Clean & non-repetitive */}
      <MobileHeader
        userName={currentUser?.name || 'Resident'}
        societyName={selectedSociety.name}
        flatNumber={currentUser?.flatNumber ? `Flat ${currentUser.flatNumber}` : undefined}
        onOpenNotifications={onOpenNotifications}
        hasUnreadNotifications={waitingParcels.length > 0}
      />

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20 space-y-4">
        {/* KPI Stats Row: Waiting, Scheduled, Collected */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-white p-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-amber-600">Waiting</span>
              <Package className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-[#060D1E]">{waitingParcels.length}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">At Hub</div>
          </div>

          <div className="bg-white p-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-[#1E60F2]">Scheduled</span>
              <Calendar className="w-3.5 h-3.5 text-[#1E60F2]" />
            </div>
            <div className="text-2xl font-black text-[#060D1E]">{scheduledParcels.length}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">Booked</div>
          </div>

          <div className="bg-white p-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-emerald-600">Collected</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-[#060D1E]">{collectedParcels.length}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">Total</div>
          </div>
        </div>

        {/* Next Scheduled Handover Spotlight (Only shown if a parcel is scheduled) */}
        {nextScheduledParcel && (
          <div className="p-4 rounded-3xl bg-blue-600 text-white border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-black uppercase tracking-wider text-blue-100">
                  Ready for Handover
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-white text-blue-900">
                {nextScheduledParcel.carrier}
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold text-blue-100 line-clamp-1">
                {nextScheduledParcel.description || 'Inbound Delivery'}
              </p>
              <p className="text-sm font-black text-white mt-0.5">
                {nextScheduledParcel.scheduledSlot || 'Slot Confirmed'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onShowPickupCode(nextScheduledParcel)}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <QrCode className="w-4 h-4 text-white" />
              <span>Show Pickup Pass (QR / OTP)</span>
            </button>
          </div>
        )}

        {/* Society Hub Status Card */}
        <div className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-[#060D1E] flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <p className="text-xs font-black text-[#060D1E]">Society Parcel Hub</p>
              <p className="text-[10px] font-bold text-slate-500">Counter Open: 8:00 AM – 10:00 PM Daily</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
            Active
          </span>
        </div>

        {/* Inbound Parcels List / Empty State */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-[#060D1E] uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#1E60F2]" />
              <span>Inbound Deliveries ({inboundParcels.length})</span>
            </h2>

            <button
              type="button"
              onClick={() => setIsAddOrderOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#1E60F2] hover:bg-blue-600 text-white rounded-xl text-xs font-black border-2 border-[#060D1E] shadow-[1.5px_1.5px_0px_#060D1E] active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Order</span>
            </button>
          </div>

          {inboundParcels.length === 0 ? (
            <EmptyState
              icon="package"
              title="No parcels waiting at hub"
              description="When Amazon, Flipkart, or any courier drops off a package at your society gate, it will be checked in and appear here immediately."
              actionLabel="+ Add Expected Order"
              onAction={() => setIsAddOrderOpen(true)}
            />
          ) : (
            inboundParcels.map((parcel) => (
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
