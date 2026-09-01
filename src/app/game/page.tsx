import type { Metadata } from 'next';
import { Suspense } from 'react';
import { GamePage } from '@/features/game/game-page';
import { RouteTransition } from '@/shared/ui/route-transition/route-transition';
import { routeSkeletons } from '../route-skeletons';

export const metadata: Metadata = {
  title: 'Партии',
};

const AppGamePage = () => (
  <RouteTransition>
    <Suspense fallback={routeSkeletons.game}>
      <GamePage />
    </Suspense>
  </RouteTransition>
);

export default AppGamePage;
