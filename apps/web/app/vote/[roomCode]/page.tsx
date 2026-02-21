"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGameStore } from "@/lib/game-store";
import { connectSocket, getSocket } from "@/lib/socket";
import {
  CLIENT_EVENTS,
  SERVER_EVENTS,
  TEAM_COLORS,
} from "@design-dash/shared";
import type { Room, Team, SectionSlot } from "@design-dash/shared";
import VoteCard from "@/components/voting/VoteCard";
import JudgePanel from "@/components/voting/JudgePanel";

export default function VotePage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;

  const { room, playerId, gameState, setRoom, setResults, setPhase } = useGameStore();
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const isHost = room?.hostId === playerId;
  const myTeamId =
    playerId && room?.players[playerId]
      ? room.players[playerId].teamId
      : null;

  // Listen for socket events
  useEffect(() => {
    const socket = connectSocket();

    socket.on(SERVER_EVENTS.ROOM_STATE, (roomData: Room) => {
      setRoom(roomData);
    });

    socket.on(SERVER_EVENTS.GAME_ENDED, (results) => {
      setResults(results);
      setPhase("results");
      router.push(`/results/${roomCode}`);
    });

    return () => {
      socket.off(SERVER_EVENTS.ROOM_STATE);
      socket.off(SERVER_EVENTS.GAME_ENDED);
    };
  }, [roomCode, router, setRoom, setResults, setPhase]);

  const handleVote = useCallback(
    (teamId: string, rating: number) => {
      setVotes((prev) => ({ ...prev, [teamId]: rating }));
      const socket = getSocket();
      socket.emit(CLIENT_EVENTS.VOTE_SUBMIT, { teamId, rating });
    },
    []
  );

  const handleJudgeScore = useCallback(
    (teamId: string, score: number) => {
      const socket = getSocket();
      socket.emit(CLIENT_EVENTS.JUDGE_SCORE, { teamId, score });
    },
    []
  );

  function handleSubmitVotes() {
    setSubmitted(true);
  }

  const activeTeams = room
    ? Object.values(room.teams).filter((t) => t.members.length > 0)
    : [];

  const votableTeams = activeTeams.filter((t) => t.id !== myTeamId);
  const allVoted = votableTeams.every((t) => votes[t.id] !== undefined);

  return (
    <main className="min-h-screen p-6 md:p-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-pixel text-xl md:text-3xl text-game-yellow mb-2">
          VOTE
        </h1>
        <p className="font-pixel text-[10px] text-gray-400">
          RATE EACH TEAM&apos;S WEBSITE REDESIGN
        </p>
        <p className="font-pixel text-[8px] text-gray-500 mt-2">ROOM: {roomCode}</p>
      </div>

      {/* Host Judge Panel */}
      {isHost && (
        <div className="max-w-5xl mx-auto mb-10">
          <JudgePanel
            teams={activeTeams.map((t, i) => ({
              id: t.id,
              name: t.name,
              color: TEAM_COLORS[parseInt(t.id.split("-")[1])] || "#ffffff",
            }))}
            onScore={handleJudgeScore}
            onFinalize={() => {}}
          />
        </div>
      )}

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="font-pixel text-lg text-game-green mb-4">
            VOTES SUBMITTED!
          </div>
          <p className="text-gray-400 text-sm">
            Waiting for the host to finalize scores...
          </p>
          <div className="mt-6 flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-game-green animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Team Vote Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            {activeTeams.map((team, idx) => {
              const teamSections =
                gameState?.teamWebsites[team.id]?.sections || [];
              return (
                <VoteCard
                  key={team.id}
                  teamId={team.id}
                  teamName={team.name}
                  teamColor={TEAM_COLORS[parseInt(team.id.split("-")[1])] || "#ffffff"}
                  sections={teamSections}
                  isOwnTeam={team.id === myTeamId}
                  onVote={handleVote}
                />
              );
            })}
          </div>

          {/* Submit Button (non-host) */}
          {!isHost && (
            <div className="text-center">
              <button
                onClick={handleSubmitVotes}
                disabled={!allVoted}
                className="pixel-btn-yellow text-sm px-10 py-4 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                SUBMIT VOTES
              </button>
              {!allVoted && (
                <p className="font-pixel text-[8px] text-gray-500 mt-3">
                  RATE ALL TEAMS TO SUBMIT
                </p>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
