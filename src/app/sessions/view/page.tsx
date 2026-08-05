import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RouteLoader } from '@/components/route-loader';
import { RouteTransition } from '@/components/route-transition';
import { SessionPage } from '@/features/sessions/session-page';

export const metadata: Metadata = {
  title: 'Сессия',
};

export default function CurrentSessionPage() {
  return (
    <RouteTransition>
      <Suspense fallback={<RouteLoader />}>
        <SessionPage />
      </Suspense>
    </RouteTransition>
  );
}
