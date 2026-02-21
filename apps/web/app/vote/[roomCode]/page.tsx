"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGameStore } from "@/lib/game-store";
import { connectSocket, getSocket } from "@/lib/socket";
import {
  CLIENT_EVENTS,
  SERVER_EVENTS,
  TEAM_COLORS,
} from "@design-dash/shared";
import type { Room, Team, DecisionPoint, PlayerDecision } from "@design-dash/shared";
import JudgePanel from "@/components/voting/JudgePanel";
import ProductPreviewGrid from "@/components/preview/ProductPreviewGrid";

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

  // Resolve each team's decisions to display-friendly summaries
  type DecisionSummary = { question: string; answer: string | null };
  const teamDecisionSummaries = useMemo(() => {
    if (!gameState?.caseStudy?.decisions) return {};
    const decisions = gameState.caseStudy.decisions;
    const summaries: Record<string, DecisionSummary[]> = {};

    for (const team of activeTeams) {
      const teamState = gameState.teamDecisions[team.id];
      summaries[team.id] = decisions.map((dp: DecisionPoint) => {
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
  }, [gameState, activeTeams]);

  return (
    <main className="min-h-screen p-6 md:p-10 bg-surface-primary">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-text-primary mb-2">
          Time to Vote!
        </h1>
        <p className="text-sm text-text-secondary">
          Look at what each team chose and rate their designs
        </p>
        <p className="text-xs text-text-tertiary mt-1">
          Think about: Did they make choices that help the user? Do their decisions make sense together?
        </p>
        <p className="text-xs text-text-tertiary mt-2">Room: {roomCode}</p>
      </div>

      {/* Host Judge Panel */}
      {isHost && (
        <div className="max-w-5xl mx-auto mb-10">
          <JudgePanel
            teams={activeTeams.map((t) => ({
              id: t.id,
              name: t.name,
              color: TEAM_COLORS[parseInt(t.id.split("-")[1])] || "#7C8CF5",
            }))}
            onScore={handleJudgeScore}
            onFinalize={() => {}}
          />
        </div>
      )}

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-2xl font-bold text-accent-green mb-4">
            Votes Sent!
          </div>
          <p className="text-text-secondary text-sm">
            Waiting for your teacher to finish scoring...
          </p>
          <div className="mt-6 flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-accent-green animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Product Preview Phones */}
          {gameState && (
            <ProductPreviewGrid
              teams={activeTeams}
              gameState={gameState}
              myTeamId={myTeamId}
            />
          )}

          {/* Team Decision Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            {activeTeams.map((team) => {
              const teamColor = TEAM_COLORS[parseInt(team.id.split("-")[1])] || "#7C8CF5";
              const isOwnTeam = team.id === myTeamId;
              const decisions = teamDecisionSummaries[team.id] || [];
              const answeredCount = decisions.filter((d) => d.answer !== null).length;
              const totalDecisions = decisions.length;

              return (
                <div
                  key={team.id}
                  className={`relative overflow-hidden rounded-xl border bg-white shadow-card transition-shadow ${
                    isOwnTeam
                      ? "border-border-primary opacity-60"
                      : "border-border-primary hover:shadow-elevated"
                  }`}
                  style={{ borderTopColor: teamColor, borderTopWidth: "4px" }}
                >
                  {isOwnTeam && (
                    <div className="absolute top-3 right-3 z-10 badge-gray">
                      Your Team
                    </div>
                  )}

                  {/* Team header */}
                  <div className="px-5 pt-4 pb-3">
                    <h3
                      className="text-sm font-semibold uppercase tracking-wide"
                      style={{ color: teamColor }}
                    >
                      {team.name}
                    </h3>
                  </div>

                  {/* Decision list */}
                  <div className="px-5 pb-3">
                    <p className="mb-2 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                      Decisions ({answeredCount}/{totalDecisions})
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

                  {/* Star rating */}
                  <div className="border-t border-border-primary px-5 py-4">
                    {isOwnTeam ? (
                      <p className="text-center text-sm text-text-disabled italic">
                        You cannot vote for your own team
                      </p>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">
                          Your Rating
                        </p>
                        <p className="text-xs text-text-disabled">
                          1 = not great, 5 = amazing
                        </p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const isActive = star <= (votes[team.id] || 0);
                            return (
                              <button
                                key={star}
                                onClick={() => handleVote(team.id, star)}
                                className="text-2xl transition-transform duration-100 cursor-pointer hover:scale-125"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  className="h-7 w-7"
                                  fill={isActive ? "#F0C94B" : "none"}
                                  stroke={isActive ? "#F0C94B" : "#D0D4DA"}
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                  />
                                </svg>
                              </button>
                            );
                          })}
                        </div>
                        {votes[team.id] && (
                          <p className="text-xs text-accent-yellow font-medium">
                            {votes[team.id]} / 5 stars
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Button (non-host) */}
          {!isHost && (
            <div className="text-center">
              <button
                onClick={handleSubmitVotes}
                disabled={!allVoted}
                className="btn-primary px-10 py-4 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Send My Votes
              </button>
              {!allVoted && (
                <p className="text-xs text-text-disabled mt-3">
                  Rate every team before you can submit
                </p>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
