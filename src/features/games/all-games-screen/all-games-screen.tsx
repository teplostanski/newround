'use client';

import Link from 'next/link';
import type { Game } from '@/shared/model/types';
import { routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { useStore } from '@/shared/model/store';
import { ConfirmDeleteButton } from '@/shared/ui/confirm-delete-button/confirm-delete-button';
import { ListItemCard } from '@/shared/ui/list-item-card/list-item-card';

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
              <ListItemCard
                href={routes.game(game.id)}
                title={game.name}
                description={`${game.players.length} ${
                  game.players.length === 1 ? 'игрок' : 'игроков'
                }`}
                action={
                  <ConfirmDeleteButton
                    deleteLabel="Удалить игру"
                    confirmHeading={`Удалить игру «${game.name}»?`}
                    confirmBody="Партии и раунды этой игры пропадут. Это нельзя отменить."
                    onConfirm={() => {
                      void deleteGame(game.id);
                    }}
                  />
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { AllGamesScreen };
