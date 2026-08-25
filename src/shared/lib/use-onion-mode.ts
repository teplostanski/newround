'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useIsHydrated } from './use-is-hydrated';

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

const readStored = (): OnionMode | false => {
  const stored = sessionStorage.getItem(STORAGE_KEY);

  return stored === 'ghost' || stored === 'diff' ? stored : false;
};

export const useOnionMode = (): OnionMode | false => {
  const isHydrated = useIsHydrated();
  const searchParams = useSearchParams();
  const fromQuery = parseOnion(searchParams.get('onion'));

  useEffect(() => {
    if (fromQuery === undefined) {
      return;
    }

    if (fromQuery) {
      sessionStorage.setItem(STORAGE_KEY, fromQuery);
      return;
    }

    sessionStorage.removeItem(STORAGE_KEY);
  }, [fromQuery]);

  if (fromQuery !== undefined) {
    return fromQuery;
  }

  if (!isHydrated) {
    return false;
  }

  return readStored();
};
