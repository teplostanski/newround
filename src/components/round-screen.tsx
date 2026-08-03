import type { Player, ScoreMap } from './app';
import styles from './round-screen.module.css';

type RoundScreenProps = {
  players: Player[];
  scores: ScoreMap;
  roundNumber: number;
  onChangeScore: (id: string, newValue: number) => void;
};

const RoundScreen = ({
  players,
  scores,
  roundNumber,
  onChangeScore,
}: RoundScreenProps) => {
  const incScore = (playerId: string) => {
    const currentScore = scores[playerId];

    return currentScore + 1;
  };

  const decScore = (playerId: string) => {
    const currentScore = scores[playerId];

    return currentScore > 0 ? currentScore - 1 : 0;
  };

  return (
    <div className="screen">
      <p className={styles.heading}>Партия {roundNumber}</p>
      <ul className={`list ${styles.list}`}>
        {players.map((player) => (
          <li className={styles.card} key={player.id}>
            <p className="title">{player.name}</p>
            <p className={styles.score}>{scores[player.id]}</p>
            <div className={styles.controls}>
              <button
                className={styles.scoreBtn}
                type="button"
                onClick={() => onChangeScore(player.id, decScore(player.id))}
              >
                −
              </button>
              <button
                className={styles.scoreBtn}
                type="button"
                onClick={() => onChangeScore(player.id, incScore(player.id))}
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { RoundScreen };
