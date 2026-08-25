import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PlaythroughSkeleton } from '@/features/playthroughs/playthrough-screen/playthrough-skeleton';
import { RouteTransition } from '@/shared/ui/route-transition/route-transition';
import { PlaythroughPage } from '@/features/playthroughs/playthrough-page';

export const metadata: Metadata = {
  title: 'Партия',
};

export default function CurrentPlaythroughPage() {
  return (
    <RouteTransition>
      <Suspense fallback={<PlaythroughSkeleton />}>
        <PlaythroughPage />
      </Suspense>
    </RouteTransition>
  );
}
