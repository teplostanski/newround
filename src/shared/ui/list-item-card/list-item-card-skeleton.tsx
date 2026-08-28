'use client';

import type { ComponentProps, ReactNode } from 'react';
import { Card, Skeleton } from '@heroui/react';
import { cn } from '@/shared/lib/cn';
import styles from './list-item-card.module.css';

const asSpan = (props: ComponentProps<'span'>) => <span {...props} />;

type ListItemTextBoneProps = {
  className: string;
};

const ListItemTextBone = ({ className }: ListItemTextBoneProps) => (
  <span className="flex h-lh items-center">
    <Skeleton className={cn('h-[1em]', className)} render={asSpan} />
  </span>
);

const DefaultActionBone = () => (
  <Skeleton className="size-6 rounded-xl" />
);

type ListItemCardSkeletonProps = {
  title?: ReactNode;
  description?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  action?: ReactNode;
};

const ListItemCardSkeleton = ({
  title = <ListItemTextBone className="w-24" />,
  description,
  content,
  footer,
  action = <DefaultActionBone />,
}: ListItemCardSkeletonProps) => (
  <Card className={styles.card}>
    <div className={styles.main}>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
        {description && <Card.Description>{description}</Card.Description>}
      </Card.Header>
      {content && <Card.Content>{content}</Card.Content>}
      {footer && <Card.Footer>{footer}</Card.Footer>}
    </div>
    {action && <div className={styles.action}>{action}</div>}
  </Card>
);

export { ListItemCardSkeleton, ListItemTextBone };
