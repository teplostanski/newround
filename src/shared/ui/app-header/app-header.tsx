'use client';

import { ChevronLeft, House } from '@gravity-ui/icons';
import Link from 'next/link';
import { ViewTransition } from 'react';
import { routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { FullscreenToggle } from '../fullscreen-toggle/fullscreen-toggle';
import { InstallApp } from '../install-app/install-app';
import { ThemeSwitch } from '../theme-switch/theme-switch';
import styles from './app-header.module.css';
import { OfflineStatus } from '../offline-status/offline-status';

type AppHeaderProps = {
  title: string;
  backHref?: string;
};

export const AppHeader = ({ title, backHref }: AppHeaderProps) => (
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
        <OfflineStatus />
        <ThemeSwitch />
        <InstallApp />
        <FullscreenToggle />
      </div>
    </div>
    <h1 className={styles.brand}>{title}</h1>
  </header>
);
