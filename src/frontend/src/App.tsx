import { useState } from "react";
import CricketGame from "./components/CricketGame";
import LandingPage from "./components/LandingPage";

export type GameMode = "t20" | "super-over" | "quick";

export type AppScreen = "landing" | "game";

const GAME_CONFIGS: Record<GameMode, { target: number; balls: number }> = {
  // T20 = 20 overs (120 balls), realistic target ~165
  t20: { target: 165, balls: 120 },
  // Super Over = 1 over (6 balls), target 20
  "super-over": { target: 20, balls: 6 },
  // Quick Match = 3 overs (18 balls), target 50
  quick: { target: 50, balls: 18 },
};

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("landing");
  const [gameMode, setGameMode] = useState<GameMode>("t20");

  const handlePlay = (mode: GameMode = "t20") => {
    setGameMode(mode);
    setScreen("game");
  };

  const handleBackToLanding = () => {
    setScreen("landing");
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {screen === "landing" ? (
        <LandingPage onPlay={handlePlay} />
      ) : (
        <CricketGame
          config={GAME_CONFIGS[gameMode]}
          gameMode={gameMode}
          onBack={handleBackToLanding}
        />
      )}
    </div>
  );
}
