"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { connectSocket } from "@/lib/socket";
import { useGameStore } from "@/lib/game-store";
import { CASE_STUDIES, CLIENT_EVENTS } from "@design-dash/shared";
import CaseStudyBriefing from "@/components/tutorial/CaseStudyBriefing";

const TIMER_OPTIONS = [120, 150, 180, 210, 240];

const DIFFICULTY_COLORS = {
  beginner: "bg-game-green text-game-dark",
  intermediate: "bg-game-yellow text-game-dark",
  advanced: "bg-game-red text-white",
} as const;

export default function HostPage() {
  const router = useRouter();
  const { setRoom, setPlayerId } = useGameStore();
  const [teamSize, setTeamSize] = useState(4);
  const [turnTimer, setTurnTimer] = useState(150);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBriefing, setShowBriefing] = useState(false);

  function handleCreate() {
    if (!selectedCaseStudy) return;
    setIsCreating(true);
    setError(null);

    const socket = connectSocket();

    // Timeout if server doesn't respond within 8 seconds
    const timeout = setTimeout(() => {
      setError("Could not connect to game server. Please try again.");
      setIsCreating(false);
    }, 8000);

    // Handle connection errors
    const onConnectError = (err: Error) => {
      clearTimeout(timeout);
      setError(`Connection failed: ${err.message}`);
      setIsCreating(false);
      socket.off("connect_error", onConnectError);
    };
    socket.on("connect_error", onConnectError);

    socket.emit(
      CLIENT_EVENTS.ROOM_CREATE,
      { teamSize, turnTimer, caseStudyId: selectedCaseStudy },
      (response: { success: boolean; roomCode?: string; room?: any; error?: string }) => {
        clearTimeout(timeout);
        socket.off("connect_error", onConnectError);
        if (response.success && response.roomCode) {
          setRoom(response.room);
          setPlayerId(socket.id!);
          router.push(`/lobby/${response.roomCode}`);
        } else {
          setError(response.error || "Failed to create room");
          setIsCreating(false);
        }
      }
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <Link
          href="/"
          className="font-pixel text-xs text-gray-400 hover:text-game-red transition-colors"
        >
          &lt; BACK
        </Link>
        <h1 className="font-pixel text-lg md:text-2xl text-game-red neon-text-red">
          HOST GAME
        </h1>
        <div className="w-16" />
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
        {error && (
          <div className="pixel-card border-game-red bg-game-red/10 text-center">
            <p className="font-pixel text-[10px] text-game-red">{error}</p>
          </div>
        )}

        {/* Team Size */}
        <section className="pixel-card">
          <h2 className="font-pixel text-xs text-game-yellow mb-4">TEAM SIZE</h2>
          <p className="text-gray-400 text-sm mb-4">How many players per team?</p>
          <div className="flex gap-3">
            {[2, 3, 4, 5, 6].map((size) => (
              <button
                key={size}
                onClick={() => setTeamSize(size)}
                className={`w-14 h-14 font-pixel text-sm border-3 transition-all ${
                  teamSize === size
                    ? "bg-game-green text-game-dark border-game-green"
                    : "bg-transparent text-gray-400 border-game-blue hover:border-game-green hover:text-white"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </section>

        {/* Round Timer */}
        <section className="pixel-card">
          <h2 className="font-pixel text-xs text-game-yellow mb-4">ROUND TIMER</h2>
          <p className="text-gray-400 text-sm mb-4">Seconds per round for each decision.</p>
          <div className="flex flex-wrap gap-3">
            {TIMER_OPTIONS.map((seconds) => (
              <button
                key={seconds}
                onClick={() => setTurnTimer(seconds)}
                className={`px-5 py-3 font-pixel text-xs border-3 transition-all ${
                  turnTimer === seconds
                    ? "bg-game-green text-game-dark border-game-green"
                    : "bg-transparent text-gray-400 border-game-blue hover:border-game-green hover:text-white"
                }`}
              >
                {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}
              </button>
            ))}
          </div>
        </section>

        {/* Case Study Selection */}
        <section>
          <h2 className="font-pixel text-xs text-game-yellow mb-4">SELECT PRODUCT</h2>
          <p className="text-gray-400 text-sm mb-6">
            Choose the product your teams will make design decisions for.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CASE_STUDIES.map((cs) => (
              <button
                key={cs.id}
                onClick={() => setSelectedCaseStudy(cs.id)}
                className={`text-left p-5 border-3 transition-all ${
                  selectedCaseStudy === cs.id
                    ? "border-game-green bg-game-green/10"
                    : "border-game-blue bg-game-blue/20 hover:border-game-purple"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3
                    className={`font-pixel text-[10px] ${
                      selectedCaseStudy === cs.id ? "text-game-green" : "text-game-red"
                    }`}
                  >
                    {cs.productName}
                  </h3>
                  <span className={`font-pixel text-[6px] px-1.5 py-0.5 rounded ${DIFFICULTY_COLORS[cs.difficulty]}`}>
                    {cs.difficulty.toUpperCase()}
                  </span>
                </div>
                <p className="font-pixel text-[8px] text-game-yellow mb-2">
                  {cs.productType}
                </p>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-3">
                  {cs.shortDescription}
                </p>
                {/* Persona preview */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-700">
                  <div className="w-5 h-5 rounded-full bg-game-purple/30 border border-game-purple/50 flex items-center justify-center">
                    <span className="font-pixel text-[5px] text-game-purple">
                      {cs.persona.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-pixel text-[7px] text-gray-300">
                      {cs.persona.name}
                    </p>
                    <p className="text-[9px] text-gray-500">
                      {cs.persona.occupation}
                    </p>
                  </div>
                </div>
                {/* Decision count */}
                <p className="font-pixel text-[7px] text-gray-500 mt-2">
                  {cs.decisions.length} DECISIONS · {new Set(cs.decisions.map(d => d.round)).size} ROUNDS
                </p>
              </button>
            ))}
          </div>

          {/* View Briefing Button */}
          {selectedCaseStudy && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowBriefing(true)}
                className="pixel-btn-yellow text-[10px]"
              >
                VIEW MISSION BRIEFING
              </button>
            </div>
          )}
        </section>

        {/* Create Button */}
        <div className="text-center pt-4 pb-10">
          <button
            onClick={handleCreate}
            disabled={!selectedCaseStudy || isCreating}
            className="pixel-btn-red text-sm px-10 py-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isCreating ? "CREATING..." : "CREATE ROOM"}
          </button>
          {!selectedCaseStudy && (
            <p className="font-pixel text-[8px] text-gray-500 mt-4">
              SELECT A PRODUCT TO CONTINUE
            </p>
          )}
        </div>
      </div>

      {/* Case Study Briefing Modal */}
      {showBriefing && selectedCaseStudy && (() => {
        const cs = CASE_STUDIES.find((c) => c.id === selectedCaseStudy);
        return cs ? (
          <CaseStudyBriefing caseStudy={cs} onReady={() => setShowBriefing(false)} />
        ) : null;
      })()}
    </main>
  );
}
