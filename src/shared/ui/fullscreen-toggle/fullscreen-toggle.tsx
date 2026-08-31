'use client';

import ChevronsCollapseUpRight from '@gravity-ui/icons/ChevronsCollapseUpRight';
import ChevronsExpandUpRight from '@gravity-ui/icons/ChevronsExpandUpRight';
import { Switch } from '@heroui/react';
import { useSyncExternalStore } from 'react';
import styles from './fullscreen-toggle.module.css';

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

const useFullscreenSupported = () =>
  useSyncExternalStore(
    subscribeToFullscreen,
    getFullscreenSupportSnapshot,
    getServerSnapshot,
  );

const FullscreenToggle = () => {
  const isSupported = useFullscreenSupported();
  const isFullscreen = useSyncExternalStore(
    subscribeToFullscreen,
    getFullscreenSnapshot,
    getServerSnapshot,
  );

  if (!isSupported) {
    return null;
  }

  return (
    <Switch
      aria-label={
        isFullscreen
          ? 'Выйти из полноэкранного режима'
          : 'Открыть на весь экран'
      }
      className={styles.switch}
      isSelected={isFullscreen}
      size="lg"
      onChange={(selected) => {
        const action = selected
          ? document.documentElement.requestFullscreen()
          : document.exitFullscreen();

        void action.catch(() => undefined);
      }}
    >
      {({ isSelected }) => (
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb>
              <Switch.Icon>
                {isSelected ? (
                  <ChevronsCollapseUpRight
                    width={12}
                    height={12}
                    aria-hidden="true"
                    focusable="false"
                  />
                ) : (
                  <ChevronsExpandUpRight
                    width={12}
                    height={12}
                    aria-hidden="true"
                    focusable="false"
                  />
                )}
              </Switch.Icon>
            </Switch.Thumb>
          </Switch.Control>
        </Switch.Content>
      )}
    </Switch>
  );
};

export { FullscreenToggle, useFullscreenSupported };
