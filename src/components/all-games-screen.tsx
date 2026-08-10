'use client';

import cn from 'classnames';
import { ViewTransition } from 'react';
import type { Game } from '@/domain/game';
import {
  sharedTitleTransitions,
  transitionNames,
} from '@/lib/view-transitions';
import styles from './all-games-screen.module.css';

type AllGamesScreenProps = {
  games: Game[];
  onCreateNewGame: () => void;
  onOpenGame: (id: string) => void;
};

const AllGamesScreen = ({
  games,
  onCreateNewGame,
  onOpenGame,
}: AllGamesScreenProps) => {
  return (
    <div className="screen">
      <wa-button
        className="wa-block"
        type="button"
        variant="brand"
        appearance="accent"
        onClick={onCreateNewGame}
      >
        <ViewTransition
          name={transitionNames.newGameTitle}
          share={sharedTitleTransitions}
          default="none"
        >
          <span>Новая игра</span>
        </ViewTransition>
      </wa-button>

      {games.length === 0 ? (
        <p className="empty">Пока нет игр — создайте первую</p>
      ) : (
        <ul className="list">
          {games.map((game) => (
            <li
              className={cn('item', 'itemStacked', styles.linkItem)}
              key={game.id}
              onClick={() => onOpenGame(game.id)}
            >
              <ViewTransition
                name={transitionNames.gameTitle(game.id)}
                share={sharedTitleTransitions}
                default="none"
              >
                <p className="title">{game.name}</p>
              </ViewTransition>
              <p className="meta">
                {game.players.length}{' '}
                {game.players.length === 1 ? 'игрок' : 'игроков'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { AllGamesScreen };
