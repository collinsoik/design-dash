"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGameStore } from "@/lib/game-store";
import { connectSocket } from "@/lib/socket";
import { SERVER_EVENTS } from "@design-dash/shared";
import TurnIndicator from "@/components/game/TurnIndicator";
import ScenarioHeader from "@/components/game/ScenarioHeader";
import ScenarioView from "@/components/game/ScenarioView";
import TeamSidebar from "@/components/game/TeamSidebar";
import BrainstormPanel from "@/components/game/BrainstormPanel";

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;

  const {
    room,
    setRoom,
    setGameState,
    updateTurn,
    updateTimeRemaining,
    recordDecision,
    addMessage,
    setResults,
    setPhase,
  } = useGameStore();

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

    socket.on(SERVER_EVENTS.DECISION_RECORDED, (payload) => {
      recordDecision(payload);
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
      socket.off(SERVER_EVENTS.DECISION_RECORDED);
      socket.off(SERVER_EVENTS.BRAINSTORM_NEW);
      socket.off(SERVER_EVENTS.VOTE_RESULTS);
      socket.off(SERVER_EVENTS.GAME_ENDED);
    };
  }, [roomCode, router, setRoom, setGameState, updateTurn, updateTimeRemaining, recordDecision, addMessage, setResults, setPhase]);

  // Redirect to voting when phase changes
  useEffect(() => {
    if (room?.phase === "voting") {
      router.push(`/vote/${roomCode}`);
    }
  }, [room?.phase, roomCode, router]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface-primary">
      {/* Top Bar */}
      <TurnIndicator />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Scenario Header + Progress */}
        <aside className="w-64 border-r border-border-primary bg-surface-secondary overflow-hidden flex flex-col">
          <ScenarioHeader />
        </aside>

        {/* Center - Scenario + Decision Area + Brainstorm */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <ScenarioView />
          </div>
          <BrainstormPanel />
        </main>

        {/* Right Sidebar - Team Info */}
        <aside className="w-60 border-l border-border-primary bg-surface-secondary overflow-auto">
          <TeamSidebar />
        </aside>
      </div>
    </div>
  );
}
