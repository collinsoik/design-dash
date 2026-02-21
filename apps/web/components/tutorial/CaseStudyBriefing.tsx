"use client";

import { useEffect } from "react";
import type { CaseStudy } from "@design-dash/shared";

interface CaseStudyBriefingProps {
  caseStudy: CaseStudy;
  onReady: () => void;
}

const difficultyConfig = {
  beginner: { label: "BEGINNER", className: "bg-game-green text-game-dark" },
  intermediate: { label: "INTERMEDIATE", className: "bg-game-yellow text-game-dark" },
  advanced: { label: "ADVANCED", className: "bg-game-red text-white" },
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
    <div className="fixed inset-0 z-50 flex flex-col bg-game-dark">
      {/* Top bar: skip */}
      <div className="flex items-center justify-end px-6 pt-4">
        <button
          onClick={onReady}
          className="font-pixel text-[10px] text-gray-400 hover:text-white transition-colors"
        >
          SKIP
        </button>
      </div>

      {/* Content — scrollable, centered */}
      <div className="flex-1 overflow-y-auto px-6">
        <div className="w-full max-w-2xl mx-auto py-6 space-y-5">
          {/* Header: product name + badges + short description */}
          <div className="text-center space-y-2">
            <h1 className="font-pixel text-lg text-game-yellow neon-text-yellow">
              {caseStudy.productName}
            </h1>
            <div className="flex items-center justify-center gap-3">
              <span className="font-pixel text-[8px] bg-game-blue/40 text-white px-2 py-1 rounded">
                {caseStudy.productType}
              </span>
              <span className={`font-pixel text-[8px] px-2 py-1 rounded ${difficulty.className}`}>
                {difficulty.label}
              </span>
            </div>
            <p className="text-sm text-gray-300">
              {caseStudy.shortDescription}
            </p>
          </div>

          {/* Persona: compact one-liner + goal pills */}
          <div className="bg-game-purple/10 border border-game-purple/30 rounded p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-game-purple/30 border-2 border-game-purple/50 flex items-center justify-center shrink-0">
                <span className="font-pixel text-[10px] text-game-purple">
                  {caseStudy.persona.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div>
                <p className="font-pixel text-[10px] text-white">
                  {caseStudy.persona.name}, {caseStudy.persona.age}
                </p>
                <p className="text-xs text-gray-400">
                  {caseStudy.persona.occupation}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {caseStudy.persona.goals.map((goal, i) => (
                <span
                  key={i}
                  className="inline-block font-pixel text-[7px] bg-game-green/15 text-game-green px-2 py-1 rounded-full"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>

          {/* What's Broken */}
          <div>
            <h2 className="font-pixel text-[10px] text-game-red mb-2">
              {"WHAT'S BROKEN"}
            </h2>
            <ul className="space-y-1.5">
              {caseStudy.whatsBroken.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-game-red mt-0.5 shrink-0" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                    </svg>
                  </span>
                  <span className="text-sm text-red-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Decisions Ahead */}
          <div>
            <h2 className="font-pixel text-[10px] text-game-blue mb-2">
              DECISIONS AHEAD
            </h2>
            <div className="grid gap-2">
              {caseStudy.decisions.map((decision) => (
                <div
                  key={decision.id}
                  className="flex items-center gap-3 bg-game-blue/10 border border-game-blue/20 rounded px-3 py-2"
                >
                  <span className="font-pixel text-[7px] text-gray-500 shrink-0">
                    R{decision.round + 1}
                  </span>
                  <span className="font-pixel text-[7px] text-game-blue shrink-0">
                    {decision.type === "multiple_choice"
                      ? "CHOICE"
                      : decision.type === "tradeoff_slider"
                        ? "TRADEOFF"
                        : "BRANCH"}
                  </span>
                  <span className="text-xs text-gray-300 truncate">
                    {decision.scenarioText}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* LET'S GO button */}
          <div className="text-center pt-2 pb-4">
            <button onClick={onReady} className="pixel-btn-green text-sm px-10 py-3">
              {"LET'S GO!"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
