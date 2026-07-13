import { useState } from 'react';
import { MatchScreen } from './match-screen';
import { SetupScreen } from './setup-screen';
import { StatsScreen } from './stats-screen';

const App = () => {
  const [screen, setScreen] = useState<'setup' | 'match' | 'stats'>('setup');
  const [players, setPlayers] = useState<string[]>([]);

  const handleAddPlayer = (name: string) => {
    setPlayers((prev) => [...prev, name]);
  };

  const handleStartGame = () => {
    setScreen('match');
  };

  return (
    <div>
      <h1>Tablo v0</h1>
      {screen === 'setup' && (
        <SetupScreen
          players={players}
          onAddPlayer={handleAddPlayer}
          onStartGame={handleStartGame}
        />
      )}
      {screen === 'match' && <MatchScreen />}
      {screen === 'stats' && <StatsScreen />}
    </div>
  );
};

export { App };
