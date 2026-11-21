import React from 'react';
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle2,
  MapPin,
  Shield,
  Calendar,
  QrCode,
  Check,
  User,
  Sparkles,
} from 'lucide-react';
import type { MobileParcel } from '../types';
import { CarrierLogo } from '../components/design-system';
import { StatusPill } from './ResidentUIComponents';

interface ResidentParcelDetailsProps {
  parcel: MobileParcel | null;
  onBack: () => void;
  onScheduleSlot: (parcel: MobileParcel) => void;
  onShowPickupCode: (parcel: MobileParcel) => void;
}

export const ResidentParcelDetails: React.FC<ResidentParcelDetailsProps> = ({
  parcel,
  onBack,
  onScheduleSlot,
  onShowPickupCode,
}) => {
  if (!parcel) {
    return (
      <div className="flex flex-col h-full bg-[#FEF9F3] text-[#0B1E3F] p-6 items-center justify-center select-none">
        <Package className="w-12 h-12 text-slate-400 mb-3" />
        <p className="text-sm font-black text-[#0B1E3F]">No parcel selected</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-[#2563EB] text-white text-xs font-black rounded-xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const isCollected = parcel.status === 'COLLECTED';
  const isReady = parcel.status === 'READY_FOR_PICKUP' || parcel.status === 'SCHEDULED';
  const isStored =
    parcel.storageLocation && parcel.storageLocation !== 'Awaiting Hub Intake';

  // Construct real delivery timeline steps matching reference specs:
  // Ordered -> Shipped -> Received at Society -> Stored (Hub A - S3) -> Ready for Pickup (active highlighted green card) -> Collected
  const timelineSteps = [
    {
      id: 'ordered',
      title: 'Ordered',
      subtitle: `Order placed via ${parcel.carrier}`,
      time: 'Confirmed',
      completed: true,
      current: false,
    },
    {
      id: 'shipped',
      title: 'Shipped',
      subtitle: `Carrier tracking #${parcel.trackingNumber}`,
      time: 'In transit',
      completed: true,
      current: !isStored && !isReady && !isCollected,
    },
    {
      id: 'received',
      title: 'Received at Society',
      subtitle: isStored || isReady || isCollected ? 'Arrived at Society Hub gate' : 'Pending courier arrival',
      time: isStored || isReady || isCollected ? parcel.receivedAt || 'Today' : undefined,
      completed: isStored || isReady || isCollected,
      current: false,
    },
    {
      id: 'stored',
      title: `Stored (${parcel.storageLocation || 'Hub A - S3'})`,
      subtitle: isStored ? `Verified & placed in ${parcel.storageLocation}` : 'Assigned upon check-in',
      time: isStored ? 'Checked in' : undefined,
      completed: isStored || isReady || isCollected,
      current: false,
    },
    {
      id: 'ready',
      title: 'Ready for Pickup',
      subtitle: isReady
        ? 'Available for collection with OTP / QR pass'
        : isCollected
        ? 'Ready window completed'
        : 'Awaiting storage verification',
      time: parcel.scheduledSlot ? parcel.scheduledSlot : isReady ? 'Active Now' : undefined,
      completed: isReady || isCollected,
      current: isReady && !isCollected, // Active highlighted green card
    },
    {
      id: 'collected',
      title: 'Collected',
      subtitle: isCollected
        ? 'Verified with single-use OTP / QR scan'
        : 'Counter staff handover pending',
      time: isCollected ? parcel.collectedAt || 'Completed' : undefined,
      completed: isCollected,
      current: false,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#0B1E3F] select-none">
      {/* Top Header */}
      <div className="px-5 pt-3 pb-3 bg-white border-b-2 border-slate-100 flex items-center justify-between sticky top-0 z-20">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="w-9 h-9 rounded-xl bg-white border-2 border-[#0B1E3F] shadow-[1.5px_1.5px_0px_#0B1E3F] flex items-center justify-center text-[#0B1E3F] active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </button>
        <h1 className="text-sm font-black text-[#0B1E3F] tracking-tight">Parcel Tracking</h1>
        <div className="w-9 flex justify-end">
          <CarrierLogo carrier={parcel.carrier} size="sm" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-28 space-y-4">
        {/* Screen 3 Spec: Parcel Overview Card */}
        <div className="bg-white rounded-3xl border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <CarrierLogo carrier={parcel.carrier} size="lg" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  {parcel.carrier} Express
                </span>
                <h2 className="text-base font-black text-[#0B1E3F] leading-tight">
                  {parcel.description || `${parcel.carrier} Package`}
                </h2>
                <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                  #{parcel.trackingNumber}
                </p>
              </div>
            </div>

            <StatusPill
              status={parcel.status}
              labelOverride={
                isCollected
                  ? 'Collected'
                  : isReady
                  ? 'Ready for Pickup'
                  : isStored
                  ? 'Stored at Hub'
                  : 'Expected Delivery'
              }
            />
          </div>

          {/* Details list */}
          <div className="bg-[#FEF9F3] p-3 rounded-2xl border border-slate-200 space-y-2 text-xs font-bold text-slate-600">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-[#2563EB]" /> Storage Location:
              </span>
              <span className="text-[#0B1E3F] font-black">
                {parcel.storageLocation || 'Awaiting Hub Intake'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500">
                <User className="w-3.5 h-3.5 text-[#2563EB]" /> Recipient:
              </span>
              <span className="text-[#0B1E3F] font-extrabold">
                {parcel.recipientName} ({parcel.flat || 'Flat 402'})
              </span>
            </div>

            {parcel.scheduledSlot && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-[#2563EB]" /> Scheduled Slot:
                </span>
                <span className="text-[#2563EB] font-black">{parcel.scheduledSlot}</span>
              </div>
            )}
          </div>
        </div>

        {/* Screen 3 Spec: Delivery Timeline matching the reference image */}
        <div className="bg-white rounded-3xl border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0B1E3F] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#2563EB]" /> Delivery Timeline
            </h3>
            <span className="text-[10px] font-black text-slate-400">Live Status</span>
          </div>

          {/* Vertical Timeline */}
          <div className="relative pl-7 space-y-5 before:absolute before:left-3 before:top-2 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {timelineSteps.map((step, idx) => {
              const isStepDone = step.completed;
              const isHighlightActive = step.current;

              // Screen 3 Spec: "Ready for Pickup (active highlighted green card)"
              if (isHighlightActive && step.id === 'ready') {
                return (
                  <div key={step.id} className="relative">
                    {/* Active Icon Dot */}
                    <div className="absolute -left-7 top-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0B1E3F] shadow-[1px_1px_0px_#0B1E3F] flex items-center justify-center text-white z-10">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>

                    {/* Active Highlighted Green Card */}
                    <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-3 shadow-[2px_2px_0px_#10B981] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Ready for Pickup
                        </span>
                        {step.time && (
                          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                            {step.time}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-emerald-900">
                        {step.subtitle}
                      </p>
                      <p className="text-[10px] font-semibold text-emerald-700 pt-0.5">
                        Location: {parcel.storageLocation || 'Hub A - S3'}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={step.id} className="relative">
                  {/* Step Dot with Green Checkmark for completed steps */}
                  <div
                    className={`absolute -left-7 top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs transition-colors z-10 ${
                      isStepDone
                        ? 'bg-emerald-500 border-[#0B1E3F] text-white shadow-[1px_1px_0px_#0B1E3F]'
                        : 'bg-white border-slate-300 text-slate-300'
                    }`}
                  >
                    {isStepDone ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Content */}
                  <div>
                    <div className="flex items-baseline justify-between">
                      <h4
                        className={`text-xs font-black ${
                          isStepDone ? 'text-[#0B1E3F]' : 'text-slate-400'
                        }`}
                      >
                        {step.title}
                      </h4>
                      {step.time && (
                        <span className="text-[10px] font-bold text-slate-400">
                          {step.time}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                      {step.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security / Verification Guarantee Card */}
        <div className="p-3 bg-white rounded-2xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
            <Shield className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="text-[11px] font-bold text-slate-600">
            <span className="font-black text-[#0B1E3F] block">Secure Society Handover</span>
            Handover strictly requires your verified single-use OTP or QR pass.
          </div>
        </div>
      </div>

      {/* Screen 3 Spec: Bottom Sticky Action Button */}
      <div className="p-4 bg-white border-t-2 border-[#0B1E3F] fixed bottom-0 left-0 right-0 max-w-md mx-auto z-30">
        {isCollected ? (
          <div className="w-full py-3 px-4 bg-slate-100 text-slate-600 font-black text-xs text-center rounded-2xl border border-slate-300 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Parcel Handover Completed</span>
          </div>
        ) : isReady ? (
          <button
            type="button"
            onClick={() => onShowPickupCode(parcel)}
            className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4 stroke-[2.5]" />
            <span>Show Pickup Pass (QR / OTP)</span>
          </button>
        ) : isStored ? (
          <button
            type="button"
            onClick={() => onScheduleSlot(parcel)}
            className="w-full py-3.5 px-4 bg-[#2563EB] hover:bg-blue-600 text-white font-black text-sm rounded-2xl border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Calendar className="w-4 h-4 stroke-[2.5]" />
            <span>Schedule Pickup Slot</span>
          </button>
        ) : (
          <div className="w-full py-3 px-4 bg-amber-50 text-amber-900 font-black text-xs text-center rounded-2xl border border-amber-300 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Expected Delivery • We will notify you when checked in</span>
          </div>
        )}
      </div>
    </div>
  );
};
