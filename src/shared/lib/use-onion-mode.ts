'use client';

import { useSyncExternalStore } from 'react';
import { OnionModes } from '@/shared/constants';
import {
  removeStorageEntry,
  subscribeBrowserStorage,
  writeStorageEntry,
} from './browser-storage';

export type OnionMode = typeof OnionModes.Ghost | typeof OnionModes.Diff;

const STORAGE_KEY = 'newround:onion';

const isOnionMode = (value: string): value is OnionMode =>
  value === OnionModes.Ghost || value === OnionModes.Diff;

export const readOnionMode = (): OnionMode | false => {
  const stored = sessionStorage.getItem(STORAGE_KEY);

  return stored !== null && isOnionMode(stored) ? stored : false;
};

export const writeOnionMode = (mode: OnionMode | false) => {
  if (mode) {
    writeStorageEntry(sessionStorage, STORAGE_KEY, mode);
    return;
  }

  removeStorageEntry(sessionStorage, STORAGE_KEY);
};

const getOffOnion = (): OnionMode | false => false;

export const useOnionMode = (): OnionMode | false =>
  useSyncExternalStore(
    subscribeBrowserStorage,
    readOnionMode,
    getOffOnion,
  );
