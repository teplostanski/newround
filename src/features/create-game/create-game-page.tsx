'use client';

import { useRouter } from 'next/navigation';
import { CreateGameScreen } from './create-game-screen';
import { CreateGameSkeleton } from './create-game-skeleton';
import { Routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { useStore } from '@/shared/model/store';
import type { CreateGameData } from '@/shared/model/types';

const CreateGamePage = () => {
  const router = useRouter();
  const { createGame, isReady } = useStore();

  const handleCreateGame = (data: CreateGameData) => {
    const { gameId, playthroughId } = createGame(data);
    router.push(Routes.Playthrough(gameId, playthroughId), {
      transitionTypes: routeTransitionTypes.forward,
    });
  };

  if (!isReady) {
    return <CreateGameSkeleton />;
  }

  return <CreateGameScreen onCreateGame={handleCreateGame} />;
};

export { CreateGamePage };
