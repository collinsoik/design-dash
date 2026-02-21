import { create } from "zustand";
import type {
  Room,
  GamePhase,
  GameState,
  BrainstormMessage,
  GameResults,
  TurnState,
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
  updateCanvas: (teamId: string, slotId: string, component: { registryId: string } | null) => void;
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

  updateCanvas: (teamId, slotId, component) => {
    const { gameState, room } = get();
    if (!gameState) return;

    const website = gameState.teamWebsites[teamId];
    if (!website) return;

    const updatedSections = website.sections.map((s) =>
      s.id === slotId
        ? {
            ...s,
            placedComponent: component ? { registryId: component.registryId } : null,
            status: (component ? "placed" : "empty") as "placed" | "empty",
          }
        : s
    );

    const updatedGameState = {
      ...gameState,
      teamWebsites: {
        ...gameState.teamWebsites,
        [teamId]: { sections: updatedSections },
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
