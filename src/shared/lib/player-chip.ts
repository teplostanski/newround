import type { CSSProperties } from 'react';

const playerChipCount = 8;

type PlayerChipStyle = CSSProperties & {
  '--chip-bg': string;
  '--chip-fg': string;
};

const getPlayerChipStyle = (index: number): PlayerChipStyle => {
  const chip = (index % playerChipCount) + 1;

  return {
    '--chip-bg': `var(--player-${chip}-fill)`,
    '--chip-fg': `var(--player-${chip}-text)`,
  };
};

export { getPlayerChipStyle };
