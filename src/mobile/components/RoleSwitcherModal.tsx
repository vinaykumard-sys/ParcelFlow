import React, { useState } from 'react';
import { Crown, ShieldCheck, Home, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import type { MobileRole } from '../types';

interface RoleSwitcherModalProps {
  currentRole: MobileRole;
  onSelectRole: (role: MobileRole) => void;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  currentRole,
  onSelectRole,
  onClose,
}) => {
  const [selected, setSelected] = useState<MobileRole>(currentRole);

  const roles = [
    {
      id: 'RESIDENT' as MobileRole,
      title: 'Resident',
      subtitle: 'View your parcels & schedule pickup',
      icon: Home,
      color: 'bg-blue-100 text-[#1E60F2] border-blue-300',
      activeBorder: 'border-[#1E60F2] ring-2 ring-[#1E60F2]',
    },
    {
      id: 'STAFF' as MobileRole,
      title: 'Society Staff',
      subtitle: 'Receive, store & handover parcels',
      icon: ShieldCheck,
      color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      activeBorder: 'border-[#10B981] ring-2 ring-[#10B981]',
    },
    {
      id: 'ADMIN' as MobileRole,
      title: 'Society Admin',
      subtitle: 'Manage society, users, parcels & settings',
      icon: Crown,
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500',
    },
  ];

  const handleConfirm = () => {
    onSelectRole(selected);
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-[#FEF9F3] rounded-t-3xl sm:rounded-3xl border-[3px] border-[#060D1E] shadow-[0px_-4px_20px_rgba(0,0,0,0.15)] sm:shadow-[6px_6px_0px_#060D1E] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#1E60F2]">
            <Sparkles className="w-4 h-4" />
            <span>Role-Based Access</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border-2 border-[#060D1E] flex items-center justify-center hover:bg-slate-100"
          >
            <X className="w-4 h-4 text-[#060D1E]" />
          </button>
        </div>

        <h2 className="text-xl font-black text-[#060D1E] mb-1">Select Role</h2>
        <p className="text-xs font-semibold text-slate-600 mb-5">
          Choose how you want to experience ParcelFlow. All 3 personas are fully operational.
        </p>

        {/* Roles List matching Reference Image */}
        <div className="space-y-3 mb-6">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selected === r.id;

            return (
              <div
                key={r.id}
                onClick={() => setSelected(r.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? `bg-white ${r.activeBorder} shadow-[3px_3px_0px_#060D1E]`
                    : 'bg-white border-[#060D1E] shadow-[2px_2px_0px_#060D1E] hover:border-slate-400'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl border-2 border-[#060D1E] flex items-center justify-center ${r.color}`}
                  >
                    <Icon className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#060D1E]">{r.title}</h3>
                    <p className="text-[11px] font-semibold text-slate-500 leading-tight mt-0.5">
                      {r.subtitle}
                    </p>
                  </div>
                </div>

                {isSelected ? (
                  <CheckCircle2 className="w-6 h-6 text-[#1E60F2] stroke-[2.5]" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                )}
              </div>
            );
          })}
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full py-3.5 px-4 bg-[#1E60F2] hover:bg-blue-600 active:scale-95 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all"
        >
          <span>Continue as {selected === 'RESIDENT' ? 'Resident' : selected === 'STAFF' ? 'Staff' : 'Admin'}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
