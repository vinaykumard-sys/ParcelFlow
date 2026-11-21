import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ScanLine,
  Check,
  CheckCircle2,
  AlertCircle,
  Package,
  User,
  Building,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Search,
  Plus,
} from 'lucide-react';
import {
  detectCarrier,
  checkDuplicateParcel,
  playScanChime,
  triggerScanHaptic,
  type CourierCarrier,
} from '../services/scannerService';
import { useMobileStore } from '../services/mobileState';
import { staffService } from '../../services/staffService';
import type { ResidentUser, MobileParcel } from '../types';

interface StaffReceiveParcelProps {
  onBack: () => void;
  onOpenScanner?: () => void;
  initialTracking?: string;
  initialCarrier?: CourierCarrier;
  onDone?: () => void;
  onNext?: (data: { trackingNumber: string; carrier: any }) => void;
}

export const StaffReceiveParcel: React.FC<StaffReceiveParcelProps> = ({
  onBack,
  onOpenScanner,
  initialTracking = '',
  initialCarrier = 'Amazon',
  onDone,
  onNext,
}) => {
  const { residents, receiveParcel, selectedSociety } = useMobileStore();

  // Intake Form State
  const [trackingId, setTrackingId] = useState(initialTracking);
  const [carrier, setCarrier] = useState<CourierCarrier>(initialCarrier);
  const [residentSearch, setResidentSearch] = useState('');
  const [selectedResident, setSelectedResident] = useState<ResidentUser | null>(null);
  const [customResidentName, setCustomResidentName] = useState('');
  const [customFlat, setCustomFlat] = useState('');
  const [isCustomResident, setIsCustomResident] = useState(false);

  // Storage Hub Assignment State
  const [hubName, setHubName] = useState<'Hub A' | 'Hub B' | 'Cold Storage'>('Hub A');
  const [selectedSlot, setSelectedSlot] = useState<string>('S3');

  // Async & Feedback States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Success Screen State
  const [receivedSuccessData, setReceivedSuccessData] = useState<{
    parcel: MobileParcel;
    residentName: string;
    flat: string;
    storageLocation: string;
    timestamp: string;
  } | null>(null);

  // Sync initialTracking if it updates
  useEffect(() => {
    if (initialTracking) {
      setTrackingId(initialTracking);
      const autoCarrier = detectCarrier(initialTracking);
      setCarrier(autoCarrier);
      validateDuplicate(initialTracking);
    }
  }, [initialTracking]);

  // Auto carrier detection when tracking changes
  useEffect(() => {
    if (trackingId.trim() && !initialTracking) {
      const autoCarrier = detectCarrier(trackingId);
      setCarrier(autoCarrier);
    }
  }, [trackingId]);

  // Duplicate Check
  const validateDuplicate = async (tid: string) => {
    if (!tid.trim()) {
      setDuplicateWarning(null);
      return false;
    }
    try {
      const res = await checkDuplicateParcel(tid, selectedSociety?.id);
      if (res.isDuplicate && res.parcel) {
        setDuplicateWarning(
          res.message || `Parcel ${tid} is already in storage (${res.parcel.storageLocation}).`
        );
        return true;
      } else {
        setDuplicateWarning(null);
        return false;
      }
    } catch {
      setDuplicateWarning(null);
      return false;
    }
  };

  // Filter residents
  const filteredResidents = residents.filter((r) => {
    if (!residentSearch.trim()) return true;
    const q = residentSearch.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.flat.toLowerCase().includes(q) ||
      r.phone.includes(q)
    );
  });

  // Default directory suggestions if residents store is empty
  const defaultResidents: ResidentUser[] = [
    {
      id: 'res-default-1',
      name: 'Rahul Sharma',
      flat: 'A-402',
      phone: '+91 98765 43210',
      email: 'rahul.sharma@example.com',
      society: selectedSociety?.name || 'Riverview Residency',
      status: 'Active',
    },
    {
      id: 'res-default-2',
      name: 'Priya Patel',
      flat: 'B-104',
      phone: '+91 98111 22334',
      email: 'priya.patel@example.com',
      society: selectedSociety?.name || 'Riverview Residency',
      status: 'Active',
    },
    {
      id: 'res-default-3',
      name: 'Amit Verma',
      flat: 'A-701',
      phone: '+91 98222 33445',
      email: 'amit.verma@example.com',
      society: selectedSociety?.name || 'Riverview Residency',
      status: 'Active',
    },
    {
      id: 'res-default-4',
      name: 'Sneha Reddy',
      flat: 'C-302',
      phone: '+91 98333 44556',
      email: 'sneha.reddy@example.com',
      society: selectedSociety?.name || 'Riverview Residency',
      status: 'Active',
    },
  ];

  const availableResidents =
    residents.length > 0 ? filteredResidents : defaultResidents.filter((r) => {
      if (!residentSearch.trim()) return true;
      const q = residentSearch.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.flat.toLowerCase().includes(q) ||
        r.phone.includes(q)
      );
    });

  // Hub slots
  const hubSlots = [
    { id: 'S1', status: 'OCCUPIED' },
    { id: 'S2', status: 'AVAILABLE' },
    { id: 'S3', status: 'AVAILABLE' },
    { id: 'S4', status: 'AVAILABLE' },
    { id: 'S5', status: 'OCCUPIED' },
    { id: 'S6', status: 'AVAILABLE' },
  ];

  // Submit Handler: Primary Button "Receive Parcel"
  const handleReceiveParcel = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const cleanTracking = trackingId.trim().toUpperCase();
    if (!cleanTracking) {
      setErrorMessage('Please enter or scan a valid Tracking ID.');
      return;
    }

    const resName = isCustomResident
      ? customResidentName.trim()
      : selectedResident?.name;
    const resFlat = isCustomResident
      ? customFlat.trim()
      : selectedResident?.flat;
    const resPhone = isCustomResident
      ? '+91 98000 00000'
      : selectedResident?.phone || '+91 98000 00000';

    if (!resName || !resFlat) {
      setErrorMessage('Please select or specify the resident name & flat number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Check duplicate
      const isDup = await validateDuplicate(cleanTracking);
      if (isDup) {
        setIsSubmitting(false);
        return;
      }

      const storageLocationStr = `${hubName} - ${selectedSlot}`;

      // 2. Register Intake in Supabase via staffService
      try {
        await staffService.intakeParcel({
          trackingNumber: cleanTracking,
          carrierName: carrier,
          societyId: selectedSociety?.id || 'a1111111-1111-1111-1111-111111111111',
          apartmentId: 'c1111111-1111-1111-1111-111111111111',
          residentId: selectedResident?.id || 'e1111111-1111-1111-1111-111111111111',
          storageSlot: storageLocationStr,
          staffId: 'd1111111-1111-1111-1111-111111111111',
        });
      } catch (dbErr) {
        console.warn('Note on Supabase intake query:', dbErr);
      }

      // 3. Update local state store
      const formattedTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const saved = receiveParcel({
        trackingNumber: cleanTracking,
        carrier,
        recipientName: resName,
        recipientPhone: resPhone,
        flat: resFlat,
        tower: hubName,
        storageLocation: storageLocationStr,
      });

      playScanChime();
      triggerScanHaptic();

      setIsSubmitting(false);

      // Transition to Success Screen
      setReceivedSuccessData({
        parcel: saved,
        residentName: resName,
        flat: resFlat,
        storageLocation: storageLocationStr,
        timestamp: formattedTime,
      });
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'Failed to receive parcel. Please retry.');
    }
  };

  const handleResetForNext = () => {
    setTrackingId('');
    setSelectedResident(null);
    setCustomResidentName('');
    setCustomFlat('');
    setIsCustomResident(false);
    setDuplicateWarning(null);
    setErrorMessage(null);
    setReceivedSuccessData(null);
  };

  // SUCCESS SCREEN: "Parcel Received" with notified resident, storage location, and Done button
  if (receivedSuccessData) {
    return (
      <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 text-center">
          {/* Animated Success Badge */}
          <div className="w-20 h-20 rounded-full bg-[#10B981] border-[3px] border-[#060D1E] shadow-[4px_4px_0px_#060D1E] flex items-center justify-center text-white mb-4 animate-in zoom-in-90 duration-200">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>

          <h1 className="text-2xl font-black text-[#060D1E] mb-1">
            Parcel Received! 🎉
          </h1>
          <p className="text-xs font-bold text-slate-600 mb-6 max-w-[280px]">
            Inbound package logged and notification dispatched to resident.
          </p>

          {/* Parcel & Handover Summary Card */}
          <div className="w-full bg-white rounded-3xl border-2 border-[#060D1E] shadow-[4px_4px_0px_#060D1E] p-5 text-left mb-6 space-y-3.5 animate-in slide-in-from-bottom-3 duration-200">
            {/* Header / Tracking */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1E60F2]">
                  {receivedSuccessData.parcel.carrier}
                </span>
                <p className="text-sm font-mono font-black text-[#060D1E]">
                  #{receivedSuccessData.parcel.trackingNumber}
                </p>
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                Stored
              </span>
            </div>

            {/* Notified Resident */}
            <div className="space-y-2 text-xs font-bold">
              <div className="flex items-start justify-between">
                <span className="text-slate-500 font-semibold flex items-center gap-1.5 mt-0.5">
                  <User className="w-3.5 h-3.5 text-[#1E60F2]" /> Notified Resident:
                </span>
                <div className="text-right">
                  <span className="text-[#060D1E] font-black block">
                    {receivedSuccessData.residentName}
                  </span>
                  <span className="text-[11px] text-slate-500 font-bold">
                    Flat {receivedSuccessData.flat}
                  </span>
                </div>
              </div>

              {/* Storage Location */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#1E60F2]" /> Storage Location:
                </span>
                <span className="text-purple-700 font-black bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-lg">
                  {receivedSuccessData.storageLocation}
                </span>
              </div>

              {/* Timestamp */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#10B981]" /> Status:
                </span>
                <span className="text-slate-700 font-extrabold">
                  Ready for Resident Pickup
                </span>
              </div>
            </div>

            {/* Resident App Notification Alert Pill */}
            <div className="pt-2.5 border-t border-slate-100 text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Resident notified via SMS & ParcelFlow mobile push</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Done & Receive Another */}
        <div className="p-5 bg-white border-t-2 border-[#060D1E] space-y-2.5">
          <button
            onClick={() => {
              if (onDone) onDone();
              else onBack();
            }}
            className="w-full py-3.5 px-6 bg-[#1E60F2] hover:bg-blue-600 active:scale-95 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all"
          >
            <span>Done</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            onClick={handleResetForNext}
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 active:scale-95 text-[#060D1E] font-black text-xs rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] transition-all"
          >
            + Receive Another Parcel
          </button>
        </div>
      </div>
    );
  }

  // SCREEN 3: Receive Parcel Form
  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Top Header */}
      <div className="px-5 pt-3.5 pb-3 border-b border-slate-200/80 bg-[#FEF9F3] flex items-center justify-between sticky top-0 z-20">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-10 h-10 rounded-2xl bg-white border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center text-[#060D1E] active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="text-center">
          <h1 className="text-base font-black text-[#060D1E] tracking-tight">Receive Parcel</h1>
          <p className="text-[10px] font-bold text-slate-500">Inbound Courier Intake</p>
        </div>

        {onOpenScanner ? (
          <button
            onClick={onOpenScanner}
            aria-label="Open Scanner"
            className="w-10 h-10 rounded-2xl bg-[#0B1E3F] text-white border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center active:scale-95 transition-transform"
          >
            <ScanLine className="w-5 h-5 text-[#00F0FF]" />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Main Scrollable Form */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Error message if any */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border-2 border-rose-400 rounded-2xl text-xs font-bold text-rose-800 flex items-center gap-2 shadow-[2px_2px_0px_#EF4444]">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 stroke-[2.5]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Tracking ID Input */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-600">
              Tracking ID / Barcode
            </label>
            {trackingId && (
              <span className="text-[10px] font-black text-[#1E60F2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                Auto-Detected: {carrier}
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => {
                const val = e.target.value.toUpperCase();
                setTrackingId(val);
                validateDuplicate(val);
              }}
              placeholder="e.g. AMZ-7845321 or FMP12345"
              className="w-full bg-[#FEF9F3] text-sm font-mono font-black text-[#060D1E] p-3.5 pr-10 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none focus:border-[#1E60F2]"
            />
            {onOpenScanner && (
              <button
                type="button"
                onClick={onOpenScanner}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-[#1E60F2]"
              >
                <ScanLine className="w-5 h-5" />
              </button>
            )}
          </div>

          {duplicateWarning && (
            <div className="mt-2.5 p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{duplicateWarning}</span>
            </div>
          )}
        </div>

        {/* 2. Courier Partner / Carrier Selection */}
        <div>
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
            Courier Partner
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Amazon', 'Flipkart', 'Myntra', 'Blue Dart', 'Delhivery', 'Other'] as const).map(
              (c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCarrier(c)}
                  className={`py-2 px-1 text-xs font-black rounded-2xl border-2 transition-all ${
                    carrier === c
                      ? 'bg-[#1E60F2] text-white border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-[#060D1E]'
                  }`}
                >
                  {c}
                </button>
              )
            )}
          </div>
        </div>

        {/* 3. Resident / Flat Selection */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-600">
              Resident / Flat Selection
            </label>
            <button
              type="button"
              onClick={() => setIsCustomResident(!isCustomResident)}
              className="text-[11px] font-black text-[#1E60F2] hover:underline"
            >
              {isCustomResident ? 'Pick from Directory' : '+ Custom Resident'}
            </button>
          </div>

          {isCustomResident ? (
            <div className="space-y-2.5 pt-1">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Resident Full Name
                </label>
                <input
                  type="text"
                  value={customResidentName}
                  onChange={(e) => setCustomResidentName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#FEF9F3] text-xs font-black text-[#060D1E] p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#1E60F2]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Apartment / Flat Number
                </label>
                <input
                  type="text"
                  value={customFlat}
                  onChange={(e) => setCustomFlat(e.target.value)}
                  placeholder="e.g. A-402"
                  className="w-full bg-[#FEF9F3] text-xs font-black text-[#060D1E] p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#1E60F2]"
                />
              </div>
            </div>
          ) : (
            <>
              {/* Search resident directory */}
              <div className="relative">
                <input
                  type="text"
                  value={residentSearch}
                  onChange={(e) => setResidentSearch(e.target.value)}
                  placeholder="Search resident name or flat (e.g. A-402)..."
                  className="w-full bg-[#FEF9F3] text-xs font-bold text-[#060D1E] py-2.5 pl-8 pr-3 rounded-xl border border-slate-300 focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>

              {/* Resident Selection List */}
              <div className="space-y-1.5 max-h-40 overflow-y-auto divide-y divide-slate-100">
                {availableResidents.map((r) => {
                  const isSelected = selectedResident?.id === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedResident(r)}
                      className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-2 border-[#1E60F2]'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                            isSelected
                              ? 'bg-[#1E60F2] text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {r.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#060D1E]">{r.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold">
                            Flat {r.flat} • {r.phone}
                          </p>
                        </div>
                      </div>

                      {isSelected ? (
                        <Check className="w-4 h-4 text-[#1E60F2] stroke-[3]" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* 4. Storage Hub Assignment */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-600">
              Storage Hub Assignment
            </label>
            <span className="text-[10px] font-black text-purple-700 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-full">
              Assigned: {hubName} - {selectedSlot}
            </span>
          </div>

          {/* Hub Selector */}
          <div className="grid grid-cols-3 gap-2">
            {(['Hub A', 'Hub B', 'Cold Storage'] as const).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHubName(h)}
                className={`py-2 text-xs font-black rounded-xl border-2 transition-all ${
                  hubName === h
                    ? 'bg-[#0B1E3F] text-white border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#060D1E]'
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Slot Grid Selector */}
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 mb-1.5">
              Select Slot in {hubName}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {hubSlots.map((s) => {
                const isOccupied = s.status === 'OCCUPIED';
                const isSelected = selectedSlot === s.id;

                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={isOccupied}
                    onClick={() => setSelectedSlot(s.id)}
                    className={`py-2.5 px-2 rounded-xl border-2 text-center transition-all ${
                      isOccupied
                        ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'bg-purple-100 border-purple-600 text-purple-900 font-black shadow-[2px_2px_0px_#9333ea]'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-[#060D1E]'
                    }`}
                  >
                    <span className="text-xs font-black block">{s.id}</span>
                    <span className="text-[8px] font-bold uppercase">
                      {isOccupied ? 'Full' : 'Open'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Primary CTA: "Receive Parcel" */}
      <div className="p-5 bg-white border-t-2 border-[#060D1E] z-20">
        <button
          onClick={handleReceiveParcel}
          disabled={isSubmitting || Boolean(duplicateWarning) || !trackingId.trim()}
          className="w-full py-4 px-6 bg-[#10B981] hover:bg-emerald-600 active:scale-95 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Receiving Parcel...</span>
            </>
          ) : (
            <>
              <span>Receive Parcel</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
