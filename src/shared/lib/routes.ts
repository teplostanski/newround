const withQuery = (
  pathname: string,
  params: Record<string, string>,
): string => {
  const search = new URLSearchParams(params);
  return `${pathname}?${search.toString()}`;
};

export const routes = {
  home: '/',
  gameCreate: '/game/create',
  game: (gameId: string) => withQuery('/game', { gameId }),
  playthrough: (gameId: string, playthroughId: string) =>
    withQuery('/playthrough', { gameId, playthroughId }),
  round: (gameId: string, playthroughId: string, roundId: string) =>
    withQuery('/round', { gameId, playthroughId, roundId }),
};
