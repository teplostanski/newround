'use client';

import Link from 'next/link';
import type { Game } from '@/shared/model/types';
import { Routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { GamesList } from './games-list';

type GamesScreenProps = {
  games: Game[];
};

const GamesScreen = ({ games }: GamesScreenProps) => (
  <div className="screen">
    <Link
      href={Routes.GameCreate}
      className="primaryActionLink"
      transitionTypes={routeTransitionTypes.forward}
    >
      Новая игра
    </Link>

    <GamesList games={games} />
  </div>
);

export { GamesScreen };
