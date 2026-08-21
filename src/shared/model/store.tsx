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
import { db } from './db';
import type { Game, NewGameData, Playthrough, Round } from './types';

type CreatedGame = {
  gameId: string;
  playthroughId: string;
};

type StoreValue = {
  isReady: boolean;
  games: Game[];
  playthroughs: Playthrough[];
  rounds: Round[];
  addGame: (data: NewGameData) => CreatedGame;
  addRound: (gameId: string, playthroughId: string) => string | null;
  updateScore: (roundId: string, playerId: string, score: number) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export const findById = <T extends { id: string }>(
  items: T[],
  id: string | null,
) => (id ? items.find((item) => item.id === id) : undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [playthroughs, setPlaythroughs] = useState<Playthrough[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [loadedGames, loadedPlaythroughs, loadedRounds] = await Promise.all(
        [
          db.games.orderBy('createdAt').reverse().toArray(),
          db.playthroughs.orderBy('createdAt').reverse().toArray(),
          db.rounds.orderBy('createdAt').reverse().toArray(),
        ],
      );

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

  const addGame = useCallback((data: NewGameData): CreatedGame => {
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
      const round: Round = {
        id: nanoid(),
        gameId,
        playthroughId,
        sequenceNumber: playthroughRounds.length + 1,
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

  const value = useMemo(
    () => ({
      isReady,
      games,
      playthroughs,
      rounds,
      addGame,
      addRound,
      updateScore,
    }),
    [addGame, addRound, games, isReady, playthroughs, rounds, updateScore],
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error('useStore must be used inside StoreProvider');
  }

  return store;
};
