'use client';

import { Card, Skeleton } from '@heroui/react';
import type { ComponentProps } from 'react';

const PLAYTHROUGH_KEYS = [0, 1, 2] as const;

const asSpan = (props: ComponentProps<'span'>) => <span {...props} />;

const PlaythroughCardBone = () => (
  <Card className="w-full">
    <Card.Header>
      <Card.Title>
        <Skeleton className="inline-block h-[1em] w-24" render={asSpan} />
      </Card.Title>
      <Card.Description>
        <Skeleton className="inline-block h-[1em] w-40" render={asSpan} />
      </Card.Description>
    </Card.Header>
  </Card>
);

export const PlaythroughsSkeleton = () => (
  <div className="screen">
    <ul className="list">
      {PLAYTHROUGH_KEYS.map((key) => (
        <li key={key}>
          <PlaythroughCardBone />
        </li>
      ))}
    </ul>
  </div>
);
