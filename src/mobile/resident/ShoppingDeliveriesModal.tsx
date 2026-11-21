import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Unlink,
  Link2,
  ShieldCheck,
  ShoppingBag,
  AlertCircle,
  ExternalLink,
  Ban,
  Lock,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import {
  SUPPORTED_PROVIDERS,
  connectProviderAccount,
  disconnectProviderAccount,
  isGoogleOAuthConfigured,
  type ProviderMetadata,
} from '../../services/shoppingSyncService';
import type { ShoppingProvider } from '../types';
import { CarrierLogo } from '../components/design-system';

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
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('info');

  if (!isOpen) return null;

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
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

      if (!result.success || !result.account) {
        showToast(result.error || 'Connection rejected: Real API access required.', 'error');
        setAuthorizingProvider(null);
        return;
      }

      connectShoppingAccount(result.account);
      showToast(`Connected ${authorizingProvider.name}. Checking for deliveries...`, 'success');
      setAuthorizingProvider(null);

      // Trigger sync
      setSyncingProvider(authorizingProvider.id);
      const discoveredCount = await syncShoppingOrders(authorizingProvider.id);
      setSyncingProvider(null);

      if (discoveredCount > 0) {
        showToast(`Discovered ${discoveredCount} inbound shipment${discoveredCount > 1 ? 's' : ''}!`, 'success');
      } else {
        showToast(`Connected! No active deliveries found right now.`, 'info');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || 'Connection failed.', 'error');
    }
  };

  const handleDisconnect = async (provider: ShoppingProvider, name: string) => {
    if (!confirm(`Disconnect ${name}?`)) {
      return;
    }
    try {
      await disconnectProviderAccount(currentUser?.id, provider);
      disconnectShoppingAccount(provider);
      showToast(`Disconnected ${name}.`, 'info');
    } catch (err) {
      console.error(err);
      showToast('Could not disconnect. Please try again.', 'error');
    }
  };

  const handleSyncOne = async (provider: ShoppingProvider, name: string) => {
    setSyncingProvider(provider);
    try {
      const count = await syncShoppingOrders(provider);
      if (count > 0) {
        showToast(`Sync complete! ${count} new package${count > 1 ? 's' : ''} added.`, 'success');
      } else {
        showToast(`Sync complete for ${name}. No new packages found.`, 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Sync encountered an error.', 'error');
    } finally {
      setSyncingProvider(null);
    }
  };

  const handleSyncAll = async () => {
    setIsSyncingAll(true);
    try {
      const count = await syncShoppingOrders();
      if (count > 0) {
        showToast(`Sync complete! ${count} new order${count > 1 ? 's' : ''} discovered.`, 'success');
      } else {
        showToast('Sync complete across linked accounts.', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not complete sync.', 'error');
    } finally {
      setIsSyncingAll(false);
    }
  };

  // Provider configuration list
  const providersConfig: {
    id: ShoppingProvider;
    name: string;
    subtitle: string;
    carrierKey: string;
  }[] = [
    {
      id: 'AMAZON',
      name: 'Amazon India',
      subtitle: 'Auto-track Amazon packages & delivery ETA',
      carrierKey: 'Amazon',
    },
    {
      id: 'FLIPKART',
      name: 'Flipkart',
      subtitle: 'Instant tracking for Ekart deliveries',
      carrierKey: 'Flipkart',
    },
    {
      id: 'MYNTRA',
      name: 'Myntra',
      subtitle: 'Fashion & lifestyle delivery tracking',
      carrierKey: 'Myntra',
    },
    {
      id: 'GMAIL',
      name: 'Gmail Auto-Track',
      subtitle: 'Universal parcel parser from email receipts',
      carrierKey: 'Gmail',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="bg-[#FEF9F3] w-full max-w-md rounded-3xl border-2 border-[#0B1E3F] shadow-[4px_4px_0px_#0B1E3F] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Screen 4 Spec: Header: "Connect Your Accounts", "Auto-track your orders and deliveries" */}
        <div className="px-5 py-4 bg-white border-b-2 border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFC72C] border-2 border-[#0B1E3F] shadow-[1.5px_1.5px_0px_#0B1E3F] flex items-center justify-center text-[#0B1E3F]">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#0B1E3F] tracking-tight">Connect Your Accounts</h2>
              <p className="text-[11px] font-bold text-slate-500">Auto-track your orders and deliveries</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full border-2 border-[#0B1E3F] bg-white hover:bg-slate-100 flex items-center justify-center text-[#0B1E3F] active:scale-95 transition-transform"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {/* Toast Notification */}
          {toastMessage && (
            <div
              className={`p-3 rounded-2xl text-xs font-black flex items-start gap-2 border-2 ${
                toastType === 'success'
                  ? 'bg-emerald-100 border-emerald-600 text-emerald-950'
                  : toastType === 'error'
                  ? 'bg-rose-100 border-rose-600 text-rose-950'
                  : 'bg-blue-100 border-blue-600 text-blue-950'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-snug">{toastMessage}</span>
            </div>
          )}

          {/* Quick Info Box */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-3 flex items-start gap-2.5 text-[11px] font-bold text-slate-600">
            <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
            <span>
              Connected carriers notify your society hub as soon as an order is out for delivery, pre-registering it before it reaches the gate.
            </span>
          </div>

          {/* Screen 4 Spec: Rows for Amazon, Flipkart, Myntra, Gmail with logos, connection status, sync buttons */}
          <div className="space-y-3">
            {providersConfig.map((item) => {
              const connected = connectedAccounts.find((a) => a.provider === item.id);
              const isSyncing = syncingProvider === item.id;
              const meta = SUPPORTED_PROVIDERS.find((p) => p.id === item.id) || {
                id: item.id,
                name: item.name,
                isDirectApiAvailable: true,
                statusExplanation: '',
              };

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] p-3.5 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <CarrierLogo carrier={item.carrierKey} size="lg" />
                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-[#0B1E3F] leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-[11px] font-bold text-slate-500 truncate mt-0.5">
                          {connected?.accountEmail || item.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {connected ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Connected</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-slate-500 bg-slate-100 border border-slate-300 shrink-0">
                        <span>Not Connected</span>
                      </span>
                    )}
                  </div>

                  {/* Action Buttons for this Provider */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400">
                      {connected ? `Last synced: ${connected.lastSyncedAt || 'Today'}` : 'Requires verification'}
                    </span>

                    <div className="flex items-center gap-2">
                      {connected ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSyncOne(item.id, item.name)}
                            disabled={isSyncing}
                            className="px-3 py-1.5 bg-[#FFC72C] hover:bg-[#F59E0B] text-[#0B1E3F] rounded-xl text-xs font-black border-2 border-[#0B1E3F] shadow-[1px_1px_0px_#0B1E3F] flex items-center gap-1 active:scale-95 transition-all disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDisconnect(item.id, item.name)}
                            className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors"
                            title="Disconnect account"
                          >
                            <Unlink className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartConnect(meta as any)}
                          className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-black border-2 border-[#0B1E3F] shadow-[1.5px_1.5px_0px_#0B1E3F] flex items-center gap-1 active:scale-95 transition-all"
                        >
                          <Link2 className="w-3 h-3 stroke-[2.5]" />
                          <span>Connect</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Bottom: Sync All Deliveries Button */}
        <div className="p-4 bg-white border-t-2 border-[#0B1E3F]">
          <button
            type="button"
            onClick={handleSyncAll}
            disabled={isSyncingAll}
            className="w-full py-3 px-4 bg-[#FFC72C] hover:bg-[#F59E0B] text-[#0B1E3F] font-black text-xs rounded-2xl border-2 border-[#0B1E3F] shadow-[2.5px_2.5px_0px_#0B1E3F] flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin' : ''}`} />
            <span>{isSyncingAll ? 'Scanning for Deliveries...' : 'Sync All Deliveries'}</span>
          </button>
        </div>
      </div>

      {/* Account Connection Confirmation Dialog */}
      {authorizingProvider && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white w-full max-w-sm rounded-3xl border-2 border-[#0B1E3F] shadow-[4px_4px_0px_#0B1E3F] p-5 space-y-4">
            <div className="flex items-center gap-3">
              <CarrierLogo carrier={authorizingProvider.id} size="lg" />
              <div>
                <h3 className="text-sm font-black text-[#0B1E3F]">
                  Connect {authorizingProvider.name}
                </h3>
                <p className="text-[11px] font-bold text-slate-500">
                  Allow ParcelFlow to sync order tracking
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500">
                Account Email
              </label>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-[#FEF9F3] text-xs font-bold text-[#0B1E3F] py-2 px-3 rounded-xl border-2 border-[#0B1E3F] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAuthorizingProvider(null)}
                className="flex-1 py-2 text-xs font-black text-slate-600 bg-slate-100 rounded-xl border border-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmConnect}
                className="flex-1 py-2 text-xs font-black text-white bg-[#2563EB] hover:bg-blue-600 rounded-xl border-2 border-[#0B1E3F] shadow-[1.5px_1.5px_0px_#0B1E3F]"
              >
                Authorize & Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
