'use client';

import { Button, Card, Chip } from '@heroui/react';
import { PrimaryAction } from '@/shared/ui/primary-action/primary-action';
import type { Player, Scores } from '@/shared/model/types';
import { cn } from '@/shared/lib/cn';
import { getPlayerChipStyle } from '@/shared/lib/player-chip';
import styles from './score-screen.module.css';

type ScoreScreenProps = {
  players: Player[];
  scores: Scores;
  totalScores: Scores;
  finishLabel: string;
  isFirstRun: boolean;
  isCompleted: boolean;
  onChangeScore: (id: string, newValue: number) => void;
  onFinish: () => void;
};

const ScoreScreen = ({
  players,
  scores,
  totalScores,
  finishLabel,
  isFirstRun,
  isCompleted,
  onChangeScore,
  onFinish,
}: ScoreScreenProps) => {
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
      <ul className={cn('list', styles.list)}>
        {players.map((player, index) => (
          <li key={player.id}>
            <Card className={cn('w-full', styles.scoreCard)}>
              <div className={styles.cardTitle}>
                <Chip
                  variant="soft"
                  size="lg"
                  className="playerChip"
                  style={getPlayerChipStyle(index)}
                >
                  {player.name}
                </Chip>
                {!isFirstRun && (
                  <span className={styles.totalScore}>
                    {totalScores[player.id] + (isCompleted ? 0 : scores[player.id])}
                  </span>
                )}
              </div>
              <div className={styles.stepper}>
                <Button
                  variant="secondary"
                  className={styles.stepperTile}
                  isDisabled={scores[player.id] === 0}
                  aria-label={`Уменьшить счёт ${player.name}`}
                  onPress={() => onChangeScore(player.id, decScore(player.id))}
                >
                  −
                </Button>
                <output className={cn(styles.stepperTile, styles.stepperValue)}>
                  {scores[player.id]}
                </output>
                <Button
                  variant="secondary"
                  className={styles.stepperTile}
                  aria-label={`Увеличить счёт ${player.name}`}
                  onPress={() => onChangeScore(player.id, incScore(player.id))}
                >
                  +
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <PrimaryAction onPress={onFinish}>{finishLabel}</PrimaryAction>
    </div>
  );
};

export { ScoreScreen };
