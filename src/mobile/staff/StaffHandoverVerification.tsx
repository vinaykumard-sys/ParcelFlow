import React, { useState } from 'react';
import { ArrowLeft, QrCode, KeyRound, Camera, Check, AlertCircle, ArrowRight, ScanLine, RefreshCw } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import type { MobileParcel } from '../types';

interface StaffHandoverVerificationProps {
  onBack: () => void;
  onSuccess: (parcel: MobileParcel) => void;
}

export const StaffHandoverVerification: React.FC<StaffHandoverVerificationProps> = ({
  onBack,
  onSuccess,
}) => {
  const { verifyHandover } = useMobileStore();
  const [tab, setTab] = useState<'qr' | 'otp'>('otp');
  const [otpInput, setOtpInput] = useState('742916');
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    const result = verifyHandover(otpInput);
    if (result.success && result.parcel) {
      onSuccess(result.parcel);
    } else {
      setErrorMsg(result.message);
    }
  };

  const simulateQrScan = () => {
    setIsScanning(true);
    setErrorMsg(null);
    setTimeout(() => {
      setIsScanning(false);
      const result = verifyHandover('742916');
      if (result.success && result.parcel) {
        onSuccess(result.parcel);
      } else {
        setErrorMsg('Could not detect valid parcel QR code.');
      }
    }, 700);
  };

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
        <h1 className="text-sm font-black text-[#060D1E] tracking-tight">Handover Verification</h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Verification Tabs: Scan QR / Enter OTP */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/80 rounded-2xl border border-slate-300">
          <button
            type="button"
            onClick={() => {
              setTab('otp');
              setErrorMsg(null);
            }}
            className={`py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              tab === 'otp'
                ? 'bg-white text-[#060D1E] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Enter OTP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('qr');
              setErrorMsg(null);
            }}
            className={`py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              tab === 'qr'
                ? 'bg-white text-[#060D1E] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR Code</span>
          </button>
        </div>

        {/* Tab 1: Enter OTP */}
        {tab === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-5 text-center">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
                Ask Resident for 6-Digit Code
              </label>

              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="742916"
                className="w-full bg-[#FEF9F3] text-center tracking-widest text-2xl font-mono font-black text-[#1E60F2] py-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none"
              />

              <p className="text-[11px] font-bold text-slate-500 mt-2">
                Sample Resident OTP: <span className="text-[#060D1E] font-black">742916</span> (Vinay Kumar, Flat B-402)
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={otpInput.length < 4}
              className="w-full py-3.5 px-4 bg-[#10B981] hover:bg-emerald-600 active:scale-95 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Verify OTP & Handover</span>
            </button>
          </form>
        )}

        {/* Tab 2: Scan QR */}
        {tab === 'qr' && (
          <div className="space-y-4">
            <div className="w-full bg-[#060D1E] rounded-3xl border-[3px] border-[#060D1E] shadow-[4px_4px_0px_#060D1E] p-5 text-white flex flex-col items-center justify-center min-h-[240px]">
              <div className="relative w-44 h-44 border-2 border-dashed border-emerald-400 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
                <div
                  className={`absolute left-0 right-0 h-1 bg-[#10B981] shadow-[0_0_12px_#10B981] ${
                    isScanning ? 'animate-bounce' : 'top-1/2'
                  }`}
                />
                <QrCode className="w-12 h-12 text-white/50 mb-1" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">
                  Align Resident QR Pass
                </span>
              </div>

              <p className="text-[11px] text-slate-300 font-bold mt-3 text-center">
                {isScanning ? 'Reading digital pass...' : 'Ask resident to display QR pass on their phone'}
              </p>

              <button
                type="button"
                onClick={simulateQrScan}
                className="mt-3 px-5 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white font-black text-xs rounded-xl border border-white/40 shadow-[2px_2px_0px_#000] flex items-center gap-2 active:scale-95 transition-transform"
              >
                {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
                <span>{isScanning ? 'Verifying...' : 'Simulate Camera Scan'}</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
