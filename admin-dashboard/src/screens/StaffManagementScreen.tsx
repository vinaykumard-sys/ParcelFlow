import React, { useState } from 'react';
import { UserCheck, Clock, Phone, Plus, CheckCircle2, XCircle } from 'lucide-react';
import { Sticker } from '../components/Sticker';
import { adminService } from '../services/adminService';
import type { AdminStaff } from '../types';

interface StaffManagementScreenProps {
  refreshTrigger: number;
}

export const StaffManagementScreen: React.FC<StaffManagementScreenProps> = ({ refreshTrigger }) => {
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'HUB_OPERATOR' | 'SECURITY_GUARD' | 'SUPERVISOR' | 'MAINTENANCE'>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('+91 98450 ');
  const [newStaffRole, setNewStaffRole] = useState<'HUB_OPERATOR' | 'SECURITY_GUARD' | 'SUPERVISOR' | 'MAINTENANCE'>('HUB_OPERATOR');

  const staffList = adminService.getStaff();
  const activeSociety = adminService.getActiveSociety();

  const filteredStaff = staffList.filter((s) => {
    return roleFilter === 'ALL' || s.role_type === roleFilter;
  });

  const handleToggleStatus = (id: string) => {
    adminService.toggleStaffStatus(id);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName) return;

    adminService.addStaffMember({
      name: newStaffName,
      phone: newStaffPhone,
      email: `${newStaffName.toLowerCase().replace(/\s+/g, '.')}@societyhub.in`,
      role_type: newStaffRole,
    });

    setNewStaffName('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-[#0A1128] tracking-tight">Staff Management</h2>
            <Sticker color="purple" rotate="right" size="xs">
              {staffList.length} Team Members
            </Sticker>
          </div>
          <p className="text-xs font-semibold text-slate-600">
            Hub operators, security gatekeepers, and supervisors on duty at {activeSociety.name}.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="py-2 px-3.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Add Staff Member'}</span>
        </button>
      </div>

      {/* Add Staff Inline Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateStaff}
          className="rounded-2xl bg-amber-50/80 border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] p-5 space-y-4 animate-slide-up"
        >
          <h3 className="font-black text-sm text-[#0A1128]">Enroll New Society Staff Member</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-black uppercase text-[#0A1128] mb-1">Staff Name</label>
              <input
                type="text"
                required
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full text-xs font-bold py-2 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase text-[#0A1128] mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={newStaffPhone}
                onChange={(e) => setNewStaffPhone(e.target.value)}
                className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase text-[#0A1128] mb-1">Operational Role</label>
              <select
                value={newStaffRole}
                onChange={(e) => setNewStaffRole(e.target.value as any)}
                className="w-full text-xs font-bold py-2 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128] focus:outline-none"
              >
                <option value="HUB_OPERATOR">Hub Operator (Counter & Storage)</option>
                <option value="SECURITY_GUARD">Security Guard (Gate Intake)</option>
                <option value="SUPERVISOR">Hub Supervisor</option>
                <option value="MAINTENANCE">Maintenance & Support</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="py-1.5 px-3 rounded-xl bg-white text-xs font-bold border-2 border-[#0A1128]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-1.5 px-4 rounded-xl bg-blue-600 text-white text-xs font-extrabold border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128]"
            >
              Save Staff Member
            </button>
          </div>
        </form>
      )}

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {(['ALL', 'HUB_OPERATOR', 'SECURITY_GUARD', 'SUPERVISOR', 'MAINTENANCE'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`py-1.5 px-3 rounded-xl text-xs font-black border-2 border-[#0A1128] transition-all whitespace-nowrap ${
              roleFilter === r
                ? 'bg-blue-600 text-white shadow-[2px_2px_0px_#0A1128]'
                : 'bg-white hover:bg-slate-100 text-[#0A1128]'
            }`}
          >
            {r === 'ALL'
              ? 'All 12 Staff Members'
              : r === 'HUB_OPERATOR'
              ? 'Hub Operators'
              : r === 'SECURITY_GUARD'
              ? 'Gate Security'
              : r === 'SUPERVISOR'
              ? 'Supervisors'
              : 'Maintenance'}
          </button>
        ))}
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl bg-white border-2.5 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-slate-100 border border-[#0A1128]">
                  {s.staff_code}
                </span>
                <button
                  onClick={() => handleToggleStatus(s.id)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border border-[#0A1128] ${
                    s.is_active ? 'bg-emerald-300 text-emerald-950' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {s.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  <span>{s.is_active ? 'On Shift' : 'Off Shift'}</span>
                </button>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center justify-center font-black text-[#0A1128]">
                  {s.user?.full_name?.charAt(0) || 'S'}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#0A1128]">{s.user?.full_name}</h4>
                  <p className="text-[11px] font-bold text-blue-600">
                    {s.role_type === 'HUB_OPERATOR'
                      ? 'Hub Operator'
                      : s.role_type === 'SECURITY_GUARD'
                      ? 'Gate Dispatch Security'
                      : s.role_type === 'SUPERVISOR'
                      ? 'Hub Supervisor'
                      : 'Facility Tech'}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-medium text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Shift: {s.shift_timings}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{s.user?.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-slate-500">Security Verified</span>
              <button
                onClick={() => handleToggleStatus(s.id)}
                className="font-bold text-blue-600 hover:underline"
              >
                Toggle Shift
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
