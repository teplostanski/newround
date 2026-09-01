'use client';

import { useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GameScreen } from '@/features/game/game-screen';
import { GameSkeleton } from '@/features/game/game-skeleton';
import { Routes } from '@/shared/lib/routes';
import { findById, useStore } from '@/shared/model/store';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';

const GamePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { games, isReady, playthroughs, addPlaythrough } = useStore();
  const [, startNavigation] = useTransition();
  const gameId = searchParams.get('gameId');
  const game = findById(games, gameId);

  useEffect(() => {
    if (isReady && !game) {
      router.replace(Routes.Root);
    }
  }, [game, isReady, router]);

  if (!isReady || !game) {
    return <GameSkeleton />;
  }

  const gamePlaythroughs = playthroughs
    .filter((playthrough) => playthrough.gameId === game.id)
    .toSorted((left, right) => right.sequenceNumber - left.sequenceNumber);

  const handleStartPlaythrough = () => {
    if (!game) {
      return;
    }

    startNavigation(() => {
      const playthroughId = addPlaythrough(game.id);

      if (!playthroughId) {
        return;
      }

      router.push(Routes.Playthrough(game.id, playthroughId), {
        transitionTypes: routeTransitionTypes.forward,
      });
    });
  };

  return (
    <GameScreen
      game={game}
      playthroughs={gamePlaythroughs}
      onStartPlaythrough={handleStartPlaythrough}
    />
  );
};

export { GamePage };
