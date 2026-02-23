"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { useGameStore } from "@/lib/game-store";
import { CASE_STUDIES, CLIENT_EVENTS } from "@design-dash/shared";
import CaseStudyBriefing from "@/components/tutorial/CaseStudyBriefing";

const TIMER_OPTIONS = [120, 150, 180, 210, 240];

const DIFFICULTY_COLORS = {
  beginner: "badge-green",
  intermediate: "badge-yellow",
  advanced: "badge-red",
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

  // Reset previous game state on mount (defense-in-depth for direct /host navigation)
  useEffect(() => {
    useGameStore.getState().reset();
    disconnectSocket();
  }, []);

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
    <main className="min-h-screen p-6 md:p-10 bg-surface-primary">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <Link
          href="/"
          className="text-sm text-text-tertiary hover:text-accent-primary transition-colors"
        >
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">
          Host Game
        </h1>
        <div className="w-16" />
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
        {error && (
          <div className="card border-accent-red bg-accent-red-light text-center">
            <p className="text-sm text-accent-red">{error}</p>
          </div>
        )}

        {/* Team Size */}
        <section className="card">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Team Size</h2>
          <p className="text-text-secondary text-sm mb-4">How many players per team?</p>
          <div className="flex gap-3">
            {[2, 3, 4, 5, 6].map((size) => (
              <button
                key={size}
                onClick={() => setTeamSize(size)}
                className={`w-14 h-14 text-sm font-semibold border rounded-lg transition-all ${
                  teamSize === size
                    ? "bg-accent-green text-white border-accent-green"
                    : "bg-white text-text-secondary border-border-primary hover:border-accent-green hover:text-text-primary"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </section>

        {/* Round Timer */}
        <section className="card">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Round Timer</h2>
          <p className="text-text-secondary text-sm mb-4">Seconds per round for each decision.</p>
          <div className="flex flex-wrap gap-3">
            {TIMER_OPTIONS.map((seconds) => (
              <button
                key={seconds}
                onClick={() => setTurnTimer(seconds)}
                className={`px-5 py-3 text-sm font-semibold border rounded-lg transition-all ${
                  turnTimer === seconds
                    ? "bg-accent-green text-white border-accent-green"
                    : "bg-white text-text-secondary border-border-primary hover:border-accent-green hover:text-text-primary"
                }`}
              >
                {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}
              </button>
            ))}
          </div>
        </section>

        {/* Case Study Selection */}
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Select Product</h2>
          <p className="text-text-secondary text-sm mb-6">
            Choose the product your teams will make design decisions for.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CASE_STUDIES.map((cs) => (
              <button
                key={cs.id}
                onClick={() => setSelectedCaseStudy(cs.id)}
                className={`text-left p-5 border rounded-xl transition-all ${
                  selectedCaseStudy === cs.id
                    ? "border-accent-green bg-accent-green-light shadow-card"
                    : "border-border-primary bg-white hover:border-accent-purple hover:shadow-card"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3
                    className={`text-sm font-semibold ${
                      selectedCaseStudy === cs.id ? "text-accent-green" : "text-text-primary"
                    }`}
                  >
                    {cs.productName}
                  </h3>
                  <span className={DIFFICULTY_COLORS[cs.difficulty]}>
                    {cs.difficulty.charAt(0).toUpperCase() + cs.difficulty.slice(1)}
                  </span>
                </div>
                <p className="text-sm font-medium text-accent-primary mb-2">
                  {cs.productType}
                </p>
                <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 mb-3">
                  {cs.shortDescription}
                </p>
                {/* Persona preview */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border-primary">
                  <div className="w-5 h-5 rounded-full bg-accent-purple-light border border-accent-purple/30 flex items-center justify-center">
                    <span className="text-xs font-semibold text-accent-purple">
                      {cs.persona.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-text-primary">
                      {cs.persona.name}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {cs.persona.occupation}
                    </p>
                  </div>
                </div>
                {/* Decision count */}
                <p className="text-xs text-text-tertiary mt-2">
                  {cs.decisions.length} decisions &middot; {new Set(cs.decisions.map(d => d.round)).size} rounds
                </p>
              </button>
            ))}
          </div>

          {/* View Briefing Button */}
          {selectedCaseStudy && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowBriefing(true)}
                className="btn-ghost"
              >
                View Mission Briefing
              </button>
            </div>
          )}
        </section>

        {/* Create Button */}
        <div className="text-center pt-4 pb-10">
          <button
            onClick={handleCreate}
            disabled={!selectedCaseStudy || isCreating}
            className="btn-primary px-10 py-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isCreating ? "Creating..." : "Create Room"}
          </button>
          {!selectedCaseStudy && (
            <p className="text-sm text-text-disabled mt-4">
              Select a product to continue
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
