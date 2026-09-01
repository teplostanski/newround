import { buildInfo } from '@/shared/lib/build-info';
import {
  CircleInfo,
  EllipsisVertical,
  Gear,
  Heart,
  LogoGithub,
  ChartColumnStacked
} from '@gravity-ui/icons';
import { Label } from 'react-aria-components';
import { AppDropdown, type DropdownItem } from '../app-dropdown/app-dropdown';
import { BuildStamp } from '../build-stamp/build-stamp';
import {
  FullscreenToggle,
  useFullscreenSupported,
} from '../fullscreen-toggle/fullscreen-toggle';
import { IconAction } from '../icon-action/icon-action';
import { ThemeSwitch } from '../theme-switch/theme-switch';
import { AboutApp } from '../about-app/about-app';
import { useOverlayState } from '@heroui/react';

const AppMenu = () => {
  const isFullscreenSupported = useFullscreenSupported();
  const about = useOverlayState();

  const items: DropdownItem[] = [
        {
      key: 'stats',
      textValue: 'Статистика',
      slot: (
        <>
          <ChartColumnStacked className="size-4 shrink-0 text-muted" />
          <Label>Статистика</Label>
        </>
      ),
      isDanger: false,
      disabled: true,
    },
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
    <><AppDropdown
      className="min-w-74"
      header={<>
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
      </>}
      footer={buildInfo ? <BuildStamp /> : undefined}
      items={items}
      onAction={(key) => {
        if (key === 'about') {
          about.open();
        }
      } }
    >
      <IconAction aria-label={'Меню'}>
        <EllipsisVertical
          width={20}
          height={20}
          aria-hidden="true"
          focusable="false" />
      </IconAction>
    </AppDropdown><AboutApp isOpen={about.isOpen} onOpenChange={about.setOpen} /></>
  );
};

export { AppMenu };
