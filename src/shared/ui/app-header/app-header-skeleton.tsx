'use client';

import { Skeleton } from '@heroui/react';
import styles from './app-header.module.css';

export type BrandSize = 'short' | 'medium' | 'long';

type AppHeaderSkeletonProps = {
  title?: string;
  showBack?: boolean;
  brandSize?: BrandSize;
};

const brandSizeClass = {
  short: styles.brandShort,
  medium: styles.brandMedium,
  long: styles.brandLong,
} as const;

export const AppHeaderSkeleton = ({
  title,
  showBack = false,
  brandSize = 'long',
}: AppHeaderSkeletonProps) => (
  <header className={styles.header}>
    <div className={styles.headerBar}>
      <nav className={styles.nav} aria-hidden="true">
        {showBack && <Skeleton className="size-11" />}
        {showBack && <Skeleton className="size-11" />}
      </nav>
      <div className={styles.actions}>
        <Skeleton className={styles.themeSwitchBone} />
        <Skeleton className="size-11" />
        <Skeleton className="size-11" />
      </div>
    </div>
    {title ? (
      <div className={`${styles.brand} ${styles.brandSlot}`}>
        <span className={styles.brandMeasure}>{title}</span>
        <Skeleton className={styles.brandFill} />
      </div>
    ) : (
      <Skeleton className={`${styles.brandBone} ${brandSizeClass[brandSize]}`} />
    )}
  </header>
);
