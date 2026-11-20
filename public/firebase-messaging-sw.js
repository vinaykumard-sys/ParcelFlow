// ============================================================================
// PARCELFLOW FIREBASE MESSAGING SERVICE WORKER
// (public/firebase-messaging-sw.js)
//
// Handles background push events, system notification display, and tap routing
// ============================================================================

self.addEventListener('push', function (event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() };
    }
  }

  const title = data.title || '🆕 New ParcelFlow Update Available';
  const options = {
    body: data.body || 'A new version of ParcelFlow is ready. Tap to update your app.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [100, 50, 100],
    data: {
      type: data.type || 'OPEN_APP_UPDATE',
      url: '/?action=app_update',
    },
    actions: [
      { action: 'update', title: 'Update Now' },
      { action: 'dismiss', title: 'Maybe Later' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Focus existing open window or open new window to update screen
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url && 'focus' in client) {
          client.postMessage({ type: 'OPEN_APP_UPDATE' });
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/?action=app_update');
      }
    })
  );
});
