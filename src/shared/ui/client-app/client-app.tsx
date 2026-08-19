'use client';

import { ViewTransition, type ReactNode } from 'react';
import { useIsHydrated } from '@/shared/lib/use-is-hydrated';
import { useStore } from '@/shared/model/store';
import { AppShell } from '../app-shell/app-shell';
import { InitialLoader } from '../route-loader/route-loader';

export const ClientApp = ({ children }: { children: ReactNode }) => {
  const isHydrated = useIsHydrated();
  const { isReady } = useStore();

  if (!isHydrated || !isReady) {
    return <InitialLoader />;
  }

  return (
    <ViewTransition enter="app-screen-enter" default="none">
      <AppShell>{children}</AppShell>
    </ViewTransition>
  );
};
