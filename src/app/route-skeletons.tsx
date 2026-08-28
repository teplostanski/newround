import type { ReactNode } from 'react';
import { AllGamesSkeleton } from '@/features/games/all-games-screen/all-games-skeleton';
import { SetupNewGameSkeleton } from '@/features/games/setup-new-game-screen/setup-new-game-skeleton';
import { PlaythroughSkeleton } from '@/features/playthrough/playthrough-skeleton';
import { GameSkeleton } from '@/features/game/game-skeleton';
import { RoundSkeleton } from '@/features/rounds/round-screen/round-skeleton';
import type { RouteKind } from '@/shared/ui/route-loader/route-loader';

export const routeSkeletons = {
  games: <AllGamesSkeleton />,
  newGame: <SetupNewGameSkeleton />,
  playthroughs: <GameSkeleton />,
  playthrough: <PlaythroughSkeleton />,
  round: <RoundSkeleton />,
} satisfies Partial<Record<RouteKind, ReactNode>>;
