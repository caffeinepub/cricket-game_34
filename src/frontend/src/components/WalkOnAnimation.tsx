import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { IPLTeam, InternationalTeam } from "../data/teams";
import type { SelectedLineup } from "./PlayerSelect";

interface Props {
  team: IPLTeam | InternationalTeam;
  lineup: SelectedLineup;
  onComplete: () => void;
  opposingTeam?: IPLTeam | InternationalTeam | null;
}

type WalkPhase = "fielders" | "batters" | "ready";

const FIELDER_KEYS = [
  "f1",
  "f2",
  "f3",
  "f4",
  "f5",
  "f6",
  "f7",
  "f8",
  "f9",
] as const;

export default function WalkOnAnimation({ team, lineup, onComplete }: Props) {
  const [phase, setPhase] = useState<WalkPhase>("fielders");
  const [fieldersVisible, setFieldersVisible] = useState(false);
  const [battersVisible, setBattersVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setFieldersVisible(true);
      timerRef.current = setTimeout(() => {
        setPhase("batters");
        setBattersVisible(true);
        timerRef.current = setTimeout(() => {
          setPhase("ready");
          timerRef.current = setTimeout(() => {
            onComplete();
          }, 1800);
        }, 2200);
      }, 2200);
    }, 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onComplete]);

  const openerName = lineup.battingOrder[0]?.name ?? "Opener";
  const opener2Name = lineup.battingOrder[1]?.name ?? "Partner";
  const opener1Photo = lineup.battingOrder[0]?.photoUrl;
  const opener2Photo = lineup.battingOrder[1]?.photoUrl;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0a1628 0%, #0d2010 40%, #1a5010 100%)",
      }}
    >
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0a1628 0%, #132a18 45%, #1d5e18 70%, #226b1e 100%)",
        }}
      />

      {/* Stars in sky */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          [8, 5],
          [22, 8],
          [42, 4],
          [58, 7],
          [72, 3],
          [85, 6],
          [15, 12],
          [38, 10],
          [64, 11],
          [90, 9],
          [50, 2],
        ].map(([x, y]) => (
          <div
            key={`star-${x}-${y}`}
            className="absolute bg-white rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: 2,
              height: 2,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      {/* Outfield — lush green */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "58%",
          background:
            "linear-gradient(180deg, #2d8a1e 0%, #3aaa28 30%, #2a7a18 70%, #1a5010 100%)",
        }}
      />

      {/* Mowing stripes */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden"
        style={{ height: "58%" }}
      >
        {Array.from({ length: 12 }, (_, i) => i).map((i) => (
          <div
            key={`stripe-pos-${i}`}
            className="absolute top-0 bottom-0"
            style={{
              left: `${(i / 12) * 100}%`,
              width: `${100 / 12}%`,
              background:
                i % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.06)",
            }}
          />
        ))}
      </div>

      {/* Boundary rope */}
      <div
        className="absolute"
        style={{
          bottom: "30%",
          left: "8%",
          right: "8%",
          height: 3,
          borderRadius: 99,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 20%, rgba(255,255,255,0.5) 80%, rgba(255,255,255,0) 100%)",
        }}
      />

      {/* Pitch rectangle */}
      <div
        className="absolute"
        style={{
          bottom: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 90,
          height: 220,
          background:
            "linear-gradient(180deg, #b8953f 0%, #d4b870 40%, #c9a84c 100%)",
          borderRadius: 4,
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}
      />

      {/* Crease lines on pitch */}
      <div
        className="absolute flex flex-col justify-between"
        style={{
          bottom: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 90,
          height: 220,
          padding: "18px 0",
        }}
      >
        {[0, 1].map((i) => (
          <div
            key={`crease-${i}`}
            style={{
              width: "100%",
              height: 2,
              background: "rgba(255,255,255,0.8)",
            }}
          />
        ))}
      </div>

      {/* Stumps */}
      <div
        className="absolute flex gap-2"
        style={{ bottom: "19.5%", left: "50%", transform: "translateX(-50%)" }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: 24,
              background: "#F5F0E0",
              borderRadius: 2,
            }}
          />
        ))}
      </div>

      {/* Floodlight poles */}
      {["12%", "88%"].map((left) => (
        <div
          key={left}
          className="absolute"
          style={{
            left,
            top: "4%",
            bottom: "42%",
            width: 6,
            background: "#666",
            borderRadius: 3,
          }}
        >
          <div className="absolute -top-1 flex gap-0.5" style={{ left: -10 }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#FFF3B0",
                  boxShadow: "0 0 6px 2px rgba(255,240,150,0.6)",
                }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Text overlays */}
      <div className="relative z-10 text-center mb-8">
        {phase === "fielders" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-yellow-400 font-black text-2xl tracking-wider drop-shadow-lg">
              FIELDERS TAKING THE GROUND
            </p>
            <p className="text-white/50 text-sm mt-1">
              Opponent team sets up their field...
            </p>
          </motion.div>
        )}
        {phase === "batters" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-green-400 font-black text-2xl tracking-wider drop-shadow-lg">
              BATTERS WALKING IN!
            </p>
            <p className="text-white/60 text-sm mt-1">
              {openerName} and {opener2Name} stride to the crease
            </p>
          </motion.div>
        )}
        {phase === "ready" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" }}
          >
            <p className="text-white font-black text-4xl drop-shadow-lg">
              LET'S PLAY! 🏑
            </p>
          </motion.div>
        )}
      </div>

      {/* Fielders */}
      {fieldersVisible && (
        <div
          className="absolute px-8"
          style={{
            bottom: "34%",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          {FIELDER_KEYS.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, type: "spring", stiffness: 180 }}
              className="flex flex-col items-center gap-0.5"
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#D4A574",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 20,
                  borderRadius: 4,
                  background: team.primaryColor,
                  border: `1px solid ${team.secondaryColor}`,
                }}
              />
              <div style={{ display: "flex", gap: 2 }}>
                <div
                  style={{
                    width: 5,
                    height: 14,
                    background: "#FFFFFF",
                    borderRadius: 2,
                  }}
                />
                <div
                  style={{
                    width: 5,
                    height: 14,
                    background: "#FFFFFF",
                    borderRadius: 2,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Batters */}
      {battersVisible && (
        <div
          className="absolute flex gap-6"
          style={{ bottom: "22%", left: "50%", transform: "translateX(-50%)" }}
        >
          {(
            [
              { name: openerName, photo: opener1Photo },
              { name: opener2Name, photo: opener2Photo },
            ] as { name: string; photo?: string }[]
          ).map(({ name, photo }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.35, type: "spring", stiffness: 100 }}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="rounded-full overflow-hidden border-2 shadow-xl"
                style={{
                  width: 56,
                  height: 56,
                  borderColor: team.secondaryColor || "#fff",
                  background: "rgba(0,0,0,0.4)",
                  boxShadow: `0 0 20px ${team.primaryColor}88`,
                }}
              >
                {photo ? (
                  <img
                    src={photo}
                    alt={name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50 text-lg font-black">
                    {name.charAt(0)}
                  </div>
                )}
              </div>
              {/* Jersey & pads below photo */}
              <div
                style={{
                  width: 18,
                  height: 22,
                  borderRadius: 4,
                  background: team.jerseyColor,
                  border: `2px solid ${team.secondaryColor}`,
                }}
              />
              <div style={{ display: "flex", gap: 3, marginTop: -4 }}>
                <div
                  style={{
                    width: 7,
                    height: 20,
                    background: "#F0F0F0",
                    borderRadius: 3,
                  }}
                />
                <div
                  style={{
                    width: 7,
                    height: 20,
                    background: "#F0F0F0",
                    borderRadius: 3,
                  }}
                />
              </div>
              <p className="text-white font-bold text-xs mt-1 whitespace-nowrap drop-shadow-lg">
                {name.split(" ").pop()}
              </p>
              <div
                className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${team.primaryColor}cc`, color: "#fff" }}
              >
                🏑 Opener {i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-6 text-center z-10"
      >
        <p className="text-white/40 text-xs uppercase tracking-widest">
          {team.name}
        </p>
      </motion.div>
    </div>
  );
}
