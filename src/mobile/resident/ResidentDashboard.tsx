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
  Zap,
  UserCheck,
  MapPin,
  Search,
  QrCode,
} from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import type { MobileParcel } from '../types';
import { AddOrderModal } from './AddOrderModal';
import { ShoppingDeliveriesModal } from './ShoppingDeliveriesModal';
import { ExpressPickupModal } from './ExpressPickupModal';
import { AuthorizedPickupModal } from './AuthorizedPickupModal';
import { LiveStorageMapModal } from './LiveStorageMapModal';
import { SmartSearchModal } from './SmartSearchModal';
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
  onOpenAIChat?: () => void;
  onOpenExpressPickup?: () => void;
  onOpenAuthorizedPickup?: () => void;
  onOpenStorageMap?: () => void;
  onOpenSmartSearch?: () => void;
}

export const ResidentDashboard: React.FC<ResidentDashboardProps> = ({
  onSelectParcel,
  onScheduleSlot,
  onShowPickupCode,
  onOpenNotifications,
  onOpenAIChat,
  onOpenExpressPickup: propOpenExpress,
  onOpenAuthorizedPickup: propOpenAuthorized,
  onOpenStorageMap: propOpenStorageMap,
  onOpenSmartSearch: propOpenSmartSearch,
}) => {
  const { parcels, currentUser, selectedSociety } = useMobileStore();

  // Modals state
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [isShoppingModalOpen, setIsShoppingModalOpen] = useState(false);
  const [isExpressPickupOpen, setIsExpressPickupOpen] = useState(false);
  const [isAuthorizedPickupOpen, setIsAuthorizedPickupOpen] = useState(false);
  const [isStorageMapOpen, setIsStorageMapOpen] = useState(false);
  const [isSmartSearchOpen, setIsSmartSearchOpen] = useState(false);

  // Trigger handlers that prefer parent props if passed, otherwise open local modals
  const handleOpenExpress = () => {
    if (propOpenExpress) propOpenExpress();
    else setIsExpressPickupOpen(true);
  };

  const handleOpenAuthorized = () => {
    if (propOpenAuthorized) propOpenAuthorized();
    else setIsAuthorizedPickupOpen(true);
  };

  const handleOpenStorageMap = () => {
    if (propOpenStorageMap) propOpenStorageMap();
    else setIsStorageMapOpen(true);
  };

  const handleOpenSmartSearch = () => {
    if (propOpenSmartSearch) propOpenSmartSearch();
    else setIsSmartSearchOpen(true);
  };

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
    currentUser?.flatNumber && currentUser.flatNumber.trim()
      ? `Tower ${currentUser.flatNumber.charAt(0)}`
      : '';
  const residentFlat = currentUser?.flatNumber && currentUser.flatNumber.trim()
    ? `Flat ${currentUser.flatNumber}`
    : 'Resident Unit Pending';

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
              {residentTower ? `${residentTower} • ` : ''}{residentFlat}
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

        {/* ========================================================================= */}
        {/* RESPONSIBILITY 6 SPEC: "Ask ParcelFlow AI ✨" Banner Card                 */}
        {/* Placed prominently between stat counters and Latest Parcel card          */}
        {/* ========================================================================= */}
        <div
          onClick={onOpenAIChat}
          className="p-4 rounded-3xl bg-gradient-to-r from-[#0B1E3F] via-[#152E5E] to-[#1E60F2] text-white border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] cursor-pointer group hover:opacity-95 active:scale-98 transition-all relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-radial from-amber-400/20 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 p-0.5 shadow-md shrink-0">
                <div className="w-full h-full bg-[#0B1E3F] rounded-[14px] flex items-center justify-center text-amber-300">
                  <Sparkles className="w-5 h-5 fill-amber-300 stroke-[#0B1E3F]" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                    Ask ParcelFlow AI
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-400 text-[#0B1E3F]">
                      Gemini
                    </span>
                  </h3>
                </div>
                <p className="text-[11px] font-bold text-slate-300 mt-0.5">
                  Track parcels, schedule slots, or get pickup QR
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-xl bg-white/10 group-hover:bg-[#FFC72C] group-hover:text-[#0B1E3F] flex items-center justify-center text-white transition-colors shrink-0">
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </div>
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

        {/* ========================================================================= */}
        {/* RESPONSIBILITY 6 SPEC: 4 Next-Level Quick Action Triggers                 */}
        {/* Express Pickup, Family Authorization, Storage Map, and Smart Search       */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-2.5">
            {/* 1. Express Pickup Trigger */}
            <button
              type="button"
              onClick={handleOpenExpress}
              className="p-3 bg-white rounded-2xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] text-left hover:bg-amber-50/70 active:scale-95 transition-all flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-400 border-2 border-[#0B1E3F] flex items-center justify-center text-[#0B1E3F] mb-2">
                <Zap className="w-4 h-4 fill-[#0B1E3F] stroke-[2.5]" />
              </div>
              <div>
                <p className="text-xs font-black text-[#0B1E3F]">Express Pickup</p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                  10-min 1-tap QR release
                </p>
              </div>
            </button>

            {/* 2. Family / Delegate Authorization Trigger */}
            <button
              type="button"
              onClick={handleOpenAuthorized}
              className="p-3 bg-white rounded-2xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] text-left hover:bg-indigo-50/70 active:scale-95 transition-all flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-500 border-2 border-[#0B1E3F] flex items-center justify-center text-white mb-2">
                <UserCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-xs font-black text-[#0B1E3F]">Family Pass</p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                  Allow someone to collect
                </p>
              </div>
            </button>

            {/* 3. Storage Map Trigger */}
            <button
              type="button"
              onClick={handleOpenStorageMap}
              className="p-3 bg-white rounded-2xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] text-left hover:bg-blue-50/70 active:scale-95 transition-all flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-[#1E60F2] border-2 border-[#0B1E3F] flex items-center justify-center text-white mb-2">
                <MapPin className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-xs font-black text-[#0B1E3F]">Storage Map</p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                  Live 2D racks & shelves
                </p>
              </div>
            </button>

            {/* 4. Smart Search Trigger */}
            <button
              type="button"
              onClick={handleOpenSmartSearch}
              className="p-3 bg-white rounded-2xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] text-left hover:bg-emerald-50/70 active:scale-95 transition-all flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500 border-2 border-[#0B1E3F] flex items-center justify-center text-white mb-2">
                <Search className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-xs font-black text-[#0B1E3F]">Smart Search</p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                  Find parcels & tracking
                </p>
              </div>
            </button>
          </div>
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

      {/* Express Pickup Modal */}
      <ExpressPickupModal
        isOpen={isExpressPickupOpen}
        onClose={() => setIsExpressPickupOpen(false)}
        onSelectParcel={onSelectParcel}
      />

      {/* Authorized Pickup Modal */}
      <AuthorizedPickupModal
        isOpen={isAuthorizedPickupOpen}
        onClose={() => setIsAuthorizedPickupOpen(false)}
      />

      {/* Live Storage Map Modal */}
      <LiveStorageMapModal
        isOpen={isStorageMapOpen}
        onClose={() => setIsStorageMapOpen(false)}
        onSelectParcel={onSelectParcel}
        onShowPickupCode={onShowPickupCode}
      />

      {/* Smart Search Modal */}
      <SmartSearchModal
        isOpen={isSmartSearchOpen}
        onClose={() => setIsSmartSearchOpen(false)}
        onSelectParcel={onSelectParcel}
      />
    </div>
  );
};
