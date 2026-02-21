import { Room, GameState, WebsiteState, SectionSlot } from "@design-dash/shared";

export function getTeamWebsite(
  room: Room,
  teamId: string
): WebsiteState | null {
  if (!room.gameState) return null;
  return room.gameState.teamWebsites[teamId] || null;
}

export function isPlayerActive(room: Room, playerId: string): boolean {
  if (!room.gameState) return false;
  return Object.values(room.gameState.currentTurn.activePlayerIds).includes(
    playerId
  );
}

export function getPlayerTeamId(room: Room, playerId: string): string | null {
  const player = room.players[playerId];
  return player?.teamId || null;
}

export function getAssignedSlots(room: Room, playerId: string): string[] {
  if (!room.gameState) return [];
  return room.gameState.currentTurn.assignedSlots[playerId] || [];
}
