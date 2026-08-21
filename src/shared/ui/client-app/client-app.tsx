'use client';

import { I18nProvider } from '@heroui/react';
import type { ReactNode } from 'react';
import { useIsHydrated } from '@/shared/lib/use-is-hydrated';
import { useStore } from '@/shared/model/store';
import { AppShell } from '../app-shell/app-shell';
import { InitialLoader } from '../route-loader/route-loader';

const FORCE_SKELETON = false;

export const ClientApp = ({ children }: { children: ReactNode }) => {
  const isHydrated = useIsHydrated();
  const { isReady } = useStore();

  if (FORCE_SKELETON || !isHydrated || !isReady) {
    return <InitialLoader />;
  }

  return (
    <I18nProvider locale="ru-RU">
      <AppShell>{children}</AppShell>
    </I18nProvider>
  );
};
