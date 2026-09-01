'use client';

import { Card } from '@heroui/react';
import { formatDate } from '@/shared/utils';
import type { Game, Playthrough } from '@/shared/model/types';
import { PrimaryAction } from '@/shared/ui/primary-action/primary-action';
import { PlaythroughsList } from '@/features/playthroughs/playthroughs-list/playthroughs-list';

type GameScreenProps = {
  game: Game;
  playthroughs: Playthrough[];
  onStartPlaythrough: () => void;
};

const GameScreen = ({
  game,
  playthroughs,
  onStartPlaythrough,
}: GameScreenProps) => (
  <div className="screen">
    <Card className="w-full">
      <Card.Content>
        <p className="text-muted m-0 text-[0.95rem] font-mono">
          {formatDate(game.createdAt)} · {playthroughs.length}{' '}
          {playthroughs.length === 1 ? 'партия' : 'партий'}
        </p>
      </Card.Content>
    </Card>

    <PrimaryAction onPress={onStartPlaythrough}>Начать партию</PrimaryAction>
    <PlaythroughsList gameId={game.id} playthroughs={playthroughs} />
  </div>
);

export { GameScreen };
