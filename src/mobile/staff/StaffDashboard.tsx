import React, { useState } from 'react';
import {
  Menu,
  Bell,
  ScanLine,
  Inbox,
  Clock,
  Package,
  Search,
  CheckCircle2,
  ArrowRight,
  Shield,
  Sparkles,
  MapPin,
  Calendar,
  X,
  Building,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import type { MobileParcel } from '../types';

interface StaffDashboardProps {
  onOpenScanner?: () => void;
  onReceiveParcel: () => void;
  onHandoverParcel: () => void;
  onOpenParcelList: () => void;
  onSearchParcel?: () => void;
  onFindResident: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  onOpenScanner,
  onReceiveParcel,
  onHandoverParcel,
  onOpenParcelList,
  onSearchParcel,
  onFindResident,
}) => {
  const { selectedSociety, parcels, currentUser, logout } = useMobileStore();
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning, Security Team 👮‍♂️';
    if (hour < 17) return 'Good Afternoon, Security Team 👮‍♂️';
    return 'Good Evening, Security Team 👮‍♂️';
  };

  const pendingHandovers = parcels.filter(
    (p) => p.status === 'READY_FOR_PICKUP' || p.status === 'SCHEDULED' || p.status === 'WAITING'
  );

  const readyForPickupParcels = parcels.filter(
    (p) => p.status === 'READY_FOR_PICKUP'
  );

  const collectedParcels = parcels.filter((p) => p.status === 'COLLECTED');

  // Build real activity timeline from parcels
  interface ActivityItem {
    id: string;
    type: 'RECEIVED' | 'STORED' | 'COLLECTED';
    title: string;
    subtitle: string;
    time: string;
    dotColor: string;
    badgeText?: string;
  }

  const activityList: ActivityItem[] = [];

  parcels.forEach((p, idx) => {
    // 1. Intake Received event
    activityList.push({
      id: `${p.id}-received`,
      type: 'RECEIVED',
      title: `Parcel Received #${p.trackingNumber}`,
      subtitle: `${p.carrier} • Inbound Intake`,
      time: p.receivedAt ? (p.receivedAt.includes(':') ? p.receivedAt : '10:12 AM') : '10:12 AM',
      dotColor: 'bg-emerald-500',
      badgeText: p.carrier,
    });

    // 2. Storage event
    if (p.storageLocation) {
      activityList.push({
        id: `${p.id}-stored`,
        type: 'STORED',
        title: `Stored in ${p.storageLocation}`,
        subtitle: `Assigned for ${p.recipientName} (${p.flat})`,
        time: p.receivedAt ? (p.receivedAt.includes(':') ? p.receivedAt : '10:14 AM') : '10:14 AM',
        dotColor: 'bg-purple-500',
        badgeText: 'Storage',
      });
    }

    // 3. Collected event
    if (p.status === 'COLLECTED' || p.collectedAt) {
      activityList.push({
        id: `${p.id}-collected`,
        type: 'COLLECTED',
        title: `Handed over to ${p.recipientName} (${p.flat})`,
        subtitle: `Verified via OTP/QR pass`,
        time: p.collectedAt || 'Today',
        dotColor: 'bg-blue-500',
        badgeText: 'Handover',
      });
    }
  });

  // Limit to most recent 6 activities
  const recentActivities = activityList.slice(0, 6);

  const handleScanAction = () => {
    if (onOpenScanner) {
      onOpenScanner();
    } else {
      onReceiveParcel();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none relative">
      {/* Screen 1: Top Header with Hamburger, ParcelFlow Logo, Notification bell */}
      <div className="px-5 pt-3.5 pb-3 border-b border-slate-200/80 bg-[#FEF9F3] sticky top-0 z-30">
        <div className="flex items-center justify-between">
          {/* Hamburger Menu Button */}
          <button
            onClick={() => setShowMenuDrawer(true)}
            aria-label="Open Navigation Menu"
            className="w-10 h-10 rounded-2xl bg-white border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center text-[#060D1E] active:scale-95 transition-transform"
          >
            <Menu className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* ParcelFlow Brand Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1E60F2] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center text-white">
              <Package className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-base font-black tracking-tight text-[#060D1E]">
                Parcel<span className="text-[#1E60F2]">Flow</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Security Desk
              </span>
            </div>
          </div>

          {/* Notification Bell with Badge */}
          <button
            onClick={() => setShowNotificationModal(true)}
            aria-label="Notifications"
            className="w-10 h-10 rounded-2xl bg-white border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center text-[#060D1E] relative active:scale-95 transition-transform"
          >
            <Bell className="w-5 h-5 stroke-[2.2]" />
            {readyForPickupParcels.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 border-2 border-[#060D1E] text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                {readyForPickupParcels.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20 space-y-4">
        {/* Greeting Section with Society Name & Security Officer Graphic */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4 flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              On Duty • Active Shift
            </span>
            <h1 className="text-base font-black text-[#060D1E] leading-tight">
              {getGreeting()}
            </h1>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mt-1">
              <Building className="w-3.5 h-3.5 text-[#1E60F2] shrink-0" />
              <span className="font-extrabold text-slate-700">
                {selectedSociety?.name || 'Riverview Residency'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-700 font-black">Gate Hub #1</span>
            </div>
          </div>

          {/* Security Officer Graphic Badge */}
          <div className="shrink-0 ml-3">
            <div className="w-16 h-16 rounded-2xl bg-[#0B1E3F] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex flex-col items-center justify-center relative overflow-hidden">
              {/* Badge Glow & Details */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-transparent opacity-60" />
              <div className="relative flex flex-col items-center">
                <span className="text-2xl drop-shadow-md select-none">👮‍♂️</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-amber-300 mt-0.5">
                  OFFICER
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time "Resident On The Way" Express Handover Alert */}
        {readyForPickupParcels.length > 0 && (
          <div className="bg-amber-500 text-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4 space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white text-amber-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                🚨 Resident Heading to Counter
              </span>
              <span className="text-xs font-bold text-amber-100">Express Handover</span>
            </div>

            {readyForPickupParcels.map((p) => (
              <div
                key={p.id}
                className="bg-amber-600/60 rounded-2xl p-2.5 border border-amber-300/40 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-black text-white">
                    {p.recipientName} ({p.flat})
                  </p>
                  <p className="text-[11px] text-amber-100 font-semibold">
                    Retrieve from: <strong className="underline font-black text-white">{p.storageLocation}</strong>
                  </p>
                </div>
                <button
                  onClick={onHandoverParcel}
                  className="px-3 py-1.5 bg-white text-amber-950 hover:bg-amber-50 font-black text-xs rounded-xl border border-[#060D1E] shadow-[1px_1px_0px_#000] active:scale-95 transition-transform"
                >
                  Verify Pass
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Large Primary Hero Card: Deep navy background (#0B1E3F), rounded-3xl, viewfinder scan icon */}
        <div
          onClick={handleScanAction}
          className="w-full bg-[#0B1E3F] hover:bg-[#0c244d] rounded-3xl border-2 border-[#060D1E] shadow-[4px_4px_0px_#060D1E] p-5 text-white cursor-pointer relative overflow-hidden transition-all active:scale-[0.99] group"
        >
          {/* Subtle geometric background patterns */}
          <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-4 top-4 opacity-15">
            <ScanLine className="w-24 h-24 stroke-[1.5]" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Illuminated Viewfinder Scan Icon */}
              <div className="w-14 h-14 rounded-2xl bg-white/10 border-2 border-[#00F0FF]/60 shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center justify-center text-[#00F0FF] group-hover:scale-105 transition-transform">
                <ScanLine className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] text-[9px] font-black uppercase tracking-wider mb-1">
                  <span>Fast Scanner</span>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight leading-tight">
                  Scan Parcel
                </h2>
                <p className="text-xs font-bold text-slate-300 mt-0.5">
                  Scan barcode / QR to receive
                </p>
              </div>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* 4 Quick Operation Cards (2x2 grid) */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2.5">
            Quick Operations
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {/* 1. Receive Parcel (inbox icon) */}
            <button
              onClick={onReceiveParcel}
              className="bg-white hover:bg-slate-50/80 p-4 rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex flex-col text-left transition-transform active:scale-95 group"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border-2 border-[#060D1E] shadow-[1.5px_1.5px_0px_#060D1E] flex items-center justify-center text-[#1E60F2] group-hover:scale-105 transition-transform">
                  <Inbox className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Intake
                </span>
              </div>
              <h3 className="text-sm font-black text-[#060D1E] leading-tight">
                Receive Parcel
              </h3>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                Check in courier & slot
              </p>
            </button>

            {/* 2. Pending Handovers (clock/handover icon) */}
            <button
              onClick={onHandoverParcel}
              className="bg-white hover:bg-slate-50/80 p-4 rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex flex-col text-left transition-transform active:scale-95 group"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border-2 border-[#060D1E] shadow-[1.5px_1.5px_0px_#060D1E] flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
                  <Clock className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  {pendingHandovers.length} Due
                </span>
              </div>
              <h3 className="text-sm font-black text-[#060D1E] leading-tight">
                Pending Handovers
              </h3>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                OTP / QR verification
              </p>
            </button>

            {/* 3. Today's Parcels (calendar/package icon) */}
            <button
              onClick={onOpenParcelList}
              className="bg-white hover:bg-slate-50/80 p-4 rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex flex-col text-left transition-transform active:scale-95 group"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border-2 border-[#060D1E] shadow-[1.5px_1.5px_0px_#060D1E] flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                  <Package className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  {parcels.length} Total
                </span>
              </div>
              <h3 className="text-sm font-black text-[#060D1E] leading-tight">
                Today's Parcels
              </h3>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                Current inventory view
              </p>
            </button>

            {/* 4. Search Parcel (search icon) */}
            <button
              onClick={onSearchParcel || onOpenParcelList}
              className="bg-white hover:bg-slate-50/80 p-4 rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex flex-col text-left transition-transform active:scale-95 group"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 border-2 border-[#060D1E] shadow-[1.5px_1.5px_0px_#060D1E] flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
                  <Search className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-black text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-300">
                  Lookup
                </span>
              </div>
              <h3 className="text-sm font-black text-[#060D1E] leading-tight">
                Search Parcel
              </h3>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                Search ID or flat unit
              </p>
            </button>
          </div>
        </div>

        {/* "Today's Activity" Section */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#060D1E]">
                Today's Activity
              </h2>
              <p className="text-[10px] font-bold text-slate-500">Live parcel movements</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-black text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>

          {/* Activity Timeline */}
          {recentActivities.length === 0 ? (
            <div className="py-8 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2 stroke-[1.5]" />
              <p className="text-xs font-black text-slate-700">No activity today yet</p>
              <p className="text-[11px] font-bold text-slate-400 mt-0.5 max-w-[220px] mx-auto">
                Scan or check in packages to see the live intake & handover audit log.
              </p>
            </div>
          ) : (
            <div className="relative pl-4 space-y-3.5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
              {recentActivities.map((act) => (
                <div key={act.id} className="relative flex items-start justify-between gap-3 text-xs">
                  {/* Status Dot */}
                  <span
                    className={`absolute -left-4 top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-300 ${act.dotColor}`}
                  />

                  <div className="pl-1 flex-1">
                    <p className="font-extrabold text-[#060D1E] leading-snug">
                      {act.title}
                    </p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                      {act.subtitle}
                    </p>
                  </div>

                  <span className="text-[10px] font-black text-slate-400 whitespace-nowrap shrink-0">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hamburger Navigation Drawer Modal */}
      {showMenuDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-start">
          <div className="w-4/5 max-w-xs h-full bg-[#FEF9F3] text-[#060D1E] p-5 shadow-2xl flex flex-col justify-between border-r-2 border-[#060D1E] animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#1E60F2] border-2 border-[#060D1E] flex items-center justify-center text-white">
                    <Package className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#060D1E]">ParcelFlow</h3>
                    <p className="text-[10px] font-bold text-slate-500">Security Terminal</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowMenuDrawer(false)}
                  className="w-8 h-8 rounded-xl bg-white border-2 border-[#060D1E] flex items-center justify-center text-slate-600"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Society & User Info */}
              <div className="mt-4 p-3 bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#060D1E] text-white font-black text-sm flex items-center justify-center">
                    👮
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#060D1E]">
                      {currentUser?.name || 'Security Attendant'}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500">
                      {selectedSociety?.name || 'Riverview Residency'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Drawer Links */}
              <div className="mt-5 space-y-2 text-xs font-black">
                <button
                  onClick={() => {
                    setShowMenuDrawer(false);
                    handleScanAction();
                  }}
                  className="w-full p-3 bg-white hover:bg-slate-50 rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2.5">
                    <ScanLine className="w-4 h-4 text-[#1E60F2]" /> Scan Parcel
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => {
                    setShowMenuDrawer(false);
                    onReceiveParcel();
                  }}
                  className="w-full p-3 bg-white hover:bg-slate-50 rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2.5">
                    <Inbox className="w-4 h-4 text-emerald-600" /> Receive Parcel
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => {
                    setShowMenuDrawer(false);
                    onHandoverParcel();
                  }}
                  className="w-full p-3 bg-white hover:bg-slate-50 rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-600" /> Pending Handovers
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => {
                    setShowMenuDrawer(false);
                    onOpenParcelList();
                  }}
                  className="w-full p-3 bg-white hover:bg-slate-50 rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-purple-600" /> Hub Inventory
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Logout button */}
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setShowMenuDrawer(false);
                  logout();
                }}
                className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs rounded-xl border-2 border-rose-300 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#FEF9F3] text-[#060D1E] rounded-3xl border-2 border-[#060D1E] shadow-2xl p-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#1E60F2]" />
                <h3 className="text-sm font-black text-[#060D1E]">Shift Notifications</h3>
              </div>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {readyForPickupParcels.length > 0 ? (
                readyForPickupParcels.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-900"
                  >
                    <span className="font-black text-amber-950 block">Resident on the way:</span>
                    {p.recipientName} ({p.flat}) for {p.trackingNumber}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 font-semibold text-center py-4">
                  No unread alerts for your shift.
                </p>
              )}
            </div>

            <button
              onClick={() => setShowNotificationModal(false)}
              className="mt-4 w-full py-2.5 bg-[#060D1E] text-white font-black text-xs rounded-xl active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
