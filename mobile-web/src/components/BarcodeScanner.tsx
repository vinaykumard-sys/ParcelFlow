import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, RefreshCw, Zap, CheckCircle2, Package, ArrowRight, AlertTriangle } from 'lucide-react';
import { Sticker } from './Sticker';
import { mobileStore, MobileParcel } from '../services/supabaseService';

interface BarcodeScannerProps {
  onScanComplete?: (code: string, parcel?: MobileParcel) => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScanComplete }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [manualCode, setManualCode] = useState('');
  const [lastScanned, setLastScanned] = useState<{ code: string; parcel?: MobileParcel; isNew: boolean } | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sound feedback synthesizer
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch beep
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {}
  };

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([80, 40, 80]);
    }
  };

  const startCamera = async (mode = facingMode) => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported on this browser context.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err: any) {
      console.warn('Camera error:', err);
      setIsStreaming(false);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Tap "Allow Camera" or use manual barcode entry below.'
          : 'Optical camera feed unavailable in current environment. Use quick manual barcode entry.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  const toggleFacingMode = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    if (isStreaming) {
      startCamera(next);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const handleProcessCode = (code: string) => {
    if (!code.trim()) return;
    playBeep();
    triggerHaptic();

    const res = mobileStore.intakeBarcode(code);
    setLastScanned({
      code,
      parcel: res.parcel,
      isNew: res.isNew,
    });

    if (onScanComplete) {
      onScanComplete(code, res.parcel);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#0A1128] flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            <span>Barcode & QR Scanner</span>
          </h2>
          <p className="text-xs font-semibold text-slate-600">
            Hardware camera optical intake & resident verification
          </p>
        </div>
        <Sticker color="mint" rotate="slight-right" size="xs">
          HTML5 MediaDevices
        </Sticker>
      </div>

      {/* Video Viewfinder Container */}
      <div className="relative rounded-2xl bg-black border-[3px] border-[#0A1128] shadow-[5px_5px_0px_#0A1128] overflow-hidden aspect-[4/3] flex flex-col items-center justify-center">
        {/* Real Video Stream */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`w-full h-full object-cover transition-opacity duration-300 ${isStreaming ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Laser Scanning Animation Overlay */}
        {isStreaming && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
            <div className="relative w-full max-w-[240px] aspect-square border-2 border-dashed border-emerald-400 rounded-2xl flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

              {/* Laser line */}
              <div className="absolute w-full h-0.5 bg-rose-500 shadow-[0_0_12px_#EF4444] animate-scan-line" />

              <span className="text-[10px] font-mono font-black text-emerald-300 bg-black/60 px-2 py-0.5 rounded border border-emerald-400/50">
                ALIGN BARCODE / QR
              </span>
            </div>
          </div>
        )}

        {/* Fallback / Permission Prompt when camera not streaming */}
        {!isStreaming && (
          <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center bg-slate-900 text-white space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
              <CameraOff className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-black">Camera Standby</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                {cameraError || 'Camera permissions required for optical scanning.'}
              </p>
            </div>
            <button
              onClick={() => startCamera()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs border-2 border-white/20 shadow-md transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry / Start Camera</span>
            </button>
          </div>
        )}

        {/* Viewfinder Controls Toolbar */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <button
            onClick={toggleFacingMode}
            title="Flip Camera"
            className="p-2 rounded-xl bg-white/90 backdrop-blur border-2 border-[#0A1128] text-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:bg-white transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {isStreaming && (
            <button
              onClick={stopCamera}
              title="Pause Camera"
              className="p-2 rounded-xl bg-rose-500 border-2 border-[#0A1128] text-white shadow-[2px_2px_0px_#0A1128] hover:bg-rose-600 transition-all"
            >
              <CameraOff className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Manual Barcode Entry Fallback & Test Presets */}
      <div className="p-4 rounded-2xl bg-white border-[2.5px] border-[#0A1128] shadow-[4px_4px_0px_#0A1128] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700">
            Manual Barcode / QR Decoder
          </span>
          <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
            AWB Tracking Entry
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleProcessCode(manualCode);
            setManualCode('');
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="e.g. PF-8921-IN or FK-77402-BLR"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
            className="flex-1 px-3 py-2.5 rounded-xl bg-[#FEF9F3] border-2 border-[#0A1128] font-mono text-xs font-bold text-[#0A1128] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[2px_2px_0px_#0A1128]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] active:translate-y-0.5 transition-all flex items-center gap-1"
          >
            <span>Scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Sample Barcodes */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-bold text-slate-500">Test Codes:</span>
          {['PF-8921-IN', 'FK-77402-BLR', 'AMZN-4921'].map((code) => (
            <button
              key={code}
              onClick={() => handleProcessCode(code)}
              className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-slate-100 hover:bg-amber-100 border border-[#0A1128] text-[#0A1128] shadow-[1px_1px_0px_#0A1128] transition-all"
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Scanned Result Banner */}
      {lastScanned && lastScanned.parcel && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-[2.5px] border-[#0A1128] shadow-[4px_4px_0px_#0A1128] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 border-2 border-[#0A1128] flex items-center justify-center text-white shadow-[2px_2px_0px_#0A1128]">
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-[#0A1128]">
                    {lastScanned.parcel.tracking_number}
                  </span>
                  <Sticker color="mint" rotate="none" size="xs">
                    {lastScanned.isNew ? 'New Intake' : 'Matched'}
                  </Sticker>
                </div>
                <p className="text-xs font-bold text-slate-700 mt-0.5">
                  Recipient: {lastScanned.parcel.recipient_name} ({lastScanned.parcel.recipient_flat})
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-lg border border-blue-300">
              {lastScanned.parcel.storage_location}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
