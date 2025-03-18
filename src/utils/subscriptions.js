// Function to convert base64 to Uint8Array for the applicationServerKey
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  
  // Subscribe to push notifications
  async function subscribeToPushNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.error('Push notifications not supported');
      return;
    }
  
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        console.log('Already subscribed to push notifications');
        return subscription;
      }
      
      // Get the server's public key
      const response = await fetch('https://sosika-backend.onrender.com/api/push/public-key');
      const { publicKey } = await response.json();
  
      // Subscribe the user
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });
  
      // Send the subscription to the server
      await fetch('https://sosika-backend.onrender.com/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          vendorId: getUserVendorId() // Implement this function to get vendor ID from cookies/localStorage
        }),
      });
  
      console.log('Successfully subscribed to push notifications');
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      throw error;
    }
  }
  
  // Helper function to get vendor ID from storage
  function getUserVendorId() {
    // Get vendor ID from localStorage or cookies
    return localStorage.getItem('vendorId') || ''; 
    // You should implement proper authentication and user identification
  }
  
  // Register service worker if not already registered
  async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('sw.js');
        console.log('Service worker registered:', registration);
        return registration;
      } catch (error) {
        console.error('Service worker registration failed:', error);
        throw error;
      }
    } else {
      throw new Error('Service workers not supported');
    }
  }
  
  // Initialize push notifications
  async function initializePushNotifications() {
    try {
      await registerServiceWorker();
      const subscribeButton = document.getElementById('push-subscribe-button');
      
      if (subscribeButton) {
        subscribeButton.addEventListener('click', async () => {
          try {
            await subscribeToPushNotifications();
            subscribeButton.textContent = 'Notifications Enabled';
            subscribeButton.disabled = true;
          } catch (error) {
            console.error('Failed to subscribe:', error);
          }
        });
      }
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
    }
  }
  
  // Call this function when the page loads
  document.addEventListener('DOMContentLoaded', initializePushNotifications);