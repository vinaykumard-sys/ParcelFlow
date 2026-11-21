// ============================================================================
// PARCELFLOW OFFLINE QUEUE SERVICE (src/services/offlineQueueService.ts)
// Zero-data-loss security operations at gate hubs:
// Local storage queueing, online/offline detection, automatic reconnection replay,
// conflict prevention with idempotent event IDs, and listener subscriptions.
// ============================================================================

import { supabase } from './supabaseClient.ts';
import type { OfflineSyncEvent, OfflineSyncStatus } from './types.ts';

const OFFLINE_QUEUE_STORAGE_KEY = 'parcelflow_offline_sync_queue';
type QueueListener = (events: OfflineSyncEvent[], online: boolean) => void;

class OfflineQueueManager {
  private queue: OfflineSyncEvent[] = [];
  private listeners: Set<QueueListener> = new Set();
  private isCurrentlyOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private isSyncing: boolean = false;

  constructor() {
    this.loadQueueFromDisk();

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isCurrentlyOnline = true;
        this.notifyListeners();
        // Automatically replay pending actions upon reconnection
        this.syncNow();
      });

      window.addEventListener('offline', () => {
        this.isCurrentlyOnline = false;
        this.notifyListeners();
      });
    }
  }

  public isOnline(): boolean {
    if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
      return navigator.onLine;
    }
    return this.isCurrentlyOnline ?? true;
  }

  public getPendingQueue(): OfflineSyncEvent[] {
    return this.queue.filter(e => e.status === 'PENDING_SYNC' || e.status === 'SYNC_FAILED');
  }

  public getAllEvents(): OfflineSyncEvent[] {
    return [...this.queue];
  }

  /**
   * Subscribe to queue state updates and network changes
   */
  public subscribe(callback: QueueListener): () => void {
    this.listeners.add(callback);
    callback(this.getPendingQueue(), this.isOnline());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(): void {
    const pending = this.getPendingQueue();
    const online = this.isOnline();
    this.listeners.forEach(cb => {
      try {
        cb(pending, online);
      } catch (err) {
        console.error('Offline queue listener error:', err);
      }
    });
  }

  private loadQueueFromDisk(): void {
    try {
      if (typeof localStorage === 'undefined') return;
      const raw = localStorage.getItem(OFFLINE_QUEUE_STORAGE_KEY);
      if (raw) {
        this.queue = JSON.parse(raw);
      }
    } catch (e) {
      this.queue = [];
    }
  }

  private persistQueueToDisk(): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(OFFLINE_QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch {
      // ignore
    }
  }

  /**
   * Enqueue an operation performed while offline (or during network hiccups)
   */
  public async enqueueOfflineAction(
    action: string,
    payload: Record<string, any>,
    societyId?: string,
    userId?: string
  ): Promise<OfflineSyncEvent> {
    const eventId = `sync_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const event: OfflineSyncEvent = {
      id: eventId,
      event_id: eventId,
      society_id: societyId || '',
      user_id: userId || '',
      action,
      payload,
      status: 'PENDING_SYNC',
      retry_count: 0,
      created_at: new Date().toISOString(),
      synced_at: null,
    };

    // Conflict prevention: ensure no duplicate event_id
    if (!this.queue.some(e => e.event_id === eventId)) {
      this.queue.unshift(event);
      this.persistQueueToDisk();
      this.notifyListeners();
    }

    // If we happen to be online, trigger immediate attempt
    if (this.isOnline()) {
      this.syncNow().catch(() => {});
    }

    return event;
  }

  /**
   * Replay and reconcile all pending events with Supabase backend
   */
  public async syncNow(): Promise<{ successCount: number; failCount: number; errors: any[] }> {
    if (this.isSyncing) {
      return { successCount: 0, failCount: 0, errors: [] };
    }

    if (!this.isOnline()) {
      return { successCount: 0, failCount: this.getPendingQueue().length, errors: ['Offline'] };
    }

    this.isSyncing = true;
    let successCount = 0;
    let failCount = 0;
    const errors: any[] = [];

    const pending = this.queue.filter(e => e.status === 'PENDING_SYNC' || e.status === 'SYNC_FAILED');

    for (const item of pending) {
      try {
        // 1. Record event in backend offline_sync_events table
        const { error: syncDbErr } = await supabase
          .from('offline_sync_events')
          .insert({
            event_id: item.event_id,
            society_id: item.society_id || null,
            user_id: item.user_id || null,
            action: item.action,
            payload: item.payload,
            status: 'SYNCED',
            retry_count: item.retry_count,
            created_at: item.created_at,
            synced_at: new Date().toISOString(),
          });

        if (syncDbErr && !syncDbErr.message.includes('duplicate')) {
          console.warn('Offline sync events DB note:', syncDbErr.message);
        }

        // 2. Execute concrete business action if necessary
        await this.replayConcreteAction(item);

        // Mark as synced
        item.status = 'SYNCED';
        item.synced_at = new Date().toISOString();
        item.error_message = null;
        successCount++;
      } catch (err: any) {
        failCount++;
        item.retry_count += 1;
        item.status = 'SYNC_FAILED';
        item.error_message = err.message || 'Sync failed';
        errors.push({ event_id: item.event_id, error: err.message });
      }
    }

    // Keep only last 50 synced events to prevent memory bloat
    const synced = this.queue.filter(e => e.status === 'SYNCED').slice(0, 50);
    const unSynced = this.queue.filter(e => e.status !== 'SYNCED');
    this.queue = [...unSynced, ...synced];

    this.persistQueueToDisk();
    this.isSyncing = false;
    this.notifyListeners();

    return { successCount, failCount, errors };
  }

  /**
   * Action dispatcher for offline operations
   */
  private async replayConcreteAction(event: OfflineSyncEvent): Promise<void> {
    const { action, payload } = event;
    switch (action) {
      case 'RECEIVE_PARCEL': {
        if (payload?.tracking_number) {
          await supabase.from('parcels').upsert({
            tracking_number: payload.tracking_number,
            carrier_name: payload.carrier_name || 'Generic Courier',
            society_id: payload.society_id,
            apartment_id: payload.apartment_id,
            resident_id: payload.resident_id,
            status: 'RECEIVED',
            received_at: payload.received_at || new Date().toISOString(),
          });
        }
        break;
      }
      case 'ASSIGN_STORAGE': {
        if (payload?.parcel_id && payload?.storage_location_id) {
          await supabase
            .from('parcels')
            .update({ storage_location_id: payload.storage_location_id, status: 'STORED' })
            .eq('id', payload.parcel_id);
        }
        break;
      }
      case 'HANDOVER_VERIFIED': {
        if (payload?.parcel_id) {
          await supabase
            .from('parcels')
            .update({
              status: 'COMPLETED',
              handover_at: new Date().toISOString(),
            })
            .eq('id', payload.parcel_id);
        }
        break;
      }
      case 'REPORT_INCIDENT': {
        if (payload?.description) {
          await supabase.from('parcel_incidents').insert({
            society_id: payload.society_id,
            parcel_id: payload.parcel_id,
            issue_type: payload.issue_type,
            description: payload.description,
            photos: payload.photos || [],
            status: 'OPEN',
          });
        }
        break;
      }
      default:
        // Generic action synced
        break;
    }
  }

  /**
   * Clear synced items
   */
  public clearSynced(): void {
    this.queue = this.queue.filter(e => e.status !== 'SYNCED');
    this.persistQueueToDisk();
    this.notifyListeners();
  }
}

export const offlineQueueService = new OfflineQueueManager();

// Convenience functional exports matching interface
export const isOnline = () => offlineQueueService.isOnline();
export const getPendingQueue = () => offlineQueueService.getPendingQueue();
export const syncNow = () => offlineQueueService.syncNow();
export const subscribeOfflineQueue = (cb: QueueListener) => offlineQueueService.subscribe(cb);
export const enqueueOfflineAction = (
  action: string,
  payload: Record<string, any>,
  societyId?: string,
  userId?: string
) => offlineQueueService.enqueueOfflineAction(action, payload, societyId, userId);
