'use client';

import { Button, Card, Chip } from '@heroui/react';
import { CrownDiamond, FaceSad } from '@gravity-ui/icons';
import { formatDate } from '@/shared/utils';
import type { Game, Playthrough, Round } from '@/shared/model/types';
import { rankScores, resolveEndConfig } from '@/shared/model/end-config';
import { EndAwardsKinds } from '@/shared/constants';
import { useStore } from '@/shared/model/store';
import {
  toastStorageError,
  toastStorageSuccess,
} from '@/shared/lib/storage-toast';
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
}: PlaythroughScreenProps) => {
  const { finishPlaythrough } = useStore();

  const isAllCompleted = rounds.filter((round) => Boolean(round.completion)).length === rounds.length

  const { outcome } = resolveEndConfig(game);
  const showWinners =
    outcome.awards === EndAwardsKinds.Winner ||
    outcome.awards === EndAwardsKinds.Both;
  const showLosers =
    outcome.awards === EndAwardsKinds.Loser ||
    outcome.awards === EndAwardsKinds.Both;

  const { completion } = playthrough;

  const { leaders, trailers } = rankScores(playthrough.scores, outcome.ranking);

  const playerName = (playerId: string) =>
    game.players.find((player) => player.id === playerId)?.name ?? playerId;

  const namesFromIds = (playerIds: string[]) =>
    playerIds.map(playerName).join(', ');

  const handleFinish = async () => {
    try {
      await finishPlaythrough(playthrough.id);
      toastStorageSuccess('Партия завершена');
    } catch (error) {
      toastStorageError('Не удалось завершить партию', error);
    }
  };

  return (
    <div className="screen">
      <Card className="w-full">
        <Card.Content>
          <p className="text-muted m-0 text-[0.95rem]">
            {game.name} · {formatDate(playthrough.createdAt)} ·{' '}
            {game.players.length}{' '}
            {game.players.length === 1 ? 'игрок' : 'игроков'}
          </p>
          {(leaders.length > 0 || trailers.length > 0) && (
            <div className="mt-3 flex flex-col gap-2">
              {showWinners && leaders.length > 0 && (
                <div className="flex flex-row flex-wrap items-center gap-2">
                  <Chip variant="soft" size="sm" color="success">
                    <span className="flex flex-row items-center gap-1">
                      <CrownDiamond width={16} />
                      {namesFromIds(leaders)}
                    </span>
                  </Chip>
                </div>
              )}
              {showLosers && trailers.length > 0 && (
                <div className="flex flex-row flex-wrap items-center gap-2">
                  <Chip variant="soft" size="sm" color="danger">
                    <span className="flex flex-row items-center gap-1">
                      <FaceSad width={16} />
                      {namesFromIds(trailers)}
                    </span>
                  </Chip>
                </div>
              )}
            </div>
          )}
        </Card.Content>
      </Card>

      {!completion && (
        <>
          <PrimaryAction onPress={onStartRound} isDisabled={!isAllCompleted}>Начать раунд</PrimaryAction>
          <Button variant="danger-soft" fullWidth onPress={handleFinish}>
            Завершить партию
          </Button>
        </>
      )}
      <RoundsList game={game} playthrough={playthrough} rounds={rounds} />
    </div>
  );
};

export { PlaythroughScreen };
