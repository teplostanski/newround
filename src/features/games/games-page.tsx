'use client';

import { GamesScreen } from '@/features/games/games-screen';
import { GamesSkeleton } from '@/features/games/games-skeleton';
import { useStore } from '@/shared/model/store';

const GamesPage = () => {
  const { games, isReady } = useStore();

  if (!isReady) {
    return <GamesSkeleton />;
  }

  return <GamesScreen games={games} />;
};

export { GamesPage };
