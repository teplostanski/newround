type Entity = {
  id: string;
};

export type Player = Entity & {
  name: string;
};

export type ScoreMap = Record<string, number>;

export type Round = Entity & {
  scores: ScoreMap;
};

export type Session = Entity & {
  timestamp: number;
  rounds: Round[];
};

export type Game = Entity & {
  name: string;
  players: Player[];
  sessions: Session[];
};

export type NewGameData = {
  name: string;
  players: Player[];
};

type CreateGameInput = NewGameData & {
  gameId: string;
  sessionId: string;
  timestamp: number;
};

export const createGame = ({
  name,
  players,
  gameId,
  sessionId,
  timestamp,
}: CreateGameInput): Game => ({
  id: gameId,
  name,
  players,
  sessions: [{ id: sessionId, timestamp, rounds: [] }],
});

export const createRound = (id: string, players: Player[]): Round => ({
  id,
  scores: Object.fromEntries(players.map((player) => [player.id, 0])),
});

export const appendRound = (
  games: Game[],
  gameId: string,
  sessionId: string,
  round: Round,
): Game[] =>
  games.map((game) =>
    game.id !== gameId
      ? game
      : {
          ...game,
          sessions: game.sessions.map((session) =>
            session.id !== sessionId
              ? session
              : { ...session, rounds: [...session.rounds, round] },
          ),
        },
  );

export const setRoundScore = (
  games: Game[],
  gameId: string,
  sessionId: string,
  roundId: string,
  playerId: string,
  score: number,
): Game[] =>
  games.map((game) =>
    game.id !== gameId
      ? game
      : {
          ...game,
          sessions: game.sessions.map((session) =>
            session.id !== sessionId
              ? session
              : {
                  ...session,
                  rounds: session.rounds.map((round) =>
                    round.id !== roundId
                      ? round
                      : {
                          ...round,
                          scores: { ...round.scores, [playerId]: score },
                        },
                  ),
                },
          ),
        },
  );

export const findGame = (games: Game[], gameId: string | null) =>
  games.find((game) => game.id === gameId);

export const findSession = (game: Game | undefined, sessionId: string | null) =>
  game?.sessions.find((session) => session.id === sessionId);

export const findRound = (
  session: Session | undefined,
  roundId: string | null,
) => session?.rounds.find((round) => round.id === roundId);
