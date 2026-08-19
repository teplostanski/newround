import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RouteLoader } from '@/shared/ui/route-loader/route-loader';
import { RouteTransition } from '@/shared/ui/route-transition/route-transition';
import { PlaythroughsPage } from '@/features/playthroughs/playthroughs-page';

export const metadata: Metadata = {
  title: 'Сессии',
};

export default function GamePlaythroughsPage() {
  return (
    <RouteTransition>
      <Suspense fallback={<RouteLoader />}>
        <PlaythroughsPage />
      </Suspense>
    </RouteTransition>
  );
}
