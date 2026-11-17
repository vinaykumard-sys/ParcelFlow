import React, { useState, useEffect } from 'react';
import { ArrowLeft, QrCode, Copy, Check, Clock, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import type { MobileParcel } from '../types';

interface ResidentPickupCodeProps {
  parcel: MobileParcel;
  otpCode?: string;
  onBack: () => void;
  onCollected: () => void;
}

export const ResidentPickupCode: React.FC<ResidentPickupCodeProps> = ({
  parcel,
  otpCode = '742916',
  onBack,
  onCollected,
}) => {
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(otpCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format OTP code into spaced digits "7 4 2 9 1 6"
  const digits = (otpCode || '742916').split('');

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
                  Your 6-Digit Handover OTP
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

              {/* Countdown Timer */}
              <div className="flex items-center justify-center gap-2 text-xs font-black text-rose-600 bg-rose-50 border border-rose-200 py-1.5 px-3 rounded-full mx-auto w-fit">
                <Clock className="w-3.5 h-3.5" />
                <span>Valid for {formatTimer(secondsLeft)} minutes</span>
              </div>
            </div>
          ) : (
            /* High-Contrast QR Code View */
            <div className="space-y-3">
              <div className="p-4 bg-white inline-block rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E]">
                {/* SVG QR Code Simulation */}
                <svg className="w-44 h-44 mx-auto" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="#ffffff" />
                  {/* Corner markers */}
                  <rect x="10" y="10" width="25" height="25" fill="#060D1E" rx="3" />
                  <rect x="15" y="15" width="15" height="15" fill="#ffffff" rx="1" />
                  <rect x="18" y="18" width="9" height="9" fill="#1E60F2" rx="1" />

                  <rect x="65" y="10" width="25" height="25" fill="#060D1E" rx="3" />
                  <rect x="70" y="15" width="15" height="15" fill="#ffffff" rx="1" />
                  <rect x="73" y="18" width="9" height="9" fill="#1E60F2" rx="1" />

                  <rect x="10" y="65" width="25" height="25" fill="#060D1E" rx="3" />
                  <rect x="15" y="70" width="15" height="15" fill="#ffffff" rx="1" />
                  <rect x="18" y="73" width="9" height="9" fill="#1E60F2" rx="1" />

                  {/* Matrix pattern */}
                  <rect x="42" y="15" width="6" height="6" fill="#060D1E" />
                  <rect x="52" y="15" width="6" height="6" fill="#060D1E" />
                  <rect x="42" y="25" width="16" height="6" fill="#1E60F2" />
                  <rect x="42" y="42" width="16" height="16" fill="#060D1E" />
                  <rect x="65" y="42" width="6" height="6" fill="#10B981" />
                  <rect x="75" y="42" width="15" height="6" fill="#060D1E" />
                  <rect x="15" y="45" width="15" height="6" fill="#060D1E" />
                  <rect x="42" y="65" width="12" height="6" fill="#060D1E" />
                  <rect x="65" y="65" width="25" height="25" fill="#060D1E" rx="3" />
                  <rect x="72" y="72" width="11" height="11" fill="#10B981" />
                </svg>
              </div>

              <p className="text-[11px] font-extrabold text-slate-500">
                Hold phone under the hub reader at Tower B gate
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
              <span>{showQr ? 'Show 6-Digit OTP' : 'Show QR Code'}</span>
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

        {/* Instant Demo Simulation for Verification */}
        <div className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-400 shadow-[2px_2px_0px_#F59E0B]">
          <div className="flex items-center gap-1.5 mb-1 text-xs font-black text-amber-950">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Interactive Demo Action</span>
          </div>
          <p className="text-[11px] text-amber-900 font-semibold mb-2.5">
            Test the handover completion flow right now as if the staff scanned your code at the counter:
          </p>
          <button
            onClick={onCollected}
            className="w-full py-2.5 px-3 bg-[#10B981] hover:bg-emerald-600 text-white font-black text-xs rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Simulate Staff Handover (Verify OTP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
