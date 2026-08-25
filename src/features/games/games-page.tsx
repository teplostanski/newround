'use client';

import { AllGamesScreen } from '@/features/games/all-games-screen/all-games-screen';
import { AllGamesSkeleton } from '@/features/games/all-games-screen/all-games-skeleton';
import { useStore } from '@/shared/model/store';

export const GamesPage = () => {
  const { games, isReady } = useStore();

  if (!isReady) {
    return <AllGamesSkeleton />;
  }

  return <AllGamesScreen games={games} />;
};
