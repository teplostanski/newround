export const transitionNames = {
  pageTitle: 'page-title',
  newGameTitle: 'new-game-title',
  gameTitle: (gameId: string) => `game-title-${gameId}`,
  sessionTitle: (sessionId: string) => `session-title-${sessionId}`,
  roundTitle: (roundId: string) => `round-title-${roundId}`,
};

export const routeTransitionTypes = {
  forward: ['nav-forward'],
  back: ['nav-back'],
};

export const titleTransitionStyle = (name: string) => ({
  viewTransitionName: name,
  viewTransitionClass: 'title-fly',
});
