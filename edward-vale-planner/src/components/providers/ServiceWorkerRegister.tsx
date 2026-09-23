'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Non-fatal: the app works fine without the service worker, it just
        // loses offline caching and background push delivery.
      });
    }
  }, []);

  return null;
}
