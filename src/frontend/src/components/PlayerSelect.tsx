import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { CricketPlayer, IPLTeam, InternationalTeam } from "../data/teams";

interface SelectedLineup {
  battingOrder: CricketPlayer[];
  bowler: CricketPlayer;
}

interface Props {
  team: IPLTeam | InternationalTeam;
  onConfirm: (lineup: SelectedLineup) => void;
  onBack: () => void;
}

export default function PlayerSelect({ team, onConfirm, onBack }: Props) {
  const defaultOrder = [...team.players].sort(
    (a, b) => a.battingOrder - b.battingOrder,
  );
  const [battingOrder, setBattingOrder] =
    useState<CricketPlayer[]>(defaultOrder);
  const [selectedBowler, setSelectedBowler] = useState<CricketPlayer>(
    team.players.find((p) => p.isBowler) ?? team.players[10],
  );
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const bowlers = team.players.filter((p) => p.isBowler);

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const newOrder = [...battingOrder];
    [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
    setBattingOrder(newOrder);
  };

  const moveDown = (idx: number) => {
    if (idx === battingOrder.length - 1) return;
    const newOrder = [...battingOrder];
    [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
    setBattingOrder(newOrder);
  };

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const newOrder = [...battingOrder];
    const [removed] = newOrder.splice(dragIdx, 1);
    newOrder.splice(idx, 0, removed);
    setBattingOrder(newOrder);
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const roleColor = (role: string) => {
    if (role === "batsman") return "#3B82F6";
    if (role === "bowler") return "#EF4444";
    if (role === "allrounder") return "#10B981";
    return "#F59E0B";
  };

  return (
    <div
      className="min-h-screen flex flex-col px-4 py-6"
      style={{
        background: "linear-gradient(135deg, #0a0a1a 0%, #0d1b2a 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-4"
      >
        <button
          type="button"
          onClick={onBack}
          className="text-white/60 hover:text-white text-sm px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          ← Back
        </button>
        <div>
          <h2 className="text-white font-black text-xl">
            🏏 Set Your Batting Order
          </h2>
          <p className="text-white/40 text-xs">
            {team.name} — Drag or use arrows to reorder. Pick your bowler.
          </p>
        </div>
      </motion.div>

      <div className="max-w-lg mx-auto w-full flex flex-col gap-4">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="px-4 py-2 border-b border-white/10">
            <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">
              Batting Order — Drag to reorder
            </span>
          </div>
          {battingOrder.map((player, idx) => (
            <AnimatePresence key={player.name} mode="popLayout">
              <motion.div
                layout
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={() => {
                  setDragIdx(null);
                  setDragOverIdx(null);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 border-b border-white/5 cursor-grab transition-all ${
                  dragOverIdx === idx ? "bg-white/10" : "hover:bg-white/5"
                } ${dragIdx === idx ? "opacity-50" : ""}`}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{
                    background:
                      idx < 2
                        ? "#D4AF3733"
                        : idx < 5
                          ? "#3B82F633"
                          : "#6B728033",
                    color:
                      idx < 2 ? "#D4AF37" : idx < 5 ? "#60A5FA" : "#9CA3AF",
                  }}
                >
                  {idx + 1}
                </div>

                {/* Player photo */}
                <div
                  className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border"
                  style={{
                    borderColor: `${roleColor(player.role)}66`,
                    background: "rgba(255,255,255,0.08)",
                  }}
                >
                  {player.photoUrl ? (
                    <img
                      src={player.photoUrl}
                      alt={player.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/40 text-xs font-bold">
                      {player.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-white text-sm font-semibold truncate block">
                    {player.name}
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: roleColor(player.role) }}
                  >
                    {player.role.charAt(0).toUpperCase() + player.role.slice(1)}
                    {player.isBowler && (
                      <span className="ml-1 text-white/30">• Can bowl</span>
                    )}
                  </span>
                </div>

                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="w-6 h-6 rounded text-xs font-bold flex items-center justify-center disabled:opacity-20"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                    }}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(idx)}
                    disabled={idx === battingOrder.length - 1}
                    className="w-6 h-6 rounded text-xs font-bold flex items-center justify-center disabled:opacity-20"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                    }}
                  >
                    ↓
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          ))}
        </div>

        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3">
            Choose Opening Bowler
          </p>
          <div className="grid grid-cols-2 gap-2">
            {bowlers.map((b) => (
              <button
                key={b.name}
                type="button"
                onClick={() => setSelectedBowler(b)}
                className="rounded-xl p-2.5 text-left transition-all flex items-center gap-2.5"
                style={{
                  background:
                    selectedBowler.name === b.name
                      ? "#EF444433"
                      : "rgba(255,255,255,0.06)",
                  border: `1px solid ${selectedBowler.name === b.name ? "#EF4444" : "rgba(255,255,255,0.1)"}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2"
                  style={{
                    borderColor:
                      selectedBowler.name === b.name
                        ? "#EF4444"
                        : "rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.08)",
                  }}
                >
                  {b.photoUrl ? (
                    <img
                      src={b.photoUrl}
                      alt={b.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/40 text-xs font-bold">
                      {b.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">{b.name}</p>
                  <p className="text-white/50 text-xs">{b.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div
          className="rounded-xl px-4 py-3"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-white/50 text-xs mb-1">
            Opening pair:{" "}
            <span className="text-white font-semibold">
              {battingOrder[0]?.name}
            </span>{" "}
            &amp;{" "}
            <span className="text-white font-semibold">
              {battingOrder[1]?.name}
            </span>
          </p>
          <p className="text-white/50 text-xs">
            Bowler:{" "}
            <span className="text-red-400 font-semibold">
              {selectedBowler.name}
            </span>
          </p>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onConfirm({ battingOrder, bowler: selectedBowler })}
          className="w-full py-4 rounded-2xl text-white font-black text-lg"
          style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
        >
          ✅ Confirm Lineup &amp; Continue
        </motion.button>
      </div>
    </div>
  );
}

export type { SelectedLineup };
