'use client';

import { Card, Skeleton } from '@heroui/react';
import type { ComponentProps } from 'react';

const GAME_KEYS = [0, 1, 2] as const;

const asSpan = (props: ComponentProps<'span'>) => <span {...props} />;

const NewGameCtaBone = () => <Skeleton className="buttonBone" />;

const GameCardBone = () => (
  <Card className="w-full">
    <Card.Header>
      <Card.Title>
        <Skeleton className="inline-block h-[1em] w-24" render={asSpan} />
      </Card.Title>
      <Card.Description>
        <Skeleton className="inline-block h-[1em] w-20" render={asSpan} />
      </Card.Description>
    </Card.Header>
  </Card>
);

export const AllGamesSkeleton = () => (
  <div className="screen">
    <NewGameCtaBone />
    <ul className="list">
      {GAME_KEYS.map((key) => (
        <li key={key}>
          <GameCardBone />
        </li>
      ))}
    </ul>
  </div>
);
