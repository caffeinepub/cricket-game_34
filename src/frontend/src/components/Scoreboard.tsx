import type { GameState } from "../types/game";
import { calcRunRate, formatOvers } from "../utils/cricket";

interface Props {
  state: GameState;
  target: number;
}

export default function Scoreboard({ state, target }: Props) {
  const rr = calcRunRate(state.runs, state.ballsBowled);
  const needed = Math.max(0, target - state.runs);
  const ballsLeft = Math.max(
    0,
    (state.ballsBowled <= 30 ? 30 : state.ballsBowled) - state.ballsBowled,
  );
  const rrr = ballsLeft > 0 ? ((needed / ballsLeft) * 6).toFixed(2) : "—";

  return (
    <div
      className="absolute top-4 left-4 z-20 rounded-xl shadow-overlay overflow-hidden text-white"
      style={{
        background: "linear-gradient(135deg, #0E3B1F, #1C5A2E)",
        minWidth: 160,
      }}
      data-ocid="game.scoreboard.panel"
    >
      <div className="px-4 pt-3 pb-1.5 border-b border-white/20">
        <p className="text-white/60 text-xs uppercase tracking-widest font-semibold">
          Score
        </p>
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
      </div>
    </div>
  );
}
