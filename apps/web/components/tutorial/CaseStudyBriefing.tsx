"use client";

import { useEffect } from "react";
import type { CaseStudy } from "@design-dash/shared";

interface CaseStudyBriefingProps {
  caseStudy: CaseStudy;
  onReady: () => void;
}

const difficultyConfig = {
  beginner: { label: "Starter", className: "badge-green", hint: "Great for first-timers!" },
  intermediate: { label: "Challenger", className: "badge-yellow", hint: "A bit trickier — think carefully!" },
  advanced: { label: "Expert", className: "badge-red", hint: "Tough choices ahead — you've got this!" },
} as const;

export default function CaseStudyBriefing({ caseStudy, onReady }: CaseStudyBriefingProps) {
  const difficulty = difficultyConfig[caseStudy.difficulty];

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onReady();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onReady]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Top bar: skip */}
      <div className="flex items-center justify-end px-6 pt-4">
        <button
          onClick={onReady}
          className="text-sm text-text-tertiary hover:text-text-primary transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Content — scrollable, centered */}
      <div className="flex-1 overflow-y-auto px-6">
        <div className="w-full max-w-2xl mx-auto py-6 space-y-5">
          {/* Header: product name + badges + short description */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-text-primary">
              {caseStudy.productName}
            </h1>
            <div className="flex items-center justify-center gap-3">
              <span className="badge-blue">
                {caseStudy.productType}
              </span>
              <span className={difficulty.className}>
                {difficulty.label}
              </span>
            </div>
            <p className="text-sm text-text-secondary">
              {caseStudy.shortDescription}
            </p>
            <p className="text-xs text-accent-primary font-medium">
              {difficulty.hint}
            </p>
          </div>

          {/* Your User — who you're designing for */}
          <div className="bg-accent-purple-light border border-accent-purple/20 rounded-lg p-4">
            <p className="text-xs font-semibold text-accent-purple uppercase tracking-wide mb-3">
              Meet Your User
            </p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-accent-purple/20 border-2 border-accent-purple/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-accent-purple">
                  {caseStudy.persona.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {caseStudy.persona.name}, {caseStudy.persona.age}
                </p>
                <p className="text-xs text-text-tertiary">
                  {caseStudy.persona.occupation}
                </p>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              {caseStudy.persona.bio}
            </p>
            <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">
              What they want:
            </p>
            <div className="flex flex-wrap gap-2">
              {caseStudy.persona.goals.map((goal, i) => (
                <span
                  key={i}
                  className="badge-green"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>

          {/* The Problem — what's wrong with the app */}
          <div>
            <h2 className="text-sm font-semibold text-accent-red mb-2">
              The Problem
            </h2>
            <p className="text-xs text-text-tertiary mb-2">
              This app has some issues. Your job is to fix them!
            </p>
            <ul className="space-y-1.5">
              {caseStudy.whatsBroken.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent-red mt-0.5 shrink-0" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                    </svg>
                  </span>
                  <span className="text-sm text-accent-red">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Tips */}
          <div className="bg-accent-yellow-light border border-accent-yellow/20 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-accent-yellow mb-2">
              Pro Tips
            </h2>
            <p className="text-xs text-text-tertiary mb-2">
              Keep these in mind while making your choices:
            </p>
            <ul className="space-y-1.5">
              {caseStudy.successHints.map((hint, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent-yellow mt-0.5 shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </span>
                  <span className="text-sm text-text-secondary">{hint}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Decisions Ahead */}
          <div>
            <h2 className="text-sm font-semibold text-accent-blue mb-2">
              What You'll Decide
            </h2>
            <p className="text-xs text-text-tertiary mb-2">
              {"Here's a preview of the choices you'll face:"}
            </p>
            <div className="grid gap-2">
              {caseStudy.decisions.map((decision) => (
                <div
                  key={decision.id}
                  className="flex items-center gap-3 bg-accent-blue-light border border-accent-blue/20 rounded-lg px-3 py-2"
                >
                  <span className="text-xs font-medium text-text-tertiary shrink-0">
                    R{decision.round + 1}
                  </span>
                  <span className="badge-blue shrink-0">
                    {decision.type === "multiple_choice"
                      ? "Pick One"
                      : decision.type === "tradeoff_slider"
                        ? "Slider"
                        : "Choose a Path"}
                  </span>
                  <span className="text-xs text-text-secondary truncate">
                    {decision.scenarioText}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fun Fact */}
          {caseStudy.funFact && (
            <div className="bg-surface-tertiary border border-border-primary rounded-lg p-4 text-center">
              <p className="text-xs font-semibold text-accent-primary uppercase tracking-wide mb-1">
                Did You Know?
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                {caseStudy.funFact}
              </p>
            </div>
          )}

          {/* LET'S GO button */}
          <div className="text-center pt-2 pb-4">
            <button onClick={onReady} className="btn-green px-10 py-3 text-base">
              {"Let's Go!"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
