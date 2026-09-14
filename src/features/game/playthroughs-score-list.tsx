'use client';

import { Routes } from '@/shared/lib/routes';
import {
  toastStorageError,
  toastStorageSuccess,
} from '@/shared/lib/storage-toast';
import { formatDate } from '@/shared/utils';
import { useStore } from '@/shared/model/store';
import type { Playthrough, PlaythroughGame } from '@/shared/model/types';
import { ConfirmDeleteButton } from '@/shared/ui/confirm-delete-button/confirm-delete-button';
import { ListItemCard } from '@/shared/ui/list-item-card/list-item-card';
import { ScoreSummary } from '@/shared/ui/score-summary/score-summary';

type PlaythroughsScoreListProps = {
  game: PlaythroughGame;
  playthroughs: Playthrough[];
};

const PlaythroughsScoreList = ({
  playthroughs,
  game,
}: PlaythroughsScoreListProps) => {
  const { deletePlaythrough } = useStore();

  if (playthroughs.length === 0) {
    return <p className="empty">Пока нет партий</p>;
  }

  return (
    <ul className="list">
      {playthroughs.map((playthrough) => (
        <li key={playthrough.id}>
          <ListItemCard
            link={Routes.Playthrough(game.id, playthrough.id)}
            title={`Партия ${playthrough.sequenceNumber}`}
            description={formatDate(playthrough.createdAt)}
            content={
              <ScoreSummary
                players={game.players}
                scores={playthrough.scores}
              />
            }
            action={
              <ConfirmDeleteButton
                deleteLabel="Удалить партию"
                confirmHeading={`Удалить партию ${playthrough.sequenceNumber}?`}
                confirmBody="Счёт этой партии пропадёт. Это нельзя отменить."
                onConfirm={async () => {
                  try {
                    await deletePlaythrough(playthrough.id);
                    toastStorageSuccess(
                      `Партия ${playthrough.sequenceNumber} удалена`,
                    );
                  } catch (error) {
                    toastStorageError('Не удалось удалить партию', error);
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

export { PlaythroughsScoreList };
