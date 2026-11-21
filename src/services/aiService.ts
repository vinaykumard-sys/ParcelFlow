// ============================================================================
// PARCELFLOW AI SERVICE (src/services/aiService.ts)
// Client service for ParcelFlow AI powered by Google Gemini.
// Handles communication with /api/ai/chat, user authorization context,
// session persistence, prompt injection protections, observability logging,
// and rich interactive card generation.
// ============================================================================

import { getCurrentUserProfile } from './authService.ts';

export interface AIChatCardAction {
  label: string;
  actionType: 'GET_QR' | 'VIEW_PARCEL' | 'SCHEDULE_SLOT' | 'CONFIRM_ACTION' | 'CANCEL_ACTION' | 'NAVIGATE';
  primary?: boolean;
  payload?: any;
}

export interface AIChatCard {
  id: string;
  type: 'parcel' | 'pickup' | 'stat' | 'order' | 'action_confirm';
  title: string;
  subtitle?: string;
  badge?: {
    label: string;
    color: 'green' | 'yellow' | 'blue' | 'red' | 'purple' | 'slate';
  };
  details?: Array<{ label: string; value: string }>;
  actions?: AIChatCardAction[];
}

export interface ActionConfirmationPrompt {
  action: string;
  params: Record<string, any>;
  summary: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  cards?: AIChatCard[];
  quickReplies?: string[];
  requiresConfirmation?: ActionConfirmationPrompt;
  isError?: boolean;
}

export interface AIChatTelemetry {
  model: string;
  latencyMs: number;
  toolsUsed: string[];
  promptInjectionSafe?: boolean;
}

export interface SendMessageOptions {
  history?: AIChatMessage[];
  actionConfirmation?: {
    confirmed: boolean;
    action: string;
    params: Record<string, any>;
  };
  overrideContext?: {
    userId?: string;
    residentId?: string;
    societyId?: string;
    role?: string;
    userName?: string;
    apartmentId?: string;
  };
}

export interface AIChatResponse {
  success: boolean;
  message?: AIChatMessage;
  telemetry?: AIChatTelemetry;
  error?: string;
}

export const DEFAULT_QUICK_REPLIES = [
  'My ready parcels',
  "Today's deliveries",
  'Pickup QR code',
  'Hub operating hours',
];

/**
 * Returns a warm, branded welcome message from ParcelFlow AI.
 */
export function getInitialWelcomeMessage(userName?: string): AIChatMessage {
  const name = userName ? ` ${userName}` : '';
  return {
    id: `welcome-${Date.now()}`,
    sender: 'assistant',
    text: `Hello${name}! 👋 I'm ParcelFlow AI ✨, powered by Google Gemini.\n\nI can help you check ready parcels, schedule pickup slots, view your pickup QR pass, or check hub operating hours. What would you like to do today?`,
    timestamp: new Date().toISOString(),
    quickReplies: DEFAULT_QUICK_REPLIES,
    cards: [],
  };
}

/**
 * Resolves current user context (ID, role, society, apartment) for secure backend authorization.
 */
async function resolveUserContext(options?: SendMessageOptions) {
  if (options?.overrideContext?.userId) {
    return {
      userContext: {
        userId: options.overrideContext.userId,
        residentId: options.overrideContext.residentId || options.overrideContext.userId,
        societyId: options.overrideContext.societyId || 'a1111111-1111-1111-1111-111111111111',
        role: options.overrideContext.role || 'RESIDENT',
        userName: options.overrideContext.userName || 'Resident',
        apartmentId: options.overrideContext.apartmentId,
      },
      token: null,
    };
  }

  try {
    const auth = await getCurrentUserProfile();
    const userId = auth?.profile?.id || auth?.user?.id || 'demo-resident-1';
    const societyId = auth?.profile?.society_id || 'a1111111-1111-1111-1111-111111111111';
    const role = (auth?.profile?.role || 'RESIDENT').toUpperCase();
    const userName = auth?.profile?.full_name || 'Resident';
    const token = auth?.session?.access_token || null;

    return {
      userContext: {
        userId,
        residentId: userId,
        societyId,
        role,
        userName,
      },
      token,
    };
  } catch {
    return {
      userContext: {
        userId: 'demo-resident-1',
        residentId: 'demo-resident-1',
        societyId: 'a1111111-1111-1111-1111-111111111111',
        role: 'RESIDENT',
        userName: 'Resident',
      },
      token: null,
    };
  }
}

/**
 * Sends a user message to /api/ai/chat with history, user context, and authorization tokens.
 */
export async function sendMessage(
  text: string,
  options?: SendMessageOptions
): Promise<AIChatResponse> {
  const startTime = performance.now();
  const cleanText = (text || '').trim();

  if (!cleanText && !options?.actionConfirmation) {
    return {
      success: false,
      error: 'Message text or action confirmation is required.',
    };
  }

  try {
    const { userContext, token } = await resolveUserContext(options);

    // Format previous messages for conversation continuity
    const historyPayload = (options?.history || [])
      .filter((m) => m.sender === 'user' || m.sender === 'assistant')
      .slice(-6)
      .map((m) => ({
        role: m.sender === 'assistant' ? ('model' as const) : ('user' as const),
        text: m.text,
      }));

    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        message: cleanText,
        history: historyPayload,
        userContext,
        actionConfirmation: options?.actionConfirmation,
      }),
    });

    const elapsedMs = Math.round(performance.now() - startTime);

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      console.warn(`[aiService] /api/ai/chat responded with HTTP ${response.status}:`, errorJson);
      return {
        success: false,
        error: errorJson.error || `Server responded with HTTP ${response.status}`,
      };
    }

    const data = await response.json();

    if (!data.success || !data.message) {
      return {
        success: false,
        error: data.error || 'Invalid response from ParcelFlow AI service.',
      };
    }

    const msg: AIChatMessage = {
      id: data.message.id || `msg-${Date.now()}`,
      sender: 'assistant',
      text: data.message.text,
      timestamp: data.message.timestamp || new Date().toISOString(),
      cards: data.message.cards || [],
      quickReplies: data.message.quickReplies || DEFAULT_QUICK_REPLIES,
      requiresConfirmation: data.message.requiresConfirmation,
    };

    const telemetry: AIChatTelemetry = {
      model: data.telemetry?.model || 'gemini-1.5-flash',
      latencyMs: data.telemetry?.latencyMs || elapsedMs,
      toolsUsed: data.telemetry?.toolsUsed || [],
      promptInjectionSafe: Boolean(data.telemetry?.promptInjectionSafe),
    };

    return {
      success: true,
      message: msg,
      telemetry,
    };
  } catch (err: any) {
    console.error('[aiService sendMessage error]:', err);
    return {
      success: false,
      error: err?.message || 'Network error reaching ParcelFlow AI service.',
    };
  }
}

/**
 * Confirms and executes a pending action (e.g. schedule_pickup, reschedule, cancel).
 */
export async function confirmAction(
  action: string,
  params: Record<string, any>,
  options?: SendMessageOptions
): Promise<AIChatResponse> {
  return sendMessage(`Confirm ${action}`, {
    ...options,
    actionConfirmation: {
      confirmed: true,
      action,
      params,
    },
  });
}

/**
 * Returns role-appropriate quick reply suggestions.
 */
export function getSuggestedChips(role?: string): string[] {
  const r = (role || '').toUpperCase();
  if (r === 'SECURITY' || r === 'STAFF') {
    return ['Pending handovers', 'Storage capacity', 'Search parcel', 'Intake summary'];
  }
  if (r === 'SOCIETY_ADMIN' || r === 'SUPER_ADMIN') {
    return ['Society stats', 'Pending handovers', 'Locker occupancy', 'Courier intake'];
  }
  return DEFAULT_QUICK_REPLIES;
}

export const aiService = {
  sendMessage,
  confirmAction,
  getInitialWelcomeMessage,
  getSuggestedChips,
  DEFAULT_QUICK_REPLIES,
};

export default aiService;
