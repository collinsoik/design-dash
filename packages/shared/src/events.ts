// ==========================================
// Socket.IO Event Constants
// ==========================================

// Client → Server Events
export const CLIENT_EVENTS = {
  ROOM_CREATE: "room:create",
  ROOM_JOIN: "room:join",
  GAME_START: "game:start",
  TURN_PLACE: "turn:place",
  TURN_REMOVE: "turn:remove",
  TURN_SUBMIT: "turn:submit",
  BRAINSTORM_MESSAGE: "brainstorm:message",
  VOTE_SUBMIT: "vote:submit",
  JUDGE_SCORE: "judge:score",
} as const;

// Server → Client Events
export const SERVER_EVENTS = {
  ROOM_STATE: "room:state",
  ROOM_PLAYER_JOINED: "room:player-joined",
  ROOM_PLAYER_LEFT: "room:player-left",
  ROOM_ERROR: "room:error",
  GAME_STARTED: "game:started",
  TURN_CHANGED: "turn:changed",
  TURN_TICK: "turn:tick",
  CANVAS_UPDATED: "canvas:updated",
  BRAINSTORM_NEW: "brainstorm:new",
  VOTE_RESULTS: "vote:results",
  GAME_ENDED: "game:ended",
} as const;

// Event Payload Types
export interface RoomCreatePayload {
  teamSize: number;
  turnTimer: number;
  caseStudyId: string;
}

export interface RoomJoinPayload {
  roomCode: string;
  playerName: string;
}

export interface TurnPlacePayload {
  slotId: string;
  componentId: string;
}

export interface TurnRemovePayload {
  slotId: string;
}

export interface BrainstormMessagePayload {
  text: string;
}

export interface VoteSubmitPayload {
  teamId: string;
  rating: number;
}

export interface JudgeScorePayload {
  teamId: string;
  score: number;
  notes?: string;
}

// Server Event Payloads
export interface RoomPlayerJoinedPayload {
  player: {
    id: string;
    displayName: string;
    teamId: string | null;
  };
}

export interface TurnChangedPayload {
  turnNumber: number;
  activePlayerIds: Record<string, string>;
  timeRemaining: number;
  assignedSlots: Record<string, string[]>;
}

export interface CanvasUpdatedPayload {
  teamId: string;
  slotId: string;
  component: {
    registryId: string;
    customizations?: Record<string, string>;
  } | null;
}

export interface RoomErrorPayload {
  message: string;
  code?: string;
}
