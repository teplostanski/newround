import type { Metadata } from 'next';
import { RouteTransition } from '@/shared/ui/route-transition/route-transition';
import { NotFoundScreen } from '@/shared/ui/not-found-screen/not-found-screen';

export const metadata: Metadata = {
  title: '404',
};

const AppNotFoundPage = () => (
  <RouteTransition>
    <NotFoundScreen />
  </RouteTransition>
);

export default AppNotFoundPage;
