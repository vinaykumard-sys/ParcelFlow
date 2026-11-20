import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, ScanLine, ArrowRight, Package, Check, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { identifyCarrier } from '../../services/staffService';
import { supabase } from '../../services/supabaseClient';
import { CameraBarcodeScanner } from '../components/scanner/CameraBarcodeScanner';

interface StaffReceiveParcelProps {
  onBack: () => void;
  onNext: (data: { trackingNumber: string; carrier: 'Amazon' | 'Flipkart' | 'Myntra' | 'Blue Dart' | 'Delhivery' | 'Other' }) => void;
}

export const StaffReceiveParcel: React.FC<StaffReceiveParcelProps> = ({ onBack, onNext }) => {
  const [trackingId, setTrackingId] = useState('');
  const [carrier, setCarrier] = useState<'Amazon' | 'Flipkart' | 'Myntra' | 'Blue Dart' | 'Delhivery' | 'Other'>('Amazon');
  const [useLiveCamera, setUseLiveCamera] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Automatically detect carrier when trackingId changes
  useEffect(() => {
    if (trackingId.trim()) {
      const detected = identifyCarrier(trackingId);
      setCarrier(detected);
    }
  }, [trackingId]);

  // Duplicate scan protection check
  const checkDuplicate = async (tid: string): Promise<boolean> => {
    try {
      const clean = tid.trim().toUpperCase();
      const { data } = await supabase
        .from('parcels')
        .select('tracking_number, status, storage_locations(rack, shelf)')
        .eq('tracking_number', clean)
        .maybeSingle();

      if (data && !['COMPLETED', 'HANDED_OVER', 'CANCELLED'].includes(data.status)) {
        const slot = (data.storage_locations as any)?.rack
          ? `at ${(data.storage_locations as any)?.rack} - ${(data.storage_locations as any)?.shelf}`
          : '';
        if (slot) {
          setDuplicateWarning(`Parcel already stored: Package ${clean} is active ${slot}.`);
          return true;
        }
        // Matched pre-registered order: Allow intake and rack assignment
        setDuplicateWarning(null);
        return false;
      }
      setDuplicateWarning(null);
      return false;
    } catch {
      setDuplicateWarning(null);
      return false;
    }
  };

  const simulateScan = async () => {
    setIsScanning(true);
    setDuplicateWarning(null);
    setTimeout(async () => {
      setIsScanning(false);
      setScanSuccess(true);
      const generated = 'PF-' + Math.floor(1000 + Math.random() * 9000) + '-IN';
      setTrackingId(generated);
      await checkDuplicate(generated);
    }, 700);
  };

  const [submitting, setSubmitting] = useState(false);

  const handleContinue = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (submitting || !trackingId.trim()) return;

    setSubmitting(true);
    try {
      const isDup = await checkDuplicate(trackingId);
      if (isDup) {
        setSubmitting(false);
        return;
      }
      onNext({ trackingNumber: trackingId.trim().toUpperCase(), carrier });
    } catch {
      setSubmitting(false);
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
        <h1 className="text-sm font-black text-[#060D1E] tracking-tight">Step 1: Scan Barcode</h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Real Live Camera Scanner or Reticle */}
        {useLiveCamera ? (
          <div className="space-y-2">
            <CameraBarcodeScanner
              mode="barcode"
              label="Align Shipping Label in Reticle"
              hintText="Scan courier 1D barcode or 2D QR code"
              onScan={async (decoded) => {
                const clean = decoded.trim().toUpperCase();
                setTrackingId(clean);
                setUseLiveCamera(false);
                await checkDuplicate(clean);
              }}
            />
            <button
              type="button"
              onClick={() => setUseLiveCamera(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Switch to Manual Entry
            </button>
          </div>
        ) : (
          <div className="w-full bg-[#060D1E] rounded-3xl border-[3px] border-[#060D1E] shadow-[4px_4px_0px_#060D1E] p-4 text-white relative overflow-hidden flex flex-col items-center justify-center min-h-[190px]">
            <div className="relative w-48 h-28 border-2 border-dashed border-blue-400/80 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
              <Camera className="w-8 h-8 text-white/50 mb-1" />
              <span className="text-[10px] font-black tracking-widest uppercase text-blue-200">
                Scan Shipping Label
              </span>
            </div>

            <p className="text-[11px] text-slate-300 font-bold mt-2">
              Point camera at Amazon, Flipkart or Blue Dart shipping label
            </p>

            <button
              type="button"
              onClick={() => setUseLiveCamera(true)}
              className="mt-3 px-4 py-2 bg-[#1E60F2] hover:bg-blue-600 text-white font-black text-xs rounded-xl border border-white/40 shadow-[2px_2px_0px_#000] flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>Open Camera Scanner</span>
            </button>
          </div>
        )}

        {/* Carrier Selector with Auto-Detection Badge */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">
              Courier Partner
            </label>
            <span className="text-[10px] font-black text-[#1E60F2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              Auto-Detected: {carrier}
            </span>
          </div>
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
            onChange={(e) => {
              setTrackingId(e.target.value);
              checkDuplicate(e.target.value);
            }}
            placeholder="e.g. AMZ-99412-BLR"
            className="w-full bg-[#FEF9F3] text-sm font-mono font-black text-[#060D1E] p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#1E60F2]"
          />
          {scanSuccess && (
            <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Barcode scanned & verified!
            </p>
          )}

          {duplicateWarning && (
            <div className="mt-2 p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{duplicateWarning}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Next Button */}
      <div className="p-4 bg-white border-t-2 border-[#060D1E]">
        <button
          onClick={handleContinue}
          disabled={Boolean(duplicateWarning) || !trackingId.trim()}
          className="w-full py-3.5 px-4 bg-[#1E60F2] hover:bg-blue-600 active:scale-95 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <span>Continue to Assign Resident</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
