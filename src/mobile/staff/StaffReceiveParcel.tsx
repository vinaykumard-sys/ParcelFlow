import React, { useState } from 'react';
import { ArrowLeft, Camera, ScanLine, ArrowRight, Package, Check, Sparkles, RefreshCw } from 'lucide-react';

interface StaffReceiveParcelProps {
  onBack: () => void;
  onNext: (data: { trackingNumber: string; carrier: 'Amazon' | 'Flipkart' | 'Myntra' | 'Blue Dart' | 'Delhivery' | 'Other' }) => void;
}

export const StaffReceiveParcel: React.FC<StaffReceiveParcelProps> = ({ onBack, onNext }) => {
  const [trackingId, setTrackingId] = useState('AMZ-99412-BLR');
  const [carrier, setCarrier] = useState<'Amazon' | 'Flipkart' | 'Myntra' | 'Blue Dart' | 'Delhivery' | 'Other'>('Amazon');
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      const generated = 'PF-' + Math.floor(1000 + Math.random() * 9000) + '-IN';
      setTrackingId(generated);
    }, 700);
  };

  const handleContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trackingId.trim()) return;
    onNext({ trackingNumber: trackingId.trim(), carrier });
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
        <h1 className="text-sm font-black text-[#060D1E] tracking-tight">Step 1: Scan Barcode</h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Camera Viewport Simulation */}
        <div className="w-full bg-[#060D1E] rounded-3xl border-[3px] border-[#060D1E] shadow-[4px_4px_0px_#060D1E] p-4 text-white relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
          {/* Target Reticle corners */}
          <div className="relative w-48 h-36 border-2 border-dashed border-blue-400/80 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
            {/* Glowing laser scanline animation */}
            <div
              className={`absolute left-0 right-0 h-1 bg-[#1E60F2] shadow-[0_0_12px_#1E60F2] ${
                isScanning ? 'animate-bounce' : 'top-1/2'
              }`}
            />
            <Camera className="w-8 h-8 text-white/50 mb-1" />
            <span className="text-[10px] font-black tracking-widest uppercase text-blue-200">
              Align Courier Barcode
            </span>
          </div>

          <p className="text-[11px] text-slate-300 font-bold mt-3">
            {isScanning ? 'Detecting barcode...' : 'Point camera at Amazon/Flipkart shipping label'}
          </p>

          <button
            type="button"
            onClick={simulateScan}
            className="mt-3 px-4 py-2 bg-[#1E60F2] hover:bg-blue-600 text-white font-black text-xs rounded-xl border border-white/40 shadow-[2px_2px_0px_#000] flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            {isScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ScanLine className="w-3.5 h-3.5" />}
            <span>{isScanning ? 'Scanning...' : 'Scan Now'}</span>
          </button>
        </div>

        {/* Carrier Selector */}
        <div>
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
            Select Courier Partner
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Amazon', 'Flipkart', 'Myntra', 'Blue Dart', 'Delhivery', 'Other'] as const).map(
              (c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCarrier(c)}
                  className={`py-2 px-1 text-xs font-black rounded-xl border-2 transition-all ${
                    carrier === c
                      ? 'bg-[#1E60F2] text-white border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-[#060D1E]'
                  }`}
                >
                  {c}
                </button>
              )
            )}
          </div>
        </div>

        {/* Manual Input Field */}
        <div className="bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] p-4">
          <label className="text-xs font-black uppercase text-slate-700 block mb-1.5">
            Or Enter Tracking ID Manually
          </label>
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="e.g. AMZ-99412-BLR"
            className="w-full bg-[#FEF9F3] text-sm font-mono font-black text-[#060D1E] p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#1E60F2]"
          />
          {scanSuccess && (
            <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Barcode scanned & verified!
            </p>
          )}
        </div>
      </div>

      {/* Sticky Bottom Next Button */}
      <div className="p-4 bg-white border-t-2 border-[#060D1E]">
        <button
          onClick={handleContinue}
          className="w-full py-3.5 px-4 bg-[#1E60F2] hover:bg-blue-600 active:scale-95 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all"
        >
          <span>Continue to Assign Resident</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
