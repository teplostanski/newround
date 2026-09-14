'use client';

import { useId, useState, type SubmitEvent } from 'react';
import { Description, Fieldset, Input, Separator, Skeleton } from '@heroui/react';
import { Plus } from '@gravity-ui/icons';
import type { Player } from '@/shared/model/types';
import { IconAction } from '@/shared/ui/icon-action/icon-action';
import { SkeletonBone } from '@/shared/ui/skeleton-bone/skeleton-bone';
import sectionStyles from '../form-section.module.css';
import { PlayerCard } from './player-card';
import styles from './players-section.module.css';

type PlayersSectionProps = {
  players: Player[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (playerId: string) => void;
  isSkeleton?: boolean;
};

const PlayersSection = ({
  players,
  onAddPlayer,
  onRemovePlayer,
  isSkeleton = false,
}: PlayersSectionProps) => {
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
    <Fieldset
      className={sectionStyles.fieldset}
      aria-required={isSkeleton ? undefined : true}
      aria-hidden={isSkeleton || undefined}
    >
      <Fieldset.Legend className={sectionStyles.legend}>
        {isSkeleton ? (
          <SkeletonBone>
            Игроки
            <span className={sectionStyles.requiredMark}>*</span>
          </SkeletonBone>
        ) : (
          <>
            Игроки
            <span className={sectionStyles.requiredMark} aria-hidden="true">
              *
            </span>
          </>
        )}
      </Fieldset.Legend>

      <Separator className="mt-2" />

      {isSkeleton ? (
        <div className="row">
          <Skeleton className={sectionStyles.fieldBoneGrow} />
          <Skeleton className="iconAction shrink-0" />
        </div>
      ) : (
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

          <IconAction type="submit" aria-label={addPlayerLabel}>
            <Plus width={20} height={20} aria-hidden="true" focusable="false" />
          </IconAction>
        </form>
      )}

      {isSkeleton || players.length === 0 ? (
        <Description className={sectionStyles.description}>
          {isSkeleton ? (
            <SkeletonBone block>Добавьте хотя бы одного игрока</SkeletonBone>
          ) : (
            'Добавьте хотя бы одного игрока'
          )}
        </Description>
      ) : (
        <ul className={`list ${styles.list}`}>
          {players.map((player, index) => (
            <li key={player.id} className="min-w-0">
              <PlayerCard
                name={player.name}
                index={index}
                onRemove={() => {
                  onRemovePlayer(player.id);
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </Fieldset>
  );
};

export { PlayersSection };
