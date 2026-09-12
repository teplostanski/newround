import type {
  CreateGameData,
  Game,
  Playthrough,
  Player,
  Round,
  Scores,
} from './types';

const initialScores = (players: Player[]): Scores =>
  Object.fromEntries(players.map((player) => [player.id, 0]));

type BuildGameInput = {
  id: string;
  createdAt: number;
  data: CreateGameData;
};

const buildGame = ({ id, createdAt, data }: BuildGameInput): Game => ({
  id,
  name: data.name,
  players: data.players,
  scoringMode: data.scoringMode,
  createdAt,
  updatedAt: createdAt,
});

type BuildPlaythroughInput = {
  id: string;
  gameId: string;
  sequenceNumber: number;
  createdAt: number;
  players: Player[];
};

const buildPlaythrough = ({
  id,
  gameId,
  sequenceNumber,
  createdAt,
  players,
}: BuildPlaythroughInput): Playthrough => ({
  id,
  gameId,
  sequenceNumber,
  scores: initialScores(players),
  duration: 0,
  createdAt,
  updatedAt: createdAt,
});

type BuildRoundInput = {
  id: string;
  gameId: string;
  playthroughId: string;
  sequenceNumber: number;
  createdAt: number;
  players: Player[];
};

const buildRound = ({
  id,
  gameId,
  playthroughId,
  sequenceNumber,
  createdAt,
  players,
}: BuildRoundInput): Round => ({
  id,
  gameId,
  playthroughId,
  sequenceNumber,
  scores: initialScores(players),
  duration: 0,
  createdAt,
  updatedAt: createdAt,
});

export { buildGame, buildPlaythrough, buildRound, initialScores };
