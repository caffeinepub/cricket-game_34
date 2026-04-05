import { useCallback, useState } from "react";
import CricketGame from "./components/CricketGame";
import IPLAuction from "./components/IPLAuction";
import LandingPage from "./components/LandingPage";
import ModeSelector from "./components/ModeSelector";
import type { MainMode } from "./components/ModeSelector";
import PlayerSelect from "./components/PlayerSelect";
import type { SelectedLineup } from "./components/PlayerSelect";
import PracticeNets from "./components/PracticeNets";
import TeamSelect from "./components/TeamSelect";
import TossScreen from "./components/TossScreen";
import WalkOnAnimation from "./components/WalkOnAnimation";
import { INTERNATIONAL_TEAMS, IPL_TEAMS } from "./data/teams";
import type { IPLTeam, InternationalTeam } from "./data/teams";
import type { Difficulty } from "./types/game";

export type GameMode = "t20" | "super-over" | "quick";

type AppScreen =
  | "landing"
  | "mode-select"
  | "team-select"
  | "player-select"
  | "toss"
  | "walk-on"
  | "game"
  | "practice"
  | "auction";

const IPL_MATCH_KEY = "cricketBlast_iplMatchCount";

function getIplMatchCount(): number {
  return Number.parseInt(localStorage.getItem(IPL_MATCH_KEY) || "0", 10);
}
function incrementIplMatchCount(): number {
  const n = getIplMatchCount() + 1;
  localStorage.setItem(IPL_MATCH_KEY, String(n));
  return n;
}

function generateTarget(): number {
  return Math.floor(Math.random() * 21) + 120;
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("landing");
  const [mainMode, setMainMode] = useState<MainMode>("ipl");
  const [selectedTeam, setSelectedTeam] = useState<
    IPLTeam | InternationalTeam | null
  >(null);
  const [opposingTeam, setOpposingTeam] = useState<
    IPLTeam | InternationalTeam | null
  >(null);
  const [lineup, setLineup] = useState<SelectedLineup | null>(null);
  const [batFirst, setBatFirst] = useState(true);
  const [gameMode] = useState<GameMode>("t20");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [target, setTarget] = useState<number>(generateTarget);

  const config = { target, balls: 120 };

  const handleModeSelect = (mode: MainMode) => {
    setMainMode(mode);
    if (mode === "practice") {
      setScreen("practice");
    } else {
      setScreen("team-select");
    }
  };

  const handleTeamSelect = (team: IPLTeam | InternationalTeam) => {
    setSelectedTeam(team);
    // Assign a random opposing team from the same pool
    const pool = mainMode === "ipl" ? IPL_TEAMS : INTERNATIONAL_TEAMS;
    const others = pool.filter((t) => t.id !== team.id);
    const opponent =
      others[Math.floor(Math.random() * others.length)] ?? others[0] ?? null;
    setOpposingTeam(opponent);
    setScreen("player-select");
  };

  const handleLineupConfirm = (l: SelectedLineup) => {
    setLineup(l);
    setScreen("toss");
  };

  const handleTossComplete = (didBatFirst: boolean) => {
    setBatFirst(didBatFirst);
    setScreen("walk-on");
  };

  const handleWalkOnComplete = () => {
    setScreen("game");
  };

  const handleGameEnd = useCallback(() => {
    if (mainMode === "ipl") {
      const count = incrementIplMatchCount();
      if (count % 20 === 0) {
        setScreen("auction");
        return;
      }
    }
    setScreen("mode-select");
  }, [mainMode]);

  const handleAuctionComplete = () => {
    setScreen("mode-select");
  };

  const handleBack = () => setScreen("landing");

  const handleRestart = () => {
    setTarget(generateTarget());
  };

  const handlePlay = (_mode: GameMode, selectedDifficulty?: Difficulty) => {
    if (selectedDifficulty) {
      setDifficulty(selectedDifficulty);
    }
    setScreen("mode-select");
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {screen === "landing" && (
        <LandingPage onPlay={handlePlay} difficulty={difficulty} />
      )}
      {screen === "mode-select" && <ModeSelector onSelect={handleModeSelect} />}
      {screen === "team-select" && (
        <TeamSelect
          mode={mainMode}
          onSelect={handleTeamSelect}
          onBack={() => setScreen("mode-select")}
        />
      )}
      {screen === "player-select" && selectedTeam && (
        <PlayerSelect
          team={selectedTeam}
          onConfirm={handleLineupConfirm}
          onBack={() => setScreen("team-select")}
        />
      )}
      {screen === "toss" && selectedTeam && (
        <TossScreen playerTeam={selectedTeam} onComplete={handleTossComplete} />
      )}
      {screen === "walk-on" && selectedTeam && lineup && (
        <WalkOnAnimation
          team={selectedTeam}
          lineup={lineup}
          onComplete={handleWalkOnComplete}
          opposingTeam={opposingTeam}
        />
      )}
      {screen === "game" && selectedTeam && lineup && (
        <CricketGame
          config={config}
          gameMode={gameMode}
          onBack={handleBack}
          onGameEnd={handleGameEnd}
          onRestart={handleRestart}
          difficulty={difficulty}
          team={selectedTeam}
          lineup={lineup}
          batFirst={batFirst}
          opposingTeam={opposingTeam}
        />
      )}
      {screen === "practice" && (
        <PracticeNets onBack={() => setScreen("mode-select")} />
      )}
      {screen === "auction" && (
        <IPLAuction onComplete={handleAuctionComplete} />
      )}
    </div>
  );
}
