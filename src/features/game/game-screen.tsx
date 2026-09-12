'use client';

import { Card } from '@heroui/react';
import { formatDate } from '@/shared/utils';
import { ScoringModes } from '@/shared/constants';
import type { Game, Playthrough } from '@/shared/model/types';
import { PrimaryAction } from '@/shared/ui/primary-action/primary-action';
import { PlaythroughsRoundsList } from '@/features/game/playthroughs-rounds-list';
import { PlaythroughsScoreList } from './playthroughs-score-list';

type GameScreenProps = {
  game: Game;
  playthroughs: Playthrough[];
  onStartPlaythrough: () => void;
};

const GameScreen = ({
  game,
  playthroughs,
  onStartPlaythrough,
}: GameScreenProps) => {
  const hasUnfinished = playthroughs.some(
    (playthrough) => !playthrough.completion,
  );

  return (
    <div className="screen">
      <Card className="w-full">
        <Card.Content>
          <p className="text-muted m-0 text-[0.95rem] font-mono">
            {formatDate(game.createdAt)} · {playthroughs.length}{' '}
            {playthroughs.length === 1 ? 'партия' : 'партий'}
          </p>
        </Card.Content>
      </Card>

      <PrimaryAction onPress={onStartPlaythrough} isDisabled={hasUnfinished}>
        Начать партию
      </PrimaryAction>

      {game.scoringMode === ScoringModes.Rounds ? (
        <PlaythroughsRoundsList game={game} playthroughs={playthroughs} />
      ) : (
        <PlaythroughsScoreList game={game} playthroughs={playthroughs} />
      )}
    </div>
  );
};

export { GameScreen };
