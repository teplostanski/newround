'use client';

import cn from 'classnames';
import {
  titleTransitionStyle,
  transitionNames,
} from '@/shared/lib/view-transitions';
import styles from './playthrough-screen.module.css';
import type { Game, Playthrough, Round, Scores } from '@/shared/model/types';

type PlaythroughScreenProps = {
  game: Game;
  playthrough: Playthrough;
  rounds: Round[];
  onStartRound: () => void;
  onOpenRound: (roundId: string) => void;
};

const formatPlaythroughDate = (createdAt: number) =>
  new Date(createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatRoundSummary = (players: Game['players'], scores: Scores) =>
  players
    .map((player) => `${player.name} — ${scores[player.id] ?? 0}`)
    .join(' · ');

const PlaythroughScreen = ({
  game,
  playthrough,
  rounds,
  onStartRound,
  onOpenRound,
}: PlaythroughScreenProps) => {
  return (
    <div className="screen">
      <p className={styles.summary}>
        {game.name} · {formatPlaythroughDate(playthrough.createdAt)} ·{' '}
        {game.players.length} {game.players.length === 1 ? 'игрок' : 'игроков'}
      </p>

      <wa-button
        className="wa-block"
        type="button"
        variant="brand"
        appearance="accent"
        onClick={onStartRound}
      >
        Начать партию
      </wa-button>

      {rounds.length === 0 ? (
        <p className="empty">Партий пока нет — начните первую</p>
      ) : (
        <ul className="list">
          {rounds.map((round) => (
            <li
              className={cn('item', 'itemStacked', styles.linkItem)}
              key={round.id}
              onClick={() => onOpenRound(round.id)}
            >
              <p
                className="title"
                style={titleTransitionStyle(
                  transitionNames.roundTitle(round.id),
                )}
              >
                Партия {round.sequenceNumber}
              </p>
              <p className={styles.scoreSummary}>
                {formatRoundSummary(game.players, round.scores)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { PlaythroughScreen };
