import cn from 'classnames';
import type { Game } from './app';
import styles from './all-games-screen.module.css'

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
      <button className="btn btnBlock" type="button" onClick={onCreateNewGame}>
        Новая игра
      </button>

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
              <p className="title">{game.name}</p>
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
