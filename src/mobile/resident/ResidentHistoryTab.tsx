import React from 'react';
import { CheckCircle2, Package, Calendar, ChevronRight } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import type { MobileParcel } from '../types';
import { EmptyState } from '../components/EmptyState';

interface ResidentHistoryTabProps {
  onSelectParcel: (parcel: MobileParcel) => void;
}

export const ResidentHistoryTab: React.FC<ResidentHistoryTabProps> = ({ onSelectParcel }) => {
  const { parcels, currentUser } = useMobileStore();

  const residentParcels = parcels.filter((p) => {
    if (!currentUser) return true;
    if (currentUser.flatNumber && p.flat && p.flat.toLowerCase() === currentUser.flatNumber.toLowerCase()) return true;
    if (currentUser.name && p.recipientName && p.recipientName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])) return true;
    return true;
  });

  const collected = residentParcels.filter((p) => p.status === 'COLLECTED');

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] sticky top-0 z-20">
        <h1 className="text-base font-black text-[#060D1E] tracking-tight">Pickup History</h1>
        <p className="text-[11px] font-bold text-slate-500">
          {collected.length} successfully collected parcel{collected.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20 space-y-3">
        {collected.length === 0 ? (
          <EmptyState
            icon="history"
            title="No collection history yet"
            description="Every delivery handed over at the security hub using your verified single-use OTP or QR pass will be logged here with complete timestamps."
          />
        ) : (
          collected.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectParcel(p)}
              className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-[#060D1E] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-[#060D1E]">{p.carrier}</span>
                    <span className="text-xs font-mono font-bold text-slate-500">{p.trackingNumber}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-semibold line-clamp-1">
                    {p.description || `${p.carrier} Package`}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                    Collected {p.collectedAt || 'Verified at Hub'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
