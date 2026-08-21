'use client';

import { useId, useState, type SubmitEvent } from 'react';
import { Button, Chip, Fieldset, Input, Separator } from '@heroui/react';
import { Plus } from '@gravity-ui/icons';
import type { Player } from '@/shared/model/game';
import { getPlayerTone } from '@/shared/lib/player-tone';

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
    <Fieldset>
      <Fieldset.Legend>Игроки</Fieldset.Legend>

      <Separator className="mt-2" />
      
      <form className="row" onSubmit={handleSubmit}>
        <label className="visuallyHidden" htmlFor={playerNameId}>
          Имя игрока
        </label>

        <Input
          id={playerNameId}
          className="min-w-0 flex-1"
          type="text"
          placeholder="Имя игрока"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
        />

        <Button
          isIconOnly
          type="submit"
          variant="secondary"
          className="iconButton"
          aria-label={addPlayerLabel}
        >
          <Plus width={20} height={20} aria-hidden="true" focusable="false" />
        </Button>
      </form>

      {players.length === 0 ? (
        <p className="empty">Добавьте хотя бы одного игрока</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {players.map((player, index) => (
            <Chip
              key={player.id}
              color={getPlayerTone(index)}
              variant="soft"
              size='lg'
            >
              {player.name}
            </Chip>
          ))}
        </div>
      )}
    </Fieldset>
  );
};

export { PlayersForm };
