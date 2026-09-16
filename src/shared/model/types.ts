import type {
  CompletionReasons,
  EndAwardsKinds,
  GameEndConditionTypes,
  ScoreRankings,
  ScoringModes,
  TEST_DATA_FLAG,
} from '@/shared/constants';
import type { ValueOf } from '../types';

export type ScoreRanking = ValueOf<typeof ScoreRankings>;

export type EndAwards = ValueOf<typeof EndAwardsKinds>;

export type GameEndCondition =
  | { type: typeof GameEndConditionTypes.ScoreLimit; targetScore: number }
  | { type: typeof GameEndConditionTypes.ScoreDepletion; floorScore: number }
  | { type: typeof GameEndConditionTypes.RoundLimit; maxRounds: number }
  | { type: typeof GameEndConditionTypes.Manual };

export type GameEndConditionType = GameEndCondition['type'];

export type GameOutcomeRule = {
  ranking: ScoreRanking;
  awards: EndAwards;
};

/**
 * Пустой массив = только ручное завершение
 */
export type GameEndRules = {
  endConditions: GameEndCondition[];
  outcome: GameOutcomeRule;
};

type PlayerColor = {
  lightTheme: string[];
  darkTheme: string[];
};

export type CompletionReason = ValueOf<typeof CompletionReasons>;

export type Completion = {
  reason: CompletionReason;
  finishedAt: number;
  //highestScorePlayerIds: string[];
  //lowestScorePlayerIds: string[];
};

type BaseEntity = {
  id: string;
  createdAt: number;
  updatedAt: number;
  isTestData?: typeof TEST_DATA_FLAG;
};

export type Player = {
  id: string;
  name: string;
  color?: PlayerColor;
};

export type ScoringMode = ValueOf<typeof ScoringModes>;

type GameBase = BaseEntity & {
  name: string;
  players: Player[];
  endRules: GameEndRules;
};

export type Game =
  | (GameBase & { scoringMode: typeof ScoringModes.Rounds })
  | (GameBase & { scoringMode: typeof ScoringModes.Playthrough });

export type PlaythroughGame = Extract<
  Game,
  { scoringMode: typeof ScoringModes.Playthrough }
>;

export type CreateGameData = Pick<Game, 'name' | 'players' | 'scoringMode' | 'endRules'>

export type EditGameData = {
  name: string;
};

type PlayRecord = {
  sequenceNumber: number;
  scores: Scores;
  completion: Completion | null;
  duration: number;
};

export type Playthrough = BaseEntity &
  PlayRecord & {
    gameId: string;
  };

export type Scores = Record<string, number>;

export type Round = BaseEntity &
  PlayRecord & {
    gameId: string;
    playthroughId: string;
  };
