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
    }

    // Listen for room updates
    socket.on(SERVER_EVENTS.ROOM_STATE, (roomData: Room) => {
      setRoom(roomData);
    });

    // Listen for game start
    socket.on(SERVER_EVENTS.GAME_STARTED, () => {
      router.push(`/game/${roomCode}`);
    });

    return () => {
      socket.off(SERVER_EVENTS.ROOM_STATE);
      socket.off(SERVER_EVENTS.GAME_STARTED);
    };
  }, [roomCode, playerName, playerId, setRoom, setPlayerId, router]);

  const teams = room ? Object.values(room.teams).filter((t) => t.members.length > 0 || Object.values(room.teams).indexOf(t) < 4) : [];
  const players = room?.players || {};
  const totalPlayers = Object.values(players).filter((p) => !p.isHost).length;

  function handleStart() {
    const socket = getSocket();
    socket.emit(CLIENT_EVENTS.GAME_START, null, (response: { success: boolean; error?: string }) => {
      if (response.success) {
        router.push(`/game/${roomCode}`);
      }
    });
  }

  const canStart = totalPlayers >= 2;

  return (
    <main className="min-h-screen p-6 md:p-10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="font-pixel text-xs text-gray-400 hover:text-game-red transition-colors"
        >
          &lt; LEAVE
        </Link>
        <h1 className="font-pixel text-sm md:text-lg text-game-red">LOBBY</h1>
        <div className="w-16" />
      </div>

      {/* Room Code Display */}
      <div className="text-center mb-10">
        <p className="font-pixel text-[10px] text-gray-400 mb-3">ROOM CODE</p>
        <div className="inline-block pixel-border px-10 py-5 bg-game-dark">
          <span className="font-pixel text-3xl md:text-5xl text-game-yellow tracking-[0.3em]">
            {roomCode}
          </span>
        </div>
        <p className="font-pixel text-[8px] text-gray-500 mt-3">
          SHARE THIS CODE WITH YOUR PLAYERS
        </p>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 flex-1">
        {teams.slice(0, 4).map((team, idx) => (
          <div
            key={team.id}
            className="border-3 bg-game-blue/20 p-4 flex flex-col"
            style={{ borderColor: TEAM_COLORS[idx] || "#0f3460" }}
          >
            <h3
              className="font-pixel text-[10px] mb-4 text-center"
              style={{ color: TEAM_COLORS[idx] || "#ffffff" }}
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
                      className="flex items-center gap-2 bg-game-dark/50 px-3 py-2 border border-gray-700"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          player?.connected ? "bg-game-green animate-pulse" : "bg-gray-600"
                        }`}
                      />
                      <span className="text-sm text-white">
                        {player?.displayName || "Unknown"}
                      </span>
                      {memberId === playerId && (
                        <span className="font-pixel text-[6px] text-game-green ml-auto">
                          YOU
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full min-h-[60px]">
                  <p className="font-pixel text-[8px] text-gray-600">WAITING{dots}</p>
                </div>
              )}
            </div>
            <div className="mt-3 text-center">
              <span className="font-pixel text-[8px] text-gray-500">
                {team.members.length}/{room?.config.teamSize || 4} PLAYERS
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
            className="pixel-btn-yellow text-[10px]"
          >
            VIEW MISSION BRIEFING
          </button>
        </div>
      )}

      {/* Status Bar */}
      <div className="text-center space-y-4">
        <p className="font-pixel text-xs text-gray-400">
          {totalPlayers} PLAYER{totalPlayers !== 1 ? "S" : ""} CONNECTED
        </p>

        {isHost ? (
          <div>
            <button
              onClick={handleStart}
              disabled={!canStart}
              className="pixel-btn-green text-sm px-10 py-4 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              START GAME
            </button>
            {!canStart && (
              <p className="font-pixel text-[8px] text-gray-500 mt-3">
                NEED AT LEAST 2 PLAYERS TO START
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1">
            <p className="font-pixel text-xs text-game-green">
              WAITING FOR HOST TO START{dots}
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
