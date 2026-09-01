'use client';

import { ChevronLeft, House } from '@gravity-ui/icons';
import Link from 'next/link';
import { ViewTransition } from 'react';
import { Routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { InstallApp } from '../install-app/install-app';
import styles from './app-header.module.css';
import { OfflineStatus } from '../offline-status/offline-status';
import { AppMenu } from '../app-menu/app-menu';

type AppHeaderProps = {
  title: string;
  backHref?: string;
};

const AppHeader = ({ title, backHref }: AppHeaderProps) => {
  return (
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
                  className="iconActionLink"
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
                  className="iconActionLink"
                  href={Routes.Root}
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
          <InstallApp />
          <AppMenu />
        </div>
      </div>
      <h1 className={styles.title}>{title}</h1>
    </header>
  );
};

export { AppHeader };
