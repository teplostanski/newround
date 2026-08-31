'use client';

import { Fieldset, Separator, Skeleton } from '@heroui/react';
import type { ComponentProps } from 'react';
import { PrimaryActionBone } from '@/shared/ui/primary-action/primary-action';

const asSpan = (props: ComponentProps<'span'>) => <span {...props} />;

const GameNameFieldBone = () => <Skeleton className="h-11 w-full" />;

const PlayersLegendBone = () => (
  <Skeleton className="inline-block h-4 w-24" render={asSpan} />
);

const PlayerNameRowBone = () => (
  <div className="row">
    <Skeleton className="h-11 min-w-0 flex-1" />
    <Skeleton className="size-11 shrink-0" />
  </div>
);

const PlayersHintBone = () => (
  <p className="empty">
    <Skeleton className="inline-block h-[1em] w-[70%]" render={asSpan} />
  </p>
);

const PlayersFieldsetBone = () => (
  <Fieldset>
    <Fieldset.Legend>
      <PlayersLegendBone />
    </Fieldset.Legend>
    <Separator className="mt-2" />
    <PlayerNameRowBone />
    <PlayersHintBone />
  </Fieldset>
);

const StartGameBone = () => <PrimaryActionBone />;

export const SetupNewGameSkeleton = () => (
  <div className="screen">
    <div className="stack">
      <GameNameFieldBone />
      <PlayersFieldsetBone />
      <StartGameBone />
    </div>
  </div>
);
