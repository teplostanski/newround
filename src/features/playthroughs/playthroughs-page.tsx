'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlaythroughListScreen } from '@/features/playthroughs/playthroughs-screen/playthroughs-screen';
import { PlaythroughsSkeleton } from '@/features/playthroughs/playthroughs-screen/playthroughs-skeleton';
import { routes } from '@/shared/lib/routes';
import { findById, useStore } from '@/shared/model/store';

export const PlaythroughsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { games, isReady, playthroughs } = useStore();
  const gameId = searchParams.get('gameId');
  const game = findById(games, gameId);

  useEffect(() => {
    if (isReady && !game) {
      router.replace(routes.home);
    }
  }, [game, isReady, router]);

  if (!isReady || !game) {
    return <PlaythroughsSkeleton />;
  }

  const gamePlaythroughs = playthroughs
    .filter((playthrough) => playthrough.gameId === game.id)
    .toSorted((left, right) => right.sequenceNumber - left.sequenceNumber);

  return (
    <PlaythroughListScreen gameId={game.id} playthroughs={gamePlaythroughs} />
  );
};
