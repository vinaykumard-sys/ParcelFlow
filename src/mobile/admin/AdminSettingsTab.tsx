import React from 'react';
import { Crown, Building, Users, Clock, Bell, Shield, KeyRound, Database, Info, LogOut, ChevronRight, Sparkles } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';

interface AdminSettingsTabProps {
  onLogout: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  onLogout,
}) => {
  const { selectedSociety, logout } = useMobileStore();

  const handleLogout = () => {
    logout();
    onLogout();
  };

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

        {/* Settings Links matching reference */}
        <div className="bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] divide-y divide-slate-100">
          {settingsItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#1E60F2]" />
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
