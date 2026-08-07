'use client';

import { ChevronLeft, House } from '@gravity-ui/icons';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ViewTransition, type ReactNode } from 'react';
import { findGame, findSession } from '@/domain/game';
import { routes } from '@/lib/routes';
import {
  routeTransitionTypes,
  sharedTitleTransitions,
  transitionNames,
} from '@/lib/view-transitions';
import { useGamesStore } from '@/state/games-store';
import { FullscreenToggle } from './fullscreen-toggle';
import { InstallApp } from './install-app';
import styles from './app.module.css';

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
}: AppShellViewProps) => (
  <div className={styles.shell}>
    0
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
                  className={styles.iconBtn}
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
              {backHref !== routes.games && (
                <ViewTransition
                  name="header-home"
                  enter="header-action-enter"
                  exit="header-action-exit"
                  default="none"
                >
                  <Link
                    className={styles.iconBtn}
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
              )}
            </>
          )}
        </nav>
        <div className={styles.actions}>
          <InstallApp className={styles.iconBtn} />
          <FullscreenToggle className={styles.iconBtn} />
        </div>
      </div>
      <ViewTransition
        key={transitionName}
        name={transitionName}
        enter="header-title-enter"
        exit="header-title-exit"
        share={sharedTitleTransitions}
        default="none"
      >
        <h1 className={styles.brand}>{title}</h1>
      </ViewTransition>
    </header>
    {children}
  </div>
);

export const AppShell = ({ children }: { children: ReactNode }) => {
  const currentPathname = usePathname();
  const pathname =
    currentPathname !== '/' ? currentPathname.replace(/\/$/, '') : '/';
  const searchParams = useSearchParams();
  const { games } = useGamesStore();
  const gameId = searchParams?.get('gameId') ?? null;
  const sessionId = searchParams?.get('sessionId') ?? null;
  const roundId = searchParams?.get('roundId') ?? null;
  const game = findGame(games, gameId);
  const session = findSession(game, sessionId);
  const sessionIndex = game?.sessions.findIndex(
    (candidate) => candidate.id === sessionId,
  );
  const roundIndex = session?.rounds.findIndex(
    (candidate) => candidate.id === roundId,
  );

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

  if (pathname === '/sessions') {
    return (
      <AppShellView
        title={game?.name ?? 'Сессии'}
        transitionName={
          game
            ? transitionNames.gameTitle(game.id)
            : transitionNames.pageTitle
        }
        backHref={routes.games}
      >
        {children}
      </AppShellView>
    );
  }

  if (pathname === '/sessions/view') {
    const backHref = game ? routes.sessions(game.id) : routes.games;
    const title =
      sessionIndex !== undefined && sessionIndex >= 0
        ? `Сессия ${sessionIndex + 1}`
        : 'Сессия';

    return (
      <AppShellView
        title={title}
        transitionName={
          session
            ? transitionNames.sessionTitle(session.id)
            : transitionNames.pageTitle
        }
        backHref={backHref}
      >
        {children}
      </AppShellView>
    );
  }

  if (pathname === '/rounds/view') {
    const title =
      roundIndex !== undefined && roundIndex >= 0
        ? `Партия ${roundIndex + 1}`
        : 'Партия';
    const backHref =
      game && session
        ? routes.session(game.id, session.id)
        : game
          ? routes.sessions(game.id)
          : routes.games;

    return (
      <AppShellView
        title={title}
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
