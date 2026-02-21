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
      <div className="p-3 border-b border-game-blue/30">
        <p className="font-pixel text-[8px] text-gray-500 mb-1">PRODUCT</p>
        <h2 className="font-pixel text-sm text-game-yellow">
          {caseStudy?.productName ?? "Loading..."}
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          {caseStudy?.productType ?? ""}
        </p>
      </div>

      {/* Persona: compact one-liner + goal pills */}
      {persona && (
        <div className="p-3 border-b border-game-blue/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-game-blue/30 border border-game-blue flex items-center justify-center flex-shrink-0">
              <span className="font-pixel text-[10px] text-game-green">
                {persona.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <p className="text-xs text-white font-medium">
                {persona.name}, {persona.age}
              </p>
              <p className="text-[10px] text-gray-500">{persona.occupation}</p>
            </div>
          </div>
          {/* Goal pills */}
          <div className="flex flex-wrap gap-1.5">
            {persona.goals.map((goal, i) => (
              <span
                key={i}
                className="inline-block font-pixel text-[7px] bg-game-green/15 text-game-green px-2 py-0.5 rounded-full"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Decision Progress */}
      <div className="p-3 border-b border-game-blue/30">
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
            className="flex items-center gap-1.5 font-pixel text-[8px] text-gray-500 hover:text-gray-300 transition-colors w-full"
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
            {showDetails ? "LESS DETAILS" : "MORE DETAILS"}
          </button>
        </div>
      )}

      {/* Collapsible details */}
      {showDetails && (
        <>
          {/* Persona bio */}
          {persona && (
            <div className="px-3 pt-2">
              <p className="font-pixel text-[7px] text-gray-500 mb-1">BIO</p>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                {persona.bio}
              </p>
            </div>
          )}

          {/* Scoring Criteria */}
          {caseStudy && caseStudy.scoringCriteria.length > 0 && (
            <div className="p-3">
              <p className="font-pixel text-[8px] text-gray-500 mb-2">
                SCORING CRITERIA
              </p>
              <ul className="space-y-1">
                {caseStudy.scoringCriteria.map((criteria, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1.5 text-[10px] text-gray-500"
                  >
                    <span className="text-game-yellow mt-0.5">*</span>
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
