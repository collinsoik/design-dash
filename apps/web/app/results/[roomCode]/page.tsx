"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGameStore } from "@/lib/game-store";
import { connectSocket } from "@/lib/socket";
import { SERVER_EVENTS, TEAM_COLORS } from "@design-dash/shared";
import type { Room, GameResults } from "@design-dash/shared";

const TROPHY_ICONS = ["1ST", "2ND", "3RD"];
const RANK_STYLES = [
  { border: "border-game-yellow", bg: "bg-game-yellow/10", text: "text-game-yellow" },
  { border: "border-gray-400", bg: "bg-gray-400/10", text: "text-gray-300" },
  { border: "border-orange-600", bg: "bg-orange-600/10", text: "text-orange-400" },
];

export default function ResultsPage() {
  const params = useParams();
  const roomCode = params.roomCode as string;

  const { room, results, setRoom, setResults } = useGameStore();

  // Listen for results
  useEffect(() => {
    const socket = connectSocket();

    socket.on(SERVER_EVENTS.ROOM_STATE, (roomData: Room) => {
      setRoom(roomData);
    });

    socket.on(SERVER_EVENTS.GAME_ENDED, (r: GameResults) => {
      setResults(r);
    });

    return () => {
      socket.off(SERVER_EVENTS.ROOM_STATE);
      socket.off(SERVER_EVENTS.GAME_ENDED);
    };
  }, [setRoom, setResults]);

  const teamResults = results?.teams || [];
  const bestSections = results?.bestSections || [];

  return (
    <main className="min-h-screen p-6 md:p-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-pixel text-2xl md:text-4xl text-game-yellow mb-3">
          RESULTS
        </h1>
        <p className="font-pixel text-[10px] text-gray-400">FINAL SCOREBOARD</p>
        <p className="font-pixel text-[8px] text-gray-500 mt-2">ROOM: {roomCode}</p>
      </div>

      {teamResults.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-pixel text-sm text-gray-400">
            Waiting for results...
          </p>
          <div className="mt-6 flex gap-1 justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-game-yellow animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Leaderboard */}
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="font-pixel text-xs text-game-red mb-6 text-center">
              LEADERBOARD
            </h2>
            <div className="space-y-4">
              {teamResults.map((team, idx) => (
                <div
                  key={team.teamId}
                  className={`flex items-center gap-4 p-4 border-3 ${
                    idx < 3
                      ? `${RANK_STYLES[idx].border} ${RANK_STYLES[idx].bg}`
                      : "border-game-blue bg-game-blue/10"
                  }`}
                >
                  {/* Rank */}
                  <div className="w-16 text-center">
                    {idx < 3 ? (
                      <span className={`font-pixel text-lg ${RANK_STYLES[idx].text}`}>
                        {TROPHY_ICONS[idx]}
                      </span>
                    ) : (
                      <span className="font-pixel text-lg text-gray-500">
                        #{idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Team Info */}
                  <div className="flex-1">
                    <h3
                      className={`font-pixel text-sm ${
                        idx < 3 ? RANK_STYLES[idx].text : "text-gray-400"
                      }`}
                    >
                      {team.teamName}
                    </h3>
                  </div>

                  {/* Score Breakdown */}
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="font-pixel text-[7px] text-gray-500">PEER</p>
                      <p className="font-pixel text-xs text-game-green">
                        {team.peerScore.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="font-pixel text-[7px] text-gray-500">JUDGE</p>
                      <p className="font-pixel text-xs text-blue-400">
                        {team.judgeScore.toFixed(1)}
                      </p>
                    </div>
                    <div className="min-w-[60px]">
                      <p className="font-pixel text-[7px] text-gray-500">TOTAL</p>
                      <p
                        className={`font-pixel text-lg ${
                          idx === 0 ? "text-game-yellow" : "text-white"
                        }`}
                      >
                        {team.finalScore.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best Section Awards */}
          {bestSections.length > 0 && (
            <div className="max-w-3xl mx-auto mb-12">
              <h2 className="font-pixel text-xs text-game-purple mb-6 text-center">
                BEST SECTION AWARDS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {bestSections.map((award, idx) => (
                  <div
                    key={idx}
                    className="border-3 border-game-purple bg-game-purple/10 p-4 text-center"
                  >
                    <p className="font-pixel text-[9px] text-game-purple mb-1">
                      Best {award.sectionLabel}
                    </p>
                    <p className="font-pixel text-[10px] text-white">
                      {award.teamName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Score Legend */}
          <div className="max-w-md mx-auto mb-12 pixel-card">
            <h3 className="font-pixel text-[10px] text-gray-400 mb-3 text-center">
              SCORING BREAKDOWN
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Peer Votes (40%)</span>
                <span className="text-game-green font-pixel text-[10px]">
                  {room?.config.peerVoteWeight || 40}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Judge Score (60%)</span>
                <span className="text-blue-400 font-pixel text-[10px]">
                  {room?.config.judgeWeight || 60}%
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Play Again */}
      <div className="text-center pb-10">
        <Link href="/" className="pixel-btn-green inline-block text-sm px-10 py-4">
          PLAY AGAIN
        </Link>
        <p className="font-pixel text-[8px] text-gray-600 mt-4">
          THANKS FOR PLAYING DESIGNDASH!
        </p>
      </div>
    </main>
  );
}
