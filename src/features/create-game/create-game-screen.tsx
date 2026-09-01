'use client';

import { useId, useState, type SubmitEvent } from 'react';
import { nanoid } from 'nanoid';
import { Input } from '@heroui/react';
import { PrimaryAction } from '@/shared/ui/primary-action/primary-action';
import type { CreateGameData, Player } from '@/shared/model/types';
import { PlayersForm } from './players-form/players-form';

type CreateGameScreenProps = {
  onCreateGame: (data: CreateGameData) => void;
};

const CreateGameScreen = ({ onCreateGame }: CreateGameScreenProps) => {
  const mainFormId = useId();
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
      <form id={mainFormId} hidden onSubmit={handleCreateGame} />

      <div className="stack">
        <Input
          form={mainFormId}
          fullWidth
          type="text"
          aria-label="Название игры"
          placeholder="Название игры"
          value={gameName}
          onChange={(event) => setGameName(event.target.value)}
        />

        <PlayersForm players={players} onAddPlayer={handleAddPlayer} />

        <PrimaryAction
          form={mainFormId}
          type="submit"
          isDisabled={players.length < 1}
        >
          Начать игру
        </PrimaryAction>
      </div>
    </div>
  );
};

export { CreateGameScreen };
