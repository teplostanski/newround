'use client';

import { useRouter } from 'next/navigation';
import { SetupNewGameScreen } from '@/components/setup-new-game-screen';
import type { NewGameData } from '@/domain/game';
import { routes } from '@/lib/routes';
import { routeTransitionTypes } from '@/lib/view-transitions';
import { useGamesStore } from '@/state/games-store';

export const NewGamePage = () => {
  const router = useRouter();
  const { addGame } = useGamesStore();

  const handleCreateGame = (data: NewGameData) => {
    const { gameId, sessionId } = addGame(data);
    router.push(routes.session(gameId, sessionId), {
      transitionTypes: routeTransitionTypes.forward,
    });
  };

  return <SetupNewGameScreen onCreateGame={handleCreateGame} />;
};
