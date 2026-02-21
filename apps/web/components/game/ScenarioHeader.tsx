"use client";

import { useMemo } from "react";
import { useGameStore } from "@/lib/game-store";
import DecisionSummary from "./DecisionSummary";

export default function ScenarioHeader() {
  const room = useGameStore((s) => s.room);
  const playerId = useGameStore((s) => s.playerId);

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

      {/* Persona Card */}
      {persona && (
        <div className="p-3 border-b border-game-blue/30">
          <p className="font-pixel text-[8px] text-gray-500 mb-2">USER PERSONA</p>
          <div className="flex items-center gap-2 mb-2">
            {/* Initials avatar */}
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
          <p className="text-[11px] text-gray-400 leading-relaxed mb-2">
            {persona.bio}
          </p>
          {persona.goals.length > 0 && (
            <div>
              <p className="font-pixel text-[7px] text-gray-500 mb-1">GOALS</p>
              <ul className="space-y-0.5">
                {persona.goals.map((goal, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1.5 text-[10px] text-gray-500"
                  >
                    <span className="text-game-green mt-0.5">*</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Decision Progress */}
      <div className="p-3 border-b border-game-blue/30">
        <DecisionSummary
          made={decisionProgress.made}
          total={decisionProgress.total}
        />
      </div>

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
    </div>
  );
}
