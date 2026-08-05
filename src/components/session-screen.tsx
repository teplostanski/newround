import cn from 'classnames';
import { ViewTransition } from 'react';
import type { Game, ScoreMap, Session } from '@/domain/game';
import {
  sharedTitleTransitions,
  transitionNames,
} from '@/lib/view-transitions';
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

      <button className="btn btnBlock" type="button" onClick={onStartRound}>
        Начать партию
      </button>

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
              <div className={styles.itemHeader}>
                <ViewTransition
                  name={transitionNames.roundTitle(round.id)}
                  share={sharedTitleTransitions}
                  default="none"
                >
                  <p className="title">Партия {index + 1}</p>
                </ViewTransition>
              </div>
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
