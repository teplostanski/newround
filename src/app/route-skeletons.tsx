import type { ReactNode } from 'react';
import { GamesSkeleton } from '@/features/games/games-skeleton';
import { CreateGameSkeleton } from '@/features/create-game/create-game-skeleton';
import { EditGameSkeleton } from '@/features/edit-game/edit-game-skeleton';
import { PlaythroughSkeleton } from '@/features/playthrough/playthrough-skeleton';
import { GameSkeleton } from '@/features/game/game-skeleton';
import { ScoreSkeleton } from '@/shared/ui/score-screen/score-skeleton';
import type { RouteKind } from '@/shared/ui/route-loader/route-loader';

export const routeSkeletons = {
  root: <GamesSkeleton />,
  createGame: <CreateGameSkeleton />,
  editGame: <EditGameSkeleton />,
  game: <GameSkeleton />,
  playthrough: <PlaythroughSkeleton />,
  round: <ScoreSkeleton />,
} satisfies Partial<Record<RouteKind, ReactNode>>;
