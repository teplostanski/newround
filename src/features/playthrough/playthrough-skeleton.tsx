'use client';

import { Card, Chip, Skeleton } from '@heroui/react';
import type { ComponentProps } from 'react';
import {
  ListItemCardSkeleton,
  ListItemTextBone,
} from '@/shared/ui/list-item-card/list-item-card-skeleton';

const ROUND_KEYS = [0, 1, 2] as const;
const CHIP_NAMES = ['Игрок 1', 'Игрок 2', 'Игрок 3', 'Игрок 4'] as const;

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

const RoundChipBone = ({ name }: { name: string }) => (
  <Chip variant="soft" size="md" className="relative overflow-hidden px-2">
    <span className="invisible">
      {name} ·{' '}
      <span className="font-mono">0</span>
    </span>
    <Skeleton className="absolute inset-0" />
  </Chip>
);

const RoundChipsBone = () => (
  <ul className="flex flex-row flex-wrap gap-2">
    {CHIP_NAMES.map((name) => (
      <li key={name}>
        <RoundChipBone name={name} />
      </li>
    ))}
  </ul>
);

export const PlaythroughSkeleton = () => (
  <div className="screen">
    <PlaythroughMetaBone />
    <StartRoundBone />
    <ul className="list">
      {ROUND_KEYS.map((key) => (
        <li key={key}>
          <ListItemCardSkeleton
            title={<ListItemTextBone className="w-20" />}
            content={<RoundChipsBone />}
          />
        </li>
      ))}
    </ul>
  </div>
);
