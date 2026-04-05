import { useState } from "react";
import CricketGame from "./components/CricketGame";
import LandingPage from "./components/LandingPage";
import type { Difficulty } from "./types/game";

export type GameMode = "t20" | "super-over" | "quick";

export type AppScreen = "landing" | "game";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("landing");
  const [gameMode, setGameMode] = useState<GameMode>("t20");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [t20Target] = useState<number>(
    () => Math.floor(Math.random() * 21) + 120,
  );
  const [superOverTarget] = useState<number>(
    () => Math.floor(Math.random() * 5) + 8,
  );
  const [quickTarget] = useState<number>(
    () => Math.floor(Math.random() * 11) + 25,
  );

  const getConfig = (mode: GameMode) => {
    if (mode === "t20") return { target: t20Target, balls: 120 };
    if (mode === "super-over") return { target: superOverTarget, balls: 6 };
    return { target: quickTarget, balls: 18 };
  };

  const handlePlay = (mode: GameMode = "t20", diff?: Difficulty) => {
    setGameMode(mode);
    if (diff) setDifficulty(diff);
    setScreen("game");
  };

  const handleBackToLanding = () => {
    setScreen("landing");
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {screen === "landing" ? (
        <LandingPage onPlay={handlePlay} difficulty={difficulty} />
      ) : (
        <CricketGame
          config={getConfig(gameMode)}
          gameMode={gameMode}
          onBack={handleBackToLanding}
          difficulty={difficulty}
        />
      )}
    </div>
  );
}
