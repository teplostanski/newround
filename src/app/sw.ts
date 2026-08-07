/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    // Query params identify client state (gameId/sessionId); shell HTML is shared.
    ignoreURLParametersMatching: [/.*/],
    // Manifest already uses trailing-slash directory URLs (`/games/`).
    directoryIndex: null,
    cleanURLs: false,
    cleanupOutdatedCaches: true,
    concurrency: 20,
    // Prefer cache for precached URLs; do not fall through to network offline.
    fallbackToNetwork: false,
  },
  skipWaiting: true,
  clientsClaim: true,
  // Navigation preload races the network and breaks offline reloads.
  navigationPreload: false,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
