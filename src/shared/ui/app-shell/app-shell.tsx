'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useLayoutEffect, type ReactNode } from 'react';
import { routes } from '@/shared/lib/routes';
import type { OnionMode } from '@/shared/lib/use-onion-mode';
import { findById, useStore } from '@/shared/model/store';
import { AppHeader } from '../app-header/app-header';
import { BuildStamp } from '../build-stamp/build-stamp';
import { RouteLoader, type RouteKind } from '../route-loader/route-loader';
import styles from './app-shell.module.css';

type AppShellViewProps = {
  title: string;
  backHref?: string;
  onion?: OnionMode | false;
  skeletons?: Partial<Record<RouteKind, ReactNode>>;
  children: ReactNode;
};

const AppShellView = ({
  title,
  backHref,
  onion,
  skeletons,
  children,
}: AppShellViewProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams?.toString() ?? ''}`;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [routeKey]);

  return (
    <div className={styles.shell}>
      <AppHeader title={title} backHref={backHref} />
      <main className={styles.main}>{children}</main>
      <footer>
        <BuildStamp />
      </footer>
      {onion ? (
        <RouteLoader onion={onion} title={title} contents={skeletons} />
      ) : null}
    </div>
  );
};

export const AppShell = ({
  children,
  onion = false,
  skeletons,
}: {
  children: ReactNode;
  onion?: OnionMode | false;
  skeletons?: Partial<Record<RouteKind, ReactNode>>;
}) => {
  const currentPathname = usePathname();
  const pathname =
    currentPathname !== '/' ? currentPathname.replace(/\/$/, '') : '/';
  const searchParams = useSearchParams();
  const { games, playthroughs, rounds } = useStore();
  const gameId = searchParams?.get('gameId') ?? null;
  const playthroughId = searchParams?.get('playthroughId') ?? null;
  const roundId = searchParams?.get('roundId') ?? null;
  const game = findById(games, gameId);
  const playthrough = findById(playthroughs, playthroughId);
  const round = findById(rounds, roundId);

  if (pathname === '/') {
    return (
      <AppShellView title="Игры" onion={onion} skeletons={skeletons}>
        {children}
      </AppShellView>
    );
  }

  if (pathname === '/game/create') {
    return (
      <AppShellView
        title="Новая игра"
        backHref={routes.home}
        onion={onion}
        skeletons={skeletons}
      >
        {children}
      </AppShellView>
    );
  }

  if (pathname === '/game') {
    return (
      <AppShellView
        title={game?.name ?? 'Партии'}
        backHref={routes.home}
        onion={onion}
        skeletons={skeletons}
      >
        {children}
      </AppShellView>
    );
  }

  if (pathname === '/playthrough') {
    return (
      <AppShellView
        title={
          playthrough ? `Партия ${playthrough.sequenceNumber}` : 'Партия'
        }
        backHref={game ? routes.game(game.id) : routes.home}
        onion={onion}
        skeletons={skeletons}
      >
        {children}
      </AppShellView>
    );
  }

  if (pathname === '/round') {
    const backHref =
      game && playthrough
        ? routes.playthrough(game.id, playthrough.id)
        : game
          ? routes.game(game.id)
          : routes.home;

    return (
      <AppShellView
        title={round ? `Раунд ${round.sequenceNumber}` : 'Раунд'}
        backHref={backHref}
        onion={onion}
        skeletons={skeletons}
      >
        {children}
      </AppShellView>
    );
  }

  return (
    <AppShellView
      title="newround"
      backHref={routes.home}
      onion={onion}
      skeletons={skeletons}
    >
      {children}
    </AppShellView>
  );
};
