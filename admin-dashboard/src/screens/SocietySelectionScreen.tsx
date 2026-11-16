import React from 'react';
import { Building2, MapPin, Clock, Phone, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Sticker } from '../components/Sticker';
import { adminService } from '../services/adminService';
import type { AdminTab } from '../types';

interface SocietySelectionScreenProps {
  onSelectSociety: (id: string) => void;
  onNavigate: (tab: AdminTab) => void;
}

export const SocietySelectionScreen: React.FC<SocietySelectionScreenProps> = ({ onSelectSociety, onNavigate }) => {
  const societies = adminService.getSocieties();
  const activeSociety = adminService.getActiveSociety();

  const handleSelect = (id: string) => {
    adminService.setActiveSociety(id);
    onSelectSociety(id);
    onNavigate('dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-[#0A1128] tracking-tight">Society Selection</h2>
            <Sticker color="yellow" rotate="right" size="xs">
              4 Active Societies
            </Sticker>
          </div>
          <p className="text-xs font-semibold text-slate-600">
            Switch between connected apartment complexes in Bengaluru to monitor local hubs & dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Active Society:</span>
          <span className="text-xs font-extrabold px-3 py-1 bg-amber-400 text-[#0A1128] border-2 border-[#0A1128] rounded-xl shadow-[2px_2px_0px_#0A1128]">
            {activeSociety.name}
          </span>
        </div>
      </div>

      {/* Grid of Societies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {societies.map((soc) => {
          const isSelected = soc.id === activeSociety.id;
          return (
            <div
              key={soc.id}
              className={`rounded-2xl border-3 p-5 sm:p-6 transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-50/90 border-[#0A1128] shadow-[6px_6px_0px_#0A1128]'
                  : 'bg-white border-[#0A1128] shadow-[4px_4px_0px_#0A1128] hover:shadow-[6px_6px_0px_#0A1128] hover:-translate-y-0.5'
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <Sticker color="mint" rotate="right" size="xs">
                    ✓ Currently Managing
                  </Sticker>
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center justify-center text-white">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#0A1128] leading-tight">{soc.name}</h3>
                    <p className="text-xs font-mono font-bold text-blue-600">{soc.code}</p>
                  </div>
                </div>

                <div className="space-y-2 my-4 text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate">{soc.address}, {soc.city} {soc.postal_code}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Hub Operating Hours: {soc.hub_operating_hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-mono">{soc.hub_phone}</span>
                  </div>
                </div>

                {/* Society Stats Pills */}
                <div className="grid grid-cols-2 gap-2 my-4">
                  <div className="p-2.5 rounded-xl bg-white border-2 border-[#0A1128] text-center shadow-[1px_1px_0px_#0A1128]">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Total Towers</span>
                    <span className="text-sm font-black text-[#0A1128]">{soc.total_towers} Towers</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border-2 border-[#0A1128] text-center shadow-[1px_1px_0px_#0A1128]">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Flats / Units</span>
                    <span className="text-sm font-black text-[#0A1128]">{soc.total_flats} Residents</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {isSelected ? (
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                  >
                    <span>Open Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSelect(soc.id)}
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-amber-100 text-[#0A1128] font-extrabold text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                  >
                    <span>Switch to this Society</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
