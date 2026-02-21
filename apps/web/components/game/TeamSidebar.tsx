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

  // Active player for this team in the current turn
  const activePlayerId = useMemo(() => {
    if (!room?.gameState?.currentTurn || !myTeamId) return null;
    return room.gameState.currentTurn.activePlayerIds[myTeamId] ?? null;
  }, [room, myTeamId]);

  // Assigned slots map: playerId -> slotIds
  const assignedSlots = room?.gameState?.currentTurn?.assignedSlots ?? {};

  // Team members with details
  const members = useMemo(() => {
    if (!room || !team) return [];
    return team.members.map((memberId) => {
      const player = room.players[memberId];
      const isActive = memberId === activePlayerId;
      const isConnected = player?.connected ?? false;
      const slots = assignedSlots[memberId] ?? [];

      return {
        id: memberId,
        name: player?.displayName ?? "Unknown",
        isActive,
        isConnected,
        isCurrentPlayer: memberId === playerId,
        assignedSlots: slots,
      };
    });
  }, [room, team, activePlayerId, assignedSlots, playerId]);

  // Case study info
  const caseStudy = room?.gameState?.caseStudy ?? null;

  // Get section labels for assigned slot IDs
  const getSectionLabel = (slotId: string): string => {
    if (!room?.gameState || !myTeamId) return slotId;
    const website = room.gameState.teamWebsites[myTeamId];
    const section = website?.sections.find((s) => s.id === slotId);
    return section?.label ?? slotId;
  };

  return (
    <aside className="w-56 border-l-3 border-game-blue bg-game-dark/80 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b-3 border-game-blue">
        <div className="flex items-center justify-center gap-2">
          {team && (
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: team.color }}
            />
          )}
          <h2 className="font-pixel text-[10px] text-game-yellow text-center">
            {team?.name ?? "YOUR TEAM"}
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* ── Team Members ───────────────────────── */}
        <div>
          <h4 className="font-pixel text-[8px] text-gray-400 mb-2">
            MEMBERS
          </h4>
          <div className="space-y-1.5">
            {members.length > 0 ? (
              members.map((member) => (
                <div
                  key={member.id}
                  className={`
                    flex items-center gap-2 px-2 py-1.5 rounded text-xs
                    ${
                      member.isActive
                        ? "bg-game-green/15 border border-game-green/50 text-game-green"
                        : member.isConnected
                        ? "text-gray-300"
                        : "text-gray-600 opacity-60"
                    }
                  `}
                >
                  {/* Status dot */}
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      member.isActive
                        ? "bg-game-green animate-pulse"
                        : member.isConnected
                        ? "bg-game-blue"
                        : "bg-gray-700"
                    }`}
                  />

                  {/* Player name */}
                  <span className="truncate flex-1">
                    {member.name}
                    {member.isCurrentPlayer && (
                      <span className="text-game-yellow ml-1">(you)</span>
                    )}
                  </span>

                  {/* Status badge */}
                  <span className="font-pixel text-[6px] flex-shrink-0">
                    {member.isActive
                      ? "ACTIVE"
                      : !member.isConnected
                      ? "OFFLINE"
                      : "WAITING"}
                  </span>
                </div>
              ))
            ) : (
              /* Placeholder members */
              <>
                {["Player 1", "Player 2", "Player 3", "Player 4"].map(
                  (name, i) => (
                    <div
                      key={name}
                      className={`flex items-center gap-2 px-2 py-1.5 text-xs ${
                        i === 0
                          ? "bg-game-green/15 border border-game-green/50 text-game-green"
                          : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          i === 0
                            ? "bg-game-green animate-pulse"
                            : "bg-gray-600"
                        }`}
                      />
                      {name}
                      {i === 0 && (
                        <span className="font-pixel text-[6px] ml-auto">
                          ACTIVE
                        </span>
                      )}
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Assigned Sections ──────────────────── */}
        {members.some((m) => m.assignedSlots.length > 0) && (
          <div>
            <h4 className="font-pixel text-[8px] text-gray-400 mb-2">
              ASSIGNMENTS
            </h4>
            <div className="space-y-2">
              {members
                .filter((m) => m.assignedSlots.length > 0)
                .map((member) => (
                  <div key={member.id}>
                    <p className="font-pixel text-[7px] text-gray-300 mb-1">
                      {member.name}:
                    </p>
                    <div className="pl-2 space-y-0.5">
                      {member.assignedSlots.map((slotId) => (
                        <div
                          key={slotId}
                          className="flex items-center gap-1.5 text-[10px] text-gray-500"
                        >
                          <div className="w-1 h-1 bg-game-blue rounded-full" />
                          <span>{getSectionLabel(slotId)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── Case Study Info ────────────────────── */}
        <div className="pt-3 border-t border-gray-700">
          <h4 className="font-pixel text-[8px] text-gray-400 mb-2">
            CASE STUDY
          </h4>
          {caseStudy ? (
            <div className="space-y-2">
              <div className="px-2 py-1.5 bg-game-blue/10 border border-game-blue/30 rounded">
                <p className="font-pixel text-[7px] text-game-yellow mb-0.5">
                  {caseStudy.businessName}
                </p>
                <p className="text-[10px] text-gray-400">
                  {caseStudy.businessType}
                </p>
              </div>

              {/* Scoring criteria */}
              {caseStudy.scoringCriteria.length > 0 && (
                <div>
                  <p className="font-pixel text-[6px] text-gray-500 mb-1">
                    SCORING CRITERIA:
                  </p>
                  <ul className="space-y-0.5">
                    {caseStudy.scoringCriteria.map((criteria, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-1.5 text-[10px] text-gray-500"
                      >
                        <span className="text-game-green mt-0.5">*</span>
                        <span>{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-600 italic">
              Case study details will appear here during gameplay.
            </p>
          )}
        </div>

        {/* ── Team Score ─────────────────────────── */}
        {team && (team.peerScore > 0 || team.judgeScore > 0) && (
          <div className="pt-3 border-t border-gray-700">
            <h4 className="font-pixel text-[8px] text-gray-400 mb-2">
              SCORES
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center px-2 py-1.5 bg-game-blue/10 border border-game-blue/30 rounded">
                <p className="font-pixel text-[6px] text-gray-500">PEER</p>
                <p className="font-pixel text-sm text-game-green">
                  {team.peerScore}
                </p>
              </div>
              <div className="text-center px-2 py-1.5 bg-game-blue/10 border border-game-blue/30 rounded">
                <p className="font-pixel text-[6px] text-gray-500">JUDGE</p>
                <p className="font-pixel text-sm text-game-yellow">
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
