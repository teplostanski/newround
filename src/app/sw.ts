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
    ignoreURLParametersMatching: [/.*/],
    urlManipulation: ({ url }) => {
      const alternateUrl = new URL(url);
      alternateUrl.search = '';

      if (alternateUrl.pathname === '/') {
        const indexAlias = new URL(alternateUrl);
        indexAlias.pathname = '/index';
        return [indexAlias];
      }

      alternateUrl.pathname = alternateUrl.pathname.endsWith('/')
        ? alternateUrl.pathname.slice(0, -1)
        : `${alternateUrl.pathname}/`;

      return [alternateUrl];
    },
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: '/~offline/',
        matcher: ({ request }) => request.destination === 'document',
      },
    ],
  },
});

serwist.registerCapture(
  ({ url }) => url.origin === self.location.origin,
  async ({ request }) => {
    const url = new URL(request.url);
    url.search = '';
    const alternateUrl = new URL(url);

    if (alternateUrl.pathname === '/') {
      alternateUrl.pathname = '/index';
    } else {
      alternateUrl.pathname = alternateUrl.pathname.endsWith('/')
        ? alternateUrl.pathname.slice(0, -1)
        : `${alternateUrl.pathname}/`;
    }

    for (const candidate of [url, alternateUrl]) {
      const cachedResponse = await caches.match(candidate, {
        ignoreSearch: true,
      });

      if (cachedResponse) {
        return new Response(null, {
          status: cachedResponse.status,
          statusText: cachedResponse.statusText,
          headers: cachedResponse.headers,
        });
      }
    }

    return fetch(request);
  },
  'HEAD',
);

serwist.addEventListeners();
