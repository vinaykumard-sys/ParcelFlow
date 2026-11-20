import React, { useState, useEffect } from 'react';
import { ArrowLeft, QrCode, Copy, Check, Clock, ShieldCheck, Sparkles, RefreshCw, AlertCircle, Navigation } from 'lucide-react';
import QRCode from 'qrcode';
import type { MobileParcel } from '../types';
import { otpQrService } from '../../services/otpQrService';
import { useMobileStore } from '../services/mobileState';

interface ResidentPickupCodeProps {
  parcel: MobileParcel;
  otpCode?: string;
  onBack: () => void;
  onCollected: () => void;
}

export const ResidentPickupCode: React.FC<ResidentPickupCodeProps> = ({
  parcel,
  otpCode: initialOtp,
  onBack,
  onCollected,
}) => {
  const { notifyOnTheWay } = useMobileStore();
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOnTheWay, setIsOnTheWay] = useState(false);
  const [activeOtp, setActiveOtp] = useState<string>(initialOtp || parcel.otpCode || '742916');
  const [qrPayload, setQrPayload] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [secondsLeft, setSecondsLeft] = useState<number>(600); // 10 minutes default
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate real scannable QR matrix image data URL
  useEffect(() => {
    const content =
      qrPayload ||
      JSON.stringify({
        otp: activeOtp,
        trackingNumber: parcel.trackingNumber,
        carrier: parcel.carrier,
        parcelId: parcel.id,
      });

    QRCode.toDataURL(content, {
      width: 256,
      margin: 2,
      color: {
        dark: '#060D1E',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.warn('QR generation error:', err));
  }, [qrPayload, activeOtp, parcel]);

  // Fetch or generate database-backed token with 10-minute expiry
  const refreshHandoverToken = async () => {
    setIsRefreshing(true);
    try {
      const residentId = 'e1111111-1111-1111-1111-111111111111';
      const result = await otpQrService.getOrCreateHandoverToken(parcel.id, residentId);
      if (result.success && result.data) {
        setActiveOtp(result.data.otpCode);
        setQrPayload(result.data.qrCodeData);
        const remaining = Math.max(0, Math.floor((new Date(result.data.expiresAt).getTime() - Date.now()) / 1000));
        setSecondsLeft(remaining > 0 ? remaining : 600);
      }
    } catch (e) {
      console.warn('Error refreshing token:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshHandoverToken();
  }, [parcel.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(activeOtp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = secondsLeft <= 0;
  const digits = activeOtp.padStart(6, '0').slice(0, 6).split('');

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Top Header */}
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] flex items-center justify-between sticky top-0 z-20">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </button>
        <h1 className="text-sm font-black text-[#060D1E] tracking-tight">Pickup Verification Pass</h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Pass Graphic Card */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[4px_4px_0px_#060D1E] p-6 text-center relative overflow-hidden">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ready at Express Counter</span>
          </div>

          <h2 className="text-base font-black text-[#060D1E] mb-1">
            {parcel.carrier} • {parcel.trackingNumber}
          </h2>
          <p className="text-xs font-bold text-slate-500 mb-4">
            Assigned to: <span className="text-[#060D1E] font-black">{parcel.storageLocation}</span>
          </p>

          {!showQr ? (
            /* 6-Digit OTP View */
            <div className="space-y-4">
              <div className="p-4 bg-[#FEF9F3] rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                  Your Single-Use 6-Digit OTP
                </p>
                <div className="flex items-center justify-center gap-2">
                  {digits.map((digit, idx) => (
                    <div
                      key={idx}
                      className="w-10 h-12 bg-white rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center text-xl font-mono font-black text-[#1E60F2]"
                    >
                      {digit}
                    </div>
                  ))}
                </div>
              </div>

              {/* Countdown Timer with 10-minute expiry enforcement */}
              {isExpired ? (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-2xl text-center space-y-2">
                  <p className="text-xs font-black text-rose-700 flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>OTP Expired (10-minute validity exceeded)</span>
                  </p>
                  <button
                    onClick={refreshHandoverToken}
                    disabled={isRefreshing}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 mx-auto"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>Generate New 6-Digit Code</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-xs font-black text-rose-600 bg-rose-50 border border-rose-200 py-1.5 px-3 rounded-full mx-auto w-fit">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Valid for {formatTimer(secondsLeft)} minutes (10-min limit)</span>
                </div>
              )}
            </div>
          ) : (
            /* High-Contrast Dynamic Scannable QR Code View */
            <div className="space-y-3">
              <div className="p-3 bg-white inline-block rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E]">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Resident Pickup QR Pass"
                    className="w-48 h-48 mx-auto rounded-lg object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#1E60F2]" />
                    <span className="text-[11px] font-bold">Rendering QR Pass...</span>
                  </div>
                )}
              </div>

              <p className="text-[11px] font-extrabold text-slate-500">
                Temporary cryptographic QR token • 10-minute server validity
              </p>
            </div>
          )}

          {/* Buttons to switch between OTP and QR */}
          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={() => setShowQr(!showQr)}
              className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-50 text-[#060D1E] font-black text-xs rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-1.5 transition-all"
            >
              <QrCode className="w-4 h-4 text-[#1E60F2]" />
              <span>{showQr ? 'Show 6-Digit OTP' : 'Show QR Pass'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-[#060D1E] font-black text-xs rounded-xl border border-slate-300 flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Handover & Locker Slot Instructions Card */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 border-2 border-[#060D1E] flex items-center justify-center text-blue-700">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-[#060D1E]">Locker Hub Collection Guide</h3>
              <p className="text-[10px] font-bold text-slate-500">Gate 1 Express Parcel Hub • Tower B Lobby</p>
            </div>
          </div>

          <div className="p-3 bg-[#FEF9F3] rounded-2xl border border-slate-300 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">Assigned Storage Slot:</span>
              <span className="font-mono font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {parcel.storageLocation || 'Rack B - Shelf 04'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">Recipient:</span>
              <span className="font-black text-[#060D1E]">{parcel.recipientName} ({parcel.flat})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">Hub Operating Hours:</span>
              <span className="font-bold text-slate-700">07:00 AM – 11:00 PM</span>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] font-semibold text-slate-600 pl-1">
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-200 text-[#060D1E] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>Present this 6-digit OTP or let Security Staff scan your QR pass.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-200 text-[#060D1E] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>Staff verifies code, retrieves package from {parcel.storageLocation}, and releases locker slot.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-200 text-[#060D1E] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>Package status transitions to <strong className="text-emerald-700">COLLECTED</strong> with audit timestamp.</span>
            </div>
          </div>
        </div>

        {/* "I'm on my way" Feature (Requirement #14) */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4 text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-[#1E60F2]">
                <Navigation className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-[#060D1E]">Heading to Hub Counter?</h3>
                <p className="text-[10px] font-bold text-slate-500">Alert security to pre-stage your package</p>
              </div>
            </div>
          </div>

          {isOnTheWay ? (
            <div className="p-3 bg-emerald-50 rounded-2xl border-2 border-emerald-500 text-xs text-emerald-900 font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Staff alerted! Your package ({parcel.storageLocation}) is being retrieved for express handover.</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                notifyOnTheWay(parcel.id);
                setIsOnTheWay(true);
              }}
              className="w-full py-3 px-4 bg-[#1E60F2] hover:bg-blue-600 text-white font-black text-xs rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>I'm On My Way to Counter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
