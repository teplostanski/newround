'use client';

import { useId, useState, type SubmitEvent } from 'react';
import { nanoid } from 'nanoid';
import { Button, Input } from '@heroui/react';
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
        <Input
          form={newGameFormId}
          fullWidth
          type="text"
          aria-label="Название игры"
          placeholder="Название игры"
          value={gameName}
          onChange={(event) => setGameName(event.target.value)}
        />

        <PlayersForm players={players} onAddPlayer={handleAddPlayer} />

        <Button
          form={newGameFormId}
          fullWidth
          type="submit"
          isDisabled={players.length < 1}
        >
          Начать игру
        </Button>
      </div>
    </div>
  );
};

export { SetupNewGameScreen };
