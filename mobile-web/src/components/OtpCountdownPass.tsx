import React, { useState, useEffect } from 'react';
import { KeyRound, QrCode, Copy, Check, RefreshCw, ShieldCheck, Clock, PackageCheck, AlertCircle } from 'lucide-react';
import { Sticker } from './Sticker';
import { mobileStore, MobileParcel } from '../services/supabaseService';

interface OtpCountdownPassProps {
  parcel?: MobileParcel;
  onOtpRegenerated?: (newOtp: string) => void;
}

export const OtpCountdownPass: React.FC<OtpCountdownPassProps> = ({ parcel, onOtpRegenerated }) => {
  const [selectedParcel, setSelectedParcel] = useState<MobileParcel | undefined>(
    parcel || mobileStore.getParcels().find((p) => p.status === 'READY_FOR_PICKUP')
  );

  // 10-minute countdown (600 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600);
  const [copied, setCopied] = useState(false);
  const [activeCode, setActiveCode] = useState<string>(selectedParcel?.otp_code || '839214');

  useEffect(() => {
    if (selectedParcel) {
      setActiveCode(selectedParcel.otp_code);
    }
  }, [selectedParcel]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerate = () => {
    if (selectedParcel) {
      const newCode = mobileStore.regenerateOtp(selectedParcel.id);
      setActiveCode(newCode);
      setSecondsRemaining(600); // Reset to 10 minutes
      if (onOtpRegenerated) onOtpRegenerated(newCode);
    }
  };

  // Progress percentage (600s total)
  const progressPercent = Math.max(0, Math.min(100, (secondsRemaining / 600) * 100));
  const isExpiringSoon = secondsRemaining < 120; // Under 2 mins
  const isExpired = secondsRemaining === 0;

  // Render QR Code SVG matrix based on code
  const qrMatrixPayload = `PF://HANDOVER?pkg=${selectedParcel?.tracking_number || 'PF-8921-IN'}&otp=${activeCode}&exp=${Date.now() + secondsRemaining * 1000}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#0A1128] flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-500" />
            <span>Digital Handover Pass</span>
          </h2>
          <p className="text-xs font-semibold text-slate-600">
            Show this OTP or QR code to the counter staff at Lakeview Hub
          </p>
        </div>
        <Sticker color="yellow" rotate="right" size="xs">
          Single-Use Pass
        </Sticker>
      </div>

      {/* Pass Card Container */}
      <div className="rounded-3xl bg-white border-[3px] border-[#0A1128] shadow-[6px_6px_0px_#0A1128] p-5 sm:p-6 relative overflow-hidden space-y-5">
        {/* Top Watermark Badge */}
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 border-2 border-[#0A1128] flex items-center justify-center text-white shadow-[2px_2px_0px_#0A1128]">
              <PackageCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Target Parcel</span>
              <p className="text-xs font-mono font-black text-[#0A1128]">
                {selectedParcel?.tracking_number || 'PF-8921-IN'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-lg">
            {selectedParcel?.storage_location || 'Rack A — Bin 12'}
          </span>
        </div>

        {/* Big 6-Digit OTP Box */}
        <div className="text-center py-2 bg-[#FEF9F3] rounded-2xl border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] p-4 relative">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>6-Digit Verification Code</span>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 my-2">
            {activeCode.split('').map((char, index) => (
              <div
                key={index}
                className="w-10 h-13 sm:w-12 sm:h-16 rounded-xl bg-white border-[2.5px] border-[#0A1128] shadow-[3px_3px_0px_#0A1128] flex items-center justify-center text-2xl sm:text-3xl font-mono font-black text-[#0A1128]"
              >
                {char}
              </div>
            ))}
          </div>

          {/* Copy Button */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] font-black text-xs text-[#0A1128] flex items-center gap-1.5 transition-all active:translate-y-0.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy OTP</span>
                </>
              )}
            </button>
            <button
              onClick={handleRegenerate}
              className="px-3 py-1.5 rounded-xl bg-amber-300 hover:bg-amber-400 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] font-black text-xs text-[#0A1128] flex items-center gap-1.5 transition-all active:translate-y-0.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* 10-Minute Countdown Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Clock className={`w-3.5 h-3.5 ${isExpiringSoon ? 'text-rose-500 animate-spin' : 'text-blue-600'}`} />
              <span>Expires in:</span>
            </span>
            <span
              className={`font-mono font-black text-sm px-2 py-0.5 rounded-md border ${
                isExpired
                  ? 'bg-rose-100 text-rose-700 border-rose-300'
                  : isExpiringSoon
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              {isExpired ? 'EXPIRED' : formatTime(secondsRemaining)}
            </span>
          </div>

          {/* Progress Track */}
          <div className="w-full h-3 rounded-full bg-slate-100 border-2 border-[#0A1128] overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isExpiringSoon ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Handover QR Code for Scanner Verification */}
        <div className="text-center pt-2 border-t-2 border-slate-100">
          <div className="inline-block p-4 rounded-2xl bg-[#FEF9F3] border-[2.5px] border-[#0A1128] shadow-[4px_4px_0px_#0A1128]">
            <div className="w-36 h-36 mx-auto bg-white rounded-xl p-2 border-2 border-[#0A1128] flex items-center justify-center">
              {/* Crisp SVG QR representation */}
              <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-[#0A1128]">
                {/* 3 Large Corner Position Detection Patterns */}
                <rect x="5" y="5" width="28" height="28" rx="3" fill="#1D4ED8" stroke="#0A1128" strokeWidth="3" />
                <rect x="12" y="12" width="14" height="14" fill="#FFFFFF" rx="1.5" />
                <rect x="15" y="15" width="8" height="8" fill="#1D4ED8" rx="1" />

                <rect x="67" y="5" width="28" height="28" rx="3" fill="#1D4ED8" stroke="#0A1128" strokeWidth="3" />
                <rect x="74" y="12" width="14" height="14" fill="#FFFFFF" rx="1.5" />
                <rect x="77" y="15" width="8" height="8" fill="#1D4ED8" rx="1" />

                <rect x="5" y="67" width="28" height="28" rx="3" fill="#1D4ED8" stroke="#0A1128" strokeWidth="3" />
                <rect x="12" y="74" width="14" height="14" fill="#FFFFFF" rx="1.5" />
                <rect x="15" y="77" width="8" height="8" fill="#1D4ED8" rx="1" />

                {/* Data modules */}
                <rect x="38" y="10" width="7" height="7" rx="1" />
                <rect x="49" y="10" width="12" height="7" rx="1" />
                <rect x="38" y="22" width="10" height="6" fill="#F59E0B" rx="1" />
                <rect x="52" y="22" width="9" height="6" rx="1" />
                <rect x="40" y="32" width="18" height="6" rx="1" />

                <rect x="10" y="38" width="8" height="8" rx="1" />
                <rect x="22" y="38" width="11" height="8" rx="1" />
                <rect x="38" y="42" width="8" height="8" fill="#10B981" rx="1" />
                <rect x="50" y="42" width="14" height="8" rx="1" />
                <rect x="68" y="38" width="10" height="8" rx="1" />
                <rect x="82" y="38" width="10" height="8" rx="1" />

                <rect x="10" y="50" width="14" height="8" rx="1" />
                <rect x="28" y="50" width="8" height="8" rx="1" />
                <rect x="40" y="54" width="12" height="8" rx="1" />
                <rect x="56" y="54" width="16" height="8" fill="#1D4ED8" rx="1" />
                <rect x="76" y="50" width="16" height="8" rx="1" />

                <rect x="38" y="68" width="12" height="8" rx="1" />
                <rect x="54" y="68" width="8" height="8" rx="1" />
                <rect x="66" y="68" width="14" height="8" rx="1" />
                <rect x="84" y="68" width="10" height="8" rx="1" />

                <rect x="38" y="80" width="8" height="8" rx="1" />
                <rect x="50" y="80" width="14" height="8" fill="#F59E0B" rx="1" />
                <rect x="68" y="80" width="10" height="8" rx="1" />
                <rect x="82" y="80" width="12" height="8" rx="1" />
              </svg>
            </div>
            <p className="text-[10px] font-mono font-bold text-slate-500 mt-2">
              Optical Pass · {activeCode}
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3 rounded-xl bg-amber-50 border-2 border-[#0A1128] text-xs font-semibold text-[#0A1128] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Single-use OTP automatically invalidates after counter handover.</span>
        </div>
      </div>
    </div>
  );
};
