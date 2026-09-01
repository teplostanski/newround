'use client';

import { useId, useState, type SubmitEvent } from 'react';
import { Button, InputGroup, Label, TextField } from '@heroui/react';
import { PrimaryAction } from '@/shared/ui/primary-action/primary-action';
import type { EditGameData, Game } from '@/shared/model/types';
import { ArrowRotateLeft } from '@gravity-ui/icons';

type EditGameScreenProps = {
  game: Game;
  onEditGame: (data: EditGameData) => void;
};

const EditGameScreen = ({ game, onEditGame }: EditGameScreenProps) => {
  const mainFormId = useId();
  const [gameName, setGameName] = useState(game.name);

  const resetGameName = () => setGameName(game.name);

  const handleEditGame = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onEditGame({ name: gameName });
  };

  return (
    <div className="screen">
      <form id={mainFormId} hidden onSubmit={handleEditGame} />

      <div className="stack">
        <TextField className="w-full" name="name">
          <Label>Название игры</Label>
          <InputGroup>
            <InputGroup.Input
              className="w-full"
              form={mainFormId}
              type="text"
              aria-label="Название игры"
              value={gameName}
              onChange={(event) => setGameName(event.target.value)}
            />
            {game.name !== gameName && (
              <InputGroup.Suffix>
                <Button
                  isIconOnly
                  aria-label="Отменить"
                  size="sm"
                  variant="ghost"
                  onPress={resetGameName}
                >
                  <ArrowRotateLeft className="size-4" />
                </Button>
              </InputGroup.Suffix>
            )}
          </InputGroup>
        </TextField>

        <PrimaryAction form={mainFormId} type="submit">
          Изменить
        </PrimaryAction>
      </div>
    </div>
  );
};

export { EditGameScreen };
