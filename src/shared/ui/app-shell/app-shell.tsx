'use client';

import { ChevronLeft, House } from '@gravity-ui/icons';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLayoutEffect, ViewTransition, type ReactNode } from 'react';
import { routes } from '@/shared/lib/routes';
import {
  routeTransitionTypes,
  titleTransitionStyle,
  transitionNames,
} from '@/shared/lib/view-transitions';
import { findById, useStore } from '@/shared/model/store';
import { BuildStamp } from '../build-stamp/build-stamp';
import { FullscreenToggle } from '../fullscreen-toggle/fullscreen-toggle';
import { InstallApp } from '../install-app/install-app';
import styles from './app-shell.module.css';

type AppShellViewProps = {
  title: string;
  transitionName: string;
  backHref?: string;
  children: ReactNode;
};

const AppShellView = ({
  title,
  transitionName,
  backHref,
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
      <header className={styles.header}>
        <div className={styles.headerBar}>
          <nav className={styles.nav} aria-label="Основная навигация">
            {backHref && (
              <>
                <ViewTransition
                  name="header-back"
                  enter="header-action-enter"
                  exit="header-action-exit"
                  share="header-action-share"
                  default="none"
                >
                  <Link
                    className={styles.iconLink}
                    href={backHref}
                    aria-label="Назад"
                    title="Назад"
                    transitionTypes={routeTransitionTypes.back}
                  >
                    <ChevronLeft
                      width={20}
                      height={20}
                      aria-hidden="true"
                      focusable="false"
                    />
                  </Link>
                </ViewTransition>
                <ViewTransition
                  name="header-home"
                  enter="header-action-enter"
                  exit="header-action-exit"
                  share="header-action-share"
                  default="none"
                >
                  <Link
                    className={styles.iconLink}
                    href={routes.games}
                    aria-label="Главная"
                    title="Главная"
                    transitionTypes={routeTransitionTypes.back}
                  >
                    <House
                      width={20}
                      height={20}
                      aria-hidden="true"
                      focusable="false"
                    />
                  </Link>
                </ViewTransition>
              </>
            )}
          </nav>
          <div className={styles.actions}>
            <InstallApp className="iconButton" />
            <FullscreenToggle className="iconButton" />
          </div>
        </div>
        <h1
          className={styles.brand}
          style={titleTransitionStyle(transitionName)}
        >
          {title}
        </h1>
      </header>
      <main className={styles.main}>{children}</main>
      <footer>
        <BuildStamp />
      </footer>
    </div>
  );
};

export const AppShell = ({ children }: { children: ReactNode }) => {
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

  if (pathname === '/' || pathname === '/games') {
    return (
      <AppShellView title="Игры" transitionName={transitionNames.pageTitle}>
        {children}
      </AppShellView>
    );
  }

  if (pathname === '/games/new') {
    return (
      <AppShellView
        title="Новая игра"
        transitionName={transitionNames.newGameTitle}
        backHref={routes.games}
      >
        {children}
      </AppShellView>
    );
  }
  
  if (pathname === '/migration') {
    return (
      <AppShellView
        title="Миграция"
        transitionName={transitionNames.pageTitle}
        backHref={routes.games}
      >
        {children}
      </AppShellView>
    );
  }

  if (pathname === '/playthroughs') {
    return (
      <AppShellView
        title={game?.name ?? 'Сессии'}
        transitionName={
          gameId ? transitionNames.gameTitle(gameId) : transitionNames.pageTitle
        }
        backHref={routes.games}
      >
        {children}
      </AppShellView>
    );
  }

  if (pathname === '/playthroughs/view') {
    return (
      <AppShellView
        title={
          playthrough ? `Сессия ${playthrough.sequenceNumber}` : 'Сессия'
        }
        transitionName={
          playthroughId
            ? transitionNames.sessionTitle(playthroughId)
            : transitionNames.pageTitle
        }
        backHref={game ? routes.playthroughs(game.id) : routes.games}
      >
        {children}
      </AppShellView>
    );
  }

  if (pathname === '/rounds/view') {
    const backHref =
      game && playthrough
        ? routes.playthrough(game.id, playthrough.id)
        : game
          ? routes.playthroughs(game.id)
          : routes.games;

    return (
      <AppShellView
        title={round ? `Партия ${round.sequenceNumber}` : 'Партия'}
        transitionName={
          roundId
            ? transitionNames.roundTitle(roundId)
            : transitionNames.pageTitle
        }
        backHref={backHref}
      >
        {children}
      </AppShellView>
    );
  }

  return (
    <AppShellView
      title="newround"
      transitionName={transitionNames.pageTitle}
      backHref={routes.games}
    >
      {children}
    </AppShellView>
  );
};
