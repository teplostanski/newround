'use client';

import { useEffect } from 'react';

export const ServiceWorkerReset = () => {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'development' ||
      !('serviceWorker' in navigator)
    ) {
      return;
    }

    const resetServiceWorker = async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();

      if (registrations.length === 0) {
        return;
      }

      const controlledByServiceWorker =
        navigator.serviceWorker.controller !== null;

      await Promise.all(
        registrations.map((registration) => registration.unregister()),
      );

      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter((name) => name.toLowerCase().includes('serwist'))
            .map((name) => caches.delete(name)),
        );
      }

      if (controlledByServiceWorker) {
        window.location.reload();
      }
    };

    void resetServiceWorker();
  }, []);

  return null;
};
