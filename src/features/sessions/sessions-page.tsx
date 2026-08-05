'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RouteLoader } from '@/components/route-loader';
import { SessionListScreen } from '@/components/sessions-screen';
import { findGame } from '@/domain/game';
import { useIsHydrated } from '@/hooks/use-is-hydrated';
import { routes } from '@/lib/routes';
import { routeTransitionTypes } from '@/lib/view-transitions';
import { useGamesStore } from '@/state/games-store';

export const SessionsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { games } = useGamesStore();
  const isHydrated = useIsHydrated();
  const gameId = searchParams?.get('gameId') ?? null;
  const game = findGame(games, gameId);

  useEffect(() => {
    if (isHydrated && !game) {
      router.replace(routes.games);
    }
  }, [game, isHydrated, router]);

  if (!isHydrated || !game) {
    return <RouteLoader />;
  }

  return (
    <SessionListScreen
      game={game}
      onOpenSession={(sessionId) =>
        router.push(routes.session(game.id, sessionId), {
          transitionTypes: routeTransitionTypes.forward,
        })
      }
    />
  );
};
