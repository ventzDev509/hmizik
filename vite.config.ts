import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      devOptions: {
        enabled: true,
        type: 'module'
      },
      filename: 'sw.js',
      manifest: {
        name: 'H-Mizik Streaming',
        short_name: 'H-Mizik',
        description: 'Streaming mizik ayisyen offline',
        theme_color: 'red',
        background_color: 'red',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone'],
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Sa a asire tout fichye pwojè a sere nan kach
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^(?!\/__).*/, /^\/index.html$/],
        runtimeCaching: [
          {
            // Lojik espesyal pou Audio (Supabase oswa lòt)
            urlPattern: ({ request }) => request.destination === 'audio',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'music-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jou
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              plugins: [
                {
                  // Ranje erè TS pou handlerDidError (retounen undefined olye de null)
                  handlerDidError: async () => {
                    return undefined;
                  },
                  // Asire ke kach la toujou retounen yon repons valid
                  cachedResponseWillBeUsed: async ({ cachedResponse }) => {
                    return cachedResponse || undefined;
                  }
                }
              ]
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'images-cache',
              fetchOptions: {
                mode: 'cors', // Fòse mòd CORS
                credentials: 'omit',
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          }
        ],
      },
    }),
  ],
})