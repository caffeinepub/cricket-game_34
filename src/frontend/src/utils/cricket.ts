import type { ArrowKey, BallDrift, BallOutcome, ShotType } from "../types/game";

type OutcomeWeights = {
  wicket: number;
  dot: number;
  one: number;
  two: number;
  four: number;
  six: number;
};

const SHOT_WEIGHTS: Record<ShotType, OutcomeWeights> = {
  defend: { wicket: 3, dot: 45, one: 35, two: 12, four: 4, six: 1 },
  drive: { wicket: 10, dot: 20, one: 25, two: 20, four: 20, six: 5 },
  pull: { wicket: 15, dot: 15, one: 15, two: 10, four: 25, six: 20 },
  sweep: { wicket: 12, dot: 18, one: 22, two: 20, four: 22, six: 6 },
  loft: { wicket: 22, dot: 10, one: 10, two: 5, four: 15, six: 38 },
};

// ─── Directional Shot Weights ────────────────────────────────────────────────

/** Base weights for each arrow direction when matched vs mismatched vs loft */
const DIRECTIONAL_BASE: OutcomeWeights = {
  wicket: 10,
  dot: 20,
  one: 25,
  two: 20,
  four: 18,
  six: 7,
};

const DIRECTIONAL_GOOD: OutcomeWeights = {
  wicket: 6,
  dot: 14,
  one: 22,
  two: 22,
  four: 26,
  six: 10,
};

const DIRECTIONAL_MISS: OutcomeWeights = {
  wicket: 30,
  dot: 38,
  one: 15,
  two: 8,
  four: 7,
  six: 2,
};

const DIRECTIONAL_LOFT: OutcomeWeights = {
  wicket: 22,
  dot: 8,
  one: 8,
  two: 5,
  four: 16,
  six: 41,
};

const DIRECTIONAL_LOFT_MISMATCH: OutcomeWeights = {
  wicket: 28,
  dot: 12,
  one: 10,
  two: 5,
  four: 15,
  six: 30,
};

// ─── Commentary ──────────────────────────────────────────────────────────────

const COMMENTARY: Record<ShotType, Record<string, string[]>> = {
  defend: {
    wicket: [
      "Clean bowled! The stumps are shattered!",
      "Edge to slip! What a delivery, beat the outside edge!",
      "Plumb LBW! Never in doubt, finger goes up!",
    ],
    dot: [
      "Tidy defensive shot. Good bat-pad gap.",
      "Solid block back to the bowler.",
      "Played defensively, no run.",
    ],
    one: ["Nudged behind square for a single.", "Pushed into the gap for one."],
    two: [
      "Defended into the covers, they run two!",
      "Good placement, two runs.",
    ],
    four: [
      "Pushed through covers, races away for FOUR!",
      "Defensive push, finds the gap — FOUR!",
    ],
    six: ["Mis-hit somehow goes over the in-field for SIX! Unbelievable!"],
  },
  drive: {
    wicket: [
      "Edge to the keeper! Driving at a wide one!",
      "Caught at mid-off! Mis-timed the drive.",
      "Bowled through the gate! Driving on the up.",
    ],
    dot: [
      "Driven straight to mid-off. No run.",
      "Back to the bowler, well fielded.",
    ],
    one: [
      "Driven for a single through covers.",
      "Pushed for one through the off side.",
    ],
    two: ["Driven powerfully, they get back for two!", "Cover drive for two!"],
    four: [
      "Width outside off, driven straight for FOUR!",
      "Textbook cover drive — FOUR! The crowd roars!",
      "Driven down the ground, beautiful timing — FOUR!",
    ],
    six: [
      "SMASHED! That's gone into orbit over long-on! SIX!",
      "Monster drive! Clears the rope easily — SIX!",
    ],
  },
  pull: {
    wicket: [
      "Top edge! Goes high and taken at fine leg!",
      "Hit it right out of the middle straight to deep square leg!",
      "Caught on the boundary attempting the pull!",
    ],
    dot: [
      "Dropped short, but can't get it away. Dot ball.",
      "Pulled straight to the fielder.",
    ],
    one: [
      "Pulled for a quick single.",
      "Short ball, swivels and pulls for one.",
    ],
    two: ["Pulled hard, deep square leg can't stop it — two!"],
    four: [
      "Dropped short, pulled away for FOUR!",
      "Rocks back and pulls — FOUR through mid-wicket!",
      "Short and wide, crunched through square leg — FOUR!",
    ],
    six: [
      "Pulled with immense power — SMASHED for SIX over mid-wicket!",
      "Long hop, dismissed it over the rope — SIX!",
      "Upper cut for SIX over third man! What a shot!",
    ],
  },
  sweep: {
    wicket: [
      "Misses the sweep, bowled around the legs!",
      "Top-edged sweep, taken by fine leg!",
      "Sweeps straight to square leg.",
    ],
    dot: [
      "Sweeps straight to the fielder. Dot.",
      "Good delivery, sweep kept out.",
    ],
    one: ["Swept for a single behind square.", "Sweep shot, only one run."],
    two: ["Swept fine, they run two!", "Paddle sweep for two."],
    four: [
      "Swept perfectly fine of square — FOUR!",
      "Reverse sweep through the off side — FOUR! Outfoxed the field!",
    ],
    six: [
      "Scoop over fine leg — SIX! Audacious cricket!",
      "Maximum sweep over backward square — SIX!",
    ],
  },
  loft: {
    wicket: [
      "Caught at long-on! Mis-timed the loft badly!",
      "Straight to mid-off on the boundary — wicket!",
      "Skied it to the fielder at long-on! Simple catch.",
    ],
    dot: ["Lofted straight to the fielder inside the rope. Dot."],
    one: ["Lofted over covers, lands in the gap — one run."],
    two: ["Lofted into the gap, quick running for two."],
    four: [
      "Lofted over the in-field, bounces safely — FOUR!",
      "Hit high and handsome, just clears the in-field — FOUR!",
    ],
    six: [
      "MASSIVE! CLEARED THE ROPE BY MILES — SIX!",
      "Launched into the second tier! SIX and they love it!",
      "This one's in the car park! Enormous SIX!",
      "That's out of the stadium — SIX! The crowd goes wild!",
    ],
  },
};

const DIRECTIONAL_COMMENTARY: Record<string, string[]> = {
  good_left: [
    "Reads the swing perfectly — pulled through leg for FOUR!",
    "Excellent read — sweeps it fine, timing is immaculate!",
    "Saw the in-swinger early, flicks it stylishly!",
  ],
  good_right: [
    "Down the track, drives hard through extra cover — FOUR!",
    "Width outside off, crashes it through point — FOUR!",
    "Beautiful drive, off-side boundary!",
  ],
  loft: [
    "Goes aerial — big swing of the bat!",
    "Launches it into the stands! Big hit!",
    "Takes on the long boundary — high, handsome shot!",
  ],
  miss_timed: [
    "Late on the shot — thick outside edge!",
    "Beat by the delivery, plays down the wrong line.",
    "Mistimed completely, straight to the fielder.",
  ],
  missed_ball: [
    "Completely misses the ball! Bat swings through air!",
    "Doesn't pick up the swing in time — plays no shot.",
    "Ball zips past, player frozen!",
  ],
  wicket: [
    "Bowled through the gate! The stumps are cartwheeling!",
    "Top-edged, simple catch for the fielder — OUT!",
    "Caught on the boundary — miscued badly, OUT!",
    "Plumb in front! LBW, finger goes up!",
  ],
  dot: [
    "Safe, no run.",
    "Dot ball, good defensive prod.",
    "Blocked back down the pitch.",
  ],
  one: [
    "Quick single through mid-wicket.",
    "Tucked away for one.",
    "Rotates the strike, one run.",
  ],
  two: ["Good running, two runs!", "Placed well, they scamper back for two!"],
  four: [
    "Races away to the boundary — FOUR!",
    "Splits the gap perfectly — FOUR!",
    "Timed to perfection, FOUR!",
  ],
  six: [
    "Maximum! SIX over mid-on!",
    "Into the crowd! SIX!",
    "Absolutely launched it — SIX!",
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pickWithWeights(weights: OutcomeWeights): keyof OutcomeWeights {
  const total =
    weights.wicket +
    weights.dot +
    weights.one +
    weights.two +
    weights.four +
    weights.six;
  let rand = Math.random() * total;
  rand -= weights.wicket;
  if (rand < 0) return "wicket";
  rand -= weights.dot;
  if (rand < 0) return "dot";
  rand -= weights.one;
  if (rand < 0) return "one";
  rand -= weights.two;
  if (rand < 0) return "two";
  rand -= weights.four;
  if (rand < 0) return "four";
  return "six";
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function resolveShotOutcome(shot: ShotType): BallOutcome {
  const weights = SHOT_WEIGHTS[shot];
  const outcome = pickWithWeights(weights);
  const commentarySet = COMMENTARY[shot][outcome];
  const commentary = pickRandom(commentarySet);

  const runsMap: Record<string, number> = {
    wicket: 0,
    dot: 0,
    one: 1,
    two: 2,
    four: 4,
    six: 6,
  };

  return {
    runs: runsMap[outcome],
    isWicket: outcome === "wicket",
    commentary,
  };
}

/**
 * New directional shot resolver.
 * arrowKey: which arrow the player pressed, or null if they missed entirely.
 * ballDrift: -1 swings left, 0 straight, 1 swings right.
 */
export function resolveDirectionalShot(
  arrowKey: ArrowKey | null,
  ballDrift: BallDrift,
): BallOutcome {
  // Missed entirely — high wicket risk
  if (arrowKey === null) {
    const outcome = pickWithWeights(DIRECTIONAL_MISS);
    const runsMap: Record<string, number> = {
      wicket: 0,
      dot: 0,
      one: 1,
      two: 2,
      four: 4,
      six: 6,
    };
    const commentaryKey = outcome === "wicket" ? "wicket" : "missed_ball";
    const lines =
      DIRECTIONAL_COMMENTARY[commentaryKey] ?? DIRECTIONAL_COMMENTARY.dot;
    return {
      runs: runsMap[outcome],
      isWicket: outcome === "wicket",
      commentary: pickRandom(lines),
    };
  }

  // Loft shot — always aerial weights
  if (arrowKey === "up") {
    const weights =
      ballDrift !== 0 ? DIRECTIONAL_LOFT_MISMATCH : DIRECTIONAL_LOFT;
    const outcome = pickWithWeights(weights);
    const runsMap: Record<string, number> = {
      wicket: 0,
      dot: 0,
      one: 1,
      two: 2,
      four: 4,
      six: 6,
    };
    const lines = DIRECTIONAL_COMMENTARY.loft ?? DIRECTIONAL_COMMENTARY.dot;
    const outcomeLines =
      outcome === "wicket" ? DIRECTIONAL_COMMENTARY.wicket : lines;
    return {
      runs: runsMap[outcome],
      isWicket: outcome === "wicket",
      commentary: pickRandom(outcomeLines),
    };
  }

  // Check if direction matches ball drift
  const isGoodMatch =
    (arrowKey === "left" && ballDrift === -1) ||
    (arrowKey === "right" && ballDrift === 1) ||
    (arrowKey === "left" && ballDrift === 0) ||
    (arrowKey === "right" && ballDrift === 0);

  const isPerfectMatch =
    (arrowKey === "left" && ballDrift === -1) ||
    (arrowKey === "right" && ballDrift === 1);

  const weights = isPerfectMatch
    ? DIRECTIONAL_GOOD
    : isGoodMatch
      ? DIRECTIONAL_BASE
      : DIRECTIONAL_MISS;

  const outcome = pickWithWeights(weights);
  const runsMap: Record<string, number> = {
    wicket: 0,
    dot: 0,
    one: 1,
    two: 2,
    four: 4,
    six: 6,
  };

  // Pick commentary based on outcome and match quality
  let commentaryKey: string;
  if (outcome === "wicket") {
    commentaryKey = "wicket";
  } else if (outcome === "dot") {
    commentaryKey = isGoodMatch ? "dot" : "miss_timed";
  } else if (isPerfectMatch && (outcome === "four" || outcome === "six")) {
    commentaryKey = arrowKey === "left" ? "good_left" : "good_right";
  } else {
    commentaryKey = outcome;
  }

  const lines =
    DIRECTIONAL_COMMENTARY[commentaryKey] ?? DIRECTIONAL_COMMENTARY.dot;

  return {
    runs: runsMap[outcome],
    isWicket: outcome === "wicket",
    commentary: pickRandom(lines),
  };
}

export function formatOvers(balls: number): string {
  const overs = Math.floor(balls / 6);
  const rem = balls % 6;
  return `${overs}.${rem}`;
}

export function calcRunRate(runs: number, balls: number): string {
  if (balls === 0) return "0.00";
  return ((runs / balls) * 6).toFixed(2);
}

export function ballResultLabel(run: number, isWicket: boolean): string {
  if (isWicket) return "W";
  if (run === 0) return "•";
  if (run === 4) return "4";
  if (run === 6) return "6";
  return String(run);
}
