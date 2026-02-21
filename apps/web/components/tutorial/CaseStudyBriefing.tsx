"use client";

import { useEffect } from "react";
import type { CaseStudy } from "@design-dash/shared";

interface CaseStudyBriefingProps {
  caseStudy: CaseStudy;
  onReady: () => void;
}

const difficultyConfig = {
  beginner: { label: "Beginner", className: "badge-green" },
  intermediate: { label: "Intermediate", className: "badge-yellow" },
  advanced: { label: "Advanced", className: "badge-red" },
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
          </div>

          {/* Persona: compact one-liner + goal pills */}
          <div className="bg-accent-purple-light border border-accent-purple/20 rounded-lg p-4">
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

          {/* What's Broken */}
          <div>
            <h2 className="text-sm font-semibold text-accent-red mb-2">
              {"What's Broken"}
            </h2>
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

          {/* Decisions Ahead */}
          <div>
            <h2 className="text-sm font-semibold text-accent-blue mb-2">
              Decisions Ahead
            </h2>
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
                      ? "Choice"
                      : decision.type === "tradeoff_slider"
                        ? "Tradeoff"
                        : "Branch"}
                  </span>
                  <span className="text-xs text-text-secondary truncate">
                    {decision.scenarioText}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* LET'S GO button */}
          <div className="text-center pt-2 pb-4">
            <button onClick={onReady} className="btn-green px-10 py-3">
              {"Let's Go!"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
