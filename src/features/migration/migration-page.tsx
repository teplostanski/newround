'use client';

import { useEffect, useState } from 'react';
import { legacyGamesToTables } from '@/shared/model/legacy-games';
import { useStore } from '@/shared/model/store';
import { useRouter } from 'next/navigation';

export const MigrationPage = () => {
  const [savedText, setSavedText] = useState<string | null>(null);
  const [hasRead, setHasRead] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { importTables } = useStore();
  const router = useRouter()

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
    await importTables(tables)
    router.push('/')
  };

  return (
    <div>
      {!hasRead && <p>Подождите...</p>}
      {hasRead && savedText === null && <p>Старых данных нет</p>}
      {err && <p>{err}</p>}
      {hasRead && savedText && <p>Нашли сохранённые игры</p>}
      Игр: {gamesCount} Сессий : {sessionsCount} Раундов: {roundsCount}
      {hasRead && savedText && (
        <wa-button
          className="wa-block"
          style={{ marginTop: '20px' }}
          type="button"
          variant="brand"
          appearance="accent"
          onClick={handleTransfer}
        >
          Перенести
        </wa-button>
      )}
    </div>
  );
};
