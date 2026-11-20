import React from 'react';
import { Bell } from 'lucide-react';

interface MobileHeaderProps {
  userName: string;
  societyName: string;
  flatNumber?: string;
  onOpenNotifications?: () => void;
  hasUnreadNotifications?: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  userName,
  societyName,
  flatNumber,
  onOpenNotifications,
  hasUnreadNotifications = false,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const initial = (userName || 'Resident').charAt(0).toUpperCase();

  return (
    <header className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] sticky top-0 z-20 select-none">
      <div className="flex items-center justify-between">
        {/* User Identity & Society Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#1E60F2] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center font-black text-white text-base">
            {initial}
          </div>
          <div>
            <h1 className="text-sm font-black text-[#060D1E] leading-tight">
              {getGreeting()}, {userName.split(' ')[0]} 👋
            </h1>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mt-0.5">
              <span className="truncate max-w-[140px]">{societyName}</span>
              {flatNumber && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-[#1E60F2] font-black">{flatNumber}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Notification Bell */}
        {onOpenNotifications && (
          <button
            type="button"
            onClick={onOpenNotifications}
            className="w-9 h-9 rounded-xl bg-white border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center relative active:scale-95 transition-transform"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 text-[#060D1E]" />
            {hasUnreadNotifications && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white" />
            )}
          </button>
        )}
      </div>
    </header>
  );
};
