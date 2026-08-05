'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { nanoid } from 'nanoid';
import useLocalStorageState from 'use-local-storage-state';
import {
  appendRound,
  createGame,
  createRound,
  setRoundScore,
  type Game,
  type NewGameData,
} from '@/domain/game';

type CreatedGame = {
  gameId: string;
  sessionId: string;
};

type GamesStoreValue = {
  games: Game[];
  addGame: (data: NewGameData) => CreatedGame;
  addRound: (gameId: string, sessionId: string) => string | null;
  updateScore: (
    gameId: string,
    sessionId: string,
    roundId: string,
    playerId: string,
    score: number,
  ) => void;
};

const GamesStoreContext = createContext<GamesStoreValue | null>(null);

export const GamesStoreProvider = ({ children }: { children: ReactNode }) => {
  const [games, setGames] = useLocalStorageState<Game[]>('newround:games', {
    defaultValue: [],
    defaultServerValue: [],
  });

  const addGame = useCallback(
    (data: NewGameData): CreatedGame => {
      const gameId = nanoid();
      const sessionId = nanoid();
      const game = createGame({
        ...data,
        gameId,
        sessionId,
        timestamp: Date.now(),
      });

      setGames((current) => [...current, game]);

      return { gameId, sessionId };
    },
    [setGames],
  );

  const addRound = useCallback(
    (gameId: string, sessionId: string) => {
      const game = games.find((candidate) => candidate.id === gameId);
      const session = game?.sessions.find(
        (candidate) => candidate.id === sessionId,
      );

      if (!game || !session) {
        return null;
      }

      const round = createRound(nanoid(), game.players);
      setGames((current) =>
        appendRound(current, gameId, sessionId, round),
      );

      return round.id;
    },
    [games, setGames],
  );

  const updateScore = useCallback(
    (
      gameId: string,
      sessionId: string,
      roundId: string,
      playerId: string,
      score: number,
    ) => {
      setGames((current) =>
        setRoundScore(
          current,
          gameId,
          sessionId,
          roundId,
          playerId,
          score,
        ),
      );
    },
    [setGames],
  );

  const value = useMemo(
    () => ({ games, addGame, addRound, updateScore }),
    [games, addGame, addRound, updateScore],
  );

  return (
    <GamesStoreContext.Provider value={value}>
      {children}
    </GamesStoreContext.Provider>
  );
};

export const useGamesStore = () => {
  const store = useContext(GamesStoreContext);

  if (!store) {
    throw new Error('useGamesStore must be used inside GamesStoreProvider');
  }

  return store;
};
