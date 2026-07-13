import { useState, type ChangeEvent, type SubmitEvent } from 'react';

type SetupScreenProps = {
  players: string[];
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
      <ul>
        {players.length !== 0 &&
          players.map((player, index) => (
            <li key={index}>
              Игрок {index + 1} {player}
            </li>
          ))}
      </ul>

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
