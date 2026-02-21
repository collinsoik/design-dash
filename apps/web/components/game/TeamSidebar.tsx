"use client";

import { useMemo } from "react";
import { useGameStore } from "@/lib/game-store";

export default function TeamSidebar() {
  const room = useGameStore((s) => s.room);
  const playerId = useGameStore((s) => s.playerId);

  // Current player's team
  const myTeamId = useMemo(() => {
    if (!room || !playerId) return null;
    return room.players[playerId]?.teamId ?? null;
  }, [room, playerId]);

  const team = useMemo(() => {
    if (!room || !myTeamId) return null;
    return room.teams[myTeamId] ?? null;
  }, [room, myTeamId]);

  // Active player for this team in the current round
  const activePlayerId = useMemo(() => {
    if (!room?.gameState?.currentTurn || !myTeamId) return null;
    return room.gameState.currentTurn.activePlayerIds[myTeamId] ?? null;
  }, [room, myTeamId]);

  // Team members with details
  const members = useMemo(() => {
    if (!room || !team) return [];
    return team.members.map((memberId) => {
      const player = room.players[memberId];
      const isActive = memberId === activePlayerId;
      const isConnected = player?.connected ?? false;

      return {
        id: memberId,
        name: player?.displayName ?? "Unknown",
        isActive,
        isConnected,
        isCurrentPlayer: memberId === playerId,
      };
    });
  }, [room, team, activePlayerId, playerId]);

  // Case study info
  const caseStudy = room?.gameState?.caseStudy ?? null;

  return (
    <aside className="w-56 border-l border-border-primary bg-surface-secondary flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border-primary">
        <div className="flex items-center justify-center gap-2">
          {team && (
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: team.color }}
            />
          )}
          <h2 className="text-sm font-semibold text-text-primary text-center">
            {team?.name ?? "Your Team"}
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Team Members */}
        <div>
          <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">
            Members
          </h4>
          <div className="space-y-1.5">
            {members.length > 0 ? (
              members.map((member) => (
                <div
                  key={member.id}
                  className={`
                    flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm
                    ${
                      member.isActive
                        ? "bg-accent-green-light border border-accent-green/30 text-accent-green"
                        : member.isConnected
                        ? "text-text-primary"
                        : "text-text-disabled opacity-60"
                    }
                  `}
                >
                  {/* Status dot */}
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      member.isActive
                        ? "bg-accent-green animate-pulse"
                        : member.isConnected
                        ? "bg-accent-blue"
                        : "bg-text-disabled"
                    }`}
                  />

                  {/* Player name */}
                  <span className="truncate flex-1">
                    {member.name}
                    {member.isCurrentPlayer && (
                      <span className="text-accent-primary ml-1">(you)</span>
                    )}
                  </span>

                  {/* Status badge */}
                  <span className="text-xs font-medium flex-shrink-0">
                    {member.isActive
                      ? "Active"
                      : !member.isConnected
                      ? "Offline"
                      : "Waiting"}
                  </span>
                </div>
              ))
            ) : (
              <>
                {["Player 1", "Player 2", "Player 3", "Player 4"].map(
                  (name, i) => (
                    <div
                      key={name}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm ${
                        i === 0
                          ? "bg-accent-green-light border border-accent-green/30 text-accent-green"
                          : "text-text-secondary"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          i === 0
                            ? "bg-accent-green animate-pulse"
                            : "bg-text-disabled"
                        }`}
                      />
                      {name}
                      {i === 0 && (
                        <span className="text-xs font-medium ml-auto">
                          Active
                        </span>
                      )}
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </div>

        {/* Mission */}
        <div className="pt-3 border-t border-border-primary">
          <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">
            Mission
          </h4>
          {caseStudy ? (
            <div className="space-y-2">
              <div className="px-2 py-2 bg-accent-primary-light border border-accent-primary/20 rounded-lg">
                <p className="text-sm font-semibold text-accent-primary mb-1">
                  {caseStudy.productName}
                </p>
                <p className="text-xs text-text-secondary">
                  {caseStudy.productType}
                </p>
              </div>

              {caseStudy.funFact && (
                <div className="px-2 py-2 bg-accent-yellow-light border border-accent-yellow/20 rounded-lg">
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {caseStudy.funFact}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-text-disabled italic">
              Details will appear when the game starts.
            </p>
          )}
        </div>

        {/* Scoring Criteria */}
        {caseStudy && caseStudy.scoringCriteria.length > 0 && (
          <div className="pt-3 border-t border-border-primary">
            <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">
              Scoring Criteria
            </h4>
            <ul className="space-y-0.5">
              {caseStudy.scoringCriteria.map((criteria, i) => (
                <li
                  key={i}
                  className="flex items-start gap-1.5 text-xs text-text-tertiary"
                >
                  <span className="text-accent-yellow mt-0.5">*</span>
                  <span>{criteria}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Team Score */}
        {team && (team.peerScore > 0 || team.judgeScore > 0) && (
          <div className="pt-3 border-t border-border-primary">
            <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">
              Scores
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center px-2 py-1.5 bg-accent-green-light border border-accent-green/20 rounded-lg">
                <p className="text-xs text-text-tertiary">Peer</p>
                <p className="text-lg font-bold text-accent-green">
                  {team.peerScore}
                </p>
              </div>
              <div className="text-center px-2 py-1.5 bg-accent-yellow-light border border-accent-yellow/20 rounded-lg">
                <p className="text-xs text-text-tertiary">Judge</p>
                <p className="text-lg font-bold text-accent-yellow">
                  {team.judgeScore}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
