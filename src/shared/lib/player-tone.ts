const playerTones = [
  'accent',
  'success',
  'warning',
  'danger',
  'default',
] as const;

type PlayerTone = (typeof playerTones)[number];

const getPlayerTone = (index: number): PlayerTone =>
  playerTones[index % playerTones.length];

export { getPlayerTone, type PlayerTone };
