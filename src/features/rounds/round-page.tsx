'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RouteLoader } from '@/shared/ui/route-loader/route-loader';
import { RoundScreen } from '@/features/rounds/round-screen/round-screen';
import { findGame, findRound, findSession } from '@/shared/model/game';
import { useIsHydrated } from '@/shared/lib/use-is-hydrated';
import { routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { useGamesStore } from '@/shared/model/games-store';

export const RoundPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { games, updateScore } = useGamesStore();
  const isHydrated = useIsHydrated();
  const gameId = searchParams?.get('gameId') ?? null;
  const sessionId = searchParams?.get('sessionId') ?? null;
  const roundId = searchParams?.get('roundId') ?? null;
  const game = findGame(games, gameId);
  const session = findSession(game, sessionId);
  const round = findRound(session, roundId);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!game) {
      router.replace(routes.games);
      return;
    }

    if (!session) {
      router.replace(routes.sessions(game.id));
      return;
    }

    if (!round) {
      router.replace(routes.session(game.id, session.id));
    }
  }, [game, isHydrated, round, router, session]);

  if (!isHydrated || !game || !session || !round) {
    return <RouteLoader />;
  }

  return (
    <RoundScreen
      players={game.players}
      scores={round.scores}
      onChangeScore={(playerId, score) =>
        updateScore(game.id, session.id, round.id, playerId, score)
      }
      onFinishRound={() =>
        router.push(routes.session(game.id, session.id), {
          transitionTypes: routeTransitionTypes.back,
        })
      }
    />
  );
};
