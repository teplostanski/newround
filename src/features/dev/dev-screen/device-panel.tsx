'use client';

import { Chip } from '@heroui/react';
import { type DeviceFlags } from 'undevice';
import styles from './device-panel.module.css';
import { useDetectDevice } from '@/shared/lib/use-detect-device';

const activeFlags = (device: DeviceFlags) =>
  Object.entries(device)
    .filter(([, isOn]) => isOn)
    .map(([flag]) => flag);

const DevicePanel = () => {
  const { device, userAgent } = useDetectDevice();
  const flags = activeFlags(device);

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

export { DevicePanel };
