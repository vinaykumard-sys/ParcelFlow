import React, { useState } from 'react';
import { ShieldCheck, KeyRound, CheckCircle2, AlertOctagon, UserCheck, PackageCheck, RefreshCw, Smartphone } from 'lucide-react';
import { Sticker } from './Sticker';
import { mobileStore, MobileParcel } from '../services/supabaseService';

export const HandoverVerification: React.FC = () => {
  const [inputCode, setInputCode] = useState('');
  const [result, setResult] = useState<{ success: boolean; parcel?: MobileParcel; message: string } | null>(null);

  const handleVerify = (codeToVerify = inputCode) => {
    if (!codeToVerify.trim()) return;
    const res = mobileStore.verifyAndRelease(codeToVerify);
    setResult(res);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#0A1128] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Handover Terminal</span>
          </h2>
          <p className="text-xs font-semibold text-slate-600">
            Counter operator verification for resident parcel release
          </p>
        </div>
        <Sticker color="mint" rotate="right" size="xs">
          Staff Console
        </Sticker>
      </div>

      {/* Input Form */}
      <div className="p-5 rounded-3xl bg-white border-[3px] border-[#0A1128] shadow-[6px_6px_0px_#0A1128] space-y-4">
        <div>
          <label className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5 mb-1.5">
            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
            <span>Enter Resident 6-Digit OTP or Optical QR Token:</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 839214 or PF://HANDOVER?..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl bg-[#FEF9F3] border-2 border-[#0A1128] font-mono text-sm font-black text-[#0A1128] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[3px_3px_0px_#0A1128]"
            />
            <button
              onClick={() => handleVerify()}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] active:translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify</span>
            </button>
          </div>
        </div>

        {/* Quick test preset buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-500">Quick Test OTPs:</span>
          {['839214', '419082'].map((sample) => (
            <button
              key={sample}
              onClick={() => {
                setInputCode(sample);
                handleVerify(sample);
              }}
              className="text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 border border-[#0A1128] text-[#0A1128] shadow-[1px_1px_0px_#0A1128] transition-all"
            >
              OTP: {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Banner */}
      {result && (
        <div
          className={`p-5 rounded-3xl border-[3px] border-[#0A1128] shadow-[6px_6px_0px_#0A1128] animate-in fade-in slide-in-from-bottom-2 ${
            result.success ? 'bg-emerald-50' : 'bg-rose-50'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl border-2 border-[#0A1128] flex items-center justify-center text-white shrink-0 shadow-[2px_2px_0px_#0A1128] ${
                result.success ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              ) : (
                <AlertOctagon className="w-6 h-6 stroke-[2.5]" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-black text-[#0A1128]">
                  {result.success ? 'Handover Authorized!' : 'Verification Failed'}
                </h4>
                <Sticker color={result.success ? 'mint' : 'orange'} rotate="none" size="xs">
                  {result.success ? 'Physical Release' : 'Action Blocked'}
                </Sticker>
              </div>
              <p className="text-xs font-bold text-slate-700 leading-relaxed">
                {result.message}
              </p>

              {result.parcel && (
                <div className="mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs font-medium">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Recipient</span>
                    <span className="font-extrabold text-[#0A1128]">
                      {result.parcel.recipient_name} ({result.parcel.recipient_flat})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Storage Bin</span>
                    <span className="font-extrabold text-blue-700">{result.parcel.storage_location}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
