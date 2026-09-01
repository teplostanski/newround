'use client';

import { useState } from 'react';
import { cn } from '@/shared/lib/cn';
import { useStore } from '@/shared/model/store';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog/confirm-dialog';
import { PrimaryAction } from '@/shared/ui/primary-action/primary-action';

const IndexedDbPanel = () => {
  const { games, playthroughs, rounds, resetAll } = useStore();
  const [isOpen, setOpen] = useState(false);
  const [isPending, setPending] = useState(false);
  const isEmpty =
    games.length === 0 && playthroughs.length === 0 && rounds.length === 0;

  const handleWipe = async () => {
    if (isPending) {
      return;
    }

    setPending(true);

    try {
      await resetAll();
      setOpen(false);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <p className={cn(isEmpty ? 'empty' : 'muted')}>
        {isEmpty
          ? 'Пусто'
          : `Игры: ${games.length} · Партии: ${playthroughs.length} · Раунды: ${rounds.length}`}
      </p>
      <PrimaryAction
        variant="danger"
        isDisabled={isEmpty || isPending}
        onPress={() => setOpen(true)}
      >
        Очистить
      </PrimaryAction>

      <ConfirmDialog
        isOpen={isOpen}
        heading="Удалить все игры, партии и раунды?"
        body="База IndexedDB будет стерта. Это нельзя отменить."
        confirmLabel="Очистить"
        isPending={isPending}
        onOpenChange={setOpen}
        onConfirm={() => {
          void handleWipe();
        }}
      />
    </>
  );
};

export { IndexedDbPanel };
