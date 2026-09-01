import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RouteTransition } from '@/shared/ui/route-transition/route-transition';
import { EditGamePage } from '@/features/edit-game/edit-game-page';
import { routeSkeletons } from '../../route-skeletons';

export const metadata: Metadata = {
  title: 'Редактирование игры',
};

const AppEditGamePage = () => (
  <RouteTransition>
    <Suspense fallback={routeSkeletons.editGame}>
      <EditGamePage />
    </Suspense>
  </RouteTransition>
);

export default AppEditGamePage;
