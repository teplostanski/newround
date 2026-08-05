'use client';

import { ViewTransition, type ReactNode } from 'react';
import { useIsHydrated } from '@/hooks/use-is-hydrated';
import { AppShell } from './app-shell';
import { InitialLoader } from './route-loader';

export const ClientApp = ({ children }: { children: ReactNode }) => {
  const isHydrated = useIsHydrated();

  if (!isHydrated) {
    return <InitialLoader />;
  }

  return (
    <ViewTransition enter="app-screen-enter" default="none">
      <AppShell>{children}</AppShell>
    </ViewTransition>
  );
};
