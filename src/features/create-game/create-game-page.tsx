'use client';

import { useRouter } from 'next/navigation';
import { CreateGameScreen } from './create-game-screen';
import { CreateGameSkeleton } from './create-game-skeleton';
import { Routes } from '@/shared/lib/routes';
import { toastStorageError } from '@/shared/lib/storage-toast';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { useStore } from '@/shared/model/store';
import type { CreateGameData } from '@/shared/model/types';

const CreateGamePage = () => {
  const router = useRouter();
  const { createGame, isReady } = useStore();

  const handleCreateGame = async (data: CreateGameData) => {
    try {
      const created = await createGame(data);

      if (!created) {
        toastStorageError('Не удалось создать игру');
        return;
      }

      router.push(
        Routes.Round(created.gameId, created.playthroughId, created.roundId),
        {
          transitionTypes: routeTransitionTypes.forward,
        },
      );
    } catch (error) {
      toastStorageError('Не удалось создать игру', error);
    }
  };

  if (!isReady) {
    return <CreateGameSkeleton />;
  }

  return <CreateGameScreen onCreateGame={handleCreateGame} />;
};

export { CreateGamePage };
