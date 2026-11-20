import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Unlink,
  Link2,
  ShieldCheck,
  Package,
  ShoppingBag,
  Mail,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import {
  SUPPORTED_PROVIDERS,
  connectProviderAccount,
  disconnectProviderAccount,
  type ProviderMetadata,
} from '../../services/shoppingSyncService';
import type { ShoppingProvider, ConnectedAccount } from '../types';

interface ShoppingDeliveriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShoppingDeliveriesModal: React.FC<ShoppingDeliveriesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentUser,
    connectedAccounts,
    connectShoppingAccount,
    disconnectShoppingAccount,
    syncShoppingOrders,
  } = useMobileStore();

  const [authorizingProvider, setAuthorizingProvider] = useState<ProviderMetadata | null>(null);
  const [authEmail, setAuthEmail] = useState(currentUser?.email || '');
  const [syncingProvider, setSyncingProvider] = useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStartConnect = (providerMeta: ProviderMetadata) => {
    setAuthorizingProvider(providerMeta);
    setAuthEmail(currentUser?.email || '');
  };

  const handleConfirmConnect = async () => {
    if (!authorizingProvider) return;
    try {
      const emailToUse = authEmail.trim() || currentUser?.email || 'user@example.com';
      const result = await connectProviderAccount(currentUser?.id, authorizingProvider.id, emailToUse);
      connectShoppingAccount(result.account);
      showToast(`Connected ${authorizingProvider.name}! Auto-syncing orders...`);
      setAuthorizingProvider(null);

      // Trigger immediate initial sync
      setSyncingProvider(authorizingProvider.id);
      const discoveredCount = await syncShoppingOrders(authorizingProvider.id);
      setSyncingProvider(null);
      if (discoveredCount > 0) {
        showToast(`Discovered ${discoveredCount} inbound shipment${discoveredCount > 1 ? 's' : ''}!`);
      }
    } catch (err) {
      console.error(err);
      showToast('Connection failed. Please try again.');
    }
  };

  const handleDisconnect = async (provider: ShoppingProvider, name: string) => {
    if (!confirm(`Disconnect ${name}? Inbound orders will no longer automatically sync.`)) {
      return;
    }
    try {
      await disconnectProviderAccount(currentUser?.id, provider);
      disconnectShoppingAccount(provider);
      showToast(`Disconnected ${name}.`);
    } catch (err) {
      console.error(err);
      showToast('Could not disconnect. Please try again.');
    }
  };

  const handleSyncOne = async (provider: ShoppingProvider, name: string) => {
    setSyncingProvider(provider);
    try {
      const count = await syncShoppingOrders(provider);
      if (count > 0) {
        showToast(`Sync complete! ${count} new package${count > 1 ? 's' : ''} added.`);
      } else {
        showToast(`${name} is up to date.`);
      }
    } catch (err) {
      console.error(err);
      showToast('Sync encountered an error.');
    } finally {
      setSyncingProvider(null);
    }
  };

  const handleSyncAll = async () => {
    setIsSyncingAll(true);
    try {
      const count = await syncShoppingOrders();
      if (count > 0) {
        showToast(`Sync complete! ${count} new order${count > 1 ? 's' : ''} discovered.`);
      } else {
        showToast('All connected shopping accounts are up to date.');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not complete all syncs.');
    } finally {
      setIsSyncingAll(false);
    }
  };

  const totalConnected = connectedAccounts.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="bg-[#FEF9F3] w-full max-w-md rounded-3xl border-3 border-[#060D1E] shadow-[5px_5px_0px_#060D1E] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-4 bg-white border-b-2 border-[#060D1E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center text-[#060D1E]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#060D1E] tracking-tight">Shopping & Deliveries</h2>
              <p className="text-[11px] font-bold text-slate-500">Auto-import orders & tracking</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border-2 border-[#060D1E] bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Notification Toast */}
          {toastMessage && (
            <div className="p-3 bg-emerald-100 border-2 border-emerald-600 rounded-2xl text-xs font-black text-emerald-950 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Value Prop Banner */}
          <div className="bg-blue-50 border-2 border-blue-600 rounded-2xl p-3.5 flex items-start gap-3 shadow-[2px_2px_0px_#1E60F2]">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-black text-blue-950">Zero manual typing</p>
              <p className="text-blue-900/80 font-bold mt-0.5 leading-relaxed">
                Connect your accounts once. ParcelFlow automatically retrieves delivery tracking and updates when your package arrives at your society hub.
              </p>
            </div>
          </div>

          {/* Sync All Action */}
          {totalConnected > 0 && (
            <div className="flex items-center justify-between bg-white rounded-2xl border-2 border-[#060D1E] p-3 shadow-[2px_2px_0px_#060D1E]">
              <div>
                <span className="text-xs font-black text-slate-800">
                  {totalConnected} of {SUPPORTED_PROVIDERS.length} Connected
                </span>
                <p className="text-[10px] font-bold text-slate-500">Scheduled auto-sync active</p>
              </div>
              <button
                type="button"
                onClick={handleSyncAll}
                disabled={isSyncingAll}
                className="py-1.5 px-3 bg-[#1E60F2] hover:bg-blue-600 text-white rounded-xl text-xs font-black border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center gap-1.5 active:scale-95 transition-transform disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
                <span>{isSyncingAll ? 'Syncing...' : 'Sync All'}</span>
              </button>
            </div>
          )}

          {/* Supported Providers List */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 px-1">
              Supported Platforms
            </h3>

            {SUPPORTED_PROVIDERS.map((provider) => {
              const connected = connectedAccounts.find((a) => a.provider === provider.id);
              const isSyncing = syncingProvider === provider.id;

              return (
                <div
                  key={provider.id}
                  className="bg-white rounded-2xl border-2 border-[#060D1E] p-3.5 shadow-[2px_2px_0px_#060D1E] flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-black border ${provider.badgeColor} border-black/20 shadow-xs`}>
                        {provider.name.split(' ')[0]}
                      </span>
                      <div>
                        <h4 className="text-xs font-black text-[#060D1E]">{provider.name}</h4>
                        {connected?.accountEmail && (
                          <p className="text-[10px] font-bold text-slate-500 truncate max-w-[150px]">
                            {connected.accountEmail}
                          </p>
                        )}
                      </div>
                    </div>

                    {connected ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Connected</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartConnect(provider)}
                        className="py-1 px-3 bg-amber-400 hover:bg-amber-500 text-[#060D1E] rounded-xl text-xs font-black border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center gap-1 active:scale-95 transition-transform"
                      >
                        <Link2 className="w-3 h-3" />
                        <span>Connect</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
                    {provider.description}
                  </p>

                  {/* Connected Actions Bar */}
                  {connected && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>Last synced: {connected.lastSyncedAt || 'Just now'}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSyncOne(provider.id, provider.name)}
                          disabled={isSyncing}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-300 flex items-center gap-1 text-[10px] font-black active:scale-95 transition-transform disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                          <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDisconnect(provider.id, provider.name)}
                          className="px-2 py-1 text-red-600 hover:bg-red-50 rounded-lg text-[10px] font-black flex items-center gap-1 active:scale-95 transition-transform"
                        >
                          <Unlink className="w-3 h-3" />
                          <span>Disconnect</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Privacy Guarantee */}
          <div className="bg-slate-100 border border-slate-300 rounded-2xl p-3 flex items-start gap-2.5 text-[11px] text-slate-600 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-slate-800">Bank-Grade Privacy:</span> ParcelFlow never asks for or stores account passwords. Only delivery tracking numbers and item summaries are processed.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t-2 border-[#060D1E] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-[#060D1E] hover:bg-slate-800 text-white rounded-2xl text-xs font-black shadow-[2px_2px_0px_#060D1E] active:scale-95 transition-transform"
          >
            Done
          </button>
        </div>
      </div>

      {/* Authorize Connection Dialog Modal */}
      {authorizingProvider && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none">
          <div className="bg-white w-full max-w-sm rounded-3xl border-3 border-[#060D1E] shadow-[5px_5px_0px_#060D1E] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-xl text-xs font-black border ${authorizingProvider.badgeColor} border-black/20`}>
                {authorizingProvider.name}
              </span>
              <button
                type="button"
                onClick={() => setAuthorizingProvider(null)}
                className="w-7 h-7 rounded-full border-2 border-[#060D1E] bg-slate-100 flex items-center justify-center text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h3 className="text-sm font-black text-[#060D1E]">
                Authorize Delivery Tracking
              </h3>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                Grant ParcelFlow read-only access to inbound package shipments for:
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                Account Email
              </label>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full p-2.5 rounded-xl border-2 border-[#060D1E] text-xs font-bold bg-[#FEF9F3] text-[#060D1E] focus:outline-hidden focus:ring-2 focus:ring-[#1E60F2]"
              />
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[10px] font-bold text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <span>
                ParcelFlow connects via authorized tracking endpoints. We never view payment methods or non-delivery emails.
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAuthorizingProvider(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black border border-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmConnect}
                className="flex-1 py-2 bg-[#1E60F2] hover:bg-blue-600 text-white rounded-xl text-xs font-black border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Authorize & Sync</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
