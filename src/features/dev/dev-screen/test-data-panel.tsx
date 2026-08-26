'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { cn } from '@/shared/lib/cn';
import { TEST_DATA_FLAG } from '@/shared/model/types';
import { useStore } from '@/shared/model/store';
import styles from './test-data-panel.module.css';

type Pending = 'seed' | 'remove' | null;

export const TestDataPanel = () => {
  const { games, seedTestData, removeTestData } = useStore();
  const [pending, setPending] = useState<Pending>(null);
  const testCount = games.filter(
    (game) => game.isTestData === TEST_DATA_FLAG,
  ).length;
  const isPending = pending !== null;

  const handleSeed = async () => {
    if (isPending) {
      return;
    }

    setPending('seed');

    try {
      await seedTestData();
    } finally {
      setPending(null);
    }
  };

  const handleRemove = async () => {
    if (isPending) {
      return;
    }

    setPending('remove');

    try {
      await removeTestData();
    } finally {
      setPending(null);
    }
  };

  return (
    <>
      <p className={cn(testCount === 0 ? 'empty' : 'muted')}>
        {testCount === 0
          ? 'Тестовых игр нет'
          : `Тестовых игр: ${testCount}`}
      </p>
      <div className={styles.stack}>
        <Button
          fullWidth
          variant="secondary"
          isDisabled={isPending}
          isPending={pending === 'seed'}
          onPress={() => {
            void handleSeed();
          }}
        >
          Добавить 10×10×10
        </Button>
        <Button
          fullWidth
          variant="danger"
          isDisabled={testCount === 0 || isPending}
          isPending={pending === 'remove'}
          onPress={() => {
            void handleRemove();
          }}
        >
          Удалить тестовые
        </Button>
      </div>
    </>
  );
};
