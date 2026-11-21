import React, { useState, useRef } from 'react';
import {
  X,
  AlertTriangle,
  Camera,
  Trash2,
  Upload,
  CheckCircle2,
  RefreshCw,
  Package,
  ShieldAlert,
  FileText,
} from 'lucide-react';
import { reportIncident } from '../../services/incidentService';
import type { IncidentIssueType } from '../../services/types';
import { useMobileStore } from '../services/mobileState';

export interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcelId?: string | null;
  trackingNumber?: string;
  recipientName?: string;
  onSubmitted?: () => void;
}

const ISSUE_OPTIONS: { type: IncidentIssueType; label: string; desc: string; icon: string }[] = [
  {
    type: 'DAMAGED_PARCEL',
    label: 'Damaged Parcel',
    desc: 'Torn box, broken seals, crushed contents',
    icon: '📦💥',
  },
  {
    type: 'WRONG_PARCEL',
    label: 'Wrong Parcel',
    desc: 'Delivered to wrong society or wrong flat',
    icon: '🚫',
  },
  {
    type: 'MISSING_PARCEL',
    label: 'Missing Parcel',
    desc: 'Courier claims delivered but parcel not in hub',
    icon: '❓',
  },
  {
    type: 'OPENED_PACKAGE',
    label: 'Opened Package',
    desc: 'Tampered tape, resealed or peeked inside',
    icon: '⚠️',
  },
  {
    type: 'LABEL_UNREADABLE',
    label: 'Label Unreadable',
    desc: 'Smudged barcode or torn recipient name',
    icon: '🏷️',
  },
  {
    type: 'OTHER',
    label: 'Other Issue',
    desc: 'Perishable leakage, security irregularity',
    icon: '📝',
  },
];

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen,
  onClose,
  parcelId,
  trackingNumber = '',
  recipientName = '',
  onSubmitted,
}) => {
  const { selectedSociety, currentUser } = useMobileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [issueType, setIssueType] = useState<IncidentIssueType>('DAMAGED_PARCEL');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert selected files to data URLs
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setPhotos((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMessage('Please provide a brief description of the issue.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await reportIncident({
        societyId: selectedSociety?.id || 'soc-riverview',
        parcelId: parcelId || null,
        reporterId: currentUser?.id || null,
        reporterName: currentUser?.name || 'Security Staff',
        reporterRole: 'STAFF',
        issueType,
        description,
        photos,
      });

      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          if (onSubmitted) onSubmitted();
          onClose();
          setIsSuccess(false);
          setDescription('');
          setPhotos([]);
        }, 1200);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit incident report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FEF9F3] rounded-t-3xl sm:rounded-3xl border-2 border-[#060D1E] shadow-[0_-4px_24px_rgba(0,0,0,0.15)] flex flex-col max-h-[92vh] overflow-hidden text-[#060D1E]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b-2 border-[#060D1E] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-400 border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center text-white font-black">
              <ShieldAlert className="w-5 h-5 text-[#060D1E]" />
            </div>
            <div>
              <h2 className="font-black text-lg text-[#060D1E] leading-tight">
                Report Incident
              </h2>
              <p className="text-[11px] font-semibold text-slate-500">
                Screen 10 • Damage & Security Log
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

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Success state banner */}
          {isSuccess && (
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 text-center animate-in zoom-in-95">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1.5" />
              <div className="font-black text-sm text-emerald-900">
                Incident Logged Successfully
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">
                Admin board & audit trail have been updated with photo evidence.
              </p>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-rose-50 border-2 border-rose-400 rounded-2xl p-3 flex items-center gap-2 text-rose-800 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Parcel Tracking Context if available */}
          {trackingNumber && (
            <div className="bg-white rounded-2xl border-2 border-[#060D1E] p-3 shadow-[2px_2px_0px_#060D1E] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#1E60F2]" />
                <span className="font-mono font-black text-xs text-[#060D1E]">
                  {trackingNumber}
                </span>
              </div>
              {recipientName && (
                <span className="text-[11px] font-bold text-slate-600">
                  {recipientName}
                </span>
              )}
            </div>
          )}

          {/* Select Issue Type Dropdown / Grid */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
              Select Issue
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ISSUE_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setIssueType(opt.type)}
                  className={`p-2.5 rounded-2xl border-2 text-left transition-all flex items-start gap-2 ${
                    issueType === opt.type
                      ? 'bg-amber-300 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                      : 'bg-white border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span className="text-lg">{opt.icon}</span>
                  <div>
                    <div className="font-black text-xs text-[#060D1E] leading-tight">
                      {opt.label}
                    </div>
                    <div className="text-[9px] font-medium text-slate-500 leading-tight mt-0.5 line-clamp-1">
                      {opt.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Evidence Capture & Previews */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                Photo Evidence ({photos.length})
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                JPG, PNG or Camera
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Trigger to upload/take photo */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-24 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:bg-slate-50 flex flex-col items-center justify-center gap-1.5 transition-colors group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
                  <Camera className="w-4 h-4 text-slate-600 group-hover:text-amber-800" />
                </div>
                <span className="text-[10px] font-black text-slate-600">
                  Add Photo
                </span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Thumbnails with delete button */}
              {photos.map((photoUrl, idx) => (
                <div
                  key={idx}
                  className="h-24 rounded-2xl border-2 border-[#060D1E] overflow-hidden relative group bg-black"
                >
                  <img
                    src={photoUrl}
                    alt={`Evidence ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors"
                    aria-label="Remove photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Description Text Box */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe package condition, tear size, courier handover notes, or why this was flagged..."
              className="w-full p-3 bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] text-xs font-medium text-[#060D1E] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E60F2] resize-none"
            />
          </div>

          {/* Action button: [Submit Incident] */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="w-full py-3.5 px-4 rounded-2xl border-2 border-[#060D1E] bg-rose-500 hover:bg-rose-600 text-white font-black text-sm shadow-[3px_3px_0px_#060D1E] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Submitting Evidence...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-white" />
                  <span>Submit Incident</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
