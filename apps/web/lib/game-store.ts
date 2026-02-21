import { create } from "zustand";
import type {
  Room,
  GamePhase,
  GameState,
  BrainstormMessage,
  GameResults,
  TurnState,
  PlayerDecision,
  DecisionRecordedPayload,
} from "@design-dash/shared";

interface GameStore {
  // State
  room: Room | null;
  playerId: string | null;
  phase: GamePhase;
  gameState: GameState | null;
  messages: BrainstormMessage[];
  results: GameResults | null;
  error: string | null;

  // Actions
  setRoom: (room: Room) => void;
  setPlayerId: (playerId: string) => void;
  setPhase: (phase: GamePhase) => void;
  setGameState: (gameState: GameState) => void;
  updateTurn: (turn: TurnState) => void;
  updateTimeRemaining: (time: number) => void;
  recordDecision: (payload: DecisionRecordedPayload) => void;
  addMessage: (message: BrainstormMessage) => void;
  setResults: (results: GameResults) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  room: null as Room | null,
  playerId: null as string | null,
  phase: "lobby" as GamePhase,
  gameState: null as GameState | null,
  messages: [] as BrainstormMessage[],
  results: null as GameResults | null,
  error: null as string | null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  setRoom: (room) => {
    const updates: Partial<GameStore> = { room, phase: room.phase };
    if (room.gameState) {
      updates.gameState = room.gameState;
    }
    set(updates);
  },
  setPlayerId: (playerId) => set({ playerId }),
  setPhase: (phase) => set({ phase }),
  setGameState: (gameState) => {
    const { room } = get();
    if (room) {
      set({ gameState, room: { ...room, gameState } });
    } else {
      set({ gameState });
    }
  },

  updateTurn: (turn) => {
    const { gameState, room } = get();
    if (!gameState) return;
    const updatedGameState = { ...gameState, currentTurn: turn };
    const updates: Partial<GameStore> = { gameState: updatedGameState };
    if (room) {
      updates.room = { ...room, gameState: updatedGameState };
    }
    set(updates);
  },

  updateTimeRemaining: (time) => {
    const { gameState, room } = get();
    if (!gameState) return;
    const updatedGameState = {
      ...gameState,
      currentTurn: { ...gameState.currentTurn, timeRemaining: time },
    };
    const updates: Partial<GameStore> = { gameState: updatedGameState };
    if (room) {
      updates.room = { ...room, gameState: updatedGameState };
    }
    set(updates);
  },

  recordDecision: (payload) => {
    const { gameState, room } = get();
    if (!gameState) return;

    const teamState = gameState.teamDecisions[payload.teamId];
    if (!teamState) return;

    const decision: PlayerDecision = {
      decisionPointId: payload.decisionPointId,
      type: payload.decision.type as PlayerDecision["type"],
      choiceId: payload.decision.choiceId,
      sliderValue: payload.decision.sliderValue,
      branchId: payload.decision.branchId,
      followUpChoiceId: payload.decision.followUpChoiceId,
      submittedAt: Date.now(),
    };

    const updatedGameState = {
      ...gameState,
      teamDecisions: {
        ...gameState.teamDecisions,
        [payload.teamId]: {
          ...teamState,
          decisions: {
            ...teamState.decisions,
            [payload.decisionPointId]: decision,
          },
        },
      },
    };
    const updates: Partial<GameStore> = { gameState: updatedGameState };
    if (room) {
      updates.room = { ...room, gameState: updatedGameState };
    }
    set(updates);
  },

  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },

  setResults: (results) => set({ results }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
