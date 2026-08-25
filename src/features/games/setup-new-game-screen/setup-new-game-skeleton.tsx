'use client';

import { Fieldset, Skeleton } from '@heroui/react';
import type { ComponentProps } from 'react';

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

const PlayersHintBone = () => <Skeleton className="h-4 w-[70%]" />;

const PlayersFieldsetBone = () => (
  <Fieldset>
    <Fieldset.Legend>
      <PlayersLegendBone />
    </Fieldset.Legend>
    <PlayerNameRowBone />
    <PlayersHintBone />
  </Fieldset>
);

const StartGameBone = () => <Skeleton className="buttonBone" />;

export const SetupNewGameSkeleton = () => (
  <div className="screen">
    <div className="stack">
      <GameNameFieldBone />
      <PlayersFieldsetBone />
      <StartGameBone />
    </div>
  </div>
);
