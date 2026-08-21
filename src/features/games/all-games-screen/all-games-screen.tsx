'use client';

import { Card } from '@heroui/react';
import Link from 'next/link';
import type { Game } from '@/shared/model/types';
import { routes } from '@/shared/lib/routes';
import {
  routeTransitionTypes,
  titleTransitionStyle,
  transitionNames,
} from '@/shared/lib/view-transitions';

type AllGamesScreenProps = {
  games: Game[];
};

const AllGamesScreen = ({ games }: AllGamesScreenProps) => {
  return (
    <div className="screen">
      <Link
        href={routes.gameCreate}
        className="ctaLink"
        transitionTypes={routeTransitionTypes.forward}
      >
        <span style={titleTransitionStyle(transitionNames.newGameTitle)}>
          Новая игра
        </span>
      </Link>

      {games.length === 0 ? (
        <p className="empty">Пока нет игр — создайте первую</p>
      ) : (
        <ul className="list">
          {games.map((game) => (
            <li key={game.id}>
              <Link
                href={routes.game(game.id)}
                className="listButton"
                transitionTypes={routeTransitionTypes.forward}
              >
                <Card className="w-full">
                  <Card.Header>
                    <p
                      className="titleFly"
                      style={titleTransitionStyle(
                        transitionNames.gameTitle(game.id),
                      )}
                    >
                      {game.name}
                    </p>
                    <Card.Description>
                      {game.players.length}{' '}
                      {game.players.length === 1 ? 'игрок' : 'игроков'}
                    </Card.Description>
                  </Card.Header>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { AllGamesScreen };
