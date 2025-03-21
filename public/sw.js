self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  self.skipWaiting(); // Forces new SW to take control immediately
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated.");
  event.waitUntil(clients.claim()); // Forces control of open clients
});

self.addEventListener('push', event => {
  console.log("Notification received")
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png', // Update this path to your icon
      badge: '/icons/icon-144x144.png', // Update this path to your badge
      data: {
        url: data.url || '/'
      },
      actions: [
        {
          action: 'view',
          title: 'View Order'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('Error showing notification:', error);
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  // Default action is to open the order page
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

self.addEventListener('message', event => {
  console.log('Message received in service worker:', event.data);
  // Optionally send back a response
  event.source.postMessage({
    type: 'RESPONSE',
    payload: 'Message received by service worker'
  });
});