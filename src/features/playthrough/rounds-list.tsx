'use client';

import { Routes } from '@/shared/lib/routes';
import {
  toastStorageError,
  toastStorageSuccess,
} from '@/shared/lib/storage-toast';
import { useStore } from '@/shared/model/store';
import type { Game, Playthrough, Round } from '@/shared/model/types';
import { formatDuration, formatTime } from '@/shared/utils';
import { ConfirmDeleteButton } from '@/shared/ui/confirm-delete-button/confirm-delete-button';
import { ListItemCard } from '@/shared/ui/list-item-card/list-item-card';
import { ScoreSummary } from '@/shared/ui/score-summary/score-summary';
import { Clock } from '@gravity-ui/icons';
import { Chip } from '@heroui/react';

type RoundsListProps = {
  game: Game;
  playthrough: Playthrough;
  rounds: Round[];
};

const RoundsList = ({ game, playthrough, rounds }: RoundsListProps) => {
  const { deleteRound } = useStore();

  if (rounds.length === 0) {
    return <p className="empty">Раундов пока нет. Нажмите «Начать раунд»</p>;
  }

  const roundRunChip = (completion: boolean) =>
    completion ? null : (
      <Chip variant="primary" size="lg">
        <Clock width={16} />
        <Chip.Label>идёт</Chip.Label>
      </Chip>
    );

  return (
    <ul className="list">
      {rounds.map((round) => (
        <li key={round.id}>
          <ListItemCard
            link={
              round.completion
                ? undefined
                : Routes.Round(game.id, playthrough.id, round.id)
            }
            title={
              <span className="flex gap-2 items-center">
                Раунд {round.sequenceNumber}{' '}
                {roundRunChip(Boolean(round.completion))}
              </span>
            }
            content={
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1 text-[0.9rem]">
                  <span className="font-mono">
                    {formatTime(round.createdAt)} -{' '}
                    {round.completion
                      ? formatTime(round.completion.finishedAt)
                      : formatTime(round.updatedAt)}
                  </span>
                  {round.duration > 0 && (
                    <span className="text-muted font-mono">
                      {formatDuration(round.duration)}
                    </span>
                  )}
                </div>

                <ScoreSummary players={game.players} scores={round.scores} />
              </div>
            }
            action={
              <ConfirmDeleteButton
                deleteLabel="Удалить раунд"
                confirmHeading={`Удалить раунд ${round.sequenceNumber}?`}
                confirmBody="Счёт этого раунда пропадёт. Это нельзя отменить."
                onConfirm={async () => {
                  try {
                    await deleteRound(round.id);
                    toastStorageSuccess(`Раунд ${round.sequenceNumber} удалён`);
                  } catch (error) {
                    toastStorageError('Не удалось удалить раунд', error);
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
