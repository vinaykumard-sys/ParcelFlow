import React, { useState } from 'react';
import {
  Bell,
  X,
  Package,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Check,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { useMobileStore } from '../services/mobileState';

export interface InAppNotification {
  id: string;
  type: 'PACKAGE_ARRIVED' | 'EXPRESS_READY' | 'APP_UPDATE' | 'SECURITY';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToParcels?: () => void;
  onOpenAppUpdate?: () => void;
}

const STORAGE_NOTIFS_KEY = 'parcelflow_notifications_v2';

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigateToParcels,
  onOpenAppUpdate,
}) => {
  const { parcels, currentUser } = useMobileStore();

  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_NOTIFS_KEY);
        if (saved) return JSON.parse(saved);
      }
    } catch {}

    // Generate real notifications based on active parcels
    const initialList: InAppNotification[] = [];
    const active = parcels.filter((p) => p.status !== 'COLLECTED');

    if (active.length > 0) {
      initialList.push({
        id: `notif-pkg-${active[0].id}`,
        type: 'PACKAGE_ARRIVED',
        title: 'Package Ready for Pickup',
        message: `${active[0].carrier} package (${active[0].trackingNumber}) is safely placed in Hub Storage ${active[0].storageLocation || 'Rack A'}.`,
        timestamp: 'Just now',
        isRead: false,
      });
    }

    initialList.push({
      id: 'notif-welcome',
      type: 'SECURITY',
      title: 'ParcelFlow Security Guard Active',
      message: '24/7 digital chain-of-custody and real-time OTP handovers are active for your society.',
      timestamp: 'Today',
      isRead: false,
    });

    return initialList;
  });

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_NOTIFS_KEY, JSON.stringify(updated));
    }
  };

  const handleClearAll = () => {
    setNotifications([]);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_NOTIFS_KEY);
    }
  };

  const handleItemClick = (notif: InAppNotification) => {
    const updated = notifications.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_NOTIFS_KEY, JSON.stringify(updated));
    }

    if (notif.type === 'PACKAGE_ARRIVED' && onNavigateToParcels) {
      onClose();
      onNavigateToParcels();
    } else if (notif.type === 'APP_UPDATE' && onOpenAppUpdate) {
      onClose();
      onOpenAppUpdate();
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 select-none animate-fadeIn">
      <div className="bg-[#FEF9F3] w-full max-w-sm rounded-t-[36px] sm:rounded-[36px] border-3 border-[#060D1E] shadow-[6px_6px_0px_#060D1E] flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center text-[#1E60F2]">
              <Bell className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#060D1E] tracking-tight">Notification Center</h2>
              <p className="text-[10px] font-bold text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread alerts` : 'All notifications caught up'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border-2 border-[#060D1E] bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 active:scale-95"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Action Controls */}
        {notifications.length > 0 && (
          <div className="px-5 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-[11px] font-black text-slate-600">
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 hover:text-[#1E60F2] transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 text-rose-600 hover:text-rose-800 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}

        {/* List of Notifications */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Bell className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
              <p className="text-xs font-black text-slate-700">No Notifications</p>
              <p className="text-[11px] font-medium text-slate-400 max-w-[200px] mx-auto">
                Real-time alerts for incoming couriers and deliveries will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] cursor-pointer transition-all active:scale-[0.98] ${
                  notif.isRead ? 'bg-white opacity-80' : 'bg-blue-50/70 border-blue-900'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    {notif.type === 'PACKAGE_ARRIVED' ? (
                      <Package className="w-4 h-4 text-[#1E60F2]" />
                    ) : notif.type === 'APP_UPDATE' ? (
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#060D1E] truncate">{notif.title}</span>
                      <span className="text-[9px] font-bold text-slate-400">{notif.timestamp}</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-600 mt-0.5 leading-snug">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
