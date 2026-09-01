'use client';

import { getPlayerChipStyle } from '@/shared/lib/player-chip';
import { Routes } from '@/shared/lib/routes';
import { toastStorageDanger } from '@/shared/lib/storage-error';
import { useStore } from '@/shared/model/store';
import type { Game, Playthrough, Round, Scores } from '@/shared/model/types';
import { ConfirmDeleteButton } from '@/shared/ui/confirm-delete-button/confirm-delete-button';
import { ListItemCard } from '@/shared/ui/list-item-card/list-item-card';
import { Chip } from '@heroui/react';

type RoundsListProps = {
  game: Game;
  playthrough: Playthrough;
  rounds: Round[];
};

const RoundsList = ({ game, playthrough, rounds }: RoundsListProps) => {
  const { deleteRound } = useStore();

  const roundSummary = (players: Game['players'], scores: Scores) => {
    return (
      <ul className="flex flex-row flex-wrap gap-2">
        {players.map((player, index) => (
          <li key={player.id}>
            <Chip
              variant="soft"
              size="md"
              className="px-2"
              style={getPlayerChipStyle(index)}
            >
              {player.name} ·{' '}
              <span className="font-mono">{scores[player.id]}</span>
            </Chip>
          </li>
        ))}
      </ul>
    );
  };

  if (rounds.length === 0) {
    return <p className="empty">Раундов пока нет — начните первый</p>;
  }

  return (
    <ul className="list">
      {rounds.map((round) => (
        <li key={round.id}>
          <ListItemCard
            link={Routes.Round(game.id, playthrough.id, round.id)}
            title={`Раунд ${round.sequenceNumber}`}
            content={roundSummary(game.players, round.scores)}
            action={
              <ConfirmDeleteButton
                deleteLabel="Удалить раунд"
                confirmHeading={`Удалить раунд ${round.sequenceNumber}?`}
                confirmBody="Счёт этого раунда пропадёт. Это нельзя отменить."
                onConfirm={async () => {
                  try {
                    await deleteRound(round.id);
                  } catch (error) {
                    toastStorageDanger('Не удалось удалить раунд', error);
                  }
                }}
              />
            }
          />
        </li>
      ))}
    </ul>
  );
};

export { RoundsList };
