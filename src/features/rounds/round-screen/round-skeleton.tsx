'use client';

import { Card, Skeleton } from '@heroui/react';
import styles from './round-screen.module.css';

const PLAYER_KEYS = [0, 1, 2] as const;

const PlayerChipBone = () => <Skeleton className="h-7 w-[40%]" />;

const StepperTileBone = () => <Skeleton className={styles.stepperTile} />;

const ScoreStepperBone = () => (
  <div className={styles.stepper}>
    <StepperTileBone />
    <StepperTileBone />
    <StepperTileBone />
  </div>
);

const ScoreCardBone = () => (
  <Card className={`w-full ${styles.scoreCard}`}>
    <PlayerChipBone />
    <ScoreStepperBone />
  </Card>
);

const FinishRoundBone = () => <Skeleton className="h-11 w-full" />;

export const RoundSkeleton = () => (
  <div className="screen">
    <ul className={`list ${styles.list}`}>
      {PLAYER_KEYS.map((key) => (
        <li key={key}>
          <ScoreCardBone />
        </li>
      ))}
    </ul>
    <FinishRoundBone />
  </div>
);
