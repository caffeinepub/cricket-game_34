import { motion } from "motion/react";

export type MainMode = "ipl" | "international" | "practice";

interface Props {
  onSelect: (mode: MainMode) => void;
}

const modes = [
  {
    id: "ipl" as MainMode,
    label: "IPL",
    subtitle: "Indian Premier League",
    emoji: "🏆",
    desc: "10 franchises, real players, IPL Auction every 20 matches",
    gradient: "from-blue-900 via-purple-900 to-blue-800",
    border: "#7C3AED",
    badge: "TATA IPL",
  },
  {
    id: "international" as MainMode,
    label: "International",
    subtitle: "World Cricket",
    emoji: "🌍",
    desc: "8 nations, ICC rules, full squads with real player names",
    gradient: "from-green-900 via-emerald-900 to-teal-900",
    border: "#10B981",
    badge: "ICC",
  },
  {
    id: "practice" as MainMode,
    label: "Practice Nets",
    subtitle: "Free Batting",
    emoji: "🎯",
    desc: "No pressure, just practice. Perfect your timing and technique",
    gradient: "from-gray-800 via-zinc-900 to-gray-900",
    border: "#6B7280",
    badge: "FREE",
  },
];

export default function ModeSelector({ onSelect }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{
        background:
          "linear-gradient(135deg, #0a0a1a 0%, #0d1b2a 50%, #0a1628 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="text-6xl mb-3">🏑</div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
          CRICKET BLAST
        </h1>
        <p className="text-white/50 text-sm uppercase tracking-widest">
          Choose Your Game Mode
        </p>
      </motion.div>

      <div className="w-full max-w-xl flex flex-col gap-4">
        {modes.map((mode, i) => (
          <motion.button
            key={mode.id}
            type="button"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(mode.id)}
            className={`relative w-full rounded-2xl p-5 text-left overflow-hidden bg-gradient-to-r ${mode.gradient}`}
            style={{ border: `2px solid ${mode.border}44` }}
          >
            <span
              className="absolute top-3 right-3 text-xs font-black px-2 py-0.5 rounded-full tracking-wider"
              style={{
                background: `${mode.border}33`,
                color: mode.border,
                border: `1px solid ${mode.border}55`,
              }}
            >
              {mode.badge}
            </span>

            <div className="flex items-center gap-4">
              <span className="text-4xl">{mode.emoji}</span>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-white font-black text-xl">
                    {mode.label}
                  </span>
                  <span className="text-white/50 text-sm">{mode.subtitle}</span>
                </div>
                <p className="text-white/60 text-sm mt-0.5">{mode.desc}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 text-white/25 text-xs text-center"
      >
        Cricket Blast v8.0 — All 10 IPL teams included
      </motion.p>
    </div>
  );
}
