"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HowToPlay from "@/components/tutorial/HowToPlay";

export default function LandingPage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  function handleRoomCodeChange(value: string) {
    // Auto-format: uppercase, max 8 chars, insert dash after DASH
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    if (cleaned.length <= 9) {
      setRoomCode(cleaned);
    }
  }

  function handleJoin(e: FormEvent) {
    e.preventDefault();
    if (!roomCode.trim() || !playerName.trim()) return;

    setIsJoining(true);
    const encodedName = encodeURIComponent(playerName.trim());
    router.push(`/lobby/${roomCode.trim()}?name=${encodedName}`);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-surface-primary">
      {/* Title */}
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-4 tracking-tight">
          DesignDash
        </h1>
        <p className="text-lg text-text-secondary mb-2">
          The team game where YOU design the app.
        </p>
        <p className="text-sm text-text-tertiary max-w-md mx-auto">
          Pick a real app, make design choices with your team, and see who builds the best experience!
        </p>
      </div>

      {/* Action Cards */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl relative z-10">
        {/* JOIN GAME Card */}
        <div className="flex-1 card">
          <h2 className="text-lg font-semibold text-text-primary mb-6 text-center">
            Join Game
          </h2>
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-2">
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => handleRoomCodeChange(e.target.value)}
                placeholder="DASH-XXXX"
                maxLength={9}
                className="input font-mono uppercase tracking-widest"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Player name"
                maxLength={20}
                className="input"
              />
            </div>
            <button
              type="submit"
              disabled={!roomCode.trim() || !playerName.trim() || isJoining}
              className="w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isJoining ? "Joining..." : "Join"}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center">
          <span className="text-sm text-text-tertiary">or</span>
        </div>

        {/* HOST GAME Card */}
        <div className="flex-1 card flex flex-col items-center justify-center min-h-[280px]">
          <h2 className="text-lg font-semibold text-text-primary mb-6 text-center">
            Host Game
          </h2>
          <p className="text-text-secondary text-sm text-center mb-8 leading-relaxed">
            Set up a new game, pick an app to redesign, and invite your
            friends to play!
          </p>
          <Link href="/host" className="btn-green inline-block text-center">
            Create Room
          </Link>
        </div>
      </div>

      {/* How to Play Button */}
      <div className="mt-10 relative z-10">
        <button
          onClick={() => setShowTutorial(true)}
          className="btn-ghost"
        >
          How to Play
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center relative z-10">
        <p className="text-xs text-text-disabled">
          A multiplayer design game for creative thinkers
        </p>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && <HowToPlay onClose={() => setShowTutorial(false)} />}
    </main>
  );
}
