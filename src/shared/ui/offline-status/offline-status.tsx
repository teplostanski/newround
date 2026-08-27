'use client';

import { useOnlineStatus } from '@/shared/lib/use-online-status';
import { Chip } from '@heroui/react';

const OfflineStatus = () => {
  const isOnline = useOnlineStatus();

  return (
    <>
      {!isOnline && <Chip>Offline</Chip>}
    </>
  );
};

export { OfflineStatus };
