import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import type { Player } from './app';

type SetupScreenProps = {
  players: Player[];
  onAddPlayer: (name: string) => void;
  onStartGame: () => void;
};

const SetupScreen = ({ players, onAddPlayer, onStartGame }: SetupScreenProps) => {
  const [playerName, setPlayerName] = useState('');

  const handlePlayerNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPlayerName(event.target.value);
  };

  const handleAddPlayer = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = playerName.trim();

    if (!trimmedName) {
      return;
    }

    onAddPlayer(trimmedName);
    setPlayerName('');
  };

  return (
    <div>
      <form onSubmit={handleAddPlayer}>
        <input
          type="text"
          placeholder="Игрок"
          value={playerName}
          onChange={handlePlayerNameChange}
        />
        <button type="submit">Добавить</button>
      </form>
      <ol>
        {players.length !== 0 &&
          players.map((player) => (
            <li key={player.id}>
              {player.name}
            </li>
          ))}
      </ol>

      <button
        type="button"
        disabled={players.length < 2}
        onClick={onStartGame}
      >
        Начать игру
      </button>
    </div>
  );
};

export { SetupScreen };
