import React, { useState } from 'react';
import { X, Send, Megaphone, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../services/adminService';

interface BroadcastNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BroadcastNotificationModal: React.FC<BroadcastNotificationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState<'SECURITY_NOTICE' | 'DELAY_ALERT' | 'SYSTEM'>('SYSTEM');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    adminService.broadcastNotification(title, body, type);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1128]/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#FEF9F3] border-3 border-[#0A1128] rounded-2xl shadow-[8px_8px_0px_#0A1128] p-5 sm:p-6 overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:bg-rose-100 transition-all text-[#0A1128]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-purple-600 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center justify-center text-white">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-[#0A1128]">Broadcast Alert</h3>
            <p className="text-xs font-semibold text-slate-600">Society-wide mobile notification</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">
              Alert Category
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128] shadow-[2px_2px_0px_#0A1128] focus:outline-none"
            >
              <option value="SYSTEM">System Announcement</option>
              <option value="SECURITY_NOTICE">Security Notice</option>
              <option value="DELAY_ALERT">Weather / Traffic Delivery Delay</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Evening Hub Pickup Window Extended to 10 PM"
              className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128] shadow-[2px_2px_0px_#0A1128] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">
              Message Body
            </label>
            <textarea
              required
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter instructions for residents or staff members..."
              className="w-full text-xs font-medium py-2.5 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128] shadow-[2px_2px_0px_#0A1128] focus:outline-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white text-[#0A1128] font-bold text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0A1128] active:translate-y-0 flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
