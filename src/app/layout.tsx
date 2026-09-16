import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { darkThemeColor, lightThemeColor } from '@/shared/lib/theme';
import '@/shared/styles/global.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://newround.teplostanski.me'),
  applicationName: 'newround',
  title: {
    default: 'newround',
    template: '%s · newround',
  },
  description: 'Счётчик очков для настольных игр',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/pwa-192x192.png', sizes: '192x192' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'newround',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: lightThemeColor },
    { media: '(prefers-color-scheme: dark)', color: darkThemeColor },
  ],
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html
    lang="ru"
    className={cn(GeistSans.variable, GeistMono.variable)}
    suppressHydrationWarning
  >
    <body className={cn(GeistSans.className, 'text-foreground')}>
      <Providers>{children}</Providers>
    </body>
  </html>
);

export default RootLayout;
