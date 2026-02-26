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
        <p className="text-sm font-medium text-text-tertiary uppercase tracking-wide mb-2">
          Choose Your Direction
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
                  relative text-left p-4 rounded-lg border transition-all
                  ${
                    isSelected
                      ? "border-accent-yellow bg-accent-yellow-light shadow-card"
                      : disabled
                      ? "border-border-primary bg-surface-tertiary opacity-50 cursor-not-allowed"
                      : "border-border-primary bg-white hover:border-border-secondary hover:shadow-card cursor-pointer"
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-4 h-4 text-accent-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}

                <h4 className="text-base font-semibold text-text-primary mb-1 pr-6">
                  {branch.label}
                </h4>
                <p className="text-base text-text-secondary leading-relaxed">
                  {branch.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Follow-up question after branch selection */}
      {selectedBranch && (
        <div className="mt-4 pt-4 border-t border-border-primary">
          <div className="mb-3 px-3 py-2 bg-accent-yellow-light border border-accent-yellow/20 rounded-lg">
            <p className="text-xs font-semibold text-accent-yellow uppercase tracking-wide mb-1">
              Follow-up
            </p>
            <p className="text-base text-text-secondary leading-relaxed">
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
