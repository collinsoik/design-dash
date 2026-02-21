import { Server, Socket } from "socket.io";
import {
  CLIENT_EVENTS,
  SERVER_EVENTS,
  DecisionSubmitPayload,
} from "@design-dash/shared";
import {
  GameState,
  TurnState,
  TeamDecisionState,
  PlayerDecision,
  CaseStudy,
} from "@design-dash/shared";
import { CASE_STUDIES } from "@design-dash/shared";
import { getRoom, rooms } from "./rooms";
import { saveGame } from "./db";

// Active timers per room
const roomTimers = new Map<string, NodeJS.Timeout>();

function getTotalRounds(caseStudy: CaseStudy): number {
  const rounds = new Set(caseStudy.decisions.map((d) => d.round));
  return rounds.size;
}

function getActivePlayersForRound(
  room: any,
  round: number
): Record<string, string> {
  const activePlayerIds: Record<string, string> = {};

  for (const team of Object.values(room.teams) as any[]) {
    if (team.members.length === 0) continue;

    // Round-robin: each round, the next team member is the active player
    const memberIndex = round % team.members.length;
    activePlayerIds[team.id] = team.members[memberIndex];
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

    // Time's up - advance round
    if (r.gameState.currentTurn.timeRemaining <= 0) {
      clearInterval(timer);
      roomTimers.delete(roomCode);
      advanceRound(io, roomCode);
    }
  }, 1000);

  roomTimers.set(roomCode, timer);
}

function advanceRound(io: Server, roomCode: string): void {
  const room = getRoom(roomCode);
  if (!room || !room.gameState) return;

  const currentRound = room.gameState.currentTurn.round;
  const nextRound = currentRound + 1;

  if (nextRound >= room.gameState.totalRounds) {
    // Game over - move to voting
    room.phase = "voting";
    io.to(roomCode).emit(SERVER_EVENTS.ROOM_STATE, room);
    return;
  }

  // Set up next round
  const activePlayerIds = getActivePlayersForRound(room, nextRound);

  room.gameState.currentTurn = {
    round: nextRound,
    activePlayerIds,
    timeRemaining: room.config.turnTimer,
    submittedTeams: [],
  };

  io.to(roomCode).emit(SERVER_EVENTS.TURN_CHANGED, {
    round: nextRound,
    activePlayerIds,
    timeRemaining: room.config.turnTimer,
    submittedTeams: [],
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

    // Build team decision state
    const teamDecisions: Record<string, TeamDecisionState> = {};
    for (const team of Object.values(room.teams)) {
      if (team.members.length === 0) continue;
      teamDecisions[team.id] = { decisions: {} };
    }

    // Get active players for round 0
    const activePlayerIds = getActivePlayersForRound(room, 0);
    const totalRounds = getTotalRounds(caseStudy);

    room.gameState = {
      caseStudy,
      teamDecisions,
      totalRounds,
      currentTurn: {
        round: 0,
        activePlayerIds,
        timeRemaining: room.config.turnTimer,
        submittedTeams: [],
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

  // decision:submit - Player submits a decision for a decision point
  socket.on(
    CLIENT_EVENTS.DECISION_SUBMIT,
    (payload: DecisionSubmitPayload) => {
      const roomCode = (socket as any).roomCode;
      const room = getRoom(roomCode);
      if (!room || !room.gameState || room.phase !== "playing") return;

      const player = room.players[socket.id];
      if (!player || !player.teamId) return;

      // Check if this player is the active player for their team
      const activePlayerId =
        room.gameState.currentTurn.activePlayerIds[player.teamId];
      if (activePlayerId !== socket.id) return;

      // Validate the decision point exists and is for the current round
      const decisionPoint = room.gameState.caseStudy.decisions.find(
        (d) => d.id === payload.decisionPointId
      );
      if (!decisionPoint) return;
      if (decisionPoint.round !== room.gameState.currentTurn.round) return;

      // Record the decision
      const teamState = room.gameState.teamDecisions[player.teamId];
      if (!teamState) return;

      const decision: PlayerDecision = {
        decisionPointId: payload.decisionPointId,
        type: decisionPoint.type,
        choiceId: payload.choiceId,
        sliderValue: payload.sliderValue,
        branchId: payload.branchId,
        followUpChoiceId: payload.followUpChoiceId,
        submittedAt: Date.now(),
      };

      teamState.decisions[payload.decisionPointId] = decision;

      // Broadcast decision recorded to all players
      io.to(roomCode).emit(SERVER_EVENTS.DECISION_RECORDED, {
        teamId: player.teamId,
        decisionPointId: payload.decisionPointId,
        decision: {
          type: decisionPoint.type,
          choiceId: payload.choiceId,
          sliderValue: payload.sliderValue,
          branchId: payload.branchId,
          followUpChoiceId: payload.followUpChoiceId,
        },
      });
    }
  );

  // turn:submit - Player ends their round early
  socket.on(CLIENT_EVENTS.TURN_SUBMIT, () => {
    const roomCode = (socket as any).roomCode;
    const room = getRoom(roomCode);
    if (!room || !room.gameState || room.phase !== "playing") return;

    const player = room.players[socket.id];
    if (!player || !player.teamId) return;

    // Check if this player is the active player for their team
    const activePlayerId =
      room.gameState.currentTurn.activePlayerIds[player.teamId];
    if (activePlayerId !== socket.id) return;

    // Mark this team as submitted for this round
    if (!room.gameState.currentTurn.submittedTeams.includes(player.teamId)) {
      room.gameState.currentTurn.submittedTeams.push(player.teamId);
    }

    // Remove from active players
    delete room.gameState.currentTurn.activePlayerIds[player.teamId];

    // If all teams have submitted, advance round
    if (Object.keys(room.gameState.currentTurn.activePlayerIds).length === 0) {
      const existingTimer = roomTimers.get(roomCode);
      if (existingTimer) clearInterval(existingTimer);
      roomTimers.delete(roomCode);
      advanceRound(io, roomCode);
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
