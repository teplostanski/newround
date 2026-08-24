'use client';

import { useLayoutEffect, useSyncExternalStore } from 'react';
import {
  applyResolvedTheme,
  getPreferenceSnapshot,
  getServerPreferenceSnapshot,
  getServerSystemThemeSnapshot,
  getSystemTheme,
  setThemePreference,
  subscribePreference,
  subscribeSystemTheme,
} from './theme';

const useTheme = () => {
  const preference = useSyncExternalStore(
    subscribePreference,
    getPreferenceSnapshot,
    getServerPreferenceSnapshot,
  );
  const systemTheme = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemTheme,
    getServerSystemThemeSnapshot,
  );
  const resolvedTheme = preference === 'system' ? systemTheme : preference;

  useLayoutEffect(() => {
    applyResolvedTheme(resolvedTheme);
  }, [resolvedTheme]);

  return {
    resolvedTheme,
    setTheme: setThemePreference,
  };
};

export { useTheme };
