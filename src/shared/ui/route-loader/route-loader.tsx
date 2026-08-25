'use client';

import { usePathname } from 'next/navigation';
import { ViewTransition, type ReactNode } from 'react';
import type { OnionMode } from '@/shared/lib/use-onion-mode';
import {
  AppHeaderSkeleton,
  type BrandSize,
} from '../app-header/app-header-skeleton';
import appStyles from '../app-shell/app-shell.module.css';
import styles from './route-loader.module.css';

export type RouteKind =
  | 'games'
  | 'newGame'
  | 'playthroughs'
  | 'playthrough'
  | 'round'
  | 'fallback';

const normalizePath = (pathname: string | null) => {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.replace(/\/$/, '') || '/';
};

const routeKind = (pathname: string): RouteKind => {
  switch (pathname) {
    case '/':
      return 'games';
    case '/game/create':
      return 'newGame';
    case '/game':
      return 'playthroughs';
    case '/playthrough':
      return 'playthrough';
    case '/round':
      return 'round';
    default:
      return 'fallback';
  }
};

const brandSize = (kind: RouteKind): BrandSize => {
  if (kind === 'games') {
    return 'short';
  }

  if (kind === 'newGame') {
    return 'medium';
  }

  return 'long';
};

type RouteLoaderProps = {
  fullscreen?: boolean;
  onion?: OnionMode;
  title?: string;
  contents?: Partial<Record<RouteKind, ReactNode>>;
};

const ContentSkeleton = ({
  kind,
  contents,
}: {
  kind: RouteKind;
  contents?: Partial<Record<RouteKind, ReactNode>>;
}) => contents?.[kind] ?? contents?.games ?? <div className="screen" />;

export const RouteLoader = ({
  fullscreen = false,
  onion,
  title,
  contents,
}: RouteLoaderProps) => {
  const pathname = normalizePath(usePathname());
  const kind = routeKind(pathname);
  const header = (
    <AppHeaderSkeleton
      title={title}
      showBack={kind !== 'games'}
      brandSize={brandSize(kind)}
    />
  );

  if (onion) {
    const onionClass = `${styles.onionLayer} ${onion === 'ghost' ? styles.onionGhost : styles.onionDiff}`;

    return (
      <div className={onionClass} aria-hidden="true">
        {header}
        <div className={appStyles.main}>
          <ContentSkeleton kind={kind} contents={contents} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.loader} ${fullscreen ? styles.fullscreen : ''}`}
      role="status"
      aria-label="Загрузка"
      aria-live="polite"
    >
      {fullscreen ? (
        <div className={appStyles.shell} aria-hidden="true">
          {header}
          <div className={appStyles.main}>
            <ContentSkeleton kind={kind} contents={contents} />
          </div>
        </div>
      ) : (
        <div aria-hidden="true">
          <ContentSkeleton kind={kind} contents={contents} />
        </div>
      )}
    </div>
  );
};

export const InitialLoader = ({
  contents,
}: {
  contents?: Partial<Record<RouteKind, ReactNode>>;
}) => (
  <ViewTransition exit="initial-loader-exit" default="none">
    <RouteLoader fullscreen contents={contents} />
  </ViewTransition>
);
