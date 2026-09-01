'use client';

import { useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlaythroughScreen } from '@/features/playthrough/playthrough-screen';
import { PlaythroughSkeleton } from '@/features/playthrough/playthrough-skeleton';
import { Routes } from '@/shared/lib/routes';
import { toastStorageDanger } from '@/shared/lib/storage-error';
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

    startNavigation(async () => {
      try {
        const roundId = await addRound(game.id, playthrough.id);

        if (!roundId) {
          toastStorageDanger('Не удалось начать раунд');
          return;
        }

        router.push(Routes.Round(game.id, playthrough.id, roundId), {
          transitionTypes: routeTransitionTypes.forward,
        });
      } catch (error) {
        toastStorageDanger('Не удалось начать раунд', error);
      }
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
