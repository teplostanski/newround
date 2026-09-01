'use client';

import Link from 'next/link';
import { Routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';

const NotFoundScreen = () => (
  <div className="screen">
    <p className="empty">Страница не найдена</p>

    <Link
      href={Routes.Root}
      className="primaryActionLink"
      transitionTypes={routeTransitionTypes.back}
    >
      К списку игр
    </Link>
  </div>
);

export { NotFoundScreen };
