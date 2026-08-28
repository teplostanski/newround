'use client';

import { Card, Skeleton } from '@heroui/react';
import type { ComponentProps } from 'react';
import {
  ListItemCardSkeleton,
  ListItemTextBone,
} from '@/shared/ui/list-item-card/list-item-card-skeleton';

const PLAYTHROUGH_KEYS = [0, 1, 2] as const;

const asSpan = (props: ComponentProps<'span'>) => <span {...props} />;

const GameMetaBone = () => (
  <Card className="w-full">
    <Card.Content>
      <p className="text-muted m-0 text-[0.95rem] font-mono">
        <Skeleton className="inline-block h-[1em] w-[70%]" render={asSpan} />
      </p>
    </Card.Content>
  </Card>
);

const StartPlaythroughBone = () => <Skeleton className="buttonBone" />;

export const GameSkeleton = () => (
  <div className="screen">
    <GameMetaBone />
    <StartPlaythroughBone />
    <ul className="list">
      {PLAYTHROUGH_KEYS.map((key) => (
        <li key={key}>
          <ListItemCardSkeleton
            description={<ListItemTextBone className="w-40" />}
          />
        </li>
      ))}
    </ul>
  </div>
);
