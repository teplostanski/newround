'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { themeStorageKey } from '@/shared/lib/theme';
import { ThemeColorSync } from './theme-color-sync';

const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <NextThemesProvider
    attribute={['class', 'data-theme']}
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
    storageKey={themeStorageKey}
  >
    <ThemeColorSync />
    {children}
  </NextThemesProvider>
);

export { ThemeProvider };
