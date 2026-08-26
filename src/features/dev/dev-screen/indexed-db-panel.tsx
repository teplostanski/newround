'use client';

import { useState } from 'react';
import { AlertDialog, Button } from '@heroui/react';
import { cn } from '@/shared/lib/cn';
import { useStore } from '@/shared/model/store';

export const IndexedDbPanel = () => {
  const { games, playthroughs, rounds, clearAll } = useStore();
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
      await clearAll();
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
      <Button
        fullWidth
        variant="danger"
        isDisabled={isEmpty || isPending}
        onPress={() => setOpen(true)}
      >
        Очистить
      </Button>

      <AlertDialog.Backdrop isOpen={isOpen} onOpenChange={setOpen}>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>
                Удалить все игры, партии и раунды?
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>База IndexedDB будет стерта. Это нельзя отменить.</p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary" isDisabled={isPending}>
                Отмена
              </Button>
              <Button
                variant="danger"
                isPending={isPending}
                onPress={() => {
                  void handleWipe();
                }}
              >
                Очистить
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
  );
};
