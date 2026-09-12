'use client';

import { useMemo } from 'react';
import { Chip } from '@heroui/react';
import { CrownDiamond, FaceSad, Clock } from '@gravity-ui/icons';
import { Routes } from '@/shared/lib/routes';
import {
  toastStorageError,
  toastStorageSuccess,
} from '@/shared/lib/storage-toast';
import {
  formatDuration,
  formatTime,
  formatDay,
  dayKey,
  pluralizeRounds,
} from '@/shared/utils';
import type { Game, Playthrough } from '@/shared/model/types';
import { useStore } from '@/shared/model/store';
import { resolveEndConfig } from '@/shared/model/end-config';
import { EndAwardsKinds } from '@/shared/constants';
import { ConfirmDeleteButton } from '@/shared/ui/confirm-delete-button/confirm-delete-button';
import { ListItemCard } from '@/shared/ui/list-item-card/list-item-card';
import { ScoreSummary } from '@/shared/ui/score-summary/score-summary';

type PlaythroughsRoundsListProps = {
  game: Game;
  playthroughs: Playthrough[];
};

const PlaythroughsRoundsList = ({
  game,
  playthroughs,
}: PlaythroughsRoundsListProps) => {
  const { deletePlaythrough, rounds } = useStore();

  const endConfig = resolveEndConfig(game);
  const awards = endConfig.outcome.awards;

  const roundCountByPlaythrough = useMemo(() => {
    const counts = new Map<string, number>();

    for (const round of rounds) {
      counts.set(
        round.playthroughId,
        (counts.get(round.playthroughId) ?? 0) + 1,
      );
    }

    return counts;
  }, [rounds]);

  const groupedByDay = useMemo(() => {
    const groups: { key: string; label: string; items: Playthrough[] }[] = [];
    const indexByKey = new Map<string, number>();

    for (const playthrough of playthroughs) {
      const key = dayKey(playthrough.createdAt);
      let index = indexByKey.get(key);

      if (index === undefined) {
        index = groups.length;
        indexByKey.set(key, index);
        groups.push({
          key,
          label: formatDay(playthrough.createdAt),
          items: [],
        });
      }

      groups[index].items.push(playthrough);
    }

    return groups;
  }, [playthroughs]);

  if (playthroughs.length === 0) {
    return <p className="empty">Пока нет партий</p>;
  }

  const playerName = (playerId: string) =>
    game.players.find((player) => player.id === playerId)?.name ?? playerId;

  const namesFromIds = (playerIds: string[]) =>
    playerIds.map(playerName).join(', ');

  const showWinners =
    awards === EndAwardsKinds.Winner || awards === EndAwardsKinds.Both;
  const showLosers =
    awards === EndAwardsKinds.Loser || awards === EndAwardsKinds.Both;

  return (
    <div className="flex flex-col gap-6">
      {groupedByDay.map((group) => (
        <section key={group.key} className="flex flex-col gap-3">
          <h2 className="text-muted m-0 text-center text-[0.9rem] font-medium">
            {group.label}
          </h2>
          <ul className="list">
            {group.items.map((playthrough) => {
              const roundCount =
                roundCountByPlaythrough.get(playthrough.id) ?? 0;
              const { completion, duration } = playthrough;

              const isPlaythroughMode = game.scoringMode === 'PLAYTHROUGH';
              const isCompleted = Boolean(playthrough.completion);

              return (
                <li key={playthrough.id}>
                  <ListItemCard
                    link={
                      isPlaythroughMode && isCompleted
                        ? undefined
                        : Routes.Playthrough(game.id, playthrough.id)
                    }
                    title={
                      <span className="flex items-center gap-2">
                        Партия {playthrough.sequenceNumber}
                        {!completion && (
                          <Chip variant="primary" size="lg">
                            <Clock width={16} />
                            <Chip.Label>идёт</Chip.Label>
                          </Chip>
                        )}
                      </span>
                    }
                    content={
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1 text-[0.9rem]">
                          <span className="font-mono">
                            {formatTime(playthrough.createdAt)} -{' '}
                            {completion
                              ? formatTime(completion.finishedAt)
                              : formatTime(playthrough.updatedAt)}
                          </span>
                          <span className="text-muted font-mono">
                            {formatDuration(duration)} · {pluralizeRounds(roundCount)}
                          </span>
                        </div>

                        <ScoreSummary
                          players={game.players}
                          scores={playthrough.scores}
                        />

                        {completion && (
                          <div className="flex flex-col gap-2">
                            {showLosers &&
                              completion.lowestScorePlayerIds.length > 0 && (
                                <div className="flex flex-row flex-wrap items-center gap-2">
                                  <Chip variant="soft" size="sm" color="danger">
                                    <span className="flex flex-row items-center gap-1">
                                      <FaceSad width={16} />
                                      {namesFromIds(
                                        completion.lowestScorePlayerIds,
                                      )}
                                    </span>
                                  </Chip>
                                </div>
                              )}
                            {showWinners &&
                              completion.highestScorePlayerIds.length > 0 && (
                                <div className="flex flex-row flex-wrap items-center gap-2">
                                  <Chip
                                    variant="soft"
                                    size="sm"
                                    color="success"
                                  >
                                    <span className="flex flex-row items-center gap-1">
                                      <CrownDiamond width={16} />
                                      {namesFromIds(
                                        completion.highestScorePlayerIds,
                                      )}
                                    </span>
                                  </Chip>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    }
                    action={
                      <ConfirmDeleteButton
                        deleteLabel="Удалить партию"
                        confirmHeading={`Удалить партию ${playthrough.sequenceNumber}?`}
                        confirmBody="Раунды этой партии пропадут. Это нельзя отменить."
                        onConfirm={async () => {
                          try {
                            await deletePlaythrough(playthrough.id);
                            toastStorageSuccess(
                              `Партия ${playthrough.sequenceNumber} удалена`,
                            );
                          } catch (error) {
                            toastStorageError(
                              'Не удалось удалить партию',
                              error,
                            );
                          }
                        }}
                      />
                    }
                  />
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
};

export { PlaythroughsRoundsList };
