import { useState } from 'react';
import { nanoid } from 'nanoid';
import { RoundScreen } from './round-screen';
import { SetupScreen } from './setup-screen';
import { StatsScreen } from './stats-screen';

export type Player = {
  id: string;
  name: string;
};

export type ScoreMap = Record<string, number>;

const App = () => {
  const [screen, setScreen] = useState<'setup' | 'round' | 'stats'>('setup');
  const [players, setPlayers] = useState<Player[]>([]);

  const setupScores = Object.fromEntries(players.map((p) => [p.id, 0]))

  const [scores, setScores] = useState<ScoreMap>(setupScores);
  console.log(players);
  console.log(scores);

  const handleAddPlayer = (name: string) => {
    setPlayers((prev) => [...prev, { id: nanoid(), name }]);
  };

  const handleStartGame = () => {
    setScreen('round');
    setScores(setupScores)
  };

  const handleScoreChange = (id: string, newValue: number) => {
    setScores((prev) => ({ ...prev, [id]: newValue }));
  };

  return (
    <div>
      <h1>Tablo</h1>
      {screen === 'setup' && (
        <SetupScreen
          players={players}
          onAddPlayer={handleAddPlayer}
          onStartGame={handleStartGame}
        />
      )}
      {screen === 'round' && (
        <RoundScreen
          players={players}
          roundNumber={1}
          onChangeScore={handleScoreChange}
          scores={scores}
        />
      )}
      {screen === 'stats' && <StatsScreen />}
    </div>
  );
};

export { App };
