"use client";

import { useMemo, useCallback } from "react";
import { useGameStore } from "@/lib/game-store";
import { getSocket } from "@/lib/socket";

export default function TurnIndicator() {
  const room = useGameStore((s) => s.room);
  const playerId = useGameStore((s) => s.playerId);

  const gameState = room?.gameState ?? null;
  const turnState = gameState?.currentTurn ?? null;
  const totalRounds = gameState?.totalRounds ?? 0;
  const currentRound = turnState?.round ?? 0;
  const timeRemaining = turnState?.timeRemaining ?? 0;

  // Determine the current player's team
  const myTeamId = useMemo(() => {
    if (!room || !playerId) return null;
    return room.players[playerId]?.teamId ?? null;
  }, [room, playerId]);

  // Get the active player for this team
  const activePlayerId = useMemo(() => {
    if (!turnState || !myTeamId) return null;
    return turnState.activePlayerIds[myTeamId] ?? null;
  }, [turnState, myTeamId]);

  const activePlayerName = useMemo(() => {
    if (!room || !activePlayerId) return "...";
    return room.players[activePlayerId]?.displayName ?? "Unknown";
  }, [room, activePlayerId]);

  const isMyTurn = playerId === activePlayerId;

  // Check if my team already submitted this round
  const hasSubmitted = useMemo(() => {
    if (!turnState || !myTeamId) return false;
    return turnState.submittedTeams?.includes(myTeamId) ?? false;
  }, [turnState, myTeamId]);

  // Team color for the active player
  const teamColor = useMemo(() => {
    if (!room || !myTeamId) return "#7C8CF5";
    return room.teams[myTeamId]?.color ?? "#7C8CF5";
  }, [room, myTeamId]);

  // Format time as M:SS
  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // Timer color class based on time remaining
  const timerColorClass = useMemo(() => {
    if (timeRemaining <= 10) return "border-accent-red text-accent-red animate-pulse";
    if (timeRemaining <= 30) return "border-accent-yellow text-accent-yellow";
    return "border-accent-green text-accent-green";
  }, [timeRemaining]);

  // Submit turn early
  const handleSubmitTurn = useCallback(() => {
    if (!isMyTurn) return;
    const socket = getSocket();
    socket.emit("turn:submit");
  }, [isMyTurn]);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-surface-secondary border-b border-border-primary shadow-soft">
      {/* Left: Room code + round counter */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-tertiary">
          Room: {room?.code ?? "----"}
        </span>
        <div className="h-4 w-px bg-border-primary" />
        <span className="text-sm font-semibold text-accent-primary">
          Round {currentRound + 1}/{totalRounds}
        </span>
      </div>

      {/* Center: Active player + timer */}
      <div className="flex items-center gap-4">
        {/* Active player indicator */}
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: teamColor }}
          />
          <span className={`text-sm font-semibold ${isMyTurn ? "text-accent-green" : "text-text-primary"}`}>
            {isMyTurn ? "It's your turn — make your choice!" : `${activePlayerName} is choosing...`}
          </span>
        </div>

        {/* Timer display */}
        <div
          className={`font-mono text-xl font-bold px-4 py-1 border rounded-lg ${timerColorClass}`}
        >
          {formatTime(timeRemaining)}
        </div>

        {/* Submit turn button */}
        {isMyTurn && !hasSubmitted && (
          <button
            onClick={handleSubmitTurn}
            className="btn-green text-sm"
          >
            Done — Next Round
          </button>
        )}
        {hasSubmitted && (
          <span className="text-sm font-medium text-accent-green">
            Choices locked in — waiting for other teams...
          </span>
        )}
      </div>

      {/* Right: connection indicator */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
      </div>
    </header>
  );
}
