import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RouteLoader } from '@/components/route-loader';
import { RouteTransition } from '@/components/route-transition';
import { SessionsPage } from '@/features/sessions/sessions-page';

export const metadata: Metadata = {
  title: 'Сессии',
};

export default function GameSessionsPage() {
  return (
    <RouteTransition>
      <Suspense fallback={<RouteLoader />}>
        <SessionsPage />
      </Suspense>
    </RouteTransition>
  );
}
