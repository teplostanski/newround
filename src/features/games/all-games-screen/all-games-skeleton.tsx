'use client';

import { Skeleton } from '@heroui/react';
import {
  ListItemCardSkeleton,
  ListItemTextBone,
} from '@/shared/ui/list-item-card/list-item-card-skeleton';

const GAME_KEYS = [0, 1, 2] as const;

const NewGameCtaBone = () => <Skeleton className="buttonBone" />;

export const AllGamesSkeleton = () => (
  <div className="screen">
    <NewGameCtaBone />
    <ul className="list">
      {GAME_KEYS.map((key) => (
        <li key={key}>
          <ListItemCardSkeleton
            description={<ListItemTextBone className="w-20" />}
          />
        </li>
      ))}
    </ul>
  </div>
);
