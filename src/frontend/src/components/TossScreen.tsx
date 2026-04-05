import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { IPLTeam, InternationalTeam } from "../data/teams";

interface Props {
  playerTeam: IPLTeam | InternationalTeam;
  onComplete: (batFirst: boolean) => void;
}

type TossPhase =
  | "choose"
  | "flipping"
  | "result-won"
  | "result-lost"
  | "decide";

export default function TossScreen({ playerTeam, onComplete }: Props) {
  const [phase, setPhase] = useState<TossPhase>("choose");
  const [_playerChoice, setPlayerChoice] = useState<"heads" | "tails" | null>(
    null,
  );
  const [tossResult, setTossResult] = useState<"heads" | "tails">("heads");
  const [won, setWon] = useState(false);

  const chooseSide = (choice: "heads" | "tails") => {
    setPlayerChoice(choice);
    setPhase("flipping");

    setTimeout(() => {
      const result: "heads" | "tails" = Math.random() > 0.5 ? "heads" : "tails";
      setTossResult(result);
      const didWin = result === choice;
      setWon(didWin);
      setPhase(didWin ? "result-won" : "result-lost");

      if (!didWin) {
        // Opposition won the toss and chose to bowl — player bats first
        setTimeout(() => onComplete(true), 2500);
      } else {
        setTimeout(() => setPhase("decide"), 2200);
      }
    }, 2000);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #0a1628 0%, #1a0a28 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="text-5xl mb-3">🪙</div>
        <h2 className="text-white font-black text-3xl">THE TOSS</h2>
        <p className="text-white/50 text-sm mt-1">{playerTeam.name}</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === "choose" && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-white/70 text-lg">Call the toss:</p>
            <div className="flex gap-6">
              {(["heads", "tails"] as const).map((side) => (
                <motion.button
                  key={side}
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => chooseSide(side)}
                  className="w-36 h-36 rounded-full flex flex-col items-center justify-center text-white font-black text-xl"
                  style={{
                    background:
                      side === "heads"
                        ? "linear-gradient(135deg, #D4AF37, #B8960C)"
                        : "linear-gradient(135deg, #C0C0C0, #909090)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                  }}
                >
                  <span className="text-4xl mb-1">
                    {side === "heads" ? "👑" : "🔰"}
                  </span>
                  <span className="uppercase tracking-wider text-sm">
                    {side}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "flipping" && (
          <motion.div
            key="flipping"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <motion.div
              animate={{ rotateY: [0, 180, 360, 540, 720, 900, 1080] }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full flex items-center justify-center text-6xl"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #B8960C)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              }}
            >
              🪙
            </motion.div>
            <p className="text-white/70 text-xl font-semibold">Flipping...</p>
          </motion.div>
        )}

        {(phase === "result-won" || phase === "result-lost") && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="text-7xl">{won ? "🎉" : "😔"}</div>
            <h3 className="text-white font-black text-3xl">
              {tossResult.toUpperCase()}!
            </h3>
            <p
              className={`text-xl font-bold ${won ? "text-green-400" : "text-red-400"}`}
            >
              {won ? "You won the toss!" : "You lost the toss"}
            </p>
            {!won && (
              <p className="text-white/60 text-sm">
                Opposition chose to bowl first. You bat!
              </p>
            )}
          </motion.div>
        )}

        {phase === "decide" && (
          <motion.div
            key="decide"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <div className="text-5xl">🏑</div>
            <p className="text-white font-bold text-xl">
              You won the toss! Choose to:
            </p>
            <div className="flex gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onComplete(true)}
                className="px-8 py-4 rounded-2xl text-white font-black text-lg"
                style={{
                  background: "linear-gradient(135deg, #059669, #047857)",
                }}
              >
                🏑 BAT FIRST
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onComplete(false)}
                className="px-8 py-4 rounded-2xl text-white font-black text-lg"
                style={{
                  background: "linear-gradient(135deg, #DC2626, #B91C1C)",
                }}
              >
                🎳 BOWL FIRST
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
