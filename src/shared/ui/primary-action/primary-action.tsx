'use client';

import type { ComponentProps } from 'react';
import { Button, Skeleton } from '@heroui/react';
import { cn } from '@/shared/lib/cn';

type PrimaryActionProps = Omit<ComponentProps<typeof Button>, 'fullWidth'>;

const PrimaryAction = ({ className, children, ...props }: PrimaryActionProps) => (
  <Button {...props} className={cn('primaryAction', className)} fullWidth>
    {children}
  </Button>
);

const PrimaryActionBone = () => <Skeleton className="primaryActionBone" />;

export { PrimaryAction, PrimaryActionBone };
