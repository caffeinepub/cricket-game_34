import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GameMode } from "../App";
import type {
  ArrowKey,
  BallDrift,
  BallResult,
  GamePhase,
  GameState,
} from "../types/game";
import { ballResultLabel, resolveDirectionalShot } from "../utils/cricket";
import Scoreboard from "./Scoreboard";

interface Config {
  target: number;
  balls: number;
}

interface Props {
  config: Config;
  gameMode: GameMode;
  onBack: () => void;
}

const INITIAL_STATE: GameState = {
  runs: 0,
  wickets: 0,
  ballsBowled: 0,
  overBalls: [],
  phase: "waiting",
  lastOutcome: null,
  commentary: "Welcome to Cricket Blast! Press SPACE to bowl the first ball.",
  boundaries: 0,
  sixes: 0,
  fours: 0,
  highestScore: 0,
};

// ─── Trail tracking ───────────────────────────────────────────────────────────
const TRAIL_LENGTH = 10;

interface TrailPoint {
  x: number;
  y: number;
}

// ─── Pixel-Art Sprite Drawers ─────────────────────────────────────────────────

/**
 * Draw MS Dhoni-style batsman:
 * – Wide, low-crouched stance (feet spread wide)
 * – Both hands gripping bat low, ready for the helicopter shot
 * – Leaning slightly forward, weight on front foot
 * – Yellow CSK-style helmet, blue kit
 */
function drawBatsman(ctx: CanvasRenderingContext2D, cx: number, baseY: number) {
  // ── Wide stance legs / pads (feet spread ~36px apart)
  // Left leg pad (back foot)
  ctx.fillStyle = "#E8E8E8";
  ctx.fillRect(cx - 22, baseY - 38, 11, 38);
  // Right leg pad (front foot, slightly forward)
  ctx.fillStyle = "#DEDEDE";
  ctx.fillRect(cx + 11, baseY - 42, 11, 42);
  // Pad straps
  ctx.fillStyle = "#B0B0B0";
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(cx - 22, baseY - 12 - i * 10, 11, 2);
    ctx.fillRect(cx + 11, baseY - 14 - i * 10, 11, 2);
  }
  // Boots (wide, planted)
  ctx.fillStyle = "#1A1A1A";
  ctx.fillRect(cx - 26, baseY - 6, 14, 6); // back boot
  ctx.fillRect(cx + 10, baseY - 6, 16, 6); // front boot (longer, forward)

  // ── Body / jersey (blue — Dhoni CSK away / India blue)
  ctx.fillStyle = "#003087";
  ctx.fillRect(cx - 10, baseY - 74, 20, 34);
  // Jersey highlights
  ctx.fillStyle = "#0044B3";
  ctx.fillRect(cx - 10, baseY - 74, 20, 4);
  // Orange accent stripe
  ctx.fillStyle = "#FF6B00";
  ctx.fillRect(cx - 10, baseY - 68, 20, 3);
  ctx.fillRect(cx - 10, baseY - 58, 20, 2);

  // ── Gloves (Dhoni's thick wicket-keeping style gloves for batting)
  // Right hand (lower grip, bat handle)
  ctx.fillStyle = "#B84020";
  ctx.fillRect(cx + 6, baseY - 64, 12, 12);
  ctx.fillStyle = "#F0F0F0";
  ctx.fillRect(cx + 6, baseY - 64, 12, 3);
  // Left hand (top grip)
  ctx.fillStyle = "#B84020";
  ctx.fillRect(cx - 16, baseY - 58, 10, 10);
  ctx.fillStyle = "#F0F0F0";
  ctx.fillRect(cx - 16, baseY - 58, 10, 2);

  // ── Bat held LOW and HORIZONTAL (Dhoni helicopter-ready position)
  // Bat handle (horizontal/diagonal, bat held across body low)
  ctx.fillStyle = "#5C3A1E";
  // Handle — angled diagonally, low position
  ctx.save();
  ctx.translate(cx + 18, baseY - 55);
  ctx.rotate(-0.35); // slight upward angle
  ctx.fillRect(-3, -38, 6, 38);
  // Grip wrap
  ctx.fillStyle = "#222222";
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(-3, -35 + i * 6, 6, 2);
  }
  ctx.restore();
  // Bat blade — wide and slightly horizontal
  ctx.save();
  ctx.translate(cx + 16, baseY - 58);
  ctx.rotate(-0.35);
  ctx.fillStyle = "#A0722A";
  ctx.fillRect(-4, -24, 20, 24);
  ctx.fillStyle = "#C8A04A";
  ctx.fillRect(-3, -23, 4, 22);
  ctx.fillStyle = "#7A5018";
  ctx.fillRect(13, -24, 3, 24);
  ctx.restore();

  // ── Right arm (bat arm, elbow out — Dhoni's wide elbow stance)
  ctx.fillStyle = "#C8A080";
  // Upper arm
  ctx.fillRect(cx + 4, baseY - 72, 7, 16);
  // Forearm angled outward
  ctx.save();
  ctx.translate(cx + 8, baseY - 58);
  ctx.rotate(0.3);
  ctx.fillRect(-3, -18, 7, 18);
  ctx.restore();

  // ── Left arm (elbow up, guard position)
  ctx.fillStyle = "#C8A080";
  ctx.fillRect(cx - 18, baseY - 70, 7, 14);
  ctx.fillRect(cx - 20, baseY - 58, 7, 10);

  // ── Neck
  ctx.fillStyle = "#C8A080";
  ctx.fillRect(cx - 3, baseY - 80, 6, 8);

  // ── Helmet — MSD signature yellow helmet
  ctx.fillStyle = "#D4A800"; // gold/yellow — Dhoni's iconic helmet color
  ctx.beginPath();
  ctx.arc(cx, baseY - 86, 14, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(cx - 14, baseY - 86, 28, 7);
  // Helmet shine
  ctx.fillStyle = "#F5C800";
  ctx.beginPath();
  ctx.arc(cx - 4, baseY - 92, 6, Math.PI, 0);
  ctx.fill();
  // Helmet peak (brim)
  ctx.fillStyle = "#A07800";
  ctx.fillRect(cx - 17, baseY - 82, 34, 4);

  // ── Face guard / visor
  ctx.fillStyle = "#C0C0C0";
  ctx.fillRect(cx - 11, baseY - 82, 22, 5);
  // Face under visor
  ctx.fillStyle = "#C8906A";
  ctx.fillRect(cx - 8, baseY - 86, 16, 7);
  // Eyes (intense focus — MSD stare)
  ctx.fillStyle = "#1A1A1A";
  ctx.fillRect(cx - 6, baseY - 84, 3, 2);
  ctx.fillRect(cx + 3, baseY - 84, 3, 2);

  // ── Grill bars over face
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(cx - 10, baseY - 80 + i * 2, 20, 1);
  }

  // ── Dhoni's signature: small '7' number on jersey
  ctx.fillStyle = "rgba(255,165,0,0.9)";
  ctx.fillRect(cx - 2, baseY - 66, 4, 7);
  ctx.fillStyle = "#003087";
  ctx.fillRect(cx - 1, baseY - 66, 2, 2);
  ctx.fillRect(cx + 1, baseY - 66, 1, 5);
}

/**
 * Draw a detailed pixel-art style bowler in delivery action pose.
 * Blue/red kit, arm raised high, lean-forward stance.
 */
function drawBowler(ctx: CanvasRenderingContext2D, cx: number, baseY: number) {
  // ── Legs (stride pose)
  // Left leg (back)
  ctx.fillStyle = "#1A237E";
  ctx.fillRect(cx - 8, baseY - 30, 8, 30);
  // Right leg (forward stride)
  ctx.fillStyle = "#1A237E";
  ctx.fillRect(cx + 2, baseY - 26, 8, 26);
  // Boots
  ctx.fillStyle = "#111111";
  ctx.fillRect(cx - 10, baseY - 6, 10, 6);
  ctx.fillRect(cx + 2, baseY - 4, 10, 4);

  // ── Body / jersey
  ctx.fillStyle = "#283593";
  ctx.fillRect(cx - 9, baseY - 60, 18, 30);
  // Red accent across chest
  ctx.fillStyle = "#C62828";
  ctx.fillRect(cx - 9, baseY - 56, 18, 5);
  ctx.fillRect(cx - 9, baseY - 44, 18, 3);
  // Number on back (decorative)
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(cx - 3, baseY - 53, 6, 8);

  // ── Neck
  ctx.fillStyle = "#C8A080";
  ctx.fillRect(cx - 3, baseY - 66, 6, 8);

  // ── Bowling arm (raised high and forward)
  ctx.fillStyle = "#C8A080";
  // Shoulder → upper arm up
  ctx.fillRect(cx + 4, baseY - 62, 6, 18);
  // Forearm extended upward
  ctx.save();
  ctx.translate(cx + 7, baseY - 58);
  ctx.rotate(-0.5);
  ctx.fillRect(-3, -28, 6, 28);
  ctx.restore();
  // Hand/fingers
  ctx.fillStyle = "#B8906A";
  ctx.save();
  ctx.translate(cx + 7, baseY - 58);
  ctx.rotate(-0.5);
  ctx.fillRect(-4, -36, 8, 9);
  ctx.restore();

  // ── Non-bowling arm (balance)
  ctx.fillStyle = "#C8A080";
  ctx.fillRect(cx - 14, baseY - 58, 6, 16);
  ctx.fillRect(cx - 18, baseY - 50, 6, 12);

  // ── Head (leaning forward)
  ctx.fillStyle = "#C8A080";
  ctx.beginPath();
  ctx.ellipse(cx, baseY - 72, 10, 11, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // Hair / cap
  ctx.fillStyle = "#1A237E";
  ctx.beginPath();
  ctx.ellipse(cx, baseY - 76, 10, 7, -0.2, Math.PI, 0);
  ctx.fill();
  // Cap peak
  ctx.fillRect(cx - 2, baseY - 72, 14, 3);
  // Eyes
  ctx.fillStyle = "#1A1A1A";
  ctx.fillRect(cx - 5, baseY - 71, 3, 2);
  ctx.fillRect(cx + 2, baseY - 71, 3, 2);
  // Mouth (determined expression)
  ctx.fillRect(cx - 3, baseY - 66, 6, 2);
}

// ─── Scene Rendering ──────────────────────────────────────────────────────────

function drawScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  ballX: number,
  ballY: number,
  ballVisible: boolean,
  trail: TrailPoint[],
) {
  // ── Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, height * 0.55);
  sky.addColorStop(0, "#1a3a5c");
  sky.addColorStop(0.5, "#2d6a8a");
  sky.addColorStop(1, "#4a8fb0");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height * 0.55);

  // ── Stars (small dots near top)
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

  // ── Floodlights (tall poles)
  const poleColor = "#888888";
  const lightColor = "rgba(255,240,180,0.9)";
  const poles = [width * 0.08, width * 0.92];
  for (const px of poles) {
    ctx.fillStyle = poleColor;
    ctx.fillRect(px - 4, height * 0.1, 8, height * 0.38);
    ctx.fillRect(px - 16, height * 0.1, 32, 6);
    // Lights
    ctx.fillStyle = lightColor;
    for (let li = 0; li < 5; li++) {
      ctx.beginPath();
      ctx.arc(px - 12 + li * 6, height * 0.1 + 3, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    // Glow
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

  // ── Stadium seating (tiered arcs)
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

  // ── Crowd rows (colorful pixel dots)
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

  // ── Outfield mowing pattern (alternating light/dark strips)
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CricketGame({ config, gameMode, onBack }: Props) {
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

  const [gameState, setGameState] = useState<GameState>({
    ...INITIAL_STATE,
    commentary: `Chase ${config.target} runs in ${config.balls / 6} overs. Press SPACE to bowl!`,
  });

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

  // ── Ball animation
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
        const y = startY + (endY - startY) * ease;
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
      const outcome = resolveDirectionalShot(pressedKey, driftRef.current);

      // Show IPL logo flash on a SIX
      if (outcome.runs === 6) {
        setShowIplLogo(true);
        setTimeout(() => setShowIplLogo(false), 2400);
      }

      setGameState((prev) => {
        const newRuns = prev.runs + outcome.runs;
        const newWickets = prev.wickets + (outcome.isWicket ? 1 : 0);
        const newBalls = prev.ballsBowled + 1;
        const newBoundaries =
          prev.boundaries + (outcome.runs === 4 || outcome.runs === 6 ? 1 : 0);
        const newFours = prev.fours + (outcome.runs === 4 ? 1 : 0);
        const newSixes = prev.sixes + (outcome.runs === 6 ? 1 : 0);

        const ballResult: BallResult = {
          runs: outcome.runs,
          isWicket: outcome.isWicket,
        };

        const newOverBalls = [...prev.overBalls];
        if (newOverBalls.length >= 6)
          newOverBalls.splice(0, newOverBalls.length);
        newOverBalls.push(ballResult);

        // Check game over conditions
        const isLastBall = newBalls >= config.balls;
        const isAllOut = newWickets >= 10;
        const isChased = newRuns >= config.target;

        let phase: GamePhase = "result";
        if (isChased || isLastBall || isAllOut) {
          phase = "over";
        }

        return {
          ...prev,
          runs: newRuns,
          wickets: newWickets,
          ballsBowled: newBalls,
          overBalls: newOverBalls,
          phase,
          lastOutcome: outcome,
          commentary: outcome.commentary,
          boundaries: newBoundaries,
          fours: newFours,
          sixes: newSixes,
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
    [config.target, config.balls],
  );

  // ── Bowl trigger
  const triggerBowl = useCallback(() => {
    if (phaseRef.current !== "waiting") return;
    phaseRef.current = "bowling";

    const driftOptions: BallDrift[] = [-1, -1, 0, 0, 0, 1, 1];
    driftRef.current =
      driftOptions[Math.floor(Math.random() * driftOptions.length)];
    arrowKeyRef.current = null;

    setGameState((prev) => ({
      ...prev,
      phase: "bowling" as GamePhase,
      lastOutcome: null,
      commentary:
        driftRef.current === -1
          ? "In-swinger! Watch the ball movement!"
          : driftRef.current === 1
            ? "Out-swinger! Ball moving away!"
            : "Straight delivery! Time your shot!",
    }));

    animateBall(finalizeBall);
  }, [animateBall, finalizeBall]);

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
    setGameState({
      ...INITIAL_STATE,
      commentary: `New game! Chase ${config.target} runs in ${config.balls / 6} overs. Press SPACE to bowl!`,
    });
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

          {/* Scoreboard HUD */}
          <Scoreboard state={gameState} target={config.target} />

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
                      { label: "Boundaries", value: gameState.boundaries },
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
                          ? "bg-red-700 border-red-500 text-white"
                          : ball.runs === 6
                            ? "bg-blue-600 border-blue-400 text-white"
                            : ball.runs === 4
                              ? "bg-green-600 border-green-400 text-white"
                              : ball.runs === 0
                                ? "bg-gray-700 border-gray-500 text-white/60"
                                : "bg-gray-600 border-gray-400 text-white"
                    }`}
                  >
                    {label}
                  </div>
                );
              },
            )}
          </div>

          {/* Controls — keyboard on desktop, touch buttons on mobile */}
          <div
            className="rounded-2xl px-4 py-3"
            style={{
              background: "rgba(10, 30, 60, 0.92)",
              border: "1px solid rgba(80,140,255,0.2)",
            }}
          >
            {/* Touch buttons for mobile */}
            <div className="flex items-center justify-center gap-3 mb-3 md:hidden">
              {gameState.phase === "waiting" && !isGameOver ? (
                <motion.button
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.4,
                  }}
                  onPointerDown={() => triggerBowl()}
                  className="px-6 py-3 rounded-xl text-white font-bold text-sm"
                  style={{
                    background: "linear-gradient(135deg, #0044b3, #0066ff)",
                    border: "2px solid rgba(100,180,255,0.5)",
                  }}
                >
                  🏏 BOWL (Tap)
                </motion.button>
              ) : gameState.phase === "bowling" ? (
                <div className="flex gap-3">
                  {[
                    {
                      key: "left" as ArrowKey,
                      label: "← Leg",
                      color: "#16a34a",
                    },
                    {
                      key: "up" as ArrowKey,
                      label: "↑ Loft",
                      color: "#ca8a04",
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
                      className="px-4 py-3 rounded-xl text-white font-bold text-sm"
                      style={{
                        background: btn.color,
                        border: "2px solid rgba(255,255,255,0.3)",
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
                    <kbd className="inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold text-white/60 bg-white/8 border border-white/20">
                      SPACE
                    </kbd>
                    <span className="text-white/40 text-xs">Bowl</span>
                  </div>
                  <span className="text-white/20">|</span>
                  <div className="flex items-center gap-1.5">
                    <kbd className="inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold text-white/60 bg-white/8 border border-white/20">
                      ←
                    </kbd>
                    <span className="text-white/40 text-xs">Leg</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold text-white/60 bg-white/8 border border-white/20">
                      →
                    </kbd>
                    <span className="text-white/40 text-xs">Off</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold text-white/60 bg-white/8 border border-white/20">
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
          </div>
        </div>
      </div>
    </div>
  );
}
