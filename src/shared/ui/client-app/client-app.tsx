'use client';

import { ViewTransition, type ReactNode } from 'react';
import { useIsHydrated } from '@/shared/lib/use-is-hydrated';
import { AppShell } from '../app-shell/app-shell';
import { InitialLoader } from '../route-loader/route-loader';

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
