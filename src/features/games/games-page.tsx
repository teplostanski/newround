'use client';

import { useRouter } from 'next/navigation';
import { AllGamesScreen } from '@/features/games/all-games-screen/all-games-screen';
import { RouteLoader } from '@/shared/ui/route-loader/route-loader';
import { routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { useGamesStore } from '@/shared/model/games-store';

export const GamesPage = () => {
  const router = useRouter();
  const { games, isReady } = useGamesStore();

  if (!isReady) {
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
        router.push(routes.playthroughs(gameId), {
          transitionTypes: routeTransitionTypes.forward,
        })
      }
    />
  );
};
