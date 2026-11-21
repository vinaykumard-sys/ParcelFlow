import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Sparkles,
  MapPin,
  CheckCircle2,
  Sliders,
  Layers,
  ArrowRight,
  TrendingUp,
  Boxes,
  RefreshCw,
  Info,
} from 'lucide-react';
import {
  getSuggestedSlot,
  assignSlot,
  getStorageGrid,
} from '../../services/storageMapService';
import type { StorageSuggestion, StorageCompartmentType } from '../../services/types';
import { playScanChime, triggerScanHaptic } from '../services/scannerService';

export interface SmartStorageSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackingNumber: string;
  carrier?: string;
  recipientName?: string;
  flat?: string;
  parcelId?: string;
  onAssignComplete?: (location: string, parcelSize: 'SMALL' | 'MEDIUM' | 'LARGE') => void;
}

export const SmartStorageSuggestionModal: React.FC<SmartStorageSuggestionModalProps> = ({
  isOpen,
  onClose,
  trackingNumber,
  carrier = 'Courier',
  recipientName,
  flat,
  parcelId,
  onAssignComplete,
}) => {
  const [selectedSize, setSelectedSize] = useState<'SMALL' | 'MEDIUM' | 'LARGE'>('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<StorageSuggestion | null>(null);
  const [isChangingSlot, setIsChangingSlot] = useState(false);
  const [customSlot, setCustomSlot] = useState<string | null>(null);
  const [availableSlotsList, setAvailableSlotsList] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);

  // Fetch suggestion whenever size or modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    getSuggestedSlot(selectedSize, { preferredHub: 'Hub Alpha' })
      .then((sug) => {
        if (isMounted) {
          setSuggestion(sug);
          setCustomSlot(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to get storage suggestion:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedSize]);

  // Load alternative available slots for Change picker
  useEffect(() => {
    if (isChangingSlot) {
      getStorageGrid().then(({ slots }) => {
        const free = slots.filter((s) => !s.is_occupied).map((s) => s.label);
        setAvailableSlotsList(free);
      });
    }
  }, [isChangingSlot]);

  if (!isOpen) return null;

  const currentSlotLabel = customSlot || suggestion?.recommendedSlot.label || 'Hub A - Shelf B3';
  const utilization = suggestion?.spaceUtilizationPercent ?? 68;
  const proximity = suggestion?.proximityScore ?? 94;

  const handleConfirmAssignment = async () => {
    setAssigning(true);
    try {
      playScanChime();
      triggerScanHaptic();

      if (parcelId) {
        await assignSlot(parcelId, currentSlotLabel);
      }

      if (onAssignComplete) {
        onAssignComplete(currentSlotLabel, selectedSize);
      }
      onClose();
    } catch (err) {
      console.error('Assignment error:', err);
      // Fallback close
      if (onAssignComplete) {
        onAssignComplete(currentSlotLabel, selectedSize);
      }
      onClose();
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FEF9F3] rounded-t-3xl sm:rounded-3xl border-2 border-[#060D1E] shadow-[0_-4px_24px_rgba(0,0,0,0.15)] flex flex-col max-h-[92vh] overflow-hidden text-[#060D1E]">
        {/* 1. Modal Header */}
        <div className="px-5 py-4 border-b-2 border-[#060D1E] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-300 border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center font-black">
              <Package className="w-5 h-5 text-[#060D1E]" />
            </div>
            <div>
              <h2 className="font-black text-lg text-[#060D1E] leading-tight">
                Receive Parcel
              </h2>
              <p className="text-[11px] font-semibold text-slate-500">
                Screen 7 • Smart Location Assignment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 border border-slate-300 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Tracking ID & Parcel Metadata */}
          <div className="bg-white rounded-2xl border-2 border-[#060D1E] p-4 shadow-[2px_2px_0px_#060D1E]">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Tracking ID
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-base text-[#060D1E]">
                {trackingNumber || 'AMZ-98234-IN'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-100 text-[#1E60F2] border border-blue-300">
                {carrier}
              </span>
            </div>
            {(recipientName || flat) && (
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>{recipientName || 'Resident'}</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                  Flat {flat || 'A-402'}
                </span>
              </div>
            )}
          </div>

          {/* Parcel Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                Parcel Size
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                Optimizes rack placement
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  { key: 'SMALL', label: 'Small', desc: '< 1 kg • Envelope' },
                  { key: 'MEDIUM', label: 'Medium', desc: '1-5 kg • Box' },
                  { key: 'LARGE', label: 'Large', desc: '> 5 kg • Bulky' },
                ] as const
              ).map((size) => (
                <button
                  key={size.key}
                  type="button"
                  onClick={() => setSelectedSize(size.key)}
                  className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedSize === size.key
                      ? 'bg-amber-300 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] scale-[1.02]'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <span className="font-black text-sm text-[#060D1E]">{size.label}</span>
                  <span className="text-[9px] font-bold text-slate-600 leading-tight">
                    {size.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Location Card */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50/60 to-purple-50 rounded-2xl border-2 border-[#1E60F2] p-4.5 shadow-[3px_3px_0px_#060D1E] relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#1E60F2]" />
                <span className="text-xs font-black text-[#1E60F2] uppercase tracking-wider">
                  Recommended Location
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500 text-white shadow-sm">
                Smart Suggestion
              </span>
            </div>

            {loading ? (
              <div className="py-6 flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-6 h-6 text-[#1E60F2] animate-spin" />
                <span className="text-xs font-bold text-slate-500">
                  Calculating optimal slot...
                </span>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline justify-between mt-1 mb-2">
                  <div className="text-2xl font-black text-[#060D1E] tracking-tight flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-500 fill-red-100" />
                    <span>{currentSlotLabel}</span>
                  </div>
                  {customSlot && (
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200">
                      Manual Override
                    </span>
                  )}
                </div>

                {/* Utilization & Proximity Stats */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-blue-200/80">
                  <div className="bg-white/80 rounded-xl p-2.5 border border-blue-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">
                      Space Utilization
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="font-black text-sm text-[#060D1E]">
                        {utilization}% full
                      </div>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min(100, utilization)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 rounded-xl p-2.5 border border-blue-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">
                      Pickup Proximity
                    </div>
                    <div className="font-black text-xs text-emerald-700 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{proximity}% optimal</span>
                    </div>
                  </div>
                </div>

                {/* Proximity hint */}
                <div className="mt-3 flex items-start gap-2 text-[11px] font-medium text-slate-600 bg-white/70 p-2.5 rounded-xl border border-blue-100">
                  <Info className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>
                    {suggestion?.reason ||
                      'Near ground exit • Fast collection • Waist-height shelf for ergonomic access.'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Change Slot Override Dropdown */}
          {isChangingSlot && (
            <div className="bg-white rounded-2xl border-2 border-[#060D1E] p-4 shadow-[2px_2px_0px_#060D1E] animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-slate-600">
                  Select Alternative Slot
                </span>
                <button
                  type="button"
                  onClick={() => setIsChangingSlot(false)}
                  className="text-[11px] text-blue-600 font-bold"
                >
                  Done
                </button>
              </div>

              {availableSlotsList.length === 0 ? (
                <div className="text-xs text-slate-500 py-2">Loading slots...</div>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1">
                  {availableSlotsList.slice(0, 15).map((slotLabel) => (
                    <button
                      key={slotLabel}
                      type="button"
                      onClick={() => {
                        setCustomSlot(slotLabel);
                        setIsChangingSlot(false);
                      }}
                      className={`p-2 rounded-xl border text-center text-xs font-black transition-all ${
                        currentSlotLabel === slotLabel
                          ? 'bg-amber-300 border-[#060D1E]'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {slotLabel.replace('Hub Alpha - ', 'A-').replace('Hub Beta - ', 'B-')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Action Buttons: [Change] & [Assign & Receive] */}
        <div className="p-4 border-t-2 border-[#060D1E] bg-white flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsChangingSlot(!isChangingSlot)}
            className="flex-1 py-3 px-4 rounded-2xl border-2 border-[#060D1E] bg-white hover:bg-slate-50 text-[#060D1E] font-black text-xs shadow-[2px_2px_0px_#060D1E] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isChangingSlot ? 'Hide Slots' : 'Change'}</span>
          </button>

          <button
            type="button"
            disabled={assigning}
            onClick={handleConfirmAssignment}
            className="flex-[2] py-3 px-4 rounded-2xl border-2 border-[#060D1E] bg-[#1E60F2] hover:bg-[#164ec4] text-white font-black text-xs shadow-[2px_2px_0px_#060D1E] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {assigning ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-white" />
            )}
            <span>Assign & Receive</span>
          </button>
        </div>
      </div>
    </div>
  );
};
