'use client';

import { Card, Skeleton } from '@heroui/react';
import type { ComponentProps } from 'react';

const ROUND_KEYS = [0, 1, 2] as const;

const asSpan = (props: ComponentProps<'span'>) => <span {...props} />;

const PlaythroughMetaBone = () => (
  <Card className="w-full">
    <Card.Content>
      <p className="text-muted m-0 text-[0.95rem]">
        <Skeleton className="inline-block h-[1em] w-[90%]" render={asSpan} />
      </p>
    </Card.Content>
  </Card>
);

const StartRoundBone = () => <Skeleton className="buttonBone" />;

const RoundCardBone = () => (
  <Card className="w-full">
    <Card.Header>
      <Card.Title>
        <Skeleton className="inline-block h-[1em] w-20" render={asSpan} />
      </Card.Title>
      <Card.Description>
        <Skeleton className="inline-block h-[1em] w-full" render={asSpan} />
      </Card.Description>
    </Card.Header>
  </Card>
);

export const PlaythroughSkeleton = () => (
  <div className="screen">
    <PlaythroughMetaBone />
    <StartRoundBone />
    <ul className="list">
      {ROUND_KEYS.map((key) => (
        <li key={key}>
          <RoundCardBone />
        </li>
      ))}
    </ul>
  </div>
);
