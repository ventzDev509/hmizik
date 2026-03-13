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
      // Sa a enpòtan pou tès nan dev
      devOptions: {
        enabled: true,
        type: 'module'
      },
      filename: 'manifest.json',
      manifest: { 
        name: 'H-Mizik Streaming',
        short_name: 'H-Mizik',
        description: 'Streaming mizik ayisyen offline',
        theme_color: '#121212',
        background_color: '#121212',
        display: 'standalone',
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
        // Nou ajoute tout assets yo nan kach la
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        navigateFallback: '/index.html', // Ajoute slash la
        // Sa a anpeche sèvè a voye index.html lè w ap chèche manifest la
        navigateFallbackAllowlist: [/^(?!\/__).*/, /^\/index.html$/],
        
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'audio',
            handler: 'CacheFirst',
            options: {
              cacheName: 'music-cache',
              expiration: {
                maxEntries: 100, // Nou ka mete plis
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jou
              },
              cacheableResponse: {
                statuses: [0, 200] // Aksepte repons ki soti nan lòt domèn (Opaque)
              }
            },
          },
        ],
      },
    }),
  ],
})