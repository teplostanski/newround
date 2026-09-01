// @ts-check
import { serwist } from '@serwist/next/config';

const remapRootIndex = (/** @type {import('@serwist/build').ManifestEntry[]} */ manifestEntries) => ({
  manifest: manifestEntries.map((entry) =>
    entry.url === '/index' || entry.url === 'index'
      ? { ...entry, url: '/' }
      : entry,
  ),
  warnings: /** @type {string[]} */ ([]),
});

const ensureLeadingSlash = (/** @type {import('@serwist/build').ManifestEntry[]} */ manifestEntries) => ({
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

const dropInternalNotFound = (/** @type {import('@serwist/build').ManifestEntry[]} */ manifestEntries) => ({
  manifest: manifestEntries.filter((entry) => {
    const url = entry.url.replace(/^\//, '');
    return url !== '_not-found' && url !== '_not-found/' && !url.startsWith('_not-found/');
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
    '_not-found/**',
  ],
  precachePrerendered: false,
}).then((base) => ({
  ...base,
  manifestTransforms: [
    ...(base.manifestTransforms ?? []),
    remapRootIndex,
    ensureLeadingSlash,
    dropInternalNotFound,
  ],
}));
