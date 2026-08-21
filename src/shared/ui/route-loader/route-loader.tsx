'use client';

import { Card, Fieldset, Skeleton } from '@heroui/react';
import { usePathname } from 'next/navigation';
import { ViewTransition, type ComponentProps } from 'react';
import appStyles from '../app-shell/app-shell.module.css';
import styles from './route-loader.module.css';

type RouteLoaderProps = {
  fullscreen?: boolean;
};

type RouteKind =
  | 'games'
  | 'newGame'
  | 'playthroughs'
  | 'playthrough'
  | 'round'
  | 'fallback';

const LIST_KEYS = [0, 1, 2] as const;

const asSpan = (props: ComponentProps<'span'>) => <span {...props} />;

const normalizePath = (pathname: string | null) => {
  if (!pathname || pathname === '/') {
    return '/games';
  }

  return pathname.replace(/\/$/, '') || '/games';
};

const routeKind = (pathname: string): RouteKind => {
  switch (pathname) {
    case '/games':
      return 'games';
    case '/games/new':
      return 'newGame';
    case '/playthroughs':
      return 'playthroughs';
    case '/playthroughs/view':
      return 'playthrough';
    case '/rounds/view':
      return 'round';
    default:
      return 'fallback';
  }
};

const HeaderSkeleton = ({ kind }: { kind: RouteKind }) => {
  const showNav = kind !== 'games';
  const brandWidth =
    kind === 'games'
      ? styles.brandShort
      : kind === 'newGame'
        ? styles.brandMedium
        : styles.brandLong;

  return (
    <header className={appStyles.header}>
      <div className={appStyles.headerBar}>
        <nav className={appStyles.nav} aria-hidden="true">
          {showNav && <Skeleton className="size-11" />}
          {showNav && <Skeleton className="size-11" />}
        </nav>
        <div className={appStyles.actions}>
          <Skeleton className="size-11" />
          <Skeleton className="size-11" />
        </div>
      </div>
      <Skeleton className={`h-8 ${brandWidth}`} />
    </header>
  );
};

const ListSkeleton = ({ metaWide = false }: { metaWide?: boolean }) => (
  <ul className="list">
    {LIST_KEYS.map((key) => (
      <li key={key}>
        <Card className="w-full">
          <Card.Header>
            <Card.Title>
              <Skeleton
                className="inline-block h-4 w-[55%]"
                render={asSpan}
              />
            </Card.Title>
            <Card.Description>
              <Skeleton
                className={`inline-block h-3.5 ${metaWide ? 'w-[70%]' : 'w-[35%]'}`}
                render={asSpan}
              />
            </Card.Description>
          </Card.Header>
        </Card>
      </li>
    ))}
  </ul>
);

const GamesContent = () => (
  <div className="screen">
    <Skeleton className="buttonBone" />
    <ListSkeleton />
  </div>
);

const PlaythroughsContent = () => (
  <div className="screen">
    <ListSkeleton metaWide />
  </div>
);

const PlaythroughContent = () => (
  <div className="screen">
    <Card className="w-full">
      <Card.Content>
        <Skeleton className="h-4 w-[88%]" />
      </Card.Content>
    </Card>
    <Skeleton className="h-11 w-full" />
    <ListSkeleton metaWide />
  </div>
);

const RoundContent = () => (
  <div className="screen">
    <ul className={`list ${styles.roundList}`}>
      {LIST_KEYS.map((key) => (
        <li key={key}>
          <Card className="w-full bg-background">
            <Skeleton className="h-7 w-[40%]" />
            <div className={styles.roundStepper}>
              <Skeleton className="h-11" />
              <Skeleton className="h-11" />
              <Skeleton className="h-11" />
            </div>
          </Card>
        </li>
      ))}
    </ul>
    <Skeleton className="h-11 w-full" />
  </div>
);

const NewGameContent = () => (
  <div className="screen">
    <div className="stack">
      <Skeleton className="h-11 w-full" />
      <Fieldset>
        <Fieldset.Legend>
          <Skeleton className="inline-block h-4 w-24" render={asSpan} />
        </Fieldset.Legend>
        <div className="row">
          <Skeleton className="h-11 min-w-0 flex-1" />
          <Skeleton className="size-11 shrink-0" />
        </div>
        <Skeleton className="h-4 w-[70%]" />
      </Fieldset>
      <Skeleton className="h-11 w-full" />
    </div>
  </div>
);

const ContentSkeleton = ({ kind }: { kind: RouteKind }) => {
  switch (kind) {
    case 'newGame':
      return <NewGameContent />;
    case 'playthroughs':
      return <PlaythroughsContent />;
    case 'playthrough':
      return <PlaythroughContent />;
    case 'round':
      return <RoundContent />;
    case 'games':
    case 'fallback':
    default:
      return <GamesContent />;
  }
};

export const RouteLoader = ({ fullscreen = false }: RouteLoaderProps) => {
  const pathname = normalizePath(usePathname());
  const kind = routeKind(pathname);

  return (
    <div
      className={`${styles.loader} ${fullscreen ? styles.fullscreen : ''}`}
      role="status"
      aria-label="Загрузка"
      aria-live="polite"
    >
      {fullscreen ? (
        <div className={appStyles.shell} aria-hidden="true">
          <HeaderSkeleton kind={kind} />
          <div className={appStyles.main}>
            <ContentSkeleton kind={kind} />
          </div>
        </div>
      ) : (
        <div aria-hidden="true">
          <ContentSkeleton kind={kind} />
        </div>
      )}
    </div>
  );
};

export const InitialLoader = () => (
  <ViewTransition exit="initial-loader-exit" default="none">
    <RouteLoader fullscreen />
  </ViewTransition>
);
