import type { ReactNode } from 'react';
import { GamesSkeleton } from '@/features/games/games-skeleton';
import { CreateGameSkeleton } from '@/features/create-game/create-game-skeleton';
import { EditGameSkeleton } from '@/features/edit-game/edit-game-skeleton';
import { PlaythroughSkeleton } from '@/features/playthrough/playthrough-skeleton';
import { GameSkeleton } from '@/features/game/game-skeleton';
import { RoundSkeleton } from '@/features/rounds/round-screen/round-skeleton';
import type { RouteKind } from '@/shared/ui/route-loader/route-loader';

export const routeSkeletons = {
  root: <GamesSkeleton />,
  createGame: <CreateGameSkeleton />,
  editGame: <EditGameSkeleton />,
  game: <GameSkeleton />,
  playthrough: <PlaythroughSkeleton />,
  round: <RoundSkeleton />,
} satisfies Partial<Record<RouteKind, ReactNode>>;
