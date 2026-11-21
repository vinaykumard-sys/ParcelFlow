import React, { useState, useEffect } from 'react';
import {
  WifiOff,
  Wifi,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Package,
} from 'lucide-react';
import {
  subscribeOfflineQueue,
  syncNow,
  isOnline,
  getPendingQueue,
} from '../../services/offlineQueueService';
import type { OfflineSyncEvent } from '../../services/types';

export interface OfflineSecurityBannerProps {
  alwaysShowQueueWhenEmpty?: boolean;
}

export const OfflineSecurityBanner: React.FC<OfflineSecurityBannerProps> = ({
  alwaysShowQueueWhenEmpty = false,
}) => {
  const [online, setOnline] = useState<boolean>(isOnline());
  const [pendingQueue, setPendingQueue] = useState<OfflineSyncEvent[]>(getPendingQueue());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeOfflineQueue((events, isConnected) => {
      setPendingQueue(events);
      setOnline(isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSyncNow = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await syncNow();
      if (res.successCount > 0) {
        setSyncFeedback(`Successfully synced ${res.successCount} action(s)`);
        setTimeout(() => setSyncFeedback(null), 3000);
      } else if (res.failCount > 0 && !online) {
        setSyncFeedback('Device is currently offline. Will auto-sync on reconnect.');
        setTimeout(() => setSyncFeedback(null), 3500);
      }
    } catch (err: any) {
      setSyncFeedback(err.message || 'Sync encountered an error');
      setTimeout(() => setSyncFeedback(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  // If online and zero pending actions, do not clutter screen unless explicitly asked
  if (online && pendingQueue.length === 0 && !alwaysShowQueueWhenEmpty && !syncFeedback) {
    return null;
  }

  const formatActionTitle = (action: string, payload: any) => {
    switch (action) {
      case 'RECEIVE_PARCEL':
        return `Intake Parcel #${payload?.tracking_number || 'AMZ-1029'}`;
      case 'ASSIGN_STORAGE':
        return `Assign Slot ${payload?.storage_location_id || 'Hub A - B3'}`;
      case 'HANDOVER_VERIFIED':
        return `Handover Verified #${payload?.parcel_id?.slice(-4) || '883'}`;
      case 'REPORT_INCIDENT':
        return `Incident Logged (${payload?.issue_type || 'Damaged'})`;
      default:
        return action.replace(/_/g, ' ');
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '10:42 AM';
    }
  };

  return (
    <div className="w-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Top Banner Alert Bar */}
      <div
        className={`px-4 py-2.5 border-b-2 border-[#060D1E] flex items-center justify-between transition-colors shadow-sm ${
          !online
            ? 'bg-amber-400 text-[#060D1E]'
            : pendingQueue.length > 0
            ? 'bg-amber-200 text-[#060D1E]'
            : 'bg-emerald-100 text-emerald-950'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg border-2 border-[#060D1E] flex items-center justify-center ${
              !online ? 'bg-amber-500 text-white' : 'bg-white text-emerald-700'
            }`}
          >
            {!online ? (
              <WifiOff className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <Wifi className="w-4 h-4 stroke-[2.5]" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 font-black text-xs leading-tight">
              <span>
                {!online
                  ? "You're Offline - Recording actions locally"
                  : pendingQueue.length > 0
                  ? 'Reconnected - Pending Sync Actions'
                  : 'All Local Actions Synced'}
              </span>
              {pendingQueue.length > 0 && (
                <span className="px-1.5 py-0.2 bg-[#060D1E] text-white rounded text-[10px] font-black">
                  {pendingQueue.length}
                </span>
              )}
            </div>
            <div className="text-[10px] font-semibold opacity-85 leading-tight">
              Screen 11 • Zero Data Loss Buffer
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Sync Now button */}
          <button
            type="button"
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-50 border-2 border-[#060D1E] text-[#060D1E] font-black text-[11px] shadow-[1.5px_1.5px_0px_#060D1E] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3 h-3 ${isSyncing ? 'animate-spin text-[#1E60F2]' : ''}`}
            />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>

          {/* Toggle List Accordion */}
          {pendingQueue.length > 0 && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg hover:bg-black/10 transition-colors"
              aria-label="Toggle pending queue list"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Sync feedback toast message if present */}
      {syncFeedback && (
        <div className="bg-blue-50 px-4 py-1.5 border-b border-blue-200 text-xs font-bold text-blue-900 flex items-center justify-between">
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Expanded Pending Actions Drawer */}
      {isExpanded && pendingQueue.length > 0 && (
        <div className="p-3 bg-white border-b-2 border-[#060D1E] space-y-2 animate-in slide-in-from-top-1 max-h-48 overflow-y-auto">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">
            Pending Local Actions ({pendingQueue.length})
          </div>
          {pendingQueue.map((item) => (
            <div
              key={item.event_id}
              className="bg-[#FEF9F3] rounded-xl border border-[#060D1E] p-2.5 flex items-center justify-between text-xs shadow-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <div>
                  <div className="font-black text-[#060D1E]">
                    {formatActionTitle(item.action, item.payload)}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(item.created_at)}</span>
                    {item.retry_count > 0 && (
                      <span className="text-rose-600 font-bold ml-1">
                        • {item.retry_count} retry
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                PENDING
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
