// ============================================================================
// PARCELFLOW FCM & PUSH NOTIFICATION CLIENT
// (src/services/fcmClient.ts)
//
// Device token generation, permission management, and notification tap handling
// ============================================================================

import { registerDevicePushToken } from './fcmPushService';
import { CURRENT_APP_VERSION } from '../mobile/version';

const TOKEN_STORAGE_KEY = 'parcelflow_device_fcm_token';

/**
 * Generate or retrieve persistent pseudo-FCM token for this installed device
 */
export function getOrCreateDeviceToken(): string {
  if (typeof localStorage === 'undefined') {
    return `fcm-${Math.random().toString(36).slice(2, 12)}`;
  }

  let token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!token) {
    // Generate unique installation token: fcm-<timestamp>-<random-hex>
    token = `fcm-android-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
  return token;
}

/**
 * Initialize Push Notifications on App Launch:
 * - Requests permission if needed
 * - Registers token in backend
 * - Sets up notification tap listeners
 */
export async function initializePushNotifications(
  userId?: string,
  onOpenUpdateModal?: () => void
): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  const fcmToken = getOrCreateDeviceToken();

  // 1. Request Browser/WebView Notification permission if supported
  if ('Notification' in window && Notification.permission === 'default') {
    try {
      await Notification.requestPermission();
    } catch {
      // ignore
    }
  }

  // 2. Register Service Worker if supported
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
    } catch {
      // ignore
    }
  }

  // 3. Register token with backend
  await registerDevicePushToken(userId, {
    fcmToken,
    platform: 'android',
    appVersionName: CURRENT_APP_VERSION.versionName,
    appVersionCode: CURRENT_APP_VERSION.versionCode,
    deviceModel: navigator.userAgent.slice(0, 80),
  });

  // 4. Check if app was opened via notification tap (?action=app_update)
  if (onOpenUpdateModal) {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'app_update' || params.get('notification_type') === 'APP_UPDATE') {
      onOpenUpdateModal();
    }

    // Listen for Service Worker message events
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'OPEN_APP_UPDATE') {
          onOpenUpdateModal();
        }
      });
    }
  }

  return fcmToken;
}
