'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlaythroughListScreen } from '@/features/playthroughs/playthroughs-screen/playthroughs-screen';
import { RouteLoader } from '@/shared/ui/route-loader/route-loader';
import { routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { findById, useGamesStore } from '@/shared/model/games-store';

export const PlaythroughsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { games, isReady, playthroughs } = useGamesStore();
  const gameId = searchParams.get('gameId');
  const game = findById(games, gameId);

  useEffect(() => {
    if (isReady && !game) {
      router.replace(routes.games);
    }
  }, [game, isReady, router]);

  if (!isReady || !game) {
    return <RouteLoader />;
  }

  const gamePlaythroughs = playthroughs
    .filter((playthrough) => playthrough.gameId === game.id)
    .toSorted((left, right) => left.sequenceNumber - right.sequenceNumber);

  return (
    <PlaythroughListScreen
      playthroughs={gamePlaythroughs}
      onOpenPlaythrough={(playthroughId) =>
        router.push(routes.playthrough(game.id, playthroughId), {
          transitionTypes: routeTransitionTypes.forward,
        })
      }
    />
  );
};
