"use client";

import { useState } from "react";
import type { BranchOption } from "@design-dash/shared";
import MultipleChoiceDecision from "./MultipleChoiceDecision";

interface BranchingPathProps {
  branches: BranchOption[];
  selectedBranchId: string | null;
  selectedFollowUpId: string | null;
  onSelectBranch: (branchId: string) => void;
  onSelectFollowUp: (followUpChoiceId: string) => void;
  disabled?: boolean;
}

export default function BranchingPath({
  branches,
  selectedBranchId,
  selectedFollowUpId,
  onSelectBranch,
  onSelectFollowUp,
  disabled = false,
}: BranchingPathProps) {
  const selectedBranch = branches.find((b) => b.id === selectedBranchId) ?? null;

  return (
    <div className="space-y-4">
      {/* Branch selection */}
      <div>
        <p className="font-pixel text-[9px] text-gray-400 mb-2">
          CHOOSE YOUR DIRECTION
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {branches.map((branch) => {
            const isSelected = selectedBranchId === branch.id;
            return (
              <button
                key={branch.id}
                onClick={() => !disabled && onSelectBranch(branch.id)}
                disabled={disabled}
                className={`
                  relative text-left p-4 rounded border-2 transition-all
                  ${
                    isSelected
                      ? "border-game-yellow bg-game-yellow/10 shadow-[0_0_12px_rgba(245,197,24,0.15)]"
                      : disabled
                      ? "border-gray-700 bg-gray-800/30 opacity-50 cursor-not-allowed"
                      : "border-game-blue/40 bg-game-dark hover:border-game-blue hover:bg-game-blue/10 cursor-pointer"
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-4 h-4 text-game-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}

                <h4 className="font-pixel text-xs text-white mb-1 pr-6">
                  {branch.label}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {branch.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Follow-up question after branch selection */}
      {selectedBranch && (
        <div className="mt-4 pt-4 border-t border-game-blue/30">
          <div className="mb-3 px-3 py-2 bg-game-yellow/5 border border-game-yellow/20 rounded">
            <p className="font-pixel text-[9px] text-game-yellow mb-1">
              FOLLOW-UP
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
              {selectedBranch.followUp.scenarioText}
            </p>
          </div>
          <MultipleChoiceDecision
            choices={selectedBranch.followUp.choices}
            selectedId={selectedFollowUpId}
            onSelect={onSelectFollowUp}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
