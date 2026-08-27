'use client';

import { useOnlineStatus } from '@/shared/lib/use-online-status';
import { Chip } from '@heroui/react';
import { AppTooltip } from '../app-tooltip/app-tooltip';

const OfflineStatus = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <AppTooltip>
      <Chip className='cursor-pointer select-none'>Offline</Chip>
    </AppTooltip>
  );
};

export { OfflineStatus };
