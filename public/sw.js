self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  self.skipWaiting(); // Forces new SW to take control immediately
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated.");
  event.waitUntil(clients.claim()); // Forces control of open clients
});

self.addEventListener('push', event => {
  console.log("Push event received at:", new Date().toISOString());
  
  if (!event.data) {
    console.warn("Push event has no data");
    return;
  }
  
  try {
    const data = event.data.json();
    console.log("Push data received:", JSON.stringify(data));
    
    const options = {
      body: data.body,
      icon: '/sosika-vendor/icons/icon-192x192.png', // Fix the path for GitHub Pages
      badge: '/sosika-vendor/icons/icon-144x144.png', // Fix the path for GitHub Pages
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

    console.log("About to show notification with options:", JSON.stringify(options));
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
        .then(() => console.log("Notification successfully shown"))
        .catch(err => console.error("Error showing notification:", err))
    );
  } catch (error) {
    console.error('Error processing push event:', error);
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