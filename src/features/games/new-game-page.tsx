'use client';

import { useRouter } from 'next/navigation';
import { SetupNewGameScreen } from '@/features/games/setup-new-game-screen/setup-new-game-screen';
import { routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { useStore } from '@/shared/model/store';
import type { NewGameData } from '@/shared/model/types';

export const NewGamePage = () => {
  const router = useRouter();
  const { addGame } = useStore();

  const handleCreateGame = (data: NewGameData) => {
    const { gameId, playthroughId } = addGame(data);
    router.push(routes.playthrough(gameId, playthroughId), {
      transitionTypes: routeTransitionTypes.forward,
    });
  };

  return <SetupNewGameScreen onCreateGame={handleCreateGame} />;
};
