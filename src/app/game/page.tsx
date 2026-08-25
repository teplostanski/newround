import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PlaythroughsSkeleton } from '@/features/playthroughs/playthroughs-screen/playthroughs-skeleton';
import { RouteTransition } from '@/shared/ui/route-transition/route-transition';
import { PlaythroughsPage } from '@/features/playthroughs/playthroughs-page';

export const metadata: Metadata = {
  title: 'Партии',
};

export default function GamePage() {
  return (
    <RouteTransition>
      <Suspense fallback={<PlaythroughsSkeleton />}>
        <PlaythroughsPage />
      </Suspense>
    </RouteTransition>
  );
}
