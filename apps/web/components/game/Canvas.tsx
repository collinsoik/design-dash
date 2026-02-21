"use client";

import { useMemo } from "react";
import type { SectionSlot as SectionSlotType } from "@/lib/types";
import { useGameStore } from "@/lib/game-store";
import SectionSlot from "./SectionSlot";

export default function Canvas() {
  const room = useGameStore((s) => s.room);
  const playerId = useGameStore((s) => s.playerId);

  // Determine the current player's team
  const myTeamId = useMemo(() => {
    if (!room || !playerId) return null;
    const player = room.players[playerId];
    return player?.teamId ?? null;
  }, [room, playerId]);

  // Get the website sections for this team
  const sections: SectionSlotType[] = useMemo(() => {
    if (!room?.gameState || !myTeamId) return [];
    const teamWebsite = room.gameState.teamWebsites[myTeamId];
    return teamWebsite?.sections ?? [];
  }, [room, myTeamId]);

  // Get the active player IDs and assigned slots
  const turnState = room?.gameState?.currentTurn ?? null;

  // Determine which player is active for this team
  const activePlayerId = useMemo(() => {
    if (!turnState || !myTeamId) return null;
    return turnState.activePlayerIds[myTeamId] ?? null;
  }, [turnState, myTeamId]);

  // Get assigned slot IDs for the active player
  const activePlayerAssignedSlots = useMemo<Set<string>>(() => {
    if (!turnState || !activePlayerId) return new Set();
    const slotIds = turnState.assignedSlots[activePlayerId] ?? [];
    return new Set(slotIds);
  }, [turnState, activePlayerId]);

  // Build a player name lookup
  const playerNames = useMemo<Record<string, string>>(() => {
    if (!room) return {};
    const names: Record<string, string> = {};
    for (const [pid, player] of Object.entries(room.players)) {
      names[pid] = player.displayName;
    }
    return names;
  }, [room]);

  const isMyTurn = playerId === activePlayerId;

  // Fallback placeholder sections when no game state exists yet
  const placeholderSections: SectionSlotType[] = useMemo(
    () => [
      { id: "header", label: "Header", assignedTo: null, turnOrder: 1, placedComponent: null, status: "empty" },
      { id: "hero", label: "Hero Section", assignedTo: null, turnOrder: 2, placedComponent: null, status: "empty" },
      { id: "features", label: "Features", assignedTo: null, turnOrder: 3, placedComponent: null, status: "empty" },
      { id: "content", label: "Content", assignedTo: null, turnOrder: 4, placedComponent: null, status: "empty" },
      { id: "cta", label: "Call to Action", assignedTo: null, turnOrder: 5, placedComponent: null, status: "empty" },
      { id: "footer", label: "Footer", assignedTo: null, turnOrder: 6, placedComponent: null, status: "empty" },
    ],
    []
  );

  const displaySections = sections.length > 0 ? sections : placeholderSections;
  const placedCount = displaySections.filter((s) => s.status === "placed" || s.status === "locked").length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Canvas header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-game-blue/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-game-green animate-pulse" />
          <span className="font-pixel text-[10px] text-gray-400">
            WEBSITE PREVIEW
          </span>
        </div>
        {room?.gameState?.caseStudy && (
          <span className="font-pixel text-[9px] text-game-yellow truncate max-w-[200px]">
            {room.gameState.caseStudy.businessName}
          </span>
        )}
        <span className="font-pixel text-[9px] text-gray-500">
          {placedCount}/{displaySections.length} placed
        </span>
      </div>

      {/* Canvas body -- scrollable section list */}
      <div className="flex-1 overflow-y-auto bg-game-dark/40 p-4">
        {/* Browser chrome frame */}
        <div className="max-w-2xl mx-auto">
          {/* Faux browser bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/80 rounded-t-lg border border-gray-700 border-b-0">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-game-red/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-game-yellow/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-game-green/70" />
            </div>
            <div className="flex-1 mx-4 bg-gray-900 rounded px-3 py-0.5">
              <span className="text-xs text-gray-500">
                {room?.gameState?.caseStudy
                  ? `www.${room.gameState.caseStudy.businessName
                      .toLowerCase()
                      .replace(/\s+/g, "")}.com`
                  : "www.example.com"}
              </span>
            </div>
          </div>

          {/* Sections container */}
          <div className="bg-gray-900/50 border border-gray-700 border-t-0 rounded-b-lg overflow-hidden">
            <div className="space-y-0">
              {displaySections.map((slot) => (
                <SectionSlot
                  key={slot.id}
                  slot={slot}
                  isActivePlayerSlot={
                    isMyTurn && activePlayerAssignedSlots.has(slot.id)
                  }
                  assignedPlayerName={
                    slot.assignedTo ? playerNames[slot.assignedTo] : undefined
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
