"use client";

import { useMemo, useState, useCallback } from "react";
import { useGameStore } from "@/lib/game-store";
import { getSocket } from "@/lib/socket";
import type { DecisionPoint } from "@design-dash/shared";
import MultipleChoiceDecision from "./MultipleChoiceDecision";
import TradeoffSlider from "./TradeoffSlider";
import BranchingPath from "./BranchingPath";

export default function ScenarioView() {
  const room = useGameStore((s) => s.room);
  const playerId = useGameStore((s) => s.playerId);

  const gameState = room?.gameState ?? null;
  const caseStudy = gameState?.caseStudy ?? null;
  const currentRound = gameState?.currentTurn?.round ?? 0;

  // Current player's team
  const myTeamId = useMemo(() => {
    if (!room || !playerId) return null;
    return room.players[playerId]?.teamId ?? null;
  }, [room, playerId]);

  // Am I the active player?
  const isMyTurn = useMemo(() => {
    if (!gameState?.currentTurn || !myTeamId || !playerId) return false;
    return gameState.currentTurn.activePlayerIds[myTeamId] === playerId;
  }, [gameState, myTeamId, playerId]);

  // Decisions for this round
  const roundDecisions = useMemo(() => {
    if (!caseStudy) return [];
    return caseStudy.decisions.filter((d) => d.round === currentRound);
  }, [caseStudy, currentRound]);

  // Already-submitted decisions for my team
  const teamDecisions = useMemo(() => {
    if (!gameState || !myTeamId) return {};
    return gameState.teamDecisions[myTeamId]?.decisions ?? {};
  }, [gameState, myTeamId]);

  if (!caseStudy) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="font-pixel text-xs text-gray-500 animate-pulse">
          LOADING SCENARIO...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Story context */}
      <div className="px-4 py-3 bg-game-blue/10 border border-game-blue/30 rounded">
        <p className="text-sm text-gray-300 leading-relaxed">
          {caseStudy.story}
        </p>
      </div>

      {/* Round decisions */}
      {roundDecisions.map((decision) => (
        <DecisionBlock
          key={decision.id}
          decision={decision}
          isMyTurn={isMyTurn}
          existingDecision={teamDecisions[decision.id] ?? null}
        />
      ))}

      {!isMyTurn && (
        <div className="text-center py-4">
          <p className="font-pixel text-xs text-gray-500">
            WAITING FOR YOUR TEAMMATE TO DECIDE...
          </p>
          <p className="text-[11px] text-gray-600 mt-1">
            Use the team chat to suggest ideas!
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Individual Decision Block ──────────────────────

interface DecisionBlockProps {
  decision: DecisionPoint;
  isMyTurn: boolean;
  existingDecision: { choiceId?: string; sliderValue?: number; branchId?: string; followUpChoiceId?: string } | null;
}

function DecisionBlock({ decision, isMyTurn, existingDecision }: DecisionBlockProps) {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(
    existingDecision?.choiceId ?? null
  );
  const [sliderValue, setSliderValue] = useState<number>(
    existingDecision?.sliderValue ?? 50
  );
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(
    existingDecision?.branchId ?? null
  );
  const [selectedFollowUpId, setSelectedFollowUpId] = useState<string | null>(
    existingDecision?.followUpChoiceId ?? null
  );
  const [submitted, setSubmitted] = useState(!!existingDecision);

  const handleSubmit = useCallback(() => {
    const socket = getSocket();
    const payload: Record<string, unknown> = {
      decisionPointId: decision.id,
    };

    if (decision.type === "multiple_choice") {
      if (!selectedChoiceId) return;
      payload.choiceId = selectedChoiceId;
    } else if (decision.type === "tradeoff_slider") {
      payload.sliderValue = sliderValue;
    } else if (decision.type === "branching_path") {
      if (!selectedBranchId) return;
      payload.branchId = selectedBranchId;
      if (selectedFollowUpId) {
        payload.followUpChoiceId = selectedFollowUpId;
      }
    }

    socket.emit("decision:submit", payload);
    setSubmitted(true);
  }, [decision, selectedChoiceId, sliderValue, selectedBranchId, selectedFollowUpId]);

  const isDisabled = !isMyTurn || submitted;

  return (
    <div
      className={`
        p-4 rounded border-2 transition-all
        ${submitted ? "border-game-green/30 bg-game-green/5" : "border-game-blue/30 bg-game-dark/50"}
      `}
    >
      {/* Scenario text */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-pixel text-[8px] text-gray-500 uppercase">
            {decision.type.replace("_", " ")}
          </span>
          {submitted && (
            <span className="font-pixel text-[8px] text-game-green">
              SUBMITTED
            </span>
          )}
        </div>
        <p className="text-sm text-gray-200 leading-relaxed">
          {decision.scenarioText}
        </p>
        {decision.context && (
          <p className="text-xs text-gray-500 mt-1 italic">
            {decision.context}
          </p>
        )}
      </div>

      {/* Decision input */}
      {decision.type === "multiple_choice" && decision.choices && (
        <MultipleChoiceDecision
          choices={decision.choices}
          selectedId={selectedChoiceId}
          onSelect={setSelectedChoiceId}
          disabled={isDisabled}
        />
      )}

      {decision.type === "tradeoff_slider" && decision.tradeoff && (
        <TradeoffSlider
          tradeoff={decision.tradeoff}
          value={sliderValue}
          onChange={setSliderValue}
          disabled={isDisabled}
        />
      )}

      {decision.type === "branching_path" && decision.branches && (
        <BranchingPath
          branches={decision.branches}
          selectedBranchId={selectedBranchId}
          selectedFollowUpId={selectedFollowUpId}
          onSelectBranch={setSelectedBranchId}
          onSelectFollowUp={setSelectedFollowUpId}
          disabled={isDisabled}
        />
      )}

      {/* Submit button */}
      {isMyTurn && !submitted && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="font-pixel text-[10px] px-6 py-2 rounded border-2
              bg-game-green/20 border-game-green text-game-green
              hover:bg-game-green/30 hover:shadow-[0_0_10px_rgba(22,199,154,0.3)]
              active:bg-game-green/40 transition-all"
          >
            LOCK IN
          </button>
        </div>
      )}
    </div>
  );
}
