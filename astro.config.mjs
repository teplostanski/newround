// @ts-check
import { defineConfig } from 'astro/config';
import readableClassnames from 'vite-plugin-readable-classnames';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://tablo.teplostanski.me',
  integrations: [react()],
  vite: { plugins: [readableClassnames()] },
});
