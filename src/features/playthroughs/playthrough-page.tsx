'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlaythroughScreen } from '@/features/playthroughs/playthrough-screen/playthrough-screen';
import { RouteLoader } from '@/shared/ui/route-loader/route-loader';
import { routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { findById, useStore } from '@/shared/model/store';
import type { Game, Playthrough, Round } from '@/shared/model/types';

type NavigationSnapshot = {
  game: Game;
  playthrough: Playthrough;
  rounds: Round[];
};

export const PlaythroughPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addRound, games, isReady, playthroughs, rounds } = useStore();
  const [, startNavigation] = useTransition();
  const [navigationSnapshot, setNavigationSnapshot] =
    useState<NavigationSnapshot | null>(null);
  const gameId = searchParams.get('gameId');
  const playthroughId = searchParams.get('playthroughId');
  const game = findById(games, gameId);
  const playthrough = findById(playthroughs, playthroughId);
  const playthroughRounds = rounds
    .filter((round) => round.playthroughId === playthroughId)
    .toSorted((left, right) => left.sequenceNumber - right.sequenceNumber);

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
    }
  }, [game, isReady, playthrough, router]);

  const handleStartRound = () => {
    if (!game || !playthrough) {
      return;
    }

    setNavigationSnapshot({
      game,
      playthrough,
      rounds: playthroughRounds,
    });

    startNavigation(() => {
      const roundId = addRound(game.id, playthrough.id);

      if (roundId) {
        router.push(routes.round(game.id, playthrough.id, roundId), {
          transitionTypes: routeTransitionTypes.forward,
        });
      } else {
        setNavigationSnapshot(null);
      }
    });
  };

  if (!isReady || !game || !playthrough) {
    return <RouteLoader />;
  }

  const visibleGame = navigationSnapshot?.game ?? game;
  const visiblePlaythrough = navigationSnapshot?.playthrough ?? playthrough;
  const visibleRounds = navigationSnapshot?.rounds ?? playthroughRounds;

  return (
    <PlaythroughScreen
      game={visibleGame}
      playthrough={visiblePlaythrough}
      rounds={visibleRounds}
      onStartRound={handleStartRound}
      onOpenRound={(roundId) =>
        router.push(routes.round(visibleGame.id, visiblePlaythrough.id, roundId), {
          transitionTypes: routeTransitionTypes.forward,
        })
      }
    />
  );
};
