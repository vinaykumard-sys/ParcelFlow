import React, { useState } from 'react';
import { X, QrCode, KeyRound, CheckCircle2, AlertOctagon, PackageCheck } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { AdminParcel } from '../../types';

interface ScanOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ScanOtpModal: React.FC<ScanOtpModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [otpInput, setOtpInput] = useState('');
  const [activeMode, setActiveMode] = useState<'otp' | 'qr'>('otp');
  const [result, setResult] = useState<{ success: boolean; parcel?: AdminParcel; message: string } | null>(null);

  if (!isOpen) return null;

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpInput.trim()) return;

    const res = adminService.verifyOtp(otpInput.trim());
    setResult(res);
    if (res.success) {
      setTimeout(() => {
        onSuccess();
      }, 1800);
    }
  };

  const handleSimulateQrScan = (sampleOtp: string) => {
    setOtpInput(sampleOtp);
    const res = adminService.verifyOtp(sampleOtp);
    setResult(res);
    if (res.success) {
      setTimeout(() => {
        onSuccess();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1128]/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#FEF9F3] border-3 border-[#0A1128] rounded-2xl shadow-[8px_8px_0px_#0A1128] p-5 sm:p-6 overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:bg-rose-100 transition-all text-[#0A1128]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-orange-500 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center justify-center text-white">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-[#0A1128]">Scan OTP or QR Code</h3>
            <p className="text-xs font-semibold text-slate-600">Authenticate handover at Hub Counter</p>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="flex rounded-xl border-2 border-[#0A1128] bg-white p-1 mb-5">
          <button
            type="button"
            onClick={() => { setActiveMode('otp'); setResult(null); }}
            className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'otp' ? 'bg-orange-500 text-white shadow-[2px_2px_0px_#0A1128]' : 'text-slate-600'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>6-Digit OTP</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveMode('qr'); setResult(null); }}
            className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'qr' ? 'bg-blue-600 text-white shadow-[2px_2px_0px_#0A1128]' : 'text-slate-600'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Scanner Camera</span>
          </button>
        </div>

        {/* Mode Content */}
        {activeMode === 'otp' ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#0A1128] mb-1.5">
                Enter Resident Handover 6-Digit OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="7 4 2 9 1 6"
                className="w-full text-center tracking-[0.4em] font-mono font-black text-2xl py-3 px-4 rounded-xl border-2.5 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] bg-white text-[#0A1128] focus:outline-none focus:ring-2 focus:ring-orange-500"
                autoFocus
              />
              <div className="flex items-center justify-between mt-2 text-[11px] font-semibold text-slate-500">
                <span>Demo valid codes:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpInput('7492')}
                    className="font-mono underline text-blue-600 hover:text-blue-800"
                  >
                    7492 (Arjun)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpInput('3194')}
                    className="font-mono underline text-blue-600 hover:text-blue-800"
                  >
                    3194 (Priya)
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-orange-500 text-white font-extrabold text-sm border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0A1128] active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify OTP & Authorize Handover</span>
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            {/* Camera Viewfinder Simulation */}
            <div className="relative w-full h-48 bg-slate-900 rounded-xl border-2.5 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] overflow-hidden flex flex-col items-center justify-center p-4">
              <div className="w-36 h-36 border-2 border-emerald-400 border-dashed rounded-xl flex items-center justify-center relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                <div className="w-full h-0.5 bg-emerald-400/80 animate-bounce" />
                <QrCode className="w-16 h-16 text-emerald-400/40" />
              </div>
              <span className="text-[11px] font-mono text-emerald-400 mt-2 font-bold">
                Camera Optical Scanner Active
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSimulateQrScan('7492')}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5"
              >
                Simulate QR: Arjun (A-402)
              </button>
              <button
                type="button"
                onClick={() => handleSimulateQrScan('3194')}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5"
              >
                Simulate QR: Priya (B-104)
              </button>
            </div>
          </div>
        )}

        {/* Verification Result Feedback */}
        {result && (
          <div
            className={`mt-4 p-3.5 rounded-xl border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] animate-slide-up ${
              result.success ? 'bg-emerald-100 text-emerald-950' : 'bg-rose-100 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2">
              {result.success ? (
                <PackageCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              ) : (
                <AlertOctagon className="w-5 h-5 text-rose-700 shrink-0" />
              )}
              <div className="text-xs">
                <p className="font-black">{result.message}</p>
                {result.parcel && (
                  <p className="font-semibold mt-0.5">
                    Package: {result.parcel.tracking_number} | Resident: {result.parcel.recipient_name_on_package} (
                    {result.parcel.apartment?.unit_number})
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
