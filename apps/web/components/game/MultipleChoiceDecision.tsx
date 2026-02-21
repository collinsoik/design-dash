"use client";

import type { ChoiceOption } from "@design-dash/shared";

interface MultipleChoiceDecisionProps {
  choices: ChoiceOption[];
  selectedId: string | null;
  onSelect: (choiceId: string) => void;
  disabled?: boolean;
}

export default function MultipleChoiceDecision({
  choices,
  selectedId,
  onSelect,
  disabled = false,
}: MultipleChoiceDecisionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {choices.map((choice) => {
        const isSelected = selectedId === choice.id;
        return (
          <button
            key={choice.id}
            onClick={() => !disabled && onSelect(choice.id)}
            disabled={disabled}
            className={`
              relative text-left p-4 rounded-lg border transition-all
              ${
                isSelected
                  ? "border-accent-green bg-accent-green-light shadow-card"
                  : disabled
                  ? "border-border-primary bg-surface-tertiary opacity-50 cursor-not-allowed"
                  : "border-border-primary bg-white hover:border-border-secondary hover:shadow-card cursor-pointer"
              }
            `}
          >
            {/* Check indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent-green flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            <h4 className="text-sm font-semibold text-text-primary mb-1 pr-6">
              {choice.label}
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              {choice.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
