import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface AuctionPlayer {
  name: string;
  role: string;
  team: string;
  basePrice: number;
}

interface Props {
  onComplete: () => void;
}

const AUCTION_PLAYERS: AuctionPlayer[] = [
  { name: "Virat Kohli", role: "Batsman", team: "RCB", basePrice: 15 },
  { name: "Rohit Sharma", role: "Batsman", team: "MI", basePrice: 14 },
  { name: "Jasprit Bumrah", role: "Bowler", team: "MI", basePrice: 12 },
  { name: "MS Dhoni", role: "Wicketkeeper", team: "CSK", basePrice: 12 },
  { name: "Andre Russell", role: "Allrounder", team: "KKR", basePrice: 10 },
  { name: "Hardik Pandya", role: "Allrounder", team: "GT", basePrice: 11 },
  { name: "AB de Villiers", role: "Batsman", team: "RCB", basePrice: 9 },
  { name: "Rashid Khan", role: "Bowler", team: "GT", basePrice: 9 },
  { name: "KL Rahul", role: "Wicketkeeper", team: "LSG", basePrice: 11 },
  { name: "Shubman Gill", role: "Batsman", team: "GT", basePrice: 8 },
  { name: "Jos Buttler", role: "Batsman", team: "RR", basePrice: 10 },
  { name: "Suryakumar Yadav", role: "Batsman", team: "MI", basePrice: 8 },
  { name: "Pat Cummins", role: "Bowler", team: "KKR", basePrice: 7 },
  { name: "Kagiso Rabada", role: "Bowler", team: "PBKS", basePrice: 7 },
  { name: "Glenn Maxwell", role: "Allrounder", team: "RCB", basePrice: 11 },
];

const IPL_WON_PLAYERS_KEY = "iplWonPlayers";

function saveWonPlayers(
  players: { player: AuctionPlayer; price: number }[],
): void {
  try {
    const existing = JSON.parse(
      localStorage.getItem(IPL_WON_PLAYERS_KEY) || "[]",
    ) as { player: AuctionPlayer; price: number }[];
    const merged = [...existing, ...players];
    localStorage.setItem(IPL_WON_PLAYERS_KEY, JSON.stringify(merged));
  } catch {
    // Ignore storage errors
  }
}

export default function IPLAuction({ onComplete }: Props) {
  const [budget, setBudget] = useState(100);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [bidAmount, setBidAmount] = useState<number>(
    AUCTION_PLAYERS[0].basePrice + 1,
  );
  const [wonPlayers, setWonPlayers] = useState<
    { player: AuctionPlayer; price: number }[]
  >([]);
  const [aiBid, setAiBid] = useState<number | null>(null);
  const [phase, setPhase] = useState<"bid" | "result" | "complete">("bid");
  const [lastResult, setLastResult] = useState<"won" | "lost" | null>(null);

  const currentPlayer = AUCTION_PLAYERS[currentIdx];

  useEffect(() => {
    if (currentPlayer) {
      setBidAmount(currentPlayer.basePrice + 1);
    }
  }, [currentPlayer]);

  const placeBid = () => {
    if (bidAmount > budget) return;
    const aiAmount =
      currentPlayer.basePrice + Math.floor(Math.random() * 8) + 1;
    setAiBid(aiAmount);
    const playerWins = bidAmount > aiAmount;
    setLastResult(playerWins ? "won" : "lost");
    setPhase("result");

    const newWonPlayers = playerWins
      ? [...wonPlayers, { player: currentPlayer, price: bidAmount }]
      : wonPlayers;

    if (playerWins) {
      setBudget((b) => b - bidAmount);
      setWonPlayers(newWonPlayers);
    }

    setTimeout(() => {
      const next = currentIdx + 1;
      if (
        next >= AUCTION_PLAYERS.length ||
        budget - (playerWins ? bidAmount : 0) < 1
      ) {
        // Save won players to localStorage before completing
        saveWonPlayers(newWonPlayers);
        setPhase("complete");
      } else {
        setCurrentIdx(next);
        setAiBid(null);
        setLastResult(null);
        setPhase("bid");
      }
    }, 2000);
  };

  const skipPlayer = () => {
    const next = currentIdx + 1;
    if (next >= AUCTION_PLAYERS.length) {
      saveWonPlayers(wonPlayers);
      setPhase("complete");
    } else {
      setCurrentIdx(next);
    }
  };

  const roleColor = (role: string) => {
    if (role === "Batsman") return "#3B82F6";
    if (role === "Bowler") return "#EF4444";
    if (role === "Allrounder") return "#10B981";
    return "#F59E0B";
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{
        background: "linear-gradient(135deg, #0a0015 0%, #1a0030 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="text-4xl mb-2">🔨</div>
        <h2 className="text-white font-black text-3xl">IPL MEGA AUCTION</h2>
        <div className="flex items-center justify-center gap-4 mt-3">
          <span className="text-green-400 font-bold text-xl">
            ₹{budget} Cr remaining
          </span>
          <span className="text-white/40 text-sm">|</span>
          <span className="text-yellow-400 font-semibold">
            {wonPlayers.length} players won
          </span>
        </div>
      </motion.div>

      {phase === "complete" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-2xl p-6 text-center"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-white font-black text-2xl mb-2">
            Auction Complete!
          </h3>
          <p className="text-white/60 text-sm mb-2">
            You won {wonPlayers.length} player
            {wonPlayers.length !== 1 ? "s" : ""}
          </p>
          <p className="text-green-300 text-xs mb-4 font-medium">
            ✅ Your won players will be available in your next IPL match lineup.
          </p>
          <div className="flex flex-col gap-2 mb-6 max-h-48 overflow-y-auto">
            {wonPlayers.map(({ player, price }) => (
              <div
                key={player.name}
                className="flex justify-between items-center px-3 py-2 rounded-lg"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <span className="text-white text-sm font-semibold">
                  {player.name}
                </span>
                <span className="text-green-400 text-sm font-bold">
                  ₹{price} Cr
                </span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onComplete}
            className="w-full py-3 rounded-xl text-white font-black text-lg"
            style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)" }}
          >
            🏑 Continue to Match
          </button>
        </motion.div>
      ) : (
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPlayer?.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="rounded-2xl p-6 mb-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(91,33,182,0.2))",
                border: "2px solid rgba(124,58,237,0.4)",
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-black text-2xl">
                    {currentPlayer?.name}
                  </h3>
                  <span
                    className="text-sm font-bold"
                    style={{ color: roleColor(currentPlayer?.role ?? "") }}
                  >
                    {currentPlayer?.role}
                  </span>
                  <p className="text-white/50 text-xs mt-1">
                    Ex-{currentPlayer?.team}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/40 text-xs">Base Price</p>
                  <p className="text-yellow-400 font-black text-xl">
                    ₹{currentPlayer?.basePrice} Cr
                  </p>
                </div>
              </div>

              {phase === "result" && aiBid !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 rounded-xl text-center"
                  style={{
                    background:
                      lastResult === "won"
                        ? "rgba(16,185,129,0.2)"
                        : "rgba(239,68,68,0.2)",
                  }}
                >
                  <p className="text-white/60 text-xs">
                    AI bid: ₹{aiBid} Cr | Your bid: ₹{bidAmount} Cr
                  </p>
                  <p
                    className={`font-black text-lg ${
                      lastResult === "won" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {lastResult === "won" ? "✅ PLAYER WON!" : "❌ OUTBID!"}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {phase === "bid" && (
            <div className="flex flex-col gap-4">
              <div
                className="rounded-xl p-4"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p className="text-white/60 text-xs mb-2">Your Bid (₹ Crore)</p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setBidAmount((b) =>
                        Math.max((currentPlayer?.basePrice ?? 0) + 1, b - 1),
                      )
                    }
                    className="w-10 h-10 rounded-full text-white font-black text-xl"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    -
                  </button>
                  <span className="flex-1 text-center text-white font-black text-3xl">
                    ₹{bidAmount} Cr
                  </span>
                  <button
                    type="button"
                    onClick={() => setBidAmount((b) => Math.min(budget, b + 1))}
                    className="w-10 h-10 rounded-full text-white font-black text-xl"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    +
                  </button>
                </div>
                {bidAmount > budget && (
                  <p className="text-red-400 text-xs text-center mt-1">
                    Exceeds budget!
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={placeBid}
                  disabled={bidAmount > budget}
                  className="flex-1 py-3 rounded-xl text-white font-black disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg, #059669, #047857)",
                  }}
                >
                  🔨 BID ₹{bidAmount} Cr
                </motion.button>
                <button
                  type="button"
                  onClick={skipPlayer}
                  className="px-4 py-3 rounded-xl text-white/60 text-sm font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  Skip
                </button>
              </div>

              <p className="text-white/30 text-center text-xs">
                {AUCTION_PLAYERS.length - currentIdx - 1} players remaining in
                auction
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
