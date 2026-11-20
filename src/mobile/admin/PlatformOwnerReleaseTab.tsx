import React, { useState, useEffect } from 'react';
import {
  Crown,
  Smartphone,
  Send,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  FileCode,
  Tag,
  Hash,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import { CURRENT_APP_VERSION } from '../version';
import {
  checkForAppUpdate,
  type RemoteAppUpdateMetadata,
} from '../../services/appUpdateService';
import {
  getActiveDevicesCount,
  broadcastReleaseUpdateNotification,
  type BroadcastResult,
} from '../../services/fcmPushService';

interface PlatformOwnerReleaseTabProps {
  onBack?: () => void;
}

export const PlatformOwnerReleaseTab: React.FC<PlatformOwnerReleaseTabProps> = ({ onBack }) => {
  const { currentUser, currentRole } = useMobileStore();

  const isPlatformOwner =
    currentRole === 'SUPER_ADMIN' ||
    (currentUser?.email && currentUser.email.toLowerCase() === 'vinaykumard45678@gmail.com');

  const [metadata, setMetadata] = useState<RemoteAppUpdateMetadata | null>(null);
  const [deviceStats, setDeviceStats] = useState<{ totalActive: number; androidCount: number }>({
    totalActive: 0,
    androidCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<BroadcastResult | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [updateCheck, devices] = await Promise.all([
        checkForAppUpdate(),
        getActiveDevicesCount(),
      ]);

      if (updateCheck.updateMetadata) {
        setMetadata(updateCheck.updateMetadata);
      }
      setDeviceStats(devices);
    } catch (err: any) {
      console.warn('Could not load release data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendNotification = async () => {
    if (!metadata || !currentUser) return;
    setBroadcasting(true);
    setBroadcastResult(null);
    setFeedback(null);

    try {
      const res = await broadcastReleaseUpdateNotification(metadata, currentUser.id);
      setBroadcastResult(res);
      if (res.success) {
        setFeedback(
          `Update notification successfully broadcast to ${res.totalDevices} active device${
            res.totalDevices === 1 ? '' : 's'
          }!`
        );
      } else {
        setFeedback(res.error || 'Broadcast notification could not be dispatched.');
      }
    } catch (err: any) {
      setFeedback(err?.message || 'Error sending push broadcast.');
    } finally {
      setBroadcasting(false);
    }
  };

  // Security guard: Deny access if not Platform Owner
  if (!isPlatformOwner) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-[#FEF9F3]">
        <AlertCircle className="w-12 h-12 text-rose-600 mb-3" />
        <h2 className="text-base font-black text-[#060D1E]">Access Restricted</h2>
        <p className="text-xs font-bold text-slate-500 mt-1 max-w-xs">
          App release management and push notification broadcasts are restricted to the Platform Owner.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Top Header */}
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-xl bg-white border-2 border-[#060D1E] shadow-[1.5px_1.5px_0px_#060D1E] flex items-center justify-center mr-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-base font-black text-[#060D1E] tracking-tight">App Updates & Releases</h1>
            <p className="text-[10px] font-bold text-slate-500">Platform Owner Deployment Center</p>
          </div>
        </div>

        <span className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
          <Crown className="w-3 h-3 text-amber-700" />
          <span>Platform Owner</span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20 space-y-4">
        {/* Device Stats Card */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1E60F2] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center text-white">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">Registered Devices</p>
              <h2 className="text-2xl font-black text-[#060D1E]">{deviceStats.totalActive}</h2>
              <p className="text-[10px] font-bold text-slate-500">
                {deviceStats.androidCount} active Android installations with push tokens
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadData}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Refresh Device Count"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs font-black border-2 flex items-start gap-2 animate-fadeIn ${
              broadcastResult?.success
                ? 'bg-emerald-100 border-emerald-600 text-emerald-950'
                : 'bg-rose-100 border-rose-600 text-rose-950'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Release Metadata Card */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#1E60F2]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#060D1E]">
                Latest Release Target
              </h3>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
              Published
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs font-bold">
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" /> Version Name / Code
              </span>
              <span className="font-mono text-[#060D1E]">
                v{metadata?.latestVersionName || '1.2.0'} (Build {metadata?.latestVersionCode || 5})
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" /> Minimum Supported
              </span>
              <span className="font-mono text-slate-700">
                v{metadata?.minimumSupportedVersionCode || 4}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-slate-400" /> APK Size
              </span>
              <span className="font-mono text-slate-700">
                {metadata?.apkSizeBytes ? `${(metadata.apkSizeBytes / (1024 * 1024)).toFixed(2)} MB` : '9.49 MB'}
              </span>
            </div>

            <div className="py-2 flex flex-col gap-1">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" /> Cryptographic SHA-256
              </span>
              <span className="font-mono text-[9px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-200 break-all select-all">
                {metadata?.sha256 || '91e54050942122d73bbd39827e13ce376f31dedc8a8de1ce20159cf1c0f7422f'}
              </span>
            </div>
          </div>

          {/* Release Notes */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] font-black uppercase text-slate-400 mb-1.5">Release Notes</p>
            <ul className="space-y-1">
              {metadata?.releaseNotes && metadata.releaseNotes.length > 0 ? (
                metadata.releaseNotes.map((note, idx) => (
                  <li key={idx} className="text-[11px] font-bold text-slate-700 flex items-start gap-1.5">
                    <span className="text-[#1E60F2]">•</span>
                    <span>{note}</span>
                  </li>
                ))
              ) : (
                <li className="text-[11px] text-slate-500">• Faster parcel scanning & security alerts</li>
              )}
            </ul>
          </div>
        </div>

        {/* Push Notification Broadcast Action Card */}
        <div className="bg-blue-50 rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-[#1E60F2]" />
            <div>
              <h3 className="text-xs font-black text-[#060D1E]">Broadcast Update Notification</h3>
              <p className="text-[10px] font-bold text-blue-900/80">
                Sends push notification to all installed user devices
              </p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-blue-200 text-[11px] space-y-1">
            <p className="font-black text-slate-800">Preview Push Notification:</p>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <p className="font-black text-[#060D1E]">🆕 New ParcelFlow Update Available</p>
              <p className="text-slate-600 text-[11px]">
                ParcelFlow {metadata?.latestVersionName || '1.2.0'} is now available. Tap to update your app.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSendNotification}
            disabled={broadcasting}
            className="w-full py-3 bg-[#1E60F2] hover:bg-blue-600 text-white rounded-2xl text-xs font-black border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60"
          >
            <Send className={`w-4 h-4 text-white ${broadcasting ? 'animate-bounce' : ''}`} />
            <span>{broadcasting ? 'Broadcasting to Devices...' : 'Send Update Notification'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
