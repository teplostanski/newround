type Entity = {
  id: string;
  createdAt: number;
  updatedAt: number;
};

export type Player = {
  id: string;
  name: string;
};

export type Game = Entity & {
  name: string;
  players: Player[];
};

export type NewGameData = {
  name: string;
  players: Player[];
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