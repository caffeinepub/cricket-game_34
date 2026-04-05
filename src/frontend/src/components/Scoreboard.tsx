import type { Difficulty, GameState } from "../types/game";
import { calcRunRate, formatOvers } from "../utils/cricket";

interface Props {
  state: GameState;
  target: number;
  partnership?: { runs: number; balls: number };
  isPowerPlay?: boolean;
  difficulty?: Difficulty;
}

export default function Scoreboard({
  state,
  target,
  partnership,
  isPowerPlay,
  difficulty,
}: Props) {
  const rr = calcRunRate(state.runs, state.ballsBowled);
  const needed = Math.max(0, target - state.runs);
  const totalBalls = state.ballsBowled <= 120 ? 120 : state.ballsBowled;
  const ballsLeft = Math.max(0, totalBalls - state.ballsBowled);
  const rrr = ballsLeft > 0 ? ((needed / ballsLeft) * 6).toFixed(2) : "—";

  const difficultyConfig = {
    easy: { label: "Easy", color: "#16a34a", bg: "rgba(22,163,74,0.18)" },
    medium: { label: "Medium", color: "#d97706", bg: "rgba(217,119,6,0.18)" },
    hard: { label: "Hard", color: "#dc2626", bg: "rgba(220,38,38,0.18)" },
  };

  const diff = difficulty ? difficultyConfig[difficulty] : null;

  return (
    <div
      className="absolute top-4 left-4 z-20 rounded-xl shadow-overlay overflow-hidden text-white"
      style={{
        background: "linear-gradient(135deg, #0E3B1F, #1C5A2E)",
        minWidth: 170,
      }}
      data-ocid="game.scoreboard.panel"
    >
      <div className="px-4 pt-3 pb-1.5 border-b border-white/20 flex items-center justify-between">
        <p className="text-white/60 text-xs uppercase tracking-widest font-semibold">
          Score
        </p>
        {isPowerPlay && (
          <span
            className="text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse"
            style={{ background: "rgba(234,179,8,0.25)", color: "#fde047" }}
          >
            ⚡ PP
          </span>
        )}
      </div>
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold">
            {state.runs}/{state.wickets}
          </span>
          <span className="text-white/50 text-xs">runs/wkt</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="text-white/50">OVERS</p>
            <p className="font-semibold text-sm">
              {formatOvers(state.ballsBowled)}
            </p>
          </div>
          <div>
            <p className="text-white/50">RR</p>
            <p className="font-semibold text-sm">{rr}</p>
          </div>
          <div>
            <p className="text-white/50">RRR</p>
            <p className="font-semibold text-sm">{rrr}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs border-t border-white/20 pt-2">
          <span className="text-white/50">TARGET</span>
          <span className="font-bold text-green-300">{target}</span>
        </div>
        {partnership && (
          <div className="flex items-center justify-between text-xs border-t border-white/10 pt-1.5">
            <span className="text-white/40">PARTNERSHIP</span>
            <span className="font-semibold text-white/80">
              {partnership.runs} ({partnership.balls})
            </span>
          </div>
        )}
        {diff && (
          <div
            className="text-center text-xs font-bold px-2 py-1 rounded-lg mt-1"
            style={{ background: diff.bg, color: diff.color }}
          >
            {diff.label}
          </div>
        )}
      </div>
    </div>
  );
}
