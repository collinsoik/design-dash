"use client";

import { useMemo, useState } from "react";
import { useGameStore } from "@/lib/game-store";
import DecisionSummary from "./DecisionSummary";

export default function ScenarioHeader() {
  const room = useGameStore((s) => s.room);
  const playerId = useGameStore((s) => s.playerId);
  const [showDetails, setShowDetails] = useState(false);

  const gameState = room?.gameState ?? null;
  const caseStudy = gameState?.caseStudy ?? null;
  const persona = caseStudy?.persona ?? null;

  // Current player's team
  const myTeamId = useMemo(() => {
    if (!room || !playerId) return null;
    return room.players[playerId]?.teamId ?? null;
  }, [room, playerId]);

  // Decision progress for this team
  const decisionProgress = useMemo(() => {
    if (!gameState || !myTeamId || !caseStudy) return { made: 0, total: 0 };
    const teamState = gameState.teamDecisions[myTeamId];
    const made = teamState ? Object.keys(teamState.decisions).length : 0;
    const total = caseStudy.decisions.length;
    return { made, total };
  }, [gameState, myTeamId, caseStudy]);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Product Info */}
      <div className="p-3 border-b border-border-primary">
        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-1">The App</p>
        <h2 className="text-lg font-semibold text-text-primary">
          {caseStudy?.productName ?? "Loading..."}
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          {caseStudy?.productType ?? ""}
        </p>
      </div>

      {/* Persona: compact one-liner + goal pills */}
      {persona && (
        <div className="p-3 border-b border-border-primary">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-accent-purple-light border border-accent-purple/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-accent-purple">
                {persona.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                {persona.name}, {persona.age}
              </p>
              <p className="text-xs text-text-tertiary">{persona.occupation}</p>
            </div>
          </div>
          {/* Goal pills */}
          <div className="flex flex-wrap gap-1.5">
            {persona.goals.map((goal, i) => (
              <span
                key={i}
                className="badge-green"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Decision Progress */}
      <div className="p-3 border-b border-border-primary">
        <DecisionSummary
          made={decisionProgress.made}
          total={decisionProgress.total}
        />
      </div>

      {/* MORE DETAILS toggle */}
      {(persona || (caseStudy && caseStudy.scoringCriteria.length > 0)) && (
        <div className="px-3 pt-2">
          <button
            onClick={() => setShowDetails((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-medium text-text-tertiary hover:text-text-secondary transition-colors w-full"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className={`transition-transform ${showDetails ? "rotate-90" : ""}`}
            >
              <path d="M3 1L7 5L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {showDetails ? "Less Details" : "More Details"}
          </button>
        </div>
      )}

      {/* Collapsible details */}
      {showDetails && (
        <>
          {/* Persona bio */}
          {persona && (
            <div className="px-3 pt-2">
              <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-1">Bio</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                {persona.bio}
              </p>
            </div>
          )}

          {/* Scoring Criteria */}
          {caseStudy && caseStudy.scoringCriteria.length > 0 && (
            <div className="p-3">
              <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">
                Scoring Criteria
              </p>
              <ul className="space-y-1">
                {caseStudy.scoringCriteria.map((criteria, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1.5 text-sm text-text-tertiary"
                  >
                    <span className="text-accent-yellow mt-0.5">*</span>
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
