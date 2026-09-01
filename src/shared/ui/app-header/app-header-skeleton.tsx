'use client';

import { Skeleton } from '@heroui/react';
import { cn } from '@/shared/lib/cn';
import headerStyles from './app-header.module.css';
import styles from './app-header-skeleton.module.css';

export type TitleSize = 'short' | 'medium' | 'long';

type AppHeaderSkeletonProps = {
  title?: string;
  showBack?: boolean;
  titleSize?: TitleSize;
};

const titleSizeClass = {
  short: styles.titleShort,
  medium: styles.titleMedium,
  long: styles.titleLong,
} as const;

const AppHeaderSkeleton = ({
  title,
  showBack = false,
  titleSize = 'long',
}: AppHeaderSkeletonProps) => (
  <header className={headerStyles.header}>
    <div className={headerStyles.headerBar}>
      <nav className={headerStyles.nav} aria-hidden="true">
        {showBack && <Skeleton className="size-11" />}
        {showBack && <Skeleton className="size-11" />}
      </nav>
      <div className={headerStyles.actions}>
        <Skeleton className="size-11" />
        <Skeleton className="size-11" />
      </div>
    </div>
    {title ? (
      <div className={cn(headerStyles.title, styles.titleSlot)}>
        <span className={styles.titleMeasure}>{title}</span>
        <Skeleton className={styles.titleFill} />
      </div>
    ) : (
      <Skeleton className={cn(styles.titleBone, titleSizeClass[titleSize])} />
    )}
  </header>
);

export { AppHeaderSkeleton };
