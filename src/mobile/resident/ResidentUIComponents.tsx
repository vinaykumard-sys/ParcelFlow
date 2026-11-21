import React from 'react';
import { Package, Inbox, CheckCircle2, Menu, Bell, Clock, Calendar, Check, ArrowRight } from 'lucide-react';
import type { ParcelStatus } from '../types';

/**
 * Authentic SVG Vector Logos for Carriers
 */
export const CarrierLogo: React.FC<{
  carrier?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ carrier = 'Amazon', className = '', size = 'md' }) => {
  const norm = carrier.toLowerCase();
  const dim = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';

  if (norm.includes('amazon')) {
    return (
      <div
        className={`${dim} rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-1.5 shrink-0 ${className}`}
        title="Amazon"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <text
            x="50"
            y="52"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="34"
            fill="#131921"
          >
            a
          </text>
          {/* Amazon smile arrow */}
          <path
            d="M26 62C36 74 62 76 74 62"
            stroke="#FF9900"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M72 58L78 63L71 67"
            fill="#FF9900"
            stroke="#FF9900"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (norm.includes('flipkart')) {
    return (
      <div
        className={`${dim} rounded-xl bg-[#2874F0] border border-blue-700 shadow-sm flex items-center justify-center p-1 shrink-0 ${className}`}
        title="Flipkart"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          {/* Shopping bag handle */}
          <path
            d="M38 38C38 28 62 28 62 38"
            stroke="#FFE11B"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Shopping bag body */}
          <path
            d="M28 36L72 36L67 76L33 76Z"
            fill="#FFE11B"
            stroke="#FFE11B"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Italic F */}
          <text
            x="50"
            y="66"
            textAnchor="middle"
            fontFamily="Impact, Arial Black, sans-serif"
            fontStyle="italic"
            fontWeight="900"
            fontSize="36"
            fill="#2874F0"
          >
            f
          </text>
        </svg>
      </div>
    );
  }

  if (norm.includes('myntra')) {
    return (
      <div
        className={`${dim} rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-1.5 shrink-0 ${className}`}
        title="Myntra"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="myntra-g1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF3F6C" />
              <stop offset="100%" stopColor="#F16522" />
            </linearGradient>
            <linearGradient id="myntra-g2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF527B" />
              <stop offset="100%" stopColor="#FFA41C" />
            </linearGradient>
          </defs>
          {/* Iconic overlapping M shapes */}
          <path
            d="M22 68L36 34C38 29 46 29 48 34L58 54L48 68Z"
            fill="url(#myntra-g1)"
          />
          <path
            d="M52 54L62 34C64 29 72 29 74 34L88 68H72L65 52L58 68Z"
            fill="url(#myntra-g2)"
          />
        </svg>
      </div>
    );
  }

  if (norm.includes('blue') || norm.includes('dart')) {
    return (
      <div
        className={`${dim} rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-1 shrink-0 ${className}`}
        title="Blue Dart"
      >
        <div className="flex flex-col items-center justify-center leading-none">
          <span className="text-[9px] font-black tracking-tighter text-[#002664]">BLUE</span>
          <span className="text-[8px] font-black tracking-widest text-[#E31837]">DART</span>
        </div>
      </div>
    );
  }

  if (norm.includes('delhivery')) {
    return (
      <div
        className={`${dim} rounded-xl bg-black border border-slate-800 shadow-sm flex items-center justify-center p-1 shrink-0 ${className}`}
        title="Delhivery"
      >
        <div className="flex items-center text-white font-black text-xs tracking-tighter">
          <span>dlh</span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 ml-0.5" />
        </div>
      </div>
    );
  }

  if (norm.includes('gmail')) {
    return (
      <div
        className={`${dim} rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-1.5 shrink-0 ${className}`}
        title="Gmail"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Gmail M envelope */}
          <path d="M15 32V72H32V46L50 60L68 46V72H85V32L50 58L15 32Z" fill="#EA4335" />
          <path d="M15 32L50 58L85 32V26C85 22 81 18 77 18H23C19 18 15 22 15 26V32Z" fill="#C5221F" opacity="0.2" />
          <path d="M15 32V72H32V46L15 32Z" fill="#4285F4" />
          <path d="M85 32V72H68V46L85 32Z" fill="#34A853" />
          <path d="M32 46V72H50V60L32 46Z" fill="#FBBC04" opacity="0.3" />
        </svg>
      </div>
    );
  }

  // Fallback box icon
  return (
    <div
      className={`${dim} rounded-xl bg-amber-100 border border-amber-300 shadow-sm flex items-center justify-center p-1 shrink-0 ${className}`}
      title={carrier}
    >
      <Package className="w-5 h-5 text-amber-800" />
    </div>
  );
};

/**
 * 3D Isometric Stacked Parcel Boxes Illustration
 * As seen on the right side of the greeting card in the reference design.
 */
export const IsometricParcelBoxesGraphic: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div className={`relative shrink-0 flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 140 120"
        className="w-24 h-20 filter drop-shadow-md overflow-visible"
        fill="none"
      >
        {/* Soft Ground Shadow */}
        <ellipse cx="70" cy="106" rx="55" ry="12" fill="#0B1E3F" fillOpacity="0.12" />

        {/* BOTTOM BOX (Large kraft cardboard parcel) */}
        {/* Top Face */}
        <polygon
          points="70,44 118,62 70,80 22,62"
          fill="#F7C978"
          stroke="#0B1E3F"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Left Side Face */}
        <polygon
          points="22,62 70,80 70,104 22,86"
          fill="#E5A642"
          stroke="#0B1E3F"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Right Side Face */}
        <polygon
          points="70,80 118,62 118,86 70,104"
          fill="#C88825"
          stroke="#0B1E3F"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Navy Parcel Tape across Bottom Box */}
        <polygon
          points="62,47 78,53 54,74 38,68"
          fill="#1E60F2"
          fillOpacity="0.85"
        />
        <polygon
          points="38,68 54,74 54,98 38,92"
          fill="#1648B8"
        />

        {/* White Barcode Shipping Label on side */}
        <polygon
          points="80,78 106,68 106,82 80,92"
          fill="#FFFFFF"
          stroke="#0B1E3F"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Barcode lines */}
        <line x1="84" y1="81" x2="84" y2="88" stroke="#0B1E3F" strokeWidth="1.2" />
        <line x1="87" y1="80" x2="87" y2="87" stroke="#0B1E3F" strokeWidth="1.8" />
        <line x1="91" y1="78.5" x2="91" y2="85.5" stroke="#0B1E3F" strokeWidth="1" />
        <line x1="94" y1="77.5" x2="94" y2="84.5" stroke="#0B1E3F" strokeWidth="2.2" />
        <line x1="98" y1="76" x2="98" y2="83" stroke="#0B1E3F" strokeWidth="1.2" />
        <line x1="102" y1="74.5" x2="102" y2="81.5" stroke="#0B1E3F" strokeWidth="1.5" />

        {/* TOP BOX (Smaller, angled yellow box) */}
        {/* Top Face */}
        <polygon
          points="66,16 98,28 66,40 34,28"
          fill="#FFE28A"
          stroke="#0B1E3F"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Left Side Face */}
        <polygon
          points="34,28 66,40 66,60 34,48"
          fill="#F5C042"
          stroke="#0B1E3F"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Right Side Face */}
        <polygon
          points="66,40 98,28 98,48 66,60"
          fill="#D69C25"
          stroke="#0B1E3F"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Parcel tape on top box */}
        <polygon
          points="48,22.5 54,25 46,47.5 40,45"
          fill="#10B981"
          fillOpacity="0.9"
        />
        <polygon
          points="40,45 46,47.5 46,55 40,52.5"
          fill="#059669"
        />

        {/* Small verified green badge on top */}
        <circle cx="84" cy="24" r="8" fill="#10B981" stroke="#0B1E3F" strokeWidth="1.5" />
        <path
          d="M81 24L83 26L87 22"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

/**
 * ParcelFlow Official Brand Header
 * Hamburger Menu + 3D Logo & Name + Notification Bell
 */
export const ParcelFlowHeader: React.FC<{
  onOpenMenu?: () => void;
  onOpenNotifications?: () => void;
  hasUnread?: boolean;
}> = ({ onOpenMenu, onOpenNotifications, hasUnread = false }) => {
  return (
    <div className="flex items-center justify-between px-5 pt-3 pb-3 bg-white border-b-2 border-slate-100 sticky top-0 z-20 select-none">
      {/* Left: Hamburger Menu */}
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        className="w-9 h-9 rounded-xl bg-white border-2 border-[#0B1E3F] shadow-[1.5px_1.5px_0px_#0B1E3F] flex items-center justify-center text-[#0B1E3F] active:scale-95 transition-transform"
      >
        <Menu className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Center: ParcelFlow Official Brand Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#FFC72C] border-2 border-[#0B1E3F] shadow-[1.5px_1.5px_0px_#0B1E3F] flex items-center justify-center">
          <Package className="w-4 h-4 text-[#0B1E3F] stroke-[2.5]" />
        </div>
        <div className="flex items-center font-black tracking-tight text-lg text-[#0B1E3F]">
          <span>Parcel</span>
          <span className="text-[#2563EB]">Flow</span>
        </div>
      </div>

      {/* Right: Notification Bell */}
      <button
        type="button"
        onClick={onOpenNotifications}
        aria-label="Notifications"
        className="w-9 h-9 rounded-xl bg-white border-2 border-[#0B1E3F] shadow-[1.5px_1.5px_0px_#0B1E3F] flex items-center justify-center text-[#0B1E3F] relative active:scale-95 transition-transform"
      >
        <Bell className="w-4 h-4 stroke-[2.5]" />
        {hasUnread && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#EF4444] rounded-full border-2 border-white" />
        )}
      </button>
    </div>
  );
};

/**
 * Status Badge with Dot Indicator
 * ● Ready for Pickup (green) | ● Expected (amber) | ● Stored (blue) | ● Collected (slate)
 */
export const StatusPill: React.FC<{
  status: ParcelStatus | 'EXPECTED' | 'STORED';
  labelOverride?: string;
}> = ({ status, labelOverride }) => {
  if (status === 'READY_FOR_PICKUP') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-300">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{labelOverride || 'Ready for Pickup'}</span>
      </span>
    );
  }

  if (status === 'SCHEDULED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-50 text-blue-700 border border-blue-300">
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        <span>{labelOverride || 'Pickup Scheduled'}</span>
      </span>
    );
  }

  if (status === 'COLLECTED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-slate-100 text-slate-700 border border-slate-300">
        <span className="w-2 h-2 rounded-full bg-slate-500" />
        <span>{labelOverride || 'Collected'}</span>
      </span>
    );
  }

  // WAITING / EXPECTED / STORED
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-50 text-amber-800 border border-amber-300">
      <span className="w-2 h-2 rounded-full bg-amber-500" />
      <span>{labelOverride || 'At Hub / Expected'}</span>
    </span>
  );
};
