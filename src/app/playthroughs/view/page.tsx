import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RouteLoader } from '@/shared/ui/route-loader/route-loader';
import { RouteTransition } from '@/shared/ui/route-transition/route-transition';
import { PlaythroughPage } from '@/features/playthroughs/playthrough-page';

export const metadata: Metadata = {
  title: 'Сессия',
};

export default function CurrentPlaythroughPage() {
  return (
    <RouteTransition>
      <Suspense fallback={<RouteLoader />}>
        <PlaythroughPage />
      </Suspense>
    </RouteTransition>
  );
}
