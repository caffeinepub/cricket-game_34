import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DeliveryType } from "../data/teams";
import { DELIVERY_COLORS, DELIVERY_LABELS } from "../data/teams";
import type { ArrowKey, BallDrift } from "../types/game";
import { resolveDirectionalShot } from "../utils/cricket";

interface Props {
  onBack: () => void;
}

export default function PracticeNets({ onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ballsFaced, setBallsFaced] = useState(0);
  const [runsScored, setRunsScored] = useState(0);
  const [selectedDelivery, setSelectedDelivery] =
    useState<DeliveryType>("swing");
  const [phase, setPhase] = useState<"waiting" | "bowling" | "result">(
    "waiting",
  );
  const [lastResult, setLastResult] = useState<string | null>(null);
  const phaseRef = useRef<"waiting" | "bowling" | "result">("waiting");
  const arrowRef = useRef<ArrowKey | null>(null);
  const animRef = useRef<number | null>(null);
  const ballXRef = useRef(0);
  const ballYRef = useRef(0);
  const ballVisibleRef = useRef(false);

  const drawNets = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.5);
    sky.addColorStop(0, "#87CEEB");
    sky.addColorStop(1, "#B0E0FF");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h * 0.5);

    // Ground
    const groundG = ctx.createLinearGradient(0, h * 0.5, 0, h);
    groundG.addColorStop(0, "#4CAF50");
    groundG.addColorStop(1, "#2E7D32");
    ctx.fillStyle = groundG;
    ctx.fillRect(0, h * 0.5, w, h * 0.5);

    // Net frame
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 3;
    ctx.strokeRect(w * 0.2, h * 0.05, w * 0.6, h * 0.6);
    // Net lines
    ctx.strokeStyle = "rgba(200,200,200,0.4)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(w * 0.2 + ((w * 0.6) / 8) * i, h * 0.05);
      ctx.lineTo(w * 0.2 + ((w * 0.6) / 8) * i, h * 0.65);
      ctx.stroke();
    }
    for (let i = 1; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(w * 0.2, h * 0.05 + ((h * 0.6) / 8) * i);
      ctx.lineTo(w * 0.8, h * 0.05 + ((h * 0.6) / 8) * i);
      ctx.stroke();
    }

    // Pitch strip
    ctx.fillStyle = "#D4B86A";
    ctx.fillRect(w / 2 - 30, h * 0.4, 60, h * 0.3);

    // Stumps
    ctx.fillStyle = "#F5F0E0";
    for (const o of [-8, 0, 8]) {
      ctx.fillRect(w / 2 + o - 2, h * 0.72 - 24, 4, 24);
    }

    // Ball
    if (ballVisibleRef.current) {
      ctx.beginPath();
      ctx.arc(ballXRef.current, ballYRef.current, 8, 0, Math.PI * 2);
      const bg = ctx.createRadialGradient(
        ballXRef.current - 2,
        ballYRef.current - 2,
        1,
        ballXRef.current,
        ballYRef.current,
        8,
      );
      bg.addColorStop(0, "#ff8080");
      bg.addColorStop(1, "#7a0000");
      ctx.fillStyle = bg;
      ctx.fill();
    }

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";
    ctx.fillText("PRACTICE NETS", w / 2, h * 0.96);
    ctx.textAlign = "left";
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawNets();
  }, [drawNets]);

  const bowl = useCallback(() => {
    if (phaseRef.current !== "waiting") return;
    phaseRef.current = "bowling";
    setPhase("bowling");
    arrowRef.current = null;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const startX = canvas.width / 2;
    const startY = canvas.height * 0.3;
    const endY = canvas.height * 0.72;
    const start = performance.now();
    const duration = 1000;

    ballXRef.current = startX;
    ballYRef.current = startY;
    ballVisibleRef.current = true;

    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      ballXRef.current =
        startX +
        (selectedDelivery === "inswing"
          ? -30
          : selectedDelivery === "outswing"
            ? 30
            : 0) *
          t;
      ballYRef.current =
        startY +
        (endY - startY) * t +
        (selectedDelivery === "bouncer" ? -Math.sin(Math.PI * t) * 40 : 0);
      drawNets();
      if (t < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        ballVisibleRef.current = false;
        drawNets();
        const key = arrowRef.current;
        const outcome = resolveDirectionalShot(key, 0 as BallDrift, "medium");
        setBallsFaced((b) => b + 1);
        setRunsScored((r) => r + outcome.runs);
        const resultStr = outcome.isWicket
          ? "OUT! (No wickets in practice)"
          : outcome.runs === 6
            ? "SIX! 🚀"
            : outcome.runs === 4
              ? "FOUR! 🏏"
              : `${outcome.runs} run${outcome.runs !== 1 ? "s" : ""}`;
        setLastResult(resultStr);
        phaseRef.current = "result";
        setPhase("result");
        setTimeout(() => {
          phaseRef.current = "waiting";
          setPhase("waiting");
          setLastResult(null);
        }, 1500);
      }
    };
    animRef.current = requestAnimationFrame(step);
  }, [drawNets, selectedDelivery]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        bowl();
      }
      if (e.code === "ArrowLeft" && phaseRef.current === "bowling")
        arrowRef.current = "left";
      if (e.code === "ArrowRight" && phaseRef.current === "bowling")
        arrowRef.current = "right";
      if (e.code === "ArrowUp" && phaseRef.current === "bowling")
        arrowRef.current = "up";
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bowl]);

  const strikeRate =
    ballsFaced > 0 ? ((runsScored / ballsFaced) * 100).toFixed(0) : "0";

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: "rgba(0,0,0,0.5)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          className="text-white/60 hover:text-white text-sm px-3 py-1 rounded-lg"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          ← Back
        </button>
        <div className="flex gap-6 text-center">
          <div>
            <p className="text-white font-bold text-lg">{runsScored}</p>
            <p className="text-white/40 text-xs">Runs</p>
          </div>
          <div>
            <p className="text-white font-bold text-lg">{ballsFaced}</p>
            <p className="text-white/40 text-xs">Balls</p>
          </div>
          <div>
            <p className="text-white font-bold text-lg">{strikeRate}</p>
            <p className="text-white/40 text-xs">SR</p>
          </div>
        </div>
        <span className="text-green-400 text-xs font-bold uppercase tracking-wider">
          🎯 Practice
        </span>
      </div>

      <div className="flex-1 relative" style={{ minHeight: 300 }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ minHeight: 300 }}
        />
        <AnimatePresence>
          {lastResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-black text-3xl text-center z-20"
              style={{ textShadow: "0 2px 16px #000" }}
            >
              {lastResult}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className="px-4 py-4"
        style={{
          background: "rgba(0,0,0,0.4)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <p className="text-white/50 text-xs mb-2 text-center">
          Choose delivery type:
        </p>
        <div className="flex gap-2 flex-wrap justify-center mb-3">
          {(Object.keys(DELIVERY_LABELS) as DeliveryType[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDelivery(d)}
              className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                background:
                  selectedDelivery === d
                    ? DELIVERY_COLORS[d]
                    : "rgba(255,255,255,0.08)",
                color: "#fff",
                border: `1px solid ${selectedDelivery === d ? DELIVERY_COLORS[d] : "rgba(255,255,255,0.15)"}`,
              }}
            >
              {DELIVERY_LABELS[d]}
            </button>
          ))}
        </div>
        <div className="flex gap-2 justify-center">
          {phase === "waiting" ? (
            <button
              type="button"
              onClick={bowl}
              className="px-8 py-3 rounded-xl text-white font-black text-base"
              style={{ background: "#059669" }}
            >
              🏏 BOWL (SPACE)
            </button>
          ) : phase === "bowling" ? (
            <div className="flex gap-2">
              {(["left", "up", "right"] as ArrowKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onPointerDown={() => {
                    arrowRef.current = k;
                  }}
                  className="px-4 py-3 rounded-xl text-white font-bold"
                  style={{
                    background:
                      k === "left"
                        ? "#059669"
                        : k === "up"
                          ? "#D97706"
                          : "#2563EB",
                  }}
                >
                  {k === "left" ? "← Leg" : k === "up" ? "↑ Loft" : "→ Off"}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
