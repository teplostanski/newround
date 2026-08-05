// @ts-check
import { serwist } from '@serwist/next/config';

export default serwist({
  swSrc: 'src/app/sw.ts',
  swDest: 'out/sw.js',
  globDirectory: 'out',
  globPatterns: [
    '**/*.{js,css,html,txt,json,webmanifest,svg,png,ico,woff,woff2}',
  ],
  precachePrerendered: false,
});
