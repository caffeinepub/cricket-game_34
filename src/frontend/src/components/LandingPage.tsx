import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  Globe,
  Instagram,
  Mail,
  Menu,
  Trophy,
  Twitter,
  X,
  Youtube,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { GameMode } from "../App";
import type { Difficulty } from "../types/game";

// suppress unused Mail import lint warning
void Mail;

const LEADERBOARD = [
  { rank: 1, name: "Virat K.", score: 892, country: "🇮🇳" },
  { rank: 2, name: "Steve S.", score: 854, country: "🇦🇺" },
  { rank: 3, name: "Kane W.", score: 801, country: "🇳🇿" },
  { rank: 4, name: "Ben S.", score: 776, country: "🏴" },
  { rank: 5, name: "Rohit S.", score: 751, country: "🇮🇳" },
];

const GAME_MODES: Array<{
  id: GameMode;
  icon: string;
  title: string;
  desc: string;
  color: string;
}> = [
  {
    id: "t20",
    icon: "🏆",
    title: "T20 World Cup",
    desc: "20 overs, chase 120-140 runs",
    color: "from-green-600 to-green-800",
  },
  {
    id: "super-over",
    icon: "⚡",
    title: "Super Over",
    desc: "1 over showdown, chase 8-12",
    color: "from-amber-600 to-orange-700",
  },
  {
    id: "quick",
    icon: "🏏",
    title: "Quick Match",
    desc: "3 overs, chase 25-35",
    color: "from-blue-600 to-blue-800",
  },
];

const CRICKET_FACTS = [
  "🏏 MS Dhoni has the most finishes in T20Is",
  "⚡ The fastest T20 century was scored off just 35 balls by Rohit Sharma",
  "🏆 India won the 2024 T20 World Cup, defeating South Africa in the final",
  "🔥 Chris Gayle holds the record for most T20 international sixes",
  "🏏 Virat Kohli is the highest run-scorer in T20 World Cup history",
];

interface Props {
  onPlay: (mode: GameMode, difficulty?: Difficulty) => void;
  difficulty: Difficulty;
}

export default function LandingPage({
  onPlay,
  difficulty: currentDifficulty,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>(currentDifficulty);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const difficultyButtons: {
    id: Difficulty;
    label: string;
    color: string;
    activeColor: string;
  }[] = [
    {
      id: "easy",
      label: "Easy",
      color: "border-green-500 text-green-500",
      activeColor: "bg-green-500 text-white",
    },
    {
      id: "medium",
      label: "Medium",
      color: "border-amber-500 text-amber-500",
      activeColor: "bg-amber-500 text-white",
    },
    {
      id: "hard",
      label: "Hard",
      color: "border-red-500 text-red-500",
      activeColor: "bg-red-500 text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className="sticky top-0 z-50 bg-white border-b border-border shadow-xs"
        data-ocid="header.section"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏏</span>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              CRICKET <span className="text-primary">BLAST</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {["Home", "Game Modes", "Leaderboard", "How To Play", "Shop"].map(
              (item) => (
                <a
                  key={item}
                  href="#nav"
                  data-ocid="nav.link"
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary hover:after:w-full after:transition-all"
                >
                  {item}
                </a>
              ),
            )}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              data-ocid="header.primary_button"
              onClick={() => onPlay("t20", selectedDifficulty)}
              className="bg-primary text-white rounded-full px-5 py-2 text-sm font-semibold hover:bg-primary/90 shadow-sm"
            >
              Play Now
            </Button>
            <Button
              data-ocid="header.secondary_button"
              variant="outline"
              className="rounded-lg px-5 py-2 text-sm font-semibold border-brand-warm text-brand-warm bg-brand-warm-bg hover:bg-brand-warm/10"
            >
              Login
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t border-border px-6 py-4 flex flex-col gap-4"
          >
            {["Home", "Game Modes", "Leaderboard", "How To Play", "Shop"].map(
              (item) => (
                <a
                  key={item}
                  href="#nav"
                  className="text-sm font-medium text-foreground/80 hover:text-primary"
                >
                  {item}
                </a>
              ),
            )}
            <Button
              onClick={() => onPlay("t20", selectedDifficulty)}
              className="bg-primary text-white rounded-full w-full"
              data-ocid="nav.primary_button"
            >
              Play Now
            </Button>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: "65vh" }}
        data-ocid="hero.section"
      >
        {/* Stadium background image */}
        <img
          src="/assets/generated/cricket-stadium-hero.dim_1600x900.jpg"
          alt="Cricket stadium"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

        {/* Scoreboard overlay - top left */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute top-6 left-6 rounded-xl shadow-overlay overflow-hidden z-10"
          style={{ background: "linear-gradient(135deg, #0E3B1F, #1C5A2E)" }}
          data-ocid="hero.panel"
        >
          <div className="px-4 pt-3 pb-1 border-b border-white/20">
            <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">
              Live Score
            </p>
          </div>
          <div className="px-4 py-3 space-y-1.5">
            <div className="flex items-baseline gap-2">
              <span className="text-white font-bold text-2xl">148/4</span>
              <span className="text-white/60 text-xs">RUNS/WKT</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-white/50 text-xs">OVERS</span>
                <p className="text-white font-semibold">16.4</p>
              </div>
              <div>
                <span className="text-white/50 text-xs">RRR</span>
                <p className="text-white font-semibold">7.20</p>
              </div>
              <div>
                <span className="text-white/50 text-xs">TARGET</span>
                <p className="text-white font-semibold">183</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hero center content */}
        <div
          className="relative z-10 flex flex-col items-center justify-center"
          style={{ minHeight: "65vh" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-center px-4 mb-6"
          >
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg leading-tight">
              CRICKET
              <span className="block" style={{ color: "#6BD96B" }}>
                BLAST
              </span>
            </h1>
            <p className="mt-3 text-white/85 text-lg sm:text-xl font-medium drop-shadow">
              Play. Smash. Win. The ultimate cricket experience.
            </p>
          </motion.div>

          {/* Difficulty selector */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center gap-2 mb-4"
          >
            {difficultyButtons.map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setSelectedDifficulty(btn.id)}
                data-ocid="hero.toggle"
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
                  selectedDifficulty === btn.id
                    ? btn.activeColor
                    : `${btn.color} bg-transparent hover:opacity-80`
                }`}
              >
                {btn.label}
              </button>
            ))}
          </motion.div>

          {/* Action control bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="rounded-2xl px-4 py-3 shadow-overlay"
            style={{
              background: "rgba(14, 59, 31, 0.92)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p className="text-white/60 text-xs uppercase tracking-wider text-center mb-2">
              Choose Your Mode
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onPlay("t20", selectedDifficulty)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-3 py-1.5 text-white text-xs font-medium"
                data-ocid="hero.primary_button"
              >
                🏆 T20 Cup
              </button>
              <button
                type="button"
                onClick={() => onPlay("super-over", selectedDifficulty)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-3 py-1.5 text-white text-xs font-medium"
                data-ocid="hero.button"
              >
                ⚡ Super Over
              </button>
              <button
                type="button"
                onClick={() => onPlay("quick", selectedDifficulty)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-3 py-1.5 text-white text-xs font-medium"
                data-ocid="hero.button"
              >
                🏏 Quick Match
              </button>
            </div>
          </motion.div>
        </div>

        {/* Player panels - bottom */}
        <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-end gap-4">
          {/* Left player panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-xl overflow-hidden shadow-overlay"
            style={{ background: "linear-gradient(135deg, #0B4F86, #0A3E73)" }}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-sm">
                RS
              </div>
              <div>
                <p className="text-white font-semibold text-sm">R. Sharma</p>
                <p className="text-blue-200 text-xs">64 (38) • SR: 168</p>
              </div>
            </div>
          </motion.div>

          {/* Right player panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-xl overflow-hidden shadow-overlay"
            style={{
              background: "rgba(242, 242, 242, 0.92)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="px-4 py-3">
              <p className="text-foreground/60 text-xs uppercase tracking-wider mb-1">
                At Crease
              </p>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-foreground font-semibold text-sm">
                    K. Pollard
                  </p>
                  <p className="text-foreground/60 text-xs">44 (22)</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                  KP
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cricket Facts Ticker */}
      <div
        className="overflow-hidden py-2"
        style={{ background: "#0E3B1F" }}
        data-ocid="ticker.section"
      >
        <div className="flex items-center gap-2">
          <span
            className="shrink-0 px-3 py-1 text-xs font-bold uppercase tracking-wider"
            style={{ color: "#6BD96B" }}
          >
            🏏 FACTS
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap text-white/80 text-xs">
              {CRICKET_FACTS.join("    •    ")}
            </div>
          </div>
        </div>
      </div>

      {/* Below Hero: 3-column section */}
      <section className="bg-white py-16 px-6" data-ocid="features.section">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Headline + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center gap-4"
          >
            <div className="flex items-center gap-2">
              <Zap className="text-primary w-5 h-5" />
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">
                Browser Based
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground leading-tight">
              Play Instantly —
              <span className="text-primary"> No Download Required</span>
            </h2>
            <p className="text-foreground/65 text-sm leading-relaxed">
              Jump into a full cricket match in seconds. Choose your shot, read
              the bowler, and chase down targets in an action-packed showdown.
              Free to play, always thrilling.
            </p>
            <Button
              onClick={() => onPlay("t20", selectedDifficulty)}
              data-ocid="features.primary_button"
              className="w-fit bg-primary text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-primary/90 shadow-sm flex items-center gap-2"
            >
              Start Playing <ChevronRight size={16} />
            </Button>
          </motion.div>

          {/* Column 2: Game Modes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="text-primary w-5 h-5" />
              <h2 className="font-display text-xl font-bold text-foreground">
                Exciting Game Modes
              </h2>
            </div>
            <div className="space-y-3">
              {GAME_MODES.map((mode, i) => (
                <motion.button
                  key={mode.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  onClick={() => onPlay(mode.id, selectedDifficulty)}
                  data-ocid={`game-mode.button.${i + 1}`}
                  className="w-full flex items-center gap-4 bg-white border border-border rounded-2xl p-4 shadow-card hover:shadow-md hover:-translate-y-0.5 transition-all text-left group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center text-xl shadow-sm`}
                  >
                    {mode.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {mode.title}
                    </p>
                    <p className="text-xs text-foreground/55 mt-0.5">
                      {mode.desc}
                    </p>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Column 3: Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Globe className="text-primary w-5 h-5" />
              <h2 className="font-display text-xl font-bold text-foreground">
                Compete Globally
              </h2>
            </div>
            <div
              className="bg-white border border-border rounded-2xl shadow-card overflow-hidden"
              data-ocid="leaderboard.card"
            >
              <div
                className="px-4 py-3 border-b border-border"
                style={{
                  background: "linear-gradient(135deg, #0E3B1F, #1C5A2E)",
                }}
              >
                <p className="text-white font-semibold text-sm">
                  🏆 Top 5 Players
                </p>
              </div>
              <div className="divide-y divide-border">
                {LEADERBOARD.map((entry) => (
                  <div
                    key={entry.rank}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
                    data-ocid={`leaderboard.item.${entry.rank}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        entry.rank === 1
                          ? "bg-yellow-400 text-yellow-900"
                          : entry.rank === 2
                            ? "bg-gray-300 text-gray-700"
                            : entry.rank === 3
                              ? "bg-amber-600 text-white"
                              : "bg-muted text-foreground/60"
                      }`}
                    >
                      {entry.rank}
                    </span>
                    <span className="text-base">{entry.country}</span>
                    <span className="flex-1 text-sm font-medium text-foreground">
                      {entry.name}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {entry.score}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full text-xs text-primary hover:text-primary/80 h-7"
                  data-ocid="leaderboard.secondary_button"
                >
                  View Full Leaderboard
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12 px-6"
        style={{ backgroundColor: "#1F4D2A" }}
        data-ocid="footer.section"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🏏</span>
                <span className="font-display font-bold text-white text-lg">
                  CRICKET BLAST
                </span>
              </div>
              <p className="text-white/55 text-xs leading-relaxed">
                The ultimate browser cricket experience. Play anywhere, anytime.
              </p>
            </div>

            {/* Links */}
            <div>
              <p className="text-white/80 font-semibold text-sm mb-3">Links</p>
              <div className="flex flex-col gap-2">
                {["About", "Contact", "Privacy", "Terms"].map((link) => (
                  <a
                    key={link}
                    href="#links"
                    className="text-white/55 text-sm hover:text-white transition-colors"
                    data-ocid="footer.link"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="text-white/80 font-semibold text-sm mb-3">
                Follow Us
              </p>
              <div className="flex gap-3">
                {[
                  { icon: <Twitter size={18} />, label: "Twitter" },
                  { icon: <Instagram size={18} />, label: "Instagram" },
                  { icon: <Youtube size={18} />, label: "YouTube" },
                ].map(({ icon, label }) => (
                  <a
                    key={label}
                    href="#social"
                    aria-label={label}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                    data-ocid="footer.link"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-white/80 font-semibold text-sm mb-3">
                Newsletter
              </p>
              <p className="text-white/55 text-xs mb-3">
                Get updates on new game modes and tournaments.
              </p>
              {subscribed ? (
                <p
                  className="text-green-300 text-sm font-medium"
                  data-ocid="newsletter.success_state"
                >
                  ✓ You're subscribed!
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm h-9"
                    data-ocid="newsletter.input"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white h-9 px-3"
                    data-ocid="newsletter.submit_button"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white underline transition-colors"
              >
                caffeine.ai
              </a>
            </p>
            <p className="text-white/40 text-xs">
              🏏 Cricket Blast — Play. Smash. Win.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
