'use client';

import { useDetectDevice } from '@/shared/lib/use-detect-device';
import { Popover, Tooltip } from '@heroui/react';
import { ReactNode } from 'react';

type AppTooltipProps = {
  children: ReactNode;
};

const AppTooltip = ({ children }: AppTooltipProps) => {
  const detected = useDetectDevice();
  const isDesktop = detected.device.isDesktop;

  const text =
    'Данные сохраняются локально на устройстве. Приложение продолжает работать в штатном режиме.';

  return (
    <>
      {isDesktop ? (
        <Tooltip delay={0}>
          <Tooltip.Trigger>{children}</Tooltip.Trigger>
          <Tooltip.Content className="max-w-72 mt-3">
            <p className="m-2 text-sm text-muted">{text}</p>
          </Tooltip.Content>
        </Tooltip>
      ) : (
        <Popover>
          <Popover.Trigger>{children}</Popover.Trigger>
          <Popover.Content className="max-w-72 mt-2">
            <Popover.Dialog>
              <p className="text-sm text-muted">{text}</p>
            </Popover.Dialog>
          </Popover.Content>
        </Popover>
      )}
    </>
  );
};

export { AppTooltip };
