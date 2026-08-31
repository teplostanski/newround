'use client';

import { useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RoundsList } from '@/features/playthrough/rounds-list';
import { PlaythroughSkeleton } from '@/features/playthrough/playthrough-skeleton';
import { routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { findById, useStore } from '@/shared/model/store';
import { Card } from '@heroui/react';
import { PrimaryAction } from '@/shared/ui/primary-action/primary-action';
import { formatDate } from '@/shared/utils';

export const PlaythroughPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addRound, games, isReady, playthroughs, rounds } = useStore();
  const [, startNavigation] = useTransition();
  const gameId = searchParams.get('gameId');
  const playthroughId = searchParams.get('playthroughId');
  const game = findById(games, gameId);
  const playthrough = findById(playthroughs, playthroughId);
  const playthroughRounds = rounds
    .filter((round) => round.playthroughId === playthroughId)
    .toSorted((left, right) => right.sequenceNumber - left.sequenceNumber);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!game) {
      router.replace(routes.home);
      return;
    }

    if (!playthrough) {
      router.replace(routes.game(game.id));
    }
  }, [game, isReady, playthrough, router]);

  const handleStartRound = () => {
    if (!game || !playthrough) {
      return;
    }

    startNavigation(() => {
      const roundId = addRound(game.id, playthrough.id);

      if (!roundId) {
        return;
      }

      router.push(routes.round(game.id, playthrough.id, roundId), {
        transitionTypes: routeTransitionTypes.forward,
      });
    });
  };

  if (!isReady || !game || !playthrough) {
    return <PlaythroughSkeleton />;
  }

  return (
    <div className="screen">
      <Card className="w-full">
        <Card.Content>
          <p className="text-muted m-0 text-[0.95rem]">
            {game.name} · {formatDate(playthrough.createdAt)} ·{' '}
            {game.players.length}{' '}
            {game.players.length === 1 ? 'игрок' : 'игроков'}
          </p>
        </Card.Content>
      </Card>

      <PrimaryAction onPress={handleStartRound}>Начать раунд</PrimaryAction>
      <RoundsList
        game={game}
        playthrough={playthrough}
        rounds={playthroughRounds}
      />
    </div>
  );
};
