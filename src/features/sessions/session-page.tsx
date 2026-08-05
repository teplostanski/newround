'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RouteLoader } from '@/components/route-loader';
import { SessionScreen } from '@/components/session-screen';
import {
  findGame,
  findSession,
  type Game,
  type Session,
} from '@/domain/game';
import { useIsHydrated } from '@/hooks/use-is-hydrated';
import { routes } from '@/lib/routes';
import { routeTransitionTypes } from '@/lib/view-transitions';
import { useGamesStore } from '@/state/games-store';

export const SessionPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { games, addRound } = useGamesStore();
  const isHydrated = useIsHydrated();
  const [, startNavigation] = useTransition();
  const [navigationSnapshot, setNavigationSnapshot] = useState<{
    game: Game;
    session: Session;
  } | null>(null);
  const gameId = searchParams?.get('gameId') ?? null;
  const sessionId = searchParams?.get('sessionId') ?? null;
  const game = findGame(games, gameId);
  const session = findSession(game, sessionId);

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
    }
  }, [game, isHydrated, router, session]);

  const handleStartRound = () => {
    if (!game || !session) {
      return;
    }

    setNavigationSnapshot({ game, session });

    startNavigation(() => {
      const roundId = addRound(game.id, session.id);

      if (roundId) {
        router.push(routes.round(game.id, session.id, roundId), {
          transitionTypes: routeTransitionTypes.forward,
        });
      } else {
        setNavigationSnapshot(null);
      }
    });
  };

  if (!isHydrated || !game || !session) {
    return <RouteLoader />;
  }

  const visibleGame = navigationSnapshot?.game ?? game;
  const visibleSession = navigationSnapshot?.session ?? session;

  return (
    <SessionScreen
      game={visibleGame}
      session={visibleSession}
      onStartRound={handleStartRound}
      onOpenRound={(roundId) =>
        router.push(
          routes.round(visibleGame.id, visibleSession.id, roundId),
          { transitionTypes: routeTransitionTypes.forward },
        )
      }
    />
  );
};
