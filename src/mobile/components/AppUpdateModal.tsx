import React, { useState, useRef } from 'react';
import {
  Download,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  Sparkles,
  ShieldCheck,
  Package,
  ArrowDownCircle,
  Smartphone,
  Layers,
} from 'lucide-react';
import {
  type RemoteAppUpdateMetadata,
  type DownloadProgress,
  downloadApkWithProgress,
  verifyApkSha256,
  triggerAndroidApkInstall,
} from '../../services/appUpdateService';
import { CURRENT_APP_VERSION } from '../version';

export type UpdateModalStep =
  | 'AVAILABLE'
  | 'DOWNLOADING'
  | 'VERIFYING'
  | 'READY_TO_INSTALL'
  | 'FAILED';

interface AppUpdateModalProps {
  isOpen: boolean;
  metadata: RemoteAppUpdateMetadata;
  isMandatory: boolean;
  onClose: () => void;
}

export const AppUpdateModal: React.FC<AppUpdateModalProps> = ({
  isOpen,
  metadata,
  isMandatory,
  onClose,
}) => {
  const [step, setStep] = useState<UpdateModalStep>('AVAILABLE');
  const [progress, setProgress] = useState<DownloadProgress>({
    loadedBytes: 0,
    totalBytes: metadata.apkSizeBytes || 9950048,
    percentage: 0,
    formattedLoaded: '0 MB',
    formattedTotal: '9.5 MB',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadedBuffer, setDownloadedBuffer] = useState<ArrayBuffer | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  if (!isOpen) return null;

  const handleStartDownload = async () => {
    setStep('DOWNLOADING');
    setErrorMessage(null);
    setProgress({
      loadedBytes: 0,
      totalBytes: metadata.apkSizeBytes || 9950048,
      percentage: 0,
      formattedLoaded: '0 MB',
      formattedTotal: '9.5 MB',
    });

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      // 1. In-App Download with Progress Tracking
      const buffer = await downloadApkWithProgress(
        metadata.apkUrl,
        metadata.apkSizeBytes,
        (p) => setProgress(p),
        abortController.signal
      );

      // 2. Cryptographic SHA-256 Verification
      setStep('VERIFYING');
      const verification = await verifyApkSha256(buffer, metadata.sha256);

      if (!verification.valid) {
        setStep('FAILED');
        setErrorMessage(
          'Update verification failed. The downloaded APK checksum does not match the official release signature.'
        );
        return;
      }

      // 3. Ready to Install
      setDownloadedBuffer(buffer);
      setStep('READY_TO_INSTALL');
    } catch (err: any) {
      if (err?.message?.includes('cancelled')) {
        setStep('AVAILABLE');
        return;
      }
      setStep('FAILED');
      setErrorMessage(err?.message || 'Download failed. Check your internet connection.');
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancelDownload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStep('AVAILABLE');
  };

  const handleTriggerInstall = () => {
    if (!downloadedBuffer) {
      handleStartDownload();
      return;
    }
    triggerAndroidApkInstall(downloadedBuffer, metadata.latestVersionName, metadata.apkUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-[#FEF9F3] w-full max-w-sm rounded-[36px] border-3 border-[#060D1E] shadow-[6px_6px_0px_#060D1E] flex flex-col overflow-hidden max-h-[92vh]">
        {/* Top Header Controls */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E60F2] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              ParcelFlow Updater
            </span>
          </div>
          {!isMandatory && step !== 'DOWNLOADING' && step !== 'VERIFYING' && (
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full border-2 border-[#060D1E] bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 active:scale-95 transition-transform"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-2 space-y-4">
          {/* Visual Illustration Header matching Reference */}
          <div className="w-full bg-white rounded-3xl border-2 border-[#060D1E] p-4 flex flex-col items-center justify-center relative shadow-[3px_3px_0px_#060D1E] overflow-hidden">
            {/* Background geometric accents */}
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-blue-100/60 pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-amber-100/60 pointer-events-none" />

            {/* Stylized Phone & Cloud Vector Graphic */}
            <div className="relative my-2">
              <div className="w-24 h-32 bg-[#060D1E] rounded-2xl p-1.5 shadow-md flex flex-col items-center justify-between border-2 border-slate-700">
                <div className="w-6 h-1 bg-slate-700 rounded-full" />
                {/* Center Gear / Refresh */}
                <div className="w-12 h-12 rounded-full bg-[#1E60F2] flex items-center justify-center shadow-inner">
                  {step === 'DOWNLOADING' || step === 'VERIFYING' ? (
                    <RefreshCw className="w-6 h-6 text-white animate-spin" />
                  ) : step === 'READY_TO_INSTALL' ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <Download className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="w-8 h-1.5 bg-slate-700 rounded-full" />
              </div>

              {/* Floating Cloud Badge */}
              <div className="absolute -top-3 -right-4 bg-amber-400 border-2 border-[#060D1E] rounded-xl p-1.5 shadow-[2px_2px_0px_#060D1E]">
                <ArrowDownCircle className="w-4 h-4 text-[#060D1E]" />
              </div>

              {/* Floating Package Badge */}
              <div className="absolute -bottom-2 -left-4 bg-emerald-400 border-2 border-[#060D1E] rounded-xl p-1.5 shadow-[2px_2px_0px_#060D1E]">
                <Package className="w-4 h-4 text-[#060D1E]" />
              </div>
            </div>

            {/* Version Badge */}
            <div className="mt-2 text-center">
              <h2 className="text-base font-black text-[#060D1E] tracking-tight">
                {isMandatory ? 'Update Required' : 'New Update Available'}
              </h2>
              <p className="text-xs font-black text-[#1E60F2] mt-0.5">
                Version {metadata.latestVersionName}{' '}
                <span className="text-[10px] text-slate-500 font-bold">
                  (Current: v{CURRENT_APP_VERSION.versionName})
                </span>
              </p>
            </div>
          </div>

          {/* Download Progress State (Visible during download) */}
          {step === 'DOWNLOADING' && (
            <div className="bg-white rounded-2xl border-2 border-[#060D1E] p-3.5 shadow-[2px_2px_0px_#060D1E] space-y-2">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-[#060D1E] flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-[#1E60F2]" />
                  <span>Downloading... {progress.percentage}%</span>
                </span>
                <span className="text-slate-500 text-[11px] font-bold">
                  {progress.formattedLoaded} / {progress.formattedTotal}
                </span>
              </div>

              {/* Smooth Progress Bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full border border-slate-300 overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#1E60F2] rounded-full transition-all duration-200"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>

              <p className="text-[10px] font-bold text-slate-500 text-center">
                Downloading official signed APK inside ParcelFlow
              </p>
            </div>
          )}

          {/* Verifying Cryptographic Integrity State */}
          {step === 'VERIFYING' && (
            <div className="bg-amber-50 rounded-2xl border-2 border-amber-600 p-3.5 text-xs font-black text-amber-950 flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-amber-700 animate-spin shrink-0" />
              <span>Verifying SHA-256 cryptographic signature...</span>
            </div>
          )}

          {/* Verification Success State */}
          {step === 'READY_TO_INSTALL' && (
            <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-600 p-3.5 text-xs font-black text-emerald-950 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p>Update Verified & Ready</p>
                <p className="text-[10px] font-bold text-emerald-800">
                  Tap below to launch Android Package Installer
                </p>
              </div>
            </div>
          )}

          {/* Error / Failure State */}
          {step === 'FAILED' && (
            <div className="bg-rose-50 rounded-2xl border-2 border-rose-600 p-3.5 text-xs font-black text-rose-950 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p>Update Failed</p>
                <p className="text-[10px] font-bold text-rose-800 mt-0.5 leading-snug">
                  {errorMessage || 'Unable to complete update. Please check your internet.'}
                </p>
              </div>
            </div>
          )}

          {/* What's New Card */}
          <div className="bg-white rounded-2xl border-2 border-[#060D1E] p-4 shadow-[2px_2px_0px_#060D1E] space-y-2">
            <h3 className="text-xs font-black text-[#060D1E] flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>What's New</span>
            </h3>

            <ul className="space-y-1.5 text-xs font-bold text-slate-700">
              {metadata.releaseNotes && metadata.releaseNotes.length > 0 ? (
                metadata.releaseNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[11px] leading-snug">
                    <span className="text-[#1E60F2] font-black shrink-0">•</span>
                    <span>{note}</span>
                  </li>
                ))
              ) : (
                <li className="text-[11px] text-slate-500">• Performance and stability improvements</li>
              )}
            </ul>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 bg-white border-t-2 border-[#060D1E] space-y-2">
          {step === 'AVAILABLE' && (
            <button
              type="button"
              onClick={handleStartDownload}
              className="w-full py-3 bg-[#1E60F2] hover:bg-blue-600 text-white rounded-2xl text-xs font-black border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Download className="w-4 h-4 text-white stroke-[2.5]" />
              <span>Update Now</span>
            </button>
          )}

          {step === 'DOWNLOADING' && (
            <button
              type="button"
              onClick={handleCancelDownload}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-black border-2 border-slate-300 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <X className="w-4 h-4" />
              <span>Cancel Download</span>
            </button>
          )}

          {step === 'READY_TO_INSTALL' && (
            <button
              type="button"
              onClick={handleTriggerInstall}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <CheckCircle2 className="w-4 h-4 text-white stroke-[2.5]" />
              <span>Install Update</span>
            </button>
          )}

          {step === 'FAILED' && (
            <button
              type="button"
              onClick={handleStartDownload}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs font-black border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <RefreshCw className="w-4 h-4 text-white" />
              <span>Retry Download</span>
            </button>
          )}

          {/* Optional "Maybe Later" Action (Hidden for mandatory updates) */}
          {!isMandatory && step !== 'DOWNLOADING' && step !== 'VERIFYING' && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-1 text-center text-[11px] font-black text-slate-500 hover:text-slate-800 transition-colors"
            >
              Maybe Later
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
