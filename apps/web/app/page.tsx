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
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-game-red opacity-40 animate-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-game-green opacity-40 animate-pulse-slow" />
        <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-game-yellow opacity-30 animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-game-purple opacity-40 animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-4 h-4 bg-game-blue opacity-50 animate-pulse" />
      </div>

      {/* Title */}
      <div className="text-center mb-12 relative z-10">
        <h1 className="font-pixel text-4xl md:text-6xl text-game-red neon-text-red mb-4 tracking-wider">
          DESIGNDASH
        </h1>
        <p className="font-pixel text-xs md:text-sm text-game-green neon-text-green">
          Make Design Decisions. Together.
        </p>
      </div>

      {/* Action Cards */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl relative z-10">
        {/* JOIN GAME Card */}
        <div className="flex-1 pixel-card">
          <h2 className="font-pixel text-sm text-game-yellow mb-6 text-center">
            JOIN GAME
          </h2>
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="font-pixel text-[10px] text-gray-400 block mb-2">
                ROOM CODE
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => handleRoomCodeChange(e.target.value)}
                placeholder="DASH-XXXX"
                maxLength={9}
                className="w-full bg-game-dark border-3 border-game-blue px-4 py-3 font-pixel text-xs text-white placeholder-gray-600 focus:border-game-yellow focus:outline-none transition-colors uppercase tracking-widest"
              />
            </div>
            <div>
              <label className="font-pixel text-[10px] text-gray-400 block mb-2">
                YOUR NAME
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Player name"
                maxLength={20}
                className="w-full bg-game-dark border-3 border-game-blue px-4 py-3 font-sans text-sm text-white placeholder-gray-600 focus:border-game-yellow focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={!roomCode.trim() || !playerName.trim() || isJoining}
              className="w-full pixel-btn-red disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isJoining ? "JOINING..." : "JOIN"}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center">
          <span className="font-pixel text-xs text-gray-500">OR</span>
        </div>

        {/* HOST GAME Card */}
        <div className="flex-1 pixel-card flex flex-col items-center justify-center min-h-[280px]">
          <h2 className="font-pixel text-sm text-game-yellow mb-6 text-center">
            HOST GAME
          </h2>
          <p className="text-gray-400 text-sm text-center mb-8 leading-relaxed">
            Create a new game room, choose a product scenario, and invite your
            players to join.
          </p>
          <Link href="/host" className="pixel-btn-green inline-block text-center">
            CREATE ROOM
          </Link>
        </div>
      </div>

      {/* How to Play Button */}
      <div className="mt-10 relative z-10">
        <button
          onClick={() => setShowTutorial(true)}
          className="pixel-btn-yellow text-xs"
        >
          HOW TO PLAY
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center relative z-10">
        <p className="font-pixel text-[8px] text-gray-600">
          A MULTIPLAYER PRODUCT DESIGN GAME
        </p>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && <HowToPlay onClose={() => setShowTutorial(false)} />}
    </main>
  );
}
