export const ScoringModes = {
  Rounds: 'ROUNDS',
  Playthrough: 'PLAYTHROUGH',
} as const;

export const TEST_DATA_FLAG = 1;

export const CompletionReasons = {
  Manual: 'MANUAL',
  //Early: 'EARLY',
  //TargetScore: 'TARGET_SCORE',
  //RoundLimit: 'ROUND_LIMIT',
} as const;

export const GameEndConditionTypes = {
  ScoreLimit: 'SCORE_LIMIT',
  ScoreDepletion: 'SCORE_DEPLETION',
  RoundLimit: 'ROUND_LIMIT',
  Manual: 'MANUAL',
} as const;

export const ScoreRankings = {
  HighestBest: 'HIGHEST_BEST',
  LowestBest: 'LOWEST_BEST',
} as const;

export const EndAwardsKinds = {
  Winner: 'WINNER',
  Outsider: 'OUTSIDER',
  Both: 'BOTH',
} as const;

export const OnionModes = {
  Off: 'OFF',
  Diff: 'DIFF',
  Ghost: 'GHOST',
} as const;
