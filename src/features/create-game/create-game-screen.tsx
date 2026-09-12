'use client';

import { useId, useState, type SubmitEvent } from 'react';
import { Input, Skeleton } from '@heroui/react';
import { nanoid } from 'nanoid';
import { PrimaryAction, PrimaryActionBone } from '@/shared/ui/primary-action/primary-action';
import { ScoringModes } from '@/shared/constants';
import type { CreateGameData, Player, ScoringMode } from '@/shared/model/types';
import { PlayersSection } from './form-sections/players-section/players-section';
import { ScoringSection } from './form-sections/scoring-section/scoring-section';
import sectionStyles from './form-sections/form-section.module.css';
import styles from './create-game-screen.module.css';

type CreateGameScreenProps = {
  onCreateGame: (data: CreateGameData) => void;
  isSkeleton?: boolean;
};

const CreateGameScreen = ({
  onCreateGame,
  isSkeleton = false,
}: CreateGameScreenProps) => {
  const mainFormId = useId();
  const [gameName, setGameName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [scoringMode, setScoringMode] = useState<ScoringMode>(ScoringModes.Rounds);

  const handleAddPlayer = (name: string) => {
    setPlayers((current) => [...current, { id: nanoid(), name }]);
  };

  const handleRemovePlayer = (playerId: string) => {
    setPlayers((current) => current.filter((player) => player.id !== playerId));
  };

  const handleCreateGame = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name =
      gameName.trim() === ''
        ? `Игра ${new Date().toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
          })}`
        : gameName.trim();
    onCreateGame({ name, players, scoringMode });
  };
  
  /*
  TODO
  Заменить скелетон на отдельный файл
  */

  return (
    <div className="screen">
      {!isSkeleton ? (
        <form id={mainFormId} hidden onSubmit={handleCreateGame} />
      ) : null}

      <div className={styles.layout}>
        <div className={styles.body}>
          {isSkeleton ? (
            <Skeleton className={sectionStyles.fieldBoneFull} />
          ) : (
            <Input
              form={mainFormId}
              fullWidth
              type="text"
              aria-label="Название игры"
              placeholder="Название игры"
              value={gameName}
              onChange={(event) => setGameName(event.target.value)}
            />
          )}

          <PlayersSection
            players={players}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={handleRemovePlayer}
            isSkeleton={isSkeleton}
          />

          <ScoringSection
            scoringMode={scoringMode}
            onScoringModeChange={setScoringMode}
            isSkeleton={isSkeleton}
          />
        </div>

        {isSkeleton ? (
          <PrimaryActionBone />
        ) : (
          <PrimaryAction
            form={mainFormId}
            type="submit"
            isDisabled={players.length < 1}
          >
            Начать игру
          </PrimaryAction>
        )}
      </div>
    </div>
  );
};

export { CreateGameScreen };
