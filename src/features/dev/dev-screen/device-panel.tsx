'use client';

import { useSyncExternalStore } from 'react';
import { Chip } from '@heroui/react';
import { detectDevice } from 'undevice';
import styles from './device-panel.module.css';

const subscribe = () => () => undefined;

const readUserAgent = () => navigator.userAgent;

const emptyUserAgent = () => '';

const activeFlags = (userAgent: string) => {
  const device = detectDevice({
    userAgent: userAgent || undefined,
  });

  return Object.entries(device)
    .filter(([, isOn]) => isOn)
    .map(([flag]) => flag);
};

export const DevicePanel = () => {
  const userAgent = useSyncExternalStore(
    subscribe,
    readUserAgent,
    emptyUserAgent,
  );
  const flags = activeFlags(userAgent);

  return (
    <>
      <pre className={styles.ua}>
        {userAgent === '' ? 'Нет user-agent' : userAgent}
      </pre>
      {flags.length === 0 ? (
        <p className="empty">Активных флагов нет</p>
      ) : (
        <ul className={styles.flags}>
          {flags.map((flag) => (
            <li key={flag}>
              <Chip variant="soft" size="sm">
                {flag}
              </Chip>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
