import { RouteTransition } from '@/shared/ui/route-transition/route-transition';
import { GamesPage } from '@/features/games/games-page';

export default function HomePage() {
  return (
    <RouteTransition>
      <GamesPage />
    </RouteTransition>
  );
}
