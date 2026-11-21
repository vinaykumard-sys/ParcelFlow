import React, { useState, useEffect } from 'react';
import {
  Building,
  Home,
  Boxes,
  Clock,
  Bell,
  Shield,
  CreditCard,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Crown,
  KeyRound,
  CheckCircle2,
  LogOut,
  UploadCloud,
  Check,
  RotateCw,
  ExternalLink,
  Sliders,
  Smartphone,
  Save,
} from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import { adminService } from '../../services/adminService';
import { subscriptionService } from '../../services/subscriptionService';

interface AdminSettingsTabProps {
  onLogout: () => void;
  onOpenSubscriptions?: () => void;
  onOpenOnboarding?: () => void;
  onOpenLockers?: () => void;
  onOpenReleases?: () => void;
  onOpenManage?: (sub?: 'residents' | 'staff' | 'slots') => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  onLogout,
  onOpenSubscriptions,
  onOpenOnboarding,
  onOpenLockers,
  onOpenReleases,
  onOpenManage,
}) => {
  const { selectedSociety, currentUser, currentRole, residents, staff, slots, logout } = useMobileStore();
  const isPlatformOwner = currentRole === 'SUPER_ADMIN';

  // State for expandable sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    society: true,
    property: true,
    parcelHub: false,
    pickup: false,
    notifications: false,
    security: false,
    billing: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Form & Preference states
  const [societyName, setSocietyName] = useState(selectedSociety.name);
  const [societyAddress, setSocietyAddress] = useState(selectedSociety.address);
  const [societyCity, setSocietyCity] = useState(selectedSociety.city);
  const [joinCode, setJoinCode] = useState(
    `${selectedSociety.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)}-JOIN`
  );

  // Notification Preferences
  const [pushEnabled, setPushEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [smsFallback, setSmsFallback] = useState(false);
  const [dailyDigest, setDailyDigest] = useState(true);

  // Parcel Hub & Pickup Preferences
  const [hubName, setHubName] = useState('Main Gate Central Smart Hub');
  const [expressLane, setExpressLane] = useState(true);
  const [operatingHours, setOperatingHours] = useState('09:00 AM – 10:00 PM');
  const [slotDuration, setSlotDuration] = useState('30 Minutes');
  const [slotCapacity, setSlotCapacity] = useState('25');

  // Security Policy
  const [otpExpiry, setOtpExpiry] = useState('15 Minutes');
  const [cctvCorrelation, setCctvCorrelation] = useState(true);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRotateCode = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCode = `${selectedSociety.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3)}-${randomSuffix}`;
    setJoinCode(newCode);
    showToast(`Resident Join Code refreshed to: ${newCode}`);
  };

  const handleSaveSocietyInfo = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Society information updated successfully!');
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Top Header */}
      <div className="px-5 pt-3 pb-3 border-b-2 border-[#060D1E] bg-white sticky top-0 z-20 shadow-[0_2px_0px_#060D1E]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-black text-[#060D1E] tracking-tight leading-tight">
              Admin Settings
            </h1>
            <p className="text-[10px] font-bold text-slate-500">
              {selectedSociety.name} Configuration
            </p>
          </div>
          <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-amber-100 text-amber-900 rounded-xl border border-amber-300">
            Admin Access
          </span>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="mx-5 mt-3 p-3 bg-emerald-50 border-2 border-emerald-500 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_#060D1E]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24 space-y-3.5">
        {/* Admin Identity Card */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center font-black text-amber-950 shrink-0">
            <Crown className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-black text-[#060D1E] truncate">{selectedSociety.name}</h2>
            <p className="text-[11px] font-bold text-slate-500 truncate">
              {currentUser?.email || 'admin@riverview.residency'}
            </p>
            <span className="inline-block mt-0.5 text-[9px] font-black uppercase text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
              Society Administrator
            </span>
          </div>
        </div>

        {/* Platform Owner Releases Quick Link */}
        {isPlatformOwner && (
          <div
            onClick={onOpenReleases}
            className="bg-blue-50 hover:bg-blue-100/70 rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-3.5 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1E60F2] border-2 border-[#060D1E] shadow-[1.5px_1.5px_0px_#060D1E] flex items-center justify-center text-white shrink-0">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black text-[#060D1E]">APK Releases & FCM Push</h3>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-400">
                    Super Admin
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-blue-900/80">
                  Broadcast app updates to resident & staff devices
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#1E60F2]" />
          </div>
        )}

        {/* ===================================================================== */}
        {/* SECTION 1: SOCIETY (info, name, address)                              */}
        {/* ===================================================================== */}
        <div className="bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] overflow-hidden">
          <button
            onClick={() => toggleSection('society')}
            className="w-full p-3.5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-[#1E60F2]">
                <Building className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#060D1E]">
                  SOCIETY
                </h3>
                <p className="text-[10px] font-semibold text-slate-500">
                  Information, name & postal address
                </p>
              </div>
            </div>
            {expandedSections.society ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSections.society && (
            <div className="p-4 pt-1 border-t border-slate-100 space-y-3 text-xs">
              <form onSubmit={handleSaveSocietyInfo} className="space-y-2.5">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    Society Name
                  </label>
                  <input
                    type="text"
                    value={societyName}
                    onChange={(e) => setSocietyName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FEF9F3] border-2 border-[#060D1E] rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={societyAddress}
                    onChange={(e) => setSocietyAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FEF9F3] border-2 border-[#060D1E] rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={societyCity}
                      onChange={(e) => setSocietyCity(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FEF9F3] border-2 border-[#060D1E] rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      defaultValue="560092"
                      className="w-full px-3 py-2 bg-[#FEF9F3] border-2 border-[#060D1E] rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#060D1E] text-white font-black text-xs rounded-xl border border-[#060D1E] hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Society Info</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* SECTION 2: PROPERTY (towers, blocks, flats)                           */}
        {/* ===================================================================== */}
        <div className="bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] overflow-hidden">
          <button
            onClick={() => toggleSection('property')}
            className="w-full p-3.5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
                <Home className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#060D1E]">
                  PROPERTY
                </h3>
                <p className="text-[10px] font-semibold text-slate-500">
                  Towers, blocks & flat directory
                </p>
              </div>
            </div>
            {expandedSections.property ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSections.property && (
            <div className="p-4 pt-1 border-t border-slate-100 space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">Towers</span>
                  <span className="text-base font-black text-[#060D1E]">3 (A, B, C)</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">Flats</span>
                  <span className="text-base font-black text-[#060D1E]">428</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">Occupancy</span>
                  <span className="text-base font-black text-emerald-600">92%</span>
                </div>
              </div>

              {/* Resident Join Code Card */}
              <div className="p-3 bg-[#FEF9F3] rounded-2xl border-2 border-[#060D1E] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-600 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-[#1E60F2]" />
                    Resident Join Code
                  </span>
                  <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-base tracking-widest text-[#1E60F2]">
                    {joinCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleRotateCode}
                    className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-[10px] font-black rounded-xl active:scale-95 text-[#060D1E] flex items-center gap-1"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Rotate</span>
                  </button>
                </div>
                <p className="text-[9px] text-slate-500 font-medium">
                  Residents use this code to join {selectedSociety.name} during signup.
                </p>
              </div>

              {onOpenManage && (
                <button
                  type="button"
                  onClick={() => onOpenManage('residents')}
                  className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-[#1E60F2] font-black text-xs rounded-xl border border-blue-200 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Manage Resident Roster</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* SECTION 3: PARCEL HUB (hub name, lockers, storage capacity)          */}
        {/* ===================================================================== */}
        <div className="bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] overflow-hidden">
          <button
            onClick={() => toggleSection('parcelHub')}
            className="w-full p-3.5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800">
                <Boxes className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#060D1E]">
                  PARCEL HUB
                </h3>
                <p className="text-[10px] font-semibold text-slate-500">
                  Hub name, smart lockers & storage capacity
                </p>
              </div>
            </div>
            {expandedSections.parcelHub ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSections.parcelHub && (
            <div className="p-4 pt-1 border-t border-slate-100 space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                  Hub Kiosk Name
                </label>
                <input
                  type="text"
                  value={hubName}
                  onChange={(e) => setHubName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FEF9F3] border-2 border-[#060D1E] rounded-xl font-bold text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">Total Lockers</span>
                  <span className="text-base font-black text-[#060D1E]">112 Units</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">Capacity Occupied</span>
                  <span className="text-base font-black text-amber-600">33 / 112 (29%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-black text-xs text-[#060D1E] block">Express Courier Lane</span>
                  <span className="text-[10px] text-slate-500 font-medium">Quick 1-tap scan for Amazon/Flipkart</span>
                </div>
                <input
                  type="checkbox"
                  checked={expressLane}
                  onChange={(e) => {
                    setExpressLane(e.target.checked);
                    showToast(`Express Delivery Lane ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                  }}
                  className="w-5 h-5 accent-[#1E60F2] cursor-pointer"
                />
              </div>

              {onOpenLockers && (
                <button
                  type="button"
                  onClick={onOpenLockers}
                  className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-xs rounded-xl border border-amber-300 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Open Locker Unit Visualizer</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* SECTION 4: PICKUP (operating hours, slot duration, capacity)          */}
        {/* ===================================================================== */}
        <div className="bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] overflow-hidden">
          <button
            onClick={() => toggleSection('pickup')}
            className="w-full p-3.5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <Clock className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#060D1E]">
                  PICKUP
                </h3>
                <p className="text-[10px] font-semibold text-slate-500">
                  Operating hours, slot duration & max capacity
                </p>
              </div>
            </div>
            {expandedSections.pickup ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSections.pickup && (
            <div className="p-4 pt-1 border-t border-slate-100 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FEF9F3] border-2 border-[#060D1E] rounded-xl font-bold text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    Slot Duration
                  </label>
                  <input
                    type="text"
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FEF9F3] border-2 border-[#060D1E] rounded-xl font-bold text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                  Default Capacity Per Slot (Max Parcels)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={slotCapacity}
                    onChange={(e) => setSlotCapacity(e.target.value)}
                    className="w-24 px-3 py-2 bg-[#FEF9F3] border-2 border-[#060D1E] rounded-xl font-bold text-xs focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 font-bold">packages per 30-min window</span>
                </div>
              </div>

              {onOpenManage && (
                <button
                  type="button"
                  onClick={() => onOpenManage('slots')}
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-black text-xs rounded-xl border border-emerald-300 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Configure Live Pickup Slots & Blackouts</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* SECTION 5: NOTIFICATIONS (preferences)                                */}
        {/* ===================================================================== */}
        <div className="bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] overflow-hidden">
          <button
            onClick={() => toggleSection('notifications')}
            className="w-full p-3.5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-[#1E60F2]">
                <Bell className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#060D1E]">
                  NOTIFICATIONS
                </h3>
                <p className="text-[10px] font-semibold text-slate-500">
                  In-App push, WhatsApp & SMS alerts
                </p>
              </div>
            </div>
            {expandedSections.notifications ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSections.notifications && (
            <div className="p-4 pt-1 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1">
                <div>
                  <span className="font-bold text-slate-800 block">Instant In-App Arrival Push</span>
                  <span className="text-[10px] text-slate-500">Alert residents when parcel enters hub</span>
                </div>
                <input
                  type="checkbox"
                  checked={pushEnabled}
                  onChange={(e) => {
                    setPushEnabled(e.target.checked);
                    showToast(`In-App Push ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                  }}
                  className="w-5 h-5 accent-[#1E60F2] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-1 border-t border-slate-100">
                <div>
                  <span className="font-bold text-slate-800 block">WhatsApp Pickup Alerts</span>
                  <span className="text-[10px] text-slate-500">Sends 6-digit OTP & QR directly to WhatsApp</span>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappEnabled}
                  onChange={(e) => {
                    setWhatsappEnabled(e.target.checked);
                    showToast(`WhatsApp Alerts ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                  }}
                  className="w-5 h-5 accent-[#1E60F2] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-1 border-t border-slate-100">
                <div>
                  <span className="font-bold text-slate-800 block">SMS Fallback Delivery</span>
                  <span className="text-[10px] text-slate-500">Sends SMS when mobile data is disconnected</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsFallback}
                  onChange={(e) => {
                    setSmsFallback(e.target.checked);
                    showToast(`SMS Fallback ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                  }}
                  className="w-5 h-5 accent-[#1E60F2] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-1 border-t border-slate-100">
                <div>
                  <span className="font-bold text-slate-800 block">Daily Admin Digest (9:00 PM)</span>
                  <span className="text-[10px] text-slate-500">Summary of uncollected parcels & occupancy</span>
                </div>
                <input
                  type="checkbox"
                  checked={dailyDigest}
                  onChange={(e) => {
                    setDailyDigest(e.target.checked);
                    showToast(`Daily Admin Digest ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                  }}
                  className="w-5 h-5 accent-[#1E60F2] cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* SECTION 6: SECURITY (staff config)                                    */}
        {/* ===================================================================== */}
        <div className="bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] overflow-hidden">
          <button
            onClick={() => toggleSection('security')}
            className="w-full p-3.5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
                <Shield className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#060D1E]">
                  SECURITY
                </h3>
                <p className="text-[10px] font-semibold text-slate-500">
                  Staff roster, OTP length & handover policy
                </p>
              </div>
            </div>
            {expandedSections.security ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSections.security && (
            <div className="p-4 pt-1 border-t border-slate-100 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">Security Staff</span>
                  <span className="text-base font-black text-[#060D1E]">4 On Duty</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">Verification</span>
                  <span className="text-base font-black text-emerald-600">6-Digit OTP / QR</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                  QR / OTP Expiration Window
                </label>
                <select
                  value={otpExpiry}
                  onChange={(e) => setOtpExpiry(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FEF9F3] border-2 border-[#060D1E] rounded-xl font-bold text-xs focus:outline-none"
                >
                  <option value="10 Minutes">10 Minutes</option>
                  <option value="15 Minutes">15 Minutes (Recommended)</option>
                  <option value="30 Minutes">30 Minutes</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-black text-xs text-[#060D1E] block">CCTV Audit Correlation</span>
                  <span className="text-[10px] text-slate-500 font-medium">Link camera footage timestamp with scan</span>
                </div>
                <input
                  type="checkbox"
                  checked={cctvCorrelation}
                  onChange={(e) => {
                    setCctvCorrelation(e.target.checked);
                    showToast(`CCTV Audit Correlation ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                  }}
                  className="w-5 h-5 accent-[#1E60F2] cursor-pointer"
                />
              </div>

              {onOpenManage && (
                <button
                  type="button"
                  onClick={() => onOpenManage('staff')}
                  className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 font-black text-xs rounded-xl border border-purple-300 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Manage Gate Security Staff & Shifts</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* SECTION 7: BILLING (subscription plan)                                */}
        {/* ===================================================================== */}
        <div className="bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] overflow-hidden">
          <button
            onClick={() => toggleSection('billing')}
            className="w-full p-3.5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800">
                <CreditCard className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#060D1E]">
                  BILLING
                </h3>
                <p className="text-[10px] font-semibold text-slate-500">
                  Subscription plan & renewal schedule
                </p>
              </div>
            </div>
            {expandedSections.billing ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSections.billing && (
            <div className="p-4 pt-1 border-t border-slate-100 space-y-3 text-xs">
              <div className="p-3 bg-amber-50 rounded-2xl border-2 border-[#060D1E] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xs text-[#060D1E]">Pro Society</span>
                    <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full border border-emerald-300">
                      Active
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-600 font-bold block mt-0.5">
                    ₹4,999 / month • Next billing: Dec 21, 2026
                  </span>
                </div>
                <div className="w-7 h-7 rounded-xl bg-amber-400 border border-[#060D1E] flex items-center justify-center font-black text-amber-950">
                  <Crown className="w-4 h-4" />
                </div>
              </div>

              {onOpenSubscriptions && (
                <button
                  type="button"
                  onClick={onOpenSubscriptions}
                  className="w-full py-2 bg-[#1E60F2] hover:bg-blue-600 text-white font-black text-xs rounded-xl border border-blue-600 flex items-center justify-center gap-1.5 transition-all shadow-[1.5px_1.5px_0px_#060D1E] active:scale-95"
                >
                  <span>Manage Subscription & Invoices</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs rounded-2xl border-2 border-rose-300 flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-[2px_2px_0px_rgba(244,63,94,0.3)]"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Admin Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
