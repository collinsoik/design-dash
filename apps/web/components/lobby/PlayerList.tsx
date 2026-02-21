"use client";

import type { Player } from "@/lib/types";

interface PlayerListProps {
  players: Player[];
}

export default function PlayerList({ players }: PlayerListProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-text-primary">
        Players ({players.length})
      </h2>

      <ul className="space-y-2">
        {players.map((player, index) => (
          <li
            key={player.id}
            className="player-card-enter group flex items-center gap-3 rounded-lg border border-border-primary bg-white px-4 py-3 transition-colors hover:border-border-secondary hover:shadow-card"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* Team color dot */}
            <span
              className="inline-block h-3 w-3 shrink-0 rounded-full ring-2 ring-border-primary"
              style={{
                backgroundColor: player.teamId ? undefined : "#C9CDD3",
              }}
              aria-label={
                player.teamId
                  ? `Assigned to team ${player.teamId}`
                  : "No team assigned"
              }
            />

            {/* Player name */}
            <span className="text-sm font-medium text-text-primary truncate">
              {player.displayName}
            </span>

            {/* Host badge */}
            {player.isHost && (
              <span className="ml-auto badge-yellow">
                Host
              </span>
            )}

            {/* Connection status */}
            <span
              className={`ml-auto shrink-0 flex items-center gap-1.5 text-sm ${
                player.connected ? "text-accent-green" : "text-accent-red"
              }`}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  player.connected
                    ? "bg-accent-green animate-pulse"
                    : "bg-accent-red"
                }`}
              />
              {player.connected ? "Online" : "Offline"}
            </span>
          </li>
        ))}
      </ul>

      {players.length === 0 && (
        <p className="text-center text-sm text-text-disabled py-6">
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
