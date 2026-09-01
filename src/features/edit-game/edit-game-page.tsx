'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EditGameScreen } from './edit-game-screen';
import { EditGameSkeleton } from './edit-game-skeleton';
import { findById, useStore } from '@/shared/model/store';
import type { EditGameData } from '@/shared/model/types';
import { toastStorageDanger } from '@/shared/lib/storage-error';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { Routes } from '@/shared/lib/routes';

const EditGamePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get('gameId');
  const { games, isReady, editGame } = useStore();
  const game = findById(games, gameId);

  useEffect(() => {
    if (isReady && !game) {
      router.replace(Routes.Root);
    }
  }, [game, isReady, router]);

  const handleEditGame = async (data: EditGameData) => {
    if (!game) {
      return;
    }

    try {
      await editGame(data, game.id);

      router.push(Routes.Root, {
        transitionTypes: routeTransitionTypes.forward,
      });
    } catch (error) {
      toastStorageDanger('Не удалось сохранить игру', error);
    }
  };

  if (!isReady || !game) {
    return <EditGameSkeleton />;
  }

  return <EditGameScreen game={game} onEditGame={handleEditGame} />;
};

export { EditGamePage };
