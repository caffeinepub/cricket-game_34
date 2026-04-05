import { motion } from "motion/react";
import {
  INTERNATIONAL_TEAMS,
  type IPLTeam,
  IPL_TEAMS,
  type InternationalTeam,
} from "../data/teams";
import type { MainMode } from "./ModeSelector";

interface Props {
  mode: MainMode;
  onSelect: (team: IPLTeam | InternationalTeam) => void;
  onBack: () => void;
}

export default function TeamSelect({ mode, onSelect, onBack }: Props) {
  const teams = mode === "ipl" ? IPL_TEAMS : INTERNATIONAL_TEAMS;

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
        className="flex items-center gap-3 mb-6"
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
          <h2 className="text-white font-black text-2xl">
            {mode === "ipl" ? "🏆 IPL Teams" : "🌍 International Teams"}
          </h2>
          <p className="text-white/40 text-xs">Select your team</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto w-full">
        {teams.map((team, i) => (
          <motion.button
            key={team.id}
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(team)}
            className="relative rounded-2xl p-4 text-left overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${team.primaryColor}cc, ${team.primaryColor}44)`,
              border: `2px solid ${team.primaryColor}88`,
            }}
          >
            <div
              className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl"
              style={{ background: team.secondaryColor }}
            />
            <div className="pl-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  {"flag" in team && (
                    <span className="text-2xl mr-2">
                      {(team as InternationalTeam).flag}
                    </span>
                  )}
                  <span className="text-white font-black text-lg">
                    {team.shortName}
                  </span>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${team.secondaryColor}33`,
                    color: team.secondaryColor,
                  }}
                >
                  {team.players.length} Players
                </span>
              </div>
              <p className="text-white/90 font-semibold text-sm">{team.name}</p>
              <p className="text-white/50 text-xs mt-1">
                {team.players
                  .slice(0, 3)
                  .map((p) => p.name)
                  .join(", ")}
                ...
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
