"use client";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-game-dark pixel-border rounded-sm">
        {/* Close button */}
        <button
          onClick={onReady}
          className="absolute top-3 right-3 z-10 font-pixel text-[10px] text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center"
          aria-label="Close briefing"
        >
          X
        </button>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="font-pixel text-lg text-game-red neon-text-red">
              MISSION BRIEFING
            </h1>
          </div>

          {/* Product Info */}
          <div className="text-center space-y-2">
            <h2 className="font-pixel text-base text-game-yellow">
              {caseStudy.productName}
            </h2>
            <div className="flex items-center justify-center gap-3">
              <span className="font-pixel text-[8px] bg-game-blue/40 text-white px-2 py-1 rounded">
                {caseStudy.productType}
              </span>
              <span className={`font-pixel text-[8px] px-2 py-1 rounded ${difficulty.className}`}>
                {difficulty.label}
              </span>
            </div>
          </div>

          {/* Story Card */}
          <div className="bg-game-blue/20 border border-game-blue/40 rounded p-4">
            <p className="font-sans text-sm text-gray-200 leading-relaxed">
              {caseStudy.story}
            </p>
          </div>

          {/* Persona Card */}
          <div className="space-y-3">
            <h3 className="font-pixel text-[10px] text-game-purple">
              YOUR USER PERSONA
            </h3>
            <div className="bg-game-purple/10 border border-game-purple/30 rounded p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-game-purple/30 border-2 border-game-purple/50 flex items-center justify-center">
                  <span className="font-pixel text-[10px] text-game-purple">
                    {caseStudy.persona.name.split(" ").map(n => n[0]).join("")}
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
              <p className="font-sans text-sm text-gray-300 leading-relaxed">
                {caseStudy.persona.bio}
              </p>
              <div>
                <p className="font-pixel text-[8px] text-game-purple mb-1">GOALS:</p>
                <ul className="space-y-1">
                  {caseStudy.persona.goals.map((goal, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-game-purple mt-0.5">*</span>
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* What's Broken / Challenges */}
          <div className="space-y-3">
            <h3 className="font-pixel text-[10px] text-game-red">
              KEY CHALLENGES
            </h3>
            <ul className="space-y-2">
              {caseStudy.whatsBroken.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-game-red mt-0.5 shrink-0" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                    </svg>
                  </span>
                  <span className="font-sans text-sm text-red-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning Objectives */}
          <div className="space-y-3">
            <h3 className="font-pixel text-[10px] text-game-green">
              WHAT YOU'LL LEARN
            </h3>
            <ul className="space-y-2">
              {caseStudy.learningObjectives.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-game-green mt-0.5 shrink-0" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                    </svg>
                  </span>
                  <span className="font-sans text-sm text-gray-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Tips */}
          <div className="space-y-3">
            <h3 className="font-pixel text-[10px] text-game-yellow">
              PRO TIPS
            </h3>
            <ul className="space-y-2">
              {caseStudy.successHints.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-game-yellow mt-0.5 shrink-0" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1L8.8 5.2L13 5.8L10 8.7L10.7 13L7 11L3.3 13L4 8.7L1 5.8L5.2 5.2L7 1Z" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="font-sans text-sm text-gray-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Fun Fact */}
          <div className="bg-game-purple/20 border border-game-purple/40 rounded p-4">
            <p className="font-sans text-sm text-gray-200">
              <span className="mr-2" aria-hidden="true">&#x1f4a1;</span>
              {caseStudy.funFact}
            </p>
          </div>

          {/* Decision Overview */}
          <div className="space-y-3">
            <h3 className="font-pixel text-[10px] text-game-green">
              DECISIONS AHEAD
            </h3>
            <div className="grid gap-2">
              {caseStudy.decisions.map((decision) => (
                <div
                  key={decision.id}
                  className="bg-game-blue/20 border border-game-blue/30 rounded p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-pixel text-[7px] text-gray-500">
                      ROUND {decision.round + 1}
                    </span>
                    <span className="font-pixel text-[7px] text-game-blue">
                      {decision.type === "multiple_choice" ? "MULTIPLE CHOICE" :
                       decision.type === "tradeoff_slider" ? "TRADEOFF" : "BRANCHING PATH"}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-gray-300">
                    {decision.scenarioText}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center pt-2 pb-1">
            <button
              onClick={onReady}
              className="pixel-btn-green text-sm px-10 py-3"
            >
              {"LET'S GO!"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
