import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PlaythroughPage } from '@/features/playthrough/playthrough-page';
import { RouteTransition } from '@/shared/ui/route-transition/route-transition';
import { routeSkeletons } from '../route-skeletons';

export const metadata: Metadata = {
  title: 'Партия',
};

export default function CurrentPlaythroughPage() {
  return (
    <RouteTransition>
      <Suspense fallback={routeSkeletons.playthrough}>
        <PlaythroughPage />
      </Suspense>
    </RouteTransition>
  );
}
