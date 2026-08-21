import type { Metadata } from 'next';
import { RouteTransition } from '@/shared/ui/route-transition/route-transition';
import { GamesPage } from '@/features/games/games-page';

export const metadata: Metadata = {
  title: 'Игры',
};

export default function HomePage() {
  return (
    <RouteTransition>
      <GamesPage />
    </RouteTransition>
  );
}
