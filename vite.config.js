import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/sosika-vendor/',
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
});
