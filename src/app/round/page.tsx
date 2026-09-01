import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RoundPage } from '@/features/rounds/round-page';
import { RouteTransition } from '@/shared/ui/route-transition/route-transition';
import { routeSkeletons } from '../route-skeletons';

export const metadata: Metadata = {
  title: 'Раунд',
};

const AppRoundPage = () => (
  <RouteTransition>
    <Suspense fallback={routeSkeletons.round}>
      <RoundPage />
    </Suspense>
  </RouteTransition>
);

export default AppRoundPage;
