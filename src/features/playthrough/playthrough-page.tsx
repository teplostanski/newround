'use client';

import { useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlaythroughScreen } from '@/features/playthrough/playthrough-screen';
import { PlaythroughSkeleton } from '@/features/playthrough/playthrough-skeleton';
import { Routes } from '@/shared/lib/routes';
import { toastStorageError } from '@/shared/lib/storage-toast';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { findById, useStore } from '@/shared/model/store';

const PlaythroughPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addRound, games, isReady, playthroughs, rounds } = useStore();
  const [, startNavigation] = useTransition();
  const gameId = searchParams.get('gameId');
  const playthroughId = searchParams.get('playthroughId');
  const game = findById(games, gameId);
  const playthrough = findById(playthroughs, playthroughId);
  const playthroughRounds = rounds
    .filter((round) => round.playthroughId === playthroughId)
    .toSorted((left, right) => right.sequenceNumber - left.sequenceNumber);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!game) {
      router.replace(Routes.Root);
      return;
    }

    if (!playthrough) {
      router.replace(Routes.Game(game.id));
    }
  }, [game, isReady, playthrough, router]);

  const handleStartRound = () => {
    if (!game || !playthrough) {
      return;
    }

    startNavigation(() => {
      const result = addRound(game.id, playthrough.id);

      if (!result) {
        toastStorageError('Не удалось начать раунд');
        return;
      }

      const { id, persist } = result;

      router.push(Routes.Round(game.id, playthrough.id, id), {
        transitionTypes: routeTransitionTypes.forward,
      });

      persist.catch((error) => {
        router.replace(Routes.Playthrough(game.id, playthrough.id));
        toastStorageError('Не удалось начать раунд', error);
      });
    });
  };

  if (!isReady || !game || !playthrough) {
    return <PlaythroughSkeleton />;
  }

  return (
    <PlaythroughScreen
      game={game}
      playthrough={playthrough}
      rounds={playthroughRounds}
      onStartRound={handleStartRound}
    />
  );
};

export { PlaythroughPage };
