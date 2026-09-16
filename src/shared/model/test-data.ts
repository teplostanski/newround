import { nanoid } from 'nanoid';
import {
  ScoringModes,
  TEST_DATA_FLAG,
  GameEndConditionTypes,
  ScoreRankings,
  EndAwardsKinds,
} from '@/shared/constants';
import { db } from './db';
import type { Game, Playthrough, Round } from './types';
import { initialScores } from './entity-builders';

const SCALE = 10;
const PLAYER_MIN = 2;
const PLAYER_MAX = 10;
const CHUNK_SIZE = 500;
const SCORE_MAX = 10_000;

const range = (count: number) =>
  Array.from({ length: count }, (_, index) => index);

const randomScore = () => Math.floor(Math.random() * (SCORE_MAX + 1));

const randomPlayerCount = () =>
  PLAYER_MIN + Math.floor(Math.random() * (PLAYER_MAX - PLAYER_MIN + 1));

const addChunks = async <T>(
  table: { bulkAdd: (items: T[]) => Promise<unknown> },
  items: T[],
) => {
  const chunks = range(Math.ceil(items.length / CHUNK_SIZE)).map((chunkIndex) =>
    items.slice(chunkIndex * CHUNK_SIZE, (chunkIndex + 1) * CHUNK_SIZE),
  );

  for (const chunk of chunks) {
    await table.bulkAdd(chunk);
  }
};

const yieldToPaint = () => new Promise((resolve) => setTimeout(resolve, 0));

export const insertTestData = async () => {
  const now = Date.now();
  const games: Game[] = range(SCALE).map((gameIndex) => ({
    id: nanoid(),
    name: `Тест ${SCALE}×${SCALE}×${SCALE} · ${gameIndex + 1}`,
    scoringMode: ScoringModes.Rounds,
    players: range(randomPlayerCount()).map((playerIndex) => ({
      id: nanoid(),
      name: `Игрок ${playerIndex + 1}`,
    })),
    endRules: {
      endConditions: [{ type: GameEndConditionTypes.Manual }],
      outcome: {
        ranking: ScoreRankings.LowestBest,
        awards: EndAwardsKinds.Outsider,
      },
    },
    createdAt: now - gameIndex,
    updatedAt: now - gameIndex,
    isTestData: TEST_DATA_FLAG,
  }));

  await addChunks(db.games, games);

  for (const [gameIndex, game] of games.entries()) {
    const playthroughs: Playthrough[] = range(SCALE).map(
      (playthroughIndex) => ({
        id: nanoid(),
        gameId: game.id,
        sequenceNumber: playthroughIndex + 1,
        scores: initialScores(game.players),
        duration: 0,
        createdAt: now - gameIndex * SCALE - playthroughIndex,
        updatedAt: now - gameIndex * SCALE - playthroughIndex,
        isTestData: TEST_DATA_FLAG,
        completion: null,
      }),
    );

    const rounds: Round[] = playthroughs.flatMap(
      (playthrough, playthroughIndex) =>
        range(SCALE).map((roundIndex) => ({
          id: nanoid(),
          gameId: game.id,
          playthroughId: playthrough.id,
          sequenceNumber: roundIndex + 1,
          scores: Object.fromEntries(
            game.players.map((player) => [player.id, randomScore()]),
          ),
          duration: 0,
          createdAt:
            now -
            gameIndex * SCALE * SCALE -
            playthroughIndex * SCALE -
            roundIndex,
          updatedAt:
            now -
            gameIndex * SCALE * SCALE -
            playthroughIndex * SCALE -
            roundIndex,
          isTestData: TEST_DATA_FLAG,
          completion: null,
        })),
    );

    await addChunks(db.playthroughs, playthroughs);
    await addChunks(db.rounds, rounds);
    await yieldToPaint();
  }
};

export const deleteTestData = async () => {
  await db.transaction('rw', db.games, db.playthroughs, db.rounds, async () => {
    await db.games.where('isTestData').equals(TEST_DATA_FLAG).delete();
    await db.playthroughs.where('isTestData').equals(TEST_DATA_FLAG).delete();
    await db.rounds.where('isTestData').equals(TEST_DATA_FLAG).delete();
  });
};
