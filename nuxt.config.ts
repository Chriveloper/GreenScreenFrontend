import { VitePWA } from 'vite-plugin-pwa';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default
defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  // Configure PWA via Vite plugin
  vite: {
    server: {
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..']
      }
    },
    plugins: [
      VitePWA({
        manifest: {
          name: 'GreenScreen Focus Manager',
          short_name: 'GreenScreen',
          description: 'Stay focused and grow your virtual terrarium',
          lang: 'en',
          theme_color: '#10B981',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          icons: [
            { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' }
          ]
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: '/api/.*',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: { maxEntries: 50, maxAgeSeconds: 86400 }
              }
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|ico)$/, 
              handler: 'CacheFirst',
              options: {
                cacheName: 'asset-images',
                expiration: { maxEntries: 100, maxAgeSeconds: 604800 }
              }
            }
          ]
        }
      })
    ]
  },
  css: [
    '~/assets/css/tailwind.css',
  ],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    }
  }
})
