import type { MetadataRoute } from 'next';
import { darkThemeColor } from '@/shared/lib/theme';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'newround',
    short_name: 'newround',
    description: 'Счётчик очков для настольных игр',
    lang: 'ru',
    theme_color: darkThemeColor,
    background_color: darkThemeColor,
    display: 'standalone',
    orientation: 'portrait',
    start_url: '/',
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
