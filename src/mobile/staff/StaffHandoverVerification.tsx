import React, { useState } from 'react';
import {
  ArrowLeft,
  QrCode,
  KeyRound,
  Camera,
  Check,
  AlertCircle,
  ArrowRight,
  ScanLine,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { CameraBarcodeScanner } from '../components/scanner/CameraBarcodeScanner';
import {
  parseQrPayload,
  playScanChime,
  playErrorTone,
  triggerScanHaptic,
  triggerErrorHaptic,
} from '../services/scannerService';
import { useMobileStore } from '../services/mobileState';
import { validateQrToken, validateOtp } from '../../services/otpQrService';
import type { MobileParcel } from '../types';

interface StaffHandoverVerificationProps {
  onBack: () => void;
  onSuccess: (parcel: MobileParcel) => void;
}

export const StaffHandoverVerification: React.FC<StaffHandoverVerificationProps> = ({
  onBack,
  onSuccess,
}) => {
  const { verifyHandover, parcels } = useMobileStore();
  const [tab, setTab] = useState<'qr' | 'otp'>('qr');
  const [otpInput, setOtpInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scannedSummary, setScannedSummary] = useState<string | null>(null);

  /**
   * Process scanned QR code from live camera
   */
  const handleQrScanned = async (decodedText: string) => {
    if (isVerifying) return;
    setIsVerifying(true);
    setErrorMsg(null);

    const parsed = parseQrPayload(decodedText);
    setScannedSummary(parsed.otp || parsed.trackingNumber || decodedText.slice(0, 24));

    // Try Supabase validateQrToken first
    try {
      const qrRes = await validateQrToken(decodedText);
      if (qrRes.success && qrRes.parcelId) {
        // Complete locally as well
        const localMatch = parcels.find(
          (p) => p.id === qrRes.parcelId || p.trackingNumber === qrRes.parcelId
        );
        if (localMatch) {
          const finished = verifyHandover(localMatch.id);
          if (finished.success && finished.parcel) {
            playScanChime();
            triggerScanHaptic();
            setIsVerifying(false);
            onSuccess(finished.parcel);
            return;
          }
        }
      }
    } catch {
      // Continue to local verification
    }

    // Try verification by OTP or tracking code
    const tokenToTry = parsed.otp || parsed.trackingNumber || decodedText;
    const result = verifyHandover(tokenToTry);

    if (result.success && result.parcel) {
      playScanChime();
      triggerScanHaptic();
      setIsVerifying(false);
      onSuccess(result.parcel);
    } else {
      playErrorTone();
      triggerErrorHaptic();
      setErrorMsg(
        result.message || 'Invalid or expired resident QR pass. Ask resident to refresh their screen.'
      );
      setIsVerifying(false);
    }
  };

  /**
   * Process manual OTP entry
   */
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isVerifying || !otpInput.trim()) return;

    setIsVerifying(true);
    setErrorMsg(null);

    const clean = otpInput.trim();
    const result = verifyHandover(clean);

    if (result.success && result.parcel) {
      playScanChime();
      triggerScanHaptic();
      setIsVerifying(false);
      onSuccess(result.parcel);
    } else {
      playErrorTone();
      triggerErrorHaptic();
      setErrorMsg(result.message || 'Incorrect 6-digit OTP code.');
      setIsVerifying(false);
    }
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
        {/* Verification Tabs: Scan QR vs Enter OTP */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/80 rounded-2xl border border-slate-300">
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
        </div>

        {/* Tab 1: Real Camera QR Scanner */}
        {tab === 'qr' && (
          <div className="space-y-3">
            <CameraBarcodeScanner
              onScan={handleQrScanned}
              mode="qr"
              label="Align Resident QR Pass in Reticle"
              hintText="Scan resident phone screen for instant verification"
            />

            {isVerifying && (
              <div className="p-3 bg-blue-50 border-2 border-blue-400 rounded-2xl flex items-center justify-center gap-2 text-xs font-black text-blue-800 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                <span>Verifying QR Pass ({scannedSummary})...</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Enter OTP Fallback */}
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
                onChange={(e) => {
                  setOtpInput(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="e.g. 742916"
                className="w-full bg-[#FEF9F3] text-center tracking-widest text-2xl font-mono font-black text-[#1E60F2] py-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <p className="text-[11px] font-bold text-slate-500 mt-2">
                Code generated on resident app with 10-minute expiry
              </p>
            </div>

            <button
              type="submit"
              disabled={otpInput.length < 4 || isVerifying}
              className="w-full py-3.5 px-4 bg-[#10B981] hover:bg-emerald-600 active:scale-95 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Verify OTP & Handover</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Error Feedback Banner */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border-2 border-rose-400 rounded-2xl text-xs font-bold text-rose-800 flex items-start gap-2 shadow-[2px_2px_0px_#EF4444] animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 stroke-[2.5]" />
            <div>
              <span className="font-black block uppercase text-[10px] text-rose-900 tracking-wider">
                Verification Failed
              </span>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Ready for Pickup Quick Guide */}
        <div className="p-4 bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-[#060D1E]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dual Handover Security Protocol</span>
          </div>
          <p className="text-xs text-slate-600 font-semibold leading-relaxed">
            Every collection requires either an optical scan of the resident's dynamic QR pass or entry of their 6-digit one-time code. Both methods verify parcel ownership and record an immutable audit timestamp.
          </p>
        </div>
      </div>
    </div>
  );
};
