'use client';

import { Card, Chip, CloseButton } from '@heroui/react';
import { getPlayerChipStyle } from '@/shared/lib/player-chip';
import styles from './player-card.module.css';

type PlayerCardProps = {
  name: string;
  index: number;
  onRemove: () => void;
};

const PlayerCard = ({ name, index, onRemove }: PlayerCardProps) => (
  <Card className={styles.card}>
    <div className={styles.main}>
      <Chip
        className={`playerChip ${styles.chip}`}
        variant="soft"
        size="lg"
        title={name}
        style={getPlayerChipStyle(index)}
      >
        <span className={styles.name}>{name}</span>
      </Chip>
    </div>
    <div className={styles.action}>
      <CloseButton
        aria-label={`Удалить игрока ${name}`}
        onPress={onRemove}
      />
    </div>
  </Card>
);

export { PlayerCard };
