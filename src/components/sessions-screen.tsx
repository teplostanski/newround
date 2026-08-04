import cn from 'classnames';
import type { Game } from './app';
import styles from './sessions-screen.module.css';

type SessionListScreenProps = {
  game: Game;
  onOpenSession: (sessionId: string) => void;
};

const formatSessionDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

const SessionListScreen = ({ game, onOpenSession }: SessionListScreenProps) => {
  const { sessions } = game;

  return (
    <div className="screen">
      {sessions.length === 0 ? (
        <p className="empty">Пока нет сессий</p>
      ) : (
        <ul className="list">
          {sessions.map((session, index) => (
            <li
              className={cn('item', 'itemStacked', styles.linkItem)}
              key={session.id}
              onClick={() => onOpenSession(session.id)}
            >
              <div className={styles.itemHeader}>
                <p className="title">Сессия {index + 1}</p>
                <span className={styles.badge}>
                  {session.rounds.length}{' '}
                  {session.rounds.length === 1 ? 'партия' : 'партий'}
                </span>
              </div>
              <p className="meta">{formatSessionDate(session.timestamp)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { SessionListScreen };
