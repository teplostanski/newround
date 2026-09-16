import { ScoreRankings } from '@/shared/constants';
import type { GameEndRules, Scores } from './types';

/**
 * Лидеры и отстающие по текущему счёту с учётом направления ranking.
 *
 * `winners`: у кого счёт лучший (для LOWEST_BEST это минимум, для
 * HIGHEST_BEST максимум); `outsiders`: у кого счёт худший.
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
    return { winners: [] as string[], outsiders: [] as string[] };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return { winners: [] as string[], outsiders: [] as string[] };
  }

  const bestScore = ranking === ScoreRankings.LowestBest ? min : max;
  const worstScore = ranking === ScoreRankings.LowestBest ? max : min;

  const idsWithScore = (target: number) =>
    Object.entries(scores)
      .filter(([, value]) => value === target)
      .map(([id]) => id);

  return {
    winners: idsWithScore(bestScore),
    outsiders: idsWithScore(worstScore),
  };
};
