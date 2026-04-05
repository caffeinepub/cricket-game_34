import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GameMode } from "../App";
import type {
  CricketPlayer,
  DeliveryType,
  IPLTeam,
  InternationalTeam,
} from "../data/teams";
import { DELIVERY_COLORS, DELIVERY_LABELS } from "../data/teams";
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
import {
  playAmbientCrowd,
  playBatCrack,
  playBoundaryBell,
  playCrowdRoar,
  playSixFanfare,
  playWicketSound,
} from "../utils/soundEngine";
import FireworksCelebration from "./FireworksCelebration";
import type { SelectedLineup } from "./PlayerSelect";
import Scoreboard from "./Scoreboard";

interface Config {
  target: number;
  balls: number;
}
type CameraView = "broadcast" | "sideOn" | "batterEye";

interface Props {
  config: Config;
  gameMode: GameMode;
  onBack: () => void;
  onGameEnd?: () => void;
  onRestart?: () => void;
  difficulty: Difficulty;
  team: IPLTeam | InternationalTeam;
  lineup: SelectedLineup;
  batFirst: boolean;
  opposingTeam: IPLTeam | InternationalTeam | null;
}

const TRAIL_LENGTH = 12;
interface TrailPoint {
  x: number;
  y: number;
}

// Delivery speed durations (ms)
const DELIVERY_DURATIONS: Record<DeliveryType, number> = {
  bouncer: 900,
  spin: 1300,
  swing: 1100,
  inswing: 1100,
  outswing: 1100,
};

function makeInitialState(config: Config, difficulty: Difficulty): GameState {
  return {
    runs: 0,
    wickets: 0,
    ballsBowled: 0,
    overBalls: [],
    phase: "waiting",
    lastOutcome: null,
    commentary: `Chase ${config.target} in ${config.balls / 6} overs. Select delivery & press SPACE!`,
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

// ─── Canvas Drawing Helpers ──────────────────────────────────────────────────

function drawStumps(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  h: number,
) {
  const pos = [-8, 0, 8];
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 4;
  for (const o of pos) {
    ctx.beginPath();
    ctx.moveTo(cx + o + 1, baseY + 2);
    ctx.lineTo(cx + o + 1, baseY - h + 2);
    ctx.stroke();
  }
  ctx.strokeStyle = "#F5F0E0";
  ctx.lineWidth = 3;
  for (const o of pos) {
    ctx.beginPath();
    ctx.moveTo(cx + o, baseY);
    ctx.lineTo(cx + o, baseY - h);
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

function drawBatsman(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  jerseyColor: string,
  helmetColor: string,
  skinTone: string,
) {
  // Helper: darken a hex color
  function hexDarken(hex: string, factor: number): string {
    const r = Number.parseInt(hex.slice(1, 3), 16);
    const g = Number.parseInt(hex.slice(3, 5), 16);
    const b = Number.parseInt(hex.slice(5, 7), 16);
    return `rgb(${Math.floor(r * factor)},${Math.floor(g * factor)},${Math.floor(b * factor)})`;
  }
  const jerseyDark = hexDarken(
    jerseyColor.length === 7 ? jerseyColor : "#1a73e8",
    0.7,
  );

  // === BOOTS ===
  ctx.fillStyle = "#1a1a1a";
  // Back boot (right foot, wider stance)
  ctx.beginPath();
  ctx.roundRect(cx + 12, baseY - 8, 22, 9, [2, 2, 4, 4]);
  ctx.fill();
  // Front boot (left foot, pointing forward)
  ctx.save();
  ctx.translate(cx - 18, baseY - 8);
  ctx.rotate(-0.1);
  ctx.beginPath();
  ctx.roundRect(0, 0, 20, 9, [2, 2, 4, 4]);
  ctx.fill();
  ctx.restore();
  // Boot soles (white strip)
  ctx.fillStyle = "#e0e0e0";
  ctx.fillRect(cx + 12, baseY - 1, 22, 2);
  ctx.fillRect(cx - 18, baseY - 1, 20, 2);

  // === PADS ===
  // Back leg pad (right)
  ctx.fillStyle = "#F5F5F5";
  ctx.beginPath();
  ctx.roundRect(cx + 10, baseY - 62, 16, 55, [4, 4, 2, 2]);
  ctx.fill();
  ctx.fillStyle = "#E0E0E0";
  // Knee roll on back pad
  ctx.beginPath();
  ctx.ellipse(cx + 18, baseY - 60, 9, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Straps on back pad
  ctx.fillStyle = "#B8860B";
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(cx + 10, baseY - 48 + i * 14, 16, 2);
  }

  // Front leg pad (left) - slightly angled
  ctx.save();
  ctx.translate(cx - 16, baseY - 66);
  ctx.rotate(-0.05);
  ctx.fillStyle = "#F8F8F8";
  ctx.beginPath();
  ctx.roundRect(0, 0, 15, 58, [4, 4, 2, 2]);
  ctx.fill();
  ctx.fillStyle = "#E8E8E8";
  ctx.beginPath();
  ctx.ellipse(7, 2, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#B8860B";
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(0, 14 + i * 14, 15, 2);
  }
  ctx.restore();

  // === THIGH GUARD ===
  ctx.fillStyle = "#D0D0D0";
  ctx.beginPath();
  ctx.roundRect(cx + 6, baseY - 82, 12, 22, 3);
  ctx.fill();
  ctx.fillStyle = "#B8B8B8";
  ctx.fillRect(cx + 7, baseY - 80, 10, 2);

  // === JERSEY (body) ===
  ctx.fillStyle = jerseyColor;
  // Main torso
  ctx.beginPath();
  ctx.roundRect(cx - 16, baseY - 116, 30, 52, [0, 0, 4, 4]);
  ctx.fill();
  // Shadow side
  ctx.fillStyle = jerseyDark;
  ctx.beginPath();
  ctx.roundRect(cx + 6, baseY - 116, 8, 52, [0, 0, 4, 4]);
  ctx.fill();
  // Jersey number area
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillRect(cx - 10, baseY - 105, 14, 12);
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(cx - 8, baseY - 103, 4, 2);
  ctx.fillRect(cx - 8, baseY - 99, 4, 2);
  ctx.fillRect(cx - 3, baseY - 103, 4, 2);
  ctx.fillRect(cx - 3, baseY - 99, 4, 2);

  // === ARM GUARD (front arm - left) ===
  ctx.fillStyle = "#DAA520";
  ctx.beginPath();
  ctx.roundRect(cx - 22, baseY - 106, 8, 20, 3);
  ctx.fill();
  ctx.fillStyle = "#B8860B";
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(cx - 22, baseY - 102 + i * 7, 8, 1);
  }

  // === ARMS ===
  // Back arm (right, upper - holding bat)
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.roundRect(cx + 12, baseY - 112, 9, 24, 4);
  ctx.fill();
  // Forearm angled down to bat handle
  ctx.save();
  ctx.translate(cx + 16, baseY - 90);
  ctx.rotate(0.5);
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.roundRect(-4, 0, 8, 22, 3);
  ctx.fill();
  ctx.restore();

  // Front arm (left, bent at elbow pointing bat)
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.roundRect(cx - 20, baseY - 112, 8, 18, 3);
  ctx.fill();
  ctx.save();
  ctx.translate(cx - 16, baseY - 96);
  ctx.rotate(-0.6);
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.roundRect(-4, 0, 8, 18, 3);
  ctx.fill();
  ctx.restore();

  // === GLOVES ===
  // Top glove (right hand)
  ctx.fillStyle = "#B22222";
  ctx.beginPath();
  ctx.roundRect(cx + 10, baseY - 90, 14, 14, 3);
  ctx.fill();
  // Finger ridges on right glove
  ctx.fillStyle = "#fff";
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(cx + 11 + i * 4, baseY - 90, 2, 14);
  }
  ctx.fillStyle = "#8B0000";
  ctx.fillRect(cx + 10, baseY - 90, 14, 3);

  // Bottom glove (left hand)
  ctx.fillStyle = "#CC1C1C";
  ctx.beginPath();
  ctx.roundRect(cx - 20, baseY - 100, 12, 12, 3);
  ctx.fill();
  ctx.fillStyle = "#fff";
  for (let i = 0; i < 2; i++) {
    ctx.fillRect(cx - 19 + i * 5, baseY - 100, 2, 12);
  }

  // === BAT ===
  ctx.save();
  ctx.translate(cx + 20, baseY - 90);
  ctx.rotate(0.22);
  // Handle
  ctx.fillStyle = "#6B3A2A";
  ctx.fillRect(-3, -52, 7, 52);
  // Grip tape
  ctx.fillStyle = "#1a1a1a";
  for (let i = 0; i < 7; i++) {
    ctx.fillRect(-3, -50 + i * 7, 7, 3);
  }
  ctx.restore();
  // Blade
  ctx.save();
  ctx.translate(cx + 16, baseY - 44);
  ctx.rotate(0.22);
  // Main blade face (willow color)
  ctx.fillStyle = "#D4A853";
  ctx.beginPath();
  ctx.roundRect(-5, 0, 26, 60, [2, 8, 8, 2]);
  ctx.fill();
  // Edge shading
  ctx.fillStyle = "#C49040";
  ctx.fillRect(16, 0, 5, 60);
  // Spine ridge
  ctx.fillStyle = "#E8C070";
  ctx.fillRect(-4, 2, 5, 56);
  // Sweet spot marker
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillRect(-2, 20, 16, 20);
  ctx.restore();

  // === NECK ===
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.roundRect(cx - 5, baseY - 124, 8, 10, 2);
  ctx.fill();

  // === HEAD / FACE ===
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.ellipse(cx + 1, baseY - 135, 11, 13, -0.1, 0, Math.PI * 2);
  ctx.fill();
  // Face details
  ctx.fillStyle = hexDarken(skinTone.length === 7 ? skinTone : "#8B5E3C", 0.85);
  // Eyes
  ctx.beginPath();
  ctx.ellipse(cx - 3, baseY - 137, 2, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 5, baseY - 137, 2, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  // Nose bridge
  ctx.fillStyle = hexDarken(skinTone.length === 7 ? skinTone : "#8B5E3C", 0.9);
  ctx.fillRect(cx, baseY - 135, 2, 4);

  // === HELMET ===
  ctx.fillStyle = helmetColor;
  // Dome
  ctx.beginPath();
  ctx.ellipse(cx + 1, baseY - 143, 14, 11, -0.1, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(cx - 14, baseY - 145, 30, 8);
  // Brim (peak)
  ctx.beginPath();
  ctx.ellipse(cx - 6, baseY - 137, 8, 4, -0.2, Math.PI, 0);
  ctx.fill();
  // Helmet shading
  const helmetGrad = ctx.createLinearGradient(
    cx - 14,
    baseY - 155,
    cx + 16,
    baseY - 138,
  );
  helmetGrad.addColorStop(0, "rgba(255,255,255,0.25)");
  helmetGrad.addColorStop(1, "rgba(0,0,0,0.2)");
  ctx.fillStyle = helmetGrad;
  ctx.beginPath();
  ctx.ellipse(cx + 1, baseY - 143, 14, 11, -0.1, Math.PI, 0);
  ctx.fill();
  // Helmet grill (5 horizontal bars)
  ctx.fillStyle = "#333";
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(cx - 11, baseY - 139 + i * 4, 12, 1.5);
  }
  // Chin guard
  ctx.fillStyle = helmetColor;
  ctx.beginPath();
  ctx.arc(cx - 10, baseY - 130, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawNonStriker(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  jerseyColor: string,
  helmetColor: string,
  skinTone: string,
  name: string,
) {
  // Draw mirrored & smaller (perspective)
  ctx.save();
  ctx.scale(-0.55, 0.55); // mirror + scale
  const sx = -cx;
  const sy = baseY / 0.55;
  // Simple body
  ctx.fillStyle = "#111";
  ctx.fillRect(sx - 10, sy - 5, 8, 5);
  ctx.fillRect(sx + 3, sy - 5, 8, 5);
  ctx.fillStyle = "#F0F0F0";
  ctx.fillRect(sx - 8, sy - 28, 6, 24);
  ctx.fillRect(sx + 3, sy - 30, 6, 26);
  ctx.fillStyle = jerseyColor;
  ctx.fillRect(sx - 6, sy - 50, 13, 22);
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.ellipse(sx, sy - 60, 6, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = helmetColor;
  ctx.beginPath();
  ctx.ellipse(sx, sy - 64, 8, 6, 0, Math.PI, 0);
  ctx.fill();
  ctx.restore();
  // Name tag
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(cx - 24, baseY * 0.55 + 4, 48, 13, 3);
  else ctx.rect(cx - 24, baseY * 0.55 + 4, 48, 13);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "bold 7px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(name.split(" ").pop() ?? name, cx, baseY * 0.55 + 14);
  ctx.textAlign = "left";
  ctx.restore();
}

function drawBowler(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  jerseyColor: string,
  skinTone: string,
  helmetColor: string,
) {
  ctx.fillStyle = "#fff";
  ctx.fillRect(cx - 6, baseY - 34, 6, 34);
  ctx.fillRect(cx + 1, baseY - 38, 6, 38);
  ctx.fillStyle = "#111";
  ctx.fillRect(cx - 8, baseY - 5, 9, 5);
  ctx.fillRect(cx, baseY - 5, 9, 5);
  ctx.fillStyle = jerseyColor;
  ctx.fillRect(cx - 8, baseY - 66, 18, 32);
  ctx.fillStyle = `${jerseyColor}aa`;
  ctx.fillRect(cx - 8, baseY - 66, 18, 4);
  ctx.fillStyle = jerseyColor;
  ctx.fillRect(cx - 14, baseY - 63, 6, 18);
  ctx.save();
  ctx.translate(cx + 10, baseY - 55);
  ctx.rotate(-1.1);
  ctx.fillRect(-3, -18, 6, 22);
  ctx.restore();
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.ellipse(cx + 1, baseY - 78, 9, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  // Bowler helmet
  ctx.fillStyle = helmetColor;
  ctx.beginPath();
  ctx.ellipse(cx + 1, baseY - 85, 12, 9, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(cx - 12, baseY - 87, 26, 6);
  // Helmet brim
  ctx.beginPath();
  ctx.ellipse(cx - 4, baseY - 79, 7, 3, -0.2, Math.PI, 0);
  ctx.fill();
  // Grill
  ctx.fillStyle = "#444";
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(cx - 9, baseY - 84 + i * 3, 10, 1);
  }
  // Ball
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

function drawUmpire(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  fingerUp: boolean,
) {
  // White coat
  ctx.fillStyle = "#F5F5F5";
  ctx.fillRect(cx - 7, baseY - 55, 15, 35);
  // Trousers
  ctx.fillStyle = "#888";
  ctx.fillRect(cx - 6, baseY - 20, 6, 20);
  ctx.fillRect(cx + 1, baseY - 20, 6, 20);
  // Head
  ctx.fillStyle = "#D4A574";
  ctx.beginPath();
  ctx.ellipse(cx, baseY - 64, 8, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  // Hat
  ctx.fillStyle = "#444";
  ctx.fillRect(cx - 9, baseY - 73, 18, 4);
  ctx.fillRect(cx - 6, baseY - 80, 12, 8);
  // Arms
  ctx.fillStyle = "#F5F5F5";
  if (fingerUp) {
    // Right arm raised
    ctx.save();
    ctx.translate(cx + 7, baseY - 48);
    ctx.rotate(-2.2);
    ctx.fillRect(-3, -18, 6, 18);
    ctx.restore();
    // Finger
    ctx.fillStyle = "#D4A574";
    ctx.save();
    ctx.translate(cx + 7 - Math.sin(2.2) * 18, baseY - 48 - Math.cos(2.2) * 18);
    ctx.rotate(-2.2);
    ctx.fillRect(-2, -8, 4, 8);
    ctx.restore();
  } else {
    ctx.save();
    ctx.translate(cx - 7, baseY - 48);
    ctx.rotate(0.4);
    ctx.fillRect(-3, -14, 6, 14);
    ctx.restore();
    ctx.save();
    ctx.translate(cx + 7, baseY - 48);
    ctx.rotate(-0.4);
    ctx.fillRect(-3, -14, 6, 14);
    ctx.restore();
  }
}

function drawCheerleader(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  t: number,
) {
  const bounce = Math.abs(Math.sin(t * 0.12)) * 4;
  ctx.fillStyle = color;
  ctx.fillRect(x - 4, y - 20 - bounce, 9, 12);
  ctx.fillStyle = "#D4A574";
  ctx.beginPath();
  ctx.ellipse(x, y - 26 - bounce, 5, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Pom-pom arms
  ctx.fillStyle = "#FFD700";
  ctx.save();
  ctx.translate(x - 4, y - 20 - bounce);
  ctx.rotate(-0.8 + Math.sin(t * 0.12) * 0.6);
  ctx.fillRect(-3, -10, 4, 10);
  ctx.restore();
  ctx.save();
  ctx.translate(x + 5, y - 20 - bounce);
  ctx.rotate(0.8 - Math.sin(t * 0.12) * 0.6);
  ctx.fillRect(-1, -10, 4, 10);
  ctx.restore();
}

type FieldPos = { x: number; y: number };

function getFieldPositions(w: number, h: number): FieldPos[] {
  return [
    { x: w * 0.5 + w * 0.28, y: h * 0.58 }, // point
    { x: w * 0.5 + w * 0.22, y: h * 0.52 }, // cover
    { x: w * 0.5 + w * 0.12, y: h * 0.49 }, // mid-off
    { x: w * 0.5 - w * 0.12, y: h * 0.49 }, // mid-on
    { x: w * 0.5 - w * 0.22, y: h * 0.52 }, // mid-wicket
    { x: w * 0.5 - w * 0.28, y: h * 0.58 }, // square leg
    { x: w * 0.5 + w * 0.08, y: h * 0.62 }, // slip 1
    { x: w * 0.5 + w * 0.14, y: h * 0.64 }, // slip 2
    { x: w * 0.5 - w * 0.04, y: h * 0.72 }, // fine leg
  ];
}

function drawFielder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  jerseyColor: string,
  skinTone: string,
  animated: boolean,
  t: number,
  diveOffsetX?: number,
  diveOffsetY?: number,
) {
  const dx = diveOffsetX ?? 0;
  const dy = diveOffsetY ?? 0;
  const wave = animated ? Math.sin(t * 0.08) * 5 : 0;
  const rx = x + dx;
  const ry = y + dy;
  ctx.fillStyle = "#fff";
  ctx.fillRect(rx - 4, ry - 18, 4, 18);
  ctx.fillRect(rx + 1, ry - 18, 4, 18);
  ctx.fillStyle = jerseyColor;
  ctx.fillRect(rx - 6, ry - 36 + wave, 13, 18);
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.ellipse(rx, ry - 43 + wave, 6, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  // Arms waving
  if (animated) {
    ctx.fillStyle = jerseyColor;
    ctx.save();
    ctx.translate(rx - 6, ry - 34 + wave);
    ctx.rotate(-0.5 + Math.sin(t * 0.08) * 0.8);
    ctx.fillRect(-3, -10, 5, 10);
    ctx.restore();
    ctx.save();
    ctx.translate(rx + 7, ry - 34 + wave);
    ctx.rotate(0.5 - Math.sin(t * 0.08) * 0.8);
    ctx.fillRect(-2, -10, 5, 10);
    ctx.restore();
  }
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  ballX: number,
  ballY: number,
  ballVisible: boolean,
  trail: TrailPoint[],
  opposingTeamColor: string, // fielder jersey color = opposing team
  opposingHelmetColor: string, // bowler helmet color = opposing team
  opposingSkinTone: string, // bowler skin tone = opposing team
  team: IPLTeam | InternationalTeam, // player's team (batsman jersey)
  cameraView: CameraView,
  animT: number,
  umpireFingerUp: boolean,
  batterName: string,
  bowlerName: string,
  nonStrikerName: string,
  currentBatterIdx: number,
  lineup: SelectedLineup,
  isBig: boolean, // six or four
  divingFielderIdx: number | null,
  diveProgress: number,
  shotDirection: number, // -1 left, 0 straight, 1 right
) {
  const batters = lineup.battingOrder;
  const batter = batters[currentBatterIdx] || batters[0];
  const _bowler = lineup.bowler;

  // Batter's eye view: wider bottom, narrower top for pitch
  const isBatterEye = cameraView === "batterEye";

  // ── SKY ──
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.52);
  sky.addColorStop(0, cameraView === "sideOn" ? "#0d2a4a" : "#1a3a5c");
  sky.addColorStop(0.6, "#2d6a8a");
  sky.addColorStop(1, "#4a8fb0");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.52);

  // Stars
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  for (const [sx, sy] of [
    [0.08, 0.03],
    [0.22, 0.06],
    [0.42, 0.02],
    [0.68, 0.05],
    [0.78, 0.02],
    [0.91, 0.07],
    [0.34, 0.09],
    [0.57, 0.04],
  ]) {
    ctx.fillRect(sx * w, sy * h, 2, 2);
  }

  // ── FLOODLIGHTS ──
  const poles = [w * 0.08, w * 0.92];
  for (const px of poles) {
    ctx.fillStyle = "#777";
    ctx.fillRect(px - 4, h * 0.08, 8, h * 0.38);
    ctx.fillRect(px - 18, h * 0.08, 36, 6);
    ctx.fillStyle = "rgba(255,240,180,0.9)";
    for (let li = 0; li < 5; li++) {
      ctx.beginPath();
      ctx.arc(px - 13 + li * 6.5, h * 0.08 + 3, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    const glow = ctx.createRadialGradient(px, h * 0.08, 0, px, h * 0.08, 70);
    glow.addColorStop(0, "rgba(255,240,180,0.22)");
    glow.addColorStop(1, "rgba(255,240,180,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(px, h * 0.08, 70, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── STADIUM ──
  const seatColors = ["#1a2a3a", "#16213a", "#0d1b2a", "#0a1520"];
  for (let tier = 0; tier < 4; tier++) {
    ctx.fillStyle = seatColors[tier];
    ctx.beginPath();
    ctx.ellipse(
      w / 2,
      h * 0.42,
      w * (0.52 + tier * 0.04),
      h * (0.15 + tier * 0.035),
      0,
      Math.PI,
      0,
    );
    ctx.fill();
  }

  // ── CROWD ──
  const crowdCols = [
    "#E53935",
    "#1E88E5",
    "#FDD835",
    "#43A047",
    "#FB8C00",
    "#8E24AA",
    "#00ACC1",
    "#F4511E",
    "#fff",
    "#FF80AB",
    "#80D8FF",
    "#CCFF90",
  ];
  for (let row = 0; row < 6; row++) {
    const cy2 = h * 0.385 - row * h * 0.032;
    const rowW = w * (0.62 + row * 0.035);
    const startX = w / 2 - rowW / 2;
    const count = Math.floor(rowW / 8);
    for (let col = 0; col < count; col++) {
      const cx2 = startX + col * 8 + 4;
      // Wave animation
      const wave = Math.sin(animT * 0.05 + col * 0.3 + row * 0.7) > 0.6;
      ctx.fillStyle = crowdCols[(row * 13 + col * 7) % crowdCols.length];
      ctx.beginPath();
      ctx.ellipse(
        cx2,
        cy2 - (wave ? 3 : 0),
        3.5,
        wave ? 6 : 4.5,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }

  // ── CHEERLEADERS (both sides of stands) ──
  const cheerColors = [
    team.primaryColor,
    team.secondaryColor,
    "#FFD700",
    "#FF69B4",
  ];
  const cheerBig = isBig;
  for (let ci = 0; ci < 6; ci++) {
    drawCheerleader(
      ctx,
      w * 0.04 + ci * w * 0.02,
      h * 0.38,
      cheerColors[ci % cheerColors.length],
      animT + (cheerBig ? animT * 3 : 0) + ci * 8,
    );
    drawCheerleader(
      ctx,
      w * 0.96 - ci * w * 0.02,
      h * 0.38,
      cheerColors[(ci + 2) % cheerColors.length],
      animT + (cheerBig ? animT * 3 : 0) + ci * 12,
    );
  }

  // ── GROUND ──
  const groundGrad = ctx.createLinearGradient(0, h * 0.44, 0, h);
  groundGrad.addColorStop(0, "#2d6a1e");
  groundGrad.addColorStop(0.3, "#3a8a28");
  groundGrad.addColorStop(1, "#1a5010");
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, h * 0.44, w, h * 0.56);

  // Mowing stripes
  for (let s = 0; s < 10; s++) {
    if (s % 2 === 0) {
      ctx.fillStyle = "rgba(255,255,255,0.025)";
      ctx.fillRect(s * (w / 10), h * 0.44, w / 10, h);
    }
  }

  // Boundary rope
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.68, w * 0.46, h * 0.26, 0, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 6]);
  ctx.stroke();
  ctx.setLineDash([]);

  // 30-yard circle
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.68, w * 0.28, h * 0.17, 0, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // ── PITCH (perspective trapezoid) ──
  // batterEye: extra wide at bottom for looking-up-the-pitch feel
  const pitchW = Math.max(w * 0.09, 60);
  const pitchH = h * 0.47;
  const pitchCX = w / 2;
  const pitchTopY = h * 0.3;
  const pitchBotY = pitchTopY + pitchH;
  const pitchTopW = isBatterEye ? pitchW * 0.35 : pitchW * 0.55;
  const pitchBotW = isBatterEye ? pitchW * 1.3 : pitchW;

  ctx.beginPath();
  ctx.moveTo(pitchCX - pitchTopW / 2, pitchTopY);
  ctx.lineTo(pitchCX + pitchTopW / 2, pitchTopY);
  ctx.lineTo(pitchCX + pitchBotW / 2, pitchBotY);
  ctx.lineTo(pitchCX - pitchBotW / 2, pitchBotY);
  ctx.closePath();
  const pitchGrad = ctx.createLinearGradient(
    pitchCX,
    pitchTopY,
    pitchCX,
    pitchBotY,
  );
  pitchGrad.addColorStop(0, "#C8A850");
  pitchGrad.addColorStop(0.5, "#D4B86A");
  pitchGrad.addColorStop(1, "#C4A55A");
  ctx.fillStyle = pitchGrad;
  ctx.fill();

  // Pitch wear
  ctx.fillStyle = "rgba(100,70,20,0.13)";
  ctx.beginPath();
  ctx.ellipse(
    pitchCX,
    pitchTopY + pitchH * 0.4,
    pitchBotW * 0.22,
    pitchH * 0.07,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(
    pitchCX,
    pitchTopY + pitchH * 0.7,
    pitchBotW * 0.28,
    pitchH * 0.055,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // Crease lines
  const creaseY1 = pitchTopY + pitchH * 0.13; // bowling end crease
  const creaseY2 = pitchTopY + pitchH * 0.87; // batting end crease
  const creaseWFar = pitchTopW + 18;
  const creaseWNear = pitchBotW + 18;
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pitchCX - creaseWFar / 2, creaseY1);
  ctx.lineTo(pitchCX + creaseWFar / 2, creaseY1);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pitchCX - creaseWNear / 2, creaseY2);
  ctx.lineTo(pitchCX + creaseWNear / 2, creaseY2);
  ctx.stroke();

  // Stumps
  drawStumps(ctx, pitchCX, creaseY2, 24);
  drawStumps(ctx, pitchCX, creaseY1, 18);

  // ── FIELDERS ── Use opposing team color
  const fieldPos = getFieldPositions(w, h);
  for (let fi = 0; fi < fieldPos.length; fi++) {
    const fp = fieldPos[fi];
    let diveX: number | undefined;
    let diveY: number | undefined;
    if (divingFielderIdx === fi && diveProgress > 0) {
      diveX = shotDirection * diveProgress * 15;
      diveY = -diveProgress * 4;
    }
    drawFielder(
      ctx,
      fp.x,
      fp.y,
      opposingTeamColor,
      "#D4A574",
      isBig,
      animT,
      diveX,
      diveY,
    );
  }

  // ── UMPIRE ──
  drawUmpire(ctx, pitchCX + pitchBotW / 2 + 20, creaseY2 - 10, umpireFingerUp);

  // ── NON-STRIKER batsman (far end, small) ──
  drawNonStriker(
    ctx,
    pitchCX - pitchTopW / 2 - 12,
    creaseY1 + 5,
    team.jerseyColor,
    team.helmetColor,
    batter.skinTone || "#8B5E3C",
    nonStrikerName,
  );

  // ── BATSMAN ──
  drawBatsman(
    ctx,
    pitchCX - pitchBotW / 2 - 10,
    creaseY2,
    team.jerseyColor,
    team.helmetColor,
    batter.skinTone || "#8B5E3C",
  );

  // Batter name tag
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.beginPath();
  if (ctx.roundRect)
    ctx.roundRect(pitchCX - pitchBotW / 2 - 40, creaseY2 + 8, 80, 16, 4);
  else ctx.rect(pitchCX - pitchBotW / 2 - 40, creaseY2 + 8, 80, 16);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 9px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    batterName.split(" ").pop() || batterName,
    pitchCX - pitchBotW / 2,
    creaseY2 + 20,
  );
  ctx.textAlign = "left";

  // ── BOWLER ──
  if (!ballVisible) {
    drawBowler(
      ctx,
      pitchCX + 10,
      creaseY1 - 5,
      opposingTeamColor,
      opposingSkinTone,
      opposingHelmetColor,
    );
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(pitchCX - 30, creaseY1 - 95, 60, 14, 4);
    else ctx.rect(pitchCX - 30, creaseY1 - 95, 60, 14);
    ctx.fill();
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      bowlerName.split(" ").pop() || bowlerName,
      pitchCX,
      creaseY1 - 84,
    );
    ctx.textAlign = "left";
  }

  // ── BALL TRAIL ──
  if (ballVisible && trail.length > 0) {
    for (let i = 0; i < trail.length; i++) {
      const tp = trail[i];
      const prog = (i + 1) / trail.length;
      ctx.beginPath();
      ctx.arc(tp.x, tp.y, 3 + prog * 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,80,80,${prog * 0.5})`;
      ctx.fill();
    }
  }

  // ── BALL ──
  if (ballVisible) {
    ctx.beginPath();
    ctx.arc(ballX, ballY, 9, 0, Math.PI * 2);
    const bgBall = ctx.createRadialGradient(
      ballX - 3,
      ballY - 3,
      1,
      ballX,
      ballY,
      9,
    );
    bgBall.addColorStop(0, "#ff8080");
    bgBall.addColorStop(0.45, "#cc2020");
    bgBall.addColorStop(1, "#7a0000");
    ctx.fillStyle = bgBall;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ballX, ballY, 9, -0.6, 0.6);
    ctx.strokeStyle = "rgba(255,200,180,0.75)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

// ─── DRS Overlay ─────────────────────────────────────────────────────────────
function DRSOverlay({
  onReview,
  onAccept,
  drsLeft,
}: { onReview: () => void; onAccept: () => void; drsLeft: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-40 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="rounded-3xl p-8 text-center max-w-xs w-full"
        style={{
          background: "linear-gradient(135deg,#1a0a00,#3a1a00)",
          border: "2px solid #F59E0B",
        }}
      >
        <div className="text-5xl mb-3">🏏</div>
        <h3 className="text-white font-black text-2xl mb-1">OUT!</h3>
        <p className="text-white/60 text-sm mb-4">
          Do you want to review the decision?
        </p>
        <p className="text-yellow-400 text-xs mb-5">DRS remaining: {drsLeft}</p>
        <div className="flex gap-3">
          {drsLeft > 0 && (
            <button
              type="button"
              onClick={onReview}
              className="flex-1 py-3 rounded-xl text-white font-black"
              style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)" }}
            >
              📹 REVIEW
            </button>
          )}
          <button
            type="button"
            onClick={onAccept}
            className="flex-1 py-3 rounded-xl text-white font-black"
            style={{ background: "linear-gradient(135deg,#DC2626,#B91C1C)" }}
          >
            ✅ WALK
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DRSResult({
  overturned,
  onDone,
}: { overturned: boolean; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.8)" }}
    >
      <motion.div
        initial={{ scale: 0.7 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-center"
      >
        <div className="text-6xl mb-4">{overturned ? "✅" : "❌"}</div>
        <h3 className="text-white font-black text-3xl mb-2">
          {overturned ? "NOT OUT!" : "DECISION UPHELD"}
        </h3>
        <div className="flex flex-col gap-1 items-center">
          {/* Hawk-eye style visualization */}
          <svg
            width="180"
            height="80"
            className="mt-2"
            aria-label="Hawk-eye DRS visualization"
          >
            <title>Hawk-eye DRS</title>
            <rect x="10" y="10" width="160" height="60" fill="#001a00" rx="4" />
            <line
              x1="30"
              y1="15"
              x2={overturned ? "100" : "90"}
              y2="65"
              stroke={overturned ? "#EF4444" : "#22C55E"}
              strokeWidth="3"
            />
            <circle
              cx={overturned ? "100" : "90"}
              cy="65"
              r="8"
              fill={overturned ? "#EF4444aa" : "#22C55Eaa"}
            />
            <text x="90" y="8" textAnchor="middle" fill="#fff" fontSize="9">
              HAWK-EYE DRS
            </text>
          </svg>
        </div>
        <p className="text-white/50 text-sm mt-3">
          {overturned ? "Ball missing stumps" : "Ball hitting stumps"}
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Over-end bowler selection modal ─────────────────────────────────────────
function BowlerSelectModal({
  bowlers,
  currentBowlerName,
  lastBowlerName,
  onSelect,
}: {
  bowlers: CricketPlayer[];
  currentBowlerName: string;
  lastBowlerName: string;
  onSelect: (player: CricketPlayer) => void;
}) {
  const available = bowlers.filter((p) => p.name !== lastBowlerName);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-40 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.78)", backdropFilter: "blur(4px)" }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="rounded-3xl p-6 text-center max-w-xs w-full mx-4"
        style={{
          background: "linear-gradient(135deg,#0a1628,#1a2840)",
          border: "2px solid rgba(100,180,255,0.35)",
        }}
      >
        <div className="text-3xl mb-2">🎳</div>
        <h3 className="text-white font-black text-xl mb-1">Over Complete!</h3>
        <p className="text-white/50 text-xs mb-4">
          {currentBowlerName} has finished their over. Choose the next bowler:
        </p>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
          {available.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => onSelect(p)}
              className="w-full py-2.5 px-4 rounded-xl text-white text-sm font-semibold text-left flex items-center gap-3 hover:opacity-90 transition-opacity"
              style={{
                background: "rgba(255,255,255,0.09)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <span className="text-lg">🏏</span>
              <div>
                <p className="font-bold">{p.name}</p>
                <p className="text-white/40 text-xs capitalize">{p.role}</p>
              </div>
            </button>
          ))}
          {available.length === 0 && (
            <p className="text-white/40 text-sm">No other bowlers available.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CricketGame({
  config,
  gameMode,
  onBack,
  onGameEnd,
  onRestart,
  difficulty,
  team,
  lineup,
  batFirst,
  opposingTeam,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const idleAnimRef = useRef<number | null>(null);
  const ballStartTime = useRef(0);
  const ballDurationRef = useRef(1100);

  const ballXRef = useRef(0);
  const ballYRef = useRef(0);
  const ballVisibleRef = useRef(false);
  const trailRef = useRef<TrailPoint[]>([]);
  const driftRef = useRef<BallDrift>(0);
  const arrowKeyRef = useRef<ArrowKey | null>(null);
  const phaseRef = useRef<GamePhase>("waiting");
  const animTRef = useRef(0); // idle animation ticker
  const stopAmbientRef = useRef<(() => void) | null>(null);

  const [cameraView, setCameraView] = useState<CameraView>("broadcast");
  const [cameraToast, setCameraToast] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] =
    useState<DeliveryType>("swing");
  const [showIplLogo, setShowIplLogo] = useState(false);
  const [showMilestone, setShowMilestone] = useState<null | 50 | 100 | 150>(
    null,
  );
  const [showDust, setShowDust] = useState(false);
  const [sixDistance, setSixDistance] = useState<number | null>(null);
  const [showDRS, setShowDRS] = useState(false);
  const [showDRSResult, setShowDRSResult] = useState<{
    overturned: boolean;
  } | null>(null);
  const [drsLeft, setDrsLeft] = useState(2);
  const [umpireFingerUp, setUmpireFingerUp] = useState(false);
  const [isBigShot, setIsBigShot] = useState(false);
  const [currentBatterIdx, setCurrentBatterIdx] = useState(0);
  const [speedLabel, setSpeedLabel] = useState<string | null>(null);
  const [divingFielderIdx, setDivingFielderIdx] = useState<number | null>(null);
  const [diveProgress, setDiveProgress] = useState(0);
  const [shotDirection, setShotDirection] = useState(0);
  // Bowler tracking
  const [currentBowlerName, setCurrentBowlerName] = useState(
    lineup.bowler?.name ?? "Bowler",
  );
  const [lastBowlerName, setLastBowlerName] = useState("");
  const [showBowlerSelect, setShowBowlerSelect] = useState(false);

  const [gameState, setGameState] = useState<GameState>(() =>
    makeInitialState(config, difficulty),
  );

  // playerBats = true: player is batting, bot bowls. false: player bowls, bot bats.
  const playerBats = batFirst;

  // Derived: get bowler players from lineup
  const allBowlers = lineup.battingOrder.filter(
    (p) => p.role === "bowler" || p.role === "allrounder",
  );

  const batterName =
    lineup.battingOrder[currentBatterIdx]?.name ||
    lineup.battingOrder[0]?.name ||
    "Batsman";

  // Non-striker: the other opener
  const nonStrikerIdx = currentBatterIdx === 0 ? 1 : 0;
  const nonStrikerName =
    lineup.battingOrder[nonStrikerIdx]?.name ?? "Non-striker";

  const bowlerName = currentBowlerName;
  const batterPhoto =
    lineup.battingOrder[currentBatterIdx]?.photoUrl ||
    lineup.battingOrder[0]?.photoUrl;
  const bowlerPhoto = lineup.bowler?.photoUrl;

  // Opposing team colors for fielders and bowler
  const opposingTeamColor = opposingTeam?.jerseyColor ?? "#D4AF37";
  const opposingHelmetColor = opposingTeam?.helmetColor ?? "#222";
  const opposingSkinTone = opposingTeam?.players[0]?.skinTone ?? "#8B5E3C";

  // Set initial commentary based on player role
  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      commentary: playerBats
        ? `Chase ${config.target} runs in ${config.balls / 6} overs. You are BATTING — use ← → ↑ keys to hit!`
        : `Chase ${config.target} runs in ${config.balls / 6} overs. You are BOWLING — select delivery & press SPACE!`,
    }));
  }, [playerBats, config.target, config.balls]);

  // ── Ambient crowd sound ──────────────────────────────────────────────────
  useEffect(() => {
    const stop = playAmbientCrowd();
    stopAmbientRef.current = stop;
    return () => {
      if (stopAmbientRef.current) stopAmbientRef.current();
    };
  }, []);

  // ── Idle animation loop ──────────────────────────────────────────────────
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
      opposingTeamColor,
      opposingHelmetColor,
      opposingSkinTone,
      team,
      cameraView,
      animTRef.current,
      umpireFingerUp,
      batterName,
      bowlerName,
      nonStrikerName,
      currentBatterIdx,
      lineup,
      isBigShot,
      divingFielderIdx,
      diveProgress,
      shotDirection,
    );
  }, [
    opposingTeamColor,
    opposingHelmetColor,
    opposingSkinTone,
    team,
    cameraView,
    umpireFingerUp,
    batterName,
    bowlerName,
    nonStrikerName,
    currentBatterIdx,
    lineup,
    isBigShot,
    divingFielderIdx,
    diveProgress,
    shotDirection,
  ]);

  // Continuous idle repaint (for crowd wave + cheerleaders)
  useEffect(() => {
    const loop = () => {
      animTRef.current += 1;
      drawCanvas();
      idleAnimRef.current = requestAnimationFrame(loop);
    };
    idleAnimRef.current = requestAnimationFrame(loop);
    return () => {
      if (idleAnimRef.current) cancelAnimationFrame(idleAnimRef.current);
    };
  }, [drawCanvas]);

  // ── Initial resize ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Camera view change handler ────────────────────────────────────────────
  const switchCamera = useCallback(() => {
    setCameraView((v) => {
      const next =
        v === "broadcast"
          ? "sideOn"
          : v === "sideOn"
            ? "batterEye"
            : "broadcast";
      const labels: Record<CameraView, string | null> = {
        broadcast: null,
        sideOn: "Side-on View",
        batterEye: "Batter's Eye View",
      };
      const label = labels[next];
      if (label) {
        setCameraToast(label);
        setTimeout(() => setCameraToast(null), 2000);
      }
      return next;
    });
  }, []);

  // ── Ball animation ────────────────────────────────────────────────────────
  const animateBall = useCallback(
    (delivery: DeliveryType, onComplete: (key: ArrowKey | null) => void) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Drift based on delivery type
      const driftMap: Record<DeliveryType, BallDrift> = {
        inswing: -1,
        outswing: 1,
        swing: Math.random() > 0.5 ? -1 : (1 as BallDrift),
        spin: Math.random() > 0.5 ? -1 : (1 as BallDrift),
        bouncer: 0,
      };
      driftRef.current = driftMap[delivery];

      // Speed duration per delivery type
      const duration = DELIVERY_DURATIONS[delivery];
      ballDurationRef.current = duration;

      // Speed label
      const speedLabelMap: Record<DeliveryType, string> = {
        bouncer: "FAST!",
        spin: "SPIN",
        swing: "SWING",
        inswing: "SWING",
        outswing: "SWING",
      };
      setSpeedLabel(speedLabelMap[delivery]);
      setTimeout(() => setSpeedLabel(null), 700);

      const startX = canvas.width / 2 + 5;
      const startY = canvas.height * 0.35;
      const endY = canvas.height * 0.78;
      const totalDrift =
        driftRef.current *
        (delivery === "spin"
          ? 50
          : delivery === "outswing" || delivery === "inswing"
            ? 40
            : 30);

      ballStartTime.current = performance.now();
      ballVisibleRef.current = true;
      ballXRef.current = startX;
      ballYRef.current = startY;
      trailRef.current = [];
      arrowKeyRef.current = null;

      const step = (now: number) => {
        const elapsed = now - ballStartTime.current;
        const t = Math.min(elapsed / duration, 1);
        const ease = t * t * (3 - 2 * t);
        // Bouncer: rises before pitching
        const arcY =
          delivery === "bouncer"
            ? -Math.sin(Math.PI * t) * (canvas.height * 0.14)
            : -Math.sin(Math.PI * t) * (canvas.height * 0.07);
        const y = startY + (endY - startY) * ease + arcY;
        const x = startX + totalDrift * ease;

        trailRef.current = [
          ...trailRef.current.slice(-(TRAIL_LENGTH - 1)),
          { x, y },
        ];
        ballXRef.current = x;
        ballYRef.current = y;

        if (t < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          ballVisibleRef.current = false;
          trailRef.current = [];
          const key = arrowKeyRef.current;
          phaseRef.current = "result";
          onComplete(key);
        }
      };
      animFrameRef.current = requestAnimationFrame(step);
    },
    [],
  );

  // ── Fielder dive animation ────────────────────────────────────────────────
  const triggerFielderDive = useCallback((direction: number) => {
    const fieldPos = getFieldPositions(800, 600);
    // Pick nearest fielder on the shot side
    let idx = 0;
    if (direction < 0)
      idx = 5; // square leg side
    else if (direction > 0)
      idx = 0; // point side
    else idx = 3; // mid-on
    // Random offset for variety
    idx = (idx + Math.floor(Math.random() * 2)) % fieldPos.length;
    setShotDirection(direction);
    setDivingFielderIdx(idx);
    setDiveProgress(0);
    const startTime = performance.now();
    const duration = 600;
    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      setDiveProgress(t);
      if (t < 1) requestAnimationFrame(animate);
      else {
        setDivingFielderIdx(null);
        setDiveProgress(0);
      }
    };
    requestAnimationFrame(animate);
  }, []);

  // ── Finalize ball outcome ─────────────────────────────────────────────────
  const finalizeBall = useCallback(
    (pressedKey: ArrowKey | null) => {
      const outcome = resolveDirectionalShot(
        pressedKey,
        driftRef.current,
        difficulty,
      );

      // Sounds
      if (!outcome.isWicket) {
        playBatCrack();
      }

      if (outcome.runs === 6) {
        setShowIplLogo(true);
        const dist = Math.floor(Math.random() * 43) + 68;
        setSixDistance(dist);
        setIsBigShot(true);
        playCrowdRoar("big");
        playSixFanfare();
        triggerFielderDive(
          pressedKey === "left" ? -1 : pressedKey === "right" ? 1 : 0,
        );
        setTimeout(() => {
          setShowIplLogo(false);
          setSixDistance(null);
          setIsBigShot(false);
        }, 2800);
      } else if (outcome.runs === 4) {
        setIsBigShot(true);
        playCrowdRoar("normal");
        playBoundaryBell();
        triggerFielderDive(
          pressedKey === "left" ? -1 : pressedKey === "right" ? 1 : 0,
        );
        setTimeout(() => setIsBigShot(false), 1500);
      } else if (!outcome.isWicket && outcome.runs > 0) {
        triggerFielderDive(
          pressedKey === "left" ? -1 : pressedKey === "right" ? 1 : 0,
        );
      }

      if (outcome.runs === 0 && !outcome.isWicket) {
        setShowDust(true);
        setTimeout(() => setShowDust(false), 300);
      }

      if (outcome.isWicket) {
        playWicketSound();
        setUmpireFingerUp(true);
        setShowDRS(true);
        setTimeout(() => setUmpireFingerUp(false), 3000);
        return; // don't update state yet -- wait for DRS decision
      }

      commitBall(outcome.runs, false);
    },
    [difficulty, triggerFielderDive],
  );

  const commitBall = useCallback(
    (runs: number, isWicket: boolean) => {
      setGameState((prev) => {
        const newRuns = prev.runs + runs;
        const newWickets = prev.wickets + (isWicket ? 1 : 0);
        const newBalls = prev.ballsBowled + 1;
        const newFours = prev.fours + (runs === 4 ? 1 : 0);
        const newSixes = prev.sixes + (runs === 6 ? 1 : 0);
        const newBoundaries =
          prev.boundaries + (runs === 4 || runs === 6 ? 1 : 0);
        const newDots = prev.dots + (runs === 0 && !isWicket ? 1 : 0);
        const newPartnerRuns = isWicket ? 0 : prev.partnershipRuns + runs;
        const newPartnerBalls = isWicket ? 0 : prev.partnershipBalls + 1;

        const ballResult: BallResult = { runs, isWicket };
        const newOverBalls = [...prev.overBalls];
        let newOverHistory = [...prev.overHistory];
        if (newOverBalls.length >= 6) {
          newOverHistory = [...newOverHistory, [...newOverBalls]];
          newOverBalls.length = 0;
        }
        newOverBalls.push(ballResult);

        // Over complete: show bowler select if player is bowling
        const justCompletedOver =
          newOverBalls.length === 6 ||
          (prev.overBalls.length === 5 && !isWicket);
        // We'll check after state update via a flag
        if (justCompletedOver && !playerBats) {
          setTimeout(() => setShowBowlerSelect(true), 400);
        } else if (justCompletedOver && playerBats) {
          // Bot picks next bowler automatically
          const eligible = lineup.battingOrder.filter(
            (p) =>
              (p.role === "bowler" || p.role === "allrounder") &&
              p.name !== currentBowlerName,
          );
          if (eligible.length > 0) {
            const next = eligible[Math.floor(Math.random() * eligible.length)];
            setTimeout(() => {
              setLastBowlerName(currentBowlerName);
              setCurrentBowlerName(next.name);
            }, 500);
          }
        }

        const isLastBall = newBalls >= config.balls;
        const isAllOut = newWickets >= 10;
        const isChased = newRuns >= config.target;
        let phase: GamePhase = "result";
        if (isChased || isLastBall || isAllOut) phase = "over";

        // Milestone
        let newMilestone = prev.milestoneShown;
        const checkMilestone = (val: 50 | 100 | 150) => {
          if (newRuns >= val && prev.milestoneShown < val) {
            newMilestone = val;
            setTimeout(() => {
              setShowMilestone(val);
              setTimeout(
                () => setShowMilestone(null),
                val === 100 ? 4500 : 3500,
              );
            }, 100);
          }
        };
        checkMilestone(150);
        checkMilestone(100);
        checkMilestone(50);

        const commentary = isWicket
          ? `OUT! ${lineup.battingOrder[currentBatterIdx]?.name || "Batsman"} is dismissed!`
          : runs === 6
            ? `MAXIMUM! ${batterName} sends it to the stands!`
            : runs === 4
              ? "FOUR! Great shot through the covers!"
              : runs === 0
                ? "Dot ball. Good tight bowling."
                : `${runs} run${runs > 1 ? "s" : ""}. Worked away calmly.`;

        return {
          ...prev,
          runs: newRuns,
          wickets: newWickets,
          ballsBowled: newBalls,
          overBalls: newOverBalls,
          overHistory: newOverHistory,
          phase,
          lastOutcome: { runs, isWicket, commentary },
          commentary,
          boundaries: newBoundaries,
          fours: newFours,
          sixes: newSixes,
          dots: newDots,
          partnershipRuns: newPartnerRuns,
          partnershipBalls: newPartnerBalls,
          milestoneShown: newMilestone,
        };
      });

      if (isWicket) {
        setCurrentBatterIdx((prev) =>
          Math.min(prev + 1, lineup.battingOrder.length - 1),
        );
      }

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
    [
      config.balls,
      config.target,
      batterName,
      currentBatterIdx,
      currentBowlerName,
      lineup.battingOrder,
      playerBats,
    ],
  );

  const handleDRSReview = () => {
    setShowDRS(false);
    setDrsLeft((d) => d - 1);
    const overturned = Math.random() < 0.4;
    setShowDRSResult({ overturned });
  };

  const handleDRSAccept = () => {
    setShowDRS(false);
    commitBall(0, true);
  };

  const handleDRSResultDone = () => {
    const overturned = showDRSResult?.overturned ?? false;
    setShowDRSResult(null);
    if (overturned) {
      // Not out -- continue batting
      setGameState((prev) => ({
        ...prev,
        phase: "waiting",
        commentary: "NOT OUT! DRS overturned the decision! Great review!",
      }));
      phaseRef.current = "waiting";
    } else {
      commitBall(0, true);
    }
  };

  const handleBowlerSelect = (player: CricketPlayer) => {
    setLastBowlerName(currentBowlerName);
    setCurrentBowlerName(player.name);
    setShowBowlerSelect(false);
  };

  // ── Bowl trigger ─────────────────────────────────────────────────────────
  const triggerBowl = useCallback(() => {
    if (phaseRef.current !== "waiting") return;
    phaseRef.current = "bowling";
    arrowKeyRef.current = null;

    const deliveryCommentary: Record<DeliveryType, string> = {
      spin: "Spinning delivery! Watch the turn!",
      swing: "Swinging delivery! Ball moving in the air!",
      bouncer: "BOUNCER! Short and sharp!",
      inswing: "Inswinger! Ball curving in!",
      outswing: "Outswinger! Ball moving away!",
    };
    setGameState((prev) => ({
      ...prev,
      phase: "bowling",
      lastOutcome: null,
      commentary: deliveryCommentary[selectedDelivery],
    }));
    animateBall(selectedDelivery, finalizeBall);
  }, [animateBall, finalizeBall, selectedDelivery]);

  const registerArrowKey = useCallback((key: ArrowKey | null) => {
    if (phaseRef.current === "bowling" && arrowKeyRef.current === null)
      arrowKeyRef.current = key;
  }, []);

  // ── Keyboard ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (phaseRef.current === "waiting" && !playerBats) triggerBowl();
      }
      if (e.code === "ArrowLeft") {
        e.preventDefault();
        if (playerBats) registerArrowKey("left");
      }
      if (e.code === "ArrowRight") {
        e.preventDefault();
        if (playerBats) registerArrowKey("right");
      }
      if (e.code === "ArrowUp") {
        e.preventDefault();
        if (playerBats) registerArrowKey("up");
      }
      if (e.code === "KeyC") switchCamera();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [triggerBowl, registerArrowKey, playerBats, switchCamera]);

  // ── Bot bowling (when player bats) ───────────────────────────────────────
  useEffect(() => {
    if (!playerBats) return; // player is bowling, bot bats -- handled below
    if (gameState.phase !== "waiting") return;
    if (showBowlerSelect) return;
    const deliveries: DeliveryType[] = [
      "spin",
      "swing",
      "bouncer",
      "inswing",
      "outswing",
    ];
    const botDelivery =
      deliveries[Math.floor(Math.random() * deliveries.length)];
    setSelectedDelivery(botDelivery);
    const t = setTimeout(() => {
      if (phaseRef.current === "waiting") {
        phaseRef.current = "bowling";
        arrowKeyRef.current = null;
        setGameState((prev) => ({
          ...prev,
          phase: "bowling",
          lastOutcome: null,
          commentary: `Bot bowls a ${botDelivery} delivery! Use ← → ↑ to play your shot!`,
        }));
        animateBall(botDelivery, finalizeBall);
      }
    }, 1400);
    return () => clearTimeout(t);
  }, [
    playerBats,
    gameState.phase,
    animateBall,
    finalizeBall,
    showBowlerSelect,
  ]);

  // ── Bot batting (when player bowls) ──────────────────────────────────────
  useEffect(() => {
    if (playerBats) return; // player is batting, handled above
    if (gameState.phase !== "bowling") return;
    const keys: (ArrowKey | null)[] = ["left", "right", "up", null];
    const weights = [3, 3, 2, 2]; // weighted: bot misses sometimes
    const total = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    let botKey: ArrowKey | null = null;
    for (let i = 0; i < keys.length; i++) {
      rand -= weights[i];
      if (rand <= 0) {
        botKey = keys[i];
        break;
      }
    }
    const delay = 300 + Math.random() * 400; // bot reacts in 300-700ms
    const t = setTimeout(() => {
      if (phaseRef.current === "bowling") registerArrowKey(botKey);
    }, delay);
    return () => clearTimeout(t);
  }, [playerBats, gameState.phase, registerArrowKey]);

  useEffect(
    () => () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (idleAnimRef.current) cancelAnimationFrame(idleAnimRef.current);
      if (stopAmbientRef.current) stopAmbientRef.current();
    },
    [],
  );

  const handleRestart = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    phaseRef.current = "waiting";
    ballVisibleRef.current = false;
    trailRef.current = [];
    arrowKeyRef.current = null;
    setShowIplLogo(false);
    setShowMilestone(null);
    setShowDust(false);
    setSixDistance(null);
    setShowDRS(false);
    setShowDRSResult(null);
    setUmpireFingerUp(false);
    setCurrentBatterIdx(0);
    setIsBigShot(false);
    setDrsLeft(2);
    setSpeedLabel(null);
    setDivingFielderIdx(null);
    setCurrentBowlerName(lineup.bowler?.name ?? "Bowler");
    setLastBowlerName("");
    setShowBowlerSelect(false);
    setGameState(makeInitialState(config, difficulty));
    // Generate new target
    if (onRestart) onRestart();
  };

  const isGameOver = gameState.phase === "over";
  const isWin = gameState.runs >= config.target;
  const overBallItems = gameState.overBalls;
  const recentOvers = gameState.overHistory.slice(-2);
  const isPowerPlay = gameMode === "t20" && gameState.ballsBowled < 36;

  const cameraLabels: Record<CameraView, string> = {
    broadcast: "📺 Broadcast",
    sideOn: "↔ Side-on",
    batterEye: "👁 Batter View",
  };

  return (
    <div
      className="min-h-screen bg-gray-900 flex flex-col"
      data-ocid="game.section"
    >
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-white/10 px-3 py-2 flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-white/70 hover:text-white gap-1.5"
        >
          <ArrowLeft size={14} /> Back
        </Button>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: `${team.primaryColor}33`,
              color: team.secondaryColor || "#fff",
              border: `1px solid ${team.primaryColor}55`,
            }}
          >
            {team.shortName}
          </span>
          <span className="text-white/50 text-xs">{batterName}</span>
          <span className="text-white/30">vs</span>
          <span className="text-yellow-400 text-xs">{bowlerName}</span>
          <button
            type="button"
            onClick={switchCamera}
            className="text-white/50 hover:text-white text-xs px-2 py-1 rounded"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            {cameraLabels[cameraView]} (C)
          </button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRestart}
          className="text-white/70 hover:text-white gap-1.5"
        >
          <RotateCcw size={13} /> Restart
        </Button>
      </div>

      {/* Game area */}
      <div className="flex-1 relative flex flex-col">
        <div className="relative flex-1" style={{ minHeight: 400 }}>
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ display: "block", minHeight: 400 }}
          />

          {/* Camera view toast */}
          <AnimatePresence>
            {cameraToast && (
              <motion.div
                key="cam-toast"
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
              >
                <div
                  className="rounded-full px-4 py-1.5 text-white text-sm font-bold tracking-wide"
                  style={{
                    background: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  📷 {cameraToast}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Speed label above pitch */}
          <AnimatePresence>
            {speedLabel && (
              <motion.div
                key={`speed-${speedLabel}`}
                initial={{ opacity: 0, scale: 0.8, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                style={{ top: "33%" }}
              >
                <span
                  className="text-white font-black text-lg px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(0,60,140,0.82)",
                    border: "1px solid rgba(100,200,255,0.4)",
                    textShadow: "0 0 8px #4af",
                    letterSpacing: 2,
                  }}
                >
                  {speedLabel}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Batter photo overlay - bottom left */}
          {batterPhoto && (
            <div
              className="absolute pointer-events-none z-10"
              style={{ bottom: "18%", left: "8%" }}
            >
              <div className="relative">
                <div
                  className="rounded-full overflow-hidden border-2 shadow-lg"
                  style={{
                    width: 52,
                    height: 52,
                    borderColor: team.primaryColor,
                    boxShadow: `0 0 12px ${team.primaryColor}99`,
                  }}
                >
                  <img
                    src={batterPhoto}
                    alt={batterName}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-white text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: `${team.primaryColor}ee` }}
                >
                  🏏 {batterName.split(" ").slice(-1)[0]}
                </div>
              </div>
            </div>
          )}

          {/* Bowler photo overlay - top center */}
          {bowlerPhoto && !ballVisibleRef.current && (
            <div
              className="absolute pointer-events-none z-10"
              style={{ top: "12%", left: "50%", transform: "translateX(-50%)" }}
            >
              <div className="relative">
                <div
                  className="rounded-full overflow-hidden border-2 shadow-lg"
                  style={{
                    width: 44,
                    height: 44,
                    borderColor: team.secondaryColor || "#fff",
                    boxShadow: `0 0 10px ${team.secondaryColor ?? "#fff"}99`,
                  }}
                >
                  <img
                    src={bowlerPhoto}
                    alt={bowlerName}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-white text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(0,0,0,0.75)" }}
                >
                  🎳 {bowlerName.split(" ").slice(-1)[0]}
                </div>
              </div>
            </div>
          )}

          {/* Dust overlay */}
          <AnimatePresence>
            {showDust && (
              <motion.div
                key="dust"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none z-10"
                style={{ background: "rgba(139,90,43,0.18)" }}
              />
            )}
          </AnimatePresence>

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

          {/* Over history */}
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
                    {over.map((b, bi) => (
                      <span
                        key={`ov${overNum}-b${bi}-${b.runs}-${b.isWicket ? "w" : "r"}`}
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

          {/* IPL logo on SIX */}
          <AnimatePresence>
            {showIplLogo && (
              <motion.div
                key="ipl"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.3, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
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
                    className="text-yellow-300 text-3xl font-black tracking-widest"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.5, repeat: 2 }}
                  >
                    MAXIMUM! 🚀
                  </motion.p>
                  {sixDistance && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-white font-black text-2xl"
                    >
                      📏 {sixDistance} METERS
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Milestone */}
          <AnimatePresence>
            {showMilestone && (
              <FireworksCelebration
                key={`m-${showMilestone}`}
                milestone={showMilestone}
              />
            )}
          </AnimatePresence>

          {/* Bowling hint */}
          <AnimatePresence>
            {gameState.phase === "bowling" && (
              <motion.div
                key="hint"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-20"
              >
                <div
                  className="rounded-full px-4 py-1.5 text-white text-xs font-bold tracking-wide"
                  style={{
                    background: "rgba(0,40,80,0.88)",
                    border: "1px solid rgba(100,180,255,0.4)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  {playerBats ? (
                    <span>🏏 Use ← → ↑ to play your shot!</span>
                  ) : (
                    <>
                      <span
                        className="mr-2"
                        style={{ color: DELIVERY_COLORS[selectedDelivery] }}
                      >
                        {DELIVERY_LABELS[selectedDelivery]}
                      </span>
                      Bot is batting — watch the result!
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ball result popup */}
          <AnimatePresence>
            {gameState.lastOutcome &&
              gameState.phase === "result" &&
              !showIplLogo && (
                <motion.div
                  key="result"
                  initial={{ scale: 0.5, opacity: 0, y: -20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
                >
                  <div
                    className="rounded-2xl px-8 py-5 text-center shadow-xl text-white"
                    style={{
                      background: gameState.lastOutcome.isWicket
                        ? "linear-gradient(135deg,#7f1d1d,#991b1b)"
                        : gameState.lastOutcome.runs === 6
                          ? "linear-gradient(135deg,#1e3a8a,#1d4ed8)"
                          : gameState.lastOutcome.runs === 4
                            ? "linear-gradient(135deg,#14532d,#16a34a)"
                            : "linear-gradient(135deg,#1f2937,#374151)",
                    }}
                  >
                    <p className="text-4xl font-black mb-1">
                      {gameState.lastOutcome.runs === 6
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

          {/* DRS Overlay */}
          {showDRS && !showDRSResult && (
            <DRSOverlay
              onReview={handleDRSReview}
              onAccept={handleDRSAccept}
              drsLeft={drsLeft}
            />
          )}
          {showDRSResult && (
            <DRSResult
              overturned={showDRSResult.overturned}
              onDone={handleDRSResultDone}
            />
          )}

          {/* Bowler selection modal */}
          {showBowlerSelect && !isGameOver && (
            <BowlerSelectModal
              bowlers={allBowlers}
              currentBowlerName={currentBowlerName}
              lastBowlerName={lastBowlerName}
              onSelect={handleBowlerSelect}
            />
          )}

          {/* Game Over */}
          <AnimatePresence>
            {isGameOver && (
              <motion.div
                key="gameover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-40 flex items-center justify-center"
                style={{
                  background: "rgba(0,0,0,0.78)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, y: 30 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="bg-gray-900 border border-white/20 rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl"
                >
                  <div className="text-6xl mb-4">{isWin ? "🏆" : "😔"}</div>
                  <h2 className="font-black text-3xl text-white mb-2">
                    {isWin ? "You Won!" : "Game Over"}
                  </h2>
                  <p className="text-white/60 text-sm mb-6">
                    {isWin
                      ? `Outstanding! ${team.name} chased ${config.target} brilliantly!`
                      : `${team.name} scored ${gameState.runs}, needed ${config.target}.`}
                  </p>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { label: "Runs", value: gameState.runs },
                      { label: "Fours", value: gameState.fours },
                      { label: "Sixes", value: gameState.sixes },
                      { label: "Wickets", value: gameState.wickets },
                      { label: "Dots", value: gameState.dots },
                      {
                        label: "Strike Rate",
                        value:
                          gameState.ballsBowled > 0
                            ? (
                                (gameState.runs / gameState.ballsBowled) *
                                100
                              ).toFixed(0)
                            : "0",
                      },
                    ].map((s, i) => (
                      <div
                        key={s.label}
                        className="bg-white/5 rounded-xl p-3"
                        data-ocid={`game.item.${i + 1}`}
                      >
                        <p className="text-white font-bold text-xl">
                          {s.value}
                        </p>
                        <p className="text-white/50 text-xs mt-0.5">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleRestart}
                      className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl font-black"
                      data-ocid="game.confirm_button"
                    >
                      Play Again
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (onGameEnd) onGameEnd();
                        else onBack();
                      }}
                      className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-xl font-black"
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
        <div className="bg-gray-900 border-t border-white/10 px-4 py-3">
          {/* Commentary */}
          <div className="mb-2 min-h-[22px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={gameState.commentary}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-center text-white/75 text-xs italic"
                data-ocid="game.panel"
              >
                💬 {gameState.commentary}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Delivery selector (only when player is bowling) */}
          {gameState.phase === "waiting" && !isGameOver && !playerBats && (
            <div className="mb-3">
              <p className="text-white/40 text-xs text-center mb-1.5">
                Select delivery type:
              </p>
              <div className="flex gap-1.5 flex-wrap justify-center">
                {(Object.keys(DELIVERY_LABELS) as DeliveryType[]).map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setSelectedDelivery(d)}
                    className="px-2.5 py-1 rounded-full text-xs font-bold transition-all"
                    style={{
                      background:
                        selectedDelivery === d
                          ? DELIVERY_COLORS[d]
                          : "rgba(255,255,255,0.08)",
                      color: "#fff",
                      border: `1px solid ${
                        selectedDelivery === d
                          ? DELIVERY_COLORS[d]
                          : "rgba(255,255,255,0.15)"
                      }`,
                    }}
                  >
                    {DELIVERY_LABELS[d]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Over balls */}
          <div className="flex items-center justify-center gap-2 mb-3">
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
                              : "bg-white/10 border-white/30 text-white"
                    }`}
                  >
                    {label}
                  </div>
                );
              },
            )}
          </div>

          {/* Touch buttons */}
          {playerBats && !isGameOver && gameState.phase === "bowling" && (
            <div className="flex justify-center gap-3 mb-1">
              {(
                [
                  { key: "left" as ArrowKey, label: "◀ LEG", color: "#1d4ed8" },
                  { key: "up" as ArrowKey, label: "▲ LOFT", color: "#7C3AED" },
                  {
                    key: "right" as ArrowKey,
                    label: "OFF ▶",
                    color: "#059669",
                  },
                ] as { key: ArrowKey; label: string; color: string }[]
              ).map(({ key, label, color }) => (
                <button
                  type="button"
                  key={key}
                  onPointerDown={() => registerArrowKey(key)}
                  className="px-4 py-2.5 rounded-xl text-white text-xs font-black active:scale-95 transition-transform"
                  style={{ background: color, minWidth: 72 }}
                  data-ocid="game.button"
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {!playerBats && gameState.phase === "waiting" && !isGameOver && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={triggerBowl}
                className="px-8 py-2.5 rounded-xl text-white font-black text-sm"
                style={{
                  background: "linear-gradient(135deg,#7C3AED,#5B21B6)",
                }}
                data-ocid="game.primary_button"
              >
                🎳 BOWL (SPACE)
              </button>
            </div>
          )}

          {/* PowerPlay indicator */}
          {isPowerPlay && (
            <div className="flex justify-center mt-2">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  background: "rgba(234,179,8,0.15)",
                  color: "#fbbf24",
                  border: "1px solid rgba(234,179,8,0.3)",
                }}
              >
                ⚡ POWERPLAY
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
