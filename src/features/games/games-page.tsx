'use client';

import { AllGamesScreen } from '@/features/games/all-games-screen/all-games-screen';
import { RouteLoader } from '@/shared/ui/route-loader/route-loader';
import { useStore } from '@/shared/model/store';

export const GamesPage = () => {
  const { games, isReady } = useStore();

  if (!isReady) {
    return <RouteLoader />;
  }

  return <AllGamesScreen games={games} />;
};
