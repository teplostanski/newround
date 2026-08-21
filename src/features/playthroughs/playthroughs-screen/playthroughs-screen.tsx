'use client';

import { Card } from '@heroui/react';
import Link from 'next/link';
import { routes } from '@/shared/lib/routes';
import {
  routeTransitionTypes,
  titleTransitionStyle,
  transitionNames,
} from '@/shared/lib/view-transitions';
import type { Playthrough } from '@/shared/model/types';

type PlaythroughListScreenProps = {
  gameId: string;
  playthroughs: Playthrough[];
};

const formatPlaythroughDate = (createdAt: number) =>
  new Date(createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

const PlaythroughListScreen = ({
  gameId,
  playthroughs,
}: PlaythroughListScreenProps) => {
  return (
    <div className="screen">
      {playthroughs.length === 0 ? (
        <p className="empty">Пока нет партий</p>
      ) : (
        <ul className="list">
          {playthroughs.map((playthrough) => (
            <li key={playthrough.id}>
              <Link
                href={routes.playthrough(gameId, playthrough.id)}
                className="listButton"
                transitionTypes={routeTransitionTypes.forward}
              >
                <Card className="w-full">
                  <Card.Header>
                    <p
                      className="titleFly"
                      style={titleTransitionStyle(
                        transitionNames.playthroughTitle(playthrough.id),
                      )}
                    >
                      Партия {playthrough.sequenceNumber}
                    </p>
                    <Card.Description>
                      {formatPlaythroughDate(playthrough.createdAt)}
                    </Card.Description>
                  </Card.Header>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { PlaythroughListScreen };
