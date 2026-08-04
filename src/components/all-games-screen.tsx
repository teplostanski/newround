import type { Game } from './app';

type AllGamesScreenProps = {
  games: Game[];
  onNewGame: () => void;
};

const AllGamesScreen = ({ games, onNewGame }: AllGamesScreenProps) => {
  return (
    <div className="screen">
      <button className="btn btnBlock" type="button" onClick={onNewGame}>
        Новая игра
      </button>

      {games.length === 0 ? (
        <p className="empty">Пока нет игр — создайте первую</p>
      ) : (
        <ul className="list">
          {games.map((game) => (
            <li className="item itemStacked" key={game.id}>
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
