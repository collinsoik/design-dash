"use client";

import { useCallback, useEffect, useState } from "react";
import type { CaseStudy } from "@design-dash/shared";

interface CaseStudyBriefingProps {
  caseStudy: CaseStudy;
  onReady: () => void;
}

const TOTAL_SLIDES = 5;

const difficultyConfig = {
  beginner: { label: "BEGINNER", className: "bg-game-green text-game-dark" },
  intermediate: { label: "INTERMEDIATE", className: "bg-game-yellow text-game-dark" },
  advanced: { label: "ADVANCED", className: "bg-game-red text-white" },
} as const;

export default function CaseStudyBriefing({ caseStudy, onReady }: CaseStudyBriefingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const difficulty = difficultyConfig[caseStudy.difficulty];

  const isLastSlide = currentSlide === TOTAL_SLIDES - 1;

  const next = useCallback(() => {
    if (isLastSlide) {
      onReady();
    } else {
      setCurrentSlide((s) => s + 1);
    }
  }, [isLastSlide, onReady]);

  const back = useCallback(() => {
    setCurrentSlide((s) => Math.max(0, s - 1));
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "Escape") {
        onReady();
      } else if (e.key === "ArrowLeft" && currentSlide > 0) {
        back();
      } else if (e.key === "ArrowRight" && !isLastSlide) {
        setCurrentSlide((s) => s + 1);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, back, onReady, currentSlide, isLastSlide]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-game-dark">
      {/* Top bar: slide title + skip */}
      <div className="flex items-center justify-between px-6 pt-4">
        <div className="font-pixel text-[8px] text-gray-500">
          {currentSlide + 1} / {TOTAL_SLIDES}
        </div>
        <button
          onClick={onReady}
          className="font-pixel text-[10px] text-gray-400 hover:text-white transition-colors"
        >
          SKIP
        </button>
      </div>

      {/* Slide content — centered */}
      <div className="flex-1 flex items-center justify-center px-6 overflow-y-auto">
        <div className="w-full max-w-2xl py-8">
          {currentSlide === 0 && (
            <MissionBriefingSlide caseStudy={caseStudy} difficulty={difficulty} />
          )}
          {currentSlide === 1 && <PersonaSlide caseStudy={caseStudy} />}
          {currentSlide === 2 && <ChallengeSlide caseStudy={caseStudy} />}
          {currentSlide === 3 && <ProTipsSlide caseStudy={caseStudy} />}
          {currentSlide === 4 && (
            <DecisionsSlide caseStudy={caseStudy} onReady={onReady} />
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between px-6 pb-6 pt-2">
        <div>
          {currentSlide > 0 && (
            <button
              onClick={back}
              className="font-pixel text-[10px] text-gray-400 hover:text-white transition-colors"
            >
              &lt; BACK
            </button>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentSlide
                  ? "bg-game-blue"
                  : i < currentSlide
                    ? "bg-game-blue/40"
                    : "bg-gray-600"
              }`}
            />
          ))}
        </div>

        <div>
          {!isLastSlide && (
            <button
              onClick={next}
              className="font-pixel text-[10px] text-game-blue hover:text-white transition-colors"
            >
              NEXT &gt;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Slide 0: Mission Briefing ── */
function MissionBriefingSlide({
  caseStudy,
  difficulty,
}: {
  caseStudy: CaseStudy;
  difficulty: { label: string; className: string };
}) {
  return (
    <div className="space-y-6 text-center">
      <h1 className="font-pixel text-lg text-game-red neon-text-red">
        MISSION BRIEFING
      </h1>
      <div className="space-y-2">
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
      <div className="bg-game-blue/20 border border-game-blue/40 rounded p-4 text-left">
        <p className="font-sans text-sm text-gray-200 leading-relaxed">
          {caseStudy.story}
        </p>
      </div>
    </div>
  );
}

/* ── Slide 1: Persona ── */
function PersonaSlide({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="space-y-4">
      <h2 className="font-pixel text-sm text-game-purple text-center">
        YOUR USER PERSONA
      </h2>
      <div className="bg-game-purple/10 border border-game-purple/30 rounded p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-game-purple/30 border-2 border-game-purple/50 flex items-center justify-center">
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
  );
}

/* ── Slide 2: Challenge ── */
function ChallengeSlide({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="space-y-6">
      <h2 className="font-pixel text-sm text-game-red text-center">
        THE CHALLENGE
      </h2>
      <div className="space-y-3">
        <h3 className="font-pixel text-[10px] text-game-red">KEY CHALLENGES</h3>
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
      <div className="space-y-3">
        <h3 className="font-pixel text-[10px] text-game-green">WHAT YOU&apos;LL LEARN</h3>
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
    </div>
  );
}

/* ── Slide 3: Pro Tips ── */
function ProTipsSlide({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="space-y-6">
      <h2 className="font-pixel text-sm text-game-yellow text-center">
        PRO TIPS
      </h2>
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
      <div className="bg-game-purple/20 border border-game-purple/40 rounded p-4">
        <p className="font-sans text-sm text-gray-200">
          <span className="font-pixel text-[8px] text-game-purple mr-2">FUN FACT</span>
          {caseStudy.funFact}
        </p>
      </div>
    </div>
  );
}

/* ── Slide 4: Decisions Ahead ── */
function DecisionsSlide({
  caseStudy,
  onReady,
}: {
  caseStudy: CaseStudy;
  onReady: () => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="font-pixel text-sm text-game-green text-center">
        DECISIONS AHEAD
      </h2>
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
                {decision.type === "multiple_choice"
                  ? "MULTIPLE CHOICE"
                  : decision.type === "tradeoff_slider"
                    ? "TRADEOFF"
                    : "BRANCHING PATH"}
              </span>
            </div>
            <p className="font-sans text-xs text-gray-300">
              {decision.scenarioText}
            </p>
          </div>
        ))}
      </div>
      <div className="text-center pt-2">
        <button onClick={onReady} className="pixel-btn-green text-sm px-10 py-3">
          {"LET'S GO!"}
        </button>
      </div>
    </div>
  );
}
