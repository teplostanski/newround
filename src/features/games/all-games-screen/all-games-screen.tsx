'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, TrashBin, EllipsisVertical } from '@gravity-ui/icons';
import { Button, Label } from '@heroui/react';
import type { Game } from '@/shared/model/types';
import { routes } from '@/shared/lib/routes';
import { routeTransitionTypes } from '@/shared/lib/view-transitions';
import { useStore } from '@/shared/model/store';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog/confirm-dialog';
import { ListItemCard } from '@/shared/ui/list-item-card/list-item-card';
import {
  AppDropdown,
  DropdownItem,
} from '@/shared/ui/app-dropdown/app-dropdown';

type AllGamesScreenProps = {
  games: Game[];
};

type GameItemActionsProps = {
  game: Game;
  onDelete: (gameId: string) => void;
};

const GameItemActions = ({ game, onDelete }: GameItemActionsProps) => {
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const items: DropdownItem[] = [
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
      disabled: true,
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
        onAction={(key) => {
          if (key === 'delete') {
            setConfirmOpen(true);
          }
        }}
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
        body="Партии и раунды этой игры пропадут. Это нельзя отменить."
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

const AllGamesScreen = ({ games }: AllGamesScreenProps) => {
  const { deleteGame } = useStore();

  return (
    <div className="screen">
      <Link
        href={routes.gameCreate}
        className="primaryActionLink"
        transitionTypes={routeTransitionTypes.forward}
      >
        Новая игра
      </Link>

      {games.length === 0 ? (
        <p className="empty">Пока нет игр — создайте первую</p>
      ) : (
        <ul className="list">
          {games.map((game) => (
            <li key={game.id}>
              <ListItemCard
                link={routes.game(game.id)}
                title={game.name}
                description={`${game.players.length} ${
                  game.players.length === 1 ? 'игрок' : 'игроков'
                }`}
                action={
                  <GameItemActions
                    game={game}
                    onDelete={(gameId) => {
                      void deleteGame(gameId);
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

export { AllGamesScreen };
