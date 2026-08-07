// @ts-check
import { serwist } from '@serwist/next/config';

/**
 * @serwist/next maps root `index.html` → `/index` instead of `/` when the
 * file is globbed as `index.html` (no leading slash / directory prefix).
 * Remap so navigation to `/` hits the precache.
 *
 * @param {import('@serwist/build').ManifestEntry[]} manifestEntries
 */
const remapRootIndex = (manifestEntries) => ({
  manifest: manifestEntries.map((entry) =>
    entry.url === '/index' || entry.url === 'index'
      ? { ...entry, url: '/' }
      : entry,
  ),
  warnings: /** @type {string[]} */ ([]),
});

/**
 * Globbed files from `out/` often lack a leading slash (`games/index.txt`).
 * Normalize so precache keys match browser request URLs consistently.
 *
 * @param {import('@serwist/build').ManifestEntry[]} manifestEntries
 */
const ensureLeadingSlash = (manifestEntries) => ({
  manifest: manifestEntries.map((entry) => {
    if (
      entry.url.startsWith('/') ||
      entry.url.startsWith('http://') ||
      entry.url.startsWith('https://')
    ) {
      return entry;
    }

    return { ...entry, url: `/${entry.url}` };
  }),
  warnings: /** @type {string[]} */ ([]),
});

/**
 * Drop HTTP-404 shells. Precaching them breaks SW install on hosts that
 * serve these paths with status 404 (e.g. GitHub Pages).
 *
 * @param {import('@serwist/build').ManifestEntry[]} manifestEntries
 */
const dropErrorPages = (manifestEntries) => ({
  manifest: manifestEntries.filter((entry) => {
    const url = entry.url.replace(/^\//, '');
    return (
      url !== '404' &&
      url !== '404/' &&
      url !== '404.html' &&
      !url.startsWith('404/') &&
      url !== '_not-found' &&
      url !== '_not-found/' &&
      !url.startsWith('_not-found/')
    );
  }),
  warnings: /** @type {string[]} */ ([]),
});

export default serwist({
  swSrc: 'src/app/sw.ts',
  swDest: 'out/sw.js',
  globDirectory: 'out',
  globPatterns: [
    '**/*.{js,css,html,txt,json,webmanifest,svg,png,ico,woff,woff2}',
  ],
  globIgnores: [
    'sw.js',
    'sw.js.map',
    '404.html',
    '404/**',
    '_not-found/**',
  ],
  precachePrerendered: false,
}).then((base) => ({
  ...base,
  manifestTransforms: [
    ...(base.manifestTransforms ?? []),
    remapRootIndex,
    ensureLeadingSlash,
    dropErrorPages,
  ],
}));
