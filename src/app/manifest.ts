import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'newround',
    short_name: 'newround',
    description: 'Счётчик очков для настольных игр',
    lang: 'ru',
    theme_color: '#e8edf2',
    background_color: '#e8edf2',
    display: 'standalone',
    orientation: 'portrait',
    start_url: '/games/',
    scope: '/',
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/pwa-512x512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
