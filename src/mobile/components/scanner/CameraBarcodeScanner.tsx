// ============================================================================
// REAL DEVICE CAMERA BARCODE & QR SCANNER (src/mobile/components/scanner/CameraBarcodeScanner.tsx)
// Live video viewfinder, BarcodeDetector API + Html5Qrcode dual engine,
// robust permission state machine, bounding box tracking, and torch/camera controls
// ============================================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  CameraOff,
  RefreshCw,
  Zap,
  ZapOff,
  SwitchCamera,
  AlertTriangle,
  Settings,
  ScanLine,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { CameraPermissionModal } from './CameraPermissionModal';
import { playScanChime, triggerScanHaptic } from '../../services/scannerService';

export type CameraPermissionState =
  | 'not_requested'
  | 'prompt'
  | 'granted'
  | 'denied'
  | 'permanently_denied'
  | 'unavailable_busy'
  | 'backgrounded';

export interface DetectedBarcode {
  rawValue: string;
  format: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  cornerPoints?: Array<{ x: number; y: number }>;
}

interface CameraBarcodeScannerProps {
  onScan: (code: string, format?: string) => void;
  mode?: 'barcode' | 'qr' | 'all';
  label?: string;
  hintText?: string;
  autoStart?: boolean;
}

export const CameraBarcodeScanner: React.FC<CameraBarcodeScannerProps> = ({
  onScan,
  mode = 'all',
  label = 'Align Barcode or QR Code within frame',
  hintText = 'Supports Code 128, Code 39, EAN-13, UPC-A, UPC-E & QR Codes',
  autoStart = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const containerId = useRef<string>(`pf-scanner-${Math.random().toString(36).substring(2, 9)}`);

  const [permissionState, setPermissionState] = useState<CameraPermissionState>('not_requested');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [isScanningPaused, setIsScanningPaused] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeDetection, setActiveDetection] = useState<DetectedBarcode | null>(null);

  // Cooldown / debounce so the same barcode doesn't fire 60 times a second
  const lastScannedCodeRef = useRef<{ code: string; timestamp: number } | null>(null);

  // Check initial browser permission state if supported
  useEffect(() => {
    if (typeof navigator !== 'undefined' && (navigator as any).permissions) {
      (navigator as any).permissions
        .query({ name: 'camera' as any })
        .then((permissionStatus: any) => {
          if (permissionStatus.state === 'granted') {
            if (autoStart) startCamera(facingMode);
          } else if (permissionStatus.state === 'denied') {
            setPermissionState('permanently_denied');
          }
          permissionStatus.onchange = () => {
            if (permissionStatus.state === 'granted') {
              startCamera(facingMode);
            } else if (permissionStatus.state === 'denied') {
              setPermissionState('permanently_denied');
            }
          };
        })
        .catch(() => {
          // Permissions API query not supported for camera on this browser
          if (autoStart) startCamera(facingMode);
        });
    } else if (autoStart) {
      startCamera(facingMode);
    }

    return () => {
      stopCamera();
    };
  }, []);

  // Background and Resumed Recovery Management
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab backgrounded: release camera track to free hardware & avoid lock
        if (permissionState === 'granted') {
          pauseMediaTracks();
          setPermissionState('backgrounded');
        }
      } else {
        // Tab resumed: restore camera stream seamlessly
        if (permissionState === 'backgrounded') {
          startCamera(facingMode);
        }
      }
    };

    const handlePageHide = () => {
      pauseMediaTracks();
    };

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted || permissionState === 'backgrounded') {
        startCamera(facingMode);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [permissionState, facingMode]);

  const pauseMediaTracks = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      html5QrCodeRef.current.stop().catch(() => {});
    }
  };

  const stopCamera = () => {
    pauseMediaTracks();
    setPermissionState('not_requested');
    setIsTorchOn(false);
    setHasTorch(false);
    setActiveDetection(null);
  };

  /**
   * Main camera start pipeline
   */
  const startCamera = async (targetFacing: 'environment' | 'user' = facingMode) => {
    setErrorMessage(null);
    setPermissionState('prompt');
    setActiveDetection(null);

    // Stop existing streams if any
    pauseMediaTracks();

    // Context check: MediaDevices requires HTTPS or localhost
    if (
      typeof window !== 'undefined' &&
      !window.isSecureContext &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      setPermissionState('unavailable_busy');
      setErrorMessage('Camera access requires HTTPS or localhost security context.');
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionState('unavailable_busy');
      setErrorMessage('Camera API is not supported on this device/browser.');
      return;
    }

    try {
      // Ideal mobile camera constraints
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: targetFacing },
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
        audio: false,
      };

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err: any) {
        // Fallback with relaxed basic constraints
        if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        } else {
          throw err;
        }
      }

      streamRef.current = stream;

      // Check torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack && typeof (videoTrack as any).getCapabilities === 'function') {
        const capabilities = (videoTrack as any).getCapabilities();
        setHasTorch(Boolean(capabilities?.torch));
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }

      setPermissionState('granted');

      // Initialize Scanner Detection Loop
      initDetectionEngine(stream);
    } catch (err: any) {
      console.warn('Camera initiation error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        // Determine whether permanently denied
        setPermissionState('denied');
        setErrorMessage('Camera permission was blocked. Tap "Open Settings Guide" to enable.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setPermissionState('unavailable_busy');
        setErrorMessage('No camera device found on this system.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setPermissionState('unavailable_busy');
        setErrorMessage('Camera is busy or currently used by another app.');
      } else {
        setPermissionState('unavailable_busy');
        setErrorMessage(err.message || 'Unable to access hardware camera.');
      }
    }
  };

  /**
   * Initializes barcode detection loop using BarcodeDetector API or Html5Qrcode fallback
   */
  const initDetectionEngine = async (stream: MediaStream) => {
    // 1. Check for native BarcodeDetector API support
    const hasBarcodeDetector = typeof window !== 'undefined' && 'BarcodeDetector' in window;

    if (hasBarcodeDetector) {
      try {
        const BarcodeDetectorClass = (window as any).BarcodeDetector;
        const supportedFormats: string[] = await BarcodeDetectorClass.getSupportedFormats();

        // Formats required: QR_CODE, CODE_128, CODE_39, EAN_13, UPC_A, UPC_E
        const targetFormats = ['qr_code', 'code_128', 'code_39', 'ean_13', 'upc_a', 'upc_e'].filter(
          (f) => supportedFormats.includes(f)
        );

        const detector = new BarcodeDetectorClass({
          formats: targetFormats.length > 0 ? targetFormats : supportedFormats,
        });

        // Run hardware accelerated frame loop
        runNativeDetectionLoop(detector);
        return;
      } catch (err) {
        console.warn('Native BarcodeDetector initialization fallback:', err);
      }
    }

    // 2. Fallback to Html5Qrcode scanner engine
    runHtml5QrcodeEngine();
  };

  /**
   * Real-time native BarcodeDetector loop with bounding box drawing
   */
  const runNativeDetectionLoop = (detector: any) => {
    const detectFrame = async () => {
      if (!videoRef.current || videoRef.current.readyState < 2 || isScanningPaused) {
        animationFrameId.current = requestAnimationFrame(detectFrame);
        return;
      }

      try {
        const barcodes = await detector.detect(videoRef.current);
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (canvas && video) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = video.videoWidth || video.clientWidth;
            canvas.height = video.videoHeight || video.clientHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (barcodes.length > 0) {
              const item = barcodes[0];
              drawBoundingBox(ctx, item);

              const raw = item.rawValue || '';
              handleCodeFound(raw, item.format || 'barcode', {
                rawValue: raw,
                format: item.format,
                boundingBox: item.boundingBox,
                cornerPoints: item.cornerPoints,
              });
            } else {
              setActiveDetection(null);
            }
          }
        }
      } catch {
        // Frame dropped or busy
      }

      animationFrameId.current = requestAnimationFrame(detectFrame);
    };

    animationFrameId.current = requestAnimationFrame(detectFrame);
  };

  /**
   * Draws a glowing neon bounding reticle over detected barcode
   */
  const drawBoundingBox = (ctx: CanvasRenderingContext2D, item: any) => {
    ctx.save();

    if (item.cornerPoints && item.cornerPoints.length >= 4) {
      // Draw polygon around corner points
      ctx.beginPath();
      ctx.moveTo(item.cornerPoints[0].x, item.cornerPoints[0].y);
      for (let i = 1; i < item.cornerPoints.length; i++) {
        ctx.lineTo(item.cornerPoints[i].x, item.cornerPoints[i].y);
      }
      ctx.closePath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#10B981';
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.shadowColor = '#10B981';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.stroke();
    } else if (item.boundingBox) {
      const { x, y, width, height } = item.boundingBox;
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#10B981';
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.shadowColor = '#10B981';
      ctx.shadowBlur = 12;
      ctx.strokeRect(x, y, width, height);
      ctx.fillRect(x, y, width, height);
    }

    ctx.restore();
  };

  /**
   * Fallback engine using Html5Qrcode
   */
  const runHtml5QrcodeEngine = async () => {
    try {
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop().catch(() => {});
      }

      const formats = [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
      ];

      const html5QrCode = new Html5Qrcode(containerId.current, {
        formatsToSupport: formats,
        verbose: false,
      });
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: facingMode },
        {
          fps: 15,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText, decodedResult) => {
          handleCodeFound(decodedText, decodedResult.result.format?.formatName || 'qrcode', {
            rawValue: decodedText,
            format: decodedResult.result.format?.formatName || 'qrcode',
          });
        },
        () => {
          // Frame scanner callback on no-code
        }
      );
    } catch (err) {
      console.warn('Html5Qrcode fallback error:', err);
    }
  };

  /**
   * Handles valid barcode or QR code discovery with debounce and feedback
   */
  const handleCodeFound = (code: string, formatName: string, detection: DetectedBarcode) => {
    const cleanCode = code.trim();
    if (!cleanCode) return;

    const now = Date.now();
    if (
      lastScannedCodeRef.current &&
      lastScannedCodeRef.current.code === cleanCode &&
      now - lastScannedCodeRef.current.timestamp < 2500
    ) {
      // Cooldown active
      return;
    }

    lastScannedCodeRef.current = { code: cleanCode, timestamp: now };
    setActiveDetection(detection);

    // Audio & Haptic confirmation
    playScanChime();
    triggerScanHaptic();

    // Dispatch to consumer
    onScan(cleanCode, formatName);
  };

  /**
   * Toggle camera facing mode (front vs rear)
   */
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  /**
   * Toggle torch / flashlight
   */
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      try {
        const nextState = !isTorchOn;
        await (videoTrack as any).applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setIsTorchOn(nextState);
      } catch {
        // Torch constraint rejected
      }
    }
  };

  return (
    <div className="w-full space-y-2 select-none">
      {/* Hidden container for Html5Qrcode fallback if active */}
      <div id={containerId.current} className="hidden" />

      {/* Main Viewfinder Frame */}
      <div className="relative w-full bg-[#060D1E] rounded-3xl border-[3px] border-[#060D1E] shadow-[4px_4px_0px_#060D1E] overflow-hidden min-h-[260px] aspect-[4/3] flex items-center justify-center text-white">
        {/* Real Live Video Feed */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            permissionState === 'granted' ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Real-time Bounding Box Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none z-10 transition-opacity ${
            permissionState === 'granted' ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Laser Scanning Animation Overlay (Active when granted) */}
        {permissionState === 'granted' && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4 z-10">
            {/* Target Reticle Frame */}
            <div
              className={`relative w-64 ${
                mode === 'qr' ? 'h-52' : 'h-36'
              } border-2 border-dashed ${
                activeDetection ? 'border-emerald-400 bg-emerald-500/10' : 'border-blue-400/80'
              } rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all duration-200`}
            >
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />

              {/* Glowing laser scanline */}
              <div
                className={`absolute left-0 right-0 h-1 bg-[#1E60F2] shadow-[0_0_14px_#1E60F2] ${
                  isScanningPaused ? 'top-1/2' : 'animate-bounce'
                }`}
              />

              <Camera className="w-8 h-8 text-white/40 mb-1" />
              <span className="text-[10px] font-black tracking-widest uppercase text-blue-200 text-center px-2">
                {activeDetection ? 'Barcode Detected!' : label}
              </span>
            </div>

            <p className="text-[11px] font-bold text-slate-300 mt-2 bg-black/60 px-3 py-1 rounded-full border border-white/20">
              {hintText}
            </p>
          </div>
        )}

        {/* Viewfinder Controls Toolbar */}
        {permissionState === 'granted' && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
            {hasTorch && (
              <button
                type="button"
                onClick={toggleTorch}
                title="Toggle Torch"
                className={`p-2 rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] transition-all ${
                  isTorchOn ? 'bg-amber-400 text-[#060D1E]' : 'bg-white/90 text-slate-800 hover:bg-white'
                }`}
              >
                {isTorchOn ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
              </button>
            )}

            <button
              type="button"
              onClick={toggleFacingMode}
              title="Flip Camera (Front/Rear)"
              className="p-2 rounded-xl bg-white/90 backdrop-blur border-2 border-[#060D1E] text-[#060D1E] shadow-[2px_2px_0px_#060D1E] hover:bg-white active:scale-95 transition-all"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsScanningPaused(!isScanningPaused)}
              title={isScanningPaused ? 'Resume Scanning' : 'Pause Scanning'}
              className={`p-2 rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] active:scale-95 transition-all ${
                isScanningPaused ? 'bg-amber-400 text-[#060D1E]' : 'bg-rose-500 text-white hover:bg-rose-600'
              }`}
            >
              <CameraOff className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Detected Code Banner Overlay */}
        {activeDetection && (
          <div className="absolute bottom-3 left-3 right-3 z-20 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="bg-emerald-500 text-white px-3 py-2 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span className="text-xs font-mono font-black">{activeDetection.rawValue}</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-md">
                {activeDetection.format || 'SCANNED'}
              </span>
            </div>
          </div>
        )}

        {/* State 1: Not Requested / Idle */}
        {permissionState === 'not_requested' && (
          <div className="p-6 text-center space-y-3 z-10">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center mx-auto text-blue-400">
              <Camera className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-black text-white">Camera Standby</p>
              <p className="text-xs text-slate-400 mt-0.5">Ready for hardware barcode & QR capture</p>
            </div>
            <button
              type="button"
              onClick={() => startCamera()}
              className="px-5 py-2.5 bg-[#1E60F2] hover:bg-blue-600 text-white font-black text-xs rounded-xl border-2 border-white/20 shadow-[2px_2px_0px_#000] active:scale-95 transition-all inline-flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4" />
              <span>Start Camera Scanner</span>
            </button>
          </div>
        )}

        {/* State 2: Prompt / Initializing */}
        {permissionState === 'prompt' && (
          <div className="p-6 text-center space-y-3 z-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto text-white">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <p className="text-xs font-black text-white">Accessing optical camera stream...</p>
          </div>
        )}

        {/* State 3: Denied or Permanently Denied */}
        {(permissionState === 'denied' || permissionState === 'permanently_denied') && (
          <div className="p-5 text-center space-y-3 z-10 max-w-xs">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center mx-auto text-rose-400">
              <CameraOff className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-white">Camera Permission Blocked</p>
              <p className="text-[11px] text-slate-300 mt-1">
                {errorMessage || 'Browser camera access was denied.'}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="w-full px-4 py-2 bg-amber-400 hover:bg-amber-300 text-[#060D1E] font-black text-xs rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#000] active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Open Settings Guide</span>
              </button>
              <button
                type="button"
                onClick={() => startCamera()}
                className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-600 transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Permission</span>
              </button>
            </div>
          </div>
        )}

        {/* State 4: Unavailable or Busy */}
        {permissionState === 'unavailable_busy' && (
          <div className="p-5 text-center space-y-3 z-10 max-w-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-white">Camera Unavailable or Busy</p>
              <p className="text-[11px] text-slate-300 mt-1">
                {errorMessage || 'Hardware camera is in use by another app or not supported.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => startCamera()}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl border border-slate-600 transition-all flex items-center justify-center gap-1.5 mx-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Camera</span>
            </button>
          </div>
        )}

        {/* State 5: Backgrounded */}
        {permissionState === 'backgrounded' && (
          <div className="p-5 text-center space-y-2 z-10">
            <p className="text-xs font-black text-slate-400">Camera paused while backgrounded</p>
            <button
              type="button"
              onClick={() => startCamera()}
              className="px-3 py-1.5 bg-[#1E60F2] text-white text-xs font-bold rounded-lg"
            >
              Resume Feed
            </button>
          </div>
        )}
      </div>

      {/* Permission Helper Modal */}
      <CameraPermissionModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onRetry={() => startCamera()}
        permissionState={permissionState === 'permanently_denied' ? 'permanently_denied' : 'denied'}
      />
    </div>
  );
};
