
const PlayerCardColors = {
  sage: '#b8d4c4',
  eucalyptus: '#aec8c0',
  fjord: '#a8c0cc',
  slate: '#b0bcc8',
  moss: '#b8c4bc',
  seaGlass: '#a8c4c0',
  drySage: '#c0c8bc',
  periwinkle: '#b4b8c8',
  mauve: '#c0bcc4',
  tealGray: '#bcc8c0',
} as const;

const playerCardColorList = Object.values(PlayerCardColors);

const getPlayerCardColor = (index: number) =>
  playerCardColorList[index % playerCardColorList.length];

export { PlayerCardColors, getPlayerCardColor };
