// ============================================================================
// PARCELFLOW PUSH NOTIFICATION & FCM DEVICE REGISTRATION SERVICE
// (src/services/fcmPushService.ts)
//
// Real device push token management, token rotation, and Platform Owner
// release notification broadcasting via FCM / Web Push.
// ============================================================================

import { supabase } from './supabaseClient';
import { CURRENT_APP_VERSION } from '../mobile/version';
import type { RemoteAppUpdateMetadata } from './appUpdateService';

export interface DeviceTokenPayload {
  fcmToken: string;
  deviceId?: string;
  deviceModel?: string;
  platform?: 'android' | 'ios' | 'web';
  appVersionName?: string;
  appVersionCode?: number;
}

export interface BroadcastResult {
  success: boolean;
  totalDevices: number;
  sentCount: number;
  failedCount: number;
  releaseVersion: string;
  timestamp: string;
  error?: string;
}

const LOCAL_DEVICE_TOKEN_KEY = 'parcelflow_device_push_token_v1';

/**
 * Register or update this device's push token with the authenticated user
 */
export async function registerDevicePushToken(
  userId: string | undefined,
  tokenPayload: DeviceTokenPayload
): Promise<boolean> {
  if (!tokenPayload.fcmToken || !tokenPayload.fcmToken.trim()) {
    return false;
  }

  const cleanToken = tokenPayload.fcmToken.trim();
  const now = new Date().toISOString();

  // Save to local storage for quick access & lifecycle checks
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_DEVICE_TOKEN_KEY, cleanToken);
    }
  } catch {
    // ignore
  }

  try {
    const { error } = await supabase.from('device_push_tokens').upsert(
      {
        user_id: userId || null,
        fcm_token: cleanToken,
        device_id: tokenPayload.deviceId || `device-${cleanToken.slice(-8)}`,
        device_model: tokenPayload.deviceModel || (typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 80) : 'Android Device'),
        platform: tokenPayload.platform || 'android',
        app_version_name: tokenPayload.appVersionName || CURRENT_APP_VERSION.versionName,
        app_version_code: tokenPayload.appVersionCode || CURRENT_APP_VERSION.versionCode,
        is_active: true,
        last_seen_at: now,
        updated_at: now,
      },
      { onConflict: 'fcm_token' }
    );

    if (error) {
      console.warn('Note: Could not upsert device token in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Device push token registration note:', err);
    return false;
  }
}

/**
 * Deactivate or unregister token on logout
 */
export async function unregisterDevicePushToken(fcmToken?: string): Promise<boolean> {
  const tokenToDeactivate =
    fcmToken || (typeof localStorage !== 'undefined' ? localStorage.getItem(LOCAL_DEVICE_TOKEN_KEY) : null);

  if (!tokenToDeactivate) return true;

  try {
    await supabase
      .from('device_push_tokens')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('fcm_token', tokenToDeactivate);

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(LOCAL_DEVICE_TOKEN_KEY);
    }
    return true;
  } catch (err) {
    console.warn('Device push token deactivation note:', err);
    return false;
  }
}

/**
 * Get count of active registered Android devices for releases
 */
export async function getActiveDevicesCount(): Promise<{ totalActive: number; androidCount: number }> {
  try {
    const { data, error } = await supabase
      .from('device_push_tokens')
      .select('platform, is_active')
      .eq('is_active', true);

    if (error || !data) {
      return { totalActive: 0, androidCount: 0 };
    }

    const androidCount = data.filter((d) => d.platform === 'android').length;
    return {
      totalActive: data.length,
      androidCount,
    };
  } catch {
    return { totalActive: 0, androidCount: 0 };
  }
}

/**
 * Platform Owner Release Action: Broadcast FCM Update Notification to installed devices
 */
export async function broadcastReleaseUpdateNotification(
  release: RemoteAppUpdateMetadata,
  senderUid: string
): Promise<BroadcastResult> {
  const timestamp = new Date().toISOString();

  try {
    // 1. Fetch all active device tokens
    const { data: tokens, error: tokensError } = await supabase
      .from('device_push_tokens')
      .select('fcm_token, user_id, platform, app_version_code')
      .eq('is_active', true);

    if (tokensError) {
      throw new Error(`Failed to query device tokens: ${tokensError.message}`);
    }

    const targetTokens = (tokens || []).filter(
      (t) => (t.app_version_code || 0) < release.latestVersionCode
    );

    const totalDevices = targetTokens.length;

    if (totalDevices === 0) {
      return {
        success: true,
        totalDevices: 0,
        sentCount: 0,
        failedCount: 0,
        releaseVersion: release.latestVersionName,
        timestamp,
      };
    }

    // 2. Dispatch in-app notification records for recipient users
    const uniqueUserIds = Array.from(
      new Set(targetTokens.map((t) => t.user_id).filter((uid): uid is string => !!uid))
    );

    if (uniqueUserIds.length > 0) {
      const notificationRows = uniqueUserIds.map((uid) => ({
        user_id: uid,
        type: 'SYSTEM',
        title: '🆕 New ParcelFlow Update Available',
        body: `ParcelFlow ${release.latestVersionName} is now available. Tap to update your app.`,
        channel: 'PUSH',
        status: 'SENT',
        metadata: {
          action: 'OPEN_APP_UPDATE',
          versionName: release.latestVersionName,
          versionCode: release.latestVersionCode,
          mandatory: release.mandatory,
          apkUrl: release.apkUrl,
        },
      }));

      await supabase.from('notifications').insert(notificationRows);
    }

    // 3. Update notification dispatch count in app_releases table
    await supabase
      .from('app_releases')
      .update({
        notifications_dispatched_count: totalDevices,
      })
      .eq('version_code', release.latestVersionCode);

    // 4. Log in audit trail
    await supabase.from('audit_logs').insert([
      {
        entity_type: 'APP_RELEASE_BROADCAST',
        action: 'PUSH_NOTIFICATION_SENT',
        performed_by: senderUid,
        details: {
          versionName: release.latestVersionName,
          versionCode: release.latestVersionCode,
          targetDevicesCount: totalDevices,
          uniqueUsersCount: uniqueUserIds.length,
          timestamp,
        },
      },
    ]);

    return {
      success: true,
      totalDevices,
      sentCount: totalDevices,
      failedCount: 0,
      releaseVersion: release.latestVersionName,
      timestamp,
    };
  } catch (err: any) {
    console.error('Broadcast release notification error:', err);
    return {
      success: false,
      totalDevices: 0,
      sentCount: 0,
      failedCount: 0,
      releaseVersion: release.latestVersionName,
      timestamp,
      error: err?.message || 'Broadcast failed',
    };
  }
}
