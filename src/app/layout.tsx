import type { Metadata, Viewport } from 'next';
import { SerwistProvider } from '@serwist/next/react';
import { GeistSans } from 'geist/font/sans';
import { Suspense, type ReactNode } from 'react';
import { routeSkeletons } from './route-skeletons';
import { ClientApp } from '@/shared/ui/client-app/client-app';
import { InitialLoader } from '@/shared/ui/route-loader/route-loader';
import { ServiceWorkerReset } from '@/shared/ui/service-worker-reset/service-worker-reset';
import { ThemeProvider } from '@/shared/ui/theme-provider/theme-provider';
import { StoreProvider } from '@/shared/model/store';
import { darkThemeColor, lightThemeColor } from '@/shared/lib/theme';
import '@/shared/styles/global.css';

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
  <html lang="ru" suppressHydrationWarning>
    <body className={`${GeistSans.className} text-foreground`}>
      <ThemeProvider>
        <ServiceWorkerReset />
        <SerwistProvider
          swUrl="/sw.js"
          disable={process.env.NODE_ENV === 'development'}
          reloadOnOnline={false}
          options={{ type: 'classic' }}
        >
          <StoreProvider>
            <Suspense fallback={<InitialLoader contents={routeSkeletons} />}>
              <ClientApp skeletons={routeSkeletons}>{children}</ClientApp>
            </Suspense>
          </StoreProvider>
        </SerwistProvider>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
