import React, { useState } from 'react';
import { X, PackagePlus, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import { identifyCarrier } from '../../services/staffService';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddOrderModal: React.FC<AddOrderModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { addExpectedOrder } = useMobileStore();
  const [carrier, setCarrier] = useState<'Amazon' | 'Flipkart' | 'Myntra' | 'Blue Dart' | 'Delhivery' | 'Other'>('Amazon');
  const [description, setDescription] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setDuplicateWarning('');
    setIsSubmitting(true);

    const result = addExpectedOrder({
      carrier,
      description: description.trim(),
      trackingNumber: trackingNumber.trim() || undefined,
      recipientName: 'Vinay Kumar',
      recipientPhone: '+91 98450 11223',
      flat: 'B-402',
      tower: 'Tower B',
    });

    setIsSubmitting(false);

    if (result.isDuplicate) {
      const tn = result.existingParcel?.trackingNumber || trackingNumber.trim().toUpperCase();
      setDuplicateWarning(
        `⚠️ Parcel Already Registered! Tracking ID "${tn}" is already in your hub inventory (Status: ${result.existingParcel?.status ?? 'ACTIVE'}). Please check your parcels list.`
      );
      return;
    }

    setDescription('');
    setTrackingNumber('');
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleTrackingChange = (val: string) => {
    setTrackingNumber(val);
    setDuplicateWarning('');
    if (val.trim()) {
      const detected = identifyCarrier(val);
      if (detected !== 'Other') setCarrier(detected);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#060D1E]/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full sm:max-w-md bg-[#FEF9F3] border-t-2 sm:border-2 border-[#060D1E] rounded-t-3xl sm:rounded-3xl shadow-[0_-4px_16px_rgba(0,0,0,0.15)] sm:shadow-[4px_4px_0px_#060D1E] p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#1E60F2] text-white flex items-center justify-center border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#060D1E] tracking-tight">Add Expected Delivery</h2>
              <p className="text-[10px] font-bold text-slate-500">Alert hub security of incoming orders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white border-2 border-[#060D1E] flex items-center justify-center shadow-[1px_1px_0px_#060D1E] active:scale-95"
          >
            <X className="w-4 h-4 text-[#060D1E]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Carrier Selection */}
          <div>
            <label className="text-xs font-black uppercase text-slate-600 block mb-1.5">
              Select Courier Partner
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Amazon', 'Flipkart', 'Myntra', 'Blue Dart', 'Delhivery', 'Other'] as const).map((c) => (
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
              ))}
            </div>
          </div>

          {/* Item Description */}
          <div>
            <label className="text-xs font-black uppercase text-slate-600 block mb-1">
              Item Name / Description <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Mechanical Keyboard, Protein Powder, Zara Denim"
              className="w-full bg-white text-xs font-bold text-[#060D1E] p-3 rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none"
            />
          </div>

          {/* Tracking Number (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-black uppercase text-slate-600">
                Tracking Number (Optional)
              </label>
              <span className="text-[10px] text-slate-400 font-bold">Auto-assigned if empty</span>
            </div>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => handleTrackingChange(e.target.value)}
              placeholder="e.g. AMZ-12345 or FMP-99881"
              className="w-full bg-white text-xs font-mono font-bold text-[#060D1E] p-3 rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none uppercase"
            />
          </div>

          {/* Duplicate Warning */}
          {duplicateWarning && (
            <div className="p-3 bg-rose-50 border-2 border-rose-400 rounded-2xl flex items-start gap-2 shadow-[2px_2px_0px_#f87171]">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-rose-800 leading-tight">{duplicateWarning}</p>
            </div>
          )}

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#1E60F2] shrink-0 mt-0.5" />
            <p className="text-[11px] font-bold text-blue-900 leading-tight">
              Pre-alerting orders ensures that when security receives the courier at the gate, your parcel is immediately routed to the express locker rack without delay!
            </p>
          </div>

          <button
            type="submit"
            disabled={!description.trim() || isSubmitting}
            className="w-full py-3.5 bg-[#1E60F2] hover:bg-blue-600 active:scale-95 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <span>Add Order to Tracker</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};
