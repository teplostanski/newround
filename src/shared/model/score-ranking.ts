import { ScoreRankings } from '@/shared/constants';
import type { GameEndRules, Scores } from './types';

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
export const rankScores = (
  scores: Scores,
  ranking: GameEndRules['outcome']['ranking'],
) => {
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
