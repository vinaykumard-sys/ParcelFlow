import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, MessageSquare, ChevronRight, Check } from 'lucide-react';
import { Sticker } from '../components/Sticker';
import { adminService } from '../services/adminService';
import type { Issue, IssueStatus } from '../types';

interface IssuesSupportScreenProps {
  refreshTrigger: number;
}

export const IssuesSupportScreen: React.FC<IssuesSupportScreenProps> = ({ refreshTrigger }) => {
  const [statusTab, setStatusTab] = useState<'ALL' | 'OPEN' | 'INVESTIGATING' | 'RESOLVED'>('ALL');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [localUpdate, setLocalUpdate] = useState(0);

  const issues = adminService.getIssues();
  const activeSociety = adminService.getActiveSociety();

  const filteredIssues = issues.filter((i) => {
    if (statusTab === 'ALL') return true;
    return i.status === statusTab;
  });

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue || !resolutionNote) return;

    adminService.resolveIssue(selectedIssue.id, resolutionNote);
    setSelectedIssue(null);
    setResolutionNote('');
    setToastMessage('Issue resolved successfully.');
    setLocalUpdate((v) => v + 1);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleStatusChange = (id: string, newStatus: IssueStatus) => {
    adminService.updateIssueStatus(id, newStatus);
    setToastMessage(`Status updated to ${newStatus}`);
    setLocalUpdate((v) => v + 1);
    setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-[#0A1128] tracking-tight">Issue Resolution & Support</h2>
            <Sticker color="yellow" rotate="right" size="xs">
              Dispute Triage
            </Sticker>
          </div>
          <p className="text-xs font-semibold text-slate-600">
            Handle resident disputes, damaged courier shipments, and OTP resend requests for {activeSociety.name}.
          </p>
        </div>

        {toastMessage && (
          <div className="py-1 px-3 rounded-xl bg-emerald-100 border-2 border-[#0A1128] text-emerald-950 font-extrabold text-xs shadow-[2px_2px_0px_#0A1128] flex items-center gap-1.5 animate-slide-up">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {(['ALL', 'OPEN', 'INVESTIGATING', 'RESOLVED'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setStatusTab(t)}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-black border-2 border-[#0A1128] transition-all whitespace-nowrap ${
              statusTab === t
                ? 'bg-blue-600 text-white shadow-[2px_2px_0px_#0A1128]'
                : 'bg-white hover:bg-slate-100 text-[#0A1128]'
            }`}
          >
            {t === 'ALL'
              ? 'All Tickets'
              : t === 'OPEN'
              ? '🔴 Open'
              : t === 'INVESTIGATING'
              ? '🟡 Investigating'
              : '🟢 Resolved'}
          </button>
        ))}
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIssues.map((issue) => (
          <div
            key={issue.id}
            className="rounded-2xl bg-white border-2.5 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 border border-[#0A1128]">
                  {issue.category}
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-[#0A1128] ${
                    issue.status === 'OPEN'
                      ? 'bg-rose-200 text-rose-950'
                      : issue.status === 'INVESTIGATING'
                      ? 'bg-amber-200 text-amber-950'
                      : 'bg-emerald-200 text-emerald-950'
                  }`}
                >
                  {issue.status}
                </span>
              </div>

              <h4 className="font-extrabold text-sm text-[#0A1128] mb-1.5">{issue.title}</h4>
              <p className="text-xs font-medium text-slate-600 mb-3">{issue.description}</p>

              {issue.resolution_notes && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-[#0A1128] text-[11px] font-medium text-emerald-900 mb-3">
                  <span className="font-bold block">Resolution Note:</span>
                  {issue.resolution_notes}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">
                {new Date(issue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>

              {issue.status !== 'RESOLVED' ? (
                <button
                  onClick={() => setSelectedIssue(issue)}
                  className="py-1 px-3 rounded-lg bg-emerald-500 text-white font-extrabold text-xs border border-[#0A1128] shadow-[1px_1px_0px_#0A1128] hover:-translate-y-0.5"
                >
                  Resolve Ticket
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Closed</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <div className="p-12 text-center text-slate-500 font-semibold text-xs rounded-2xl bg-white border-2 border-[#0A1128]">
          No tickets found matching this filter.
        </div>
      )}

      {/* Resolve Issue Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1128]/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#FEF9F3] border-3 border-[#0A1128] rounded-2xl shadow-[8px_8px_0px_#0A1128] p-5 sm:p-6 space-y-4">
            <h3 className="font-black text-base text-[#0A1128]">Resolve Issue: {selectedIssue.title}</h3>
            <p className="text-xs font-medium text-slate-600">{selectedIssue.description}</p>

            <form onSubmit={handleResolve} className="space-y-3">
              <div>
                <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">
                  Resolution Notes
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Enter investigation notes, resident confirmation, or compensation details..."
                  className="w-full text-xs font-medium py-2 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128] focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedIssue(null)}
                  className="flex-1 py-2 rounded-xl bg-white text-xs font-bold border-2 border-[#0A1128]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128]"
                >
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
