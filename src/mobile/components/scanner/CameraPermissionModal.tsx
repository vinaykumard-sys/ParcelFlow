import React from 'react';
import { X, ShieldAlert, Settings, RefreshCw, Smartphone, Laptop, CheckCircle2 } from 'lucide-react';

interface CameraPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  permissionState: 'denied' | 'permanently_denied' | 'unavailable_busy';
}

export const CameraPermissionModal: React.FC<CameraPermissionModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  permissionState,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060D1E]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#FEF9F3] border-[3px] border-[#060D1E] rounded-3xl shadow-[6px_6px_0px_#060D1E] p-5 relative overflow-hidden text-[#060D1E]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center active:scale-95 transition-all text-[#060D1E] hover:bg-slate-100"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center text-[#060D1E] shrink-0">
            <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-black text-base leading-tight">
              {permissionState === 'permanently_denied'
                ? 'Camera Access Blocked'
                : permissionState === 'unavailable_busy'
                ? 'Camera Busy or Missing'
                : 'Camera Permission Denied'}
            </h3>
            <p className="text-[11px] font-bold text-slate-500 mt-0.5">
              Optical barcode scanning needs camera permission
            </p>
          </div>
        </div>

        {/* Instructions Container */}
        <div className="bg-white rounded-2xl border-2 border-[#060D1E] p-4 mb-4 space-y-3 shadow-[2px_2px_0px_#060D1E]">
          <div className="flex items-start gap-2.5">
            <Smartphone className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="font-black text-[#060D1E]">Android Chrome:</span>
              <p className="text-slate-600 font-semibold mt-0.5">
                Tap the <span className="font-bold text-black">Lock / Tune</span> icon in the top URL bar &gt; <span className="font-bold text-black">Permissions</span> &gt; toggle <span className="font-bold text-emerald-700">Camera to Allow</span>.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-2.5 flex items-start gap-2.5">
            <Smartphone className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="font-black text-[#060D1E]">iOS Safari:</span>
              <p className="text-slate-600 font-semibold mt-0.5">
                Tap <span className="font-bold text-black">'aA'</span> or the Page Settings in address bar &gt; <span className="font-bold text-black">Website Settings</span> &gt; set <span className="font-bold text-emerald-700">Camera to Allow</span>.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-2.5 flex items-start gap-2.5">
            <Laptop className="w-4 h-4 text-slate-700 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="font-black text-[#060D1E]">Desktop Chrome / Edge:</span>
              <p className="text-slate-600 font-semibold mt-0.5">
                Click the <span className="font-bold text-black">Site Settings (lock)</span> icon next to URL &gt; switch Camera to <span className="font-bold text-emerald-700">'Allow'</span> &gt; reload page.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onRetry();
              onClose();
            }}
            className="w-full py-3 px-4 bg-[#1E60F2] hover:bg-blue-600 active:scale-95 text-white font-black text-xs rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4 stroke-[2.5]" />
            <span>I've Allowed Access - Retry Now</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs rounded-2xl border-2 border-[#060D1E] transition-all"
          >
            Use Manual Entry Fallback
          </button>
        </div>
      </div>
    </div>
  );
};
