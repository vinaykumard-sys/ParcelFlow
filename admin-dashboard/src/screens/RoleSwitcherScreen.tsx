import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Smartphone, Check, X, ArrowRight, Lock } from 'lucide-react';
import { Sticker } from '../components/Sticker';
import { adminService } from '../services/adminService';
import type { UserRole } from '../../../backend/types';
import type { AdminTab } from '../types';

interface RoleSwitcherScreenProps {
  onRoleChanged: (role: UserRole) => void;
  onNavigate: (tab: AdminTab) => void;
}

export const RoleSwitcherScreen: React.FC<RoleSwitcherScreenProps> = ({ onRoleChanged, onNavigate }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(adminService.getActiveRole());

  const handleSelectRole = (role: UserRole) => {
    adminService.setActiveRole(role);
    setCurrentRole(role);
    onRoleChanged(role);
  };

  const permissions = [
    { name: 'Intake & Register Courier Parcels', admin: true, staff: true, resident: false },
    { name: 'Assign Shelf / Locker Compartment', admin: true, staff: true, resident: false },
    { name: 'Scan & Verify Resident OTP / QR', admin: true, staff: true, resident: false },
    { name: 'Schedule Pickup Time-Windows (App)', admin: false, staff: false, resident: true },
    { name: 'Generate Resident Handover Token', admin: false, staff: false, resident: true },
    { name: 'Configure Society & Hub Operating Hours', admin: true, staff: false, resident: false },
    { name: 'Manage Staff Roster & Shifts', admin: true, staff: false, resident: false },
    { name: 'Configure Slot Capacity & Blackout Times', admin: true, staff: false, resident: false },
    { name: 'Access Full Security Audit Log', admin: true, staff: false, resident: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl font-black text-[#0A1128] tracking-tight">Role-Based Access Switcher</h2>
          <Sticker color="purple" rotate="right" size="xs">
            RBAC & RLS Policies
          </Sticker>
        </div>
        <p className="text-xs font-semibold text-slate-600">
          Simulate views and verify strict privilege separation across Admin, Hub Staff, and Apartment Residents.
        </p>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Role 1: Admin */}
        <div
          onClick={() => handleSelectRole('ADMIN')}
          className={`cursor-pointer rounded-2xl border-3 p-5 sm:p-6 transition-all relative flex flex-col justify-between ${
            currentRole === 'ADMIN'
              ? 'bg-amber-50/90 border-[#0A1128] shadow-[6px_6px_0px_#0A1128]'
              : 'bg-white border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:shadow-[5px_5px_0px_#0A1128]'
          }`}
        >
          {currentRole === 'ADMIN' && (
            <div className="absolute top-4 right-4">
              <Sticker color="mint" rotate="right" size="xs">
                Active View
              </Sticker>
            </div>
          )}

          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-600 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center justify-center text-white mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-[#0A1128]">Admin (Society RWA / Ops)</h3>
            <p className="text-xs font-semibold text-slate-600 mt-1 mb-4">
              Global control of society configuration, staff rosters, slot parameters, reports, and security audit logs.
            </p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); handleSelectRole('ADMIN'); }}
            className={`w-full py-2.5 rounded-xl font-extrabold text-xs border-2 border-[#0A1128] transition-all ${
              currentRole === 'ADMIN'
                ? 'bg-blue-600 text-white shadow-[2px_2px_0px_#0A1128]'
                : 'bg-white hover:bg-slate-100 text-[#0A1128]'
            }`}
          >
            {currentRole === 'ADMIN' ? 'Selected as Active Role' : 'Switch to Admin View'}
          </button>
        </div>

        {/* Role 2: Staff */}
        <div
          onClick={() => handleSelectRole('STAFF')}
          className={`cursor-pointer rounded-2xl border-3 p-5 sm:p-6 transition-all relative flex flex-col justify-between ${
            currentRole === 'STAFF'
              ? 'bg-amber-50/90 border-[#0A1128] shadow-[6px_6px_0px_#0A1128]'
              : 'bg-white border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:shadow-[5px_5px_0px_#0A1128]'
          }`}
        >
          {currentRole === 'STAFF' && (
            <div className="absolute top-4 right-4">
              <Sticker color="mint" rotate="right" size="xs">
                Active View
              </Sticker>
            </div>
          )}

          <div>
            <div className="w-12 h-12 rounded-xl bg-orange-500 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center justify-center text-white mb-4">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-[#0A1128]">Staff (Hub / Security)</h3>
            <p className="text-xs font-semibold text-slate-600 mt-1 mb-4">
              Counter operations: courier intake, barcode camera scanning, rack shelf allocation, and resident OTP verification.
            </p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); handleSelectRole('STAFF'); }}
            className={`w-full py-2.5 rounded-xl font-extrabold text-xs border-2 border-[#0A1128] transition-all ${
              currentRole === 'STAFF'
                ? 'bg-orange-500 text-white shadow-[2px_2px_0px_#0A1128]'
                : 'bg-white hover:bg-slate-100 text-[#0A1128]'
            }`}
          >
            {currentRole === 'STAFF' ? 'Selected as Active Role' : 'Switch to Staff View'}
          </button>
        </div>

        {/* Role 3: Resident */}
        <div
          onClick={() => handleSelectRole('RESIDENT')}
          className={`cursor-pointer rounded-2xl border-3 p-5 sm:p-6 transition-all relative flex flex-col justify-between ${
            currentRole === 'RESIDENT'
              ? 'bg-amber-50/90 border-[#0A1128] shadow-[6px_6px_0px_#0A1128]'
              : 'bg-white border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:shadow-[5px_5px_0px_#0A1128]'
          }`}
        >
          {currentRole === 'RESIDENT' && (
            <div className="absolute top-4 right-4">
              <Sticker color="mint" rotate="right" size="xs">
                Active View
              </Sticker>
            </div>
          )}

          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center justify-center text-white mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-[#0A1128]">Resident (Mobile App User)</h3>
            <p className="text-xs font-semibold text-slate-600 mt-1 mb-4">
              Mobile app experience: parcel arrival alerts, time-window selection, authorized pickups, and OTP/QR generation.
            </p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); handleSelectRole('RESIDENT'); }}
            className={`w-full py-2.5 rounded-xl font-extrabold text-xs border-2 border-[#0A1128] transition-all ${
              currentRole === 'RESIDENT'
                ? 'bg-emerald-600 text-white shadow-[2px_2px_0px_#0A1128]'
                : 'bg-white hover:bg-slate-100 text-[#0A1128]'
            }`}
          >
            {currentRole === 'RESIDENT' ? 'Selected as Active Role' : 'Switch to Resident View'}
          </button>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="rounded-2xl bg-white border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="font-extrabold text-base text-[#0A1128]">Row Level Security (RLS) Permission Matrix</h3>
          <p className="text-xs font-medium text-slate-500">
            Enforced natively at the PostgreSQL database layer in Supabase.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-[#0A1128] text-slate-500 font-black uppercase text-[10px]">
                <th className="py-2.5 px-3">Operation / Capability</th>
                <th className="py-2.5 px-3 text-center">Admin</th>
                <th className="py-2.5 px-3 text-center">Hub Staff</th>
                <th className="py-2.5 px-3 text-center">Resident</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-[#0A1128]">
              {permissions.map((p, idx) => (
                <tr key={idx} className="hover:bg-amber-50/50">
                  <td className="py-2.5 px-3 font-semibold">{p.name}</td>
                  <td className="py-2.5 px-3 text-center">
                    {p.admin ? (
                      <span className="inline-flex p-1 rounded-md bg-emerald-100 text-emerald-800 border border-[#0A1128]">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-md bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {p.staff ? (
                      <span className="inline-flex p-1 rounded-md bg-emerald-100 text-emerald-800 border border-[#0A1128]">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-md bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {p.resident ? (
                      <span className="inline-flex p-1 rounded-md bg-emerald-100 text-emerald-800 border border-[#0A1128]">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-md bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
