'use client';

import { Button, Card, Chip } from '@heroui/react';
import type { Player, Scores } from '@/shared/model/types';
import { getPlayerTone } from '@/shared/lib/player-tone';
import styles from './round-screen.module.css';

type RoundScreenProps = {
  players: Player[];
  scores: Scores;
  onChangeScore: (id: string, newValue: number) => void;
  onFinishRound: () => void;
};

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
          <li key={player.id}>
            <Card className={`w-full ${styles.scoreCard}`}>
              <Chip color={getPlayerTone(index)} variant="soft" size="lg">
                {player.name}
              </Chip>
              <div className={styles.stepper}>
                <Button
                  variant="ghost"
                  className={styles.stepperTile}
                  isDisabled={scores[player.id] === 0}
                  aria-label={`Уменьшить счёт ${player.name}`}
                  onPress={() =>
                    onChangeScore(player.id, decScore(player.id))
                  }
                >
                  −
                </Button>
                <output
                  className={`${styles.stepperTile} ${styles.stepperValue}`}
                >
                  {scores[player.id]}
                </output>
                <Button
                  variant="ghost"
                  className={styles.stepperTile}
                  aria-label={`Увеличить счёт ${player.name}`}
                  onPress={() =>
                    onChangeScore(player.id, incScore(player.id))
                  }
                >
                  +
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <Button fullWidth onPress={onFinishRound}>
        Завершить раунд
      </Button>
    </div>
  );
};

export { RoundScreen };
