import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  base: '/sosika-vendor/',  // Ensure this matches your GitHub Pages deployment path
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
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
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        register: path.resolve(__dirname, 'sign-up.html'),
        dashboard: path.resolve(__dirname, 'dashboard.html'),
        menuItems: path.resolve(__dirname, 'menu-items.html'),
        addMenu: path.resolve(__dirname, 'add-menu.html'),
        orders: path.resolve(__dirname, 'orders.html'),
        profile: path.resolve(__dirname, 'profile.html'),
      },
    },
  },
});
