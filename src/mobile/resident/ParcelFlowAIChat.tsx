import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Package,
  QrCode,
  Calendar,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import {
  sendMessage,
  getInitialWelcomeMessage,
  DEFAULT_QUICK_REPLIES,
  type AIChatMessage,
  type AIChatCard,
  type AIChatCardAction,
} from '../../services/aiService';
import type { MobileParcel } from '../types';
import { CarrierLogo } from '../components/design-system';

interface ParcelFlowAIChatProps {
  onBack: () => void;
  onSelectParcel: (parcel: MobileParcel) => void;
  onScheduleSlot: (parcel: MobileParcel) => void;
  onShowPickupCode: (parcel: MobileParcel) => void;
  onOpenExpressPickup?: () => void;
  onOpenStorageMap?: () => void;
}

export const ParcelFlowAIChat: React.FC<ParcelFlowAIChatProps> = ({
  onBack,
  onSelectParcel,
  onScheduleSlot,
  onShowPickupCode,
  onOpenExpressPickup,
  onOpenStorageMap,
}) => {
  const { parcels, currentUser, selectedSociety } = useMobileStore();

  const [messages, setMessages] = useState<AIChatMessage[]>(() => [
    getInitialWelcomeMessage(currentUser?.name?.split(' ')[0]),
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Find a parcel in mobile store by ID or tracking
  const findParcel = (parcelIdOrTracking?: string): MobileParcel | null => {
    if (!parcelIdOrTracking) return null;
    return (
      parcels.find(
        (p) =>
          p.id === parcelIdOrTracking ||
          p.trackingNumber.toLowerCase() === parcelIdOrTracking.toLowerCase() ||
          p.trackingNumber.includes(parcelIdOrTracking)
      ) || null
    );
  };

  // Build local contextual cards for quick queries
  const generateLocalResponse = (query: string): AIChatMessage | null => {
    const q = query.toLowerCase();

    // 1. Ready parcels query
    if (q.includes('ready') || q.includes('pickup') || q.includes('collect')) {
      const readyList = parcels.filter(
        (p) => p.status === 'READY_FOR_PICKUP' || p.status === 'SCHEDULED'
      );

      if (readyList.length > 0) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `You have **${readyList.length} parcel${
            readyList.length > 1 ? 's' : ''
          } ready for pickup** at ${selectedSociety.name} Hub A:`,
          timestamp: new Date().toISOString(),
          cards: readyList.map((p) => ({
            id: p.id,
            type: 'parcel',
            title: p.description || `${p.carrier} Parcel`,
            subtitle: `${p.carrier} • #${p.trackingNumber}`,
            badge: { label: 'Ready for Pickup', color: 'green' },
            details: [
              { label: 'Storage', value: p.storageLocation || 'Hub A - S3' },
              { label: 'Status', value: 'Counter Ready' },
            ],
            actions: [
              { label: 'Get Pickup QR', actionType: 'GET_QR', primary: true, payload: { parcelId: p.id } },
              { label: 'View Parcel', actionType: 'VIEW_PARCEL', payload: { parcelId: p.id } },
            ],
          })),
        };
      }
    }

    // 2. Today's deliveries
    if (q.includes('today') || q.includes('deliver') || q.includes('arrive')) {
      const todayList = parcels.filter((p) => p.status !== 'COLLECTED');
      if (todayList.length > 0) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `Here are your current active deliveries today (${todayList.length} total):`,
          timestamp: new Date().toISOString(),
          cards: todayList.slice(0, 3).map((p) => ({
            id: p.id,
            type: 'parcel',
            title: p.description || `${p.carrier} Parcel`,
            subtitle: `${p.carrier} • #${p.trackingNumber}`,
            badge: {
              label: p.status === 'READY_FOR_PICKUP' ? 'Ready' : 'Received at Hub',
              color: p.status === 'READY_FOR_PICKUP' ? 'green' : 'yellow',
            },
            details: [{ label: 'Location', value: p.storageLocation || 'Hub A' }],
            actions: [
              { label: 'View Parcel', actionType: 'VIEW_PARCEL', primary: true, payload: { parcelId: p.id } },
              { label: 'Schedule Slot', actionType: 'SCHEDULE_SLOT', payload: { parcelId: p.id } },
            ],
          })),
        };
      }
    }

    // 3. Storage map query
    if (q.includes('where') || q.includes('storage') || q.includes('hub') || q.includes('rack')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `Your parcels are securely stored in **Hub Alpha (Main Gate)**. You can explore the live 2D storage grid to see exact rack & shelf locations.`,
        timestamp: new Date().toISOString(),
        cards: [
          {
            id: 'storage-map-card',
            type: 'stat',
            title: 'Hub Alpha 2D Storage Layout',
            subtitle: 'Racks A-D • Shelves 1-5',
            badge: { label: 'Live Grid', color: 'blue' },
            actions: [
              { label: 'Open 2D Storage Map', actionType: 'NAVIGATE', primary: true, payload: { target: 'storage_map' } },
            ],
          },
        ],
      };
    }

    // 4. Operating hours
    if (q.includes('hours') || q.includes('time') || q.includes('open')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `The Parcel Hub at **${selectedSociety.name}** operates from **8:00 AM to 10:00 PM** daily.\n\nPeak pickup hours are between **6:00 PM and 8:00 PM**. For fastest checkout, use your **Express Pickup QR Code** at the counter!`,
        timestamp: new Date().toISOString(),
        cards: [
          {
            id: 'express-card',
            type: 'pickup',
            title: 'Express Pickup Pass',
            subtitle: '10-minute dynamic release token',
            badge: { label: 'Instant', color: 'yellow' },
            actions: [
              { label: 'Get Express QR', actionType: 'NAVIGATE', primary: true, payload: { target: 'express_qr' } },
            ],
          },
        ],
      };
    }

    return null;
  };

  // Send message handler
  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isThinking) return;

    setInputText('');

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      // 1. Try real backend Gemini AI service first
      const res = await sendMessage(query, {
        history: messages,
        overrideContext: {
          userId: currentUser?.id,
          userName: currentUser?.name,
          societyId: selectedSociety.id,
          role: 'RESIDENT',
          apartmentId: currentUser?.flatNumber,
        },
      });

      if (res.success && res.message) {
        setMessages((prev) => [...prev, res.message!]);
      } else {
        // Fallback to local intelligent assistant logic if backend is warming up
        const localReply = generateLocalResponse(query) || {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `I've checked the ParcelFlow system for "${query}". Your parcels are safe in **${selectedSociety.name} Hub Alpha**. You can view details or generate a pickup pass below.`,
          timestamp: new Date().toISOString(),
          cards: parcels.slice(0, 1).map((p) => ({
            id: p.id,
            type: 'parcel',
            title: p.description || `${p.carrier} Parcel`,
            subtitle: `${p.carrier} • #${p.trackingNumber}`,
            badge: { label: 'Ready', color: 'green' },
            actions: [
              { label: 'Get Pickup QR', actionType: 'GET_QR', primary: true, payload: { parcelId: p.id } },
              { label: 'View Parcel', actionType: 'VIEW_PARCEL', payload: { parcelId: p.id } },
            ],
          })),
        };
        setMessages((prev) => [...prev, localReply]);
      }
    } catch (err) {
      console.warn('AI chat error, using local fallback:', err);
      const fallback = generateLocalResponse(query) || {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `Here is what I found regarding your delivery status in ${selectedSociety.name}:`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setIsThinking(false);
    }
  };

  // Card action button dispatcher
  const handleActionClick = (action: AIChatCardAction) => {
    const parcelId = action.payload?.parcelId;
    const parcel = parcelId ? findParcel(parcelId) : parcels[0] || null;

    switch (action.actionType) {
      case 'GET_QR':
        if (parcel) {
          onShowPickupCode(parcel);
        } else if (onOpenExpressPickup) {
          onOpenExpressPickup();
        }
        break;

      case 'VIEW_PARCEL':
        if (parcel) {
          onSelectParcel(parcel);
        }
        break;

      case 'SCHEDULE_SLOT':
        if (parcel) {
          onScheduleSlot(parcel);
        }
        break;

      case 'NAVIGATE':
        if (action.payload?.target === 'express_qr' && onOpenExpressPickup) {
          onOpenExpressPickup();
        } else if (action.payload?.target === 'storage_map' && onOpenStorageMap) {
          onOpenStorageMap();
        }
        break;

      default:
        console.log('Action triggered:', action);
        break;
    }
  };

  // Voice toggle simulation
  const handleToggleVoice = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulate speech detection
      setTimeout(() => {
        setIsListening(false);
        handleSend('Where is my latest Amazon package?');
      }, 2500);
    }
  };

  // Format message text with basic bold tags
  const renderMessageText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      // Basic bold matching **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className={idx > 0 ? 'mt-1' : ''}>
          {parts.map((p, i) => {
            if (p.startsWith('**') && p.endsWith('**')) {
              return (
                <strong key={i} className="font-black text-[#0B1E3F]">
                  {p.slice(2, -2)}
                </strong>
              );
            }
            return p;
          })}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#0B1E3F] select-none relative overflow-hidden">
      {/* Screen 2 Spec: Top Header "ParcelFlow AI ✨ Powered by Google Gemini" */}
      <div className="p-4 bg-white border-b-2 border-[#0B1E3F] flex items-center justify-between shrink-0 shadow-[0px_2px_8px_rgba(0,0,0,0.03)] z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl border-2 border-[#0B1E3F] bg-slate-100 hover:bg-slate-200 flex items-center justify-center active:scale-95 transition-all"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black tracking-tight text-[#0B1E3F]">
                ParcelFlow AI
              </h1>
              <span className="flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 text-white shadow-xs">
                <Sparkles className="w-3 h-3 fill-white" />
                <span>Gemini</span>
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-500">
              Powered by Google Gemini • Hub Assistant
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([getInitialWelcomeMessage(currentUser?.name?.split(' ')[0])])
          }
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 active:scale-90 transition-all"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Chat Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              {!isUser ? (
                <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-amber-400 to-blue-600 p-0.5 shadow-[2px_2px_0px_#0B1E3F] shrink-0 border border-[#0B1E3F]">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-blue-600">
                    <Sparkles className="w-4 h-4 fill-amber-400 stroke-blue-600 stroke-[2]" />
                  </div>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-2xl bg-[#0B1E3F] flex items-center justify-center text-white shrink-0 text-xs font-black shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] space-y-2.5 ${
                  isUser ? 'items-end text-right' : 'items-start text-left'
                }`}
              >
                <div
                  className={`p-3.5 rounded-3xl text-xs font-bold leading-relaxed ${
                    isUser
                      ? 'bg-[#0B1E3F] text-white rounded-tr-xs shadow-[2px_2px_0px_rgba(0,0,0,0.2)]'
                      : 'bg-white text-slate-800 border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] rounded-tl-xs'
                  }`}
                >
                  {renderMessageText(msg.text)}
                </div>

                {/* Rich Response Cards (Screen 2 Spec) */}
                {msg.cards && msg.cards.length > 0 && (
                  <div className="space-y-2 w-full">
                    {msg.cards.map((card) => {
                      const matchedParcel = findParcel(card.id);

                      return (
                        <div
                          key={card.id}
                          className="p-3.5 rounded-2xl bg-white border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] space-y-2.5 text-left"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              {matchedParcel ? (
                                <CarrierLogo carrier={matchedParcel.carrier} size="sm" />
                              ) : (
                                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                  <Package className="w-4 h-4" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <h4 className="text-xs font-black text-[#0B1E3F] truncate">
                                  {card.title}
                                </h4>
                                {card.subtitle && (
                                  <p className="text-[10px] font-bold text-slate-500 truncate">
                                    {card.subtitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            {card.badge && (
                              <span
                                className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                                  card.badge.color === 'green'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : card.badge.color === 'yellow'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                                }`}
                              >
                                {card.badge.label}
                              </span>
                            )}
                          </div>

                          {/* Extra details rows */}
                          {card.details && card.details.length > 0 && (
                            <div className="grid grid-cols-2 gap-1.5 p-2 bg-[#FAF7F2] rounded-xl text-[10px] font-bold text-slate-600">
                              {card.details.map((d, i) => (
                                <div key={i}>
                                  <span className="text-slate-400">{d.label}: </span>
                                  <span className="font-black text-[#0B1E3F]">{d.value}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Action Buttons: [Get Pickup QR], [View Parcel], etc. */}
                          {card.actions && card.actions.length > 0 && (
                            <div className="flex items-center gap-2 pt-1">
                              {card.actions.map((act, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleActionClick(act)}
                                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black border-2 border-[#0B1E3F] shadow-[1.5px_1.5px_0px_#0B1E3F] active:scale-95 transition-all flex items-center justify-center gap-1.5 ${
                                    act.primary
                                      ? 'bg-[#FFC72C] text-[#0B1E3F] hover:bg-[#F59E0B]'
                                      : 'bg-white text-slate-700 hover:bg-slate-50'
                                  }`}
                                >
                                  {act.actionType === 'GET_QR' && (
                                    <QrCode className="w-3.5 h-3.5" />
                                  )}
                                  {act.actionType === 'SCHEDULE_SLOT' && (
                                    <Calendar className="w-3.5 h-3.5" />
                                  )}
                                  <span>{act.label}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 animate-in fade-in">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-amber-400 to-blue-600 p-0.5 border border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-blue-600">
                <Sparkles className="w-4 h-4 fill-amber-400 stroke-blue-600 animate-spin" />
              </div>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-white border border-slate-300 shadow-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E60F2] animate-bounce" />
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#1E60F2] animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#1E60F2] animate-bounce"
                style={{ animationDelay: '0.4s' }}
              />
              <span className="ml-1 text-[11px] text-slate-600 font-bold">
                ParcelFlow AI is thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips (Screen 2 Spec) */}
      <div className="px-4 py-2 bg-white border-t border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0 no-scrollbar">
        {DEFAULT_QUICK_REPLIES.map((chip) => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            className="px-3 py-1.5 rounded-full bg-[#FEF9F3] hover:bg-amber-100 border border-[#0B1E3F] text-xs font-black text-[#0B1E3F] shrink-0 active:scale-95 transition-all shadow-[1.5px_1.5px_0px_#0B1E3F]"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Text Input & Mic Bar (Screen 2 Spec) */}
      <div className="p-3 bg-white border-t-2 border-[#0B1E3F] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`w-11 h-11 rounded-2xl border-2 border-[#0B1E3F] flex items-center justify-center transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-[2px_2px_0px_#0B1E3F]'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title={isListening ? 'Listening...' : 'Voice Input'}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <Mic className="w-5 h-5 stroke-[2.5]" />
            )}
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder={
              isListening
                ? 'Listening to your voice...'
                : 'Ask about your deliveries, pickups...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-[#0B1E3F] bg-slate-50 text-xs font-bold text-[#0B1E3F] focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 shadow-inner"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="w-11 h-11 rounded-2xl border-2 border-[#0B1E3F] bg-[#FFC72C] hover:bg-[#F59E0B] disabled:opacity-50 text-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] flex items-center justify-center active:scale-95 transition-all"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};
