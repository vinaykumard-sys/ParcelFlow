import React, { useState } from 'react';
import { QrCode, KeyRound, CheckCircle2, AlertOctagon, PackageCheck, RefreshCw, Smartphone, Camera } from 'lucide-react';
import { Sticker } from '../components/Sticker';
import { adminService } from '../services/adminService';
import type { AdminParcel } from '../types';

interface OtpScannerScreenProps {
  refreshTrigger: number;
}

export const OtpScannerScreen: React.FC<OtpScannerScreenProps> = ({ refreshTrigger }) => {
  const [otpCode, setOtpCode] = useState('');
  const [activeTab, setActiveTab] = useState<'scan' | 'generate'>('scan');
  const [result, setResult] = useState<{ success: boolean; parcel?: AdminParcel; message: string } | null>(null);

  // Generator states
  const [selectedParcelId, setSelectedParcelId] = useState('PF-8921-IN');
  const [generatedToken, setGeneratedToken] = useState<{ otp: string; qr: string } | null>(null);

  const parcels = adminService.getParcels();

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpCode.trim()) return;

    const res = adminService.verifyOtp(otpCode.trim());
    setResult(res);
  };

  const handleSimulateScan = (code: string) => {
    setOtpCode(code);
    const res = adminService.verifyOtp(code);
    setResult(res);
  };

  const handleGenerateToken = (e: React.FormEvent) => {
    e.preventDefault();
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedToken({
      otp: newOtp,
      qr: `PF://VERIFY?pkg=${selectedParcelId}&otp=${newOtp}&ts=${Date.now()}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-[#0A1128] tracking-tight">OTP & QR Verification Interface</h2>
            <Sticker color="mint" rotate="right" size="xs">
              Hub Handover Terminal
            </Sticker>
          </div>
          <p className="text-xs font-semibold text-slate-600">
            Counter verification tool used by society hub operators to release packages securely.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl border-2 border-[#0A1128] bg-white p-1">
          <button
            onClick={() => { setActiveTab('scan'); setResult(null); }}
            className={`py-1.5 px-4 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'scan' ? 'bg-orange-500 text-white shadow-[2px_2px_0px_#0A1128]' : 'text-slate-600'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Counter Scanner</span>
          </button>
          <button
            onClick={() => { setActiveTab('generate'); setResult(null); }}
            className={`py-1.5 px-4 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'generate' ? 'bg-blue-600 text-white shadow-[2px_2px_0px_#0A1128]' : 'text-slate-600'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>OTP Dispatcher</span>
          </button>
        </div>
      </div>

      {activeTab === 'scan' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Camera Optical Scanner Simulator */}
          <div className="rounded-2xl bg-white border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-[#0A1128] flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>Hub Camera QR Scanner</span>
              </h3>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                ● 1080p Optical Feed Active
              </span>
            </div>

            <div className="relative w-full h-64 bg-slate-900 rounded-xl border-2.5 border-[#0A1128] overflow-hidden flex flex-col items-center justify-center p-4">
              <div className="w-48 h-48 border-2 border-emerald-400 border-dashed rounded-xl flex items-center justify-center relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                <div className="w-full h-0.5 bg-emerald-400/90 animate-bounce" />
                <QrCode className="w-20 h-20 text-emerald-400/40" />
              </div>
              <span className="text-[11px] font-mono text-emerald-400 mt-3 font-bold">
                Align resident app QR code inside frame
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase text-slate-500 block">
                Simulate Camera Handover Scans:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateScan('7492')}
                  className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128]"
                >
                  Scan QR: Arjun (A-402)
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateScan('3194')}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128]"
                >
                  Scan QR: Priya (B-104)
                </button>
              </div>
            </div>
          </div>

          {/* Right: Manual 4-Digit OTP Entry */}
          <div className="rounded-2xl bg-white border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] p-5 sm:p-6 space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-orange-500 text-white border-2 border-[#0A1128]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#0A1128]">Manual 4-Digit OTP Entry</h3>
                  <p className="text-xs font-semibold text-slate-500">Provided by resident or authorized collector</p>
                </div>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#0A1128] mb-1.5">
                    Resident 4-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="7 4 9 2"
                    className="w-full text-center tracking-[0.5em] font-mono font-black text-3xl py-4 px-4 rounded-xl border-3 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] bg-[#FFFDF9] text-[#0A1128] focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-orange-500 text-white font-extrabold text-sm border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authenticate & Release Package</span>
                </button>
              </form>
            </div>

            {/* Result Box */}
            {result && (
              <div
                className={`p-4 rounded-xl border-2.5 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] animate-slide-up ${
                  result.success ? 'bg-emerald-100 text-emerald-950' : 'bg-rose-100 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  {result.success ? (
                    <PackageCheck className="w-7 h-7 text-emerald-700 shrink-0" />
                  ) : (
                    <AlertOctagon className="w-7 h-7 text-rose-700 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-black text-sm">{result.message}</h4>
                    {result.parcel && (
                      <p className="text-xs font-bold mt-1 text-slate-700">
                        {result.parcel.recipient_name_on_package} ({result.parcel.apartment?.unit_number}) • {result.parcel.courier_company} • Assigned: {result.parcel.storage_location?.shelf || 'Shelf A1'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* OTP Dispatcher Tool */
        <div className="max-w-xl mx-auto rounded-2xl bg-white border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-[#0A1128]">Generate Standby Handover Token</h3>
            <p className="text-xs font-semibold text-slate-500">
              Generate an emergency OTP/QR code for offline or authorized family member pickups.
            </p>
          </div>

          <form onSubmit={handleGenerateToken} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">Select Parcel</label>
              <select
                value={selectedParcelId}
                onChange={(e) => setSelectedParcelId(e.target.value)}
                className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128]"
              >
                {parcels.map((p) => (
                  <option key={p.id} value={p.tracking_number}>
                    {p.tracking_number} — {p.recipient_name_on_package} ({p.apartment?.unit_number})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128]"
            >
              Generate Standby Token
            </button>
          </form>

          {generatedToken && (
            <div className="p-4 rounded-xl bg-amber-50 border-2 border-[#0A1128] text-center space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-500">Active Handover Code</span>
              <div className="font-mono text-3xl font-black text-[#0A1128] tracking-widest">
                {generatedToken.otp}
              </div>
              <p className="text-[11px] font-semibold text-slate-600">
                Valid for 15 minutes. Resident notified via SMS and WhatsApp.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
