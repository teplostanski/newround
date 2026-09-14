'use client';

import { useRouter } from 'next/navigation';
import { ScoreScreen } from '@/shared/ui/score-screen/score-screen';
import { Routes } from '@/shared/lib/routes';
import { toastStorageError } from '@/shared/lib/storage-toast';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { useStore } from '@/shared/model/store';
import { initialScores } from '@/shared/model/entity-builders';
import type { PlaythroughGame, Playthrough } from '@/shared/model/types';

type PlaythroughScorePageProps = {
  game: PlaythroughGame;
  playthrough: Playthrough;
};

const PlaythroughScorePage = ({
  game,
  playthrough,
}: PlaythroughScorePageProps) => {
  const router = useRouter();
  const { updatePlaythroughScore } = useStore();

  return (
    <ScoreScreen
      players={game.players}
      scores={playthrough.scores}
      totalScores={initialScores(game.players)}
      finishLabel="Завершить партию"
      onChangeScore={async (playerId, score) => {
        try {
          await updatePlaythroughScore({
            id: playthrough.id,
            playerId,
            score,
          });
        } catch (error) {
          toastStorageError('Не удалось сохранить счёт', error);
        }
      }}
      onFinish={() =>
        router.push(Routes.Game(game.id), {
          transitionTypes: routeTransitionTypes.back,
        })
      }
      isFirstRun={true}
    />
  );
};

export { PlaythroughScorePage };
