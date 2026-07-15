import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import type { Player } from './app';
import styles from './setup-screen.module.css';

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
    <div className={styles.screen}>
      <form className={styles.form} onSubmit={handleAddPlayer}>
        <input
          className={styles.input}
          type="text"
          placeholder="Имя игрока"
          value={playerName}
          onChange={handlePlayerNameChange}
        />
        <button className={styles.btnGhost} type="submit">
          Добавить
        </button>
      </form>

      {players.length === 0 ? (
        <p className={styles.empty}>Добавьте хотя бы двух игроков</p>
      ) : (
        <ol className={styles.list}>
          {players.map((player) => (
            <li className={styles.item} key={player.id}>
              {player.name}
            </li>
          ))}
        </ol>
      )}

      <button
        className={styles.start}
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
