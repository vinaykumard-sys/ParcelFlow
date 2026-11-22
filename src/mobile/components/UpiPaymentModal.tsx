import React, { useState } from 'react';
import {
  X,
  QrCode,
  Smartphone,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  prepareUpiPayment,
  openUpiIntent,
  type UpiPaymentRequest,
} from '../../services/upiPaymentService';
import { getOwnerUpiConfig } from '../../services/ownerService';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (utr: string) => void;
  title: string;
  amount: number;
  description: string;
  societyName?: string;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  title,
  amount,
  description,
  societyName,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'app' | 'qr'>('app');
  const [utrNumber, setUtrNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const payment = prepareUpiPayment({
    amount,
    transactionNote: `${title} - ${societyName || 'ParcelFlow'}`,
    societyName,
  });

  const handleCopyUpiId = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(payment.payeeUpiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLaunchApp = () => {
    openUpiIntent(payment.upiDeepLink);
  };

  const handleConfirmUtr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.trim().length < 6) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      setTimeout(() => {
        if (onPaymentSuccess) {
          onPaymentSuccess(utrNumber.trim());
        }
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-[#FEF9F3] w-full max-w-sm rounded-[36px] border-3 border-[#060D1E] shadow-[6px_6px_0px_#060D1E] flex flex-col overflow-hidden max-h-[92vh]">
        {/* Top Header */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b-2 border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center text-emerald-700">
              <Zap className="w-4 h-4 fill-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#060D1E] tracking-tight">Direct UPI Payment</h3>
              <p className="text-[10px] font-bold text-emerald-700">0% Gateway Fee • Instant Bank Credit</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full border-2 border-[#060D1E] bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 active:scale-95 transition-transform"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3.5">
          {/* Amount Badge */}
          <div className="bg-white rounded-2xl border-2 border-[#060D1E] p-3.5 shadow-[2px_2px_0px_#060D1E] text-center">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Amount Due</span>
            <div className="text-3xl font-black text-[#060D1E] mt-0.5">{payment.formattedAmount}</div>
            <p className="text-xs font-bold text-slate-600 mt-1">{title}</p>
          </div>

          {/* Payee Details Card */}
          <div className="bg-blue-50/80 rounded-2xl border-2 border-blue-200 p-3 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-black uppercase text-blue-800 tracking-wider block">Payee (App Owner)</span>
              <span className="text-xs font-black text-[#060D1E]">{payment.payeeName}</span>
              <span className="text-[11px] font-mono text-slate-600 block mt-0.5">{payment.payeeUpiId}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyUpiId}
              className="px-2.5 py-1.5 bg-white rounded-xl border border-blue-300 text-[10px] font-black text-blue-700 hover:bg-blue-50 flex items-center gap-1 shadow-xs active:scale-95 transition-transform"
            >
              {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy UPI'}</span>
            </button>
          </div>

          {/* Method Tabs: UPI App vs QR Code */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200 rounded-xl border border-slate-300 text-xs font-black">
            <button
              type="button"
              onClick={() => setActiveTab('app')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'app'
                  ? 'bg-white text-[#060D1E] shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>UPI App</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'qr'
                  ? 'bg-white text-[#060D1E] shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan QR</span>
            </button>
          </div>

          {activeTab === 'app' ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleLaunchApp}
                className="w-full py-3 bg-[#1E60F2] hover:bg-blue-600 text-white rounded-2xl text-xs font-black border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Smartphone className="w-4 h-4 text-white" />
                <span>Pay via GPay / PhonePe / Paytm</span>
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-slate-500">
                <span>Google Pay</span>
                <span>•</span>
                <span>PhonePe</span>
                <span>•</span>
                <span>Paytm</span>
                <span>•</span>
                <span>BHIM</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-[#060D1E] p-4 flex flex-col items-center justify-center shadow-[2px_2px_0px_#060D1E] space-y-2">
              <img
                src={payment.qrCodeUrl}
                alt="UPI QR Code"
                className="w-48 h-48 rounded-xl border border-slate-300 p-1 shadow-sm"
              />
              <p className="text-[10px] font-bold text-slate-500 text-center">
                Scan with any UPI App on another device or upload screenshot
              </p>
            </div>
          )}

          {/* Confirm Payment via UTR Form */}
          <form onSubmit={handleConfirmUtr} className="space-y-2 bg-white rounded-2xl border-2 border-[#060D1E] p-3.5 shadow-[2px_2px_0px_#060D1E]">
            <label className="text-[10px] font-black text-[#060D1E] uppercase tracking-wider block">
              Enter 12-Digit UTR / Transaction Reference:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 432198765432"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-bold rounded-xl border-2 border-slate-300 focus:border-[#1E60F2] outline-none"
              />
              <button
                type="submit"
                disabled={isVerifying || utrNumber.length < 6}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-black border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] active:scale-95 transition-transform"
              >
                {isVerifying ? 'Checking...' : isSuccess ? 'Confirmed!' : 'Verify'}
              </button>
            </div>
            {isSuccess && (
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 mt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Payment verified & credited to Vinay Kumar!</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
