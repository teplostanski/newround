'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlaythroughRoundsPage } from '@/features/playthrough/playthrough-rounds-page';
import { PlaythroughScorePage } from '@/features/playthrough/playthrough-score-page';
import { PlaythroughSkeleton } from '@/features/playthrough/playthrough-skeleton';
import { Routes } from '@/shared/lib/routes';
import { ScoreSkeleton } from '@/shared/ui/score-screen/score-skeleton';
import { ScoringModes } from '@/shared/constants';
import { findById, useStore } from '@/shared/model/store';

const PlaythroughPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { games, isReady, playthroughs } = useStore();
  const gameId = searchParams.get('gameId');
  const playthroughId = searchParams.get('playthroughId');
  const game = findById(games, gameId);
  const playthrough = findById(playthroughs, playthroughId);
  const isPlaythroughMode = game?.scoringMode === ScoringModes.Playthrough;

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!game) {
      router.replace(Routes.Root);
      return;
    }

    if (!playthrough) {
      router.replace(Routes.Game(game.id));
      return;
    }

    if (game.scoringMode === ScoringModes.Playthrough && !playthrough.scores) {
      router.replace(Routes.Game(game.id));
    }
  }, [game, isReady, playthrough, router]);

  if (!isReady || !game || !playthrough) {
    return isPlaythroughMode ? <ScoreSkeleton /> : <PlaythroughSkeleton />;
  }

  if (game.scoringMode === ScoringModes.Playthrough) {
    if (!playthrough.scores) {
      return <ScoreSkeleton />;
    }

    return (
      <PlaythroughScorePage
        game={game}
        playthrough={playthrough}
      />
    );
  }

  return <PlaythroughRoundsPage game={game} playthrough={playthrough} />;
};

export { PlaythroughPage };
