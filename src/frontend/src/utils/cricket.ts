import type {
  ArrowKey,
  BallDrift,
  BallOutcome,
  Difficulty,
  ShotType,
} from "../types/game";

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

function applyDifficultyWeights(
  weights: OutcomeWeights,
  difficulty: Difficulty,
): OutcomeWeights {
  if (difficulty === "easy") {
    return {
      wicket: weights.wicket * 0.6,
      dot: weights.dot,
      one: weights.one,
      two: weights.two,
      four: weights.four * 1.2,
      six: weights.six * 1.2,
    };
  }
  if (difficulty === "hard") {
    return {
      wicket: weights.wicket * 1.4,
      dot: weights.dot,
      one: weights.one,
      two: weights.two,
      four: weights.four * 0.8,
      six: weights.six * 0.8,
    };
  }
  return weights;
}

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

export const DIRECTIONAL_COMMENTARY: Record<string, string[]> = {
  good_left: [
    "Reads the swing perfectly — pulled through leg for FOUR!",
    "Excellent read — sweeps it fine, timing is immaculate!",
    "Saw the in-swinger early, flicks it stylishly!",
    "THUMPED through mid-wicket! Absolutely smoked!",
    "Down the ground on the leg side — beautiful placement!",
    "Masterful glance through fine leg — stroked to the boundary!",
    "Reads the drift and works it perfectly square — magnificent!",
    "Low full toss, whipped off the pads with authority — FOUR!",
    "Helicopter stance, whips it to long-on for a maximum!",
    "Classic Dhoni flick — wrists of steel, boundary all day!",
    "Inside out to the leg side — cheeky and brilliant!",
    "Flick over fine leg — audacious, top-class batsmanship!",
    "Behind square, races away — they won't catch that!",
    "Tucked behind square for a cheeky single — smart running!",
    "Paddle scoop down to fine leg, perfectly executed!",
  ],
  good_right: [
    "Down the track, drives hard through extra cover — FOUR!",
    "Width outside off, crashes it through point — FOUR!",
    "Beautiful drive, off-side boundary!",
    "CRACKED through the covers! Textbook drive!",
    "Extra cover drive — a thing of sheer beauty!",
    "Advances and lofts over the off side — superb!",
    "Cuts ferociously through point — nobody stopping that!",
    "Stands tall and cracks it through the covers, FOUR!",
    "Late cut for four — pure class behind point!",
    "Punched hard through mid-off — timed to perfection!",
    "Off-drive executed flawlessly, hugs the ground all the way!",
    "Back-cut over gully — pure improvisation, FOUR!",
    "Slaps it through extra cover — what a shot!",
    "Opens the face, steers it to third man — clever!",
    "Straight drive down the pitch — pure white-ball cricket!",
  ],
  loft: [
    "Goes aerial — big swing of the bat!",
    "Launches it into the stands! Big hit!",
    "Takes on the long boundary — high, handsome shot!",
    "MASSIVE maximum! That's into the upper tier!",
    "Gets under it and tonks it sky high — SIX!",
    "Goes big from ball one — helicopter finish style!",
    "Dances down and lofts — crowd goes WILD!",
    "Clears long-on with room to spare — monster hit!",
    "Into the stands for the second time this over!",
    "Picks the length early, dispatches it to the boundary!",
  ],
  miss_timed: [
    "Late on the shot — thick outside edge!",
    "Beat by the delivery, plays down the wrong line.",
    "Mistimed completely, straight to the fielder.",
    "Got a leading edge — lucky not to be out!",
    "Plays across the line — doesn't get the connection!",
    "Footwork all wrong, miscued through the off side.",
    "Plays at it loosely, thick inside edge saves the day.",
    "Doesn't read the swing, ends up defending thin air!",
    "Horrible footwork, played all over the place.",
    "Gets an outside edge — creeps to third man for nothing.",
  ],
  missed_ball: [
    "Completely misses the ball! Bat swings through air!",
    "Doesn't pick up the swing in time — plays no shot.",
    "Ball zips past, player frozen!",
    "Shouldered arms but the ball was on the stumps — dangerous!",
    "Left alone — but was that the right call? Very close!",
    "Swings and misses completely — lucky the ball went wide!",
    "Beaten for pace — the ball went through like a ghost!",
    "Couldn't pick the variation — plays and misses!",
    "Lets it go — umpire shakes his head but doesn't raise the finger!",
    "Total confusion — doesn't know whether to play or leave!",
  ],
  wicket: [
    "Bowled through the gate! The stumps are cartwheeling!",
    "Top-edged, simple catch for the fielder — OUT!",
    "Caught on the boundary — miscued badly, OUT!",
    "Plumb in front! LBW, finger goes up!",
    "GONE! Clean bowled, timber flying everywhere!",
    "Edged to the keeper — big wicket, massive breakthrough!",
    "Caught at mid-wicket — what a taken, OUT!",
    "Run out! Didn't bother — what a direct hit!",
    "Stumped! Dragged out of the crease — sharp keeping!",
    "Caught behind — nicked it, the keeper takes it low!",
    "Hit wicket! Oh no — backs into his stumps, OUT!",
    "Caught in the deep — went for the big one too early!",
  ],
  dot: [
    "Safe, no run.",
    "Dot ball, good defensive prod.",
    "Blocked back down the pitch.",
    "Keeps out a good one — no damage done.",
    "Played with soft hands, rolls to the fielder.",
    "Full of length, pushed to mid-on — fielded.",
    "Good delivery, batsman can only keep it out.",
    "Back foot defense — watchful cricket.",
    "Excellent line and length — dot ball.",
    "Batsman gets behind it — no scoring opportunity.",
    "Defended solidly — building the pressure.",
    "Well bowled! The batsman had no scoring option there.",
  ],
  one: [
    "Quick single through mid-wicket.",
    "Tucked away for one.",
    "Rotates the strike, one run.",
    "Pushed to mid-on, takes a quick single.",
    "Tucked behind square for a cheeky single — smart cricket!",
    "Placed into the gap, easy single taken.",
    "Calls the non-striker through — clever running!",
    "Worked to fine leg, scrambles a single.",
    "Drops it short of mid-off and scurries for one.",
    "Pinched a single — keeps the scoreboard ticking!",
    "Smart running between the wickets — one added.",
    "Just a single — keeps the momentum going.",
  ],
  two: [
    "Good running, two runs!",
    "Placed well, they scamper back for two!",
    "Punched to the sweeper, comfortable two.",
    "Wide of mid-wicket, they run two with ease!",
    "Pushed into the gap at extra cover, turns it into two!",
    "Works it to fine leg, sprints back for the second!",
    "Drives to long-off, good running makes it two!",
    "Hard hands, ball races away — they take two!",
    "Clever placement, catches the gap, two runs scored.",
    "Dabs it to third man and turns back — two!",
  ],
  four: [
    "Races away to the boundary — FOUR!",
    "Splits the gap perfectly — FOUR!",
    "Timed to perfection, FOUR!",
    "THUMPED through mid-wicket! That's four!",
    "Smashes it through the covers — FOUR, no stopping that!",
    "Crunches it through point — boundary!",
    "Plays a gorgeous late cut — FOUR past backward point!",
    "Hits straight as an arrow, reaches the rope — FOUR!",
    "Whips it through mid-wicket, boundary all the way!",
    "Gets forward and drives magnificently — FOUR!",
    "Back of a length, pulls it hard through square leg — FOUR!",
    "Stands and delivers — crashes it to the fence!",
    "Flicks it off the pads and it races away — FOUR!",
    "Plays a square drive, races past the fielder — FOUR!",
    "Cracking shot through extra cover — FOUR!",
  ],
  six: [
    "Maximum! SIX over mid-on!",
    "Into the crowd! SIX!",
    "Absolutely launched it — SIX!",
    "MASSIVE MAXIMUM! That's into the upper tier!",
    "Helicoptered over long-on! SIX and the crowd erupts!",
    "Cleared the rope with feet to spare — TREMENDOUS SIX!",
    "Takes a knee and paddles it for SIX over fine leg!",
    "Dances down, lifts it over the bowler's head — SIX!",
    "Ramps it over the keeper — outrageous SIX!",
    "Tonks it out of the ground — this one's in orbit! SIX!",
    "Straight back over the bowler — SIX! What authority!",
    "Heave over midwicket — gone! Crowd goes absolutely wild!",
    "Gets under it and sends it MILES into the stands! SIX!",
    "Picks the length early, unleashes — MONSTROUS SIX!",
    "Smashed over cow corner — MAXIMUM! That's six!",
  ],
};

export const MILESTONE_COMMENTARY: Record<50 | 100 | 150, string[]> = {
  50: [
    "A brilliant fifty! The crowd stands to applaud this fine innings!",
    "Half century up! Some remarkable batting on display here!",
    "Fifty runs on the board — building a great platform!",
  ],
  100: [
    "CENTURY! The batsman raises the bat to a thunderous ovation!",
    "One hundred runs! A magnificent century — the crowd is on its feet!",
    "A hundred up! This is some of the finest batting we've seen today!",
  ],
  150: [
    "150 runs! This chase is on track — absolutely extraordinary batting!",
    "A hundred and fifty! Incredible — can they go all the way?",
    "150 on the board — the target is well within reach now!",
  ],
};

export const powerPlayCommentary: string[] = [
  "Powerplay is on! Only 2 fielders outside the ring — the gaps are there!",
  "Powerplay restrictions in effect — excellent opportunity to put on runs!",
  "Field restrictions make batting easier in the Powerplay — go for it!",
  "These first 6 overs are gold — use the Powerplay to build the foundation!",
  "Free-hitting territory! Fielders are restricted in the Powerplay circle!",
];

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
 * Directional shot resolver with difficulty awareness.
 * arrowKey: which arrow the player pressed, or null if they missed entirely.
 * ballDrift: -1 swings left, 0 straight, 1 swings right.
 * difficulty: affects wicket/boundary weights.
 */
export function resolveDirectionalShot(
  arrowKey: ArrowKey | null,
  ballDrift: BallDrift,
  difficulty: Difficulty = "medium",
): BallOutcome {
  // Missed entirely — high wicket risk
  if (arrowKey === null) {
    const baseWeights = applyDifficultyWeights(DIRECTIONAL_MISS, difficulty);
    const outcome = pickWithWeights(baseWeights);
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
    const baseWeights =
      ballDrift !== 0 ? DIRECTIONAL_LOFT_MISMATCH : DIRECTIONAL_LOFT;
    const weights = applyDifficultyWeights(baseWeights, difficulty);
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

  const baseWeights = isPerfectMatch
    ? DIRECTIONAL_GOOD
    : isGoodMatch
      ? DIRECTIONAL_BASE
      : DIRECTIONAL_MISS;

  const weights = applyDifficultyWeights(baseWeights, difficulty);
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
