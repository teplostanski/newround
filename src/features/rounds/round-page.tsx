'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScoreScreen } from '@/shared/ui/score-screen/score-screen';
import { ScoreSkeleton } from '@/shared/ui/score-screen/score-skeleton';
import { Routes } from '@/shared/lib/routes';
import {
  toastStorageError,
  toastStorageSuccess,
} from '@/shared/lib/storage-toast';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { findById, useStore } from '@/shared/model/store';

const RoundPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    games,
    isReady,
    playthroughs,
    rounds,
    updateRoundScore,
    finishRound,
  } = useStore();
  const gameId = searchParams.get('gameId');
  const playthroughId = searchParams.get('playthroughId');
  const roundId = searchParams.get('roundId');
  const game = findById(games, gameId);
  const playthrough = findById(playthroughs, playthroughId);
  const round = findById(rounds, roundId);

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

    if (!round) {
      router.push(Routes.Playthrough(game.id, playthrough.id), {
        transitionTypes: routeTransitionTypes.back,
      });
      return;
    }

    // Завершённый раунд не редактируется: выкидываем в список раундов.
    //if (round.completion) {
    //  if (!blockedToastShown.current) {
    //    blockedToastShown.current = true;
    //    toastError('Раунд завершён и не редактируется');
    //  }
    //  router.replace(Routes.Playthrough(game.id, playthrough.id));
    //}
  }, [game, isReady, playthrough, round, router]);

  if (!isReady || !game || !playthrough || !round) {
    return <ScoreSkeleton />;
  }

  const handleFinish = async () => {
    try {
      await finishRound(round.id);

      //if (!blockedToastShown.current) {
      //  blockedToastShown.current = true;
        
      //}

    //      router.push(Routes.Playthrough(game.id, playthrough.id), {
    //  transitionTypes: routeTransitionTypes.back,
    //});
    toastStorageSuccess('Раунд завершён');
    } catch (error) {
      toastStorageError('Не удалось завершить раунд', error);
    }

    router.push(Routes.Playthrough(game.id, playthrough.id), {
      transitionTypes: routeTransitionTypes.back,
    });
  };

  return (
    <ScoreScreen
      players={game.players}
      scores={round.scores}
      finishLabel="Завершить раунд"
      isCompleted={Boolean(round.completion)}
      isFirstRun={round.sequenceNumber <= 1}
      onChangeScore={async (playerId, score) => {
        try {
          await updateRoundScore({ id: round.id, playerId, score });
        } catch (error) {
          toastStorageError('Не удалось сохранить счёт', error);
        }
      }}
      onFinish={handleFinish}
      totalScores={playthrough.scores}
    />
  );
};

export { RoundPage };
