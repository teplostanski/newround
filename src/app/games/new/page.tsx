import type { Metadata } from 'next';
import { RouteTransition } from '@/components/route-transition';
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
