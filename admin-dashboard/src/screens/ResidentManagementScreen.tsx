import React, { useState } from 'react';
import { Users, Search, UserPlus, Filter, Phone, Mail, Building, CheckCircle2, XCircle, Download } from 'lucide-react';
import { Sticker } from '../components/Sticker';
import { adminService } from '../services/adminService';
import type { AdminResident } from '../types';

interface ResidentManagementScreenProps {
  onOpenAddModal: () => void;
  refreshTrigger: number;
}

export const ResidentManagementScreen: React.FC<ResidentManagementScreenProps> = ({ onOpenAddModal, refreshTrigger }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [towerFilter, setTowerFilter] = useState<'ALL' | 'Tower A' | 'Tower B' | 'Tower C'>('ALL');
  const [localUpdate, setLocalUpdate] = useState(0);
  const residents = adminService.getResidents();
  const activeSociety = adminService.getActiveSociety();

  const filteredResidents = residents.filter((r) => {
    const matchesSearch =
      r.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.flat_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm);

    const matchesTower =
      towerFilter === 'ALL' || (r.apartment?.tower && r.apartment.tower === towerFilter);

    return matchesSearch && matchesTower;
  });

  const handleToggleStatus = (id: string) => {
    adminService.toggleResidentStatus(id);
    setLocalUpdate((v) => v + 1);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Name,Flat Number,Tower,Phone,Email,Status\n' +
      residents
        .map(
          (r) =>
            `"${r.user?.full_name}","${r.flat_number}","${r.apartment?.tower || 'Tower A'}","${r.phone}","${r.user?.email}","${r.is_active ? 'ACTIVE' : 'INACTIVE'}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `parcelflow_${activeSociety.code}_residents.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-[#0A1128] tracking-tight">Resident Management</h2>
            <Sticker color="mint" rotate="right" size="xs">
              {residents.length} Registered Residents
            </Sticker>
          </div>
          <p className="text-xs font-semibold text-slate-600">
            Society directory for {activeSociety.name} • Notifications and parcel dispatch routing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-[#0A1128] font-bold text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="py-2 px-3.5 rounded-xl bg-amber-400 text-[#0A1128] font-extrabold text-xs border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Resident</span>
          </button>
        </div>
      </div>

      {/* Search & Tower Filters */}
      <div className="rounded-2xl bg-white border-2.5 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, flat #, or phone..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-bold border-2 border-[#0A1128] bg-[#FEF9F3] text-[#0A1128] placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'Tower A', 'Tower B', 'Tower C'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTowerFilter(t)}
              className={`py-1.5 px-3 rounded-xl text-xs font-black border-2 border-[#0A1128] transition-all whitespace-nowrap ${
                towerFilter === t
                  ? 'bg-blue-600 text-white shadow-[2px_2px_0px_#0A1128]'
                  : 'bg-white hover:bg-slate-100 text-[#0A1128]'
              }`}
            >
              {t === 'ALL' ? 'All Towers' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Residents Table */}
      <div className="rounded-2xl bg-white border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FFFDF9] border-b-2.5 border-[#0A1128] text-slate-600 font-black uppercase text-[10px]">
                <th className="py-3 px-4">Resident Name</th>
                <th className="py-3 px-4">Flat Number</th>
                <th className="py-3 px-4">Tower & Intercom</th>
                <th className="py-3 px-4">Mobile Contact</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-[#0A1128]">
              {filteredResidents.map((r) => (
                <tr key={r.id} className="hover:bg-amber-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-black text-xs border border-[#0A1128] flex items-center justify-center">
                        {r.user?.full_name?.charAt(0) || 'R'}
                      </div>
                      <span className="font-extrabold text-xs">{r.user?.full_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-amber-100 border border-[#0A1128] text-xs">
                      {r.flat_number}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <span className="font-semibold">{r.apartment?.tower || 'Tower A'}</span>
                    <span className="text-slate-400 font-mono ml-1.5">#{r.apartment?.intercom_number || '1402'}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {r.phone}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-600">
                    {r.user?.email || 'resident@society.in'}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(r.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-[#0A1128] transition-all ${
                        r.is_active
                          ? 'bg-emerald-300 text-emerald-950 hover:bg-emerald-400'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {r.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{r.is_active ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(r.id)}
                      className="text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      {r.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredResidents.length === 0 && (
          <div className="p-8 text-center text-slate-500 font-semibold text-xs">
            No residents found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};
