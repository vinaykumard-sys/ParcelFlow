import React, { useState } from 'react';
import {
  Package,
  Inbox,
  CheckCircle2,
  Calendar,
  ChevronRight,
  ArrowRight,
  Plus,
  Sparkles,
  Shield,
} from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import type { MobileParcel } from '../types';
import { AddOrderModal } from './AddOrderModal';
import { ShoppingDeliveriesModal } from './ShoppingDeliveriesModal';
import { MobileHeader } from '../components/MobileHeader';
import {
  ResidentParcelStackIllustration,
  CarrierLogo,
} from '../components/design-system';
import { StatusPill } from './ResidentUIComponents';

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
  const { parcels, currentUser, selectedSociety } = useMobileStore();
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [isShoppingModalOpen, setIsShoppingModalOpen] = useState(false);

  // Filter parcels belonging to current resident (or all in demo mode)
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
  const seenIds = new Set<string>();
  const activeParcels = residentParcels.filter((p) => {
    if (seenIds.has(p.id)) return false;
    seenIds.add(p.id);
    return true;
  });

  // Calculate real stat counts from store
  const expectedParcels = activeParcels.filter(
    (p) =>
      p.status === 'WAITING' &&
      (!p.storageLocation || p.storageLocation === 'Awaiting Hub Intake')
  );
  const receivedParcels = activeParcels.filter(
    (p) =>
      p.status === 'WAITING' &&
      p.storageLocation &&
      p.storageLocation !== 'Awaiting Hub Intake'
  );
  const readyParcels = activeParcels.filter(
    (p) => p.status === 'READY_FOR_PICKUP' || p.status === 'SCHEDULED'
  );

  const expectedCount = expectedParcels.length;
  const receivedCount = receivedParcels.length;
  const readyCount = readyParcels.length;

  // Latest parcel: prioritize ready/scheduled, then received, then latest
  const latestParcel =
    readyParcels[0] ||
    receivedParcels[0] ||
    activeParcels.find((p) => p.status !== 'COLLECTED') ||
    activeParcels[0] ||
    null;

  // Upcoming scheduled pickup parcel
  const scheduledParcel = activeParcels.find(
    (p) => p.status === 'SCHEDULED' || p.status === 'READY_FOR_PICKUP'
  );

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const residentName = currentUser?.name
    ? currentUser.name.split(' ')[0]
    : 'Resident';
  const residentTower =
    currentUser?.flatNumber
      ? `Tower ${currentUser.flatNumber.charAt(0)}`
      : 'Tower A';
  const residentFlat = currentUser?.flatNumber
    ? `Flat ${currentUser.flatNumber}`
    : 'Flat 402';

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#0B1E3F] select-none">
      {/* Screen 1 Spec: Top Header with Hamburger, ParcelFlow Logo, Notification bell */}
      <MobileHeader
        userName={currentUser?.name || 'Resident'}
        societyName={selectedSociety.name}
        flatNumber={currentUser?.flatNumber ? `Flat ${currentUser.flatNumber}` : undefined}
        onOpenNotifications={onOpenNotifications}
        hasUnreadNotifications={readyCount > 0 || receivedCount > 0}
        showGreeting={false}
      />

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24 space-y-4">
        {/* Screen 1 Spec: Greeting Card with 3D parcel boxes graphic on the right */}
        <div className="bg-white rounded-3xl border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] p-4 flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 z-10">
            <h1 className="text-xl font-black text-[#0B1E3F] tracking-tight leading-tight">
              {getGreeting()}, {residentName} 👋
            </h1>
            <p className="text-xs font-bold text-slate-500">
              {residentTower} • {residentFlat}
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] font-black text-[#2563EB]">
              <span>{selectedSociety.name}</span>
            </div>
          </div>

          {/* 3D Parcel Boxes Graphic on the Right */}
          <div className="z-10 shrink-0">
            <ResidentParcelStackIllustration size={96} />
          </div>
        </div>

        {/* Screen 1 Spec: 3 Summary Stat Cards in a row */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Expected Card: Yellow box icon, yellow accent */}
          <div className="bg-white rounded-2xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] p-3 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 mb-2">
              <Package className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="text-2xl font-black text-[#0B1E3F]">{expectedCount}</div>
            <div className="text-[11px] font-bold text-slate-600 mt-0.5">Expected</div>
          </div>

          {/* Received Card: Green box/inbox icon, green accent */}
          <div className="bg-white rounded-2xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] p-3 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 mb-2">
              <Inbox className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="text-2xl font-black text-[#0B1E3F]">{receivedCount}</div>
            <div className="text-[11px] font-bold text-slate-600 mt-0.5">Received</div>
          </div>

          {/* Ready Card: Green check icon */}
          <div className="bg-white rounded-2xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] p-3 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 mb-2">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="text-2xl font-black text-[#0B1E3F]">{readyCount}</div>
            <div className="text-[11px] font-bold text-slate-600 mt-0.5">Ready</div>
          </div>
        </div>

        {/* Screen 1 Spec: "Your Latest Parcel" Card */}
        {latestParcel ? (
          <div className="bg-white rounded-3xl border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Your Latest Parcel
              </h2>
              <StatusPill
                status={latestParcel.status}
                labelOverride={
                  latestParcel.status === 'READY_FOR_PICKUP' ||
                  latestParcel.status === 'SCHEDULED'
                    ? 'Ready for Pickup'
                    : latestParcel.status === 'WAITING' &&
                      latestParcel.storageLocation &&
                      latestParcel.storageLocation !== 'Awaiting Hub Intake'
                    ? 'Received at Hub'
                    : 'Expected Delivery'
                }
              />
            </div>

            {/* Carrier logo, Parcel name, Tracking ID, Arrow icon */}
            <div
              onClick={() => onSelectParcel(latestParcel)}
              className="flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <CarrierLogo carrier={latestParcel.carrier} size="md" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-black text-[#0B1E3F] truncate group-hover:text-[#2563EB] transition-colors">
                    {latestParcel.description || `${latestParcel.carrier} Parcel`}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-0.5 truncate">
                    {latestParcel.carrier} • #{latestParcel.trackingNumber}
                  </p>
                  <p className="text-[11px] font-bold text-slate-600 mt-0.5">
                    Storage:{' '}
                    <span className="font-black text-[#0B1E3F]">
                      {latestParcel.storageLocation || 'Hub A - S3'}
                    </span>
                  </p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>

            {/* Primary CTA button: vibrant yellow/gold button with dark bold text */}
            <button
              type="button"
              onClick={() => onSelectParcel(latestParcel)}
              className="w-full py-2.5 px-4 bg-[#FFC72C] hover:bg-[#F59E0B] text-[#0B1E3F] font-black text-xs rounded-xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>View Parcel</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        ) : (
          /* Empty State if no active parcels */
          <div className="bg-white rounded-3xl border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] p-4 space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-[#0B1E3F] flex items-center justify-center mx-auto text-amber-800">
              <Package className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#0B1E3F]">No parcels at hub yet</h3>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                Add an expected order or auto-sync your deliveries to get notified.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddOrderOpen(true)}
              className="w-full py-2.5 px-4 bg-[#FFC72C] hover:bg-[#F59E0B] text-[#0B1E3F] font-black text-xs rounded-xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Add Expected Order</span>
            </button>
          </div>
        )}

        {/* Screen 1 Spec: "Upcoming Pickup" Card */}
        <div
          onClick={() => {
            if (scheduledParcel) {
              onShowPickupCode(scheduledParcel);
            } else if (readyParcels[0]) {
              onScheduleSlot(readyParcels[0]);
            }
          }}
          className="bg-white rounded-2xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 border-2 border-[#0B1E3F] shadow-[1.5px_1.5px_0px_#0B1E3F] flex items-center justify-center text-[#2563EB] shrink-0">
              <Calendar className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-black text-[#0B1E3F] group-hover:text-[#2563EB] transition-colors">
                {scheduledParcel
                  ? scheduledParcel.scheduledSlot || 'Today, 5:00 - 5:30 PM'
                  : readyParcels.length > 0
                  ? 'Ready for Pickup Slot'
                  : 'Counter Open: Today, 8:00 AM - 10:00 PM'}
              </p>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                {scheduledParcel
                  ? `1 parcel • ${
                      scheduledParcel.storageLocation
                        ? scheduledParcel.storageLocation.split(' - ')[0]
                        : 'Hub A'
                    }`
                  : readyParcels.length > 0
                  ? `${readyParcels.length} parcel${
                      readyParcels.length > 1 ? 's' : ''
                    } • Hub A`
                  : 'Society Hub A Counter'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
        </div>

        {/* Screen 1 Spec: Quick action to open "Shopping & Deliveries" and "+ Add Expected Order" */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* Shopping & Deliveries Auto-Sync Card */}
          <button
            type="button"
            onClick={() => setIsShoppingModalOpen(true)}
            className="p-3 bg-white rounded-2xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] text-left hover:bg-amber-50/60 active:scale-95 transition-all flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FFC72C] border-2 border-[#0B1E3F] flex items-center justify-center text-[#0B1E3F] mb-2">
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-black text-[#0B1E3F]">Auto-Sync</p>
              <p className="text-[10px] font-bold text-slate-500 mt-0.5">Amazon, Flipkart & Gmail</p>
            </div>
          </button>

          {/* Add Expected Order Card */}
          <button
            type="button"
            onClick={() => setIsAddOrderOpen(true)}
            className="p-3 bg-white rounded-2xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] text-left hover:bg-blue-50/60 active:scale-95 transition-all flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-[#2563EB] border-2 border-[#0B1E3F] flex items-center justify-center text-white mb-2">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <p className="text-xs font-black text-[#0B1E3F]">+ Add Order</p>
              <p className="text-[10px] font-bold text-slate-500 mt-0.5">Pre-register incoming</p>
            </div>
          </button>
        </div>

        {/* Security Hub Counter Info */}
        <div className="bg-white p-3 rounded-2xl border-2 border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Hub Staff On Duty: 8:00 AM – 10:00 PM</span>
          </div>
          <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Active
          </span>
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

      {/* Shopping & Deliveries Auto-Aggregation Modal */}
      <ShoppingDeliveriesModal
        isOpen={isShoppingModalOpen}
        onClose={() => setIsShoppingModalOpen(false)}
      />
    </div>
  );
};
