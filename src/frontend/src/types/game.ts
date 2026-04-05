export type ArrowKey = "left" | "right" | "up";

export type BallOutcome = {
  runs: number;
  isWicket: boolean;
  commentary: string;
};

export type BallResult = {
  runs: number;
  isWicket: boolean;
};

/** -1 = swings left, 0 = straight, 1 = swings right */
export type BallDrift = -1 | 0 | 1;

export type Difficulty = "easy" | "medium" | "hard";

/**
 * bowling  = ball in flight, player can hit
 * waiting  = waiting for SPACE to bowl
 * animating = legacy alias kept for compatibility
 * result  = brief outcome flash
 * over    = game over
 */
export type GamePhase = "waiting" | "bowling" | "animating" | "result" | "over";

export type GameState = {
  runs: number;
  wickets: number;
  ballsBowled: number;
  overBalls: BallResult[];
  phase: GamePhase;
  lastOutcome: BallOutcome | null;
  commentary: string;
  boundaries: number;
  sixes: number;
  fours: number;
  highestScore: number;
  partnershipRuns: number;
  partnershipBalls: number;
  milestoneShown: number;
  overHistory: BallResult[][];
  dots: number;
  difficulty: Difficulty;
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  score: number;
  country: string;
};
