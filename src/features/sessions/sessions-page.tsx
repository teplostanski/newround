'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RouteLoader } from '@/shared/ui/route-loader/route-loader';
import { SessionListScreen } from '@/features/sessions/sessions-screen/sessions-screen';
import { findGame } from '@/shared/model/game';
import { useIsHydrated } from '@/shared/lib/use-is-hydrated';
import { routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { useGamesStore } from '@/shared/model/games-store';

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
