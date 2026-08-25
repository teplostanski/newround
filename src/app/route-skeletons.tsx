import type { ReactNode } from 'react';
import { AllGamesSkeleton } from '@/features/games/all-games-screen/all-games-skeleton';
import { SetupNewGameSkeleton } from '@/features/games/setup-new-game-screen/setup-new-game-skeleton';
import { PlaythroughSkeleton } from '@/features/playthroughs/playthrough-screen/playthrough-skeleton';
import { PlaythroughsSkeleton } from '@/features/playthroughs/playthroughs-screen/playthroughs-skeleton';
import { RoundSkeleton } from '@/features/rounds/round-screen/round-skeleton';
import type { RouteKind } from '@/shared/ui/route-loader/route-loader';

export const routeSkeletons: Partial<Record<RouteKind, ReactNode>> = {
  games: <AllGamesSkeleton />,
  newGame: <SetupNewGameSkeleton />,
  playthroughs: <PlaythroughsSkeleton />,
  playthrough: <PlaythroughSkeleton />,
  round: <RoundSkeleton />,
};
