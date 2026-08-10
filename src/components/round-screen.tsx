'use client';

import type { CSSProperties } from 'react';
import type { Player, ScoreMap } from '@/domain/game';
import { getPlayerCardColor } from '../constants/player-card-colors';
import styles from './round-screen.module.css';

type RoundScreenProps = {
  players: Player[];
  scores: ScoreMap;
  onChangeScore: (id: string, newValue: number) => void;
  onFinishRound: () => void;
};

const getInitial = (name: string) =>
  name.trim().charAt(0).toLocaleUpperCase('ru') || '?';

const RoundScreen = ({
  players,
  scores,
  onChangeScore,
  onFinishRound,
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
      <ul className={`list ${styles.list}`}>
        {players.map((player, index) => (
          <li className={styles.card} key={player.id}>
            <div className={styles.player}>
              <span
                className={styles.avatar}
                style={
                  {
                    '--avatar-color': getPlayerCardColor(index),
                  } as CSSProperties
                }
                aria-hidden="true"
              >
                {getInitial(player.name)}
              </span>
              <p className="title">{player.name}</p>
            </div>
            <div className={styles.stepper}>
              <button
                className={styles.stepperBtn}
                type="button"
                disabled={scores[player.id] === 0}
                aria-label={`Уменьшить счёт ${player.name}`}
                onClick={() => onChangeScore(player.id, decScore(player.id))}
              >
                −
              </button>
              <output className={styles.stepperValue}>
                {scores[player.id]}
              </output>
              <button
                className={styles.stepperBtn}
                type="button"
                aria-label={`Увеличить счёт ${player.name}`}
                onClick={() => onChangeScore(player.id, incScore(player.id))}
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>

      <wa-button
        className="wa-block"
        type="button"
        variant="brand"
        appearance="accent"
        onClick={onFinishRound}
      >
        Завершить партию
      </wa-button>
    </div>
  );
};

export { RoundScreen };
