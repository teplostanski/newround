import type { Metadata, Viewport } from 'next';
import { SerwistProvider } from '@serwist/next/react';
import { GeistSans } from 'geist/font/sans';
import { Suspense, type ReactNode } from 'react';
import { ClientApp } from '@/components/client-app';
import { InitialLoader } from '@/components/route-loader';
import { ServiceWorkerReset } from '@/components/service-worker-reset';
import { GamesStoreProvider } from '@/state/games-store';
import '@/styles/global.css';

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
  themeColor: '#e8edf2',
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="ru" className={GeistSans.className}>
    <body>
      <ServiceWorkerReset />
      <SerwistProvider
        swUrl="/sw.js"
        disable={process.env.NODE_ENV === 'development'}
        reloadOnOnline={false}
        options={{ type: 'classic' }}
      >
        <GamesStoreProvider>
          <Suspense fallback={<InitialLoader />}>
            <ClientApp>{children}</ClientApp>
          </Suspense>
        </GamesStoreProvider>
      </SerwistProvider>
    </body>
  </html>
);

export default RootLayout;
