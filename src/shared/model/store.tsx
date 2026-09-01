'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { nanoid } from 'nanoid';
import { defu } from 'defu';
import { db, resetDatabase } from './db';
import { deleteTestData, insertTestData } from './test-data';
import type {
  EditGameData,
  Game,
  CreateGameData,
  Playthrough,
  Round,
} from './types';

type CreatedGame = {
  gameId: string;
  playthroughId: string;
};

type StoreValue = {
  isReady: boolean;
  games: Game[];
  playthroughs: Playthrough[];
  rounds: Round[];
  createGame: (data: CreateGameData) => CreatedGame;
  editGame: (data: EditGameData, id: string) => void;
  deleteGame: (gameId: string) => Promise<void>;
  addPlaythrough: (gameId: string) => string | null;
  deletePlaythrough: (playthroughId: string) => Promise<void>;
  addRound: (gameId: string, playthroughId: string) => string | null;
  deleteRound: (roundId: string) => Promise<void>;
  updateScore: (roundId: string, playerId: string, score: number) => void;
  seedTestData: () => Promise<void>;
  removeTestData: () => Promise<void>;
  resetAll: () => Promise<void>;
};

const StoreContext = createContext<StoreValue | null>(null);

export const findById = <T extends { id: string }>(
  items: T[],
  id: string | null,
) => (id ? items.find((item) => item.id === id) : undefined);

const loadTables = () =>
  Promise.all([
    db.games.orderBy('createdAt').reverse().toArray(),
    db.playthroughs.orderBy('createdAt').reverse().toArray(),
    db.rounds.orderBy('createdAt').reverse().toArray(),
  ]);

const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [playthroughs, setPlaythroughs] = useState<Playthrough[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);

  const refreshFromDb = useCallback(async () => {
    const [loadedGames, loadedPlaythroughs, loadedRounds] = await loadTables();

    setGames(loadedGames);
    setPlaythroughs(loadedPlaythroughs);
    setRounds(loadedRounds);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [loadedGames, loadedPlaythroughs, loadedRounds] =
        await loadTables();

      if (cancelled) {
        return;
      }

      setGames(loadedGames);
      setPlaythroughs(loadedPlaythroughs);
      setRounds(loadedRounds);
      setIsReady(true);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const createGame = useCallback((data: CreateGameData): CreatedGame => {
    const gameId = nanoid();
    const playthroughId = nanoid();
    const now = Date.now();
    const game: Game = {
      id: gameId,
      name: data.name,
      players: data.players,
      createdAt: now,
      updatedAt: now,
    };
    const playthrough: Playthrough = {
      id: playthroughId,
      gameId,
      sequenceNumber: 1,
      createdAt: now,
      updatedAt: now,
    };

    setGames((current) => [game, ...current]);
    setPlaythroughs((current) => [playthrough, ...current]);
    void db.transaction('rw', db.games, db.playthroughs, async () => {
      await db.games.add(game);
      await db.playthroughs.add(playthrough);
    });

    return { gameId, playthroughId };
  }, []);

  const editGame = useCallback(
    (data: EditGameData, id: string) => {
      const game = findById(games, id);

      if (!game) {
        return null;
      }

      const patchedGame = defu(data, game);

      setGames((current) => [
        patchedGame,
        ...current.filter((game) => game.id !== id),
      ]);
      void db.transaction('rw', db.games, async () => {
        await db.games.put(patchedGame);
      });
    },
    [games],
  );

  const deleteGame = useCallback(async (gameId: string) => {
    try {
      await db.transaction('rw', db.games, db.playthroughs, db.rounds, () =>
        db.games.delete(gameId),
      );

      setGames((current) => current.filter((game) => game.id !== gameId));
      setPlaythroughs((current) =>
        current.filter((playthrough) => playthrough.gameId !== gameId),
      );
      setRounds((current) =>
        current.filter((round) => round.gameId !== gameId),
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  const addPlaythrough = useCallback(
    (gameId: string) => {
      const game = findById(games, gameId);

      if (!game) {
        return null;
      }

      const id = nanoid();
      const now = Date.now();

      const gamePlaythroughs = playthroughs.filter(
        (playthrough) => playthrough.gameId === gameId,
      );

      const lastNumber = gamePlaythroughs.reduce((max, playthrough) => {
        return Math.max(max, playthrough.sequenceNumber);
      }, 0);

      const playthrough: Playthrough = {
        id,
        gameId,
        sequenceNumber: lastNumber + 1,
        createdAt: now,
        updatedAt: now,
      };

      setPlaythroughs((current) => [playthrough, ...current]);
      void db.transaction('rw', db.playthroughs, async () => {
        await db.playthroughs.add(playthrough);
      });

      return playthrough.id;
    },
    [games, playthroughs],
  );

  const deletePlaythrough = useCallback(async (playthroughId: string) => {
    try {
      await db.transaction('rw', db.playthroughs, db.rounds, () =>
        db.playthroughs.delete(playthroughId),
      );

      setPlaythroughs((current) =>
        current.filter((playthrough) => playthrough.id !== playthroughId),
      );
      setRounds((current) =>
        current.filter((round) => round.playthroughId !== playthroughId),
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  const addRound = useCallback(
    (gameId: string, playthroughId: string) => {
      const game = findById(games, gameId);
      const playthrough = findById(playthroughs, playthroughId);

      if (!game || !playthrough) {
        return null;
      }

      const now = Date.now();
      const playthroughRounds = rounds.filter(
        (round) => round.playthroughId === playthroughId,
      );

      const lastNumber = playthroughRounds.reduce((max, round) => {
        return Math.max(max, round.sequenceNumber);
      }, 0);

      const round: Round = {
        id: nanoid(),
        gameId,
        playthroughId,
        sequenceNumber: lastNumber + 1,
        scores: Object.fromEntries(
          game.players.map((player) => [player.id, 0]),
        ),
        createdAt: now,
        updatedAt: now,
      };

      setRounds((current) => [round, ...current]);
      void db.rounds.add(round);

      return round.id;
    },
    [games, playthroughs, rounds],
  );

  const deleteRound = useCallback(async (roundId: string) => {
    try {
      await db.transaction('rw', db.rounds, () => db.rounds.delete(roundId));

      setRounds((current) => current.filter((round) => round.id !== roundId));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const updateScore = useCallback(
    (roundId: string, playerId: string, score: number) => {
      const round = findById(rounds, roundId);

      if (!round) {
        return;
      }

      const now = Date.now();
      const scores = { ...round.scores, [playerId]: score };

      setRounds((current) =>
        current.map((candidate) =>
          candidate.id !== roundId
            ? candidate
            : { ...candidate, scores, updatedAt: now },
        ),
      );
      void db.rounds.update(roundId, { scores, updatedAt: now });
    },
    [rounds],
  );

  const seedTestData = useCallback(async () => {
    await insertTestData();
    await refreshFromDb();
  }, [refreshFromDb]);

  const removeTestData = useCallback(async () => {
    await deleteTestData();
    await refreshFromDb();
  }, [refreshFromDb]);

  const resetAll = useCallback(async () => {
    await resetDatabase();
    setGames([]);
    setPlaythroughs([]);
    setRounds([]);
  }, []);

  const value = useMemo(
    () => ({
      isReady,
      games,
      playthroughs,
      rounds,
      createGame,
      editGame,
      deleteGame,
      addPlaythrough,
      deletePlaythrough,
      addRound,
      deleteRound,
      updateScore,
      seedTestData,
      removeTestData,
      resetAll,
    }),
    [
      isReady,
      games,
      playthroughs,
      rounds,
      createGame,
      editGame,
      deleteGame,
      addPlaythrough,
      deletePlaythrough,
      addRound,
      deleteRound,
      updateScore,
      seedTestData,
      removeTestData,
      resetAll,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error('useStore must be used inside StoreProvider');
  }

  return store;
};

export { StoreProvider };
