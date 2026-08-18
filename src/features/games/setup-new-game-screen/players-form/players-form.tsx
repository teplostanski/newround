'use client';

import { useId, useState, type SubmitEvent } from 'react';
import type WaInput from '@awesome.me/webawesome/dist/components/input/input.js';
import type { Player } from '@/shared/model/game';
import { Plus } from '@gravity-ui/icons';

type PlayersFormProps = {
  players: Player[];
  onAddPlayer: (name: string) => void;
};

const PlayersForm = ({ players, onAddPlayer }: PlayersFormProps) => {
  const playerNameId = useId();
  const [playerName, setPlayerName] = useState('');
  const addPlayerLabel = 'Добавить игрока';

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = playerName.trim();

    if (!trimmedName) {
      return;
    }

    onAddPlayer(trimmedName);
    setPlayerName('');
  };

  return (
    <fieldset className="fieldset">
      <legend className="legend">Игроки</legend>

      <form className="row" onSubmit={handleSubmit}>
        <label className="visuallyHidden" htmlFor={playerNameId}>
          Имя игрока
        </label>

        <wa-input
          id={playerNameId}
          className="wa-grow"
          type="text"
          placeholder="Имя игрока"
          value={playerName}
          onInput={(event) =>
            setPlayerName((event.currentTarget as WaInput).value ?? '')
          }
        />

        <wa-button
          className="iconButton"
          type="submit"
          variant="neutral"
          appearance="outlined"
          aria-label={addPlayerLabel}
          title={addPlayerLabel}
        >
          <Plus
            width={20}
            height={20}
            aria-hidden="true"
            focusable="false"
          />
        </wa-button>
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
  );
};

export { PlayersForm };
