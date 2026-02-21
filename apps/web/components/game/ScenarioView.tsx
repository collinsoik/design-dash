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
        <p className="text-sm text-text-tertiary animate-pulse">
          Loading scenario...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
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
          <p className="text-sm font-medium text-text-tertiary">
            Waiting for your teammate to decide...
          </p>
          <p className="text-sm text-text-disabled mt-1">
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
        p-4 rounded-lg border transition-all
        ${submitted ? "border-accent-green/30 bg-accent-green-light" : "border-border-primary bg-white shadow-soft"}
      `}
    >
      {/* Scenario text */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-text-tertiary uppercase tracking-wide">
            {decision.type.replace("_", " ")}
          </span>
          {submitted && (
            <span className="badge-green">
              Submitted
            </span>
          )}
        </div>
        <p className="text-base text-text-primary leading-relaxed">
          {decision.scenarioText}
        </p>
        {decision.context && (
          <p className="text-sm text-text-tertiary mt-1 italic">
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
            className="btn-green"
          >
            Lock In
          </button>
        </div>
      )}
    </div>
  );
}
