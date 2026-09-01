'use client';

import { Card } from '@heroui/react';
import { formatDate } from '@/shared/utils';
import type { Game, Playthrough, Round } from '@/shared/model/types';
import { PrimaryAction } from '@/shared/ui/primary-action/primary-action';
import { RoundsList } from './rounds-list';

type PlaythroughScreenProps = {
  game: Game;
  playthrough: Playthrough;
  rounds: Round[];
  onStartRound: () => void;
};

const PlaythroughScreen = ({
  game,
  playthrough,
  rounds,
  onStartRound,
}: PlaythroughScreenProps) => (
  <div className="screen">
    <Card className="w-full">
      <Card.Content>
        <p className="text-muted m-0 text-[0.95rem]">
          {game.name} · {formatDate(playthrough.createdAt)} ·{' '}
          {game.players.length}{' '}
          {game.players.length === 1 ? 'игрок' : 'игроков'}
        </p>
      </Card.Content>
    </Card>

    <PrimaryAction onPress={onStartRound}>Начать раунд</PrimaryAction>
    <RoundsList game={game} playthrough={playthrough} rounds={rounds} />
  </div>
);

export { PlaythroughScreen };
