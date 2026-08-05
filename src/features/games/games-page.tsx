'use client';

import { useRouter } from 'next/navigation';
import { AllGamesScreen } from '@/components/all-games-screen';
import { RouteLoader } from '@/components/route-loader';
import { useIsHydrated } from '@/hooks/use-is-hydrated';
import { routes } from '@/lib/routes';
import { routeTransitionTypes } from '@/lib/view-transitions';
import { useGamesStore } from '@/state/games-store';

export const GamesPage = () => {
  const router = useRouter();
  const { games } = useGamesStore();
  const isHydrated = useIsHydrated();

  if (!isHydrated) {
    return <RouteLoader />;
  }

  return (
    <AllGamesScreen
      games={games}
      onCreateNewGame={() =>
        router.push(routes.newGame, {
          transitionTypes: routeTransitionTypes.forward,
        })
      }
      onOpenGame={(gameId) =>
        router.push(routes.sessions(gameId), {
          transitionTypes: routeTransitionTypes.forward,
        })
      }
    />
  );
};
