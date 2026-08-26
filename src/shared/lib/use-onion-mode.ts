'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  removeStorageEntry,
  subscribeBrowserStorage,
  writeStorageEntry,
} from './browser-storage';

export type OnionMode = 'ghost' | 'diff';

const STORAGE_KEY = 'newround:onion';

const parseOnion = (value: string | null): OnionMode | false | undefined => {
  if (value === null) {
    return undefined;
  }

  if (value === '1' || value === 'ghost') {
    return 'ghost';
  }

  if (value === 'diff') {
    return 'diff';
  }

  if (value === '0' || value === 'off' || value === '') {
    return false;
  }

  return undefined;
};

export const readOnionMode = (): OnionMode | false => {
  const stored = sessionStorage.getItem(STORAGE_KEY);

  return stored === 'ghost' || stored === 'diff' ? stored : false;
};

export const writeOnionMode = (mode: OnionMode | false) => {
  if (mode) {
    writeStorageEntry(sessionStorage, STORAGE_KEY, mode);
    return;
  }

  removeStorageEntry(sessionStorage, STORAGE_KEY);
};

const getOffOnion = (): OnionMode | false => false;

export const useOnionMode = (): OnionMode | false => {
  const searchParams = useSearchParams();
  const fromQuery = parseOnion(searchParams.get('onion'));
  const stored = useSyncExternalStore(
    subscribeBrowserStorage,
    readOnionMode,
    getOffOnion,
  );

  useEffect(() => {
    if (fromQuery === undefined) {
      return;
    }

    writeOnionMode(fromQuery);
  }, [fromQuery]);

  if (fromQuery !== undefined) {
    return fromQuery;
  }

  return stored;
};
