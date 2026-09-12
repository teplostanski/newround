'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { darkThemeColor, lightThemeColor } from '@/shared/lib/theme';

const ThemeColorSync = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) {
      return;
    }

    const color =
      resolvedTheme === 'dark' ? darkThemeColor : lightThemeColor;

    for (const meta of document.querySelectorAll(
      'meta[name="theme-color"]',
    )) {
      if (!meta.hasAttribute('data-ui-theme')) {
        const media = meta.getAttribute('media') ?? '';
        const content = meta.getAttribute('content') ?? '';
        const isDark =
          media.includes('dark') || content === darkThemeColor;
        meta.setAttribute('data-ui-theme', isDark ? 'dark' : 'light');
      }

      const isDarkMeta = meta.getAttribute('data-ui-theme') === 'dark';
      const isActive =
        resolvedTheme === 'dark' ? isDarkMeta : !isDarkMeta;

      meta.setAttribute('media', isActive ? 'all' : 'not all');

      if (isActive) {
        meta.setAttribute('content', color);
      }
    }
  }, [resolvedTheme]);

  return null;
};

export { ThemeColorSync };
