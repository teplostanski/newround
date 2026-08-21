import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RouteLoader } from '@/shared/ui/route-loader/route-loader';
import { RouteTransition } from '@/shared/ui/route-transition/route-transition';
import { RoundPage } from '@/features/rounds/round-page';

export const metadata: Metadata = {
  title: 'Раунд',
};

export default function CurrentRoundPage() {
  return (
    <RouteTransition>
      <Suspense fallback={<RouteLoader />}>
        <RoundPage />
      </Suspense>
    </RouteTransition>
  );
}
