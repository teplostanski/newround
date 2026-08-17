import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RouteLoader } from '@/shared/ui/route-loader/route-loader';
import { RouteTransition } from '@/shared/ui/route-transition/route-transition';
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
