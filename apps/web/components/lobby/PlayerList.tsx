"use client";

import type { Player } from "@/lib/types";

interface PlayerListProps {
  players: Player[];
}

export default function PlayerList({ players }: PlayerListProps) {
  return (
    <div className="space-y-3">
      <h2 className="font-pixel text-sm text-game-yellow tracking-wide uppercase">
        Players ({players.length})
      </h2>

      <ul className="space-y-2">
        {players.map((player, index) => (
          <li
            key={player.id}
            className="player-card-enter group flex items-center gap-3 rounded-md border-2 border-game-blue bg-game-dark/80 px-4 py-3 transition-colors hover:border-game-purple"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* Team color dot */}
            <span
              className="inline-block h-3 w-3 shrink-0 rounded-full ring-2 ring-white/20"
              style={{
                backgroundColor: player.teamId ? undefined : "#555",
              }}
              aria-label={
                player.teamId
                  ? `Assigned to team ${player.teamId}`
                  : "No team assigned"
              }
            />

            {/* Player name */}
            <span className="font-pixel text-xs text-white truncate">
              {player.displayName}
            </span>

            {/* Host badge */}
            {player.isHost && (
              <span className="ml-auto shrink-0 rounded bg-game-yellow/20 px-2 py-0.5 font-pixel text-[8px] uppercase text-game-yellow">
                Host
              </span>
            )}

            {/* Connection status */}
            <span
              className={`ml-auto shrink-0 flex items-center gap-1.5 text-[10px] font-sans ${
                player.connected ? "text-game-green" : "text-red-400"
              }`}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  player.connected
                    ? "bg-game-green animate-pulse"
                    : "bg-red-400"
                }`}
              />
              {player.connected ? "Online" : "Offline"}
            </span>
          </li>
        ))}
      </ul>

      {players.length === 0 && (
        <p className="text-center font-pixel text-[10px] text-white/40 py-6">
          Waiting for players to join...
        </p>
      )}

      {/* Scoped keyframe animation */}
      <style jsx>{`
        @keyframes playerCardEnter {
          0% {
            opacity: 0;
            transform: translateX(-16px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .player-card-enter {
          animation: playerCardEnter 0.35s ease-out both;
        }
      `}</style>
    </div>
  );
}
