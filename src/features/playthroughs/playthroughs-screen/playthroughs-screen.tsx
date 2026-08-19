import cn from 'classnames';
import {
  titleTransitionStyle,
  transitionNames,
} from '@/shared/lib/view-transitions';
import type { Playthrough } from '@/shared/model/types';
import styles from './playthroughs-screen.module.css';

type PlaythroughListScreenProps = {
  playthroughs: Playthrough[];
  onOpenPlaythrough: (playthroughId: string) => void;
};

const formatPlaythroughDate = (createdAt: number) =>
  new Date(createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

const PlaythroughListScreen = ({
  playthroughs,
  onOpenPlaythrough,
}: PlaythroughListScreenProps) => {
  return (
    <div className="screen">
      {playthroughs.length === 0 ? (
        <p className="empty">Пока нет сессий</p>
      ) : (
        <ul className="list">
          {playthroughs.map((playthrough) => (
            <li
              className={cn('item', 'itemStacked', styles.linkItem)}
              key={playthrough.id}
              onClick={() => onOpenPlaythrough(playthrough.id)}
            >
              <p
                className="title"
                style={titleTransitionStyle(
                  transitionNames.sessionTitle(playthrough.id),
                )}
              >
                Сессия {playthrough.sequenceNumber}
              </p>
              <p className="meta">{formatPlaythroughDate(playthrough.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { PlaythroughListScreen };
