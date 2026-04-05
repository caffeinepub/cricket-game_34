import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GameMode } from "../App";
import type {
  ArrowKey,
  BallDrift,
  BallResult,
  Difficulty,
  GamePhase,
  GameState,
} from "../types/game";
import {
  ballResultLabel,
  powerPlayCommentary,
  resolveDirectionalShot,
} from "../utils/cricket";
import FireworksCelebration from "./FireworksCelebration";
import Scoreboard from "./Scoreboard";

interface Config {
  target: number;
  balls: number;
}

interface Props {
  config: Config;
  gameMode: GameMode;
  onBack: () => void;
  difficulty: Difficulty;
}

function makeInitialState(config: Config, difficulty: Difficulty): GameState {
  return {
    runs: 0,
    wickets: 0,
    ballsBowled: 0,
    overBalls: [],
    phase: "waiting",
    lastOutcome: null,
    commentary: `Chase ${config.target} runs in ${config.balls / 6} overs. Press SPACE to bowl!`,
    boundaries: 0,
    sixes: 0,
    fours: 0,
    highestScore: 0,
    partnershipRuns: 0,
    partnershipBalls: 0,
    milestoneShown: 0,
    overHistory: [],
    dots: 0,
    difficulty,
  };
}

// ─── Trail tracking ──────────────────────────────────────────────────────────────
const TRAIL_LENGTH = 10;

interface TrailPoint {
  x: number;
  y: number;
}

// ─── Pixel-Art Sprite Drawers ────────────────────────────────────────────────────────────

/**
 * Draw MS Dhoni-style batsman:
 * – Wide, low-crouched stance (feet spread wide)
 * – Both hands gripping bat low, ready for the helicopter shot
 * – Leaning slightly forward, weight on front foot
 * – Yellow CSK-style helmet, blue kit
 */
function drawBatsman(ctx: CanvasRenderingContext2D, cx: number, baseY: number) {
  // ── BOOTS (wide planted stance, feet ~40px apart)
  ctx.fillStyle = "#111111";
  ctx.fillRect(cx - 30, baseY - 7, 18, 7); // back boot (left)
  ctx.fillRect(cx + 14, baseY - 7, 18, 7); // front boot (right, stepped forward)

  // ── LEG PADS (white, tall, realistic proportions)
  // Back leg pad
  ctx.fillStyle = "#F0F0F0";
  ctx.fillRect(cx - 28, baseY - 52, 14, 46);
  // Front leg pad (slightly taller, forward)
  ctx.fillStyle = "#E8E8E8";
  ctx.fillRect(cx + 15, baseY - 58, 14, 52);
  // Pad straps (dark)
  ctx.fillStyle = "#999999";
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(cx - 28, baseY - 16 - i * 14, 14, 2);
    ctx.fillRect(cx + 15, baseY - 18 - i * 14, 14, 2);
  }
  // Knee rolls on front pad
  ctx.fillStyle = "#D8D8D8";
  ctx.fillRect(cx + 15, baseY - 52, 14, 8);

  // ── THIGH PAD (right leg, inner)
  ctx.fillStyle = "#D0D0D0";
  ctx.fillRect(cx + 10, baseY - 72, 10, 18);

  // ── BODY / JERSEY — India Blue #003087 with orange/white trim
  // Torso (slightly hunched forward = leaning left toward stumps)
  ctx.fillStyle = "#003087";
  ctx.fillRect(cx - 14, baseY - 98, 24, 46);
  // Collar area
  ctx.fillStyle = "#FF8800";
  ctx.fillRect(cx - 14, baseY - 98, 24, 5);
  ctx.fillRect(cx - 14, baseY - 86, 24, 3);
  // Jersey number 7 on chest
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 8px monospace";
  ctx.textAlign = "center";
  ctx.fillText("7", cx - 2, baseY - 72);
  ctx.textAlign = "left";

  // ── GLOVES — thick batting gloves
  // Bottom hand (right, lower on handle)
  ctx.fillStyle = "#C03018";
  ctx.fillRect(cx + 8, baseY - 88, 14, 14);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(cx + 8, baseY - 88, 14, 3);
  ctx.fillStyle = "#E04828";
  ctx.fillRect(cx + 10, baseY - 85, 10, 2);
  // Top hand (left, upper grip)
  ctx.fillStyle = "#C03018";
  ctx.fillRect(cx - 20, baseY - 80, 12, 12);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(cx - 20, baseY - 80, 12, 3);

  // ── BAT — held vertically, raised back, ready to strike (guard position)
  // Handle (vertical, raised slightly behind right shoulder)
  ctx.save();
  ctx.translate(cx + 20, baseY - 88);
  ctx.rotate(0.18); // slight backward lean
  ctx.fillStyle = "#5C3A1E";
  ctx.fillRect(-4, -46, 8, 46);
  // Grip tape wrapping
  ctx.fillStyle = "#1A1A1A";
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(-4, -43 + i * 7, 8, 3);
  }
  ctx.restore();
  // Bat blade (wide, facing bowler)
  ctx.save();
  ctx.translate(cx + 18, baseY - 46);
  ctx.rotate(0.18);
  ctx.fillStyle = "#C8922A";
  ctx.fillRect(-5, 0, 26, 58);
  // Blade face highlight
  ctx.fillStyle = "#E0AA40";
  ctx.fillRect(-4, 2, 6, 54);
  // Blade spine (right edge, 3D effect)
  ctx.fillStyle = "#8A6018";
  ctx.fillRect(18, 0, 3, 58);
  // Sweet spot marking
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(-4, 18, 26, 22);
  ctx.restore();

  // ── RIGHT ARM (bat arm — elbow raised, classic high-elbow guard)
  ctx.fillStyle = "#C89060";
  // Upper arm (raised, going up toward handle)
  ctx.fillRect(cx + 8, baseY - 100, 8, 22);
  // Forearm (angled outward toward bat)
  ctx.save();
  ctx.translate(cx + 14, baseY - 82);
  ctx.rotate(0.4);
  ctx.fillRect(-4, -20, 8, 20);
  ctx.restore();

  // ── LEFT ARM (front arm — bent, elbow pointing at bowler = classic batting stance)
  ctx.fillStyle = "#C89060";
  ctx.fillRect(cx - 18, baseY - 98, 8, 16);
  ctx.save();
  ctx.translate(cx - 14, baseY - 84);
  ctx.rotate(-0.55);
  ctx.fillRect(-4, -20, 8, 20);
  ctx.restore();

  // ── NECK
  ctx.fillStyle = "#C89060";
  ctx.fillRect(cx - 4, baseY - 104, 7, 8);

  // ── HEAD — facing side-on toward bowler (correct batting stance)
  ctx.fillStyle = "#C89060";
  ctx.beginPath();
  ctx.ellipse(cx, baseY - 114, 10, 12, -0.15, 0, Math.PI * 2);
  ctx.fill();

  // ── HELMET — Dhoni's iconic yellow/gold CSK helmet
  ctx.fillStyle = "#D4A000";
  ctx.beginPath();
  ctx.ellipse(cx, baseY - 118, 13, 10, -0.1, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(cx - 13, baseY - 120, 27, 7);
  // Helmet shine
  ctx.fillStyle = "#F5C500";
  ctx.beginPath();
  ctx.ellipse(cx - 4, baseY - 124, 6, 4, -0.1, Math.PI, 0);
  ctx.fill();
  // Peak (brim)
  ctx.fillStyle = "#A07800";
  ctx.fillRect(cx - 16, baseY - 114, 35, 4);

  // ── FACE GUARD / GRILL
  ctx.fillStyle = "#AAAAAA";
  ctx.fillRect(cx - 12, baseY - 114, 24, 5);
  // Face skin visible behind grill
  ctx.fillStyle = "#C89060";
  ctx.fillRect(cx - 9, baseY - 118, 18, 8);
  // Eyes (side-on, focused stare toward bowler)
  ctx.fillStyle = "#1A1A1A";
  ctx.fillRect(cx + 2, baseY - 116, 4, 2);
  // Grill vertical bars
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(cx - 10 + i * 5, baseY - 113, 2, 4);
  }
  // Grill horizontal bars
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(cx - 12, baseY - 112 + i * 2, 24, 1);
  }
}

function drawBowler(ctx: CanvasRenderingContext2D, cx: number, baseY: number) {
  // Legs
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(cx - 6, baseY - 34, 6, 34);
  ctx.fillRect(cx + 1, baseY - 38, 6, 38);
  // Boots
  ctx.fillStyle = "#1A1A1A";
  ctx.fillRect(cx - 8, baseY - 5, 9, 5);
  ctx.fillRect(cx, baseY - 5, 9, 5);
  // Body
  ctx.fillStyle = "#22863a";
  ctx.fillRect(cx - 8, baseY - 66, 18, 32);
  ctx.fillStyle = "#176030";
  ctx.fillRect(cx - 8, baseY - 66, 18, 4);
  // Arms
  ctx.fillStyle = "#22863a";
  ctx.fillRect(cx - 14, baseY - 63, 6, 18);
  ctx.save();
  ctx.translate(cx + 10, baseY - 55);
  ctx.rotate(-1.1);
  ctx.fillRect(-3, -18, 6, 22);
  ctx.restore();
  // Head
  ctx.fillStyle = "#D4A06A";
  ctx.beginPath();
  ctx.ellipse(cx + 1, baseY - 78, 9, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  // Helmet / cap
  ctx.fillStyle = "#22863a";
  ctx.beginPath();
  ctx.ellipse(cx + 1, baseY - 81, 11, 8, 0, Math.PI, 2 * Math.PI);
  ctx.fill();
  ctx.fillRect(cx - 11, baseY - 83, 24, 4);
  // Ball in hand
  ctx.beginPath();
  ctx.arc(cx + 14, baseY - 52, 6, 0, Math.PI * 2);
  const bg = ctx.createRadialGradient(
    cx + 12,
    baseY - 54,
    1,
    cx + 14,
    baseY - 52,
    6,
  );
  bg.addColorStop(0, "#ff8080");
  bg.addColorStop(0.4, "#cc2020");
  bg.addColorStop(1, "#7a0000");
  ctx.fillStyle = bg;
  ctx.fill();
}

/** Simple pixel-art fielder at boundary */
function drawFielder(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const s = 0.55;
  // Legs
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(x - 5 * s, y - 22 * s, 5 * s, 22 * s);
  ctx.fillRect(x + 1 * s, y - 22 * s, 5 * s, 22 * s);
  // Body
  ctx.fillStyle = "#B71C1C";
  ctx.fillRect(x - 7 * s, y - 44 * s, 15 * s, 22 * s);
  // Head
  ctx.fillStyle = "#D4A06A";
  ctx.beginPath();
  ctx.ellipse(x, y - 51 * s, 7 * s, 8 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // Cap
  ctx.fillStyle = "#B71C1C";
  ctx.beginPath();
  ctx.ellipse(x, y - 54 * s, 8 * s, 5 * s, 0, Math.PI, 2 * Math.PI);
  ctx.fill();
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  ballX: number,
  ballY: number,
  ballVisible: boolean,
  trail: TrailPoint[],
) {
  // ── Sky
  const sky = ctx.createLinearGradient(0, 0, 0, height * 0.55);
  sky.addColorStop(0, "#1a3a5c");
  sky.addColorStop(0.5, "#2d6a8a");
  sky.addColorStop(1, "#4a8fb0");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height * 0.55);

  // ── Stars
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  const stars = [
    [0.08, 0.03],
    [0.22, 0.06],
    [0.42, 0.02],
    [0.68, 0.05],
    [0.78, 0.02],
    [0.91, 0.07],
    [0.34, 0.09],
    [0.57, 0.04],
  ];
  for (const [sx, sy] of stars) {
    ctx.fillRect(sx * width, sy * height, 2, 2);
  }

  // ── Floodlights
  const poleColor = "#888888";
  const lightColor = "rgba(255,240,180,0.9)";
  const poles = [width * 0.08, width * 0.92];
  for (const px of poles) {
    ctx.fillStyle = poleColor;
    ctx.fillRect(px - 4, height * 0.1, 8, height * 0.38);
    ctx.fillRect(px - 16, height * 0.1, 32, 6);
    ctx.fillStyle = lightColor;
    for (let li = 0; li < 5; li++) {
      ctx.beginPath();
      ctx.arc(px - 12 + li * 6, height * 0.1 + 3, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    const glow = ctx.createRadialGradient(
      px,
      height * 0.1,
      0,
      px,
      height * 0.1,
      60,
    );
    glow.addColorStop(0, "rgba(255,240,180,0.18)");
    glow.addColorStop(1, "rgba(255,240,180,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(px, height * 0.1, 60, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Stadium seating
  const seatColors = ["#1a2a3a", "#16213a", "#0d1b2a"];
  for (let tier = 0; tier < 3; tier++) {
    ctx.fillStyle = seatColors[tier];
    ctx.beginPath();
    ctx.ellipse(
      width / 2,
      height * 0.42,
      width * (0.52 + tier * 0.05),
      height * (0.16 + tier * 0.04),
      0,
      Math.PI,
      0,
    );
    ctx.fill();
  }

  // ── Crowd rows
  const crowdColors = [
    "#E53935",
    "#1E88E5",
    "#FDD835",
    "#43A047",
    "#FB8C00",
    "#8E24AA",
    "#00ACC1",
    "#F4511E",
    "#FFFFFF",
    "#FF80AB",
    "#80D8FF",
    "#CCFF90",
  ];
  for (let row = 0; row < 5; row++) {
    const y = height * 0.38 - row * height * 0.038;
    const rowWidth = width * (0.6 + row * 0.04);
    const startX = width / 2 - rowWidth / 2;
    const count = Math.floor(rowWidth / 9);
    for (let col = 0; col < count; col++) {
      const x = startX + col * 9 + 4;
      ctx.fillStyle = crowdColors[(row * 13 + col * 7) % crowdColors.length];
      ctx.beginPath();
      ctx.ellipse(x, y, 3.5, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── Ground
  const groundGrad = ctx.createLinearGradient(0, height * 0.44, 0, height);
  groundGrad.addColorStop(0, "#2d6a1e");
  groundGrad.addColorStop(0.3, "#3a8a28");
  groundGrad.addColorStop(1, "#1a5010");
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, height * 0.44, width, height * 0.56);

  // ── Outfield mowing pattern
  for (let strip = 0; strip < 8; strip++) {
    if (strip % 2 === 0) {
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      ctx.fillRect(strip * (width / 8), height * 0.44, width / 8, height);
    }
  }

  // ── 30-yard circle
  ctx.beginPath();
  ctx.ellipse(
    width / 2,
    height * 0.72,
    width * 0.32,
    height * 0.2,
    0,
    0,
    Math.PI * 2,
  );
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // ── Pitch
  const pitchW = Math.max(width * 0.08, 56);
  const pitchH = height * 0.48;
  const pitchX = width / 2 - pitchW / 2;
  const pitchY = height * 0.3;
  const pitchGrad = ctx.createLinearGradient(
    pitchX,
    pitchY,
    pitchX,
    pitchY + pitchH,
  );
  pitchGrad.addColorStop(0, "#D8C070");
  pitchGrad.addColorStop(0.5, "#D4B86A");
  pitchGrad.addColorStop(1, "#C4A55A");
  ctx.fillStyle = pitchGrad;
  ctx.beginPath();
  ctx.roundRect(pitchX, pitchY, pitchW, pitchH, 4);
  ctx.fill();
  // Pitch wear marks
  ctx.fillStyle = "rgba(100,70,20,0.15)";
  ctx.beginPath();
  ctx.ellipse(
    width / 2,
    pitchY + pitchH * 0.4,
    pitchW * 0.25,
    pitchH * 0.08,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(
    width / 2,
    pitchY + pitchH * 0.7,
    pitchW * 0.3,
    pitchH * 0.06,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  // Crease lines
  ctx.strokeStyle = "rgba(255,255,255,0.75)";
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(pitchX - 10, pitchY + pitchH * 0.87);
  ctx.lineTo(pitchX + pitchW + 10, pitchY + pitchH * 0.87);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pitchX - 10, pitchY + pitchH * 0.12);
  ctx.lineTo(pitchX + pitchW + 10, pitchY + pitchH * 0.12);
  ctx.stroke();
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(pitchX - 6, pitchY + pitchH * 0.82);
  ctx.lineTo(pitchX + pitchW + 6, pitchY + pitchH * 0.82);
  ctx.stroke();
  ctx.setLineDash([]);

  // ── Stumps — batting end
  const stumpBaseY = pitchY + pitchH * 0.87;
  drawStumps(ctx, width / 2, stumpBaseY, 24);
  // ── Stumps — bowling end
  const bowlStumpY = pitchY + pitchH * 0.12;
  drawStumps(ctx, width / 2, bowlStumpY, 18);

  // ── Fielders at boundary positions
  drawFielder(ctx, width * 0.15, height * 0.6);
  drawFielder(ctx, width * 0.35, height * 0.55);
  drawFielder(ctx, width * 0.65, height * 0.55);
  drawFielder(ctx, width * 0.85, height * 0.6);

  // ── Sprites
  drawBatsman(ctx, width / 2 - 28, stumpBaseY);
  if (!ballVisible) {
    drawBowler(ctx, width / 2 + 18, bowlStumpY - 5);
  }

  // ── Ball trail
  if (ballVisible && trail.length > 0) {
    for (let i = 0; i < trail.length; i++) {
      const t = trail[i];
      const progress = (i + 1) / trail.length;
      const alpha = progress * 0.55;
      const radius = 3 + progress * 5;
      ctx.beginPath();
      ctx.arc(t.x, t.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 80, 80, ${alpha})`;
      ctx.fill();
    }
  }

  // ── Ball
  if (ballVisible) {
    ctx.beginPath();
    ctx.arc(ballX, ballY, 9, 0, Math.PI * 2);
    const ballGrad = ctx.createRadialGradient(
      ballX - 3,
      ballY - 3,
      1,
      ballX,
      ballY,
      9,
    );
    ballGrad.addColorStop(0, "#ff8080");
    ballGrad.addColorStop(0.45, "#cc2020");
    ballGrad.addColorStop(1, "#7a0000");
    ctx.fillStyle = ballGrad;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ballX, ballY, 9, -0.6, 0.6);
    ctx.strokeStyle = "rgba(255,200,180,0.75)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ballX - 3, ballY - 3, 3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,160,160,0.4)";
    ctx.fill();
  }
}

function drawStumps(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  h: number,
) {
  const positions = [-8, 0, 8];
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 4;
  for (const offset of positions) {
    ctx.beginPath();
    ctx.moveTo(cx + offset + 2, baseY + 2);
    ctx.lineTo(cx + offset + 2, baseY - h + 2);
    ctx.stroke();
  }
  ctx.strokeStyle = "#F5F0E0";
  ctx.lineWidth = 3;
  for (const offset of positions) {
    ctx.beginPath();
    ctx.moveTo(cx + offset, baseY);
    ctx.lineTo(cx + offset, baseY - h);
    ctx.stroke();
  }
  ctx.strokeStyle = "#D4C878";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 10, baseY - h + 3);
  ctx.lineTo(cx - 4, baseY - h);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 4, baseY - h);
  ctx.lineTo(cx + 10, baseY - h + 3);
  ctx.stroke();
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function CricketGame({
  config,
  gameMode,
  onBack,
  difficulty,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const ballStartTime = useRef(0);
  const BALL_DURATION = 1100;

  const ballXRef = useRef(0);
  const ballYRef = useRef(0);
  const ballVisibleRef = useRef(false);
  const trailRef = useRef<TrailPoint[]>([]);
  const driftRef = useRef<BallDrift>(0);
  const arrowKeyRef = useRef<ArrowKey | null>(null);
  const phaseRef = useRef<GamePhase>("waiting");

  // IPL logo flash state after a SIX
  const [showIplLogo, setShowIplLogo] = useState(false);
  // Milestone banner state
  const [showMilestone, setShowMilestone] = useState<null | 50 | 100 | 150>(
    null,
  );
  // Dust flash for dot balls
  const [showDust, setShowDust] = useState(false);

  const [gameState, setGameState] = useState<GameState>(() =>
    makeInitialState(config, difficulty),
  );

  // ── Canvas draw
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawScene(
      ctx,
      canvas.width,
      canvas.height,
      ballXRef.current,
      ballYRef.current,
      ballVisibleRef.current,
      trailRef.current,
    );
  }, []);

  // ── Initial draw + resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawCanvas();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawCanvas]);

  // ── Ball animation with parabolic arc
  const animateBall = useCallback(
    (onComplete: (pressedKey: ArrowKey | null) => void) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const drift = driftRef.current;
      const startX = canvas.width / 2 + 5;
      const startY = canvas.height * 0.35;
      const endY = canvas.height * 0.78;
      const totalDrift = drift * 35;

      ballStartTime.current = performance.now();
      ballVisibleRef.current = true;
      ballXRef.current = startX;
      ballYRef.current = startY;
      trailRef.current = [];
      arrowKeyRef.current = null;

      const step = (now: number) => {
        const elapsed = now - ballStartTime.current;
        const t = Math.min(elapsed / BALL_DURATION, 1);
        const ease = t * t * (3 - 2 * t);
        // Parabolic arc: add vertical peak in the middle
        const arcY = -Math.sin(Math.PI * t) * (canvas.height * 0.08);
        const y = startY + (endY - startY) * ease + arcY;
        const x = startX + totalDrift * ease;

        trailRef.current = [
          ...trailRef.current.slice(-(TRAIL_LENGTH - 1)),
          { x, y },
        ];
        ballXRef.current = x;
        ballYRef.current = y;
        drawCanvas();

        if (t < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          ballVisibleRef.current = false;
          trailRef.current = [];
          drawCanvas();
          const key = arrowKeyRef.current;
          phaseRef.current = "result";
          onComplete(key);
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
    },
    [drawCanvas],
  );

  // ── Shot outcome after animation
  const finalizeBall = useCallback(
    (pressedKey: ArrowKey | null) => {
      const outcome = resolveDirectionalShot(
        pressedKey,
        driftRef.current,
        difficulty,
      );

      // Show IPL logo flash on a SIX
      if (outcome.runs === 6) {
        setShowIplLogo(true);
        setTimeout(() => setShowIplLogo(false), 2400);
      }

      // Dot ball dust flash
      if (outcome.runs === 0 && !outcome.isWicket) {
        setShowDust(true);
        setTimeout(() => setShowDust(false), 300);
      }

      setGameState((prev) => {
        const newRuns = prev.runs + outcome.runs;
        const newWickets = prev.wickets + (outcome.isWicket ? 1 : 0);
        const newBalls = prev.ballsBowled + 1;
        const newBoundaries =
          prev.boundaries + (outcome.runs === 4 || outcome.runs === 6 ? 1 : 0);
        const newFours = prev.fours + (outcome.runs === 4 ? 1 : 0);
        const newSixes = prev.sixes + (outcome.runs === 6 ? 1 : 0);
        const newDots =
          prev.dots + (outcome.runs === 0 && !outcome.isWicket ? 1 : 0);

        // Partnership tracking
        const newPartnershipRuns = outcome.isWicket
          ? 0
          : prev.partnershipRuns + outcome.runs;
        const newPartnershipBalls = outcome.isWicket
          ? 0
          : prev.partnershipBalls + 1;

        const ballResult: BallResult = {
          runs: outcome.runs,
          isWicket: outcome.isWicket,
        };

        // Over history: save completed over
        const newOverBalls = [...prev.overBalls];
        let newOverHistory = [...prev.overHistory];
        if (newOverBalls.length >= 6) {
          newOverHistory = [...newOverHistory, [...newOverBalls]];
          newOverBalls.splice(0, newOverBalls.length);
        }
        newOverBalls.push(ballResult);

        // Check game over conditions
        const isLastBall = newBalls >= config.balls;
        const isAllOut = newWickets >= 10;
        const isChased = newRuns >= config.target;

        let phase: GamePhase = "result";
        if (isChased || isLastBall || isAllOut) {
          phase = "over";
        }

        // Milestone check
        let newMilestoneShown = prev.milestoneShown;
        if (newRuns >= 150 && prev.milestoneShown < 150) {
          newMilestoneShown = 150;
          setTimeout(() => {
            setShowMilestone(150);
            setTimeout(() => setShowMilestone(null), 3500);
          }, 100);
        } else if (newRuns >= 100 && prev.milestoneShown < 100) {
          newMilestoneShown = 100;
          setTimeout(() => {
            setShowMilestone(100);
            setTimeout(() => setShowMilestone(null), 4500);
          }, 100);
        } else if (newRuns >= 50 && prev.milestoneShown < 50) {
          newMilestoneShown = 50;
          setTimeout(() => {
            setShowMilestone(50);
            setTimeout(() => setShowMilestone(null), 3500);
          }, 100);
        }

        return {
          ...prev,
          runs: newRuns,
          wickets: newWickets,
          ballsBowled: newBalls,
          overBalls: newOverBalls,
          overHistory: newOverHistory,
          phase,
          lastOutcome: outcome,
          commentary: outcome.commentary,
          boundaries: newBoundaries,
          fours: newFours,
          sixes: newSixes,
          dots: newDots,
          partnershipRuns: newPartnershipRuns,
          partnershipBalls: newPartnershipBalls,
          milestoneShown: newMilestoneShown,
        };
      });

      setTimeout(() => {
        setGameState((prev) => {
          if (prev.phase === "result") {
            phaseRef.current = "waiting";
            return { ...prev, phase: "waiting", lastOutcome: null };
          }
          return prev;
        });
      }, 1800);
    },
    [config.target, config.balls, difficulty],
  );

  // ── Bowl trigger
  const triggerBowl = useCallback(() => {
    if (phaseRef.current !== "waiting") return;
    phaseRef.current = "bowling";

    const driftOptions: BallDrift[] = [-1, -1, 0, 0, 0, 1, 1];
    driftRef.current =
      driftOptions[Math.floor(Math.random() * driftOptions.length)];
    arrowKeyRef.current = null;

    // Difficulty-aware bowling commentary
    let bowlCommentary: string;
    if (difficulty === "easy") {
      bowlCommentary = "Nice easy delivery! Pick your shot.";
    } else if (difficulty === "hard") {
      bowlCommentary = "Express pace! Lightning quick delivery!";
    } else {
      bowlCommentary =
        driftRef.current === -1
          ? "In-swinger! Watch the ball movement!"
          : driftRef.current === 1
            ? "Out-swinger! Ball moving away!"
            : "Straight delivery! Time your shot!";
    }

    setGameState((prev) => ({
      ...prev,
      phase: "bowling" as GamePhase,
      lastOutcome: null,
      commentary: bowlCommentary,
    }));

    animateBall(finalizeBall);
  }, [animateBall, finalizeBall, difficulty]);

  // ── Arrow key shot helper
  const registerArrowKey = useCallback((key: ArrowKey) => {
    if (phaseRef.current === "bowling" && arrowKeyRef.current === null) {
      arrowKeyRef.current = key;
    }
  }, []);

  // ── Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (phaseRef.current === "waiting") triggerBowl();
      }
      if (
        e.code === "ArrowLeft" ||
        e.code === "ArrowRight" ||
        e.code === "ArrowUp"
      ) {
        e.preventDefault();
        const key: ArrowKey =
          e.code === "ArrowLeft"
            ? "left"
            : e.code === "ArrowRight"
              ? "right"
              : "up";
        registerArrowKey(key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerBowl, registerArrowKey]);

  // ── Cleanup
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // ── Restart
  const handleRestart = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    phaseRef.current = "waiting";
    ballVisibleRef.current = false;
    trailRef.current = [];
    arrowKeyRef.current = null;
    setShowIplLogo(false);
    setShowMilestone(null);
    setShowDust(false);
    setGameState(makeInitialState(config, difficulty));
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawCanvas();
    }
  };

  const isGameOver = gameState.phase === "over";
  const isWin = gameState.runs >= config.target;
  const overBallItems = gameState.overBalls;

  const driftLabel =
    gameState.phase === "bowling"
      ? driftRef.current === -1
        ? "↙ In-swing"
        : driftRef.current === 1
          ? "↘ Out-swing"
          : "↓ Straight"
      : null;

  // PowerPlay check (T20 mode, first 6 overs = 36 balls)
  const isPowerPlay = gameMode === "t20" && gameState.ballsBowled < 36;

  // Over history display (last 2 completed overs)
  const recentOvers = gameState.overHistory.slice(-2);

  return (
    <div
      className="min-h-screen bg-gray-900 flex flex-col"
      data-ocid="game.section"
    >
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-white/70 hover:text-white hover:bg-white/10 gap-2"
          data-ocid="game.back_button"
        >
          <ArrowLeft size={16} /> Back
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-xs uppercase tracking-wider">
            {gameMode === "t20"
              ? "T20 World Cup"
              : gameMode === "super-over"
                ? "Super Over"
                : "Quick Match"}
          </span>
          <span className="text-white/30">|</span>
          <span className="text-white text-xs font-semibold">
            🏏 Cricket Blast
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRestart}
          className="text-white/70 hover:text-white hover:bg-white/10 gap-2"
          data-ocid="game.secondary_button"
        >
          <RotateCcw size={14} /> Restart
        </Button>
      </div>

      {/* Game area */}
      <div className="flex-1 relative flex flex-col">
        {/* Canvas container */}
        <div className="relative flex-1" style={{ minHeight: 400 }}>
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ display: "block", minHeight: 400 }}
            data-ocid="game.canvas_target"
          />

          {/* Dot ball dust overlay */}
          <AnimatePresence>
            {showDust && (
              <motion.div
                key="dust"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none z-10"
                style={{ background: "rgba(139,90,43,0.2)" }}
              />
            )}
          </AnimatePresence>

          {/* Scoreboard HUD */}
          <Scoreboard
            state={gameState}
            target={config.target}
            partnership={{
              runs: gameState.partnershipRuns,
              balls: gameState.partnershipBalls,
            }}
            isPowerPlay={isPowerPlay}
            difficulty={difficulty}
          />

          {/* Over history display */}
          {recentOvers.length > 0 && (
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-1">
              {recentOvers.map((over, idx) => {
                const overNum =
                  gameState.overHistory.length - recentOvers.length + idx + 1;
                return (
                  <div
                    key={overNum}
                    className="text-xs px-2 py-1 rounded-lg"
                    style={{
                      background: "rgba(0,0,0,0.6)",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    <span style={{ color: "rgba(255,255,255,0.35)" }}>
                      Ov {overNum}:
                    </span>{" "}
                    {over.map((b, ballIdx) => (
                      <span
                        key={`ov${overNum}-b${ballIdx}-${b.runs}-${b.isWicket}`}
                        className="mr-1 font-bold"
                        style={{
                          color: b.isWicket
                            ? "#f87171"
                            : b.runs === 6
                              ? "#fbbf24"
                              : b.runs === 4
                                ? "#34d399"
                                : "rgba(255,255,255,0.65)",
                        }}
                      >
                        {ballResultLabel(b.runs, b.isWicket)}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* TATA IPL Logo flash on SIX */}
          <AnimatePresence>
            {showIplLogo && (
              <motion.div
                key="ipl-logo"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.3, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                }}
                className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
                style={{
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(2px)",
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <motion.img
                    src="/assets/generated/tata-ipl-logo-transparent.dim_400x300.png"
                    alt="TATA IPL"
                    className="w-48 h-36 object-contain drop-shadow-2xl"
                    animate={{ rotate: [-4, 4, -4, 0] }}
                    transition={{ duration: 0.5, repeat: 2 }}
                  />
                  <motion.p
                    className="text-yellow-300 text-2xl font-black tracking-widest"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.5, repeat: 2 }}
                  >
                    MAXIMUM SIX! 🚀
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Milestone celebration (fireworks + banner) */}
          <AnimatePresence>
            {showMilestone && (
              <FireworksCelebration
                key={`milestone-${showMilestone}`}
                milestone={showMilestone}
              />
            )}
          </AnimatePresence>

          {/* Bowling phase hint overlay */}
          <AnimatePresence>
            {gameState.phase === "bowling" && (
              <motion.div
                key="bowling-hint"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-20"
              >
                <div
                  className="rounded-full px-4 py-1.5 text-white text-xs font-bold tracking-wide"
                  style={{
                    background: "rgba(0,40,80,0.85)",
                    border: "1px solid rgba(100,180,255,0.4)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  {driftLabel && (
                    <span className="mr-2 text-yellow-300">{driftLabel}</span>
                  )}
                  Use ← → ↑ Arrow Keys to hit!
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ball result pop-up */}
          <AnimatePresence>
            {gameState.lastOutcome &&
              gameState.phase === "result" &&
              !showIplLogo && (
                <motion.div
                  key="result-popup"
                  initial={{ scale: 0.5, opacity: 0, y: -20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
                  data-ocid="game.result.dialog"
                >
                  <div
                    className="rounded-2xl px-8 py-5 text-center shadow-overlay text-white"
                    style={{
                      background: gameState.lastOutcome.isWicket
                        ? "linear-gradient(135deg, #7f1d1d, #991b1b)"
                        : gameState.lastOutcome.runs === 6
                          ? "linear-gradient(135deg, #1e3a8a, #1d4ed8)"
                          : gameState.lastOutcome.runs === 4
                            ? "linear-gradient(135deg, #14532d, #16a34a)"
                            : "linear-gradient(135deg, #1f2937, #374151)",
                    }}
                  >
                    <p className="text-4xl font-display font-bold mb-1">
                      {gameState.lastOutcome.isWicket
                        ? "OUT! 💥"
                        : gameState.lastOutcome.runs === 6
                          ? "SIX! 🚀"
                          : gameState.lastOutcome.runs === 4
                            ? "FOUR! 🏏"
                            : gameState.lastOutcome.runs === 0
                              ? "DOT 🔵"
                              : `${gameState.lastOutcome.runs} RUN${
                                  gameState.lastOutcome.runs > 1 ? "S" : ""
                                }`}
                    </p>
                  </div>
                </motion.div>
              )}
          </AnimatePresence>

          {/* Game Over Overlay */}
          <AnimatePresence>
            {isGameOver && (
              <motion.div
                key="game-over"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-40 flex items-center justify-center"
                style={{
                  background: "rgba(0,0,0,0.75)",
                  backdropFilter: "blur(4px)",
                }}
                data-ocid="game.modal"
              >
                <motion.div
                  initial={{ scale: 0.8, y: 30 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="bg-gray-900 border border-white/20 rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-overlay"
                >
                  <div className="text-6xl mb-4">{isWin ? "🏆" : "😔"}</div>
                  <h2 className="font-display text-3xl font-bold text-white mb-2">
                    {isWin ? "You Won!" : "Game Over"}
                  </h2>
                  <p className="text-white/60 text-sm mb-6">
                    {isWin
                      ? `Outstanding! You chased ${config.target} with style!`
                      : `So close! You scored ${gameState.runs} but needed ${config.target}.`}
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { label: "Runs", value: gameState.runs },
                      { label: "Fours", value: gameState.fours },
                      { label: "Sixes", value: gameState.sixes },
                      { label: "Wickets", value: gameState.wickets },
                      { label: "Dots", value: gameState.dots },
                      {
                        label: "Run Rate",
                        value:
                          gameState.ballsBowled > 0
                            ? (
                                (gameState.runs / gameState.ballsBowled) *
                                6
                              ).toFixed(1)
                            : "0.0",
                      },
                    ].map((stat, idx) => (
                      <div
                        key={stat.label}
                        className="bg-white/5 rounded-xl p-3"
                        data-ocid={`game.item.${idx + 1}`}
                      >
                        <p className="text-white font-bold text-xl">
                          {stat.value}
                        </p>
                        <p className="text-white/50 text-xs mt-0.5">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleRestart}
                      className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold"
                      data-ocid="game.confirm_button"
                    >
                      Play Again
                    </Button>
                    <Button
                      variant="outline"
                      onClick={onBack}
                      className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-xl font-semibold"
                      data-ocid="game.cancel_button"
                    >
                      Home
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom HUD */}
        <div className="bg-gray-900 border-t border-white/10 px-4 py-4">
          {/* Commentary */}
          <div className="mb-3 min-h-[24px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={gameState.commentary}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="text-center text-white/75 text-sm italic"
                data-ocid="game.panel"
              >
                💬 {gameState.commentary}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Over balls indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-white/40 text-xs">Over:</span>
            {(["s1", "s2", "s3", "s4", "s5", "s6"] as const).map(
              (slotKey, i) => {
                const ball = overBallItems[i];
                const label = ball
                  ? ballResultLabel(ball.runs, ball.isWicket)
                  : "";
                return (
                  <div
                    key={slotKey}
                    data-ocid={`game.item.${i + 1}`}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                      !ball
                        ? "border-white/20 text-white/20"
                        : ball.isWicket
                          ? "bg-red-600 border-red-500 text-white"
                          : ball.runs === 6
                            ? "bg-blue-600 border-blue-500 text-white"
                            : ball.runs === 4
                              ? "bg-green-600 border-green-500 text-white"
                              : ball.runs === 0
                                ? "bg-gray-700 border-gray-600 text-white/50"
                                : "bg-gray-600 border-gray-500 text-white"
                    }`}
                  >
                    {label}
                  </div>
                );
              },
            )}
          </div>

          {/* Mobile touch controls */}
          <div className="md:hidden flex flex-col items-center gap-3">
            {gameState.phase === "waiting" && !isGameOver ? (
              <motion.button
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.4 }}
                onPointerDown={triggerBowl}
                className="px-8 py-4 rounded-2xl text-white font-black text-lg shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  border: "2px solid rgba(255,255,255,0.3)",
                  minWidth: 140,
                  minHeight: 56,
                }}
                data-ocid="game.primary_button"
              >
                🏏 BOWL
              </motion.button>
            ) : gameState.phase === "bowling" ? (
              <div className="flex items-center gap-3">
                {[
                  {
                    key: "left" as ArrowKey,
                    label: "← Leg",
                    color: "#16a34a",
                  },
                  {
                    key: "up" as ArrowKey,
                    label: "↑ Loft",
                    color: "#d97706",
                  },
                  {
                    key: "right" as ArrowKey,
                    label: "→ Off",
                    color: "#2563eb",
                  },
                ].map((btn) => (
                  <motion.button
                    key={btn.key}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 0.8,
                    }}
                    onPointerDown={() => registerArrowKey(btn.key)}
                    className="px-4 py-3 rounded-xl text-white font-bold text-base"
                    style={{
                      background: btn.color,
                      border: "2px solid rgba(255,255,255,0.3)",
                      minWidth: 80,
                      minHeight: 56,
                    }}
                  >
                    {btn.label}
                  </motion.button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Keyboard guide for desktop */}
          <AnimatePresence mode="wait">
            {gameState.phase === "waiting" && !isGameOver ? (
              <motion.div
                key="space-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden md:flex items-center justify-center gap-3"
              >
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.4,
                  }}
                  className="flex items-center gap-2"
                >
                  <kbd className="inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-bold text-white bg-white/15 border border-white/30 shadow-inner">
                    SPACE
                  </kbd>
                  <span className="text-white/80 text-sm font-semibold">
                    = Bowl
                  </span>
                </motion.div>
                <span className="text-white/30 text-xs">|</span>
                <span className="text-white/50 text-xs">
                  Then ← Leg &nbsp;|&nbsp; → Off &nbsp;|&nbsp; ↑ Loft
                </span>
              </motion.div>
            ) : gameState.phase === "bowling" ? (
              <motion.div
                key="hit-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden md:flex items-center justify-center gap-3"
              >
                {[
                  { key: "←", label: "Leg Side", color: "text-green-400" },
                  { key: "→", label: "Off Side", color: "text-blue-400" },
                  { key: "↑", label: "Loft", color: "text-yellow-400" },
                ].map((k) => (
                  <motion.div
                    key={k.key}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 0.8,
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <kbd className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold text-white bg-white/20 border border-white/40 shadow-inner">
                      {k.key}
                    </kbd>
                    <span className={`text-xs font-medium ${k.color}`}>
                      {k.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="idle-controls"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden md:flex items-center justify-center gap-4"
              >
                <div className="flex items-center gap-1.5">
                  <kbd className="inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold text-white/60 bg-white/10 border border-white/20">
                    SPACE
                  </kbd>
                  <span className="text-white/40 text-xs">Bowl</span>
                </div>
                <span className="text-white/20">|</span>
                <div className="flex items-center gap-1.5">
                  <kbd className="inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold text-white/60 bg-white/10 border border-white/20">
                    ←
                  </kbd>
                  <span className="text-white/40 text-xs">Leg</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold text-white/60 bg-white/10 border border-white/20">
                    →
                  </kbd>
                  <span className="text-white/40 text-xs">Off</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold text-white/60 bg-white/10 border border-white/20">
                    ↑
                  </kbd>
                  <span className="text-white/40 text-xs">Loft</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Always-visible mobile hint */}
          <p className="md:hidden text-center text-white/40 text-xs mt-1">
            Tap the buttons above to play
          </p>

          {/* Powerplay notice */}
          {isPowerPlay && (
            <div className="mt-2 text-center">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full animate-pulse"
                style={{ background: "rgba(234,179,8,0.2)", color: "#fde047" }}
              >
                ⚡ POWERPLAY —{" "}
                {
                  powerPlayCommentary[
                    Math.floor(gameState.ballsBowled / 7) %
                      powerPlayCommentary.length
                  ]
                }
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
