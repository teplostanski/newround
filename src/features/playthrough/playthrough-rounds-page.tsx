'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PlaythroughScreen } from '@/features/playthrough/playthrough-screen';
import { Routes } from '@/shared/lib/routes';
import { toastStorageError } from '@/shared/lib/storage-toast';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { useStore } from '@/shared/model/store';
import type { Game, Playthrough } from '@/shared/model/types';

type PlaythroughRoundsPageProps = {
  game: Game;
  playthrough: Playthrough;
};

const PlaythroughRoundsPage = ({
  game,
  playthrough,
}: PlaythroughRoundsPageProps) => {
  const router = useRouter();
  const { addRound, rounds } = useStore();
  const [, startNavigation] = useTransition();

  const playthroughRounds = rounds
    .filter((round) => round.playthroughId === playthrough.id)
    .toSorted((left, right) => right.sequenceNumber - left.sequenceNumber);

  const handleStartRound = () => {
    startNavigation(() => {
      const result = addRound(game.id, playthrough.id);

      if (!result) {
        toastStorageError('Не удалось начать раунд');
        return;
      }

      const { id, persist } = result;

      router.push(Routes.Round(game.id, playthrough.id, id), {
        transitionTypes: routeTransitionTypes.forward,
      });

      persist.catch((error) => {
        router.replace(Routes.Playthrough(game.id, playthrough.id));
        toastStorageError('Не удалось начать раунд', error);
      });
    });
  };

  return (
    <PlaythroughScreen
      game={game}
      playthrough={playthrough}
      rounds={playthroughRounds}
      onStartRound={handleStartRound}
    />
  );
};

export { PlaythroughRoundsPage };
