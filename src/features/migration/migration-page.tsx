'use client';

import { useEffect, useState } from 'react';
import { Button, Card } from '@heroui/react';
import { legacyGamesToTables } from '@/shared/model/legacy-games';
import { useStore } from '@/shared/model/store';
import { useRouter } from 'next/navigation';

export const MigrationPage = () => {
  const [savedText, setSavedText] = useState<string | null>(null);
  const [hasRead, setHasRead] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { importTables } = useStore();
  const router = useRouter();

  let gamesCount = 0;
  let sessionsCount = 0;
  let roundsCount = 0;

  useEffect(() => {
    setSavedText(localStorage.getItem('newround:games'));
    setHasRead(true);
  }, []);

  if (savedText) {
    try {
      const games = JSON.parse(savedText);

      if (!Array.isArray(games)) {
        throw new Error('не получилось');
      }

      for (const game of games) {
        gamesCount++;
        sessionsCount += game.sessions.length;
        for (const session of game.sessions) {
          roundsCount += session.rounds.length;
        }
      }
    } catch (error) {
      setErr(String(error));
    }
  }

  const handleTransfer = async () => {
    if (!savedText) {
      return;
    }

    const games = JSON.parse(savedText);

    if (!Array.isArray(games)) {
      return;
    }

    const tables = legacyGamesToTables(games, Date.now());
    await importTables(tables);
    router.push('/');
  };

  return (
    <div className="screen">
      {!hasRead && <p className="empty">Подождите...</p>}
      {hasRead && savedText === null && (
        <p className="empty">Старых данных нет</p>
      )}
      {err && <p className="empty">{err}</p>}
      {hasRead && savedText && (
        <Card className="w-full">
          <Card.Header>
            <Card.Title>Нашли сохранённые игры</Card.Title>
            <Card.Description>
              Игр: {gamesCount} · Сессий: {sessionsCount} · Раундов:{' '}
              {roundsCount}
            </Card.Description>
          </Card.Header>
        </Card>
      )}
      {hasRead && savedText && (
        <Button
          fullWidth
          onPress={() => {
            void handleTransfer();
          }}
        >
          Перенести
        </Button>
      )}
    </div>
  );
};
