'use client';

import { Chip } from '@heroui/react';
import { getPlayerChipStyle } from '@/shared/lib/player-chip';
import type { Player, Scores } from '@/shared/model/types';

type ScoreSummaryProps = {
  players: Player[];
  scores: Scores;
};

const ScoreSummary = ({ players, scores }: ScoreSummaryProps) => (
  <ul className="flex flex-row flex-wrap gap-2">
    {players.map((player, index) => (
      <li key={player.id}>
        <Chip
          variant="soft"
          size="md"
          className="px-2"
          style={getPlayerChipStyle(index)}
        >
          {player.name} ·{' '}
          <span className="font-mono">{scores[player.id]}</span>
        </Chip>
      </li>
    ))}
  </ul>
);

export { ScoreSummary };
