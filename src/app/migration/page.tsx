import type { Metadata } from 'next';
import { RouteTransition } from '@/shared/ui/route-transition/route-transition';
import { MigrationPage } from '@/features/migration/migration-page';

export const metadata: Metadata = {
  title: 'Миграция',
};

export default function MigrationRoutePage() {
  return (
    <RouteTransition>
      <MigrationPage />
    </RouteTransition>
  );
}
