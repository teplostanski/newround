'use client';

import { Skeleton } from '@heroui/react';
import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import styles from './skeleton-bone.module.css';

type SkeletonBoneProps = {
  children: ReactNode;
  block?: boolean;
  className?: string;
};

const SkeletonBone = ({
  children,
  block = false,
  className,
}: SkeletonBoneProps) => (
  <span className={cn(styles.slot, block && styles.block, className)}>
    <span className={styles.mirror}>{children}</span>
    <Skeleton className={styles.overlay} />
  </span>
);

export { SkeletonBone };
