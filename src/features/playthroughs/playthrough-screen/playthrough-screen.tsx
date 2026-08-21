'use client';

import { Button, Card } from '@heroui/react';
import Link from 'next/link';
import { routes } from '@/shared/lib/routes';
import {
  routeTransitionTypes,
  titleTransitionStyle,
  transitionNames,
} from '@/shared/lib/view-transitions';
import type { Game, Playthrough, Round, Scores } from '@/shared/model/types';

type PlaythroughScreenProps = {
  game: Game;
  playthrough: Playthrough;
  rounds: Round[];
  onStartRound: () => void;
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
}: PlaythroughScreenProps) => {
  return (
    <div className="screen">
      <Card className="w-full">
        <Card.Content>
          <p className="text-muted m-0 text-[0.95rem]">
            {game.name} · {formatPlaythroughDate(playthrough.createdAt)} ·{' '}
            {game.players.length}{' '}
            {game.players.length === 1 ? 'игрок' : 'игроков'}
          </p>
        </Card.Content>
      </Card>

      <Button fullWidth onPress={onStartRound}>
        Начать партию
      </Button>

      {rounds.length === 0 ? (
        <p className="empty">Партий пока нет — начните первую</p>
      ) : (
        <ul className="list">
          {rounds.map((round) => (
            <li key={round.id}>
              <Link
                href={routes.round(game.id, playthrough.id, round.id)}
                className="listButton"
                transitionTypes={routeTransitionTypes.forward}
              >
                <Card className="w-full">
                  <Card.Header>
                    <p
                      className="titleFly"
                      style={titleTransitionStyle(
                        transitionNames.roundTitle(round.id),
                      )}
                    >
                      Партия {round.sequenceNumber}
                    </p>
                    <Card.Description>
                      {formatRoundSummary(game.players, round.scores)}
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

export { PlaythroughScreen };
