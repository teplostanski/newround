'use client';

import { usePathname } from 'next/navigation';
import { ViewTransition, type ReactNode } from 'react';
import { OnionModes } from '@/shared/constants';
import { cn } from '@/shared/lib/cn';
import { Paths } from '@/shared/lib/routes';
import type { OnionMode } from '@/shared/lib/use-onion-mode';
import {
  AppHeaderSkeleton,
  type TitleSize,
} from '../app-header/app-header-skeleton';
import appStyles from '../app-shell/app-shell.module.css';
import styles from './route-loader.module.css';

import type { KeyOf, ValueOf } from '@/shared/types';

export type RouteKind = ValueOf<typeof KindByPath> | 'fallback';

type RoutePath = KeyOf<typeof KindByPath>;

type RouteLoaderProps = {
  fullscreen?: boolean;
  onion?: OnionMode;
  title?: string;
  contents?: Partial<Record<RouteKind, ReactNode>>;
};

type ContentSkeletonProps = {
  kind: RouteKind;
  contents?: Partial<Record<RouteKind, ReactNode>>;
};

const normalizePath = (pathname: string | null) => {
  if (!pathname || pathname === Paths.Root) {
    return Paths.Root;
  }

  return pathname.replace(/\/$/, '') || Paths.Root;
};

const KindByPath = {
  [Paths.Root]: 'root',
  [Paths.Game]: 'game',
  [Paths.GameCreate]: 'createGame',
  [Paths.GameEdit]: 'editGame',
  [Paths.Playthrough]: 'playthrough',
  [Paths.Round]: 'round',
} as const;

const isRoutePath = (pathname: string): pathname is RoutePath =>
  pathname in KindByPath;

const toRouteKind = (pathname: string): RouteKind =>
  isRoutePath(pathname) ? KindByPath[pathname] : 'fallback';

const titleSize = (kind: RouteKind): TitleSize => {
  if (kind === KindByPath[Paths.Root]) {
    return 'short';
  }

  if (kind === KindByPath[Paths.GameCreate]) {
    return 'medium';
  }

  return 'long';
};

const ContentSkeleton = ({ kind, contents }: ContentSkeletonProps) => {
  if (kind === 'fallback') {
    return contents?.fallback ?? <div className="screen" />;
  }

  return contents?.[kind] ?? contents?.root ?? <div className="screen" />;
};

const RouteLoader = ({
  fullscreen = false,
  onion,
  title,
  contents,
}: RouteLoaderProps) => {
  const pathname = normalizePath(usePathname());
  const kind = toRouteKind(pathname);
  const header = (
    <AppHeaderSkeleton
      title={title}
      showBack={kind !== KindByPath[Paths.Root]}
      titleSize={titleSize(kind)}
    />
  );

  if (onion) {
    return (
      <div
        className={cn(
          styles.onionLayer,
          onion === OnionModes.Ghost ? styles.onionGhost : styles.onionDiff,
        )}
        aria-hidden="true"
      >
        {header}
        <div className={appStyles.main}>
          <ContentSkeleton kind={kind} contents={contents} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(styles.loader, fullscreen && styles.fullscreen)}
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

const InitialLoader = ({ contents }: Pick<RouteLoaderProps, 'contents'>) => (
  <ViewTransition exit="initial-loader-exit" default="none">
    <RouteLoader fullscreen contents={contents} />
  </ViewTransition>
);

export { RouteLoader, InitialLoader };
