import type { Player, ScoreMap } from './app';

type RoundScreenProps = {
  players: Player[];
  scores: ScoreMap;
  roundNumber: number;
  onChangeScore: (id: string, newValue: number) => void;
};

const RoundScreen = ({
  players,
  scores,
  roundNumber,
  onChangeScore,
}: RoundScreenProps) => {
  const incScore = (playerId: string) => {
    const currentScore = scores[playerId];

    return currentScore + 1;
  };

  const decScore = (playerId: string) => {
    const currentScore = scores[playerId]

    return currentScore > 0 ? currentScore - 1 : 0;
  };

  return (
    <div>
      <p>Партия {roundNumber}</p>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            <div>
              <p>{player.name}</p>
              <p>{scores[player.id]}</p>
              <button
                onClick={() => onChangeScore(player.id, incScore(player.id))}
              >
                +
              </button>
              <button
                onClick={() => onChangeScore(player.id, decScore(player.id))}
              >
                -
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { RoundScreen };
