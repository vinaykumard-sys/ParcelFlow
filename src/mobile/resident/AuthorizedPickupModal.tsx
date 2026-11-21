import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  Shield,
  Plus,
  Trash2,
  Calendar,
  Clock,
  User,
  Check,
  CheckSquare,
  Square,
  AlertCircle,
  Copy,
  ChevronRight,
  Sparkles,
  Phone,
} from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import {
  createPickupAuthorization,
  getResidentAuthorizations,
  revokePickupAuthorization,
} from '../../services/pickupAuthorizationService';
import type { PickupAuthorization } from '../../services/types';
import { CarrierLogo } from '../components/design-system';

interface AuthorizedPickupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RELATIONSHIPS = [
  'Family Member',
  'Spouse / Partner',
  'Parent',
  'Sibling',
  'Roommate / Flatmate',
  'Friend',
  'House Help / Maid',
  'Colleague',
  'Other',
];

export const AuthorizedPickupModal: React.FC<AuthorizedPickupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { parcels, currentUser, selectedSociety } = useMobileStore();

  const [activeTab, setActiveTab] = useState<'create' | 'active'>('create');
  const [authorizations, setAuthorizations] = useState<PickupAuthorization[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [personName, setPersonName] = useState<string>('');
  const [relationship, setRelationship] = useState<string>(RELATIONSHIPS[0]);
  const [phone, setPhone] = useState<string>('');
  const [selectedParcelIds, setSelectedParcelIds] = useState<string[]>([]);
  const [validUntilHours, setValidUntilHours] = useState<number>(24); // default 24h
  const [notes, setNotes] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Eligible parcels
  const activeParcels = parcels.filter((p) => p.status !== 'COLLECTED');

  // Load existing authorizations
  const loadAuthorizations = async () => {
    if (!currentUser?.id) return;
    setIsLoading(true);
    try {
      const res = await getResidentAuthorizations(currentUser.id);
      setAuthorizations(res);
    } catch (err) {
      console.warn('Failed to fetch authorizations', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAuthorizations();
      // Pre-select all active parcels by default
      setSelectedParcelIds(activeParcels.map((p) => p.id));
      setFormError('');
      setSuccessMessage('');
    }
  }, [isOpen, currentUser?.id]);

  if (!isOpen) return null;

  const handleToggleParcel = (parcelId: string) => {
    setSelectedParcelIds((prev) =>
      prev.includes(parcelId)
        ? prev.filter((id) => id !== parcelId)
        : [...prev, parcelId]
    );
  };

  const handleSelectAllParcels = () => {
    if (selectedParcelIds.length === activeParcels.length) {
      setSelectedParcelIds([]);
    } else {
      setSelectedParcelIds(activeParcels.map((p) => p.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!personName.trim()) {
      setFormError('Please enter the name of the authorized person.');
      return;
    }

    if (selectedParcelIds.length === 0) {
      setFormError('Please select at least one parcel for this authorization.');
      return;
    }

    setIsSubmitting(true);
    try {
      const residentId = currentUser?.id || 'res-demo';
      const societyId = selectedSociety.id || 'soc-1';

      const validDate = new Date();
      validDate.setHours(validDate.getHours() + validUntilHours);

      const res = await createPickupAuthorization({
        resident_id: residentId,
        society_id: societyId,
        authorized_name: personName,
        relationship,
        authorized_phone: phone || undefined,
        allowed_parcel_ids: selectedParcelIds,
        valid_until: validDate.toISOString(),
        notes: notes || undefined,
      });

      if (res.success && res.authorization) {
        setAuthorizations((prev) => [res.authorization!, ...prev]);
        setSuccessMessage(`Authorization created for ${personName}! OTP: ${res.authorization.otp_code}`);
        setPersonName('');
        setPhone('');
        setNotes('');
        setActiveTab('active');
      } else {
        setFormError(res.message || 'Failed to create authorization.');
      }
    } catch (err: any) {
      setFormError(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!window.confirm('Are you sure you want to revoke this authorization? The delegate will no longer be able to collect parcels.')) {
      return;
    }

    try {
      await revokePickupAuthorization(id, currentUser?.id);
      setAuthorizations((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, is_active: false, status: 'REVOKED' } : a
        )
      );
    } catch (err) {
      console.error('Failed to revoke', err);
    }
  };

  const handleCopyOtp = (otp: string, id: string) => {
    navigator.clipboard?.writeText(otp);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FEF9F3] text-[#0B1E3F] rounded-t-[32px] sm:rounded-[32px] border-2 border-[#0B1E3F] shadow-[0px_-8px_30px_rgba(0,0,0,0.2)] max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header Bar */}
        <div className="p-4 border-b-2 border-[#0B1E3F] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] flex items-center justify-center text-indigo-700">
              <UserCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight">
                  Allow Someone to Collect
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300">
                  Delegate
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500">
                Grant pickup permission to family or friends
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border-2 border-[#0B1E3F] bg-slate-100 hover:bg-slate-200 flex items-center justify-center active:scale-95 transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 pb-2 bg-[#FEF9F3] flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 px-3 rounded-2xl border-2 border-[#0B1E3F] text-xs font-black transition-all ${
              activeTab === 'create'
                ? 'bg-[#1E60F2] text-white shadow-[2px_2px_0px_#0B1E3F]'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            + New Authorization
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 px-3 rounded-2xl border-2 border-[#0B1E3F] text-xs font-black transition-all relative ${
              activeTab === 'active'
                ? 'bg-[#1E60F2] text-white shadow-[2px_2px_0px_#0B1E3F]'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Active Passes ({authorizations.filter((a) => a.is_active).length})
          </button>
        </div>

        {/* Success / Error Messages */}
        {formError && (
          <div className="mx-5 my-2 p-3 bg-red-50 border-2 border-red-400 rounded-2xl text-xs font-bold text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-5 my-2 p-3 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'create' ? (
            /* Creation Form (Screen 5 Spec) */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Person Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#0B1E3F] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Person Name *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma, Rahul Verma"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#0B1E3F] bg-white text-xs font-bold text-[#0B1E3F] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[2px_2px_0px_#0B1E3F]"
                  required
                />
              </div>

              {/* Relationship Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#0B1E3F] flex items-center gap-1.5">
                  <span>Relationship *</span>
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#0B1E3F] bg-white text-xs font-bold text-[#0B1E3F] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[2px_2px_0px_#0B1E3F]"
                >
                  {RELATIONSHIPS.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#0B1E3F] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Phone Number (Optional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#0B1E3F] bg-white text-xs font-bold text-[#0B1E3F] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[2px_2px_0px_#0B1E3F]"
                />
              </div>

              {/* Select Parcel(s) Checkboxes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-[#0B1E3F]">
                    Select Parcel(s) to Collect *
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllParcels}
                    className="text-[11px] font-black text-[#1E60F2] hover:underline"
                  >
                    {selectedParcelIds.length === activeParcels.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>
                </div>

                {activeParcels.length === 0 ? (
                  <div className="p-3 text-center rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-500">
                    No active parcels currently available to authorize.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {activeParcels.map((parcel) => {
                      const isSelected = selectedParcelIds.includes(parcel.id);
                      return (
                        <div
                          key={parcel.id}
                          onClick={() => handleToggleParcel(parcel.id)}
                          className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-blue-50 border-[#1E60F2] shadow-[2px_2px_0px_#1E60F2]'
                              : 'bg-white border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#1E60F2] shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <CarrierLogo carrier={parcel.carrier} size="sm" />
                            <div className="min-w-0">
                              <p className="text-xs font-black text-[#0B1E3F] truncate">
                                {parcel.description || `${parcel.carrier} Parcel`}
                              </p>
                              <p className="text-[10px] font-bold text-slate-500 truncate">
                                {parcel.carrier} • #{parcel.trackingNumber}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 shrink-0">
                            {parcel.storageLocation || 'Hub A'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Valid Until Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#0B1E3F] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Valid Until *</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Today (8h)', hours: 8 },
                    { label: '24 Hours', hours: 24 },
                    { label: '3 Days', hours: 72 },
                  ].map((option) => (
                    <button
                      key={option.hours}
                      type="button"
                      onClick={() => setValidUntilHours(option.hours)}
                      className={`py-2 px-2 rounded-xl border-2 text-xs font-black transition-all ${
                        validUntilHours === option.hours
                          ? 'bg-[#FFC72C] border-[#0B1E3F] text-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]'
                          : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Audit Notice */}
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center gap-2 text-[11px] font-bold text-indigo-900">
                <Shield className="w-4 h-4 text-indigo-700 shrink-0" />
                <span>
                  Generates an OTP and verification pass logged in society audit trail.
                </span>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-[#FFC72C] hover:bg-[#F59E0B] text-[#0B1E3F] font-black text-sm rounded-2xl border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span>{isSubmitting ? 'Creating Authorization...' : 'Create Authorization'}</span>
                <Check className="w-4 h-4 stroke-[3]" />
              </button>
            </form>
          ) : (
            /* Active Authorizations List */
            <div className="space-y-3">
              {isLoading ? (
                <div className="p-8 text-center text-xs font-bold text-slate-500">
                  Loading authorizations...
                </div>
              ) : authorizations.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto text-indigo-600">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-black text-[#0B1E3F]">No Passes Created Yet</h3>
                  <p className="text-xs font-bold text-slate-500">
                    Allow family, roommates, or friends to pick up your deliveries securely.
                  </p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="mt-2 px-4 py-2 bg-[#FFC72C] text-[#0B1E3F] text-xs font-black rounded-xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]"
                  >
                    Create First Pass
                  </button>
                </div>
              ) : (
                authorizations.map((auth) => {
                  const isActive = auth.is_active && auth.status === 'ACTIVE';
                  const isCopied = copiedId === auth.id;

                  return (
                    <div
                      key={auth.id}
                      className="p-4 rounded-3xl bg-white border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-[#0B1E3F]">
                              {auth.authorized_name}
                            </h4>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300">
                              {auth.relationship}
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                            Valid until:{' '}
                            {new Date(auth.valid_until).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>

                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 text-slate-500 border border-slate-300'
                          }`}
                        >
                          {auth.status}
                        </span>
                      </div>

                      {/* OTP & Parcel Count Box */}
                      {isActive && (
                        <div className="p-3 bg-amber-50 rounded-2xl border-2 border-[#0B1E3F] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-500 block">
                              Delegate Security OTP
                            </span>
                            <span className="text-lg font-black tracking-widest text-[#0B1E3F]">
                              {auth.otp_code || '639148'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyOtp(auth.otp_code || '639148', auth.id)}
                              className="px-3 py-1.5 bg-white border border-[#0B1E3F] rounded-xl text-xs font-black flex items-center gap-1 active:scale-95"
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>{isCopied ? 'Copied' : 'Copy'}</span>
                            </button>

                            <button
                              onClick={() => handleRevoke(auth.id)}
                              className="p-2 bg-red-50 text-red-700 border border-red-300 rounded-xl hover:bg-red-100 active:scale-95"
                              title="Revoke Authorization"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="text-[10px] font-bold text-slate-500 flex items-center justify-between">
                        <span>
                          {auth.allowed_parcel_ids?.length || 1} parcel(s) authorized
                        </span>
                        <span>Created {new Date(auth.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
