import React from 'react';
import { ShieldCheck, UserCheck, Smartphone, Check, X, Lock } from 'lucide-react';
import { Sticker } from '../components/Sticker';
import { adminService } from '../services/adminService';
import type { UserRole } from '../../../backend/types';
import type { AdminTab } from '../types';

interface RoleSwitcherScreenProps {
  onRoleChanged?: (role: UserRole) => void;
  onNavigate?: (tab: AdminTab) => void;
}

export const RoleSwitcherScreen: React.FC<RoleSwitcherScreenProps> = () => {
  const currentRole = adminService.getActiveRole();

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
          <h2 className="text-2xl font-black text-[#0A1128] tracking-tight">Role-Based Access Control (RBAC)</h2>
          <Sticker color="purple" rotate="right" size="xs">
            Server Enforced
          </Sticker>
        </div>
        <p className="text-xs font-semibold text-slate-600">
          Strict privilege separation enforced by PostgreSQL Row Level Security (RLS) and cryptographic JWT validation. Client-side role elevation is forbidden.
        </p>
      </div>

      {/* Security Policy Notice Banner */}
      <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-2xl flex items-center gap-3">
        <Lock className="w-5 h-5 text-amber-700 shrink-0" />
        <div className="text-xs font-bold text-amber-900">
          <span className="font-black">Security Invariant:</span> Role elevation via frontend state manipulation or client dropdowns is permanently disabled. Privileges are derived strictly from verified <code className="bg-amber-100 px-1 py-0.5 rounded border border-amber-300">public.profiles</code> database records.
        </div>
      </div>

      {/* Role Cards Grid (Informational / Read-Only) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Role 1: Admin */}
        <div
          className={`rounded-2xl border-3 p-5 sm:p-6 relative flex flex-col justify-between ${
            currentRole === 'ADMIN'
              ? 'bg-amber-50/90 border-[#0A1128] shadow-[6px_6px_0px_#0A1128]'
              : 'bg-white border-[#0A1128] shadow-[3px_3px_0px_#0A1128]'
          }`}
        >
          {currentRole === 'ADMIN' && (
            <div className="absolute top-4 right-4">
              <Sticker color="mint" rotate="right" size="xs">
                Active Role
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

          <div className="w-full py-2.5 rounded-xl font-extrabold text-xs border-2 border-[#0A1128] text-center bg-blue-600 text-white shadow-[2px_2px_0px_#0A1128]">
            Verified Administrator Role
          </div>
        </div>

        {/* Role 2: Staff */}
        <div
          className={`rounded-2xl border-3 p-5 sm:p-6 relative flex flex-col justify-between ${
            currentRole === 'STAFF'
              ? 'bg-amber-50/90 border-[#0A1128] shadow-[6px_6px_0px_#0A1128]'
              : 'bg-white border-[#0A1128] shadow-[3px_3px_0px_#0A1128]'
          }`}
        >
          {currentRole === 'STAFF' && (
            <div className="absolute top-4 right-4">
              <Sticker color="mint" rotate="right" size="xs">
                Active Role
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

          <div className="w-full py-2.5 rounded-xl font-extrabold text-xs border-2 border-[#0A1128] text-center bg-slate-100 text-slate-600">
            Dedicated Security Portal
          </div>
        </div>

        {/* Role 3: Resident */}
        <div
          className={`rounded-2xl border-3 p-5 sm:p-6 relative flex flex-col justify-between ${
            currentRole === 'RESIDENT'
              ? 'bg-amber-50/90 border-[#0A1128] shadow-[6px_6px_0px_#0A1128]'
              : 'bg-white border-[#0A1128] shadow-[3px_3px_0px_#0A1128]'
          }`}
        >
          {currentRole === 'RESIDENT' && (
            <div className="absolute top-4 right-4">
              <Sticker color="mint" rotate="right" size="xs">
                Active Role
              </Sticker>
            </div>
          )}

          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center justify-center text-white mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-[#0A1128]">Apartment Resident (Mobile)</h3>
            <p className="text-xs font-semibold text-slate-600 mt-1 mb-4">
              Resident mobile app: receive package notifications, choose 30-min pickup windows, and show temporary QR/OTP at gate.
            </p>
          </div>

          <div className="w-full py-2.5 rounded-xl font-extrabold text-xs border-2 border-[#0A1128] text-center bg-slate-100 text-slate-600">
            Isolated Resident Portal
          </div>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-2xl border-3 border-[#0A1128] shadow-[5px_5px_0px_#0A1128] p-5 sm:p-6 overflow-hidden">
        <h3 className="text-base font-extrabold text-[#0A1128] mb-1">Privilege & RBAC Matrix</h3>
        <p className="text-xs font-semibold text-slate-600 mb-4">
          Capabilities mapped strictly to database role claims.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-[#0A1128] text-[11px] font-black uppercase text-slate-500">
                <th className="py-2.5 px-3">Operation / Capability</th>
                <th className="py-2.5 px-3 text-center">Admin</th>
                <th className="py-2.5 px-3 text-center">Staff / Security</th>
                <th className="py-2.5 px-3 text-center">Resident</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold">
              {permissions.map((p, idx) => (
                <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                  <td className="py-2.5 px-3 text-[#0A1128]">{p.name}</td>
                  <td className="py-2.5 px-3 text-center">
                    {p.admin ? (
                      <span className="inline-flex p-1 rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-full bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {p.staff ? (
                      <span className="inline-flex p-1 rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-full bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {p.resident ? (
                      <span className="inline-flex p-1 rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-full bg-slate-100 text-slate-400">
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
