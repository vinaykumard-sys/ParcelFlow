import React, { useState } from 'react';
import { Menu, Bell, X, Building, Home, Package, Shield, ExternalLink } from 'lucide-react';
import { BrandLogo } from './design-system/BrandLogo';

export interface MobileHeaderProps {
  userName?: string;
  societyName?: string;
  flatNumber?: string;
  subtitle?: string;
  onOpenNotifications?: () => void;
  hasUnreadNotifications?: boolean;
  onOpenMenu?: () => void;
  showGreeting?: boolean;
  className?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  userName,
  societyName,
  flatNumber,
  subtitle,
  onOpenNotifications,
  hasUnreadNotifications = false,
  onOpenMenu,
  showGreeting = true,
  className = '',
}) => {
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleMenuClick = () => {
    if (onOpenMenu) {
      onOpenMenu();
    } else {
      setInternalDrawerOpen(prev => !prev);
    }
  };

  const initial = userName ? userName.charAt(0).toUpperCase() : 'R';

  return (
    <>
      <header
        className={`px-4 pt-2.5 pb-2.5 border-b border-slate-200/80 bg-[#FEF9F3] sticky top-0 z-20 select-none shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${className}`}
      >
        {/* ==================================================================== */}
        {/* EXACT REFERENCE TOP BAR: Hamburger Menu | BrandLogo | Notification Bell */}
        {/* ==================================================================== */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: Hamburger menu icon button */}
          <button
            type="button"
            onClick={handleMenuClick}
            className="w-9 h-9 rounded-xl bg-white border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] flex items-center justify-center text-[#0B1E3F] active:scale-95 transition-transform"
            aria-label="Open menu"
          >
            {internalDrawerOpen ? (
              <X className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <Menu className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>

          {/* Center: ParcelFlow Brand Logo (3D Isometric Yellow Parcel Box + ParcelFlow) */}
          <div className="flex items-center justify-center flex-1">
            <BrandLogo size="sm" subtitle={subtitle} />
          </div>

          {/* Right: Notification bell with unread dot */}
          <button
            type="button"
            onClick={onOpenNotifications || (() => {})}
            className="w-9 h-9 rounded-xl bg-white border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] flex items-center justify-center text-[#0B1E3F] relative active:scale-95 transition-transform"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {hasUnreadNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#EF4444] rounded-full border border-white ring-1 ring-[#EF4444]/40 animate-pulse" />
            )}
          </button>
        </div>

        {/* Optional Resident Greeting Sub-Row */}
        {showGreeting && userName && (
          <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#1E60F2] border-2 border-[#0B1E3F] shadow-[1px_1px_0px_#0B1E3F] flex items-center justify-center font-black text-white text-xs shrink-0">
                {initial}
              </div>
              <div className="truncate">
                <span className="text-xs font-black text-[#0B1E3F]">
                  {getGreeting()}, {userName.split(' ')[0]} 👋
                </span>
              </div>
            </div>

            {societyName && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 shrink-0">
                <span className="truncate max-w-[110px]">{societyName}</span>
                {flatNumber && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-[#1E60F2] font-black">{flatNumber}</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Slide-down quick menu when internalDrawerOpen is toggled */}
      {internalDrawerOpen && (
        <div className="bg-white border-b-2 border-[#0B1E3F] shadow-[0_4px_12px_rgba(11,30,63,0.08)] px-4 py-3 select-none z-19 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-black text-[#0B1E3F]">
            <span>Quick Navigation</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">ParcelFlow Hub</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#0B1E3F]">
            <a
              href="/"
              className="flex items-center gap-2 p-2 rounded-xl bg-[#FEF9F3] border border-slate-200 hover:border-[#0B1E3F] transition-colors"
            >
              <Home className="w-4 h-4 text-[#1E60F2]" />
              <span>Marketing Home</span>
            </a>
            <a
              href="/#societies"
              className="flex items-center gap-2 p-2 rounded-xl bg-[#FEF9F3] border border-slate-200 hover:border-[#0B1E3F] transition-colors"
            >
              <Building className="w-4 h-4 text-[#FFC72C]" />
              <span>Societies</span>
            </a>
            <a
              href="/how-it-works"
              className="flex items-center gap-2 p-2 rounded-xl bg-[#FEF9F3] border border-slate-200 hover:border-[#0B1E3F] transition-colors"
            >
              <Package className="w-4 h-4 text-[#22C55E]" />
              <span>How It Works</span>
            </a>
            <a
              href="/download"
              className="flex items-center gap-2 p-2 rounded-xl bg-[#FEF9F3] border border-slate-200 hover:border-[#0B1E3F] transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-[#EF4444]" />
              <span>Get Mobile App</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileHeader;
