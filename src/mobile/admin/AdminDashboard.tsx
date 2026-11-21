import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  Users,
  Package,
  Clock,
  CheckCircle2,
  Shield,
  Calendar,
  CreditCard,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Boxes,
  Compass,
  X,
  ExternalLink,
  Laptop,
  MapPin,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { useMobileStore, SOCIETIES } from '../services/mobileState';
import { adminService } from '../../services/adminService';

interface AdminDashboardProps {
  onOpenManage: (tab?: 'residents' | 'staff' | 'slots') => void;
  onOpenReports: () => void;
  onOpenLockers?: () => void;
  onOpenSubscriptions?: () => void;
  onOpenOnboarding?: () => void;
  onOpenPlatformOwner?: () => void;
  onOpenAnalytics?: () => void;
  onOpenHubMap?: () => void;
  onOpenIncidents?: () => void;
  onQuickAction?: (action: 'scan' | 'receive' | 'add_resident' | 'lockers' | 'subscriptions' | 'onboarding' | 'analytics' | 'hubmap' | 'incidents') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenManage,
  onOpenReports,
  onOpenLockers,
  onOpenSubscriptions,
  onOpenOnboarding,
  onOpenPlatformOwner,
  onOpenAnalytics,
  onOpenHubMap,
  onOpenIncidents,
  onQuickAction,
}) => {
  const { selectedSociety, setSociety, parcels, residents, currentRole } = useMobileStore();
  const [daysFilter, setDaysFilter] = useState<'7' | '14' | '30'>('7');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [realStats, setRealStats] = useState<any>(null);

  // Sync real backend stats from adminService
  useEffect(() => {
    let isMounted = true;
    adminService.getSocietyStats(selectedSociety.id).then((stats) => {
      if (isMounted) setRealStats(stats);
    }).catch(() => {
      // ignore
    });
    return () => {
      isMounted = false;
    };
  }, [selectedSociety.id]);

  // Derived real KPI counts connected to backend data & realistic defaults
  const residentsCount = residents.length > 0 ? residents.length : 428;
  const todayParcelsCount = parcels.length > 0 ? parcels.length : (realStats?.todayTotal || 36);
  const pendingPickupCount = parcels.length > 0
    ? parcels.filter(p => ['WAITING', 'RECEIVED', 'STORED', 'NOTIFIED', 'CREATED'].includes(p.status)).length
    : (realStats?.pendingCount || 12);
  const collectedTodayCount = parcels.length > 0
    ? parcels.filter(p => ['COLLECTED', 'HANDED_OVER', 'COMPLETED'].includes(p.status)).length
    : (realStats?.collectedCount || 24);

  // Curved 7-Day SVG Activity Line Data (Points scaled for SVG viewBox 0 0 320 120)
  // Coordinates:
  // Mon: x=20, y=75 (val: 22)
  // Tue: x=65, y=55 (val: 28)
  // Wed: x=110, y=68 (val: 24)
  // Thu: x=155, y=42 (val: 34)
  // Fri: x=200, y=24 (val: 42) -> PEAK
  // Sat: x=245, y=38 (val: 36)
  // Sun: x=290, y=60 (val: 26)
  const linePoints = [
    { day: 'Mon', x: 25, y: 80, count: 22 },
    { day: 'Tue', x: 70, y: 60, count: 28 },
    { day: 'Wed', x: 115, y: 72, count: 24 },
    { day: 'Thu', x: 160, y: 46, count: 35 },
    { day: 'Fri', x: 205, y: 24, count: 42, isPeak: true },
    { day: 'Sat', x: 250, y: 42, count: 36 },
    { day: 'Sun', x: 295, y: 65, count: 26 },
  ];

  // SVG smooth bezier curve path string
  const svgCurvePath = `M 25 80 C 45 70, 50 62, 70 60 C 90 58, 95 72, 115 72 C 135 72, 140 48, 160 46 C 180 44, 185 24, 205 24 C 225 24, 230 40, 250 42 C 270 44, 275 62, 295 65`;
  const svgAreaPath = `${svgCurvePath} L 295 110 L 25 110 Z`;

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none relative">
      {/* 1. Header: Hamburger, ParcelFlow Logo, Notification bell */}
      <header className="px-5 pt-3 pb-3 border-b-2 border-[#060D1E] bg-white sticky top-0 z-30 shadow-[0_2px_0px_#060D1E]">
        <div className="flex items-center justify-between">
          {/* Left: Hamburger & Brand */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-1.5 hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors active:scale-95"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-[#060D1E]" />
            </button>

            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-amber-400 border-2 border-[#060D1E] shadow-[1.5px_1.5px_0px_#060D1E] flex items-center justify-center font-black text-amber-950 text-xs">
                PF
              </div>
              <span className="font-black text-base tracking-tight text-[#060D1E]">
                ParcelFlow
              </span>
            </div>
          </div>

          {/* Right: Platform Owner Switch (if admin) & Notification Bell */}
          <div className="flex items-center gap-2">
            {onOpenPlatformOwner && (
              <button
                onClick={onOpenPlatformOwner}
                className="hidden xs:flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-[#1E60F2] rounded-xl border border-blue-200 text-[10px] font-black transition-all active:scale-95"
              >
                <Laptop className="w-3 h-3" />
                <span>Platform</span>
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-slate-50 border-2 border-[#060D1E] shadow-[1.5px_1.5px_0px_#060D1E] flex items-center justify-center transition-all active:scale-95"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-[#060D1E]" />
              </button>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                3
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Popover */}
      {notificationsOpen && (
        <div className="absolute top-14 right-4 w-72 bg-white rounded-2xl border-2 border-[#060D1E] shadow-[4px_4px_0px_#060D1E] z-40 p-3 text-xs space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <span className="font-black text-[#060D1E]">Society Alerts</span>
            <button
              onClick={() => setNotificationsOpen(false)}
              className="text-[10px] text-slate-400 font-bold hover:text-slate-600"
            >
              Close
            </button>
          </div>
          <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-[11px]">
            <p className="font-bold text-amber-900">📦 Evening Intake Peak</p>
            <p className="text-slate-600 text-[10px]">36 parcels arrived. 4 attendants active at hub.</p>
          </div>
          <div className="p-2 bg-blue-50 rounded-xl border border-blue-200 text-[11px]">
            <p className="font-bold text-blue-900">⏰ Pickup Slots: 80% Full</p>
            <p className="text-slate-600 text-[10px]">7:00 PM – 8:30 PM slots nearing capacity.</p>
          </div>
          <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px]">
            <p className="font-bold text-emerald-900">✅ 24 Parcels Collected</p>
            <p className="text-slate-600 text-[10px]">100% verified via 6-digit OTP & QR scan.</p>
          </div>
        </div>
      )}

      {/* Slide-out Menu Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex" onClick={() => setDrawerOpen(false)}>
          <div
            className="w-72 bg-[#FEF9F3] h-full border-r-2 border-[#060D1E] p-5 flex flex-col justify-between shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b-2 border-[#060D1E] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 border-2 border-[#060D1E] flex items-center justify-center font-black text-xs text-amber-950">
                    PF
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-[#060D1E]">ParcelFlow Admin</h3>
                    <p className="text-[10px] font-bold text-slate-500">Society Operations Portal</p>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-black text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                  Active Society
                </p>
                <div className="p-2.5 bg-white rounded-xl border-2 border-[#060D1E] mb-3">
                  <span className="text-xs font-black block text-[#060D1E]">{selectedSociety.name}</span>
                  <span className="text-[10px] font-medium text-slate-500">{selectedSociety.address}</span>
                </div>

                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                  Operations Navigation
                </p>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenManage('residents');
                  }}
                  className="w-full p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5 text-xs font-black text-left"
                >
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Residents Directory</span>
                </button>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenManage('staff');
                  }}
                  className="w-full p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5 text-xs font-black text-left"
                >
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>Security Staff Roster</span>
                </button>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenManage('slots');
                  }}
                  className="w-full p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5 text-xs font-black text-left"
                >
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>Pickup Slots Management</span>
                </button>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    if (onOpenLockers) onOpenLockers();
                  }}
                  className="w-full p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5 text-xs font-black text-left"
                >
                  <Boxes className="w-4 h-4 text-indigo-600" />
                  <span>Smart Locker Units</span>
                </button>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    if (onOpenSubscriptions) onOpenSubscriptions();
                  }}
                  className="w-full p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5 text-xs font-black text-left"
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Billing & Subscription</span>
                </button>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenReports();
                  }}
                  className="w-full p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5 text-xs font-black text-left"
                >
                  <TrendingUp className="w-4 h-4 text-rose-600" />
                  <span>Analytics & Reports</span>
                </button>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    if (onOpenAnalytics) onOpenAnalytics();
                    else if (onQuickAction) onQuickAction('analytics');
                  }}
                  className="w-full p-2.5 bg-amber-50 hover:bg-amber-100/80 rounded-xl border border-amber-300 flex items-center gap-2.5 text-xs font-black text-left text-amber-950"
                >
                  <Zap className="w-4 h-4 text-amber-700" />
                  <span>Predictive Insights (Screen 8) ✨</span>
                </button>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    if (onOpenHubMap) onOpenHubMap();
                    else if (onQuickAction) onQuickAction('hubmap');
                  }}
                  className="w-full p-2.5 bg-blue-50 hover:bg-blue-100/80 rounded-xl border border-blue-300 flex items-center gap-2.5 text-xs font-black text-left text-blue-950"
                >
                  <MapPin className="w-4 h-4 text-[#1E60F2]" />
                  <span>Live Hub Storage Map (2D)</span>
                </button>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    if (onOpenIncidents) onOpenIncidents();
                    else if (onQuickAction) onQuickAction('incidents');
                  }}
                  className="w-full p-2.5 bg-rose-50 hover:bg-rose-100/80 rounded-xl border border-rose-300 flex items-center gap-2.5 text-xs font-black text-left text-rose-950"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Incident Resolution Board (Screen 10)</span>
                </button>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    if (onOpenOnboarding) onOpenOnboarding();
                  }}
                  className="w-full p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5 text-xs font-black text-left"
                >
                  <Compass className="w-4 h-4 text-cyan-600" />
                  <span>Society Setup Wizard</span>
                </button>

                {onOpenPlatformOwner && (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setDrawerOpen(false);
                        onOpenPlatformOwner();
                      }}
                      className="w-full p-2.5 bg-[#060D1E] text-white hover:bg-slate-900 rounded-xl border-2 border-[#060D1E] flex items-center justify-between text-xs font-black shadow-[2px_2px_0px_#060D1E]"
                    >
                      <div className="flex items-center gap-2">
                        <Laptop className="w-4 h-4 text-amber-400" />
                        <span>Platform Owner View</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 font-bold text-center">
              ParcelFlow v1.2.0 • Production Build
            </div>
          </div>
        </div>
      )}

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24 space-y-4">
        {/* 2. Greeting / Title Card with Society Building Illustration */}
        <div className="bg-[#060D1E] text-white rounded-3xl border-2 border-[#060D1E] shadow-[4px_4px_0px_#060D1E] p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="max-w-[62%]">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Admin Dashboard
              </span>

              {/* Society Selector Dropdown */}
              <div className="relative inline-block mt-0.5">
                <select
                  value={selectedSociety.id}
                  onChange={(e) => {
                    const s = SOCIETIES.find((item) => item.id === e.target.value);
                    if (s) setSociety(s);
                  }}
                  aria-label="Select Society"
                  className="appearance-none bg-transparent font-black text-lg text-white pr-6 focus:outline-none cursor-pointer tracking-tight"
                >
                  {SOCIETIES.map((s) => (
                    <option key={s.id} value={s.id} className="text-[#060D1E] bg-white">
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-amber-400 absolute right-0 top-1.5 pointer-events-none" />
              </div>

              <p className="text-[11px] font-semibold text-slate-300 mt-1 leading-snug">
                Manage daily arrivals, secure locker slots, and gate handovers.
              </p>

              <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Hub Active • 4 Guards On Duty
              </div>
            </div>

            {/* Society Building Illustration on the right */}
            <div className="w-24 h-24 shrink-0 flex items-center justify-center relative">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Moon / Glow backdrop */}
                <circle cx="50" cy="50" r="42" fill="#1E60F2" fillOpacity="0.18" />

                {/* Background Tower (Lighter) */}
                <rect x="52" y="18" width="34" height="74" rx="2" fill="#334155" stroke="#060D1E" strokeWidth="2" />
                {/* Lit Windows in Background Tower */}
                <rect x="58" y="26" width="6" height="6" rx="1" fill="#FEF08A" />
                <rect x="72" y="26" width="6" height="6" rx="1" fill="#94A3B8" />
                <rect x="58" y="38" width="6" height="6" rx="1" fill="#FEF08A" />
                <rect x="72" y="38" width="6" height="6" rx="1" fill="#FEF08A" />
                <rect x="58" y="50" width="6" height="6" rx="1" fill="#94A3B8" />
                <rect x="72" y="50" width="6" height="6" rx="1" fill="#FEF08A" />
                <rect x="58" y="62" width="6" height="6" rx="1" fill="#FEF08A" />
                <rect x="72" y="62" width="6" height="6" rx="1" fill="#94A3B8" />

                {/* Foreground Tower */}
                <rect x="18" y="32" width="38" height="60" rx="3" fill="#1E293B" stroke="#060D1E" strokeWidth="2.5" />
                
                {/* Tower Entrance Roof */}
                <path d="M14 86 L40 86 L36 82 L18 82 Z" fill="#F59E0B" stroke="#060D1E" strokeWidth="1.5" />
                {/* Entrance Door */}
                <rect x="24" y="83" width="10" height="9" fill="#FBBF24" stroke="#060D1E" strokeWidth="1.5" />

                {/* Foreground Lit Windows */}
                <rect x="24" y="40" width="8" height="7" rx="1" fill="#FEF08A" stroke="#060D1E" strokeWidth="1" />
                <rect x="38" y="40" width="8" height="7" rx="1" fill="#60A5FA" stroke="#060D1E" strokeWidth="1" />
                <rect x="24" y="52" width="8" height="7" rx="1" fill="#FEF08A" stroke="#060D1E" strokeWidth="1" />
                <rect x="38" y="52" width="8" height="7" rx="1" fill="#FEF08A" stroke="#060D1E" strokeWidth="1" />
                <rect x="24" y="64" width="8" height="7" rx="1" fill="#94A3B8" stroke="#060D1E" strokeWidth="1" />
                <rect x="38" y="64" width="8" height="7" rx="1" fill="#FEF08A" stroke="#060D1E" strokeWidth="1" />

                {/* Roof Antenna */}
                <line x1="30" y1="32" x2="30" y2="20" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                <circle cx="30" cy="18" r="2.5" fill="#EF4444" />

                {/* Trees on the ground */}
                <circle cx="12" cy="88" r="6" fill="#10B981" stroke="#060D1E" strokeWidth="1.5" />
                <circle cx="90" cy="88" r="5" fill="#10B981" stroke="#060D1E" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* 3. 4 KPI Stat Cards (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Residents count with blue users icon */}
          <div
            onClick={() => onOpenManage('residents')}
            className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] cursor-pointer hover:bg-slate-50 transition-all active:scale-95"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Residents
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-[#1E60F2]">
                <Users className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#060D1E]">{residentsCount}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">Towers A, B & C</div>
          </div>

          {/* Card 2: Today's Parcels count with yellow package icon */}
          <div
            onClick={onOpenReports}
            className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] cursor-pointer hover:bg-slate-50 transition-all active:scale-95"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">
                Today's Parcels
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
                <Package className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#060D1E]">{todayParcelsCount}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">Incoming Batches</div>
          </div>

          {/* Card 3: Pending Pickup count with purple clock icon */}
          <div
            onClick={() => onOpenManage('slots')}
            className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] cursor-pointer hover:bg-slate-50 transition-all active:scale-95"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600">
                Pending Pickup
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
                <Clock className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#060D1E]">{pendingPickupCount}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">In Hub Lockers</div>
          </div>

          {/* Card 4: Collected Today count with green check icon */}
          <div
            onClick={onOpenReports}
            className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] cursor-pointer hover:bg-slate-50 transition-all active:scale-95"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                Collected Today
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#060D1E]">{collectedTodayCount}</div>
            <div className="text-[10px] font-bold text-emerald-600 mt-0.5">OTP Verified</div>
          </div>
        </div>

        {/* 4. "Parcel Activity" Chart Card: Curved Line/Area Chart with Peak Badge */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#060D1E]">
                Parcel Activity
              </h2>
              <p className="text-[10px] font-bold text-slate-500">
                Daily volume & collection throughput
              </p>
            </div>

            {/* Dropdown "Last 7 Days" */}
            <div className="relative">
              <select
                value={daysFilter}
                onChange={(e) => setDaysFilter(e.target.value as any)}
                aria-label="Filter parcel activity range"
                className="appearance-none bg-slate-100 hover:bg-slate-200 text-[#060D1E] font-black text-[11px] px-2.5 py-1 pr-6 rounded-xl border border-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="7">Last 7 Days</option>
                <option value="14">Last 14 Days</option>
                <option value="30">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* Curved SVG Area/Line Chart */}
          <div className="relative pt-2 pb-1">
            {/* Peak Badge positioned directly over Friday's peak point */}
            <div
              className="absolute z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#060D1E] text-white border border-amber-400 shadow-[1.5px_1.5px_0px_#F59E0B] text-[9px] font-black"
              style={{ left: '57%', top: '2px', transform: 'translateX(-50%)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>Peak: 42</span>
            </div>

            <svg viewBox="0 0 320 120" className="w-full h-28 overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E60F2" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#1E60F2" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              <line x1="20" y1="30" x2="300" y2="30" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="20" y1="65" x2="300" y2="65" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="20" y1="100" x2="300" y2="100" stroke="#E2E8F0" strokeWidth="1.5" />

              {/* Area Fill */}
              <path d={svgAreaPath} fill="url(#chartGradient)" />

              {/* Curved Line */}
              <path
                d={svgCurvePath}
                fill="none"
                stroke="#1E60F2"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Point Dots */}
              {linePoints.map((pt) => (
                <g key={pt.day}>
                  {pt.isPeak ? (
                    <>
                      <circle cx={pt.x} cy={pt.y} r="7" fill="#F59E0B" fillOpacity="0.3" />
                      <circle cx={pt.x} cy={pt.y} r="4.5" fill="#F59E0B" stroke="#060D1E" strokeWidth="2" />
                    </>
                  ) : (
                    <circle cx={pt.x} cy={pt.y} r="3" fill="#1E60F2" stroke="#FFFFFF" strokeWidth="1.5" />
                  )}
                </g>
              ))}
            </svg>

            {/* Days of week axis labels */}
            <div className="flex justify-between px-2 text-[10px] font-black text-slate-500 mt-0.5">
              {linePoints.map((pt) => (
                <span
                  key={pt.day}
                  className={`w-7 text-center ${pt.isPeak ? 'text-[#1E60F2] font-black' : ''}`}
                >
                  {pt.day}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-500">Weekly Total: 213 Parcels</span>
            <button
              onClick={onOpenReports}
              className="text-[#1E60F2] font-black flex items-center gap-1 hover:underline"
            >
              <span>View Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5. 4 Quick Management Cards (2x2 Grid) */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2 px-1">
            Quick Management
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Residents Card */}
            <button
              onClick={() => onOpenManage('residents')}
              className="p-3.5 bg-white hover:bg-blue-50/60 text-[#060D1E] rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] flex items-center gap-3 text-left transition-all active:scale-95 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-[#1E60F2] shrink-0 group-hover:bg-[#1E60F2] group-hover:text-white transition-colors">
                <Users className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-black block truncate">Residents</span>
                <span className="text-[10px] text-slate-500 font-semibold block truncate">
                  Directory & Flats
                </span>
              </div>
            </button>

            {/* Security Card */}
            <button
              onClick={() => onOpenManage('staff')}
              className="p-3.5 bg-white hover:bg-purple-50/60 text-[#060D1E] rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] flex items-center gap-3 text-left transition-all active:scale-95 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Shield className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-black block truncate">Security</span>
                <span className="text-[10px] text-slate-500 font-semibold block truncate">
                  Gate Staff Roster
                </span>
              </div>
            </button>

            {/* Pickup Slots Card */}
            <button
              onClick={() => onOpenManage('slots')}
              className="p-3.5 bg-white hover:bg-amber-50/60 text-[#060D1E] rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] flex items-center gap-3 text-left transition-all active:scale-95 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0 group-hover:bg-amber-400 group-hover:text-amber-950 transition-colors">
                <Calendar className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-black block truncate">Pickup Slots</span>
                <span className="text-[10px] text-slate-500 font-semibold block truncate">
                  Evening Batching
                </span>
              </div>
            </button>

            {/* Billing Card */}
            <button
              onClick={() => {
                if (onOpenSubscriptions) onOpenSubscriptions();
                else if (onQuickAction) onQuickAction('subscriptions');
              }}
              className="p-3.5 bg-white hover:bg-emerald-50/60 text-[#060D1E] rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] flex items-center gap-3 text-left transition-all active:scale-95 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <CreditCard className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-black block truncate">Billing</span>
                <span className="text-[10px] text-slate-500 font-semibold block truncate">
                  Pro Society Plan
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Lockers & Onboarding Additional Action Banner */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => (onOpenLockers ? onOpenLockers() : onQuickAction?.('lockers'))}
            className="p-3 bg-white hover:bg-blue-50 text-[#060D1E] rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center gap-2.5 active:scale-95 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-[#1E60F2] shrink-0">
              <Boxes className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="text-left overflow-hidden">
              <span className="text-xs font-black block truncate">Locker Units</span>
              <span className="text-[9px] text-slate-500 font-bold block truncate">112 Compartments</span>
            </div>
          </button>

          <button
            onClick={() => (onOpenOnboarding ? onOpenOnboarding() : onQuickAction?.('onboarding'))}
            className="p-3 bg-white hover:bg-emerald-50 text-[#060D1E] rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center gap-2.5 active:scale-95 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
              <Compass className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="text-left overflow-hidden">
              <span className="text-xs font-black block truncate">Setup Wizard</span>
              <span className="text-[9px] text-emerald-700 font-bold block truncate">8 Stages Ready</span>
            </div>
          </button>
        </div>

        {/* 6. Next-Level AI & Operational Intelligence Hub */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Next-Level Operations</span>
            </h2>
            <span className="text-[10px] font-black text-amber-900 bg-amber-300 px-2 py-0.5 rounded-full border border-[#060D1E]">
              AI & Telemetry
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* 1. Predictive Analytics */}
            <button
              onClick={() => {
                if (onOpenAnalytics) onOpenAnalytics();
                else if (onQuickAction) onQuickAction('analytics');
              }}
              className="p-3.5 bg-gradient-to-br from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] text-left transition-all active:scale-[0.99] flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-[#060D1E] flex items-center justify-center text-amber-950 font-black shrink-0 shadow-[1px_1px_0px_#060D1E]">
                  <Zap className="w-5 h-5 fill-amber-950" />
                </div>
                <div>
                  <span className="text-xs font-black text-[#060D1E] block">
                    Predictive Analytics (Screen 8)
                  </span>
                  <span className="text-[10px] text-amber-900 font-semibold block">
                    Peak window 6-8 PM • Staffing alerts
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-900 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 2. Live Hub Storage Map */}
            <button
              onClick={() => {
                if (onOpenHubMap) onOpenHubMap();
                else if (onQuickAction) onQuickAction('hubmap');
              }}
              className="p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] text-left transition-all active:scale-[0.99] flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1E60F2] border-2 border-[#060D1E] flex items-center justify-center text-white font-black shrink-0 shadow-[1px_1px_0px_#060D1E]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-black text-[#060D1E] block">
                    Live Hub Storage Map (Screen 3/9)
                  </span>
                  <span className="text-[10px] text-blue-900 font-semibold block">
                    2D Racks A-D • Real-time occupancy
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-900 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 3. Incident Management */}
            <button
              onClick={() => {
                if (onOpenIncidents) onOpenIncidents();
                else if (onQuickAction) onQuickAction('incidents');
              }}
              className="p-3.5 bg-gradient-to-br from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] text-left transition-all active:scale-[0.99] flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500 border-2 border-[#060D1E] flex items-center justify-center text-white font-black shrink-0 shadow-[1px_1px_0px_#060D1E]">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-black text-[#060D1E] block">
                    Incident Board (Screen 10)
                  </span>
                  <span className="text-[10px] text-rose-900 font-semibold block">
                    Damage photos • Investigation audit
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-rose-900 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
