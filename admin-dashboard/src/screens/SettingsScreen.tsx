import React, { useState } from 'react';
import { Settings, Shield, Clock, Download, CheckCircle2, Save } from 'lucide-react';
import { Sticker } from '../components/Sticker';
import { adminService } from '../services/adminService';

interface SettingsScreenProps {
  refreshTrigger: number;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ refreshTrigger }) => {
  const [settings, setSettings] = useState(adminService.getSettings());
  const [toastMsg, setToastMsg] = useState(false);
  const auditLogs = adminService.getAuditLogs();
  const activeSociety = adminService.getActiveSociety();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    adminService.updateSettings(settings);
    setToastMsg(true);
    setTimeout(() => setToastMsg(false), 2500);
  };

  const handleExportSystemState = () => {
    const backup = {
      society: activeSociety,
      kpis: adminService.getKPIs(),
      residents: adminService.getResidents(),
      staff: adminService.getStaff(),
      parcels: adminService.getParcels(),
      slots: adminService.getPickupSlots(),
      inventory: adminService.getHubInventory(),
      auditLogs: adminService.getAuditLogs(),
      timestamp: new Date().toISOString(),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `parcelflow_${activeSociety.code}_system_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-[#0A1128] tracking-tight">Society Settings & Audit Log</h2>
            <Sticker color="mint" rotate="right" size="xs">
              Config & Compliance
            </Sticker>
          </div>
          <p className="text-xs font-semibold text-slate-600">
            System configuration, OTP token lifespan, notifications, and security audit log for {activeSociety.name}.
          </p>
        </div>

        <button
          onClick={handleExportSystemState}
          className="py-2 px-3.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Full JSON Archive</span>
        </button>
      </div>

      {toastMsg && (
        <div className="py-2 px-4 rounded-xl bg-emerald-100 border-2 border-[#0A1128] text-emerald-950 font-extrabold text-xs shadow-[3px_3px_0px_#0A1128] flex items-center gap-2 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Configuration saved successfully and synced to Supabase backend!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="rounded-2xl bg-white border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] p-5 sm:p-6 space-y-5">
        <h3 className="font-extrabold text-base text-[#0A1128]">Society Parameters</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">Society Name</label>
            <input
              type="text"
              value={settings.societyName}
              onChange={(e) => setSettings({ ...settings, societyName: e.target.value })}
              className="w-full text-xs font-bold py-2 px-3 rounded-xl border-2 border-[#0A1128] bg-[#FEF9F3] text-[#0A1128] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">Society Code</label>
            <input
              type="text"
              value={settings.societyCode}
              onChange={(e) => setSettings({ ...settings, societyCode: e.target.value })}
              className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl border-2 border-[#0A1128] bg-[#FEF9F3] text-[#0A1128] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">Hub Counter Phone</label>
            <input
              type="text"
              value={settings.hubPhone}
              onChange={(e) => setSettings({ ...settings, hubPhone: e.target.value })}
              className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl border-2 border-[#0A1128] bg-[#FEF9F3] text-[#0A1128] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">Hub Operating Hours</label>
            <input
              type="text"
              value={settings.hubOperatingHours}
              onChange={(e) => setSettings({ ...settings, hubOperatingHours: e.target.value })}
              className="w-full text-xs font-bold py-2 px-3 rounded-xl border-2 border-[#0A1128] bg-[#FEF9F3] text-[#0A1128] focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t-2 border-slate-100">
          <h4 className="font-extrabold text-sm text-[#0A1128] mb-3">Security & Handover OTP Rules</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">OTP Validity (Minutes)</label>
              <input
                type="number"
                min={5}
                max={60}
                value={settings.otpExpiryMinutes}
                onChange={(e) => setSettings({ ...settings, otpExpiryMinutes: parseInt(e.target.value) || 15 })}
                className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl border-2 border-[#0A1128] bg-[#FEF9F3] text-[#0A1128] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">Max Failed Attempts</label>
              <input
                type="number"
                min={1}
                max={5}
                value={settings.maxOtpAttempts}
                onChange={(e) => setSettings({ ...settings, maxOtpAttempts: parseInt(e.target.value) || 3 })}
                className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl border-2 border-[#0A1128] bg-[#FEF9F3] text-[#0A1128] focus:outline-none"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0A1128] py-2">
                <input
                  type="checkbox"
                  checked={settings.whatsappAlerts}
                  onChange={(e) => setSettings({ ...settings, whatsappAlerts: e.target.checked })}
                  className="w-4 h-4 rounded border-2 border-[#0A1128] text-blue-600"
                />
                <span>Instant WhatsApp Alerts</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-blue-600 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Changes</span>
          </button>
        </div>
      </form>

      {/* Security Audit Log */}
      <div className="rounded-2xl bg-white border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-[#0A1128]">Security & Handover Audit Log</h3>
            <p className="text-xs font-semibold text-slate-500">Immutable ledger of every status change and OTP verification</p>
          </div>
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-slate-100 border border-[#0A1128]">
            {auditLogs.length} Events Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-[#0A1128] text-slate-500 font-black uppercase text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Target Entity</th>
                <th className="py-2.5 px-3">Actor User</th>
                <th className="py-2.5 px-3">Client Terminal / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-[#0A1128]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-amber-50/50">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold">
                    {log.entity_type} ({log.entity_id})
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-700">{log.user_id || 'System'}</td>
                  <td className="py-2.5 px-3 text-[11px] font-mono text-slate-500">
                    {log.ip_address} • {log.user_agent ? log.user_agent.split(' ')[0] : 'Portal'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Security & State Isolation */}
      <div className="rounded-2xl bg-rose-50/60 border-3 border-rose-300 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-sm text-rose-950 flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-700" />
            Session Isolation & Security
          </h3>
          <p className="text-xs font-semibold text-rose-800 mt-1 max-w-lg">
            Sign out and purge all active authentication tokens, society cache, and profile sessions to prevent cross-account data leakage.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            try {
              if (typeof localStorage !== 'undefined') {
                localStorage.removeItem('parcelflow_mobile_state_v2');
                localStorage.removeItem('parcelflow_mobile_state_v1');
                localStorage.removeItem('parcelflow_auth_user');
                localStorage.removeItem('parcelflow_active_role');
                Object.keys(localStorage).forEach((key) => {
                  if (key.startsWith('sb-') || key.includes('supabase')) {
                    localStorage.removeItem(key);
                  }
                });
              }
              if (typeof sessionStorage !== 'undefined') {
                sessionStorage.clear();
              }
            } catch {}
            window.location.href = '/app';
          }}
          className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] transition-all whitespace-nowrap"
        >
          Sign Out Admin & Clear Session
        </button>
      </div>
    </div>
  );
};
