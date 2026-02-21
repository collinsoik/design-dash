"use client";

import type { Team, Player } from "@/lib/types";
import { TEAM_COLORS } from "@design-dash/shared";

interface TeamDisplayProps {
  teams: Team[];
  players: Record<string, Player>;
}

export default function TeamDisplay({ teams, players }: TeamDisplayProps) {
  /**
   * Resolve a team's member list to Player objects, falling back to a
   * placeholder when the player record is missing.
   */
  function getMemberNames(memberIds: string[]): string[] {
    return memberIds.map(
      (id) => players[id]?.displayName ?? "Unknown Player"
    );
  }

  /**
   * Pick the TEAM_COLORS entry that matches the team color, or fall back
   * to the provided hex string.
   */
  function resolveColor(color: string): string {
    const found = (TEAM_COLORS as readonly string[]).find(
      (c) => c.toLowerCase() === color.toLowerCase()
    );
    return found ?? color;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-text-primary">
        Teams
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team) => {
          const color = resolveColor(team.color);
          const memberNames = getMemberNames(team.members);
          const maxSlots = Math.max(team.members.length, 4);
          const emptySlots = maxSlots - team.members.length;

          return (
            <div
              key={team.id}
              className="relative overflow-hidden rounded-xl border border-border-primary bg-white shadow-card"
              style={{ borderTopColor: color, borderTopWidth: "4px" }}
            >
              {/* Team header */}
              <div
                className="px-4 py-3"
                style={{ backgroundColor: `${color}12` }}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className="text-sm font-semibold uppercase tracking-wide truncate"
                    style={{ color }}
                  >
                    {team.name}
                  </h3>
                  <span className="shrink-0 text-sm text-text-tertiary">
                    {team.members.length}/{maxSlots} players
                  </span>
                </div>
              </div>

              {/* Member list */}
              <ul className="divide-y divide-border-primary px-4">
                {memberNames.map((name, idx) => (
                  <li
                    key={team.members[idx]}
                    className="flex items-center gap-2 py-2"
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm text-text-primary truncate">
                      {name}
                    </span>
                  </li>
                ))}

                {/* Empty slots */}
                {Array.from({ length: emptySlots }).map((_, idx) => (
                  <li
                    key={`empty-${idx}`}
                    className="flex items-center gap-2 py-2"
                  >
                    <span className="inline-block h-2 w-2 rounded-full bg-text-disabled" />
                    <span className="waiting-blink text-sm text-text-disabled italic">
                      Waiting...
                    </span>
                  </li>
                ))}
              </ul>

              {/* Bottom padding when the list is empty */}
              {team.members.length === 0 && emptySlots === 0 && (
                <div className="px-4 py-3">
                  <p className="text-xs text-text-disabled">
                    No members yet
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {teams.length === 0 && (
        <p className="text-center text-sm text-text-disabled py-8">
          No teams created yet
        </p>
      )}

      {/* Scoped blinking animation for empty slots */}
      <style jsx>{`
        @keyframes waitingBlink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
        .waiting-blink {
          animation: waitingBlink 1.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
