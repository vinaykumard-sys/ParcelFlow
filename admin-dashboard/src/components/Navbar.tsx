import React, { useState } from 'react';
import {
  Bell,
  Scan,
  PackagePlus,
  UserPlus,
  Building2,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Sticker } from './Sticker';
import { adminService } from '../services/adminService';
import type { AdminTab } from '../types';

interface NavbarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onOpenScanModal: () => void;
  onOpenReceiveModal: () => void;
  onOpenAddResidentModal: () => void;
  refreshTrigger: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenScanModal,
  onOpenReceiveModal,
  onOpenAddResidentModal,
  refreshTrigger,
}) => {
  const [showSocietyDropdown, setShowSocietyDropdown] = useState(false);
  const activeSociety = adminService.getActiveSociety();
  const societies = adminService.getSocieties();
  const activeRole = adminService.getActiveRole();
  const notifications = adminService.getNotifications();
  const unreadCount = notifications.filter((n) => n.status !== 'READ').length;

  return (
    <header className="sticky top-0 z-40 bg-[#FEF9F3]/95 backdrop-blur-md border-b-2.5 border-[#0A1128] px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Society Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            {/* Playful Isometric 3D Box Logo */}
            <div className="w-10 h-10 rounded-xl bg-blue-600 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center justify-center text-white font-black text-xl group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0px_#0A1128] transition-all">
              PF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-[#0A1128]">
                  Parcel<span className="text-blue-600">Flow</span>
                </span>
                <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-amber-400 text-[#0A1128] border border-[#0A1128] shadow-[1px_1px_0px_#0A1128]">
                  Admin
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-600 hidden sm:block">
                Society Hub & Dispatch Console
              </p>
            </div>
          </button>

          {/* Society Selector Dropdown */}
          <div className="relative ml-2 sm:ml-4">
            <button
              onClick={() => setShowSocietyDropdown(!showSocietyDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:bg-amber-50 text-xs font-bold text-[#0A1128] transition-all"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="truncate max-w-[130px] sm:max-w-[180px]">{activeSociety.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showSocietyDropdown && (
              <div className="absolute left-0 mt-2 w-64 bg-white border-2 border-[#0A1128] rounded-xl shadow-[4px_4px_0px_#0A1128] py-2 z-50">
                <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-500 border-b border-slate-200">
                  Select Gated Society
                </div>
                {societies.map((soc) => (
                  <button
                    key={soc.id}
                    onClick={() => {
                      adminService.setActiveSociety(soc.id);
                      setShowSocietyDropdown(false);
                      onSelectTab('society-selection');
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between hover:bg-amber-100 transition-colors ${
                      soc.id === activeSociety.id ? 'bg-amber-50 text-blue-700' : 'text-[#0A1128]'
                    }`}
                  >
                    <span>{soc.name}</span>
                    {soc.id === activeSociety.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
                <div className="p-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setShowSocietyDropdown(false);
                      onSelectTab('society-selection');
                    }}
                    className="w-full text-center py-1 text-[11px] font-extrabold text-blue-600 hover:underline"
                  >
                    View All 4 Societies →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center / Right Controls & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Pill */}
          <button
            onClick={() => onSelectTab('role-switcher')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:bg-emerald-200 text-xs font-extrabold text-[#0A1128] transition-all"
            title="Switch User Role View"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Role: {activeRole}</span>
          </button>

          {/* Quick Actions (Scan OTP, Receive Parcel, Add Resident) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Scan OTP */}
            <button
              onClick={onOpenScanModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0A1128] active:translate-y-0 transition-all"
            >
              <Scan className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Scan OTP</span>
            </button>

            {/* Receive Parcel */}
            <button
              onClick={onOpenReceiveModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0A1128] active:translate-y-0 transition-all"
            >
              <PackagePlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Receive Parcel</span>
            </button>

            {/* Add Resident */}
            <button
              onClick={onOpenAddResidentModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-[#0A1128] font-extrabold text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0A1128] active:translate-y-0 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Resident</span>
            </button>
          </div>

          {/* Notifications Button */}
          <button
            onClick={() => onSelectTab('notifications')}
            className="relative p-2 rounded-xl bg-white border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:bg-amber-100 text-[#0A1128] transition-all"
            title="Notifications Center"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-[#0A1128]">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
