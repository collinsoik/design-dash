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
              relative text-left p-4 rounded border-2 transition-all
              ${
                isSelected
                  ? "border-game-green bg-game-green/15 shadow-[0_0_12px_rgba(22,199,154,0.2)]"
                  : disabled
                  ? "border-gray-700 bg-gray-800/30 opacity-50 cursor-not-allowed"
                  : "border-game-blue/40 bg-game-dark hover:border-game-blue hover:bg-game-blue/10 cursor-pointer"
              }
            `}
          >
            {/* Check indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-game-green flex items-center justify-center">
                <svg className="w-3 h-3 text-game-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            <h4 className="font-pixel text-sm text-white mb-1 pr-6">
              {choice.label}
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {choice.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
