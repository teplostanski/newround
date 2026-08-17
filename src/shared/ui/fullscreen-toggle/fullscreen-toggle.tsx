'use client';

import ChevronsCollapseUpRight from '@gravity-ui/icons/ChevronsCollapseUpRight';
import ChevronsExpandUpRight from '@gravity-ui/icons/ChevronsExpandUpRight';
import { useSyncExternalStore, ViewTransition } from 'react';

type FullscreenToggleProps = {
  className: string;
};

const subscribeToFullscreen = (onStoreChange: () => void) => {
  document.addEventListener('fullscreenchange', onStoreChange);

  return () => {
    document.removeEventListener('fullscreenchange', onStoreChange);
  };
};

const getFullscreenSupportSnapshot = () =>
  document.fullscreenEnabled &&
  typeof document.documentElement.requestFullscreen === 'function';

const getFullscreenSnapshot = () => Boolean(document.fullscreenElement);
const getServerSnapshot = () => false;

const FullscreenToggle = ({ className }: FullscreenToggleProps) => {
  const isSupported = useSyncExternalStore(
    subscribeToFullscreen,
    getFullscreenSupportSnapshot,
    getServerSnapshot,
  );
  const isFullscreen = useSyncExternalStore(
    subscribeToFullscreen,
    getFullscreenSnapshot,
    getServerSnapshot,
  );
  const label = isFullscreen
    ? 'Выйти из полноэкранного режима'
    : 'Открыть на весь экран';
  const FullscreenIcon = isFullscreen
    ? ChevronsCollapseUpRight
    : ChevronsExpandUpRight;

  if (!isSupported) {
    return null;
  }

  const handleToggle = () => {
    const action = isFullscreen
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();

    void action.catch(() => undefined);
  };

  return (
    <ViewTransition
      enter="header-action-enter"
      exit="header-action-exit"
      default="none"
    >
      <wa-button
        className={className}
        type="button"
        variant="neutral"
        appearance="outlined"
        aria-label={label}
        title={label}
        onClick={handleToggle}
      >
        <FullscreenIcon
          width={20}
          height={20}
          aria-hidden="true"
          focusable="false"
        />
      </wa-button>
    </ViewTransition>
  );
};

export { FullscreenToggle };
