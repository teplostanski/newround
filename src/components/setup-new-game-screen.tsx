import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { nanoid } from 'nanoid';
import type { Player } from './app';

export type NewGameData = {
  name: string;
  players: Player[];
};

type SetupNewGameScreenProps = {
  onCreateGame: (formData: NewGameData) => void;
};

const SetupNewGameScreen = ({ onCreateGame }: SetupNewGameScreenProps) => {
  const [gameName, setGameName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);

  const handlePlayerNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPlayerName(event.target.value);
  };

  const handleGameNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGameName(event.target.value);
  };

  const handleAddPlayer = (name: string) => {
    setPlayers((prev) => [...prev, { id: nanoid(), name }]);
  };

  const handleAddPlayerSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = playerName.trim();

    if (!trimmedName) {
      return;
    }

    handleAddPlayer(trimmedName);
    setPlayerName('');
  };

  const handleCreateGame = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCreateGame({ name: gameName, players });
  };

  return (
    <div className="screen">
      <form id="main-form" onSubmit={handleCreateGame} />

      <div className="stack">
        <input
          form="main-form"
          className="input"
          type="text"
          placeholder="Название игры"
          value={gameName}
          onChange={handleGameNameChange}
        />

        <fieldset className="fieldset">
          <legend className="legend">Игроки</legend>

          <form className="row" onSubmit={handleAddPlayerSubmit}>
            <label className="visuallyHidden" htmlFor="player-name">
              Имя игрока
            </label>

            <input
              id="player-name"
              className="input"
              type="text"
              placeholder="Имя игрока"
              value={playerName}
              onChange={handlePlayerNameChange}
            />

            <button className="btnGhost" type="submit">
              Добавить
            </button>
          </form>

          {players.length === 0 ? (
            <p className="empty">Добавьте хотя бы одного игрока</p>
          ) : (
            <ol className="list">
              {players.map((player) => (
                <li className="item" key={player.id}>
                  {player.name}
                </li>
              ))}
            </ol>
          )}
        </fieldset>

        <button
          form="main-form"
          className="btn btnBlock"
          type="submit"
          disabled={players.length < 1}
        >
          Начать игру
        </button>
      </div>
    </div>
  );
};

export { SetupNewGameScreen };
