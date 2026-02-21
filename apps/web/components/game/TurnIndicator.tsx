"use client";

import { useMemo, useCallback } from "react";
import { useGameStore } from "@/lib/game-store";
import { getSocket } from "@/lib/socket";

export default function TurnIndicator() {
  const room = useGameStore((s) => s.room);
  const playerId = useGameStore((s) => s.playerId);

  const gameState = room?.gameState ?? null;
  const turnState = gameState?.currentTurn ?? null;
  const totalTurns = gameState?.totalTurns ?? 0;
  const turnNumber = turnState?.turnNumber ?? 0;
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

  // Team color for the active player
  const teamColor = useMemo(() => {
    if (!room || !myTeamId) return "#ffffff";
    return room.teams[myTeamId]?.color ?? "#ffffff";
  }, [room, myTeamId]);

  // Format time as M:SS
  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // Timer color class based on time remaining
  const timerColorClass = useMemo(() => {
    if (timeRemaining <= 10) return "border-game-red text-game-red animate-pulse";
    if (timeRemaining <= 30) return "border-game-yellow text-game-yellow";
    return "border-game-green text-game-green";
  }, [timeRemaining]);

  // Submit turn early
  const handleSubmitTurn = useCallback(() => {
    if (!isMyTurn) return;
    const socket = getSocket();
    socket.emit("turn:submit");
  }, [isMyTurn]);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-game-blue/40 border-b-3 border-game-blue">
      {/* Left: Turn counter */}
      <div className="flex items-center gap-3">
        <span className="font-pixel text-xs text-game-yellow">
          Turn {turnNumber}/{totalTurns}
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
          <span className={`font-pixel text-sm ${isMyTurn ? "text-game-green" : "text-white"}`}>
            {isMyTurn ? "YOUR TURN!" : `${activePlayerName}'s turn`}
          </span>
        </div>

        {/* Timer display */}
        <div
          className={`font-pixel text-xl px-4 py-1 border-3 rounded ${timerColorClass}`}
        >
          {formatTime(timeRemaining)}
        </div>

        {/* Submit turn button */}
        {isMyTurn && (
          <button
            onClick={handleSubmitTurn}
            className="font-pixel text-[10px] px-4 py-2
              bg-game-green/20 border-2 border-game-green text-game-green
              hover:bg-game-green/30 hover:shadow-[0_0_10px_rgba(22,199,154,0.3)]
              active:bg-game-green/40 transition-all rounded"
          >
            DONE
          </button>
        )}
      </div>

      {/* Right: Room code */}
      <div className="flex items-center gap-2">
        <span className="font-pixel text-[10px] text-gray-400">
          {room?.code ?? "----"}
        </span>
        <div className="w-2 h-2 bg-game-green rounded-full animate-pulse" />
      </div>
    </header>
  );
}
