import { Server, Socket } from "socket.io";
import {
  CLIENT_EVENTS,
  SERVER_EVENTS,
  TurnPlacePayload,
  TurnRemovePayload,
} from "@design-dash/shared";
import {
  GameState,
  TurnState,
  WebsiteState,
  SectionSlot,
} from "@design-dash/shared";
import { CASE_STUDIES } from "@design-dash/shared";
import { getRoom, rooms } from "./rooms";
import { saveGame } from "./db";

// Active timers per room
const roomTimers = new Map<string, NodeJS.Timeout>();

function assignSectionsToPlayers(room: any): Record<string, string[]> {
  const assignments: Record<string, string[]> = {};

  // For each team, distribute sections among team members
  for (const team of Object.values(room.teams) as any[]) {
    if (team.members.length === 0) continue;

    const caseStudy = CASE_STUDIES.find(
      (cs) => cs.id === room.config.caseStudyId
    );
    if (!caseStudy) continue;

    const sections = caseStudy.brokenSections;
    const memberCount = team.members.length;

    // Distribute sections round-robin among team members
    sections.forEach((section: SectionSlot, index: number) => {
      const memberIndex = index % memberCount;
      const playerId = team.members[memberIndex];

      if (!assignments[playerId]) {
        assignments[playerId] = [];
      }
      assignments[playerId].push(section.id);
    });
  }

  return assignments;
}

function getMaxTurnOrder(room: any): number {
  const caseStudy = CASE_STUDIES.find(
    (cs) => cs.id === room.config.caseStudyId
  );
  if (!caseStudy) return 0;
  return Math.max(...caseStudy.brokenSections.map((s) => s.turnOrder));
}

function getActivePlayersForTurn(
  room: any,
  turnNumber: number
): Record<string, string> {
  const activePlayerIds: Record<string, string> = {};
  const caseStudy = CASE_STUDIES.find(
    (cs) => cs.id === room.config.caseStudyId
  );
  if (!caseStudy) return activePlayerIds;

  // Get slots for this turn
  const turnSlots = caseStudy.brokenSections.filter(
    (s) => s.turnOrder === turnNumber
  );

  for (const team of Object.values(room.teams) as any[]) {
    if (team.members.length === 0) continue;

    // The active player is the one assigned to the first slot of this turn
    for (const slotDef of turnSlots) {
      const website = room.gameState?.teamWebsites[team.id];
      if (website) {
        const slot = website.sections.find(
          (s: SectionSlot) => s.id === slotDef.id
        );
        if (slot?.assignedTo && !activePlayerIds[team.id]) {
          activePlayerIds[team.id] = slot.assignedTo;
        }
      }
    }
  }

  return activePlayerIds;
}

function startTurnTimer(io: Server, roomCode: string): void {
  // Clear any existing timer
  const existing = roomTimers.get(roomCode);
  if (existing) clearInterval(existing);

  const room = getRoom(roomCode);
  if (!room || !room.gameState) return;

  const timer = setInterval(() => {
    const r = getRoom(roomCode);
    if (!r || !r.gameState) {
      clearInterval(timer);
      roomTimers.delete(roomCode);
      return;
    }

    r.gameState.currentTurn.timeRemaining -= 1;

    // Broadcast tick
    io.to(roomCode).emit(SERVER_EVENTS.TURN_TICK, {
      timeRemaining: r.gameState.currentTurn.timeRemaining,
    });

    // Time's up - advance turn
    if (r.gameState.currentTurn.timeRemaining <= 0) {
      clearInterval(timer);
      roomTimers.delete(roomCode);
      advanceTurn(io, roomCode);
    }
  }, 1000);

  roomTimers.set(roomCode, timer);
}

function advanceTurn(io: Server, roomCode: string): void {
  const room = getRoom(roomCode);
  if (!room || !room.gameState) return;

  // Lock current turn's slots
  const currentTurnNumber = room.gameState.currentTurn.turnNumber;
  for (const website of Object.values(room.gameState.teamWebsites)) {
    for (const section of website.sections) {
      if (
        section.turnOrder === currentTurnNumber &&
        section.status === "placed"
      ) {
        section.status = "locked";
      }
    }
  }

  const maxTurn = getMaxTurnOrder(room);
  const nextTurnNumber = currentTurnNumber + 1;

  if (nextTurnNumber > maxTurn) {
    // Game over - move to voting
    room.phase = "voting";
    io.to(roomCode).emit(SERVER_EVENTS.ROOM_STATE, room);
    return;
  }

  // Set up next turn
  const activePlayerIds = getActivePlayersForTurn(room, nextTurnNumber);

  room.gameState.currentTurn = {
    turnNumber: nextTurnNumber,
    activePlayerIds,
    timeRemaining: room.config.turnTimer,
    assignedSlots: room.gameState.currentTurn.assignedSlots,
  };

  io.to(roomCode).emit(SERVER_EVENTS.TURN_CHANGED, {
    turnNumber: nextTurnNumber,
    activePlayerIds,
    timeRemaining: room.config.turnTimer,
    assignedSlots: room.gameState.currentTurn.assignedSlots,
  });

  startTurnTimer(io, roomCode);
}

export function handleTurnEvents(io: Server, socket: Socket): void {
  // game:start - Host starts the game
  socket.on(CLIENT_EVENTS.GAME_START, (_, callback) => {
    const roomCode = (socket as any).roomCode;
    const room = getRoom(roomCode);

    if (!room) {
      callback?.({ success: false, error: "Room not found" });
      return;
    }

    if (room.hostId !== socket.id) {
      callback?.({ success: false, error: "Only the host can start the game" });
      return;
    }

    const caseStudy = CASE_STUDIES.find(
      (cs) => cs.id === room.config.caseStudyId
    );
    if (!caseStudy) {
      callback?.({ success: false, error: "Case study not found" });
      return;
    }

    // Build team websites and assign sections
    const teamWebsites: Record<string, WebsiteState> = {};
    const assignments = assignSectionsToPlayers(room);

    for (const team of Object.values(room.teams)) {
      if (team.members.length === 0) continue;

      const sections: SectionSlot[] = caseStudy.brokenSections.map((s) => {
        // Find which player in this team is assigned this section
        let assignedPlayer: string | null = null;
        for (const memberId of team.members) {
          if (assignments[memberId]?.includes(s.id)) {
            assignedPlayer = memberId;
            break;
          }
        }

        return {
          ...s,
          assignedTo: assignedPlayer,
          placedComponent: null,
          status: "empty" as const,
        };
      });

      teamWebsites[team.id] = { sections };
    }

    // Get active players for turn 0
    const activePlayerIds: Record<string, string> = {};
    for (const team of Object.values(room.teams)) {
      if (team.members.length === 0) continue;
      const turnSlots = caseStudy.brokenSections.filter(
        (s) => s.turnOrder === 0
      );
      for (const slot of turnSlots) {
        for (const memberId of team.members) {
          if (
            assignments[memberId]?.includes(slot.id) &&
            !activePlayerIds[team.id]
          ) {
            activePlayerIds[team.id] = memberId;
          }
        }
      }
    }

    room.gameState = {
      caseStudy,
      teamWebsites,
      totalTurns: getMaxTurnOrder(room) + 1,
      currentTurn: {
        turnNumber: 0,
        activePlayerIds,
        timeRemaining: room.config.turnTimer,
        assignedSlots: assignments,
      },
    };

    room.phase = "playing";

    // Save game to DB
    saveGame(room);

    // Broadcast game started
    io.to(roomCode).emit(SERVER_EVENTS.GAME_STARTED, room.gameState);
    io.to(roomCode).emit(SERVER_EVENTS.ROOM_STATE, room);

    // Start turn timer
    startTurnTimer(io, roomCode);

    callback?.({ success: true });
  });

  // turn:place - Player places a component in a slot
  socket.on(CLIENT_EVENTS.TURN_PLACE, (payload: TurnPlacePayload) => {
    const roomCode = (socket as any).roomCode;
    const room = getRoom(roomCode);
    if (!room || !room.gameState || room.phase !== "playing") return;

    const player = room.players[socket.id];
    if (!player || !player.teamId) return;

    // Check if this player is the active player for their team
    const activePlayerId =
      room.gameState.currentTurn.activePlayerIds[player.teamId];
    if (activePlayerId !== socket.id) return;

    // Check if this slot is assigned to this player
    const assignedSlots =
      room.gameState.currentTurn.assignedSlots[socket.id] || [];
    if (!assignedSlots.includes(payload.slotId)) return;

    // Place the component
    const website = room.gameState.teamWebsites[player.teamId];
    if (!website) return;

    const slot = website.sections.find((s) => s.id === payload.slotId);
    if (!slot || slot.status === "locked") return;

    slot.placedComponent = { registryId: payload.componentId };
    slot.status = "placed";

    // Broadcast canvas update to the team
    io.to(roomCode).emit(SERVER_EVENTS.CANVAS_UPDATED, {
      teamId: player.teamId,
      slotId: payload.slotId,
      component: slot.placedComponent,
    });
  });

  // turn:remove - Player removes a component from a slot
  socket.on(CLIENT_EVENTS.TURN_REMOVE, (payload: TurnRemovePayload) => {
    const roomCode = (socket as any).roomCode;
    const room = getRoom(roomCode);
    if (!room || !room.gameState || room.phase !== "playing") return;

    const player = room.players[socket.id];
    if (!player || !player.teamId) return;

    const activePlayerId =
      room.gameState.currentTurn.activePlayerIds[player.teamId];
    if (activePlayerId !== socket.id) return;

    const assignedSlots =
      room.gameState.currentTurn.assignedSlots[socket.id] || [];
    if (!assignedSlots.includes(payload.slotId)) return;

    const website = room.gameState.teamWebsites[player.teamId];
    if (!website) return;

    const slot = website.sections.find((s) => s.id === payload.slotId);
    if (!slot || slot.status === "locked") return;

    slot.placedComponent = null;
    slot.status = "empty";

    io.to(roomCode).emit(SERVER_EVENTS.CANVAS_UPDATED, {
      teamId: player.teamId,
      slotId: payload.slotId,
      component: null,
    });
  });

  // turn:submit - Player ends their turn early
  socket.on(CLIENT_EVENTS.TURN_SUBMIT, () => {
    const roomCode = (socket as any).roomCode;
    const room = getRoom(roomCode);
    if (!room || !room.gameState || room.phase !== "playing") return;

    const player = room.players[socket.id];
    if (!player || !player.teamId) return;

    // Check if ALL active players for this turn have submitted
    // For now, just check if this player's team is done
    const activePlayerId =
      room.gameState.currentTurn.activePlayerIds[player.teamId];
    if (activePlayerId !== socket.id) return;

    // Mark this team as submitted for this turn
    delete room.gameState.currentTurn.activePlayerIds[player.teamId];

    // If all teams have submitted, advance turn
    if (Object.keys(room.gameState.currentTurn.activePlayerIds).length === 0) {
      const existingTimer = roomTimers.get(roomCode);
      if (existingTimer) clearInterval(existingTimer);
      roomTimers.delete(roomCode);
      advanceTurn(io, roomCode);
    }
  });

  // brainstorm:message - Team chat
  socket.on(
    CLIENT_EVENTS.BRAINSTORM_MESSAGE,
    (payload: { text: string }) => {
      const roomCode = (socket as any).roomCode;
      const room = getRoom(roomCode);
      if (!room) return;

      const player = room.players[socket.id];
      if (!player || !player.teamId) return;

      const message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        playerId: socket.id,
        playerName: player.displayName,
        teamId: player.teamId,
        text: payload.text,
        timestamp: Date.now(),
      };

      // Broadcast to team members only
      const team = room.teams[player.teamId];
      if (team) {
        for (const memberId of team.members) {
          io.to(memberId).emit(SERVER_EVENTS.BRAINSTORM_NEW, message);
        }
        // Also send to host
        io.to(room.hostId).emit(SERVER_EVENTS.BRAINSTORM_NEW, message);
      }
    }
  );
}
