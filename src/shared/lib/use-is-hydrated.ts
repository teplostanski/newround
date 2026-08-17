'use client';

import { startTransition, useEffect, useState } from 'react';

let hasHydrated = false;

export const useIsHydrated = () => {
  const [isHydrated, setIsHydrated] = useState(hasHydrated);

  useEffect(() => {
    hasHydrated = true;

    startTransition(() => setIsHydrated(true));
  }, []);

  return isHydrated;
};
