import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  Filter,
  Package,
  ShoppingCart,
  AlertTriangle,
  ChevronRight,
  ArrowRight,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import { executeSmartSearch } from '../../services/smartSearchService';
import type {
  SmartSearchCategory,
  SmartSearchResultItem,
} from '../../services/types';
import type { MobileParcel } from '../types';
import { CarrierLogo } from '../components/design-system';

interface SmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectParcel?: (parcel: MobileParcel) => void;
}

const CATEGORY_TABS: Array<{ id: SmartSearchCategory; label: string; icon: any }> = [
  { id: 'ALL', label: 'All', icon: Sparkles },
  { id: 'PARCELS', label: 'Parcels', icon: Package },
  { id: 'ORDERS', label: 'Orders', icon: ShoppingCart },
  { id: 'INCIDENTS', label: 'Incidents', icon: AlertTriangle },
];

export const SmartSearchModal: React.FC<SmartSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectParcel,
}) => {
  const { parcels, currentUser, selectedSociety } = useMobileStore();

  const [query, setQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<SmartSearchCategory>('ALL');
  const [results, setResults] = useState<SmartSearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Quick Suggestion Chips
  const SUGGESTION_CHIPS = [
    'Ready for pickup',
    'Amazon',
    'Flipkart',
    'Arrived today',
    'Hub Alpha',
  ];

  // Perform search across smartSearchService and local store
  useEffect(() => {
    if (!isOpen) return;

    let isCurrent = true;
    setIsSearching(true);

    const debounceTimer = setTimeout(async () => {
      try {
        const searchItems = await executeSmartSearch({
          query,
          category: activeCategory,
          societyId: selectedSociety.id,
          residentId: currentUser?.id,
        });

        if (!isCurrent) return;

        // Fallback / merge with local store parcels for instant offline responsiveness
        const qLower = query.toLowerCase().trim();
        const localMatches: SmartSearchResultItem[] = parcels
          .filter((p) => {
            if (activeCategory === 'INCIDENTS') return false;
            if (!qLower) return true;
            return (
              p.trackingNumber.toLowerCase().includes(qLower) ||
              p.carrier.toLowerCase().includes(qLower) ||
              (p.description && p.description.toLowerCase().includes(qLower)) ||
              (p.storageLocation && p.storageLocation.toLowerCase().includes(qLower)) ||
              p.status.toLowerCase().includes(qLower) ||
              p.flat.toLowerCase().includes(qLower)
            );
          })
          .map((p) => ({
            id: p.id,
            type: 'PARCEL',
            title: p.description || `${p.carrier} Parcel`,
            subtitle: `${p.carrier} • #${p.trackingNumber}`,
            status:
              p.status === 'READY_FOR_PICKUP' || p.status === 'SCHEDULED'
                ? 'Ready for Pickup'
                : p.status === 'COLLECTED'
                ? 'Collected'
                : 'Received at Hub',
            statusBadgeColor:
              p.status === 'READY_FOR_PICKUP' || p.status === 'SCHEDULED'
                ? 'green'
                : p.status === 'COLLECTED'
                ? 'slate'
                : 'blue',
            date: p.receivedAt || 'Today',
            tracking_number: p.trackingNumber,
            carrier: p.carrier,
            flat: p.flat,
            recipient_name: p.recipientName,
            storage_location: p.storageLocation || 'Hub A',
            raw: p,
          }));

        // Combine unique by ID
        const combinedMap = new Map<string, SmartSearchResultItem>();
        for (const item of searchItems) {
          combinedMap.set(item.id, item);
        }
        for (const item of localMatches) {
          if (!combinedMap.has(item.id)) {
            combinedMap.set(item.id, item);
          }
        }

        setResults(Array.from(combinedMap.values()));
      } catch (err) {
        console.warn('Smart search service error:', err);
      } finally {
        if (isCurrent) setIsSearching(false);
      }
    }, 200);

    return () => {
      isCurrent = false;
      clearTimeout(debounceTimer);
    };
  }, [query, activeCategory, isOpen, parcels.length, selectedSociety.id, currentUser?.id]);

  if (!isOpen) return null;

  const handleSelectResult = (item: SmartSearchResultItem) => {
    onClose();
    if (onSelectParcel) {
      // Find matching MobileParcel or build one
      const matched = parcels.find(
        (p) => p.id === item.id || p.trackingNumber === item.tracking_number
      );
      if (matched) {
        onSelectParcel(matched);
      } else {
        const dummy: MobileParcel = {
          id: item.id,
          trackingNumber: item.tracking_number || 'TRK1000',
          carrier: (item.carrier as any) || 'Other',
          description: item.title,
          status: item.status.includes('Ready') ? 'READY_FOR_PICKUP' : 'WAITING',
          recipientName: item.recipient_name || currentUser?.name || 'Resident',
          recipientPhone: currentUser?.phone || '9999999999',
          flat: item.flat || currentUser?.flatNumber || 'Flat 402',
          storageLocation: item.storage_location || 'Hub A - S3',
          receivedAt: item.date || 'Today, 10:00 AM',
          timeline: [],
        };
        onSelectParcel(dummy);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FEF9F3] text-[#0B1E3F] rounded-t-[32px] sm:rounded-[32px] border-2 border-[#0B1E3F] shadow-[0px_-8px_30px_rgba(0,0,0,0.2)] max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header Bar with Search Bar */}
        <div className="p-4 border-b-2 border-[#0B1E3F] bg-white space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight">Smart Search</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-[#1E60F2] border border-blue-300">
                Natural Language
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl border-2 border-[#0B1E3F] bg-slate-100 hover:bg-slate-200 flex items-center justify-center active:scale-95 transition-all"
              aria-label="Close"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Instant Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoFocus
              placeholder="Search tracking, orders, incidents, or courier..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl border-2 border-[#0B1E3F] bg-slate-50 text-xs font-bold text-[#0B1E3F] focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 shadow-[2px_2px_0px_#0B1E3F]"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs (Screen 6 Spec: All, Parcels, Orders, Incidents) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`py-1.5 px-3 rounded-xl border-2 text-[11px] font-black shrink-0 flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-[#1E60F2] border-[#0B1E3F] text-white shadow-[2px_2px_0px_#0B1E3F]'
                      : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Suggestion Chips */}
        {!query && (
          <div className="px-5 py-2.5 bg-[#FAF7F2] border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto shrink-0 no-scrollbar">
            <span className="text-[10px] font-black uppercase text-slate-400 shrink-0 mr-1">
              Suggestions:
            </span>
            {SUGGESTION_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setQuery(chip)}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-300 text-[10px] font-bold text-slate-600 hover:border-[#0B1E3F] shrink-0 active:scale-95 transition-all"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {isSearching ? (
            <div className="p-8 text-center text-xs font-bold text-slate-500">
              Searching ParcelFlow database...
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-[#0B1E3F]">No Results Found</h3>
              <p className="text-xs font-bold text-slate-500">
                No records match "{query}". Try searching by carrier or tracking ID.
              </p>
            </div>
          ) : (
            results.map((item) => {
              const isReady = item.status?.toLowerCase().includes('ready');
              const isCollected = item.status?.toLowerCase().includes('collected');

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectResult(item)}
                  className="p-3.5 rounded-2xl bg-white border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.carrier ? (
                      <CarrierLogo carrier={item.carrier as any} size="md" />
                    ) : item.type === 'INCIDENT' ? (
                      <div className="w-10 h-10 rounded-2xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600 shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-blue-100 border border-blue-300 flex items-center justify-center text-[#1E60F2] shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-black text-[#0B1E3F] truncate group-hover:text-[#1E60F2] transition-colors">
                          {item.title}
                        </h4>
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase shrink-0 ${
                            isReady
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isCollected
                              ? 'bg-slate-100 text-slate-600 border border-slate-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <p className="text-[11px] font-bold text-slate-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>

                      <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-500">
                        {item.storage_location && (
                          <span className="text-[#0B1E3F] font-black">
                            📍 {item.storage_location}
                          </span>
                        )}
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t-2 border-[#0B1E3F] text-center text-[11px] font-bold text-slate-500 shrink-0">
          {results.length} result{results.length === 1 ? '' : 's'} found
        </div>
      </div>
    </div>
  );
};
