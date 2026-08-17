import type { Metadata } from 'next';
import { RouteTransition } from '@/shared/ui/route-transition/route-transition';
import { NewGamePage } from '@/features/games/new-game-page';

export const metadata: Metadata = {
  title: 'Новая игра',
};

export default function CreateGamePage() {
  return (
    <RouteTransition>
      <NewGamePage />
    </RouteTransition>
  );
}
