'use client';

import { Suspense, type ReactNode } from 'react';
import { SerwistProvider } from '@serwist/next/react';
import { routeSkeletons } from './route-skeletons';
import { AppGate } from '@/shared/ui/app-gate/app-gate';
import { InitialLoader } from '@/shared/ui/route-loader/route-loader';
import { ThemeProvider } from '@/shared/ui/theme-provider/theme-provider';
import { StoreProvider } from '@/shared/model/store';
import { ServiceWorkerReset } from '@/shared/lib/service-worker-reset';

export function Providers({ children }: { children: ReactNode }) {
  return (
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
            <AppGate skeletons={routeSkeletons}>{children}</AppGate>
          </Suspense>
        </StoreProvider>
      </SerwistProvider>
    </ThemeProvider>
  );
}
