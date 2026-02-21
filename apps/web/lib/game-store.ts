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

  setRoom: (room) => set({ room, phase: room.phase }),
  setPlayerId: (playerId) => set({ playerId }),
  setPhase: (phase) => set({ phase }),
  setGameState: (gameState) => set({ gameState }),

  updateTurn: (turn) => {
    const { gameState } = get();
    if (!gameState) return;
    set({ gameState: { ...gameState, currentTurn: turn } });
  },

  updateTimeRemaining: (time) => {
    const { gameState } = get();
    if (!gameState) return;
    set({
      gameState: {
        ...gameState,
        currentTurn: { ...gameState.currentTurn, timeRemaining: time },
      },
    });
  },

  recordDecision: (payload) => {
    const { gameState } = get();
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

    set({
      gameState: {
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
      },
    });
  },

  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },

  setResults: (results) => set({ results }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
