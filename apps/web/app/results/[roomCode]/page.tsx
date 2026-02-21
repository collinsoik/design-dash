"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGameStore } from "@/lib/game-store";
import { connectSocket } from "@/lib/socket";
import { SERVER_EVENTS, TEAM_COLORS } from "@design-dash/shared";
import type { Room, GameResults, DecisionPoint, PlayerDecision } from "@design-dash/shared";

const TROPHY_ICONS = ["1st Place!", "2nd Place!", "3rd Place!"];
const RANK_STYLES = [
  { border: "border-accent-yellow", bg: "bg-accent-yellow-light", text: "text-accent-yellow" },
  { border: "border-text-tertiary", bg: "bg-surface-tertiary", text: "text-text-secondary" },
  { border: "border-accent-red", bg: "bg-accent-red-light", text: "text-accent-red" },
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
          if (pct <= 12) answer = dp.tradeoff.leftLabel;
          else if (pct <= 37) answer = `Lean ${dp.tradeoff.leftLabel}`;
          else if (pct <= 62) answer = "Balanced";
          else if (pct <= 87) answer = `Lean ${dp.tradeoff.rightLabel}`;
          else answer = dp.tradeoff.rightLabel;
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
    <main className="min-h-screen p-6 md:p-10 bg-surface-primary">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text-primary mb-3">
          And the Winners Are...
        </h1>
        <p className="text-lg text-text-secondary">Great job, everyone! Here&apos;s how the teams did.</p>
        <p className="text-sm text-text-tertiary mt-2">Room: {roomCode}</p>
      </div>

      {teamResults.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-text-secondary">
            Waiting for results...
          </p>
          <div className="mt-6 flex gap-1 justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-accent-yellow animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Leaderboard */}
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-lg font-semibold text-text-primary mb-6 text-center">
              Final Standings
            </h2>
            <div className="space-y-4">
              {teamResults.map((team, idx) => (
                <div
                  key={team.teamId}
                  className={`flex items-center gap-4 p-4 border rounded-xl shadow-soft animate-slide-up ${
                    idx < 3
                      ? `${RANK_STYLES[idx].border} ${RANK_STYLES[idx].bg}`
                      : "border-border-primary bg-white"
                  }`}
                  style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'both' }}
                >
                  {/* Rank */}
                  <div className="w-16 text-center">
                    {idx < 3 ? (
                      <span className={`text-2xl font-bold ${RANK_STYLES[idx].text}`}>
                        {TROPHY_ICONS[idx]}
                      </span>
                    ) : (
                      <span className="text-2xl font-bold text-text-tertiary">
                        #{idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Team Info */}
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold ${
                        idx < 3 ? RANK_STYLES[idx].text : "text-text-secondary"
                      }`}
                    >
                      {team.teamName}
                    </h3>
                  </div>

                  {/* Score Breakdown */}
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="text-xs text-text-tertiary">Peer</p>
                      <p className="text-sm font-bold text-accent-green">
                        {team.peerScore.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-tertiary">Judge</p>
                      <p className="text-sm font-bold text-accent-blue">
                        {team.judgeScore.toFixed(1)}
                      </p>
                    </div>
                    <div className="min-w-[60px]">
                      <p className="text-xs text-text-tertiary">Total</p>
                      <p
                        className={`text-2xl font-bold ${
                          idx === 0 ? "text-accent-yellow" : "text-text-primary"
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
              <h2 className="text-lg font-semibold text-accent-purple mb-6 text-center">
                Best Decision Awards
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {bestDecisions.map((award, idx) => (
                  <div
                    key={idx}
                    className="border border-accent-purple/30 bg-accent-purple-light rounded-xl p-4 text-center"
                  >
                    <p className="text-sm font-medium text-accent-purple mb-2">
                      Round {idx + 1}
                    </p>
                    <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                      {award.decisionLabel}
                    </p>
                    <p className="text-lg font-semibold text-text-primary">
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
              <h2 className="text-lg font-semibold text-accent-green mb-6 text-center">
                Team Decisions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamResults.map((tr) => {
                  const teamColor = TEAM_COLORS[parseInt(tr.teamId.split("-")[1])] || "#7C8CF5";
                  const decisions = teamDecisionSummaries[tr.teamId] || [];
                  const answeredCount = decisions.filter((d) => d.answer !== null).length;

                  return (
                    <div
                      key={tr.teamId}
                      className="rounded-xl border border-border-primary bg-white shadow-card"
                      style={{ borderTopColor: teamColor, borderTopWidth: "4px" }}
                    >
                      <div className="px-5 pt-4 pb-3">
                        <h3
                          className="text-sm font-semibold uppercase tracking-wide"
                          style={{ color: teamColor }}
                        >
                          {tr.teamName}
                        </h3>
                        <p className="text-xs text-text-tertiary mt-1">
                          #{tr.rank} — {tr.finalScore.toFixed(1)} pts
                        </p>
                      </div>
                      <div className="px-5 pb-4">
                        <p className="mb-2 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                          Decisions ({answeredCount}/{decisions.length})
                        </p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {decisions.map((d, i) => (
                            <div key={i} className="rounded-lg bg-surface-tertiary px-3 py-2">
                              <p className="text-xs text-text-tertiary line-clamp-1">{d.question}</p>
                              {d.answer ? (
                                <p className="text-sm text-text-primary mt-0.5 line-clamp-1">{d.answer}</p>
                              ) : (
                                <p className="text-sm text-text-disabled italic mt-0.5">Not answered</p>
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
          <div className="max-w-md mx-auto mb-12 card">
            <h3 className="text-sm font-medium text-text-tertiary mb-3 text-center uppercase tracking-wide">
              How Scores Work
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Your classmates&apos; votes</span>
                <span className="text-accent-green font-semibold">
                  {room?.config.peerVoteWeight || 40}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Teacher&apos;s score</span>
                <span className="text-accent-blue font-semibold">
                  {room?.config.judgeWeight || 60}%
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Play Again */}
      <div className="text-center pb-10">
        <Link href="/" className="btn-green inline-block px-10 py-4">
          Play Again
        </Link>
        <p className="text-xs text-text-disabled mt-4">
          Thanks for playing! Every round you get better at design thinking.
        </p>
      </div>
    </main>
  );
}
