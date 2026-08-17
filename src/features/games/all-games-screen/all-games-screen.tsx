'use client';

import cn from 'classnames';
import type { Game } from '@/shared/model/game';
import { titleTransitionStyle, transitionNames } from '@/shared/lib/view-transitions';
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
        <span style={titleTransitionStyle(transitionNames.newGameTitle)}>
          Новая игра
        </span>
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
              <p
                className="title"
                style={titleTransitionStyle(transitionNames.gameTitle(game.id))}
              >
                {game.name}
              </p>
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
