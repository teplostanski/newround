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

type CreateGameResult = {
  gameId: string;
  playthroughId: string;
  roundId: string;
};

type StoreValue = {
  isReady: boolean;
  games: Game[];
  playthroughs: Playthrough[];
  rounds: Round[];
  createGame: (data: CreateGameData) => Promise<CreateGameResult | undefined>;
  editGame: (data: EditGameData, id: string) => Promise<void>;
  deleteGame: (gameId: string) => Promise<void>;
  addPlaythrough: (gameId: string) => Promise<string | undefined>;
  deletePlaythrough: (playthroughId: string) => Promise<void>;
  addRound: (
    gameId: string,
    playthroughId: string,
  ) => Promise<string | undefined>;
  deleteRound: (roundId: string) => Promise<void>;
  updateScore: (
    roundId: string,
    playerId: string,
    score: number,
  ) => Promise<void>;
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

  const createGame = useCallback(
    async (data: CreateGameData): Promise<CreateGameResult | undefined> => {
      const gameId = nanoid();
      const playthroughId = nanoid();
      const roundId = nanoid();
      const now = Date.now();
      const initSequenceNumber = 1;

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
        sequenceNumber: initSequenceNumber,
        createdAt: now,
        updatedAt: now,
      };
      const round: Round = {
        id: roundId,
        gameId,
        playthroughId,
        sequenceNumber: initSequenceNumber,
        scores: Object.fromEntries(
          data.players.map((player) => [player.id, 0]),
        ),
        createdAt: now,
        updatedAt: now,
      };

      try {
        await db.transaction(
          'rw',
          db.games,
          db.playthroughs,
          db.rounds,
          async () => {
            await db.games.add(game);
            await db.playthroughs.add(playthrough);
            await db.rounds.add(round);
          },
        );

        setGames((current) => [game, ...current]);
        setPlaythroughs((current) => [playthrough, ...current]);
        setRounds((current) => [round, ...current]);

        return { gameId, playthroughId, roundId };
      } catch (error) {
        console.error(error);
        throw error
      }
    },
    [],
  );

  const editGame = useCallback(
    async (data: EditGameData, id: string) => {
      const game = findById(games, id);

      if (!game) {
        return;
      }

      const patchedGame = defu(data, game);

      try {
        await db.games.put(patchedGame);

        setGames((current) =>
          current.map((game) => (game.id !== id ? game : patchedGame)),
        );
      } catch (error) {
        console.error(error);
        throw error
      }
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
      throw error
    }
  }, []);

  const addPlaythrough = useCallback(
    async (gameId: string) => {
      const game = findById(games, gameId);

      if (!game) {
        return;
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

      try {
        await db.playthroughs.add(playthrough);

        setPlaythroughs((current) => [playthrough, ...current]);

        return playthrough.id;
      } catch (error) {
        console.error(error);
        throw error
      }
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
      throw error
    }
  }, []);

  const addRound = useCallback(
    async (gameId: string, playthroughId: string) => {
      const game = findById(games, gameId);
      const playthrough = findById(playthroughs, playthroughId);

      if (!game || !playthrough) {
        return;
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

      try {
        await db.rounds.add(round);

        setRounds((current) => [round, ...current]);

        return round.id;
      } catch (error) {
        console.error(error);
        throw error
      }
    },
    [games, playthroughs, rounds],
  );

  const deleteRound = useCallback(async (roundId: string) => {
    try {
      await db.rounds.delete(roundId);

      setRounds((current) => current.filter((round) => round.id !== roundId));
    } catch (error) {
      console.error(error);
      throw error
    }
  }, []);

  const updateScore = useCallback(
    async (roundId: string, playerId: string, score: number) => {
      const round = findById(rounds, roundId);

      if (!round) {
        return;
      }

      const now = Date.now();
      const scores = { ...round.scores, [playerId]: score };

      try {
        await db.rounds.update(roundId, { scores, updatedAt: now });

        setRounds((current) =>
          current.map((round) =>
            round.id !== roundId ? round : { ...round, scores, updatedAt: now },
          ),
        );
      } catch (error) {
        console.error(error);
        throw error
      }
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
