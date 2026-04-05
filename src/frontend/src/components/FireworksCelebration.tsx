import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  radius: number;
  decay: number;
  gravity: number;
  type: "spark" | "confetti";
  rotation: number;
  rotationSpeed: number;
  width: number;
  height: number;
}

interface FireworkShell {
  x: number;
  y: number;
  vy: number;
  color: string;
  exploded: boolean;
  alpha: number;
}

interface Props {
  milestone: 50 | 100 | 150 | null;
  onDone?: () => void;
}

const FIFTY_COLORS = [
  "#22c55e",
  "#4ade80",
  "#86efac",
  "#fbbf24",
  "#ffffff",
  "#a3e635",
];
const CENTURY_COLORS = [
  "#f59e0b",
  "#fbbf24",
  "#fde68a",
  "#ef4444",
  "#ffffff",
  "#fb923c",
  "#c084fc",
];
const MILESTONE_COLORS: Record<50 | 100 | 150, string[]> = {
  50: FIFTY_COLORS,
  100: CENTURY_COLORS,
  150: ["#a855f7", "#e879f9", "#818cf8", "#f472b6", "#ffffff", "#67e8f9"],
};

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export default function FireworksCelebration({ milestone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shellsRef = useRef<FireworkShell[]>([]);
  const rafRef = useRef<number | null>(null);
  const launchTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!milestone) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const colors = MILESTONE_COLORS[milestone];
    const isCentury = milestone >= 100;
    particlesRef.current = [];
    shellsRef.current = [];

    // Burst count based on milestone
    const burstCount = isCentury ? 5 : 3;
    const particlesPerBurst = isCentury ? 120 : 80;

    function explodeAt(ex: number, ey: number) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < particlesPerBurst; i++) {
        const angle =
          (Math.PI * 2 * i) / particlesPerBurst + randomBetween(-0.1, 0.1);
        const speed = randomBetween(isCentury ? 3 : 2, isCentury ? 8 : 6);
        const c2 = colors[Math.floor(Math.random() * colors.length)];
        const isConfetti = Math.random() < 0.35;
        particlesRef.current.push({
          x: ex,
          y: ey,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: isConfetti ? c2 : color,
          alpha: 1,
          radius: randomBetween(2, 5),
          decay: randomBetween(0.012, 0.022),
          gravity: randomBetween(0.08, 0.18),
          type: isConfetti ? "confetti" : "spark",
          rotation: randomBetween(0, Math.PI * 2),
          rotationSpeed: randomBetween(-0.2, 0.2),
          width: randomBetween(6, 14),
          height: randomBetween(3, 7),
        });
      }
    }

    // Initial synchronized bursts
    for (let i = 0; i < burstCount; i++) {
      const ex = randomBetween(W * 0.2, W * 0.8);
      const ey = randomBetween(H * 0.1, H * 0.45);
      setTimeout(() => explodeAt(ex, ey), i * 180);
    }

    // Continuous launches
    let launchCount = 0;
    const maxLaunches = isCentury ? 12 : 7;
    launchTimerRef.current = setInterval(() => {
      if (launchCount >= maxLaunches) {
        clearInterval(launchTimerRef.current!);
        return;
      }
      launchCount++;
      const ex = randomBetween(W * 0.15, W * 0.85);
      const ey = randomBetween(H * 0.08, H * 0.4);
      explodeAt(ex, ey);
    }, 350);

    function animate() {
      ctx!.clearRect(0, 0, W, H);

      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.02);

      for (const p of particlesRef.current) {
        ctx!.save();
        ctx!.globalAlpha = p.alpha;
        if (p.type === "confetti") {
          ctx!.translate(p.x, p.y);
          ctx!.rotate(p.rotation);
          ctx!.fillStyle = p.color;
          ctx!.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        } else {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx!.fillStyle = p.color;
          ctx!.shadowColor = p.color;
          ctx!.shadowBlur = 6;
          ctx!.fill();
        }
        ctx!.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.alpha -= p.decay;
        p.rotation += p.rotationSpeed;
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (launchTimerRef.current) clearInterval(launchTimerRef.current);
    };
  }, [milestone]);

  if (!milestone) return null;

  const isCentury = milestone >= 100;
  const bannerLabel =
    milestone === 50
      ? "HALF CENTURY!"
      : milestone === 100
        ? "CENTURY!"
        : "150 UP!";

  const bannerEmoji = milestone === 50 ? "🏏" : milestone === 100 ? "🏆" : "🔥";

  const bannerGradient =
    milestone === 50
      ? "linear-gradient(135deg, #15803d 0%, #16a34a 50%, #4ade80 100%)"
      : milestone === 100
        ? "linear-gradient(135deg, #92400e 0%, #b45309 30%, #d97706 60%, #fbbf24 100%)"
        : "linear-gradient(135deg, #6d28d9 0%, #7c3aed 40%, #a855f7 70%, #e879f9 100%)";

  const glowColor =
    milestone === 50 ? "#22c55e" : milestone === 100 ? "#fbbf24" : "#a855f7";

  const subtext =
    milestone === 50
      ? "FIFTY RUNS! BRILLIANT BATTING!"
      : milestone === 100
        ? "MAGNIFICENT CENTURY! WHAT A KNOCK!"
        : "150 RUNS! UNSTOPPABLE!";

  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Fireworks canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        width={600}
        height={500}
      />

      {/* Dark overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isCentury ? 0.55 : 0.4 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,1)", mixBlendMode: "multiply" }}
      />

      {/* Main celebration banner */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        {/* Giant emoji bounce */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{
            scale: [0, 1.4, 1.1, 1.25, 1.1],
            rotate: [-20, 10, -8, 5, 0],
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-7xl select-none"
          style={{ filter: `drop-shadow(0 0 20px ${glowColor})` }}
        >
          {bannerEmoji}
        </motion.div>

        {/* Score label */}
        <motion.div
          initial={{ y: 60, opacity: 0, scale: 0.6 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 280,
            damping: 18,
          }}
          className="relative"
        >
          <div
            className="rounded-3xl px-10 py-5 text-center shadow-2xl"
            style={{
              background: bannerGradient,
              boxShadow: `0 0 60px ${glowColor}88, 0 8px 32px rgba(0,0,0,0.6)`,
              border: `2px solid ${glowColor}66`,
            }}
          >
            <motion.p
              animate={{ scale: [1, 1.06, 1, 1.06, 1] }}
              transition={{ duration: 1.2, repeat: 2 }}
              className="text-white font-black tracking-widest drop-shadow-lg"
              style={{ fontSize: isCentury ? "3rem" : "2.4rem", lineHeight: 1 }}
            >
              {bannerLabel}
            </motion.p>
            <p className="text-white/80 text-sm font-bold tracking-wider mt-2">
              {subtext}
            </p>
          </div>
        </motion.div>

        {/* Milestone number badge */}
        {isCentury && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center justify-center rounded-full border-4"
            style={{
              width: 80,
              height: 80,
              background: "rgba(0,0,0,0.5)",
              borderColor: glowColor,
              boxShadow: `0 0 30px ${glowColor}`,
            }}
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="text-3xl font-black"
              style={{ color: glowColor }}
            >
              {milestone}
            </motion.span>
          </motion.div>
        )}

        {/* Star burst rings (century only) */}
        {isCentury &&
          [0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.3, opacity: 0.8 }}
              animate={{ scale: 3 + i, opacity: 0 }}
              transition={{
                delay: 0.1 + i * 0.15,
                duration: 1.0,
                ease: "easeOut",
              }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 100,
                height: 100,
                border: `3px solid ${glowColor}`,
                top: "50%",
                left: "50%",
                marginTop: -50,
                marginLeft: -50,
              }}
            />
          ))}
      </div>
    </div>
  );
}
