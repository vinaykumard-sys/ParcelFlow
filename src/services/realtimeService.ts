// ============================================================================
// PARCELFLOW REALTIME SERVICE (src/services/realtimeService.ts)
// Real-time synchronization powered by Supabase Realtime Channels:
// - Multi-device broadcast (parcel intake, slot booking, OTP generation, handover)
// - Table change subscriptions (postgres_changes on parcels & notifications)
// - Graceful reconnection and channel cleanup
// ============================================================================

import { supabase } from './supabaseClient.ts';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type RealtimeParcelEventType =
  | 'PARCEL_RECEIVED'
  | 'PARCEL_STORED'
  | 'SLOT_SCHEDULED'
  | 'READY_FOR_PICKUP'
  | 'HANDOVER_COMPLETED'
  | 'PARCEL_CANCELLED'
  | 'SECURITY_ALERT';

export interface RealtimeParcelPayload {
  parcelId: string;
  trackingNumber: string;
  carrier: string;
  status: string;
  societyId: string;
  recipientFlat?: string;
  storageSlot?: string;
  timestamp: string;
  [key: string]: any;
}

// Active channel cache
const activeChannels = new Map<string, RealtimeChannel>();

/**
 * Get or create a Supabase Realtime channel
 */
export function getOrCreateChannel(channelName: string): RealtimeChannel {
  if (activeChannels.has(channelName)) {
    return activeChannels.get(channelName)!;
  }

  const channel = supabase.channel(channelName, {
    config: {
      broadcast: { self: true },
    },
  });
  activeChannels.set(channelName, channel);
  return channel;
}

/**
 * Broadcast an operational parcel event across devices
 */
export async function broadcastParcelEvent(
  societyId: string,
  eventType: RealtimeParcelEventType,
  payload: RealtimeParcelPayload
): Promise<boolean> {
  try {
    const channelName = `society-parcels-${societyId}`;
    const channel = getOrCreateChannel(channelName);

    // Ensure subscribed before sending
    if (channel.state !== 'joined') {
      await new Promise<void>((resolve) => {
        channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') resolve();
        });
      });
    }

    const resp = await channel.send({
      type: 'broadcast',
      event: eventType,
      payload,
    });

    return resp === 'ok';
  } catch (err) {
    console.warn('Realtime broadcast note:', err);
    return false;
  }
}

/**
 * Subscribe to real-time parcel updates for a society
 * Listens for BOTH broadcast messages from peers and postgres_changes from database
 */
export function subscribeToSocietyParcels(
  societyId: string,
  callbacks: {
    onBroadcast?: (eventType: string, payload: any) => void;
    onDbChange?: (change: any) => void;
    onStatusChange?: (status: string) => void;
  }
): () => void {
  const channelName = `society-parcels-${societyId}`;
  const channel = getOrCreateChannel(channelName);

  // 1. Listen for broadcast events
  if (callbacks.onBroadcast) {
    const events: RealtimeParcelEventType[] = [
      'PARCEL_RECEIVED',
      'PARCEL_STORED',
      'SLOT_SCHEDULED',
      'READY_FOR_PICKUP',
      'HANDOVER_COMPLETED',
      'PARCEL_CANCELLED',
      'SECURITY_ALERT',
    ];

    events.forEach((ev) => {
      channel.on('broadcast', { event: ev }, (msg) => {
        if (callbacks.onBroadcast) {
          callbacks.onBroadcast(ev, msg.payload);
        }
      });
    });
  }

  // 2. Listen for Postgres DB Changes on parcels table
  if (callbacks.onDbChange) {
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'parcels',
        filter: societyId ? `society_id=eq.${societyId}` : undefined,
      },
      (payload) => {
        if (callbacks.onDbChange) {
          callbacks.onDbChange(payload);
        }
      }
    );
  }

  // 3. Subscribe with status callback
  channel.subscribe((status) => {
    if (callbacks.onStatusChange) {
      callbacks.onStatusChange(status);
    }
  });

  // Return unsubscribe cleanup function
  return () => {
    supabase.removeChannel(channel);
    activeChannels.delete(channelName);
  };
}

/**
 * Subscribe to real-time resident notifications
 */
export function subscribeToResidentNotifications(
  userId: string,
  onNotification: (notification: any) => void
): () => void {
  const channelName = `user-notifs-${userId}`;
  const channel = getOrCreateChannel(channelName);

  // Listen to broadcast user alerts
  channel.on('broadcast', { event: 'notification:new' }, (msg) => {
    onNotification(msg.payload);
  });

  // Listen to database inserts into notifications table
  channel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      onNotification(payload.new);
    }
  );

  channel.subscribe();

  return () => {
    supabase.removeChannel(channel);
    activeChannels.delete(channelName);
  };
}

/**
 * Unsubscribe all active channels
 */
export function unsubscribeAllRealtimeChannels(): void {
  for (const [name, channel] of activeChannels.entries()) {
    try {
      supabase.removeChannel(channel);
    } catch {
      // ignore
    }
  }
  activeChannels.clear();
}
