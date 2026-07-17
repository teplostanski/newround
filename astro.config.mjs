// @ts-check
import { defineConfig } from 'astro/config';
import readableClassnames from 'vite-plugin-readable-classnames';
import AstroPWA from '@vite-pwa/astro';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://tablo.teplostanski.me',
  integrations: [
    react(),
    AstroPWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'favicon-32x32.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'pwa-512x512-maskable.png',
      ],
      manifest: {
        name: 'Tablo',
        short_name: 'Tablo',
        description: 'Счётчик очков для настольных игр',
        lang: 'ru',
        theme_color: '#e8edf2',
        background_color: '#e8edf2',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/',
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,woff2}'],
      },
      experimental: {
        directoryAndTrailingSlashHandler: true,
      },
    }),
  ],
  vite: {
    plugins: [readableClassnames()],
  },
});
