import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building,
  Users,
  Shield,
  Boxes,
  Compass,
  Clock,
  QrCode,
  Bell,
  BarChart3,
  AlertCircle,
  Settings,
  Sparkles,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import type { AdminTab } from '../types';

interface SidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  unreadCount?: number;
  openIssuesCount?: number;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  unreadCount = 2,
  openIssuesCount = 1,
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Admin Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: 'KPI',
      badgeColor: 'bg-blue-500 text-white',
    },
    {
      id: 'society-selection',
      label: 'Society Selection',
      icon: <Building className="w-4 h-4" />,
      badge: '4 Active',
      badgeColor: 'bg-amber-400 text-[#0A1128]',
    },
    {
      id: 'role-switcher',
      label: 'Role-Based Access',
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: 'residents',
      label: 'Resident Directory',
      icon: <Users className="w-4 h-4" />,
      badge: '450 Flats',
      badgeColor: 'bg-emerald-400 text-[#0A1128]',
    },
    {
      id: 'staff',
      label: 'Staff Management',
      icon: <UserCheck className="w-4 h-4" />,
      badge: '12 Staff',
      badgeColor: 'bg-indigo-500 text-white',
    },
    {
      id: 'hub-inventory',
      label: 'Parcel Hub Inventory',
      icon: <Boxes className="w-4 h-4" />,
      badge: '112 Pkgs',
      badgeColor: 'bg-orange-500 text-white',
    },
    {
      id: 'tracking',
      label: 'Parcel Tracking',
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: 'pickup-slots',
      label: 'Pickup Slots Config',
      icon: <Clock className="w-4 h-4" />,
      badge: '5 Slots',
      badgeColor: 'bg-amber-400 text-[#0A1128]',
    },
    {
      id: 'otp-scanner',
      label: 'OTP / QR Verification',
      icon: <QrCode className="w-4 h-4" />,
      badge: 'Live',
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'notifications',
      label: 'Notifications Center',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadCount > 0 ? unreadCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'reports',
      label: 'Analytics & Reports',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'issues',
      label: 'Issue Resolution',
      icon: <AlertCircle className="w-4 h-4" />,
      badge: openIssuesCount > 0 ? `${openIssuesCount} Open` : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'settings',
      label: 'Settings & Audit Log',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: 'splash',
      label: 'Welcome & Splash',
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  const activeItem = navItems.find((i) => i.id === currentTab) || navItems[0];

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-[#FFFDF9] border-b-2.5 lg:border-b-0 lg:border-r-2.5 border-[#0A1128] p-3 sm:p-4 flex flex-col justify-between">
      <div className="space-y-1">
        {/* Mobile Accordion Drawer Header */}
        <div className="lg:hidden mb-2">
          <button
            type="button"
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] text-left hover:bg-amber-50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-100 border border-[#0A1128] text-blue-600">
                {activeItem.icon}
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Active View</div>
                <div className="text-xs font-black text-[#0A1128]">{activeItem.label}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black bg-amber-400 text-[#0A1128] px-2 py-0.5 rounded-md border border-[#0A1128]">
                {isMobileExpanded ? 'Close Menu' : 'Tabs (14)'}
              </span>
              <ChevronDown className={`w-4 h-4 text-[#0A1128] transition-transform duration-200 ${isMobileExpanded ? 'rotate-180' : ''}`} />
            </div>
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-500 items-center justify-between">
          <span>Navigation Menu</span>
          <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono">14 Tabs</span>
        </div>

        {/* Nav Items List (always visible on lg, collapsible on mobile) */}
        <nav className={`${isMobileExpanded ? 'block' : 'hidden'} lg:block space-y-1 pt-1 lg:pt-0`}>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setIsMobileExpanded(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left border-2 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white border-[#0A1128] shadow-[3px_3px_0px_#0A1128] translate-x-1'
                    : 'bg-white hover:bg-amber-50 text-[#0A1128] border-transparent hover:border-[#0A1128] hover:shadow-[2px_2px_0px_#0A1128]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`${isActive ? 'text-white' : 'text-blue-600'}`}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border border-[#0A1128] ${
                      isActive ? 'bg-white text-[#0A1128]' : item.badgeColor || 'bg-slate-100 text-[#0A1128]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Hub Mini Status Card */}
      <div className="hidden lg:block mt-6 p-3 rounded-xl bg-amber-100/70 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128]">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-[#0A1128]" />
          <span className="text-[11px] font-black uppercase text-[#0A1128]">Parcel Hub Online</span>
        </div>
        <p className="text-[11px] font-medium text-slate-700">
          Bellandur Hub Gate 2 CCTV sync active. 87 parcels processed today.
        </p>
      </div>
    </aside>
  );
};
