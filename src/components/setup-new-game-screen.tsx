'use client';

import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { nanoid } from 'nanoid';
import type WaInput from '@awesome.me/webawesome/dist/components/input/input.js';
import type { NewGameData, Player } from '@/domain/game';

type SetupNewGameScreenProps = {
  onCreateGame: (formData: NewGameData) => void;
};

const SetupNewGameScreen = ({ onCreateGame }: SetupNewGameScreenProps) => {
  const [gameName, setGameName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);

  const addPlayerFromField = () => {
    const trimmedName = playerName.trim();

    if (!trimmedName) {
      return;
    }

    setPlayers((prev) => [...prev, { id: nanoid(), name: trimmedName }]);
    setPlayerName('');
  };

  const handleCreateGame = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCreateGame({ name: gameName, players });
  };

  const handlePlayerKeyDown = (event: KeyboardEvent<WaInput>) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    addPlayerFromField();
  };

  return (
    <div className="screen">
      <form className="stack" onSubmit={handleCreateGame}>
        <wa-input
          type="text"
          placeholder="Название игры"
          value={gameName}
          onInput={(event) =>
            setGameName((event.currentTarget as WaInput).value ?? '')
          }
        />

        <fieldset className="fieldset">
          <legend className="legend">Игроки</legend>

          <div className="row">
            <label className="visuallyHidden" htmlFor="player-name">
              Имя игрока
            </label>

            <wa-input
              id="player-name"
              className="wa-grow"
              type="text"
              placeholder="Имя игрока"
              value={playerName}
              onInput={(event) =>
                setPlayerName((event.currentTarget as WaInput).value ?? '')
              }
              onKeyDown={handlePlayerKeyDown as never}
            />

            <wa-button
              type="button"
              variant="neutral"
              appearance="outlined"
              onClick={addPlayerFromField}
            >
              Добавить
            </wa-button>
          </div>

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

        <wa-button
          className="wa-block"
          type="submit"
          variant="brand"
          appearance="accent"
          disabled={players.length < 1 ? true : undefined}
        >
          Начать игру
        </wa-button>
      </form>
    </div>
  );
};

export { SetupNewGameScreen };
