"use client";

import { useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { useGameStore } from "@/lib/game-store";
import { connectSocket, getSocket } from "@/lib/socket";
import { SERVER_EVENTS } from "@design-dash/shared";
import ComponentPalette from "@/components/game/ComponentPalette";
import Canvas from "@/components/game/Canvas";
import TurnIndicator from "@/components/game/TurnIndicator";
import TeamSidebar from "@/components/game/TeamSidebar";
import BrainstormPanel from "@/components/game/BrainstormPanel";
import HowToPlay from "@/components/tutorial/HowToPlay";
import Image from "next/image";
import { getComponentById } from "@design-dash/shared";

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const {
    room,
    playerId,
    gameState,
    setRoom,
    setGameState,
    updateTurn,
    updateTimeRemaining,
    updateCanvas,
    addMessage,
    setResults,
    setPhase,
  } = useGameStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  // Connect socket and listen for events
  useEffect(() => {
    const socket = connectSocket();

    socket.on(SERVER_EVENTS.ROOM_STATE, (roomData) => {
      setRoom(roomData);
    });

    socket.on(SERVER_EVENTS.GAME_STARTED, (gs) => {
      setGameState(gs);
      setPhase("playing");
    });

    socket.on(SERVER_EVENTS.TURN_CHANGED, (turn) => {
      updateTurn(turn);
    });

    socket.on(SERVER_EVENTS.TURN_TICK, ({ timeRemaining }) => {
      updateTimeRemaining(timeRemaining);
    });

    socket.on(SERVER_EVENTS.CANVAS_UPDATED, ({ teamId, slotId, component }) => {
      updateCanvas(teamId, slotId, component);
    });

    socket.on(SERVER_EVENTS.BRAINSTORM_NEW, (message) => {
      addMessage(message);
    });

    socket.on(SERVER_EVENTS.VOTE_RESULTS, (results) => {
      setResults(results);
      setPhase("voting");
    });

    socket.on(SERVER_EVENTS.GAME_ENDED, (results) => {
      setResults(results);
      setPhase("results");
      router.push(`/results/${roomCode}`);
    });

    return () => {
      socket.off(SERVER_EVENTS.ROOM_STATE);
      socket.off(SERVER_EVENTS.GAME_STARTED);
      socket.off(SERVER_EVENTS.TURN_CHANGED);
      socket.off(SERVER_EVENTS.TURN_TICK);
      socket.off(SERVER_EVENTS.CANVAS_UPDATED);
      socket.off(SERVER_EVENTS.BRAINSTORM_NEW);
      socket.off(SERVER_EVENTS.VOTE_RESULTS);
      socket.off(SERVER_EVENTS.GAME_ENDED);
    };
  }, [roomCode, router, setRoom, setGameState, updateTurn, updateTimeRemaining, updateCanvas, addMessage, setResults, setPhase]);

  // Redirect to voting when phase changes
  useEffect(() => {
    if (room?.phase === "voting") {
      router.push(`/vote/${roomCode}`);
    }
  }, [room?.phase, roomCode, router]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDragId(null);
      const { active, over } = event;

      if (!over || !active) return;

      const componentId = active.id as string;
      const slotId = over.id as string;

      // Emit placement to server
      const socket = getSocket();
      socket.emit("turn:place", { slotId, componentId });
    },
    []
  );

  const handleDragCancel = useCallback(() => {
    setActiveDragId(null);
  }, []);

  // Get active drag component for overlay
  const activeDragComponent = activeDragId
    ? getComponentById(activeDragId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="relative">
          <TurnIndicator />
          {/* Help button */}
          <button
            onClick={() => setShowHelp(true)}
            className="absolute top-1/2 right-3 -translate-y-1/2 z-20 w-7 h-7 flex items-center justify-center font-pixel text-[10px] text-game-yellow border-2 border-game-yellow/50 rounded bg-game-dark/80 hover:bg-game-yellow/20 hover:border-game-yellow transition-colors"
            title="How to play"
          >
            ?
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Component Palette */}
          <ComponentPalette />

          {/* Center - Canvas + Brainstorm */}
          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto">
              <Canvas />
            </div>
            <BrainstormPanel />
          </main>

          {/* Right Sidebar - Team Info */}
          <TeamSidebar />
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}

      {/* Drag Overlay */}
      <DragOverlay>
        {activeDragComponent ? (
          <div className="w-48 bg-game-dark border-3 border-game-green p-2 shadow-lg opacity-90 rotate-2">
            <div className="relative w-full h-24 bg-gray-900 mb-1 overflow-hidden">
              <Image
                src={activeDragComponent.preview}
                alt={activeDragComponent.name}
                fill
                className="object-cover object-top"
                unoptimized
              />
            </div>
            <p className="font-pixel text-[8px] text-game-green truncate">
              {activeDragComponent.name}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
