import type { Game as LegacyGame } from './game';
import type { Game, Playthrough, Round } from './types';

type Output = {
  games: Game[];
  playthroughs: Playthrough[];
  rounds: Round[];
};

export const legacyGamesToTables = (
  legacyGames: LegacyGame[],
  now: number,
): Output => {
  const games: Game[] = [];
  const playthroughs: Playthrough[] = [];
  const rounds: Round[] = [];

  for (const game of legacyGames) {
    games.push({
      id: game.id,
      name: game.name,
      players: game.players,
      createdAt: game.sessions[0]?.timestamp ?? now,
      updatedAt: game.sessions[0]?.timestamp ?? now,
    });

    for (const [sessionIndex, session] of game.sessions.entries()) {
      playthroughs.push({
        id: session.id,
        gameId: game.id,
        sequenceNumber: sessionIndex + 1,
        createdAt: session.timestamp,
        updatedAt: session.timestamp,
      });

      for (const [roundIndex, round] of session.rounds.entries()) {
        rounds.push({
          id: round.id,
          gameId: game.id,
          playthroughId: session.id,
          sequenceNumber: roundIndex + 1,
          scores: round.scores,
          createdAt: session.timestamp,
          updatedAt: session.timestamp,
        })
      }
    }
  }

  return { games, playthroughs, rounds };
};
