"use client";

import { useState } from "react";

interface HowToPlayProps {
  onClose: () => void;
}

const STEPS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Join a Team",
    description: "You'll be placed on a team with other players. Each team works together to redesign a real app!",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
    title: "Read the Scenario",
    description: "You'll meet a fictional user with a problem. Read about who they are and what they need from the app.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
    title: "Make Choices",
    description: "Take turns picking options, sliding scales, or choosing paths. There's no single right answer — think about what's best for the user!",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    title: "Talk It Out",
    description: "Use the team chat to share ideas with your teammates. If it's not your turn, suggest what they should pick!",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Vote & Win",
    description: "After all rounds, everyone votes on the best designs. The teacher also scores each team. Highest total score wins!",
  },
];

const DECISION_TYPES = [
  {
    name: "Pick One",
    badge: "badge-blue",
    description: "Choose your favorite option from a list",
  },
  {
    name: "Slider",
    badge: "badge-yellow",
    description: "Slide between two extremes to find your balance",
  },
  {
    name: "Choose a Path",
    badge: "badge-purple",
    description: "Pick a direction, then answer a follow-up question",
  },
];

export default function HowToPlay({ onClose }: HowToPlayProps) {
  const [step, setStep] = useState(0);
  const isLastStep = step === STEPS.length;
  const totalPages = STEPS.length + 1; // steps + decision types page

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="card-elevated relative w-full max-w-md">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center text-lg text-text-tertiary transition-colors hover:text-accent-red"
          aria-label="Close tutorial"
        >
          X
        </button>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 pt-5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-6 bg-accent-primary" : "w-1.5 bg-border-secondary"
              }`}
            />
          ))}
        </div>

        {!isLastStep ? (
          /* Step content */
          <div className="px-6 py-6 md:px-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-blue-light text-accent-blue">
                {STEPS[step].icon}
              </div>
            </div>
            <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">
              Step {step + 1} of {STEPS.length}
            </p>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              {STEPS[step].title}
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {STEPS[step].description}
            </p>
          </div>
        ) : (
          /* Decision types page */
          <div className="px-6 py-6 md:px-8">
            <h2 className="text-center text-xl font-semibold text-text-primary mb-2">
              Types of Decisions
            </h2>
            <p className="text-center text-sm text-text-secondary mb-5">
              You'll see these 3 types during the game:
            </p>
            <div className="space-y-3">
              {DECISION_TYPES.map((dt) => (
                <div key={dt.name} className="flex items-center gap-3 bg-surface-tertiary rounded-lg px-4 py-3">
                  <span className={dt.badge}>{dt.name}</span>
                  <span className="text-sm text-text-secondary">{dt.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between px-6 pb-6 md:px-8">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="btn-ghost text-sm"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          {isLastStep ? (
            <button
              type="button"
              onClick={onClose}
              className="btn-green px-8 py-3"
            >
              Got It!
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="btn-primary px-6 py-2.5"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
