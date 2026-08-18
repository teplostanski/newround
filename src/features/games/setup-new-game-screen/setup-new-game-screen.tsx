'use client';

import { useId, useState, type SubmitEvent } from 'react';
import { nanoid } from 'nanoid';
import type WaInput from '@awesome.me/webawesome/dist/components/input/input.js';
import type { NewGameData, Player } from '@/shared/model/game';
import { PlayersForm } from './players-form/players-form';

type SetupNewGameScreenProps = {
  onCreateGame: (formData: NewGameData) => void;
};

const SetupNewGameScreen = ({ onCreateGame }: SetupNewGameScreenProps) => {
  const newGameFormId = useId();
  const [gameName, setGameName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);

  const handleAddPlayer = (name: string) => {
    setPlayers((current) => [...current, { id: nanoid(), name }]);
  };

  const handleCreateGame = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCreateGame({ name: gameName, players });
  };

  return (
    <div className="screen">
      <form id={newGameFormId} hidden onSubmit={handleCreateGame} />

      <div className="stack">
        <wa-input
          form={newGameFormId}
          type="text"
          placeholder="Название игры"
          value={gameName}
          onInput={(event) =>
            setGameName((event.currentTarget as WaInput).value ?? '')
          }
        />

        <PlayersForm players={players} onAddPlayer={handleAddPlayer} />

        <wa-button
          form={newGameFormId}
          className="wa-block"
          type="submit"
          variant="brand"
          appearance="accent"
          disabled={players.length < 1 ? true : undefined}
        >
          Начать игру
        </wa-button>
      </div>
    </div>
  );
};

export { SetupNewGameScreen };
