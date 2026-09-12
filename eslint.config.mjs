import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import { createSlopConfig } from 'eslint-plugin-slop';

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  ...createSlopConfig({
    cwd: import.meta.dirname,
    inspection: 'uncommitted',
  }),
  globalIgnores([
    '.astro/**',
    '.heroui-docs/**',
    '.next/**',
    'dist/**',
    'out/**',
    'public/sw.js',
  ]),
]);
