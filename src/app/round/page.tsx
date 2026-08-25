import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RoundSkeleton } from '@/features/rounds/round-screen/round-skeleton';
import { RouteTransition } from '@/shared/ui/route-transition/route-transition';
import { RoundPage } from '@/features/rounds/round-page';

export const metadata: Metadata = {
  title: 'Раунд',
};

export default function CurrentRoundPage() {
  return (
    <RouteTransition>
      <Suspense fallback={<RoundSkeleton />}>
        <RoundPage />
      </Suspense>
    </RouteTransition>
  );
}
