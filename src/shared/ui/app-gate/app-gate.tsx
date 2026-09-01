'use client';

import { I18nProvider } from '@heroui/react';
import type { ReactNode } from 'react';
import { useIsHydrated } from '@/shared/lib/use-is-hydrated';
import { useOnionMode } from '@/shared/lib/use-onion-mode';
import { useStore } from '@/shared/model/store';
import { AppShell } from '../app-shell/app-shell';
import {
  InitialLoader,
  type RouteKind,
} from '../route-loader/route-loader';

const FORCE_SKELETON = false;

const AppGate = ({
  children,
  skeletons,
}: {
  children: ReactNode;
  skeletons?: Partial<Record<RouteKind, ReactNode>>;
}) => {
  const isHydrated = useIsHydrated();
  const { isReady } = useStore();
  const onionMode = useOnionMode();

  if (FORCE_SKELETON || !isHydrated || !isReady) {
    return <InitialLoader contents={skeletons} />;
  }

  return (
    <I18nProvider locale="ru-RU">
      <AppShell onion={onionMode} skeletons={skeletons}>
        {children}
      </AppShell>
    </I18nProvider>
  );
};

export { AppGate };
