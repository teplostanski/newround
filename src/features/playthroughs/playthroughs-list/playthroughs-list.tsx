'use client';

import { routes } from '@/shared/lib/routes';
import type { Playthrough } from '@/shared/model/types';
import { useStore } from '@/shared/model/store';
import { ConfirmDeleteButton } from '@/shared/ui/confirm-delete-button/confirm-delete-button';
import { ListItemCard } from '@/shared/ui/list-item-card/list-item-card';

type PlaythroughsListProps = {
  gameId: string;
  playthroughs: Playthrough[];
};

const formatDate = (createdAt: number) =>
  new Date(createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

const PlaythroughsList = ({
  gameId,
  playthroughs,
}: PlaythroughsListProps) => {
  const { deletePlaythrough } = useStore();

  return (
    <div className="screen">
      {playthroughs.length === 0 ? (
        <p className="empty">Пока нет партий</p>
      ) : (
        <ul className="list">
          {playthroughs.map((playthrough) => (
            <li key={playthrough.id}>
              <ListItemCard
                link={routes.playthrough(gameId, playthrough.id)}
                title={`Партия ${playthrough.sequenceNumber}`}
                description={formatDate(playthrough.createdAt)}
                action={
                  <ConfirmDeleteButton
                    deleteLabel="Удалить партию"
                    confirmHeading={`Удалить партию ${playthrough.sequenceNumber}?`}
                    confirmBody="Раунды этой партии пропадут. Это нельзя отменить."
                    onConfirm={() => {
                      void deletePlaythrough(playthrough.id);
                    }}
                  />
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { PlaythroughsList };
