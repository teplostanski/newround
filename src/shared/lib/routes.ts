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
  sessions: (gameId: string) => withQuery('/sessions', { gameId }),
  session: (gameId: string, sessionId: string) =>
    withQuery('/sessions/view', { gameId, sessionId }),
  round: (gameId: string, sessionId: string, roundId: string) =>
    withQuery('/rounds/view', { gameId, sessionId, roundId }),
};
