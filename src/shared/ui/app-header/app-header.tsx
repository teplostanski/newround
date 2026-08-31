'use client';

import { CircleInfo, ChevronLeft, EllipsisVertical, Gear, Heart, House, LogoGithub } from '@gravity-ui/icons';
import Link from 'next/link';
import { ViewTransition } from 'react';
import { Label, useOverlayState } from '@heroui/react';
import { routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import {
  FullscreenToggle,
  useFullscreenSupported,
} from '../fullscreen-toggle/fullscreen-toggle';
import { InstallApp } from '../install-app/install-app';
import { ThemeSwitch } from '../theme-switch/theme-switch';
import styles from './app-header.module.css';
import { OfflineStatus } from '../offline-status/offline-status';
import { AppDropdown, type DropdownItem } from '../app-dropdown/app-dropdown';
import { AboutApp } from '../about-app/about-app';
import { BuildStamp } from '../build-stamp/build-stamp';
import { buildInfo } from '@/shared/lib/build-info';
import { IconAction } from '../icon-action/icon-action';

type AppHeaderProps = {
  title: string;
  backHref?: string;
};

export const AppHeader = ({ title, backHref }: AppHeaderProps) => {
  const isFullscreenSupported = useFullscreenSupported();
  const about = useOverlayState();

  const items: DropdownItem[] = [
    {
      key: 'settings',
      textValue: 'Настройки',
      slot: (
        <>
          <Gear className="size-4 shrink-0 text-muted" />
          <Label>Настройки</Label>
        </>
      ),
      isDanger: false,
      disabled: true,
    },
    {
      key: 'about',
      textValue: 'О приложении',
      slot: (
        <>
          <CircleInfo className="size-4 shrink-0 text-muted" />
          <Label>О приложении</Label>
        </>
      ),
      isDanger: false,
      disabled: false,
    },
    {
      key: 'github',
      textValue: 'Исходный код',
      href: 'https://github.com/teplostanski/newround',
      target: '_blank',
      rel: 'noopener noreferrer',
      slot: (
        <>
          <LogoGithub className="size-4 shrink-0 text-muted" />
          <Label>Исходный код</Label>
        </>
      ),
      isDanger: false,
      disabled: false,
    },
    {
      key: 'thanks',
      textValue: 'Сказать спасибо',
      href: 'https://thanks.teplostanski.me',
      target: '_blank',
      rel: 'noopener noreferrer',
      slot: (
        <>
          <Heart className="size-4 shrink-0 text-muted" />
          <Label>Сказать спасибо</Label>
        </>
      ),
      isDanger: false,
      disabled: false,
    },
  ];

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
          <InstallApp />
          <AppDropdown
          className="min-w-74"
          header={
            <>
              <div>
                <Label>Тема</Label>
                <ThemeSwitch />
              </div>
              {isFullscreenSupported ? (
                <div>
                  <Label>На весь экран</Label>
                  <FullscreenToggle />
                </div>
              ) : null}
            </>
          }
          footer={buildInfo ? <BuildStamp /> : undefined}
          items={items}
          onAction={(key) => {
            if (key === 'about') {
              about.open();
            }
          }}
        >
          <IconAction aria-label={'Меню'}>
            <EllipsisVertical
              width={20}
              height={20}
              aria-hidden="true"
              focusable="false"
            />
          </IconAction>
        </AppDropdown>
        </div>


      </div>
      <h1 className={styles.title}>{title}</h1>
      <AboutApp isOpen={about.isOpen} onOpenChange={about.setOpen} />
    </header>
  );
};
