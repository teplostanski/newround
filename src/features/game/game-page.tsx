'use client';

import { ReactNode, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlaythroughsList } from '@/features/playthroughs/playthroughs-list/playthroughs-list';
import { GameSkeleton } from '@/features/game/game-skeleton';
import { routes } from '@/shared/lib/routes';
import { findById, useStore } from '@/shared/model/store';
import { Card } from '@heroui/react';
import { PrimaryAction } from '@/shared/ui/primary-action/primary-action';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { formatDate } from '@/shared/utils';

type SummaryCardProps = {
  slot: ReactNode;
};

const SummaryCard = ({ slot }: SummaryCardProps) => {
  return (
    <Card className="w-full">
      <Card.Content>
        {slot}
      </Card.Content>
    </Card>
  );
};

export const GamePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { games, isReady, playthroughs, addPlaythrough } = useStore();
  const [, startNavigation] = useTransition();
  const gameId = searchParams.get('gameId');
  const game = findById(games, gameId);

  useEffect(() => {
    if (isReady && !game) {
      router.replace(routes.home);
    }
  }, [game, isReady, router]);

  if (!isReady || !game) {
    return <GameSkeleton />;
  }

  const gamePlaythroughs = playthroughs
    .filter((playthrough) => playthrough.gameId === game.id)
    .toSorted((left, right) => right.sequenceNumber - left.sequenceNumber);

  const handleStartPlaythrough = () => {
    if (!game) {
      return;
    }

    startNavigation(() => {
      const playthroughId = addPlaythrough(game.id);

      if (!playthroughId) {
        return;
      }

      router.push(routes.playthrough(game.id, playthroughId), {
        transitionTypes: routeTransitionTypes.forward,
      });
    });
  };

  return (
    <div className="screen">
      <SummaryCard
        slot={
          <p className="text-muted m-0 text-[0.95rem] font-mono">
            {formatDate(game.createdAt)} · {gamePlaythroughs.length}{' '}
            {gamePlaythroughs.length === 1 ? 'партия' : 'партий'}
          </p>
        }
      />
      <PrimaryAction onPress={handleStartPlaythrough}>Начать партию</PrimaryAction>
      <PlaythroughsList gameId={game.id} playthroughs={gamePlaythroughs} />
    </div>
  );
};
