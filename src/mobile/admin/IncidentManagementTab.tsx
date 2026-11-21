import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Camera,
  RefreshCw,
  Search,
  Filter,
  X,
  FileText,
  User,
  Package,
  Eye,
  MessageSquare,
} from 'lucide-react';
import {
  getIncidents,
  updateIncidentStatus,
} from '../../services/incidentService';
import type { ParcelIncident, IncidentStatus, IncidentIssueType } from '../../services/types';
import { useMobileStore } from '../services/mobileState';

export const IncidentManagementTab: React.FC = () => {
  const { selectedSociety, currentUser } = useMobileStore();
  const [incidents, setIncidents] = useState<ParcelIncident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | IncidentStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Resolution modal state
  const [resolvingIncident, setResolvingIncident] = useState<ParcelIncident | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Photo viewer lightbox
  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getIncidents(selectedSociety?.id);
      setIncidents(data);
    } catch (err) {
      console.error('Failed to load incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedSociety?.id]);

  const handleUpdateStatus = async (
    incidentId: string,
    newStatus: IncidentStatus,
    notes?: string
  ) => {
    setIsUpdating(true);
    try {
      const res = await updateIncidentStatus(
        incidentId,
        newStatus,
        notes,
        currentUser?.id
      );
      if (res.success) {
        await loadData();
        setResolvingIncident(null);
        setResolutionNotes('');
      }
    } catch (err) {
      console.error('Failed to update incident:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredIncidents = incidents.filter((item) => {
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchReporter = item.reporter_name?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchType = item.issue_type?.toLowerCase().includes(q);
      const matchTracking = item.parcel?.tracking_number?.toLowerCase().includes(q);
      return matchReporter || matchDesc || matchType || matchTracking;
    }
    return true;
  });

  const getIssueBadge = (type: IncidentIssueType) => {
    switch (type) {
      case 'DAMAGED_PARCEL':
        return { label: 'Damaged Parcel', color: 'bg-rose-100 text-rose-800 border-rose-300' };
      case 'WRONG_PARCEL':
        return { label: 'Wrong Parcel', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'MISSING_PARCEL':
        return { label: 'Missing Parcel', color: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'OPENED_PACKAGE':
        return { label: 'Opened Package', color: 'bg-orange-100 text-orange-800 border-orange-300' };
      case 'LABEL_UNREADABLE':
        return { label: 'Label Smudged', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      default:
        return { label: 'Other Issue', color: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'OPEN':
        return 'bg-rose-500 text-white';
      case 'UNDER_REVIEW':
        return 'bg-amber-400 text-amber-950';
      case 'RESOLVED':
        return 'bg-emerald-500 text-white';
      case 'DISMISSED':
        return 'bg-slate-400 text-white';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none overflow-y-auto p-4 sm:p-5 space-y-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-[#060D1E] tracking-tight">
              Incident Management
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
              {incidents.filter((i) => i.status === 'OPEN').length} Open
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Screen 10 Resolution Board • Photo evidence & damage investigations
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2 rounded-xl bg-white hover:bg-slate-50 border-2 border-[#060D1E] shadow-[1.5px_1.5px_0px_#060D1E] active:scale-95 transition-transform"
          aria-label="Refresh"
        >
          <RefreshCw className="w-4 h-4 text-[#060D1E]" />
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search incident descriptions, tracking IDs, or reporters..."
            className="w-full bg-white text-xs font-bold text-[#060D1E] py-2.5 pl-8 pr-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['ALL', 'OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'] as const).map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-black whitespace-nowrap transition-all ${
                  statusFilter === tab
                    ? 'bg-[#060D1E] text-white border-[#060D1E] shadow-sm'
                    : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            )
          )}
        </div>
      </div>

      {/* 3. Incidents List */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 text-[#1E60F2] animate-spin" />
          <span className="text-xs font-bold text-slate-500">Loading incident records...</span>
        </div>
      ) : filteredIncidents.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] p-8 text-center shadow-[3px_3px_0px_#060D1E]">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
          <h3 className="font-black text-sm text-[#060D1E]">No Incidents Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {statusFilter === 'ALL'
              ? 'Zero parcel damages or security incidents reported for this society.'
              : `No incidents matching status "${statusFilter}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIncidents.map((inc) => {
            const badge = getIssueBadge(inc.issue_type);
            const statusClass = getStatusBadge(inc.status);

            return (
              <div
                key={inc.id}
                className="bg-white rounded-3xl border-2 border-[#060D1E] p-4 shadow-[3px_3px_0px_#060D1E] space-y-3"
              >
                {/* Header: Issue & Status */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border border-[#060D1E] uppercase tracking-wider ${statusClass}`}
                  >
                    {inc.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs font-semibold text-[#060D1E] leading-relaxed">
                  {inc.description}
                </p>

                {/* Photo Evidence Thumbnails */}
                {inc.photos && inc.photos.length > 0 && (
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 block mb-1.5">
                      Photo Evidence ({inc.photos.length})
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {inc.photos.map((photo, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => setViewingPhoto(photo)}
                          className="w-16 h-16 rounded-xl border-2 border-[#060D1E] overflow-hidden flex-shrink-0 cursor-pointer relative group bg-black"
                        >
                          <img
                            src={photo}
                            alt={`Evidence ${pIdx + 1}`}
                            className="w-full h-full object-cover group-hover:opacity-85 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata: Reporter & Date */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reported by: <strong>{inc.reporter_name || 'Staff'}</strong></span>
                  </div>
                  <span>
                    {new Date(inc.created_at).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Resolution Notes if Resolved */}
                {inc.resolution_notes && (
                  <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-200 text-xs">
                    <span className="text-[10px] font-black uppercase text-emerald-800 block">
                      Resolution Notes
                    </span>
                    <span className="text-emerald-950 font-medium">{inc.resolution_notes}</span>
                  </div>
                )}

                {/* Action Buttons */}
                {inc.status !== 'RESOLVED' && inc.status !== 'DISMISSED' && (
                  <div className="pt-2 flex items-center gap-2">
                    {inc.status === 'OPEN' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(inc.id, 'UNDER_REVIEW')}
                        className="flex-1 py-2 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-black text-xs rounded-xl transition-all"
                      >
                        Mark Under Review
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setResolvingIncident(inc)}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl border border-[#060D1E] shadow-[1.5px_1.5px_0px_#060D1E] active:scale-95 transition-all"
                    >
                      Resolve Incident
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(inc.id, 'DISMISSED', 'Dismissed by Admin')}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl border border-slate-300 transition-all"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Resolve Incident Modal */}
      {resolvingIncident && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#FEF9F3] text-[#060D1E] rounded-3xl border-2 border-[#060D1E] shadow-2xl p-5 space-y-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-black text-sm text-[#060D1E]">
                Resolve Incident
              </h3>
              <button
                type="button"
                onClick={() => setResolvingIncident(null)}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Enter resolution notes (e.g. Courier compensated, resident accepted packaging, replacement dispatched):
            </p>

            <textarea
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Resolution details..."
              className="w-full p-2.5 bg-white rounded-xl border-2 border-[#060D1E] text-xs font-medium focus:outline-none"
            />

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResolvingIncident(null)}
                className="flex-1 py-2 bg-white text-[#060D1E] font-black text-xs rounded-xl border border-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() =>
                  handleUpdateStatus(
                    resolvingIncident.id,
                    'RESOLVED',
                    resolutionNotes || 'Resolved by Society Admin'
                  )
                }
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl border border-[#060D1E] shadow-[1.5px_1.5px_0px_#060D1E] disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Confirm Resolution'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Full Screen Photo Viewer Lightbox */}
      {viewingPhoto && (
        <div
          onClick={() => setViewingPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-lg max-h-[85vh] rounded-2xl overflow-hidden border-2 border-white/20">
            <button
              type="button"
              onClick={() => setViewingPhoto(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={viewingPhoto}
              alt="Enlarged photo evidence"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
