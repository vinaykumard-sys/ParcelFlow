import React from 'react';
import {
  Crown,
  Building,
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Boxes,
  CreditCard,
  Compass,
  Users,
  Shield,
  Plus,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useMobileStore, SOCIETIES } from '../services/mobileState';

interface AdminDashboardProps {
  onOpenManage: (tab?: 'residents' | 'staff' | 'slots') => void;
  onOpenReports: () => void;
  onOpenLockers?: () => void;
  onOpenSubscriptions?: () => void;
  onOpenOnboarding?: () => void;
  onQuickAction: (action: 'scan' | 'receive' | 'add_resident' | 'lockers' | 'subscriptions' | 'onboarding') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenManage,
  onOpenReports,
  onOpenLockers,
  onOpenSubscriptions,
  onOpenOnboarding,
  onQuickAction,
}) => {
  const { selectedSociety, setSociety, report } = useMobileStore();

  const activity7Days = [
    { day: 'Mon', count: 88, height: '65%' },
    { day: 'Tue', count: 94, height: '72%' },
    { day: 'Wed', count: 104, height: '80%' },
    { day: 'Thu', count: 98, height: '75%' },
    { day: 'Fri', count: 124, height: '95%' },
    { day: 'Sat', count: 132, height: '100%' },
    { day: 'Sun', count: 112, height: '86%' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Top Header */}
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500">Good Morning, Admin 👋</span>
            </div>
            <div className="relative mt-0.5">
              <select
                value={selectedSociety.id}
                onChange={(e) => {
                  const s = SOCIETIES.find((item) => item.id === e.target.value);
                  if (s) setSociety(s);
                }}
                className="appearance-none bg-transparent font-black text-base text-[#060D1E] pr-6 focus:outline-none cursor-pointer"
              >
                {SOCIETIES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1 pointer-events-none" />
            </div>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center font-black text-amber-950">
            <Crown className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20 space-y-4">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-slate-500">Parcels Today</span>
              <Package className="w-4 h-4 text-[#1E60F2]" />
            </div>
            <div className="text-2xl font-black text-[#060D1E]">{report.totalParcels || 112}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">Society Total</div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-emerald-600">Collected</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-[#060D1E]">{report.collected || 61}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">54.5% Rate</div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-[#1E60F2]">Scheduled</span>
              <Clock className="w-4 h-4 text-[#1E60F2]" />
            </div>
            <div className="text-2xl font-black text-[#060D1E]">{report.scheduled || 18}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">Slots Booked</div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-amber-600">Pending</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-[#060D1E]">{report.pending || 33}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-0.5">In Hub Storage</div>
          </div>
        </div>

        {/* Feature Navigation Hub (Lockers, Subscriptions, Onboarding) */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
            Operations & Setup
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => (onOpenLockers ? onOpenLockers() : onQuickAction('lockers'))}
              className="p-3 bg-white hover:bg-blue-50 text-[#060D1E] rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex flex-col items-center text-center active:scale-95 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center mb-1.5 text-[#1E60F2]">
                <Boxes className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs font-black">Locker Racks</span>
              <span className="text-[9px] text-slate-500 font-bold">112 units</span>
            </button>

            <button
              onClick={() => (onOpenSubscriptions ? onOpenSubscriptions() : onQuickAction('subscriptions'))}
              className="p-3 bg-white hover:bg-amber-50 text-[#060D1E] rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex flex-col items-center text-center active:scale-95 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center mb-1.5 text-amber-800">
                <CreditCard className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs font-black">Plan & Billing</span>
              <span className="text-[9px] text-amber-700 font-bold">Pro Active</span>
            </button>

            <button
              onClick={() => (onOpenOnboarding ? onOpenOnboarding() : onQuickAction('onboarding'))}
              className="p-3 bg-white hover:bg-emerald-50 text-[#060D1E] rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex flex-col items-center text-center active:scale-95 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center mb-1.5 text-emerald-800">
                <Compass className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs font-black">Onboarding</span>
              <span className="text-[9px] text-emerald-700 font-bold">8 Stages</span>
            </button>
          </div>
        </div>

        {/* Quick Directory Actions */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
            Directory & Slots
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenManage('residents')}
              className="p-3 bg-white hover:bg-slate-50 text-[#060D1E] rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center gap-3 text-left active:scale-95 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                <Users className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-black block">Residents Directory</span>
                <span className="text-[10px] text-slate-500 font-semibold">Towers A, B, C</span>
              </div>
            </button>

            <button
              onClick={() => onOpenManage('staff')}
              className="p-3 bg-white hover:bg-slate-50 text-[#060D1E] rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center gap-3 text-left active:scale-95 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800 shrink-0">
                <Shield className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-black block">Security Staff</span>
                <span className="text-[10px] text-slate-500 font-semibold">4 on shift</span>
              </div>
            </button>
          </div>
        </div>

        {/* 7-Day Activity Chart Card */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-black uppercase text-[#060D1E]">7-Day Parcel Volume</h3>
              <p className="text-[10px] font-bold text-slate-500">Peak hours: 6:00 PM – 8:30 PM</p>
            </div>
            <button
              onClick={onOpenReports}
              className="text-[11px] font-black text-[#1E60F2] flex items-center gap-1 hover:underline"
            >
              <span>Reports</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-28 flex items-end justify-between gap-2 pt-3 pb-1 border-b border-slate-100">
            {activity7Days.map((col) => (
              <div key={col.day} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div
                  className="w-full bg-[#1E60F2] hover:bg-blue-600 rounded-t-lg transition-all border border-[#060D1E] group-hover:scale-y-105"
                  style={{ height: col.height }}
                />
                <span className="text-[10px] font-black text-slate-500 mt-1.5">{col.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hub Status Banner */}
        <div
          onClick={() => (onOpenLockers ? onOpenLockers() : onOpenManage('slots'))}
          className="bg-[#060D1E] text-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4 cursor-pointer hover:bg-slate-900 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              Parcel Hub Status
            </span>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
              4 Attendants Active
            </span>
          </div>
          <p className="text-sm font-black mb-1">Manage Hub Slots & Storage Capacity</p>
          <p className="text-xs text-slate-300">
            6:00 PM – 9:30 PM slots: 80% filled tonight. Express lane enabled.
          </p>
        </div>
      </div>
    </div>
  );
};
