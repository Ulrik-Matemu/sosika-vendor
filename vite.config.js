import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/sosika-vendor/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: "Sosika Vendor",
        short_name: "SosikaV",
        start_url: "/",
        display: "standalone",
        background_color: "#e7e7e7",
        theme_color: "#00bfff",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
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
