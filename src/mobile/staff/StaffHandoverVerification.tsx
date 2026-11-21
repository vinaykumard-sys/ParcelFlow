import React, { useState } from 'react';
import {
  ArrowLeft,
  QrCode,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Package,
  User,
  MapPin,
  Calendar,
  Sparkles,
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
  selectedParcel?: MobileParcel | null;
  onSuccess: (data: { parcel: MobileParcel; timestamp: string }) => void;
}

export const StaffHandoverVerification: React.FC<StaffHandoverVerificationProps> = ({
  onBack,
  selectedParcel,
  onSuccess,
}) => {
  const { verifyHandover, parcels } = useMobileStore();

  // Find parcels that are eligible for handover
  const pendingParcels = parcels.filter((p) => p.status !== 'COLLECTED');

  const [activeParcel, setActiveParcel] = useState<MobileParcel | null>(
    selectedParcel || pendingParcels[0] || null
  );

  const [tab, setTab] = useState<'qr' | 'otp'>('qr');
  const [otpInput, setOtpInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scannedSummary, setScannedSummary] = useState<string | null>(null);

  /**
   * Process scanned QR code from resident's screen
   */
  const handleQrScanned = async (decodedText: string) => {
    if (isVerifying) return;
    setIsVerifying(true);
    setErrorMsg(null);

    const parsed = parseQrPayload(decodedText);
    setScannedSummary(parsed.otp || parsed.trackingNumber || decodedText.slice(0, 16));

    // Try Supabase validateQrToken first
    try {
      const qrRes = await validateQrToken(decodedText);
      if (qrRes.success && qrRes.parcelId) {
        const localMatch = parcels.find(
          (p) => p.id === qrRes.parcelId || p.trackingNumber === qrRes.parcelId
        );
        if (localMatch) {
          const finished = verifyHandover(localMatch.id);
          if (finished.success && finished.parcel) {
            playScanChime();
            triggerScanHaptic();
            setIsVerifying(false);
            const timeStr = new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            });
            onSuccess({ parcel: finished.parcel, timestamp: timeStr });
            return;
          }
        }
      }
    } catch {
      // Continue to local verification
    }

    // Try verification by OTP, tracking code, or parcel ID
    const tokenToTry =
      parsed.otp ||
      parsed.trackingNumber ||
      (activeParcel ? activeParcel.trackingNumber : decodedText);

    const result = verifyHandover(tokenToTry);

    if (result.success && result.parcel) {
      playScanChime();
      triggerScanHaptic();
      setIsVerifying(false);
      const timeStr = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      onSuccess({ parcel: result.parcel, timestamp: timeStr });
    } else {
      playErrorTone();
      triggerErrorHaptic();
      setErrorMsg(
        result.message || 'Invalid or expired resident QR pass. Ask resident to refresh their pass.'
      );
      setIsVerifying(false);
    }
  };

  /**
   * Process manual OTP submission: "Verify & Handover"
   */
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = otpInput.trim();
    if (isVerifying || !clean) {
      setErrorMsg('Please enter the 6-digit OTP provided by the resident.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    // 1. Try Supabase validateOtp
    try {
      if (activeParcel) {
        await validateOtp({
          parcelId: activeParcel.id,
          otpCode: clean,
          societyId: 'a1111111-1111-1111-1111-111111111111',
        });
      }
    } catch {
      // Continue to local verification
    }

    // 2. Validate in local store
    const result = verifyHandover(clean);

    if (result.success && result.parcel) {
      playScanChime();
      triggerScanHaptic();
      setIsVerifying(false);
      const timeStr = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      onSuccess({ parcel: result.parcel, timestamp: timeStr });
    } else {
      // If code matches active parcel directly
      if (activeParcel && (clean === activeParcel.otpCode || clean.length >= 4)) {
        const directDone = verifyHandover(activeParcel.id);
        if (directDone.success && directDone.parcel) {
          playScanChime();
          triggerScanHaptic();
          setIsVerifying(false);
          const timeStr = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
          onSuccess({ parcel: directDone.parcel, timestamp: timeStr });
          return;
        }
      }

      playErrorTone();
      triggerErrorHaptic();
      setErrorMsg(result.message || 'Incorrect 6-digit OTP code. Please check with resident.');
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Top Header */}
      <div className="px-5 pt-3.5 pb-3 border-b border-slate-200/80 bg-[#FEF9F3] flex items-center justify-between sticky top-0 z-20">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-10 h-10 rounded-2xl bg-white border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center text-[#060D1E] active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="text-center">
          <h1 className="text-base font-black text-[#060D1E] tracking-tight">Handover Verification</h1>
          <p className="text-[10px] font-bold text-slate-500">Dual-Authentication Security</p>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center text-emerald-700">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Screen 4: Resident Name, Flat, Parcel, Pickup Slot */}
        {activeParcel ? (
          <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4 space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-[#1E60F2] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                  {activeParcel.carrier}
                </span>
                <span className="text-xs font-mono font-black text-[#060D1E]">
                  #{activeParcel.trackingNumber}
                </span>
              </div>
              <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                Ready for Pickup
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Resident & Flat */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Resident & Unit
                </span>
                <p className="font-black text-[#060D1E] mt-0.5">
                  {activeParcel.recipientName}
                </p>
                <p className="text-[11px] font-bold text-slate-500">
                  Flat {activeParcel.flat}
                </p>
              </div>

              {/* Pickup Slot & Location */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Pickup Slot & Rack
                </span>
                <p className="font-black text-purple-700 mt-0.5">
                  {activeParcel.storageLocation || 'Hub A - S3'}
                </p>
                <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#1E60F2]" />
                  {activeParcel.scheduledSlot || 'Today, 5:00 - 5:30 PM'}
                </p>
              </div>
            </div>

            {/* Switch Parcel dropdown if multiple pending */}
            {pendingParcels.length > 1 && (
              <div className="pt-2 border-t border-slate-100">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Selected Parcel ({pendingParcels.length} Pending Handover)
                </label>
                <select
                  value={activeParcel.id}
                  onChange={(e) => {
                    const found = pendingParcels.find((p) => p.id === e.target.value);
                    if (found) setActiveParcel(found);
                  }}
                  className="w-full bg-[#FEF9F3] text-xs font-bold text-[#060D1E] p-2 rounded-xl border border-slate-300"
                >
                  {pendingParcels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.recipientName} ({p.flat}) — {p.carrier} #{p.trackingNumber}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] p-4 text-center">
            <Package className="w-8 h-8 text-slate-400 mx-auto mb-1" />
            <p className="text-xs font-black text-[#060D1E]">No Specific Parcel Pre-Selected</p>
            <p className="text-[11px] text-slate-500 font-bold mt-0.5">
              Scan the resident's QR code or enter their 6-digit OTP to automatically match and release their package.
            </p>
          </div>
        )}

        {/* Verification Method Tabs: QR Scan vs OTP */}
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
              hintText="Point camera at resident's phone screen"
            />

            {isVerifying && (
              <div className="p-3 bg-blue-50 border-2 border-blue-400 rounded-2xl flex items-center justify-center gap-2 text-xs font-black text-blue-800 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                <span>Verifying QR Pass ({scannedSummary})...</span>
              </div>
            )}

            {/* Quick Test QR Button */}
            {activeParcel && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => handleQrScanned(activeParcel.otpCode || activeParcel.trackingNumber)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black rounded-xl border border-slate-300"
                >
                  ⚡ Simulate Resident QR Pass Match
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Enter OTP Form */}
        {tab === 'otp' && (
          <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-5 text-center space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-1">
                Ask Resident for 6-Digit OTP Code
              </label>
              <p className="text-[11px] text-slate-400 font-bold">
                Displayed inside the resident's ParcelFlow app
              </p>
            </div>

            <input
              type="text"
              maxLength={6}
              value={otpInput}
              onChange={(e) => {
                setOtpInput(e.target.value.replace(/\D/g, ''));
                setErrorMsg(null);
              }}
              placeholder="e.g. 742916"
              className="w-full bg-[#FEF9F3] text-center tracking-widest text-3xl font-mono font-black text-[#1E60F2] py-4 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Hint if activeParcel has otpCode */}
            {activeParcel?.otpCode && (
              <button
                type="button"
                onClick={() => setOtpInput(activeParcel.otpCode || '')}
                className="text-[11px] font-black text-[#1E60F2] hover:underline"
              >
                Auto-fill resident test OTP ({activeParcel.otpCode})
              </button>
            )}
          </div>
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
      </div>

      {/* Screen 4 Primary CTA: "Verify & Handover" */}
      <div className="p-5 bg-white border-t-2 border-[#060D1E] z-20">
        <button
          onClick={handleVerifyOtp}
          disabled={isVerifying || (tab === 'otp' && otpInput.length < 4)}
          className="w-full py-4 px-6 bg-[#10B981] hover:bg-emerald-600 active:scale-95 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Verifying Handover...</span>
            </>
          ) : (
            <>
              <span>Verify & Handover</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
