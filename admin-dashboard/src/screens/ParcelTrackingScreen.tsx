import React, { useState } from 'react';
import { Search, Compass, Package, User, Clock, CheckCircle2, QrCode, KeyRound, Truck, MapPin } from 'lucide-react';
import { Sticker } from '../components/Sticker';
import { adminService } from '../services/adminService';
import type { AdminParcel, ParcelStatus } from '../types';

interface ParcelTrackingScreenProps {
  onOpenScanModal: () => void;
  refreshTrigger: number;
}

export const ParcelTrackingScreen: React.FC<ParcelTrackingScreenProps> = ({ onOpenScanModal, refreshTrigger }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParcel, setSelectedParcel] = useState<AdminParcel | null>(null);

  const parcels = adminService.getParcels();

  const filteredParcels = parcels.filter(
    (p) =>
      p.tracking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.recipient_name_on_package.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.apartment?.unit_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.courier_company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lifecycleStages: { status: ParcelStatus; label: string }[] = [
    { status: 'RECEIVED', label: 'Hub Received' },
    { status: 'STORED', label: 'Rack Assigned' },
    { status: 'NOTIFIED', label: 'Resident Notified' },
    { status: 'SCHEDULED', label: 'Slot Chosen' },
    { status: 'READY_FOR_PICKUP', label: 'Ready for Pickup' },
    { status: 'COMPLETED', label: 'Verified Handover' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl font-black text-[#0A1128] tracking-tight">Parcel Tracking & Live Status</h2>
          <Sticker color="yellow" rotate="right" size="xs">
            Realtime Audit Trace
          </Sticker>
        </div>
        <p className="text-xs font-semibold text-slate-600">
          Search parcels across intake, rack storage, scheduled pickup windows, and OTP handover verification.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="rounded-2xl bg-white border-2.5 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Tracking ID (e.g. PF-8921-IN), Resident name, Flat #, or Courier..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl text-xs font-bold border-2 border-[#0A1128] bg-[#FEF9F3] text-[#0A1128] placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Parcels List Table & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Parcels List */}
        <div className="lg:col-span-2 rounded-2xl bg-white border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] overflow-hidden">
          <div className="p-4 border-b-2 border-[#0A1128] bg-[#FFFDF9] flex items-center justify-between">
            <span className="text-xs font-black uppercase text-[#0A1128]">
              Parcels in System ({filteredParcels.length})
            </span>
            <span className="text-[11px] font-semibold text-slate-500">Click parcel row for complete timeline</span>
          </div>

          <div className="divide-y divide-slate-200 overflow-y-auto max-h-[500px]">
            {filteredParcels.map((p) => {
              const isSelected = selectedParcel?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedParcel(p)}
                  className={`p-4 cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-amber-100/70 border-l-4 border-blue-600' : 'hover:bg-amber-50/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-blue-700">{p.tracking_number}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 border border-[#0A1128]">
                        {p.courier_company}
                      </span>
                    </div>
                    <p className="font-bold text-xs text-[#0A1128]">
                      {p.recipient_name_on_package} <span className="font-mono text-slate-500">({p.apartment?.unit_number})</span>
                    </p>
                    <p className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{p.storage_location?.shelf || 'Shelf A1'}</span>
                    </p>
                  </div>

                  <div className="text-right space-y-1.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border border-[#0A1128] ${
                        p.status === 'COMPLETED'
                          ? 'bg-emerald-300 text-emerald-950'
                          : p.status === 'SCHEDULED'
                          ? 'bg-blue-300 text-blue-950'
                          : 'bg-amber-300 text-amber-950'
                      }`}
                    >
                      {p.status}
                    </span>
                    {p.active_token && (
                      <span className="block font-mono text-[10px] font-black text-orange-600">
                        OTP: {p.active_token.otp_code}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Parcel Inspector */}
        <div className="rounded-2xl bg-white border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] p-5 space-y-4">
          {selectedParcel ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
                <div>
                  <span className="font-mono font-black text-sm text-blue-600">{selectedParcel.tracking_number}</span>
                  <h3 className="font-extrabold text-base text-[#0A1128]">{selectedParcel.recipient_name_on_package}</h3>
                </div>
                <span className="font-mono font-black px-2.5 py-1 rounded-xl bg-amber-200 border-2 border-[#0A1128] text-xs">
                  {selectedParcel.apartment?.unit_number}
                </span>
              </div>

              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Courier Partner:</span>
                  <span className="text-[#0A1128]">{selectedParcel.courier_company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rack Compartment:</span>
                  <span className="font-mono text-[#0A1128]">{selectedParcel.storage_location?.shelf || 'Shelf A1'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Handover OTP:</span>
                  <span className="font-mono text-sm font-black text-orange-600 px-2 py-0.5 bg-orange-50 rounded border border-[#0A1128]">
                    {selectedParcel.active_token?.otp_code || '7492'}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="pt-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                  Lifecycle Timeline
                </span>
                <div className="space-y-2">
                  {lifecycleStages.map((stage, idx) => {
                    const isPassed =
                      selectedParcel.status === 'COMPLETED' ||
                      (selectedParcel.status === 'SCHEDULED' && idx <= 3) ||
                      (selectedParcel.status === 'READY_FOR_PICKUP' && idx <= 4) ||
                      (selectedParcel.status === 'STORED' && idx <= 1);
                    return (
                      <div key={stage.status} className="flex items-center gap-2.5 text-xs">
                        <div
                          className={`w-4 h-4 rounded-full border border-[#0A1128] flex items-center justify-center text-[10px] font-black ${
                            isPassed ? 'bg-emerald-400 text-[#0A1128]' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {isPassed ? '✓' : '•'}
                        </div>
                        <span className={`font-semibold ${isPassed ? 'text-[#0A1128]' : 'text-slate-400'}`}>
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={onOpenScanModal}
                className="w-full py-2.5 rounded-xl bg-orange-500 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-4 h-4" />
                <span>Verify Handover Now</span>
              </button>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 font-semibold text-xs">
              <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <span>Select any parcel to inspect full timeline and authentication codes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
