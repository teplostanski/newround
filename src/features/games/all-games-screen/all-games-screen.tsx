'use client';

import { Card, CloseButton } from '@heroui/react';
import Link from 'next/link';
import type { Game } from '@/shared/model/types';
import { routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { useStore } from '@/shared/model/store';

type AllGamesScreenProps = {
  games: Game[];
};

const AllGamesScreen = ({ games }: AllGamesScreenProps) => {
  const { deleteGame } = useStore();

  return (
    <div className="screen">
      <Link
        href={routes.gameCreate}
        className="ctaLink"
        transitionTypes={routeTransitionTypes.forward}
      >
        Новая игра
      </Link>

      {games.length === 0 ? (
        <p className="empty">Пока нет игр — создайте первую</p>
      ) : (
        <ul className="list">
          {games.map((game) => (
            <li key={game.id}>
              <Card className="w-full">
                <Card.Header className="flex-row items-start gap-2">
                  <Link
                    href={routes.game(game.id)}
                    className="listButton min-w-0 flex-1"
                    transitionTypes={routeTransitionTypes.forward}
                  >
                    <Card.Title>{game.name}</Card.Title>
                    <Card.Description>
                      {game.players.length}{' '}
                      {game.players.length === 1 ? 'игрок' : 'игроков'}
                    </Card.Description>
                  </Link>
                  <CloseButton
                    aria-label="Удалить игру"
                    className="shrink-0"
                    onPress={() => deleteGame(game.id)}
                  />
                </Card.Header>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { AllGamesScreen };
