// ==========================================
// Socket.IO Event Constants
// ==========================================

// Client -> Server Events
export const CLIENT_EVENTS = {
  ROOM_CREATE: "room:create",
  ROOM_JOIN: "room:join",
  ROOM_REJOIN: "room:rejoin",
  GAME_START: "game:start",
  DECISION_SUBMIT: "decision:submit",
  TURN_SUBMIT: "turn:submit",
  BRAINSTORM_MESSAGE: "brainstorm:message",
  VOTE_SUBMIT: "vote:submit",
  JUDGE_SCORE: "judge:score",
} as const;

// Server -> Client Events
export const SERVER_EVENTS = {
  ROOM_STATE: "room:state",
  ROOM_PLAYER_JOINED: "room:player-joined",
  ROOM_PLAYER_LEFT: "room:player-left",
  ROOM_ERROR: "room:error",
  GAME_STARTED: "game:started",
  TURN_CHANGED: "turn:changed",
  TURN_TICK: "turn:tick",
  DECISION_RECORDED: "decision:recorded",
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

export interface DecisionSubmitPayload {
  decisionPointId: string;
  choiceId?: string;        // for multiple_choice
  sliderValue?: number;     // for tradeoff_slider (0-100)
  branchId?: string;        // for branching_path
  followUpChoiceId?: string; // for branching_path follow-up
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
  round: number;
  activePlayerIds: Record<string, string>;
  timeRemaining: number;
  submittedTeams: string[];
}

export interface DecisionRecordedPayload {
  teamId: string;
  decisionPointId: string;
  decision: {
    type: string;
    choiceId?: string;
    sliderValue?: number;
    branchId?: string;
    followUpChoiceId?: string;
  };
}

export interface RoomErrorPayload {
  message: string;
  code?: string;
}
