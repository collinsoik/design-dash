import { Server, Socket } from "socket.io";
import {
  Room,
  Player,
  Team,
  RoomConfig,
  TEAM_COLORS,
  TEAM_NAMES,
} from "@design-dash/shared";
import {
  CLIENT_EVENTS,
  SERVER_EVENTS,
  RoomCreatePayload,
  RoomJoinPayload,
} from "@design-dash/shared";

// In-memory room store
const rooms = new Map<string, Room>();

function generateRoomCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `DASH-${num}`;
}

// Ensure unique code
function createUniqueCode(): string {
  let code: string;
  do {
    code = generateRoomCode();
  } while (rooms.has(code));
  return code;
}

export function getRoom(code: string): Room | undefined {
  return rooms.get(code);
}

export function handleRoomEvents(io: Server, socket: Socket): void {
  // room:create - Host creates a new room
  socket.on(
    CLIENT_EVENTS.ROOM_CREATE,
    (payload: RoomCreatePayload, callback) => {
      const code = createUniqueCode();

      // Create teams based on configured team size
      const teams: Record<string, Team> = {};
      // Create enough teams (we'll figure out exact count when players join, start with 8 max)
      for (let i = 0; i < 8; i++) {
        const teamId = `team-${i}`;
        teams[teamId] = {
          id: teamId,
          name: TEAM_NAMES[i],
          color: TEAM_COLORS[i],
          members: [],
          peerScore: 0,
          judgeScore: 0,
          finalScore: 0,
        };
      }

      const hostPlayer: Player = {
        id: socket.id,
        displayName: "Host",
        teamId: null, // Host doesn't join a team
        isHost: true,
        connected: true,
      };

      const room: Room = {
        code,
        hostId: socket.id,
        config: {
          teamSize: payload.teamSize,
          turnTimer: payload.turnTimer,
          caseStudyId: payload.caseStudyId,
          peerVoteWeight: 40,
          judgeWeight: 60,
        },
        players: { [socket.id]: hostPlayer },
        teams,
        phase: "lobby",
        gameState: null,
        createdAt: Date.now(),
      };

      rooms.set(code, room);
      socket.join(code);

      // Store room code on socket for later reference
      (socket as any).roomCode = code;
      (socket as any).playerId = socket.id;

      callback?.({ success: true, roomCode: code, room });
    }
  );

  // room:join - Player joins an existing room
  socket.on(CLIENT_EVENTS.ROOM_JOIN, (payload: RoomJoinPayload, callback) => {
    const room = rooms.get(payload.roomCode);

    if (!room) {
      callback?.({ success: false, error: "Room not found" });
      socket.emit(SERVER_EVENTS.ROOM_ERROR, {
        message: "Room not found",
        code: "ROOM_NOT_FOUND",
      });
      return;
    }

    if (room.phase !== "lobby") {
      callback?.({ success: false, error: "Game already in progress" });
      socket.emit(SERVER_EVENTS.ROOM_ERROR, {
        message: "Game already in progress",
        code: "GAME_IN_PROGRESS",
      });
      return;
    }

    // Round-robin team assignment
    const teamEntries = Object.values(room.teams);
    const activeTeams = teamEntries.filter(
      (t) => t.members.length < room.config.teamSize
    );

    // Find team with fewest members
    let targetTeam = activeTeams.reduce(
      (min, t) => (t.members.length < min.members.length ? t : min),
      activeTeams[0]
    );

    if (!targetTeam) {
      callback?.({ success: false, error: "All teams are full" });
      socket.emit(SERVER_EVENTS.ROOM_ERROR, {
        message: "All teams are full",
        code: "TEAMS_FULL",
      });
      return;
    }

    const player: Player = {
      id: socket.id,
      displayName: payload.playerName,
      teamId: targetTeam.id,
      isHost: false,
      connected: true,
    };

    room.players[socket.id] = player;
    targetTeam.members.push(socket.id);

    socket.join(payload.roomCode);
    (socket as any).roomCode = payload.roomCode;
    (socket as any).playerId = socket.id;

    // Send full room state to the joining player
    callback?.({ success: true, room, playerId: socket.id });

    // Broadcast to everyone else in the room
    socket.to(payload.roomCode).emit(SERVER_EVENTS.ROOM_PLAYER_JOINED, {
      player: {
        id: player.id,
        displayName: player.displayName,
        teamId: player.teamId,
      },
    });

    // Send updated room state to all
    io.to(payload.roomCode).emit(SERVER_EVENTS.ROOM_STATE, room);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const roomCode = (socket as any).roomCode;
    if (!roomCode) return;

    const room = rooms.get(roomCode);
    if (!room) return;

    const player = room.players[socket.id];
    if (player) {
      player.connected = false;
      io.to(roomCode).emit(SERVER_EVENTS.ROOM_PLAYER_LEFT, {
        playerId: socket.id,
      });
      io.to(roomCode).emit(SERVER_EVENTS.ROOM_STATE, room);
    }
  });
}

export { rooms };
