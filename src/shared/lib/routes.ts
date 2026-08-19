const withQuery = (
  pathname: string,
  params: Record<string, string>,
): string => {
  const search = new URLSearchParams(params);
  return `${pathname}?${search.toString()}`;
};

export const routes = {
  games: '/games',
  newGame: '/games/new',
  playthroughs: (gameId: string) => withQuery('/playthroughs', { gameId }),
  playthrough: (gameId: string, playthroughId: string) =>
    withQuery('/playthroughs/view', { gameId, playthroughId }),
  round: (gameId: string, playthroughId: string, roundId: string) =>
    withQuery('/rounds/view', { gameId, playthroughId, roundId }),
  migration: '/migration',
};
