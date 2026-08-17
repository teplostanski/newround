import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RouteLoader } from '@/shared/ui/route-loader/route-loader';
import { RouteTransition } from '@/shared/ui/route-transition/route-transition';
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
