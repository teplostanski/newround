'use client';

import { Button, Card } from '@heroui/react';
import { routes } from '@/shared/lib/routes';
import type { Game, Playthrough, Round, Scores } from '@/shared/model/types';
import { useStore } from '@/shared/model/store';
import { ConfirmDeleteButton } from '@/shared/ui/confirm-delete-button/confirm-delete-button';
import { ListItemCard } from '@/shared/ui/list-item-card/list-item-card';

type PlaythroughScreenProps = {
  game: Game;
  playthrough: Playthrough;
  rounds: Round[];
  onStartRound: () => void;
};

const formatPlaythroughDate = (createdAt: number) =>
  new Date(createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatRoundSummary = (players: Game['players'], scores: Scores) =>
  players
    .map((player) => `${player.name} — ${scores[player.id] ?? 0}`)
    .join(' · ');

const PlaythroughScreen = ({
  game,
  playthrough,
  rounds,
  onStartRound,
}: PlaythroughScreenProps) => {
  const { deleteRound } = useStore();

  return (
    <div className="screen">
      <Card className="w-full">
        <Card.Content>
          <p className="text-muted m-0 text-[0.95rem]">
            {game.name} · {formatPlaythroughDate(playthrough.createdAt)} ·{' '}
            {game.players.length}{' '}
            {game.players.length === 1 ? 'игрок' : 'игроков'}
          </p>
        </Card.Content>
      </Card>

      <Button fullWidth onPress={onStartRound}>
        Начать раунд
      </Button>

      {rounds.length === 0 ? (
        <p className="empty">Раундов пока нет — начните первый</p>
      ) : (
        <ul className="list">
          {rounds.map((round) => (
            <li key={round.id}>
              <ListItemCard
                href={routes.round(game.id, playthrough.id, round.id)}
                title={`Раунд ${round.sequenceNumber}`}
                description={formatRoundSummary(game.players, round.scores)}
                action={
                  <ConfirmDeleteButton
                    deleteLabel="Удалить раунд"
                    confirmHeading={`Удалить раунд ${round.sequenceNumber}?`}
                    confirmBody="Счёт этого раунда пропадёт. Это нельзя отменить."
                    onConfirm={() => {
                      void deleteRound(round.id);
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

export { PlaythroughScreen };
