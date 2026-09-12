'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useLayoutEffect, type ReactNode } from 'react';
import { ScoringModes } from '@/shared/constants';
import { Paths, Routes } from '@/shared/lib/routes';
import type { OnionMode } from '@/shared/lib/use-onion-mode';
import { findById, useStore } from '@/shared/model/store';
import { AppHeader } from '../app-header/app-header';
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

      {onion ? (
        <RouteLoader onion={onion} title={title} contents={skeletons} />
      ) : null}
    </div>
  );
};

const AppShell = ({
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
    currentPathname !== Paths.Root
      ? currentPathname.replace(/\/$/, '')
      : Paths.Root;
  const searchParams = useSearchParams();
  const { games, playthroughs, rounds } = useStore();
  const gameId = searchParams?.get('gameId') ?? null;
  const playthroughId = searchParams?.get('playthroughId') ?? null;
  const roundId = searchParams?.get('roundId') ?? null;
  const game = findById(games, gameId);
  const playthrough = findById(playthroughs, playthroughId);
  const round = findById(rounds, roundId);

  if (pathname === Paths.Root) {
    return (
      <AppShellView title="Игры" onion={onion} skeletons={skeletons}>
        {children}
      </AppShellView>
    );
  }

  if (pathname === Paths.Dev) {
    return (
      <AppShellView
        title="Разработка"
        backHref={Routes.Root}
        onion={false}
        skeletons={skeletons}
      >
        {children}
      </AppShellView>
    );
  }

  if (pathname === Paths.GameCreate) {
    return (
      <AppShellView
        title="Новая игра"
        backHref={Routes.Root}
        onion={onion}
        skeletons={skeletons}
      >
        {children}
      </AppShellView>
    );
  }

  if (pathname === Paths.GameEdit) {
    return (
      <AppShellView
        title="Редактирование игры"
        backHref={Routes.Root}
        onion={onion}
        skeletons={skeletons}
      >
        {children}
      </AppShellView>
    );
  }

  if (pathname === Paths.Game) {
    return (
      <AppShellView
        title={game?.name ?? 'Партии'}
        backHref={Routes.Root}
        onion={onion}
        skeletons={skeletons}
      >
        {children}
      </AppShellView>
    );
  }

  if (pathname === Paths.Playthrough) {
    const title =
      game?.scoringMode === ScoringModes.Playthrough
        ? 'Счёт'
        : playthrough
          ? `Партия ${playthrough.sequenceNumber}`
          : 'Партия';

    return (
      <AppShellView
        title={title}
        backHref={game ? Routes.Game(game.id) : Routes.Root}
        onion={onion}
        skeletons={skeletons}
      >
        {children}
      </AppShellView>
    );
  }

  if (pathname === Paths.Round) {
    const backHref =
      game && playthrough
        ? Routes.Playthrough(game.id, playthrough.id)
        : game
          ? Routes.Game(game.id)
          : Routes.Root;

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
      title="404"
      backHref={Routes.Root}
      onion={false}
      skeletons={skeletons}
    >
      {children}
    </AppShellView>
  );
};

export { AppShell };
