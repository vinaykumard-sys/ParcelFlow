import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Zap,
  ZapOff,
  Camera,
  ScanLine,
  Keyboard,
  Barcode,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Package,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { CameraBarcodeScanner } from '../components/scanner/CameraBarcodeScanner';
import {
  playScanChime,
  playErrorTone,
  triggerScanHaptic,
  triggerErrorHaptic,
  detectCarrier,
  checkDuplicateParcel,
} from '../services/scannerService';
import type { CourierCarrier } from '../services/scannerService';
import { useMobileStore } from '../services/mobileState';
import { supabase } from '../../services/supabaseClient';

interface StaffScannerProps {
  onBack: () => void;
  onScanComplete: (data: { trackingNumber: string; carrier: CourierCarrier; existingParcel?: any }) => void;
  onManualEntry: () => void;
}

export const StaffScanner: React.FC<StaffScannerProps> = ({
  onBack,
  onScanComplete,
  onManualEntry,
}) => {
  const { parcels, selectedSociety } = useMobileStore();
  const [torchOn, setTorchOn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<{
    message: string;
    parcel: any;
  } | null>(null);

  const handleBarcodeScanned = async (rawCode: string) => {
    if (isProcessing) return;
    const clean = rawCode.trim().toUpperCase();
    if (!clean) return;

    setIsProcessing(true);
    setDuplicateWarning(null);
    setScanMessage(`Detected: ${clean}`);

    // Audio & haptic feedback
    playScanChime();
    triggerScanHaptic();

    const carrier = detectCarrier(clean);

    // Check backend Supabase + local cache for existing parcel
    try {
      const dupCheck = await checkDuplicateParcel(clean, selectedSociety?.id);
      if (dupCheck.isDuplicate && dupCheck.parcel) {
        playErrorTone();
        triggerErrorHaptic();
        setDuplicateWarning({
          message: dupCheck.message || `Parcel ${clean} is already logged in ${dupCheck.parcel.storageLocation}`,
          parcel: dupCheck.parcel,
        });
        setIsProcessing(false);
        return;
      }
    } catch {
      // Continue if query fails
    }

    setTimeout(() => {
      setIsProcessing(false);
      onScanComplete({
        trackingNumber: clean,
        carrier,
      });
    }, 450);
  };

  const handleManualSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = manualInput.trim().toUpperCase();
    if (!clean) return;

    setShowManualModal(false);
    handleBarcodeScanned(clean);
  };

  // Quick simulated scan helper for desktop testing
  const handleSimulateScan = (carrier: CourierCarrier, prefix: string) => {
    const randomNum = Math.floor(1000000 + Math.random() * 9000000);
    const tracking = `${prefix}${randomNum}`;
    handleBarcodeScanned(tracking);
  };

  return (
    <div className="flex flex-col h-full bg-[#060D1E] text-white select-none relative overflow-hidden">
      {/* Top Header */}
      <div className="px-5 pt-3 pb-3 bg-[#060D1E]/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-30">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="text-center">
          <h1 className="text-sm font-black text-white tracking-wide">Scan Parcel</h1>
          <p className="text-[10px] font-bold text-slate-400">Security Inbound Terminal</p>
        </div>

        {/* Flash Toggle */}
        <button
          onClick={() => setTorchOn(!torchOn)}
          aria-label="Toggle Flash"
          className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all active:scale-95 ${
            torchOn
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.6)]'
              : 'bg-slate-900 border-slate-700/80 text-slate-300'
          }`}
        >
          {torchOn ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Viewport Section */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-5">
        {/* Background Viewfinder Area */}
        <div className="relative w-full max-w-[340px] aspect-[4/3] rounded-3xl bg-slate-950 border-2 border-slate-800 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
          {/* Live Camera Scanner Integration */}
          <div className="absolute inset-0 z-0">
            <CameraBarcodeScanner
              onScan={handleBarcodeScanned}
              mode="all"
              autoStart={true}
              label=""
              hintText=""
            />
          </div>

          {/* High-tech illuminated Corner Scan Brackets Overlay */}
          <div className="absolute inset-5 z-10 pointer-events-none flex flex-col justify-between">
            {/* Top Corners */}
            <div className="flex justify-between w-full">
              <div className="w-8 h-8 border-t-4 border-l-4 border-[#00F0FF] rounded-tl-xl shadow-[0_0_12px_#00F0FF]" />
              <div className="w-8 h-8 border-t-4 border-r-4 border-[#00F0FF] rounded-tr-xl shadow-[0_0_12px_#00F0FF]" />
            </div>

            {/* Middle Barcode Target Reticle with animated scanning laser line */}
            <div className="relative w-full h-24 flex items-center justify-center">
              <div className="absolute inset-x-2 h-[2px] bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent shadow-[0_0_10px_#00F0FF] animate-pulse" />
              <div className="opacity-40 flex flex-col items-center gap-1">
                <Barcode className="w-12 h-12 text-[#00F0FF]" />
                <span className="text-[9px] font-mono tracking-widest text-[#00F0FF] font-bold uppercase">
                  READY FOR OPTICAL DECODE
                </span>
              </div>
            </div>

            {/* Bottom Corners */}
            <div className="flex justify-between w-full">
              <div className="w-8 h-8 border-b-4 border-l-4 border-[#00F0FF] rounded-bl-xl shadow-[0_0_12px_#00F0FF]" />
              <div className="w-8 h-8 border-b-4 border-r-4 border-[#00F0FF] rounded-br-xl shadow-[0_0_12px_#00F0FF]" />
            </div>
          </div>

          {/* In-view status pill */}
          {isProcessing && (
            <div className="absolute top-3 z-20 px-3 py-1 bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] rounded-full text-[11px] font-black flex items-center gap-1.5 backdrop-blur-md">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Decoding Barcode...</span>
            </div>
          )}
        </div>

        {/* Instruction Text below Viewfinder */}
        <div className="mt-5 text-center max-w-[280px]">
          <p className="text-xs font-black text-slate-100 tracking-wide">
            Align barcode or QR code inside the frame
          </p>
          <p className="text-[11px] font-bold text-slate-400 mt-1">
            Compatible with Amazon, Flipkart, Myntra, Blue Dart & Delhivery labels
          </p>
        </div>

        {/* Duplicate Warning Dialog / Notification if duplicate detected */}
        {duplicateWarning && (
          <div className="w-full max-w-[340px] mt-4 p-3.5 bg-rose-950/90 border-2 border-rose-500 rounded-2xl text-left shadow-xl animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-rose-200 uppercase tracking-wider">
                  Duplicate Detected
                </p>
                <p className="text-[11px] text-rose-300 font-bold mt-0.5">
                  {duplicateWarning.message}
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onScanComplete({
                        trackingNumber: duplicateWarning.parcel.trackingNumber,
                        carrier: duplicateWarning.parcel.carrierName || 'Amazon',
                        existingParcel: duplicateWarning.parcel,
                      });
                    }}
                    className="px-3 py-1 bg-white text-rose-950 rounded-lg text-xs font-black"
                  >
                    View Parcel
                  </button>
                  <button
                    onClick={() => setDuplicateWarning(null)}
                    className="px-3 py-1 bg-rose-800 text-white rounded-lg text-xs font-bold"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Simulation Row for Developer / Testing without physical barcodes */}
        <div className="w-full max-w-[340px] mt-4 pt-3 border-t border-slate-800/80">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 text-center mb-2">
            Quick Test Barcodes
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => handleSimulateScan('Amazon', 'AMZ')}
              className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black text-amber-300 text-center active:scale-95"
            >
              + Amazon
            </button>
            <button
              onClick={() => handleSimulateScan('Flipkart', 'FMP')}
              className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black text-blue-300 text-center active:scale-95"
            >
              + Flipkart
            </button>
            <button
              onClick={() => handleSimulateScan('Blue Dart', 'BD')}
              className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black text-emerald-300 text-center active:scale-95"
            >
              + Blue Dart
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Area */}
      <div className="p-5 bg-[#060D1E] border-t border-slate-800 z-30">
        <button
          onClick={() => setShowManualModal(true)}
          className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black text-xs rounded-2xl border-2 border-slate-700 shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <Keyboard className="w-4 h-4 text-[#00F0FF]" />
          <span>Enter Tracking ID</span>
        </button>
      </div>

      {/* Manual Entry Sheet Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center p-0">
          <div className="w-full max-w-md bg-[#FEF9F3] text-[#060D1E] rounded-t-3xl border-t-2 border-[#060D1E] p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-black text-[#060D1E]">Enter Tracking ID</h2>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-xs font-bold text-slate-500 hover:text-black"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <input
                type="text"
                autoFocus
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="e.g. AMZ-7845321 or FMP12345"
                className="w-full bg-white text-base font-mono font-black text-[#060D1E] p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none focus:border-[#1E60F2]"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!manualInput.trim()}
                  className="flex-1 py-3.5 px-4 bg-[#1E60F2] hover:bg-blue-600 active:scale-95 text-white font-black text-xs rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] transition-all disabled:opacity-50"
                >
                  Confirm & Process
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowManualModal(false);
                    onManualEntry();
                  }}
                  className="py-3.5 px-4 bg-white hover:bg-slate-100 text-[#060D1E] font-black text-xs rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]"
                >
                  Full Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
