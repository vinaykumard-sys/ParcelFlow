import React from 'react';
import { ShieldCheck, Phone, Mail, Building, LogOut, ChevronRight, Sparkles } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';

interface StaffProfileTabProps {
  onLogout: () => void;
}

export const StaffProfileTab: React.FC<StaffProfileTabProps> = ({ onLogout }) => {
  const { selectedSociety, currentUser, logout } = useMobileStore();

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const initial = (currentUser?.name || 'S').charAt(0).toUpperCase();

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] sticky top-0 z-20">
        <h1 className="text-base font-black text-[#060D1E] tracking-tight">Staff Account</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4 flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#060D1E] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center font-black text-white text-xl">
            {initial}
          </div>
          <div>
            <h2 className="text-base font-black text-[#060D1E]">
              {currentUser?.name || 'Gate Security Attendant'}
            </h2>
            <p className="text-xs font-bold text-slate-500">Security & Hub Operations</p>
            <span className="inline-block mt-1 text-[10px] font-black uppercase text-blue-800 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded-full">
              {selectedSociety.name}
            </span>
          </div>
        </div>

        {/* Details List */}
        <div className="bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] divide-y divide-slate-100 text-xs font-bold">
          <div className="p-3 flex items-center justify-between">
            <span className="text-slate-500 font-semibold flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#1E60F2]" /> Mobile
            </span>
            <span>{currentUser?.phone || '+91 98000 00000'}</span>
          </div>
          <div className="p-3 flex items-center justify-between">
            <span className="text-slate-500 font-semibold flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#1E60F2]" /> Staff Email
            </span>
            <span>{currentUser?.email || 'staff@parcelflow.in'}</span>
          </div>
          <div className="p-3 flex items-center justify-between">
            <span className="text-slate-500 font-semibold flex items-center gap-2">
              <Building className="w-4 h-4 text-[#1E60F2]" /> Assigned Society
            </span>
            <span>{selectedSociety.name}</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs rounded-2xl border-2 border-rose-300 shadow-[2px_2px_0px_#f43f5e] flex items-center justify-center gap-2 transition-colors active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out & Clear Session</span>
        </button>
      </div>
    </div>
  );
};
