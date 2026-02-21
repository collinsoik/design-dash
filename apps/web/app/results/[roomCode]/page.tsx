"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGameStore } from "@/lib/game-store";
import { connectSocket } from "@/lib/socket";
import { SERVER_EVENTS, TEAM_COLORS } from "@design-dash/shared";
import type { Room, GameResults, DecisionPoint, PlayerDecision } from "@design-dash/shared";

const TROPHY_ICONS = ["1ST", "2ND", "3RD"];
const RANK_STYLES = [
  { border: "border-game-yellow", bg: "bg-game-yellow/10", text: "text-game-yellow" },
  { border: "border-gray-400", bg: "bg-gray-400/10", text: "text-gray-300" },
  { border: "border-orange-600", bg: "bg-orange-600/10", text: "text-orange-400" },
];

export default function ResultsPage() {
  const params = useParams();
  const roomCode = params.roomCode as string;

  const { room, results, gameState, setRoom, setResults } = useGameStore();

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
  const bestDecisions = results?.bestDecisions || [];

  // Resolve each team's decisions to display-friendly summaries
  type DecisionSummary = { question: string; answer: string | null };
  const teamDecisionSummaries = useMemo(() => {
    if (!gameState?.caseStudy?.decisions) return {};
    const decisions = gameState.caseStudy.decisions;
    const summaries: Record<string, DecisionSummary[]> = {};

    for (const tr of teamResults) {
      const teamState = gameState.teamDecisions[tr.teamId];
      summaries[tr.teamId] = decisions.map((dp: DecisionPoint) => {
        const pd: PlayerDecision | undefined = teamState?.decisions[dp.id];
        if (!pd) return { question: dp.scenarioText, answer: null };

        let answer: string | null = null;
        if (dp.type === "multiple_choice" && pd.choiceId && dp.choices) {
          answer = dp.choices.find((c) => c.id === pd.choiceId)?.label ?? null;
        } else if (dp.type === "tradeoff_slider" && pd.sliderValue != null && dp.tradeoff) {
          const pct = pd.sliderValue;
          answer = pct <= 33
            ? dp.tradeoff.leftLabel
            : pct >= 67
              ? dp.tradeoff.rightLabel
              : `${dp.tradeoff.leftLabel} / ${dp.tradeoff.rightLabel}`;
        } else if (dp.type === "branching_path" && pd.branchId && dp.branches) {
          const branch = dp.branches.find((b) => b.id === pd.branchId);
          if (branch) {
            answer = branch.label;
            if (pd.followUpChoiceId && branch.followUp?.choices) {
              const fu = branch.followUp.choices.find((c) => c.id === pd.followUpChoiceId);
              if (fu) answer += ` → ${fu.label}`;
            }
          }
        }
        return { question: dp.scenarioText, answer };
      });
    }
    return summaries;
  }, [gameState, teamResults]);

  return (
    <main className="min-h-screen p-6 md:p-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-pixel text-4xl md:text-5xl text-game-yellow mb-3">
          RESULTS
        </h1>
        <p className="font-pixel text-lg text-gray-400">FINAL SCOREBOARD</p>
        <p className="font-pixel text-base text-gray-500 mt-2">ROOM: {roomCode}</p>
      </div>

      {teamResults.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-pixel text-lg text-gray-400">
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
            <h2 className="font-pixel text-base text-game-red mb-6 text-center">
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
                      <span className={`font-pixel text-2xl ${RANK_STYLES[idx].text}`}>
                        {TROPHY_ICONS[idx]}
                      </span>
                    ) : (
                      <span className="font-pixel text-2xl text-gray-500">
                        #{idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Team Info */}
                  <div className="flex-1">
                    <h3
                      className={`font-pixel text-lg ${
                        idx < 3 ? RANK_STYLES[idx].text : "text-gray-400"
                      }`}
                    >
                      {team.teamName}
                    </h3>
                  </div>

                  {/* Score Breakdown */}
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="font-pixel text-base text-gray-500">PEER</p>
                      <p className="font-pixel text-base text-game-green">
                        {team.peerScore.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="font-pixel text-base text-gray-500">JUDGE</p>
                      <p className="font-pixel text-base text-blue-400">
                        {team.judgeScore.toFixed(1)}
                      </p>
                    </div>
                    <div className="min-w-[60px]">
                      <p className="font-pixel text-base text-gray-500">TOTAL</p>
                      <p
                        className={`font-pixel text-2xl ${
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

          {/* Best Decision Awards */}
          {bestDecisions.length > 0 && (
            <div className="max-w-3xl mx-auto mb-12">
              <h2 className="font-pixel text-base text-game-purple mb-6 text-center">
                BEST DECISION AWARDS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {bestDecisions.map((award, idx) => (
                  <div
                    key={idx}
                    className="border-3 border-game-purple bg-game-purple/10 p-4 text-center"
                  >
                    <p className="font-pixel text-base text-game-purple mb-2">
                      Round {idx + 1}
                    </p>
                    <p className="text-lg text-gray-400 mb-2 line-clamp-2">
                      {award.decisionLabel}
                    </p>
                    <p className="font-pixel text-lg text-white">
                      {award.teamName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Decisions */}
          {teamResults.length > 0 && Object.keys(teamDecisionSummaries).length > 0 && (
            <div className="max-w-5xl mx-auto mb-12">
              <h2 className="font-pixel text-base text-game-green mb-6 text-center">
                TEAM DECISIONS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamResults.map((tr) => {
                  const teamColor = TEAM_COLORS[parseInt(tr.teamId.split("-")[1])] || "#ffffff";
                  const decisions = teamDecisionSummaries[tr.teamId] || [];
                  const answeredCount = decisions.filter((d) => d.answer !== null).length;

                  return (
                    <div
                      key={tr.teamId}
                      className="rounded-lg border-2 border-white/10 bg-game-dark/90"
                      style={{ borderTopColor: teamColor, borderTopWidth: "4px" }}
                    >
                      <div className="px-5 pt-4 pb-3">
                        <h3
                          className="font-pixel text-base tracking-wider uppercase"
                          style={{ color: teamColor }}
                        >
                          {tr.teamName}
                        </h3>
                        <p className="font-pixel text-xs text-white/40 mt-1">
                          #{tr.rank} — {tr.finalScore.toFixed(1)} pts
                        </p>
                      </div>
                      <div className="px-5 pb-4">
                        <p className="mb-2 font-pixel text-xs text-white/50 uppercase tracking-wide">
                          Decisions ({answeredCount}/{decisions.length})
                        </p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {decisions.map((d, i) => (
                            <div key={i} className="rounded bg-white/5 px-3 py-2">
                              <p className="text-xs text-white/40 line-clamp-1">{d.question}</p>
                              {d.answer ? (
                                <p className="text-sm text-white/80 mt-0.5 line-clamp-1">{d.answer}</p>
                              ) : (
                                <p className="text-sm text-white/20 italic mt-0.5">NOT ANSWERED</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Score Legend */}
          <div className="max-w-md mx-auto mb-12 pixel-card">
            <h3 className="font-pixel text-sm text-gray-400 mb-3 text-center">
              SCORING BREAKDOWN
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Peer Votes (40%)</span>
                <span className="text-game-green font-pixel text-sm">
                  {room?.config.peerVoteWeight || 40}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Judge Score (60%)</span>
                <span className="text-blue-400 font-pixel text-sm">
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
        <p className="font-pixel text-xs text-gray-600 mt-4">
          THANKS FOR PLAYING DESIGNDASH!
        </p>
      </div>
    </main>
  );
}
