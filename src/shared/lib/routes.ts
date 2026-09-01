const withQuery = (
  pathname: string,
  params: Record<string, string>,
): string => {
  const search = new URLSearchParams(params);
  return `${pathname}?${search.toString()}`;
};

export const Paths = {
  Root: '/',
  Dev: '/dev',
  GameCreate: '/game/create',
  GameEdit: '/game/edit',
  Game: '/game',
  Playthrough: '/playthrough',
  Round: '/round',
} as const;

export const Routes = {
  Root: Paths.Root,
  Dev: Paths.Dev,
  GameCreate: Paths.GameCreate,
  GameEdit: (gameId: string) => withQuery(Paths.GameEdit, { gameId }),
  Game: (gameId: string) => withQuery(Paths.Game, { gameId }),
  Playthrough: (gameId: string, playthroughId: string) =>
    withQuery(Paths.Playthrough, { gameId, playthroughId }),
  Round: (gameId: string, playthroughId: string, roundId: string) =>
    withQuery(Paths.Round, { gameId, playthroughId, roundId }),
};
