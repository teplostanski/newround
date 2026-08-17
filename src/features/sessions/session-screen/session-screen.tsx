'use client';

import cn from 'classnames';
import type { Game, ScoreMap, Session } from '@/shared/model/game';
import { titleTransitionStyle, transitionNames } from '@/shared/lib/view-transitions';
import styles from './session-screen.module.css';

type SessionScreenProps = {
  game: Game;
  session: Session;
  onStartRound: () => void;
  onOpenRound: (roundId: string) => void;
};

const formatSessionDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatRoundSummary = (players: Game['players'], scores: ScoreMap) =>
  players
    .map((player) => `${player.name} — ${scores[player.id] ?? 0}`)
    .join(' · ');

const SessionScreen = ({
  game,
  session,
  onStartRound,
  onOpenRound,
}: SessionScreenProps) => {
  return (
    <div className="screen">
      <p className={styles.summary}>
        {game.name} · {formatSessionDate(session.timestamp)} ·{' '}
        {game.players.length}{' '}
        {game.players.length === 1 ? 'игрок' : 'игроков'}
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

      {session.rounds.length === 0 ? (
        <p className="empty">Партий пока нет — начните первую</p>
      ) : (
        <ul className="list">
          {session.rounds.map((round, index) => (
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
                Партия {index + 1}
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

export { SessionScreen };
