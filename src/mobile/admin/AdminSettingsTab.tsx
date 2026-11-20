import React from 'react';
import {
  Crown,
  Building,
  Users,
  Clock,
  Bell,
  Shield,
  KeyRound,
  Database,
  Info,
  LogOut,
  ChevronRight,
  Boxes,
  CreditCard,
  Compass,
} from 'lucide-react';
import { useMobileStore } from '../services/mobileState';

interface AdminSettingsTabProps {
  onLogout: () => void;
  onOpenSubscriptions?: () => void;
  onOpenOnboarding?: () => void;
  onOpenLockers?: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  onLogout,
  onOpenSubscriptions,
  onOpenOnboarding,
  onOpenLockers,
}) => {
  const { selectedSociety, logout } = useMobileStore();

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const operationalModules = [
    {
      label: 'Storage Locker Units',
      desc: 'Visual rack occupancy & release slots',
      icon: Boxes,
      action: onOpenLockers,
    },
    {
      label: 'Society Subscription & Billing',
      desc: 'Starter, Professional & Enterprise tiers',
      icon: CreditCard,
      action: onOpenSubscriptions,
    },
    {
      label: 'Society Setup & Onboarding Wizard',
      desc: '8-stage end-to-end community configuration',
      icon: Compass,
      action: onOpenOnboarding,
    },
  ];

  const settingsItems = [
    { label: 'Society Details', icon: Building, desc: 'Address, towers & gates' },
    { label: 'Roles & Permissions', icon: Users, desc: 'Staff & resident RBAC' },
    { label: 'Pickup Slot Settings', icon: Clock, desc: 'Capacity & operating hours' },
    { label: 'Notification Preferences', icon: Bell, desc: 'SMS, WhatsApp & push' },
    { label: 'Security & OTP Policy', icon: KeyRound, desc: '6-digit OTP expiration' },
    { label: 'App Access (Staff)', icon: Shield, desc: 'Gate scanner authorizations' },
    { label: 'Data & Reports Backup', icon: Database, desc: 'Automated CSV exports' },
    { label: 'About ParcelFlow', icon: Info, desc: 'v1.0.0 Production' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] sticky top-0 z-20">
        <h1 className="text-base font-black text-[#060D1E] tracking-tight">Society Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20 space-y-4">
        {/* Admin Society Pill */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4 flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center font-black text-amber-950 text-xl">
            <Crown className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#060D1E]">{selectedSociety.name}</h2>
            <p className="text-xs font-bold text-slate-500">Society Admin Portal</p>
            <span className="inline-block mt-1 text-[10px] font-black uppercase text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
              Full Administrator Access
            </span>
          </div>
        </div>

        {/* Resident Society Join Code Card (Requirement #6) */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#1E60F2]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#060D1E]">
                Resident Join Code
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Active
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-500">
            Share this secure code with residents of {selectedSociety.name} to link their apartments.
          </p>

          <div className="flex items-center justify-between bg-[#FEF9F3] p-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
            <span className="font-mono font-black text-lg tracking-widest text-[#1E60F2]">
              {selectedSociety.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)}-JOIN
            </span>
            <button
              type="button"
              onClick={() => alert(`New Join Code generated and old code revoked for ${selectedSociety.name}.`)}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-xs font-bold border border-slate-300 rounded-xl active:scale-95 text-[#060D1E]"
            >
              Rotate Code
            </button>
          </div>
        </div>

        {/* Operational Modules (Lockers, Subscriptions, Onboarding) */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
            Society Modules
          </h3>
          <div className="bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] divide-y divide-slate-100 overflow-hidden">
            {operationalModules.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1E60F2]">
                      <Icon className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#060D1E]">{item.label}</p>
                      <p className="text-[10px] font-semibold text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* General Settings Links */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
            General Configuration
          </h3>
          <div className="bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] divide-y divide-slate-100 overflow-hidden">
            {settingsItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-slate-700" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#060D1E]">{item.label}</p>
                      <p className="text-[10px] font-semibold text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs rounded-2xl border border-rose-300 flex items-center justify-center gap-2 transition-colors active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out Admin Session</span>
        </button>
      </div>
    </div>
  );
};
