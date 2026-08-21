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
                    className="iconButton"
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
                    className="iconButton"
                    href={routes.home}
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
            <InstallApp />
            <FullscreenToggle />
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

  if (pathname === '/') {
    return (
      <AppShellView title="Игры" transitionName={transitionNames.pageTitle}>
        {children}
      </AppShellView>
    );
  }

  if (pathname === '/game/create') {
    return (
      <AppShellView
        title="Новая игра"
        transitionName={transitionNames.newGameTitle}
        backHref={routes.home}
      >
        {children}
      </AppShellView>
    );
  }

  if (pathname === '/game') {
    return (
      <AppShellView
        title={game?.name ?? 'Партии'}
        transitionName={
          gameId ? transitionNames.gameTitle(gameId) : transitionNames.pageTitle
        }
        backHref={routes.home}
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
        transitionName={
          playthroughId
            ? transitionNames.playthroughTitle(playthroughId)
            : transitionNames.pageTitle
        }
        backHref={game ? routes.game(game.id) : routes.home}
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
      backHref={routes.home}
    >
      {children}
    </AppShellView>
  );
};
