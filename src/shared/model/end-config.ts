import {
  EndAwardsKinds,
  GameEndConditionTypes,
  ScoreRankings,
  ScoringModes,
} from '@/shared/constants';
import type { Game, GameEndConfig, Scores } from './types';

/**
 * ВРЕМЕННОЕ РЕШЕНИЕ!
 *
 * Используется как fallback для игр, созданных до появления
 * endConfig (у них поле отсутствует). Благодаря этому старые
 * записи юзеров в БД работают без миграции: читающий код всегда
 * получает валидный GameEndConfig.
 */
const DEFAULT_END_CONFIG: Record<Game['scoringMode'], GameEndConfig> = {
  // Пораундовый режим (как текущий Odin у друга): очки копятся,
  // завершается вручную, худший по сумме считается проигравшим.
  [ScoringModes.Rounds]: {
    endConditions: [{ type: GameEndConditionTypes.Manual }],
    outcome: { ranking: ScoreRankings.LowestBest, awards: EndAwardsKinds.Loser },
  },
  // Режим единого счёта партии: тоже ручное завершение,
  // побеждает набравший больше.
  [ScoringModes.Playthrough]: {
    endConditions: [{ type: GameEndConditionTypes.Manual }],
    outcome: {
      ranking: ScoreRankings.HighestBest,
      awards: EndAwardsKinds.Winner,
    },
  },
};

/**
 * Возвращает эффективные условия завершения игры: либо явно
 * заданные при создании, либо дефолт по scoringMode для старых
 * записей без endConfig. Никогда не возвращает undefined.
 */
export const resolveEndConfig = (game: Game): GameEndConfig =>
  game.endConfig ?? DEFAULT_END_CONFIG[game.scoringMode];

/**
 * Пример конфигурации под правила Odin: партия завершается, когда
 * кто-то набирает 15+ очков; победителя нет, есть только проигравший
 * (тот, у кого счёт выше всех). Готовый пресет на будущее для UI
 * настройки при создании игры.
 */
export const ODIN_END_CONFIG: GameEndConfig = {
  endConditions: [{ type: GameEndConditionTypes.ScoreLimit, targetScore: 15 }],
  outcome: { ranking: ScoreRankings.LowestBest, awards: EndAwardsKinds.Both },
};

/**
 * Лидеры и отстающие по текущему счёту с учётом направления ranking.
 *
 * `leaders`: у кого счёт лучший (для LOWEST_BEST это минимум, для
 * HIGHEST_BEST максимум); `trailers`: у кого счёт худший.
 * Используется и вживую в шапке партии (кто лидирует / кто в жопе),
 * и при завершении для расчёта итогового исхода. Один источник
 * правды, чтобы live-статус и completion не расходились.
 *
 * Если все игроки с одинаковым счётом (в т.ч. стартовые нули),
 * лидеров и отстающих нет: делить некого.
 */
export const rankScores = (scores: Scores, ranking: GameEndConfig['outcome']['ranking']) => {
  const values = Object.values(scores);

  if (values.length === 0) {
    return { leaders: [] as string[], trailers: [] as string[] };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return { leaders: [] as string[], trailers: [] as string[] };
  }

  const bestScore = ranking === ScoreRankings.LowestBest ? min : max;
  const worstScore = ranking === ScoreRankings.LowestBest ? max : min;

  const idsWithScore = (target: number) =>
    Object.entries(scores)
      .filter(([, value]) => value === target)
      .map(([id]) => id);

  return {
    leaders: idsWithScore(bestScore),
    trailers: idsWithScore(worstScore),
  };
};
