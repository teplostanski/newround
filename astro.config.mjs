// @ts-check
import { defineConfig } from 'astro/config';
import readableClassnames from 'vite-plugin-readable-classnames';

import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  vite: { plugins: [readableClassnames()] },
});
