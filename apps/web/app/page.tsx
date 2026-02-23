"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HowToPlay from "@/components/tutorial/HowToPlay";
import { useGameStore } from "@/lib/game-store";
import { disconnectSocket } from "@/lib/socket";

export default function LandingPage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // Reset previous game state when landing page mounts (e.g. after "Play Again")
  useEffect(() => {
    useGameStore.getState().reset();
    disconnectSocket();
  }, []);

  function handleRoomCodeChange(value: string) {
    // Only allow digits, max 4 chars
    const cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.length <= 4) {
      setRoomCode(cleaned);
    }
  }

  function handleJoin(e: FormEvent) {
    e.preventDefault();
    if (roomCode.trim().length !== 4 || !playerName.trim()) return;

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
        <p className="text-lg text-text-secondary">
          Make Design Decisions. Together.
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
                placeholder="1234"
                maxLength={4}
                className="input font-mono tracking-widest"
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
              disabled={roomCode.trim().length !== 4 || !playerName.trim() || isJoining}
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
            Create a new game room, choose a product scenario, and invite your
            players to join.
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
          A multiplayer product design game
        </p>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && <HowToPlay onClose={() => setShowTutorial(false)} />}
    </main>
  );
}
