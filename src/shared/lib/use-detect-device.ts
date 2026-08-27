'use client';

import { useSyncExternalStore } from 'react';
import { detectDevice } from 'undevice';

const subscribe = () => () => undefined;

const readUserAgent = () => navigator.userAgent;

const emptyUserAgent = () => '';

export const useDetectDevice = () => {
  const userAgent = useSyncExternalStore(
    subscribe,
    readUserAgent,
    emptyUserAgent,
  );

  const device = detectDevice({
    userAgent: userAgent || undefined,
  });

  return {device, userAgent};
};
