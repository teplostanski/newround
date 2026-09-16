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
import { buildGame, buildPlaythrough, buildRound } from './entity-builders';
import { CompletionReasons, ScoringModes } from '@/shared/constants';
import { db, resetDatabase } from './db';
import { deleteTestData, insertTestData } from './test-data';
import type {
  EditGameData,
  Game,
  CreateGameData,
  Playthrough,
  Round,
  Completion,
  Scores,
} from './types';
import { PromiseExtended } from 'dexie';

type CreateGameResult =
  | {
      gameId: string;
      playthroughId: string;
      roundId: string;
      scoringMode: typeof ScoringModes.Rounds;
    }
  | {
      gameId: string;
      playthroughId: string;
      scoringMode: typeof ScoringModes.Playthrough;
    };

type AddPersistResult = {
  id: string;
  persist: PromiseExtended<void>;
};

type UpdateScoreData = {
  id: string;
  playerId: string;
  score: number;
};

type StoreValue = {
  isReady: boolean;
  games: Game[];
  playthroughs: Playthrough[];
  rounds: Round[];
  createGame: (data: CreateGameData) => Promise<CreateGameResult | undefined>;
  editGame: (data: EditGameData, id: string) => Promise<void>;
  deleteGame: (gameId: string) => Promise<void>;
  addPlaythrough: (gameId: string) => AddPersistResult | undefined;
  deletePlaythrough: (playthroughId: string) => Promise<void>;
  addRound: (
    gameId: string,
    playthroughId: string,
  ) => AddPersistResult | undefined;
  deleteRound: (roundId: string) => Promise<void>;
  updatePlaythroughScore: (data: UpdateScoreData) => Promise<void>;
  updateRoundScore: (data: UpdateScoreData) => Promise<void>;
  finishPlaythrough: (id: string) => Promise<void>;
  finishRound: (id: string) => Promise<void>;
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
      const now = Date.now();
      const initSequenceNumber = 1;
      const isRoundsMode = data.scoringMode === ScoringModes.Rounds;

      const game = buildGame({ id: gameId, createdAt: now, data });

      const playthrough = buildPlaythrough({
        id: playthroughId,
        gameId,
        sequenceNumber: initSequenceNumber,
        createdAt: now,
        players: data.players,
      });

      const round: Round | undefined = isRoundsMode
        ? buildRound({
            id: nanoid(),
            gameId,
            playthroughId,
            sequenceNumber: initSequenceNumber,
            createdAt: now,
            players: data.players,
          })
        : undefined;

      try {
        await db.transaction(
          'rw',
          db.games,
          db.playthroughs,
          db.rounds,
          async () => {
            await db.games.add(game);
            await db.playthroughs.add(playthrough);
            if (round) {
              await db.rounds.add(round);
            }
          },
        );

        setGames((current) => [game, ...current]);
        setPlaythroughs((current) => [playthrough, ...current]);
        if (round) {
          setRounds((current) => [round, ...current]);
        }

        const base = { gameId, playthroughId };

        if (round) {
          return {
            ...base,
            scoringMode: ScoringModes.Rounds,
            roundId: round.id,
          };
        }

        return { ...base, scoringMode: ScoringModes.Playthrough };
      } catch (error) {
        console.error(error);
        throw error;
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
        throw error;
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
      throw error;
    }
  }, []);

  const addPlaythrough = useCallback(
    (gameId: string): AddPersistResult | undefined => {
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

      const playthrough = buildPlaythrough({
        id,
        gameId,
        sequenceNumber: lastNumber + 1,
        createdAt: now,
        players: game.players,
      });

      setPlaythroughs((current) => [playthrough, ...current]);
      const persist = db
        .transaction('rw', db.playthroughs, async () => {
          await db.playthroughs.add(playthrough);
        })
        .catch((error) => {
          setPlaythroughs((current) => current.filter((p) => p.id !== id));
          console.error(error);
          throw error;
        });

      return { id: playthrough.id, persist };
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
      throw error;
    }
  }, []);

  const addRound = useCallback(
    (gameId: string, playthroughId: string): AddPersistResult | undefined => {
      const game = findById(games, gameId);
      const playthrough = findById(playthroughs, playthroughId);

      if (!game || !playthrough) {
        return;
      }

      if (game.scoringMode !== ScoringModes.Rounds) {
        return;
      }

      const id = nanoid();
      const now = Date.now();
      const playthroughRounds = rounds.filter(
        (round) => round.playthroughId === playthroughId,
      );

      const lastNumber = playthroughRounds.reduce((max, round) => {
        return Math.max(max, round.sequenceNumber);
      }, 0);

      const round = buildRound({
        id,
        gameId,
        playthroughId,
        sequenceNumber: lastNumber + 1,
        createdAt: now,
        players: game.players,
      });

      setRounds((current) => [round, ...current]);

      const persist = db
        .transaction('rw', db.rounds, async () => {
          await db.rounds.add(round);
        })
        .catch((error) => {
          setRounds((current) => current.filter((r) => r.id !== id));
          console.error(error);
          throw error;
        });

      return { id: round.id, persist };
    },
    [games, playthroughs, rounds],
  );

  const deleteRound = useCallback(async (roundId: string) => {
    try {
      await db.rounds.delete(roundId);

      setRounds((current) => current.filter((round) => round.id !== roundId));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, []);

  const updatePlaythroughScore = useCallback(
    async ({ id, playerId, score }: UpdateScoreData) => {
      const playthrough = findById(playthroughs, id);

      if (!playthrough?.scores) {
        return;
      }

      const now = Date.now();
      const scores = { ...playthrough.scores, [playerId]: score };

      try {
        await db.playthroughs.update(id, { scores, updatedAt: now });

        setPlaythroughs((current) =>
          current.map((item) =>
            item.id !== id ? item : { ...item, scores, updatedAt: now },
          ),
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [playthroughs],
  );

  const updateRoundScore = useCallback(
    async ({ id, playerId, score }: UpdateScoreData) => {
      const round = findById(rounds, id);

      if (!round) {
        return;
      }

      const now = Date.now();
      const scores = { ...round.scores, [playerId]: score };

      try {
        await db.rounds.update(id, { scores, updatedAt: now });

        setRounds((current) =>
          current.map((item) =>
            item.id !== id ? item : { ...item, scores, updatedAt: now },
          ),
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [rounds],
  );

  const finishRound = useCallback(
    async (id: string) => {
      const round = findById(rounds, id);

      if (!round || round.completion) {
        return;
      }

      const playthrough = findById(playthroughs, round.playthroughId);
      const game = findById(games, round.gameId);

      if (!playthrough || !game) {
        return;
      }

      const now = Date.now();

      const updatedScores: Scores = Object.fromEntries(
        game.players.map((player) => [
          player.id,
          playthrough.scores[player.id] + round.scores[player.id],
        ]),
      );

      //const scores = round.scores;
      //const scoreValues = Object.values(scores);
      //const min = Math.min(...scoreValues);
      //const max = Math.max(...scoreValues);

      //const highestScorePlayerIds = game.players
      //  .filter((player) => scores[player.id] === max)
      //  .map((player) => player.id);

      //const lowestScorePlayerIds = game.players
      //  .filter((player) => scores[player.id] === min)
      //  .map((player) => player.id);

      const initialCompletion: Completion = {
        reason: CompletionReasons.Manual,
        finishedAt: now,
        //highestScorePlayerIds,
        //lowestScorePlayerIds,
      };

      const duration = now - round.createdAt;

      try {
        await db.transaction('rw', db.playthroughs, db.rounds, async () => {
          await db.playthroughs.update(playthrough.id, {
            scores: updatedScores,
            updatedAt: now,
          });
          await db.rounds.update(round.id, {
            completion: initialCompletion,
            duration,
            updatedAt: now,
          });
        });

        setPlaythroughs((current) =>
          current.map((item) =>
            item.id !== playthrough.id
              ? item
              : { ...item, scores: updatedScores, updatedAt: now },
          ),
        );

        setRounds((current) =>
          current.map((item) =>
            item.id !== round.id
              ? item
              : { ...item, completion: initialCompletion, duration, updatedAt: now },
          ),
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [games, playthroughs, rounds],
  );

  const finishPlaythrough = useCallback(
    async (id: string) => {
      const playthrough = findById(playthroughs, id);

      if (!playthrough || playthrough.completion) {
        return;
      }

      const game = findById(games, playthrough.gameId);

      if (!game) {
        return;
      }

      const now = Date.now();

      const updatedScores: Scores = Object.fromEntries(
        game.players.map((player) => [
          player.id,
          playthrough.scores[player.id],
        ]),
      );

      //const scores = playthrough.scores;
      //const scoreValues = Object.values(scores);
      //const min = Math.min(...scoreValues);
      //const max = Math.max(...scoreValues);

      //const highestScorePlayerIds = game.players
      //  .filter((player) => scores[player.id] === max)
      //  .map((player) => player.id);

      //const lowestScorePlayerIds = game.players
      //  .filter((player) => scores[player.id] === min)
      //  .map((player) => player.id);

      const initialCompletion: Completion = {
        reason: CompletionReasons.Manual,
        finishedAt: now,
        //highestScorePlayerIds,
        //lowestScorePlayerIds,
      };

      const duration = now - playthrough.createdAt;

      try {
        await db.playthroughs.update(playthrough.id, {
          scores: updatedScores,
          completion: initialCompletion,
          duration,
          updatedAt: now,
        });

        setPlaythroughs((current) =>
          current.map((item) =>
            item.id !== playthrough.id
              ? item
              : {
                  ...item,
                  scores: updatedScores,
                  completion: initialCompletion,
                  duration,
                  updatedAt: now,
                },
          ),
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [games, playthroughs],
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
      updatePlaythroughScore,
      updateRoundScore,
      finishPlaythrough,
      finishRound,
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
      updatePlaythroughScore,
      updateRoundScore,
      finishPlaythrough,
      finishRound,
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
