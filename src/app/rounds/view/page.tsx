import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RouteLoader } from '@/components/route-loader';
import { RouteTransition } from '@/components/route-transition';
import { RoundPage } from '@/features/rounds/round-page';

export const metadata: Metadata = {
  title: 'Партия',
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
