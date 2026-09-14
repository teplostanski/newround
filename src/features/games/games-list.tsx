'use client';

import { useState } from 'react';
import { Pencil, TrashBin, EllipsisVertical } from '@gravity-ui/icons';
import { Button, Label } from '@heroui/react';
import { ScoringModes } from '@/shared/constants';
import type { Game } from '@/shared/model/types';
import { Routes } from '@/shared/lib/routes';
import {
  toastStorageError,
  toastStorageSuccess,
} from '@/shared/lib/storage-toast';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { useStore } from '@/shared/model/store';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog/confirm-dialog';
import { ListItemCard } from '@/shared/ui/list-item-card/list-item-card';
import {
  AppDropdown,
  DropdownItem,
} from '@/shared/ui/app-dropdown/app-dropdown';
import { useRouter } from 'next/navigation';

type GamesListProps = {
  games: Game[];
};

type GameItemActionsProps = {
  game: Game;
  onDelete: (gameId: string) => void;
};

const GameItemActions = ({ game, onDelete }: GameItemActionsProps) => {
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();

  const actions = {
    delete: () => setConfirmOpen(true),
    edit: () =>
      router.push(Routes.GameEdit(game.id), {
        transitionTypes: routeTransitionTypes.forward,
      }),
  };

  const items: DropdownItem<keyof typeof actions>[] = [
    {
      key: 'edit',
      textValue: 'Изменить',
      slot: (
        <>
          <Pencil className="size-4 shrink-0 text-muted" />
          <Label>Изменить</Label>
        </>
      ),
      isDanger: false,
      disabled: false,
    },
    {
      key: 'delete',
      textValue: 'Удалить',
      slot: (
        <>
          <TrashBin className="size-4 shrink-0 text-danger" />
          <Label>Удалить</Label>
        </>
      ),
      isDanger: true,
      disabled: false,
    },
  ];

  return (
    <>
      <AppDropdown
        items={items}
        onAction={(key) => actions[key]()}
      >
        <Button
          isIconOnly
          aria-label={`Действия с игрой «${game.name}»`}
          variant="ghost"
          size="sm"
        >
          <EllipsisVertical />
        </Button>
      </AppDropdown>
      <ConfirmDialog
        isOpen={isConfirmOpen}
        heading={`Удалить игру «${game.name}»?`}
        body={
          game.scoringMode === ScoringModes.Rounds
            ? 'Партии и раунды этой игры пропадут. Это нельзя отменить.'
            : 'Партии и счёт этой игры пропадут. Это нельзя отменить.'
        }
        confirmLabel="Удалить"
        onOpenChange={setConfirmOpen}
        onConfirm={() => {
          onDelete(game.id);
          setConfirmOpen(false);
        }}
      />
    </>
  );
};

const GamesList = ({ games }: GamesListProps) => {
  const { deleteGame } = useStore();

  if (games.length === 0) {
    return <p className="empty">Пока нет игр — создайте первую</p>;
  }

  return (
    <ul className="list">
      {games.map((game) => (
        <li key={game.id}>
          <ListItemCard
            link={Routes.Game(game.id)}
            title={game.name}
            description={`${game.players.length} ${
              game.players.length === 1 ? 'игрок' : 'игроков'
            }`}
            action={
              <GameItemActions
                game={game}
                onDelete={async (gameId) => {
                  try {
                    await deleteGame(gameId);
                    toastStorageSuccess(`Игра «${game.name}» удалена`);
                  } catch (error) {
                    toastStorageError('Не удалось удалить игру', error);
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

export { GamesList };
