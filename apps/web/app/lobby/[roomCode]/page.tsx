"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { connectSocket, getSocket } from "@/lib/socket";
import { useGameStore } from "@/lib/game-store";
import {
  CLIENT_EVENTS,
  SERVER_EVENTS,
  TEAM_COLORS,
  TEAM_NAMES,
  CASE_STUDIES,
} from "@design-dash/shared";
import type { Room, Player, Team } from "@design-dash/shared";
import CaseStudyBriefing from "@/components/tutorial/CaseStudyBriefing";

export default function LobbyPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;
  const playerName = searchParams.get("name");

  const { room, playerId, setRoom, setPlayerId } = useGameStore();
  const [dots, setDots] = useState("");
  const [showBriefing, setShowBriefing] = useState(true);
  const [startError, setStartError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const isHost = room?.hostId === playerId;

  // Animate waiting dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // Connect socket and join room
  useEffect(() => {
    const socket = connectSocket();

    // If we have a player name, we're joining (not the host)
    if (playerName && !playerId) {
      socket.emit(
        CLIENT_EVENTS.ROOM_JOIN,
        { roomCode, playerName },
        (response: { success: boolean; room?: Room; playerId?: string; error?: string }) => {
          if (response.success && response.room) {
            setRoom(response.room);
            setPlayerId(response.playerId || socket.id!);
          }
        }
      );
    } else if (playerId) {
      // Already have a playerId - rejoin to re-associate socket with room
      socket.emit(
        CLIENT_EVENTS.ROOM_REJOIN,
        { roomCode, playerId },
        (response: { success: boolean; room?: Room; playerId?: string; error?: string }) => {
          if (response.success && response.room) {
            setRoom(response.room);
            if (response.playerId) setPlayerId(response.playerId);
          }
        }
      );
    }

    // Handle reconnection - re-associate with room using stored playerId
    const onReconnect = () => {
      const currentPlayerId = useGameStore.getState().playerId;
      if (currentPlayerId) {
        socket.emit(
          CLIENT_EVENTS.ROOM_REJOIN,
          { roomCode, playerId: currentPlayerId },
          (response: { success: boolean; room?: Room; playerId?: string }) => {
            if (response.success && response.room) {
              setRoom(response.room);
              if (response.playerId) setPlayerId(response.playerId);
            }
          }
        );
      }
    };
    socket.on("connect", onReconnect);

    // Listen for room updates
    socket.on(SERVER_EVENTS.ROOM_STATE, (roomData: Room) => {
      setRoom(roomData);
    });

    // Listen for game start
    socket.on(SERVER_EVENTS.GAME_STARTED, () => {
      router.push(`/game/${roomCode}`);
    });

    return () => {
      socket.off("connect", onReconnect);
      socket.off(SERVER_EVENTS.ROOM_STATE);
      socket.off(SERVER_EVENTS.GAME_STARTED);
    };
  }, [roomCode, playerName, playerId, setRoom, setPlayerId, router]);

  const teams = room ? Object.values(room.teams).filter((t) => t.members.length > 0 || Object.values(room.teams).indexOf(t) < 4) : [];
  const players = room?.players || {};
  const totalPlayers = Object.values(players).filter((p) => !p.isHost).length;

  function handleStart() {
    setStartError(null);
    setIsStarting(true);

    const socket = getSocket();

    // Timeout if server doesn't respond within 8 seconds
    const timeout = setTimeout(() => {
      setStartError("Server did not respond. Please try again.");
      setIsStarting(false);
    }, 8000);

    socket.emit(CLIENT_EVENTS.GAME_START, null, (response: { success: boolean; error?: string }) => {
      clearTimeout(timeout);
      if (response.success) {
        router.push(`/game/${roomCode}`);
      } else {
        setStartError(response.error || "Failed to start game");
        setIsStarting(false);
      }
    });
  }

  const canStart = totalPlayers >= 2;

  return (
    <main className="min-h-screen p-6 md:p-10 flex flex-col bg-surface-primary">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="text-sm text-text-tertiary hover:text-accent-primary transition-colors"
        >
          &larr; Leave
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">Lobby</h1>
        <div className="w-16" />
      </div>

      {/* Room Code Display */}
      <div className="text-center mb-10">
        <p className="text-sm text-text-tertiary mb-3">Room Code</p>
        <div className="inline-block border border-border-primary rounded-xl px-10 py-5 bg-white shadow-card">
          <span className="font-mono text-4xl font-bold text-accent-primary tracking-[0.3em]">
            {roomCode}
          </span>
        </div>
        <p className="text-xs text-text-disabled mt-3">
          Share this code with your players
        </p>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 flex-1">
        {teams.slice(0, 4).map((team, idx) => (
          <div
            key={team.id}
            className="border rounded-xl bg-white p-4 flex flex-col shadow-soft"
            style={{ borderColor: TEAM_COLORS[idx] || "#E2E5EA", borderTopWidth: "4px", borderTopColor: TEAM_COLORS[idx] || "#E2E5EA" }}
          >
            <h3
              className="text-sm font-semibold mb-4 text-center"
              style={{ color: TEAM_COLORS[idx] || "#1A1A2E" }}
            >
              {team.name}
            </h3>
            <div className="space-y-2 flex-1">
              {team.members.length > 0 ? (
                team.members.map((memberId) => {
                  const player = players[memberId];
                  return (
                    <div
                      key={memberId}
                      className="flex items-center gap-2 bg-surface-tertiary px-3 py-2 rounded-lg border border-border-primary"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          player?.connected ? "bg-accent-green animate-pulse" : "bg-text-disabled"
                        }`}
                      />
                      <span className="text-sm text-text-primary">
                        {player?.displayName || "Unknown"}
                      </span>
                      {memberId === playerId && (
                        <span className="text-xs font-medium text-accent-green ml-auto">
                          You
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full min-h-[60px]">
                  <p className="text-xs text-text-disabled">Waiting{dots}</p>
                </div>
              )}
            </div>
            <div className="mt-3 text-center">
              <span className="text-xs text-text-tertiary">
                {team.members.length}/{room?.config.teamSize || 4} players
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* View Briefing Button */}
      {room?.config?.caseStudyId && (
        <div className="text-center mb-4">
          <button
            onClick={() => setShowBriefing(true)}
            className="btn-ghost"
          >
            View Mission Briefing
          </button>
        </div>
      )}

      {/* Status Bar */}
      <div className="text-center space-y-4">
        <p className="text-xs text-text-tertiary">
          {totalPlayers} player{totalPlayers !== 1 ? "s" : ""} connected
        </p>

        {isHost ? (
          <div>
            {startError && (
              <p className="text-sm text-accent-red mb-3">
                {startError}
              </p>
            )}
            <button
              onClick={handleStart}
              disabled={!canStart || isStarting}
              className="btn-green px-10 py-4 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isStarting ? "Starting..." : "Start Game"}
            </button>
            {!canStart && (
              <p className="text-xs text-text-disabled mt-3">
                Need at least 2 players to start
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1">
            <p className="text-xs text-accent-green font-medium">
              Waiting for host to start{dots}
            </p>
          </div>
        )}
      </div>

      {/* Case Study Briefing Modal */}
      {showBriefing && room?.config?.caseStudyId && (() => {
        const cs = CASE_STUDIES.find((c) => c.id === room.config.caseStudyId);
        return cs ? (
          <CaseStudyBriefing caseStudy={cs} onReady={() => setShowBriefing(false)} />
        ) : null;
      })()}
    </main>
  );
}
