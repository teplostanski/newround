import type { Metadata } from 'next';
import { RouteTransition } from '@/shared/ui/route-transition/route-transition';
import { DevPage } from '@/features/dev/dev-page';

export const metadata: Metadata = {
  title: 'Разработка',
};

export default function DevRoutePage() {
  return (
    <RouteTransition>
      <DevPage />
    </RouteTransition>
  );
}
