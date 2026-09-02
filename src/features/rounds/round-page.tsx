'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RoundScreen } from '@/features/rounds/round-screen/round-screen';
import { RoundSkeleton } from '@/features/rounds/round-screen/round-skeleton';
import { Routes } from '@/shared/lib/routes';
import { toastStorageError } from '@/shared/lib/storage-toast';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { findById, useStore } from '@/shared/model/store';

const RoundPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { games, isReady, playthroughs, rounds, updateScore } = useStore();
  const gameId = searchParams.get('gameId');
  const playthroughId = searchParams.get('playthroughId');
  const roundId = searchParams.get('roundId');
  const game = findById(games, gameId);
  const playthrough = findById(playthroughs, playthroughId);
  const round = findById(rounds, roundId);

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
      return;
    }

    if (!round) {
      router.replace(Routes.Playthrough(game.id, playthrough.id));
    }
  }, [game, isReady, playthrough, round, router]);

  if (!isReady || !game || !playthrough || !round) {
    return <RoundSkeleton />;
  }

  return (
    <RoundScreen
      players={game.players}
      scores={round.scores}
      onChangeScore={async (playerId, score) => {
        try {
          await updateScore(round.id, playerId, score);
        } catch (error) {
          toastStorageError('Не удалось сохранить счёт', error);
        }
      }}
      onFinishRound={() =>
        router.push(Routes.Playthrough(game.id, playthrough.id), {
          transitionTypes: routeTransitionTypes.back,
        })
      }
    />
  );
};

export { RoundPage };
