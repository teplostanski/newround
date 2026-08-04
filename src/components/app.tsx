import { useState } from 'react';
import { nanoid } from 'nanoid';
import { InstallApp } from './install-app';
import { AllGamesScreen } from './all-games-screen';

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

  const [currentGame, setCurrentGame] = useState<string | null>(null);

  console.log(currentGame);

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

  };

  const handleNewGame = () => {
    setScreen(Screens.NewGame);
  };

  const Titles: Record<ScreenValue, string> = {
    [Screens.AllGames]: 'Игры',
    [Screens.NewGame]: 'Новая игра',
    [Screens.Sessions]: 'Сессии',
    [Screens.Rounds]: 'Раунды',
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <h1 className={styles.brand}>{Titles[screen]}</h1>
        <InstallApp />
      </header>
      {screen === Screens.AllGames && (

        <AllGamesScreen games={games} onNewGame={handleNewGame} />
      )}
      {screen === Screens.NewGame && (
        <>

          <SetupNewGameScreen onCreateGame={handleStartNewGame} />
        </>
      )}

    </div>
  );
};

export { App };
