import { useState } from 'react';
import { nanoid } from 'nanoid';
import { InstallApp } from './install-app';
import { AllGamesScreen } from './all-games-screen';
//import { SetupNewGameScreen } from './setup-screen';
//import { StatsScreen } from './stats-screen';
import styles from './app.module.css';
import { SetupNewGameScreen, type NewGameData } from './setup-new-game-screen';

type ID = { id: string };

export type Player = ID & {
  name: string;
};

export type ScoreMap = Record<string, number>;

type Round = ID & {
  scores: ScoreMap;
};

type Session = ID & {
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
  Rounds: 'rounds',
} as const;

type ScreenValue = (typeof Screens)[keyof typeof Screens];

const App = () => {
  const [screen, setScreen] = useState<ScreenValue>(Screens.AllGames);

  const [games, setGames] = useState<Game[]>([]);
  //const [players, setPlayers] = useState<Player[]>([]);

  //const setupScores = Object.fromEntries(players.map((p) => [p.id, 0]));

  //const [scores, setScores] = useState<ScoreMap>(setupScores);

  const [currentGame, setCurrentGame] = useState<string | null>(null);
  
  console.log(currentGame);
  

  //const handleAddPlayer = (name: string) => {
  //  setPlayers((prev) => [...prev, { id: nanoid(), name }]);
  //};

  const handleStartNewGame = (formData: NewGameData) => {
    const gameId = nanoid()
    setGames((prev) => [
      ...prev,
      {
        id: gameId,
        name: formData.name,
        players: formData.players,
        sessions: [],
      },
    ]);
    setCurrentGame(gameId)
    setScreen(Screens.AllGames);
    //setScores(setupScores);
  };

  const handleNewGame = () => {
    setScreen(Screens.NewGame);
  };

  //const handleScoreChange = (id: string, newValue: number) => {
  //  setScores((prev) => ({ ...prev, [id]: newValue }));
  //};

  const Titles: Record<ScreenValue, string> = {
    [Screens.AllGames]: 'Игры',
    [Screens.NewGame]: 'Новая игра',
    [Screens.Sessions]: 'Сессии',
    [Screens.Rounds]: 'Раунды',
  };

  //const games = [
  //  {
  //    id: 'g1',
  //    name: 'Войны одина',
  //    players: [
  //      { id: 'p1', name: 'Анна' },
  //      { id: 'p2', name: 'Боб' },
  //    ],
  //    sessions: [
  //      {
  //        id: 's1',
  //        rounds: [
  //          {
  //            id: 'r1',
  //            scores: { p1: 3, p2: 1 },
  //          },
  //          {
  //            id: 'r2',
  //            scores: { p1: 0, p2: 5 },
  //          },
  //        ],
  //      },
  //      {
  //        id: 's2',
  //        rounds: [],
  //      },
  //    ],
  //  },
  //  {
  //    id: 'g2',
  //    name: 'Game 2',
  //    players: [
  //      { id: 'p1', name: 'Анна' },
  //      { id: 'p2', name: 'Боб' },
  //    ],
  //    sessions: [
  //      {
  //        id: 's1',
  //        rounds: [
  //          {
  //            id: 'r1',
  //            scores: { p1: 3, p2: 1 },
  //          },
  //          {
  //            id: 'r2',
  //            scores: { p1: 0, p2: 5 },
  //          },
  //        ],
  //      },
  //      {
  //        id: 's2',
  //        rounds: [],
  //      },
  //    ],
  //  },
  //];

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <h1 className={styles.brand}>{Titles[screen]}</h1>
        <InstallApp />
      </header>
      {screen === Screens.AllGames && (
        //<AllGamesScreen>
        //  {/* NewGameButton */}
        //  {/*<AllGamesList
        //    players={players}
        //    onAddPlayer={handleAddPlayer}
        //    onStartGame={handleStartNewGame}
        //  />*/}
        //  games={games}
        //</>
        <AllGamesScreen games={games} onNewGame={handleNewGame} />
      )}
      {screen === Screens.NewGame && (
        <>
          {/*<SetupNewGameScreen
            players={players}
            onAddPlayer={handleAddPlayer}
            onStartGame={handleStartNewGame}
          />*/}
          <SetupNewGameScreen onCreateGame={handleStartNewGame} />
        </>
      )}
      {/*{screen === 'round' && (
        <RoundScreen
          players={players}
          roundNumber={1}
          onChangeScore={handleScoreChange}
          scores={scores}
        />
      )}
      {screen === 'stats' && <StatsScreen />}*/}
    </div>
  );
};

export { App };
