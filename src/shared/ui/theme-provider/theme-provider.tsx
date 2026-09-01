'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { themeStorageKey } from '@/shared/lib/theme';

const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <NextThemesProvider
    attribute={['class', 'data-theme']}
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
    storageKey={themeStorageKey}
  >
    {children}
  </NextThemesProvider>
);

export { ThemeProvider };
