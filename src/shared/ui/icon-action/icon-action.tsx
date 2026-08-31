'use client';

import type { ComponentProps } from 'react';
import { Button } from '@heroui/react';
import { cn } from '@/shared/lib/cn';

type IconActionProps = Omit<
  ComponentProps<typeof Button>,
  'isIconOnly' | 'variant'
>;

const IconAction = ({ className, children, ...props }: IconActionProps) => (
  <Button
    {...props}
    isIconOnly
    variant="secondary"
    className={cn('iconAction', className)}
  >
    {children}
  </Button>
);

export { IconAction };
