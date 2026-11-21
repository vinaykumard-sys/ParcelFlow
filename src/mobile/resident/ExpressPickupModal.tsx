import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Zap,
  Clock,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  Package,
  AlertCircle,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import QRCode from 'qrcode';
import { useMobileStore } from '../services/mobileState';
import type { MobileParcel } from '../types';
import { CarrierLogo } from '../components/design-system';

interface ExpressPickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectParcel?: (parcel: MobileParcel) => void;
}

export const ExpressPickupModal: React.FC<ExpressPickupModalProps> = ({
  isOpen,
  onClose,
  onSelectParcel,
}) => {
  const { parcels, currentUser, selectedSociety } = useMobileStore();

  // Find all parcels ready or stored for this resident
  const readyParcels = parcels.filter(
    (p) =>
      p.status === 'READY_FOR_PICKUP' ||
      p.status === 'SCHEDULED' ||
      (p.status === 'WAITING' && p.storageLocation && p.storageLocation !== 'Awaiting Hub Intake')
  );

  // 10-minute countdown (600 seconds)
  const INITIAL_SECONDS = 600;
  const [secondsLeft, setSecondsLeft] = useState<number>(INITIAL_SECONDS);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [nonce, setNonce] = useState<string>(() => Math.floor(100000 + Math.random() * 900000).toString());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset or run 10-minute timer
  useEffect(() => {
    if (!isOpen) return;

    setSecondsLeft(INITIAL_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, nonce]);

  // Generate real dynamic QR code data URL whenever nonce, parcels, or user changes
  useEffect(() => {
    if (!isOpen) return;

    const payload = JSON.stringify({
      type: 'EXPRESS_PICKUP',
      token: `EXP-${nonce}`,
      societyId: selectedSociety.id,
      residentId: currentUser?.id || 'res-demo',
      residentName: currentUser?.name || 'Resident',
      flat: currentUser?.flatNumber || 'Flat 402',
      parcelIds: readyParcels.map((p) => p.id),
      trackingNumbers: readyParcels.map((p) => p.trackingNumber),
      generatedAt: new Date().toISOString(),
      expiresInSeconds: secondsLeft,
    });

    QRCode.toDataURL(payload, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0B1E3F',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate Express QR', err));
  }, [isOpen, nonce, readyParcels.length, selectedSociety.id, currentUser]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setNonce(Math.floor(100000 + Math.random() * 900000).toString());
    setSecondsLeft(INITIAL_SECONDS);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 450);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(nonce);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  const isExpired = secondsLeft === 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FEF9F3] text-[#0B1E3F] rounded-t-[32px] sm:rounded-[32px] border-2 border-[#0B1E3F] shadow-[0px_-8px_30px_rgba(0,0,0,0.2)] max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header Bar */}
        <div className="p-4 border-b-2 border-[#0B1E3F] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] flex items-center justify-center text-[#0B1E3F]">
              <Zap className="w-5 h-5 fill-[#0B1E3F] stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight">Express Pickup</h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Instant Release
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500">
                1-tap handover at security counter
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border-2 border-[#0B1E3F] bg-slate-100 hover:bg-slate-200 flex items-center justify-center active:scale-95 transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Validity Countdown Banner */}
          <div
            className={`p-3.5 rounded-2xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] flex items-center justify-between transition-colors ${
              isExpired
                ? 'bg-red-50 text-red-900 border-red-500'
                : secondsLeft < 120
                ? 'bg-amber-50 text-amber-900'
                : 'bg-emerald-50 text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock
                className={`w-5 h-5 stroke-[2.5] ${
                  isExpired ? 'text-red-600' : 'text-emerald-700 animate-pulse'
                }`}
              />
              <div>
                <p className="text-xs font-black">
                  {isExpired ? 'Pass Expired' : 'Pass Valid For'}
                </p>
                <p className="text-lg font-black tracking-wider">
                  {isExpired ? '00:00' : formatTime(secondsLeft)}
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3 py-1.5 bg-white rounded-xl border-2 border-[#0B1E3F] shadow-[1.5px_1.5px_0px_#0B1E3F] text-xs font-black flex items-center gap-1.5 active:scale-95 transition-all hover:bg-slate-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              <span>Refresh</span>
            </button>
          </div>

          {/* QR Code Presentation Canvas */}
          <div className="bg-white rounded-3xl border-2 border-[#0B1E3F] shadow-[4px_4px_0px_#0B1E3F] p-5 text-center flex flex-col items-center relative overflow-hidden">
            {isExpired && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-xs z-10 flex flex-col items-center justify-center p-4">
                <AlertCircle className="w-10 h-10 text-red-600 mb-2" />
                <p className="text-sm font-black text-red-700">QR Code Expired</p>
                <p className="text-xs font-bold text-slate-500 mb-3 text-center">
                  For your safety, express tokens expire after 10 minutes.
                </p>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-[#FFC72C] text-[#0B1E3F] font-black text-xs rounded-xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] active:scale-95"
                >
                  Generate Fresh Code
                </button>
              </div>
            )}

            <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-inner inline-block mb-3">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Express Pickup QR Code"
                  className="w-52 h-52 object-contain"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center bg-slate-100 rounded-xl text-xs font-bold text-slate-400">
                  Generating Token...
                </div>
              )}
            </div>

            {/* 6-Digit OTP Backup Code */}
            <div className="flex items-center gap-3 bg-amber-50 border-2 border-[#0B1E3F] rounded-2xl px-4 py-2 shadow-[2px_2px_0px_#0B1E3F]">
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-slate-500">
                  Backup 6-Digit OTP
                </p>
                <p className="text-xl font-black tracking-widest text-[#0B1E3F]">
                  {nonce.slice(0, 3)} {nonce.slice(3, 6)}
                </p>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-xl bg-white border border-[#0B1E3F] hover:bg-slate-100 active:scale-90 transition-all text-slate-700"
                title="Copy OTP"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>Tamper-Resistant Single-Use Handover Token</span>
            </div>
          </div>

          {/* Parcels Included in Express Release */}
          <div className="bg-white rounded-3xl border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Parcels Included in Release
              </h3>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1E60F2] border border-blue-300">
                {readyParcels.length} {readyParcels.length === 1 ? 'Parcel' : 'Parcels'}
              </span>
            </div>

            {readyParcels.length === 0 ? (
              <div className="p-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-300">
                <Package className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-bold text-slate-500">
                  No parcels currently ready for pickup.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {readyParcels.map((parcel) => (
                  <div
                    key={parcel.id}
                    onClick={() => {
                      if (onSelectParcel) {
                        onClose();
                        onSelectParcel(parcel);
                      }
                    }}
                    className="p-2.5 rounded-2xl border-2 border-slate-200 bg-[#FAF7F2] flex items-center justify-between gap-3 hover:border-[#0B1E3F] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CarrierLogo carrier={parcel.carrier} size="sm" />
                      <div className="min-w-0">
                        <p className="text-xs font-black text-[#0B1E3F] truncate">
                          {parcel.description || `${parcel.carrier} Parcel`}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 truncate">
                          {parcel.carrier} • #{parcel.trackingNumber}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 block">
                        {parcel.storageLocation || 'Hub A - S3'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t-2 border-[#0B1E3F] shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 bg-[#FFC72C] hover:bg-[#F59E0B] text-[#0B1E3F] font-black text-sm rounded-2xl border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>Show to Security Desk</span>
            <Check className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
