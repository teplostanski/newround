// @ts-check
import { serwist } from '@serwist/next/config';

/**
 * @serwist/next maps root `index.html` → `/index` instead of `/`.
 * Remap after the built-in transform so `/` is what gets precached.
 *
 * @param {import('@serwist/build').ManifestEntry[]} manifestEntries
 */
const remapRootIndex = (manifestEntries) => ({
  manifest: manifestEntries.map((entry) =>
    entry.url === '/index' ? { ...entry, url: '/' } : entry,
  ),
  warnings: /** @type {string[]} */ ([]),
});

export default serwist({
  swSrc: 'src/app/sw.ts',
  swDest: 'out/sw.js',
  globDirectory: 'out',
  globPatterns: [
    '**/*.{js,css,html,txt,json,webmanifest,svg,png,ico,woff,woff2}',
  ],
  precachePrerendered: false,
}).then((base) => ({
  ...base,
  manifestTransforms: [...(base.manifestTransforms ?? []), remapRootIndex],
}));
