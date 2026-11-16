import React, { useState } from 'react';
import { Megaphone } from 'lucide-react';
import { Sticker } from '../components/Sticker';
import { adminService } from '../services/adminService';

interface NotificationsCenterScreenProps {
  onOpenBroadcastModal: () => void;
  refreshTrigger: number;
}

export const NotificationsCenterScreen: React.FC<NotificationsCenterScreenProps> = ({
  onOpenBroadcastModal,
  refreshTrigger,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const notifications = adminService.getNotifications();
  const activeSociety = adminService.getActiveSociety();

  const filtered = notifications.filter((n) => {
    if (filterType === 'ALL') return true;
    return n.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-[#0A1128] tracking-tight">Notifications Center</h2>
            <Sticker color="yellow" rotate="right" size="xs">
              Realtime Event Log
            </Sticker>
          </div>
          <p className="text-xs font-semibold text-slate-600">
            Realtime activity stream and alert distribution for {activeSociety.name}.
          </p>
        </div>

        <button
          onClick={onOpenBroadcastModal}
          className="py-2 px-3.5 rounded-xl bg-purple-600 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 transition-all"
        >
          <Megaphone className="w-4 h-4" />
          <span>Broadcast Society Alert</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {(['ALL', 'PARCEL_RECEIVED', 'SLOT_SCHEDULED', 'HANDOVER_COMPLETED', 'SECURITY_NOTICE'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-black border-2 border-[#0A1128] transition-all whitespace-nowrap ${
              filterType === t
                ? 'bg-blue-600 text-white shadow-[2px_2px_0px_#0A1128]'
                : 'bg-white hover:bg-slate-100 text-[#0A1128]'
            }`}
          >
            {t === 'ALL'
              ? 'All Alerts'
              : t === 'PARCEL_RECEIVED'
              ? '📦 Parcels Arrived'
              : t === 'SLOT_SCHEDULED'
              ? '🗓️ Slots Booked'
              : t === 'HANDOVER_COMPLETED'
              ? '✅ Handovers'
              : '🛡️ Security'}
          </button>
        ))}
      </div>

      {/* Notifications Feed */}
      <div className="rounded-2xl bg-white border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] p-5 sm:p-6 space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border-2 border-[#0A1128] bg-[#FFFDF9] hover:bg-amber-50/70 transition-all shadow-[2px_2px_0px_#0A1128] flex items-start justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-[#0A1128]">{item.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 border border-[#0A1128] text-slate-600">
                  {item.channel}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-700">{item.body}</p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono text-slate-400">
                {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400 font-semibold text-xs">
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  );
};
