import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Layers,
  List,
  CheckCircle2,
  Package,
  Info,
  ChevronRight,
  Sparkles,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import { getStorageGrid, getSlotLabel } from '../../services/storageMapService';
import type { StorageGridSlot, StorageGridStats } from '../../services/types';
import type { MobileParcel } from '../types';
import { CarrierLogo } from '../components/design-system';

interface LiveStorageMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectParcel?: (parcel: MobileParcel) => void;
  onShowPickupCode?: (parcel: MobileParcel) => void;
}

export const LiveStorageMapModal: React.FC<LiveStorageMapModalProps> = ({
  isOpen,
  onClose,
  onSelectParcel,
  onShowPickupCode,
}) => {
  const { parcels } = useMobileStore();
  const [selectedHub, setSelectedHub] = useState<'Hub Alpha' | 'Hub Beta'>('Hub Alpha');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [slots, setSlots] = useState<StorageGridSlot[]>([]);
  const [stats, setStats] = useState<StorageGridStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSlot, setSelectedSlot] = useState<StorageGridSlot | null>(null);

  // Extract resident parcel IDs from store
  const residentParcels = parcels.filter((p) => p.status !== 'COLLECTED');
  const residentParcelIds = residentParcels.map((p) => p.id);

  // Load storage grid
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);

    getStorageGrid(selectedHub, residentParcelIds)
      .then((res) => {
        if (!isMounted) return;

        // Enhance with resident parcels from mobile store if matched by slot label
        const enhancedSlots = res.slots.map((slot) => {
          const matchedParcel = residentParcels.find((p) => {
            if (!p.storageLocation) return false;
            const normLoc = p.storageLocation.replace(/\s+/g, '').toLowerCase();
            const normSlot = slot.label.replace(/\s+/g, '').toLowerCase();
            return (
              normLoc.includes(normSlot) ||
              normSlot.includes(normLoc) ||
              (p.storageLocation.includes(slot.rack) &&
                p.storageLocation.includes(slot.shelf))
            );
          });

          if (matchedParcel) {
            return {
              ...slot,
              is_occupied: true,
              is_resident_parcel: true,
              parcel_id: matchedParcel.id,
              parcel: {
                id: matchedParcel.id,
                tracking_number: matchedParcel.trackingNumber,
                carrier: matchedParcel.carrier,
                status: matchedParcel.status as any,
                recipient_name: matchedParcel.recipientName,
                flat_number: matchedParcel.flat,
                description: matchedParcel.description,
              } as any,
            };
          }
          return slot;
        });

        setSlots(enhancedSlots);
        setStats(res.stats);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load storage grid', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedHub, residentParcels.length]);

  if (!isOpen) return null;

  const racks = ['A', 'B', 'C', 'D'];
  const shelves = ['5', '4', '3', '2', '1']; // top to bottom

  // Match slot for a rack and shelf
  const getSlot = (rack: string, shelf: string) => {
    return (
      slots.find((s) => s.rack === rack && s.shelf === shelf) || {
        id: `virtual-${rack}-${shelf}`,
        hub: selectedHub,
        rack,
        shelf,
        label: getSlotLabel(selectedHub, rack, shelf),
        compartment_type: shelf === '3' ? 'MEDIUM' : parseInt(shelf) <= 2 ? 'LARGE' : 'SMALL',
        is_occupied: false,
        is_resident_parcel: false,
      }
    );
  };

  // Find if slot corresponds to any resident MobileParcel
  const matchedResidentParcel = selectedSlot
    ? residentParcels.find(
        (p) =>
          p.id === selectedSlot.parcel_id ||
          (p.storageLocation &&
            selectedSlot.label &&
            p.storageLocation.replace(/\s+/g, '').toLowerCase().includes(selectedSlot.label.replace(/\s+/g, '').toLowerCase()))
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FEF9F3] text-[#0B1E3F] rounded-t-[32px] sm:rounded-[32px] border-2 border-[#0B1E3F] shadow-[0px_-8px_30px_rgba(0,0,0,0.2)] max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header Bar */}
        <div className="p-4 border-b-2 border-[#0B1E3F] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] flex items-center justify-center text-[#1E60F2]">
              <MapPin className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight">Hub Storage Map</h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-[#1E60F2] border border-blue-300">
                  Live 2D
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500">
                Interactive rack & shelf organizer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border-2 border-[#0B1E3F] bg-slate-100 hover:bg-slate-200 flex items-center justify-center active:scale-95 transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Hub Selector & View Mode Switcher */}
        <div className="px-5 pt-3 pb-2 bg-[#FEF9F3] flex items-center justify-between gap-2 shrink-0">
          {/* Hub Alpha / Hub Beta Buttons */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]">
            <button
              onClick={() => setSelectedHub('Hub Alpha')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedHub === 'Hub Alpha'
                  ? 'bg-[#1E60F2] text-white'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              Hub Alpha
            </button>
            <button
              onClick={() => setSelectedHub('Hub Beta')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedHub === 'Hub Beta'
                  ? 'bg-[#1E60F2] text-white'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              Hub Beta
            </button>
          </div>

          {/* Map vs List Mode */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]">
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-xl transition-all ${
                viewMode === 'map' ? 'bg-[#FFC72C] text-[#0B1E3F]' : 'text-slate-400'
              }`}
              title="2D Map View"
            >
              <Layers className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-xl transition-all ${
                viewMode === 'list' ? 'bg-[#FFC72C] text-[#0B1E3F]' : 'text-slate-400'
              }`}
              title="List View"
            >
              <List className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Legend Bar */}
        <div className="px-5 py-2 flex items-center justify-around bg-white border-y-2 border-slate-200 text-[11px] font-bold shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-700" />
            <span className="text-slate-700">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300 border border-slate-500" />
            <span className="text-slate-700">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FFC72C] border-2 border-[#0B1E3F] animate-pulse" />
            <span className="text-[#0B1E3F] font-black">My Parcel 📦</span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="p-8 text-center text-xs font-bold text-slate-500">
              Loading 2D Storage Layout...
            </div>
          ) : viewMode === 'map' ? (
            /* 2D Interactive Grid (Screen 3 Spec - Perfectly Aligned 5x5 Matrix) */
            <div className="bg-white rounded-3xl border-2 border-[#0B1E3F] p-3.5 shadow-[3px_3px_0px_#0B1E3F] space-y-2.5">
              {/* Header: Column Racks */}
              <div className="grid grid-cols-5 gap-1.5 text-center items-center">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Level
                </div>
                {racks.map((r) => (
                  <div
                    key={r}
                    className="py-1 rounded-xl bg-slate-100 border border-slate-300 text-xs font-black text-slate-800"
                  >
                    Rack {r}
                  </div>
                ))}
              </div>

              {/* 5 Shelf Rows (5 down to 1) */}
              <div className="space-y-1.5">
                {shelves.map((shelf) => (
                  <div key={shelf} className="grid grid-cols-5 gap-1.5 items-center">
                    {/* Shelf Label on the Left */}
                    <div className="h-12 rounded-xl bg-slate-100 border border-slate-300 flex flex-col items-center justify-center text-center p-0.5">
                      <span className="text-[11px] font-black text-slate-800">S{shelf}</span>
                      <span className="text-[8px] font-bold text-slate-500 uppercase leading-none">
                        {shelf === '3' ? 'Med' : parseInt(shelf) <= 2 ? 'Lrg' : 'Sml'}
                      </span>
                    </div>

                    {/* 4 Rack Cells */}
                    {racks.map((rack) => {
                      const slot = getSlot(rack, shelf);
                      const isMyParcel = slot.is_resident_parcel;
                      const isOccupied = slot.is_occupied;
                      const isSelected = selectedSlot?.id === slot.id;

                      return (
                        <button
                          key={rack}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`h-12 rounded-xl border-2 flex flex-col items-center justify-center p-1 transition-colors relative ${
                            isSelected
                              ? 'border-[#1E60F2] ring-2 ring-[#1E60F2] bg-blue-50'
                              : 'border-[#0B1E3F]'
                          } ${
                            isMyParcel
                              ? 'bg-[#FFC72C] text-[#0B1E3F]'
                              : isOccupied
                              ? 'bg-slate-100 text-slate-500'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-700'
                          }`}
                        >
                          <span className="text-[10px] font-black leading-tight">
                            {rack}{shelf}
                          </span>

                          {isMyParcel ? (
                            <span className="text-[7px] font-black bg-[#0B1E3F] text-amber-300 px-1 py-0.2 rounded-full mt-0.5">
                              Mine
                            </span>
                          ) : isOccupied ? (
                            <span className="text-[8px] font-bold text-slate-500 mt-0.5">Busy</span>
                          ) : (
                            <span className="text-[8px] font-bold text-emerald-700 mt-0.5">Open</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* List View */
            <div className="space-y-2">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-2xl border-2 border-[#0B1E3F] flex items-center justify-between cursor-pointer transition-colors ${
                    slot.is_resident_parcel
                      ? 'bg-amber-50 shadow-[2px_2px_0px_#0B1E3F]'
                      : 'bg-white hover:bg-slate-50 shadow-[2px_2px_0px_#0B1E3F]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-xs ${
                        slot.is_resident_parcel
                          ? 'bg-[#FFC72C] border-[#0B1E3F] text-[#0B1E3F]'
                          : slot.is_occupied
                          ? 'bg-slate-200 border-slate-300 text-slate-600'
                          : 'bg-emerald-100 border-emerald-300 text-emerald-700'
                      }`}
                    >
                      {slot.rack}
                      {slot.shelf}
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#0B1E3F]">{slot.label}</p>
                      <p className="text-[10px] font-bold text-slate-500">
                        {slot.compartment_type} •{' '}
                        {slot.is_resident_parcel
                          ? 'Contains Your Parcel'
                          : slot.is_occupied
                          ? 'Occupied'
                          : 'Available'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          )}

          {/* Selected Slot Detail Sheet */}
          {selectedSlot && (
            <div className="p-4 rounded-3xl bg-white border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] space-y-3 animate-in fade-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[#0B1E3F]">
                      {selectedSlot.label}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        selectedSlot.is_resident_parcel
                          ? 'bg-[#FFC72C] text-[#0B1E3F] border border-[#0B1E3F]'
                          : selectedSlot.is_occupied
                          ? 'bg-slate-100 text-slate-600 border border-slate-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {selectedSlot.is_resident_parcel
                        ? 'Your Parcel Inside 📦'
                        : selectedSlot.is_occupied
                        ? 'Occupied'
                        : 'Available Slot'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">
                    {selectedSlot.hub} • Rack {selectedSlot.rack} • Shelf{' '}
                    {selectedSlot.shelf} ({selectedSlot.compartment_type})
                  </p>
                </div>

                <button
                  onClick={() => setSelectedSlot(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* If it's the resident's parcel */}
              {matchedResidentParcel ? (
                <div className="space-y-3 pt-1 border-t border-slate-100">
                  <div className="p-3 rounded-2xl bg-[#FEF9F3] border border-amber-200 flex items-center gap-3">
                    <CarrierLogo carrier={matchedResidentParcel.carrier} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-[#0B1E3F] truncate">
                        {matchedResidentParcel.description ||
                          `${matchedResidentParcel.carrier} Parcel`}
                      </p>
                      <p className="text-[10px] font-bold text-slate-500 truncate">
                        {matchedResidentParcel.carrier} • #{matchedResidentParcel.trackingNumber}
                      </p>
                      <p className="text-[10px] font-black text-emerald-700 mt-0.5">
                        Status: Ready for Pickup
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectParcel) onSelectParcel(matchedResidentParcel);
                      }}
                      className="py-2.5 px-3 bg-white hover:bg-slate-50 text-[#0B1E3F] font-black text-xs rounded-xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <span>View Parcel</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        if (onShowPickupCode) onShowPickupCode(matchedResidentParcel);
                      }}
                      className="py-2.5 px-3 bg-[#FFC72C] hover:bg-[#F59E0B] text-[#0B1E3F] font-black text-xs rounded-xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Get QR Code</span>
                    </button>
                  </div>
                </div>
              ) : selectedSlot.is_occupied ? (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-500 flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    This slot currently holds a package for another flat in the society.
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Empty slot available for incoming deliveries. Security will assign here.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t-2 border-[#0B1E3F] flex items-center justify-between text-xs font-bold text-slate-600 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-[#0B1E3F]">
              {selectedHub === 'Hub Alpha'
                ? stats?.hubAlpha?.occupied ?? 14
                : stats?.hubBeta?.occupied ?? 9}
            </span>
            <span>of 20 slots occupied</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0B1E3F] font-black rounded-xl border-2 border-[#0B1E3F] text-xs active:scale-95 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
