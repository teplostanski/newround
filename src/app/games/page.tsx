import type { Metadata } from 'next';
import { RouteTransition } from '@/components/route-transition';
import { GamesPage } from '@/features/games/games-page';

export const metadata: Metadata = {
  title: 'Игры',
};

export default function AllGamesPage() {
  return (
    <RouteTransition>
      <GamesPage />
    </RouteTransition>
  );
}
