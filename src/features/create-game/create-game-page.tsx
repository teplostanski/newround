/* eslint-disable slop/max-comment-length */
'use client';

//import { useRouter } from 'next/navigation';
//import { CreateGameScreen } from './create-game-screen';
//import { CreateGameSkeleton } from './create-game-skeleton';
//import { Routes } from '@/shared/lib/routes';
//import { toastStorageError } from '@/shared/lib/storage-toast';
//import { routeTransitionTypes } from '@/shared/lib/view-transitions';
//import { useStore } from '@/shared/model/store';
//import { ScoringModes } from '@/shared/constants';
//import type { CreateGameData } from '@/shared/model/types';
import { Alert } from '@heroui/react';

const CreateGamePage = () => {
  //const router = useRouter();
  //const { createGame, isReady } = useStore();

  //const handleCreateGame = async (data: CreateGameData) => {
  //  try {
  //    const created = await createGame(data);

  //    if (!created) {
  //      toastStorageError('Не удалось создать игру');
  //      return;
  //    }

  //    const nextRoute =
  //      created.scoringMode === ScoringModes.Rounds
  //        ? Routes.Round(created.gameId, created.playthroughId, created.roundId)
  //        : Routes.Playthrough(created.gameId, created.playthroughId);

  //    router.push(nextRoute, {
  //      transitionTypes: routeTransitionTypes.forward,
  //    });
  //  } catch (error) {
  //    toastStorageError('Не удалось создать игру', error);
  //  }
  //};

  //if (!isReady) {
  //  return <CreateGameSkeleton />;
  //}

  //return <CreateGameScreen onCreateGame={handleCreateGame} />;
  return (
    <Alert status='danger'>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Временно недоступно</Alert.Title>
      </Alert.Content>
    </Alert>
  );
};

export { CreateGamePage };
