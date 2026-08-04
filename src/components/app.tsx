import { useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { nanoid } from 'nanoid';
import { InstallApp } from './install-app';
import { AllGamesScreen } from './all-games-screen';
import styles from './app.module.css';
import { SetupNewGameScreen, type NewGameData } from './setup-new-game-screen';
import { RoundScreen } from './round-screen';
import { SessionListScreen } from './sessions-screen';
import { SessionScreen } from './session-screen';

type ID = { id: string };

export type Player = ID & {
  name: string;
};

export type ScoreMap = Record<string, number>;

export type Round = ID & {
  scores: ScoreMap;
};

export type Session = ID & {
  timestamp: number;
  rounds: Round[];
};

export type Game = ID & {
  name: string;
  players: Player[];
  sessions: Session[];
};

const Screens = {
  AllGames: 'all-games',
  NewGame: 'new-game',
  Sessions: 'sessions',
  Session: 'session',
  Round: 'round',
} as const;

type ScreenValue = (typeof Screens)[keyof typeof Screens];

const setupScores = (players: Player[]): ScoreMap =>
  Object.fromEntries(players.map((p) => [p.id, 0]));

const addRound = (
  games: Game[],
  gameId: string,
  sessionId: string,
  round: Round,
): Game[] =>
  games.map((game) =>
    game.id !== gameId
      ? game
      : {
          ...game,
          sessions: game.sessions.map((session) =>
            session.id !== sessionId
              ? session
              : { ...session, rounds: [...session.rounds, round] },
          ),
        },
  );

const updateRoundScores = (
  games: Game[],
  gameId: string,
  sessionId: string,
  roundId: string,
  scores: ScoreMap,
): Game[] =>
  games.map((game) =>
    game.id !== gameId
      ? game
      : {
          ...game,
          sessions: game.sessions.map((session) =>
            session.id !== sessionId
              ? session
              : {
                  ...session,
                  rounds: session.rounds.map((round) =>
                    round.id !== roundId ? round : { ...round, scores },
                  ),
                },
          ),
        },
  );

const isScreenValue = (value: string): value is ScreenValue =>
  Object.values(Screens).includes(value as ScreenValue);

const resolveScreen = (
  screen: ScreenValue,
  game: Game | undefined,
  session: Session | undefined,
  round: Round | undefined,
): ScreenValue => {
  if (screen === Screens.Sessions && !game) {
    return Screens.AllGames;
  }

  if (screen === Screens.Session) {
    if (!game) {
      return Screens.AllGames;
    }

    if (!session) {
      return Screens.Sessions;
    }
  }

  if (screen === Screens.Round) {
    if (!game) {
      return Screens.AllGames;
    }

    if (!session) {
      return Screens.Sessions;
    }

    if (!round) {
      return Screens.Session;
    }
  }

  return screen;
};

const App = () => {
  const [screen, setScreen] = useLocalStorageState<ScreenValue>(
    'newround:screen',
    { defaultValue: Screens.AllGames },
  );

  const [games, setGames] = useLocalStorageState<Game[]>('newround:games', {
    defaultValue: [],
  });
  const [currentGame, setCurrentGame] = useLocalStorageState<string | null>(
    'newround:currentGame',
    { defaultValue: null },
  );
  const [currentSession, setCurrentSession] = useLocalStorageState<
    string | null
  >('newround:currentSession', { defaultValue: null });
  const [currentRound, setCurrentRound] = useLocalStorageState<string | null>(
    'newround:currentRound',
    { defaultValue: null },
  );

  const game = games.find((g) => g.id === currentGame);
  const session = game?.sessions.find((s) => s.id === currentSession);
  const round = session?.rounds.find((r) => r.id === currentRound);
  const sessionNumber =
    game?.sessions.findIndex((s) => s.id === currentSession) ?? -1;
  const roundNumber =
    session?.rounds.findIndex((r) => r.id === currentRound) ?? -1;

  const activeScreen = isScreenValue(screen)
    ? resolveScreen(screen, game, session, round)
    : Screens.AllGames;

  useEffect(() => {
    if (!isScreenValue(screen)) {
      setScreen(Screens.AllGames);
      return;
    }

    if (activeScreen !== screen) {
      setScreen(activeScreen);
    }
  }, [activeScreen, screen, setScreen]);

  const handleBack = () => {
    switch (activeScreen) {
      case Screens.NewGame:
      case Screens.Sessions:
        setScreen(Screens.AllGames);
        break;
      case Screens.Session:
        setCurrentRound(null);
        setScreen(Screens.Sessions);
        break;
      case Screens.Round:
        setCurrentRound(null);
        setScreen(Screens.Session);
        break;
    }
  };

  const handleHome = () => {
    setCurrentRound(null);
    setScreen(Screens.AllGames);
  };

  const handleStartNewGame = (formData: NewGameData) => {
    const gameId = nanoid();
    const sessionId = nanoid();

    setGames((prev) => [
      ...prev,
      {
        id: gameId,
        name: formData.name,
        players: formData.players,
        sessions: [
          {
            id: sessionId,
            timestamp: Date.now(),
            rounds: [],
          },
        ],
      },
    ]);
    setCurrentGame(gameId);
    setCurrentSession(sessionId);
    setCurrentRound(null);
    setScreen(Screens.Session);
  };

  const handleNewGame = () => {
    setScreen(Screens.NewGame);
  };

  const handleOpenGame = (id: string) => {
    setCurrentGame(id);
    setCurrentSession(null);
    setCurrentRound(null);
    setScreen(Screens.Sessions);
  };

  const handleOpenSession = (sessionId: string) => {
    setCurrentSession(sessionId);
    setCurrentRound(null);
    setScreen(Screens.Session);
  };

  const handleStartRound = () => {
    if (!game || !session) {
      return;
    }

    const roundId = nanoid();
    const newRound: Round = {
      id: roundId,
      scores: setupScores(game.players),
    };

    setGames((prev) => addRound(prev, game.id, session.id, newRound));
    setCurrentRound(roundId);
    setScreen(Screens.Round);
  };

  const handleOpenRound = (roundId: string) => {
    setCurrentRound(roundId);
    setScreen(Screens.Round);
  };

  const handleFinishRound = () => {
    setCurrentRound(null);
    setScreen(Screens.Session);
  };

  const handleScoreChange = (playerId: string, newValue: number) => {
    if (!game || !session || !round) {
      return;
    }

    setGames((prev) =>
      updateRoundScores(prev, game.id, session.id, round.id, {
        ...round.scores,
        [playerId]: newValue,
      }),
    );
  };

  const Titles: Record<ScreenValue, string> = {
    [Screens.AllGames]: 'Игры',
    [Screens.NewGame]: 'Новая игра',
    [Screens.Sessions]: game?.name ?? 'Сессии',
    [Screens.Session]: 'Сессия',
    [Screens.Round]:
      sessionNumber >= 0 && roundNumber >= 0
        ? `Сессия ${sessionNumber + 1} · Партия ${roundNumber + 1}`
        : 'Партия',
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerBar}>
          <div className={styles.nav}>
            {activeScreen !== Screens.AllGames && (
              <>
                <button
                  className={styles.navBtn}
                  type="button"
                  onClick={handleBack}
                >
                  Назад
                </button>
                <button
                  className={styles.navBtn}
                  type="button"
                  onClick={handleHome}
                >
                  Главная
                </button>
              </>
            )}
          </div>
          <InstallApp />
        </div>
        <h1 className={styles.brand}>{Titles[activeScreen]}</h1>
      </header>
      {activeScreen === Screens.AllGames && (
        <AllGamesScreen
          games={games}
          onCreateNewGame={handleNewGame}
          onOpenGame={handleOpenGame}
        />
      )}
      {activeScreen === Screens.NewGame && (
        <SetupNewGameScreen onCreateGame={handleStartNewGame} />
      )}
      {activeScreen === Screens.Sessions && game && (
        <SessionListScreen game={game} onOpenSession={handleOpenSession} />
      )}
      {activeScreen === Screens.Session && game && session && (
        <SessionScreen
          game={game}
          session={session}
          onStartRound={handleStartRound}
          onOpenRound={handleOpenRound}
        />
      )}
      {activeScreen === Screens.Round && game && round && roundNumber >= 0 && (
        <RoundScreen
          players={game.players}
          scores={round.scores}
          onChangeScore={handleScoreChange}
          onFinishRound={handleFinishRound}
        />
      )}
    </div>
  );
};

export { App };
