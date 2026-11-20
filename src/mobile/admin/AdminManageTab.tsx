import React, { useState } from 'react';
import { Users, UserPlus, Shield, Plus, Clock, Check, X, Phone, Building } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';

interface AdminManageTabProps {
  initialSubtab?: 'residents' | 'staff' | 'slots';
}

export const AdminManageTab: React.FC<AdminManageTabProps> = ({
  initialSubtab = 'residents',
}) => {
  const { residents, staff, slots, addResident, addStaff, toggleSlot } = useMobileStore();
  const [subtab, setSubtab] = useState<'residents' | 'staff' | 'slots'>(initialSubtab);

  // Add resident modal state
  const [showAddResident, setShowAddResident] = useState(false);
  const [resName, setResName] = useState('');
  const [resFlat, setResFlat] = useState('');
  const [resPhone, setResPhone] = useState('');

  // Add staff modal state
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [stfName, setStfName] = useState('');
  const [stfRole, setStfRole] = useState<'Security' | 'Parcel Hub' | 'Maintenance' | 'Supervisor'>('Security');
  const [stfPhone, setStfPhone] = useState('');

  const handleAddResidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resName || !resFlat) return;
    addResident({
      name: resName.trim(),
      flat: resFlat.trim(),
      phone: resPhone.trim() || '+91 98000 00000',
      email: `${resName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      society: 'Greenview Heights',
    });
    setResName('');
    setResFlat('');
    setResPhone('');
    setShowAddResident(false);
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stfName) return;
    addStaff({
      name: stfName.trim(),
      role: stfRole,
      phone: stfPhone.trim() || '+91 98000 00000',
      email: `${stfName.toLowerCase().replace(/\s+/g, '.')}@parcelflow.in`,
      society: 'Greenview Heights',
    });
    setStfName('');
    setStfPhone('');
    setShowAddStaff(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Top Header */}
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] sticky top-0 z-20">
        <h1 className="text-base font-black text-[#060D1E] tracking-tight">Society Management</h1>
        <p className="text-[11px] font-bold text-slate-500">Configure directory, personnel, and hub slots</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20 space-y-4">
        {/* Subtabs selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/80 rounded-2xl border border-slate-300 text-xs font-black">
          <button
            onClick={() => setSubtab('residents')}
            className={`py-2 rounded-xl transition-all ${
              subtab === 'residents'
                ? 'bg-white text-[#060D1E] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                : 'text-slate-600'
            }`}
          >
            Residents ({residents.length})
          </button>

          <button
            onClick={() => setSubtab('staff')}
            className={`py-2 rounded-xl transition-all ${
              subtab === 'staff'
                ? 'bg-white text-[#060D1E] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                : 'text-slate-600'
            }`}
          >
            Staff ({staff.length})
          </button>

          <button
            onClick={() => setSubtab('slots')}
            className={`py-2 rounded-xl transition-all ${
              subtab === 'slots'
                ? 'bg-white text-[#060D1E] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                : 'text-slate-600'
            }`}
          >
            Pickup Slots
          </button>
        </div>

        {/* SUBTAB 1: RESIDENTS */}
        {subtab === 'residents' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-500">
                Registered Residents ({residents.length})
              </span>
              <button
                onClick={() => setShowAddResident(true)}
                className="py-1.5 px-3 bg-[#1E60F2] hover:bg-blue-600 text-white font-black text-xs rounded-xl border border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Resident</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {residents.map((r) => (
                <div
                  key={r.id}
                  className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-[#060D1E] flex items-center justify-center font-black text-sm text-[#1E60F2]">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-[#060D1E]">{r.name}</h3>
                      <p className="text-[11px] font-bold text-slate-500">
                        Flat {r.flat} • {r.phone}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 2: STAFF */}
        {subtab === 'staff' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-500">
                Hub Staff & Security ({staff.length})
              </span>
              <button
                onClick={() => setShowAddStaff(true)}
                className="py-1.5 px-3 bg-[#10B981] hover:bg-emerald-600 text-white font-black text-xs rounded-xl border border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Staff</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {staff.map((s) => (
                <div
                  key={s.id}
                  className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-[#060D1E] flex items-center justify-center font-black text-sm text-emerald-700">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-[#060D1E]">{s.name}</h3>
                      <p className="text-[11px] font-bold text-slate-500">
                        {s.role} • {s.phone}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      s.status === 'Active'
                        ? 'text-emerald-800 bg-emerald-100 border-emerald-300'
                        : 'text-slate-600 bg-slate-100 border-slate-300'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 3: PICKUP SLOTS */}
        {subtab === 'slots' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-500">
                Evening Pickup Slots (6:00 – 9:30 PM)
              </span>
              <span className="text-[10px] font-black text-[#1E60F2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                Capacity: 25 / slot
              </span>
            </div>

            <div className="space-y-2.5">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-xs font-black text-[#060D1E]">{slot.timeWindow}</h3>
                    <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                      {slot.bookedCount} / {slot.capacity} booked ({Math.round((slot.bookedCount / slot.capacity) * 100)}%)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSlot(slot.id)}
                      className={`px-3 py-1 text-xs font-black rounded-xl border transition-all ${
                        slot.isAvailable
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {slot.isAvailable ? 'Available' : 'Full / Disabled'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Resident Modal */}
      {showAddResident && (
        <div className="absolute inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl border-[3px] border-[#060D1E] shadow-[6px_6px_0px_#060D1E] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black text-[#060D1E]">Add New Resident</h2>
              <button onClick={() => setShowAddResident(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-black" />
              </button>
            </div>

            <form onSubmit={handleAddResidentSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                  placeholder="e.g. Aditi Rao"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Flat Number</label>
                <input
                  type="text"
                  required
                  value={resFlat}
                  onChange={(e) => setResFlat(e.target.value)}
                  placeholder="e.g. B-204"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Mobile</label>
                <input
                  type="tel"
                  value={resPhone}
                  onChange={(e) => setResPhone(e.target.value)}
                  placeholder="+91 98765 11223"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddResident(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1E60F2] text-white text-xs font-black border border-[#060D1E] shadow-[2px_2px_0px_#060D1E]"
                >
                  Save Resident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaff && (
        <div className="absolute inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl border-[3px] border-[#060D1E] shadow-[6px_6px_0px_#060D1E] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black text-[#060D1E]">Add Hub Staff Member</h2>
              <button onClick={() => setShowAddStaff(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-black" />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Staff Name</label>
                <input
                  type="text"
                  required
                  value={stfName}
                  onChange={(e) => setStfName(e.target.value)}
                  placeholder="e.g. Praveen Kumar"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Role</label>
                <select
                  value={stfRole}
                  onChange={(e) => setStfRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                >
                  <option value="Security">Security (Main Gate)</option>
                  <option value="Parcel Hub">Parcel Hub Attendant</option>
                  <option value="Supervisor">Hub Supervisor</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Phone</label>
                <input
                  type="tel"
                  value={stfPhone}
                  onChange={(e) => setStfPhone(e.target.value)}
                  placeholder="+91 98450 99887"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaff(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#10B981] text-white text-xs font-black border border-[#060D1E] shadow-[2px_2px_0px_#060D1E]"
                >
                  Save Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
