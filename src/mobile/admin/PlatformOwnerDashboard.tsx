import React, { useState, useEffect } from 'react';
import {
  Building,
  Users,
  IndianRupee,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Settings,
  Bell,
  Menu,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Boxes,
  Radio,
  ExternalLink,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { useMobileStore, SOCIETIES } from '../services/mobileState';
import { subscriptionService, SUBSCRIPTION_PLANS } from '../../services/subscriptionService';
import { adminService } from '../../services/adminService';

interface PlatformOwnerDashboardProps {
  onBackToSocietyView?: () => void;
  onOpenSubscriptions?: () => void;
  onOpenReleases?: () => void;
  onOpenSettings?: () => void;
  onSelectSociety?: (socId: string) => void;
}

export const PlatformOwnerDashboard: React.FC<PlatformOwnerDashboardProps> = ({
  onBackToSocietyView,
  onOpenSubscriptions,
  onOpenReleases,
  onOpenSettings,
  onSelectSociety,
}) => {
  const { setSociety, selectedSociety } = useMobileStore();
  const [selectedRange, setSelectedRange] = useState<'30' | '90' | '365'>('30');
  const [activeModal, setActiveModal] = useState<'societies' | 'subscriptions' | 'payments' | 'settings' | null>(null);

  // Growth Bar Data for 30 Days (4 weeks) / 90 Days / 365 Days
  const growthData = [
    { label: 'W1', value: 3, height: '45%' },
    { label: 'W2', value: 5, height: '70%' },
    { label: 'W3', value: 4, height: '58%' },
    { label: 'W4', value: 6, height: '88%' },
    { label: 'W5', value: 8, height: '100%' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Top Navigation Header */}
      <div className="px-5 pt-3 pb-3 border-b-2 border-[#060D1E] bg-white sticky top-0 z-20 shadow-[0_2px_0px_#060D1E]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBackToSocietyView}
              className="p-1.5 hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors"
              title="Return to Society View"
            >
              <Menu className="w-4 h-4 text-[#060D1E]" />
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#1E60F2] border-2 border-[#060D1E] shadow-[1.5px_1.5px_0px_#060D1E] flex items-center justify-center text-white font-black text-xs">
                PF
              </div>
              <div>
                <span className="font-black text-sm tracking-tight block leading-none">ParcelFlow</span>
                <span className="text-[9px] font-black uppercase text-[#1E60F2]">Platform Owner</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBackToSocietyView && (
              <button
                onClick={onBackToSocietyView}
                className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-[10px] rounded-xl border-2 border-[#060D1E] shadow-[1.5px_1.5px_0px_#060D1E] transition-all active:scale-95"
              >
                Society View
              </button>
            )}
            <div className="relative">
              <button className="w-8 h-8 rounded-xl bg-white hover:bg-slate-50 border-2 border-[#060D1E] shadow-[1.5px_1.5px_0px_#060D1E] flex items-center justify-center">
                <Bell className="w-4 h-4 text-[#060D1E]" />
              </button>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border border-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24 space-y-4">
        {/* Title Card with Laptop Admin Illustration */}
        <div className="bg-[#060D1E] text-white rounded-3xl border-2 border-[#060D1E] shadow-[4px_4px_0px_#060D1E] p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="max-w-[62%]">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                ParcelFlow Admin
              </span>
              <h1 className="text-xl font-black tracking-tight leading-tight mb-1">
                Platform Overview
              </h1>
              <p className="text-[11px] font-semibold text-slate-300 leading-snug">
                Unified telemetry across all registered gated communities & hubs.
              </p>
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Production Cluster Online
              </div>
            </div>

            {/* Laptop Admin Illustration */}
            <div className="w-24 h-24 shrink-0 flex items-center justify-center relative">
              <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
                {/* Glow Backdrop */}
                <circle cx="60" cy="60" r="50" fill="#1E60F2" fillOpacity="0.15" />
                
                {/* Laptop Base */}
                <path
                  d="M15 88 L105 88 C108 88 110 90 108 93 L100 97 C98 98 96 98 94 98 L26 98 C24 98 22 98 20 97 L12 93 C10 90 12 88 15 88 Z"
                  fill="#94A3B8"
                  stroke="#060D1E"
                  strokeWidth="2.5"
                />
                {/* Trackpad */}
                <rect x="52" y="90" width="16" height="5" rx="1.5" fill="#CBD5E1" stroke="#060D1E" strokeWidth="1" />

                {/* Laptop Screen Outer */}
                <rect
                  x="24"
                  y="28"
                  width="72"
                  height="58"
                  rx="4"
                  fill="#1E293B"
                  stroke="#060D1E"
                  strokeWidth="2.5"
                />
                {/* Screen Display */}
                <rect x="28" y="32" width="64" height="50" rx="2" fill="#0F172A" />

                {/* Dashboard Header Bar in Laptop */}
                <rect x="30" y="34" width="60" height="7" rx="1" fill="#1E60F2" />
                <circle cx="34" cy="37.5" r="1.5" fill="#FEF08A" />
                <circle cx="39" cy="37.5" r="1.5" fill="#86EFAC" />
                <circle cx="44" cy="37.5" r="1.5" fill="#FCA5A5" />

                {/* Mini Chart Bars on Screen */}
                <rect x="33" y="58" width="5" height="18" rx="1" fill="#38BDF8" />
                <rect x="42" y="50" width="5" height="26" rx="1" fill="#818CF8" />
                <rect x="51" y="44" width="5" height="32" rx="1" fill="#F59E0B" />
                <rect x="60" y="54" width="5" height="22" rx="1" fill="#10B981" />
                <rect x="69" y="46" width="5" height="30" rx="1" fill="#EC4899" />
                <rect x="78" y="40" width="5" height="36" rx="1" fill="#60A5FA" />

                {/* Line trend overlay */}
                <polyline
                  points="35,56 44,48 53,42 62,52 71,44 80,38"
                  fill="none"
                  stroke="#FBBF24"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Floating Notification Coin */}
                <circle cx="95" cy="24" r="12" fill="#F59E0B" stroke="#060D1E" strokeWidth="2" />
                <text x="95" y="28" textAnchor="middle" fill="#060D1E" fontSize="10" fontWeight="900">₹</text>
              </svg>
            </div>
          </div>
        </div>

        {/* 4 KPI Cards (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Societies Card */}
          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Societies
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-[#1E60F2]">
                <Building className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#060D1E]">{SOCIETIES.length || 18}</div>
            <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              <span>+2 this month</span>
            </div>
          </div>

          {/* Residents Card */}
          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Residents
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700">
                <Users className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#060D1E]">4,820</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">Active across hubs</div>
          </div>

          {/* MRR Card */}
          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                MRR
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
                <IndianRupee className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#060D1E]">₹2,84,500</div>
            <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3 stroke-[2.5]" />
              <span>+14.8% growth</span>
            </div>
          </div>

          {/* Uptime Card */}
          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Uptime
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#060D1E]">98.7%</div>
            <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>All Systems Normal</span>
            </div>
          </div>
        </div>

        {/* Society Growth Bar Chart Card */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#060D1E]">
                Society Growth
              </h2>
              <p className="text-[10px] font-bold text-slate-500">
                New societies onboarded per week
              </p>
            </div>
            <div className="relative">
              <select
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value as any)}
                aria-label="Filter society growth time range"
                className="appearance-none bg-slate-100 hover:bg-slate-200 text-[#060D1E] font-black text-[11px] px-2.5 py-1 pr-6 rounded-xl border border-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">This Year</option>
              </select>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-32 flex items-end justify-between gap-3 pt-4 pb-1 border-b border-slate-100">
            {growthData.map((bar, i) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className="text-[9px] font-black text-slate-600 mb-1 opacity-80 group-hover:opacity-100 group-hover:text-[#1E60F2]">
                  +{bar.value}
                </span>
                <div
                  className={`w-full rounded-t-xl transition-all border-2 border-[#060D1E] group-hover:scale-y-105 shadow-[1.5px_0px_0px_#060D1E] ${
                    i === growthData.length - 1
                      ? 'bg-amber-400'
                      : 'bg-[#1E60F2]'
                  }`}
                  style={{ height: bar.height }}
                />
                <span className="text-[10px] font-black text-slate-500 mt-1.5">{bar.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-600 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-[#060D1E]" />
              Peak: 8 societies / wk
            </span>
            <span className="text-[#1E60F2] font-black">+26 Societies Total</span>
          </div>
        </div>

        {/* Quick Links Menu Cards */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 px-1">
            Platform Management
          </h2>

          <div className="bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2.5px_2.5px_0px_#060D1E] divide-y-2 divide-slate-100 overflow-hidden">
            {/* Societies Link */}
            <button
              onClick={() => setActiveModal('societies')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-[#1E60F2] group-hover:bg-[#1E60F2] group-hover:text-white transition-colors">
                  <Building className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#060D1E]">Societies</span>
                    <span className="text-[9px] font-black bg-blue-50 text-[#1E60F2] px-2 py-0.5 rounded-full border border-blue-200">
                      {SOCIETIES.length} Active
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500">
                    Directory, hub capacity & gate keys
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#060D1E] group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Subscriptions Link */}
            <button
              onClick={() => {
                if (onOpenSubscriptions) {
                  onOpenSubscriptions();
                } else {
                  setActiveModal('subscriptions');
                }
              }}
              className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 group-hover:bg-amber-400 group-hover:text-amber-950 transition-colors">
                  <CreditCard className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#060D1E]">Subscriptions</span>
                    <span className="text-[9px] font-black bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                      Starter • Pro • Enterprise
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500">
                    Tier pricing, parcel limits & feature entitlements
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#060D1E] group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Payments Link */}
            <button
              onClick={() => setActiveModal('payments')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <IndianRupee className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#060D1E]">Payments</span>
                    <span className="text-[9px] font-black bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                      100% Collected
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500">
                    Invoices, billing cycles & gateway ledger
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#060D1E] group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Platform Settings Link */}
            <button
              onClick={() => {
                if (onOpenReleases) {
                  onOpenReleases();
                } else if (onOpenSettings) {
                  onOpenSettings();
                } else {
                  setActiveModal('settings');
                }
              }}
              className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-800 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Settings className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#060D1E]">Platform Settings</span>
                    <span className="text-[9px] font-black bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200">
                      APK Releases & FCM
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500">
                    App update broadcasting, SLA telemetry & system audit
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#060D1E] group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>
      </div>

      {/* Societies Modal */}
      {activeModal === 'societies' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-3">
          <div className="bg-[#FEF9F3] w-full max-w-sm rounded-3xl border-2 border-[#060D1E] shadow-[4px_4px_0px_#060D1E] overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-4 bg-white border-b-2 border-[#060D1E] flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-[#060D1E]">Managed Societies</h3>
                <p className="text-[10px] font-bold text-slate-500">Select a society to inspect or switch view</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center font-black text-xs"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
              {SOCIETIES.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSociety(s);
                    if (onSelectSociety) onSelectSociety(s.id);
                    if (onBackToSocietyView) onBackToSocietyView();
                    setActiveModal(null);
                  }}
                  className={`p-3 rounded-2xl border-2 border-[#060D1E] cursor-pointer transition-all ${
                    selectedSociety.id === s.id
                      ? 'bg-blue-50 shadow-[2px_2px_0px_#060D1E]'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-xs text-[#060D1E]">{s.name}</span>
                    <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                      Live Hub
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">{s.address}, {s.city}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payments Modal */}
      {activeModal === 'payments' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-3">
          <div className="bg-[#FEF9F3] w-full max-w-sm rounded-3xl border-2 border-[#060D1E] shadow-[4px_4px_0px_#060D1E] overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-4 bg-white border-b-2 border-[#060D1E] flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-[#060D1E]">Platform Payments & MRR</h3>
                <p className="text-[10px] font-bold text-slate-500">Automated recurring billing ledger</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center font-black text-xs"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-2.5 flex-1 text-xs">
              <div className="p-3 bg-white rounded-2xl border-2 border-[#060D1E]">
                <div className="flex justify-between font-black mb-1">
                  <span>Riverview Residency</span>
                  <span className="text-emerald-600">₹4,999 / mo</span>
                </div>
                <div className="text-[10px] text-slate-500 font-bold">Paid on Nov 21, 2026 • Razorpay ID #pay_78129</div>
              </div>
              <div className="p-3 bg-white rounded-2xl border-2 border-[#060D1E]">
                <div className="flex justify-between font-black mb-1">
                  <span>Greenview Heights</span>
                  <span className="text-emerald-600">₹2,999 / mo</span>
                </div>
                <div className="text-[10px] text-slate-500 font-bold">Paid on Nov 18, 2026 • Razorpay ID #pay_76541</div>
              </div>
              <div className="p-3 bg-white rounded-2xl border-2 border-[#060D1E]">
                <div className="flex justify-between font-black mb-1">
                  <span>Lakeview Residency</span>
                  <span className="text-emerald-600">₹6,999 / mo</span>
                </div>
                <div className="text-[10px] text-slate-500 font-bold">Paid on Nov 15, 2026 • Razorpay ID #pay_75210</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
