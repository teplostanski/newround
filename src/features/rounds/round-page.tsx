'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RoundScreen } from '@/features/rounds/round-screen/round-screen';
import { RouteLoader } from '@/shared/ui/route-loader/route-loader';
import { routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { findById, useStore } from '@/shared/model/store';

export const RoundPage = () => {
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
      router.replace(routes.games);
      return;
    }

    if (!playthrough) {
      router.replace(routes.playthroughs(game.id));
      return;
    }

    if (!round) {
      router.replace(routes.playthrough(game.id, playthrough.id));
    }
  }, [game, isReady, playthrough, round, router]);

  if (!isReady || !game || !playthrough || !round) {
    return <RouteLoader />;
  }

  return (
    <RoundScreen
      players={game.players}
      scores={round.scores}
      onChangeScore={(playerId, score) =>
        updateScore(round.id, playerId, score)
      }
      onFinishRound={() =>
        router.push(routes.playthrough(game.id, playthrough.id), {
          transitionTypes: routeTransitionTypes.back,
        })
      }
    />
  );
};
