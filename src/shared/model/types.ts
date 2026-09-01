export const TEST_DATA_FLAG = 1;

type Entity = {
  id: string;
  createdAt: number;
  updatedAt: number;
  isTestData?: typeof TEST_DATA_FLAG;
};

export type Player = {
  id: string;
  name: string;
};

export type Game = Entity & {
  name: string;
  players: Player[];
};

export type CreateGameData = {
  name: string;
  players: Player[];
};

export type EditGameData = {
  name: string;
};

export type Playthrough = Entity & {
  gameId: string;
  sequenceNumber: number;
};

export type Scores = Record<string, number>;

export type Round = Entity & {
  gameId: string;
  playthroughId: string;
  sequenceNumber: number;
  scores: Scores;
};