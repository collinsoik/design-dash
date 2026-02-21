import { Room, GameState, TeamDecisionState, PlayerDecision } from "@design-dash/shared";

export function getTeamDecisions(
  room: Room,
  teamId: string
): TeamDecisionState | null {
  if (!room.gameState) return null;
  return room.gameState.teamDecisions[teamId] || null;
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

export function getDecisionsForRound(
  room: Room,
  teamId: string,
  round: number
): PlayerDecision[] {
  if (!room.gameState) return [];
  const teamState = room.gameState.teamDecisions[teamId];
  if (!teamState) return [];

  const roundDecisionIds = room.gameState.caseStudy.decisions
    .filter((d) => d.round === round)
    .map((d) => d.id);

  return roundDecisionIds
    .map((id) => teamState.decisions[id])
    .filter(Boolean);
}
