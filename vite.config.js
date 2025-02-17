import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/sosika-vendor/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      build: {
        rollupOptions: {
          input: {
            main: 'index.html',
            register: 'sign-up.html',
            dashboard: 'dashboard.html',
            menuItems: 'menu-items.html',
            addMenu: 'add-menu.html',
            orders: 'orders.html',
            profile: 'profile.html',
          }
        }
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/your-api\.com\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
            },
          },
        ],
      },
    }),
  ],
});
