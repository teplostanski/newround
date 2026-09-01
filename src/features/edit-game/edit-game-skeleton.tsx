'use client';

import { Skeleton } from '@heroui/react';
import type { ComponentProps } from 'react';
import { PrimaryActionBone } from '@/shared/ui/primary-action/primary-action';

const asSpan = (props: ComponentProps<'span'>) => <span {...props} />;

const GameNameLabelBone = () => (
  <Skeleton className="inline-block h-4 w-32" render={asSpan} />
);

const GameNameFieldBone = () => <Skeleton className="h-11 w-full" />;

const SaveBone = () => <PrimaryActionBone />;

const EditGameSkeleton = () => (
  <div className="screen">
    <div className="stack">
      <div className="flex w-full flex-col gap-2">
        <GameNameLabelBone />
        <GameNameFieldBone />
      </div>
      <SaveBone />
    </div>
  </div>
);

export { EditGameSkeleton };
