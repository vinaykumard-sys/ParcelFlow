import React, { useState } from 'react';
import {
  Crown,
  X,
  UserPlus,
  Shield,
  Copy,
  CheckCircle2,
  Trash2,
  Smartphone,
  Mail,
  QrCode,
  Sparkles,
  Phone,
  Building,
  KeyRound,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  getAdminInvitations,
  createAdminInvite,
  revokeAdminInvite,
  getOwnerUpiConfig,
  saveOwnerUpiConfig,
  isValidPhoneNumber,
  type AdminInvitation,
} from '../../services/ownerService';
import { SOCIETIES } from '../services/mobileState';
import { generateUpiDeepLink, generateUpiQrCodeUrl } from '../../services/upiPaymentService';

interface OwnerControlCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OwnerControlCenterModal: React.FC<OwnerControlCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'invite' | 'list' | 'upi'>('invite');

  // Invite Form State
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [selectedSocietyId, setSelectedSocietyId] = useState(SOCIETIES[0].id);
  const [invitations, setInvitations] = useState<AdminInvitation[]>(() => getAdminInvitations());
  const [latestCreatedInvite, setLatestCreatedInvite] = useState<AdminInvitation | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);

  // UPI Config State
  const [upiConfig, setUpiConfig] = useState(() => getOwnerUpiConfig());
  const [upiIdInput, setUpiIdInput] = useState(upiConfig.upiId);
  const [payeeNameInput, setPayeeNameInput] = useState(upiConfig.payeeName);
  const [upiSavedSuccess, setUpiSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const soc = SOCIETIES.find((s) => s.id === selectedSocietyId) || SOCIETIES[0];
    const res = await createAdminInvite({
      fullName: adminName,
      email: adminEmail,
      phone: adminPhone,
      societyId: soc.id,
      societyName: soc.name,
    });

    if (!res.success || !res.invite) {
      setFormError(res.error || 'Failed to issue invite.');
      return;
    }

    setLatestCreatedInvite(res.invite);
    setInvitations(getAdminInvitations());
    setAdminName('');
    setAdminEmail('');
    setAdminPhone('');
  };

  const handleRevoke = (id: string) => {
    revokeAdminInvite(id);
    setInvitations(getAdminInvitations());
  };

  const handleCopyCode = (code: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedOtp(code);
      setTimeout(() => setCopiedOtp(null), 2000);
    }
  };

  const handleSaveUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiIdInput.includes('@')) {
      alert('Please enter a valid UPI VPA (e.g. name@bank)');
      return;
    }
    const updated = saveOwnerUpiConfig({
      upiId: upiIdInput.trim(),
      payeeName: payeeNameInput.trim(),
    });
    setUpiConfig(updated);
    setUpiSavedSuccess(true);
    setTimeout(() => setUpiSavedSuccess(false), 2500);
  };

  const previewDeepLink = generateUpiDeepLink({
    amount: 100,
    transactionNote: 'ParcelFlow Test Payment',
    customUpiId: upiConfig.upiId,
    customPayeeName: upiConfig.payeeName,
  });
  const previewQr = generateUpiQrCodeUrl(previewDeepLink, 240);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-[#FEF9F3] w-full max-w-md rounded-[36px] border-3 border-[#060D1E] shadow-[6px_6px_0px_#060D1E] flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-400 border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center text-amber-950 font-black">
              <Crown className="w-5 h-5 fill-amber-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-black text-[#060D1E] tracking-tight">Owner Control Center</h2>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-[#1E60F2] border border-blue-300">
                  Vinay Kumar
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-500">Appoint Admins • Direct UPI Routing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border-2 border-[#060D1E] bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 active:scale-95"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 pb-1 bg-[#FEF9F3] shrink-0">
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200 rounded-2xl border border-slate-300 text-xs font-black">
            <button
              onClick={() => setActiveTab('invite')}
              className={`py-2 rounded-xl transition-all ${
                activeTab === 'invite'
                  ? 'bg-white text-[#060D1E] shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              Appoint Admin
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`py-2 rounded-xl transition-all ${
                activeTab === 'list'
                  ? 'bg-white text-[#060D1E] shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              Admins ({invitations.length})
            </button>
            <button
              onClick={() => setActiveTab('upi')}
              className={`py-2 rounded-xl transition-all ${
                activeTab === 'upi'
                  ? 'bg-white text-[#060D1E] shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              Owner UPI
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
          {activeTab === 'invite' && (
            <div className="space-y-3.5">
              {latestCreatedInvite && (
                <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-600 p-3.5 space-y-2 shadow-[2px_2px_0px_#060D1E]">
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Admin Invite Generated!</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700">
                    Share this 6-digit Activation OTP with <b>{latestCreatedInvite.fullName}</b> ({latestCreatedInvite.email}):
                  </p>
                  <div className="bg-white rounded-xl border-2 border-dashed border-emerald-600 p-2.5 flex items-center justify-between">
                    <span className="font-mono text-xl font-black text-emerald-950 tracking-widest">
                      {latestCreatedInvite.otpCode}
                    </span>
                    <button
                      onClick={() => handleCopyCode(latestCreatedInvite.otpCode)}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-black flex items-center gap-1 active:scale-95"
                    >
                      {copiedOtp === latestCreatedInvite.otpCode ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleCreateInvite} className="bg-white rounded-3xl border-2 border-[#060D1E] p-4 shadow-[2px_2px_0px_#060D1E] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#060D1E]">
                  <UserPlus className="w-4 h-4 text-[#1E60F2]" />
                  <span>Enter Real User Details to Appoint as Admin</span>
                </div>

                {formError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    Real Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Sharma"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-xs font-bold outline-none focus:border-[#1E60F2]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    Real Email ID (for OTP & login):
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ramesh.society@gmail.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-xs font-bold outline-none focus:border-[#1E60F2]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    Real 10-Digit Mobile Number:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9845012345"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-xs font-bold outline-none focus:border-[#1E60F2]"
                  />
                  <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">
                    Must be a valid 10-digit number starting with 6, 7, 8, or 9
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    Assign Society to Manage:
                  </label>
                  <select
                    value={selectedSocietyId}
                    onChange={(e) => setSelectedSocietyId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-xs font-bold bg-white outline-none focus:border-[#1E60F2]"
                  >
                    {SOCIETIES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.city})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1E60F2] hover:bg-blue-600 text-white rounded-2xl text-xs font-black border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <KeyRound className="w-4 h-4 text-white" />
                  <span>Issue Admin Invitation & Generate OTP</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'list' && (
            <div className="space-y-2.5">
              {invitations.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <Shield className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-black text-slate-700">No Admins Appointed Yet</p>
                  <p className="text-[11px] font-medium text-slate-400">
                    Use the 'Appoint Admin' tab to invite society administrators.
                  </p>
                </div>
              ) : (
                invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-white rounded-2xl border-2 border-[#060D1E] p-3.5 shadow-[2px_2px_0px_#060D1E] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-[#060D1E]">{inv.fullName}</span>
                        <span className="text-[10px] text-[#1E60F2] font-bold block">{inv.societyName}</span>
                      </div>
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                          inv.status === 'ACTIVATED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : inv.status === 'REVOKED'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>

                    <div className="text-[11px] font-semibold text-slate-600 space-y-0.5">
                      <p>📧 {inv.email}</p>
                      <p>📞 {inv.phone}</p>
                    </div>

                    {inv.status === 'PENDING' && (
                      <div className="bg-amber-50 rounded-xl p-2 border border-amber-200 flex items-center justify-between">
                        <span className="text-[10px] font-black text-amber-900">
                          Activation OTP: <b className="font-mono text-xs">{inv.otpCode}</b>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyCode(inv.otpCode)}
                            className="px-2 py-1 bg-white border border-slate-300 rounded text-[10px] font-black text-slate-700"
                          >
                            {copiedOtp === inv.otpCode ? 'Copied' : 'Copy'}
                          </button>
                          <button
                            onClick={() => handleRevoke(inv.id)}
                            className="px-2 py-1 bg-rose-50 text-rose-700 border border-rose-300 rounded text-[10px] font-black"
                          >
                            Revoke
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'upi' && (
            <div className="space-y-3.5">
              <form onSubmit={handleSaveUpi} className="bg-white rounded-3xl border-2 border-[#060D1E] p-4 shadow-[2px_2px_0px_#060D1E] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#060D1E]">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>Direct UPI Account Configuration</span>
                </div>
                <p className="text-[11px] font-bold text-slate-600 leading-snug">
                  All society subscription and resident service payments route straight to this UPI ID with 0% middleman deduction.
                </p>

                {upiSavedSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>UPI ID updated successfully!</span>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    Your UPI ID (VPA):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. vinaykumard45678@okhdfcbank"
                    value={upiIdInput}
                    onChange={(e) => setUpiIdInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-xs font-mono font-bold outline-none focus:border-[#1E60F2]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    Beneficiary / Payee Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vinay Kumar"
                    value={payeeNameInput}
                    onChange={(e) => setPayeeNameInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-xs font-bold outline-none focus:border-[#1E60F2]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] active:scale-95 transition-transform"
                >
                  Save Owner UPI Settings
                </button>
              </form>

              {/* Live Preview Card */}
              <div className="bg-white rounded-2xl border-2 border-[#060D1E] p-3.5 shadow-[2px_2px_0px_#060D1E] flex flex-col items-center text-center space-y-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  Live Dynamic UPI QR Code Preview
                </span>
                <img
                  src={previewQr}
                  alt="UPI QR Code"
                  className="w-40 h-40 rounded-xl border border-slate-300 p-1"
                />
                <span className="text-xs font-black text-[#060D1E] font-mono">
                  {upiConfig.upiId}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
