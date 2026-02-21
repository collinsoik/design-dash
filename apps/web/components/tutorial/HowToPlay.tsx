"use client";

import { useState } from "react";

interface HowToPlayProps {
  onClose: () => void;
}

const STEPS = [
  {
    title: "WHAT IS DESIGNDASH?",
    icon: "\uD83C\uDFAE",
    content:
      "You're a product design consultant! A company has a product with real UX challenges and they need YOUR team to make the right design decisions. You'll face scenarios, weigh tradeoffs, and choose the best path forward. Think of it like being a design lead for a day!",
  },
  {
    title: "HOW TEAMS WORK",
    icon: "\uD83D\uDC65",
    content:
      "You'll be automatically split into teams. Each team faces the SAME product scenarios \u2014 so it's a competition! You take turns \u2014 when it's YOUR turn, you get to make the design decision for your team. When it's not your turn, discuss strategy with your team in the chat!",
  },
  {
    title: "DECISION TYPES",
    icon: "\uD83E\uDDE9",
    content:
      "You'll face three types of decisions: MULTIPLE CHOICE (pick the best option from several), TRADEOFF SLIDERS (balance between two competing priorities), and BRANCHING PATHS (choose a direction, then make a follow-up decision based on your choice). Each type tests different design thinking skills!",
  },
  {
    title: "MAKING DECISIONS",
    icon: "\uD83D\uDDB1\uFE0F",
    content:
      "When it's YOUR turn, read the scenario carefully, consider the context data, and make your choice. For multiple choice, click your answer. For tradeoff sliders, drag to find the right balance. For branching paths, pick a direction and then answer the follow-up. Think about the user persona and their goals!",
  },
  {
    title: "TEAM CHAT",
    icon: "\uD83D\uDCAC",
    content:
      "See the chat panel at the bottom of the screen? That's your BRAINSTORM ZONE! Talk strategy with your teammates \u2014 discuss which options best serve the user, debate tradeoffs, and plan your approach. The best teams communicate! Pro tip: You can chat even when it's not your turn.",
  },
  {
    title: "SCORING & VOTING",
    icon: "\u2B50",
    content:
      "After all rounds are done, it's VOTING TIME! Each team rates the other teams' decisions from 1 to 5 stars (you can't vote for your own team \u2014 no cheating!). The teacher also scores each team from 1 to 10. Peer votes count for 40% and the teacher's score counts for 60%. The team with the highest combined score WINS!",
  },
];

export default function HowToPlay({ onClose }: HowToPlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const step = STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="pixel-card relative w-full max-w-2xl bg-game-dark">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center font-pixel text-sm text-white/60 transition-colors hover:text-game-red"
          aria-label="Close tutorial"
        >
          X
        </button>

        {/* Icon */}
        <div className="flex justify-center pt-6 pb-2">
          <span className="text-5xl">{step.icon}</span>
        </div>

        {/* Title */}
        <h2 className="neon-text-green text-center font-pixel text-sm tracking-wider text-game-green md:text-base">
          {step.title}
        </h2>

        {/* Content */}
        <div className="px-6 py-6 md:px-10">
          <p className="text-center font-sans text-sm leading-relaxed text-white/90 md:text-base">
            {step.content}
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-center gap-4 px-6 pb-4">
          {!isFirst && (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              className="pixel-btn-blue"
            >
              Back
            </button>
          )}

          {!isLast && (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s + 1)}
              className="pixel-btn-green"
            >
              Next
            </button>
          )}

          {isLast && (
            <button
              type="button"
              onClick={onClose}
              className="pixel-btn-red neon-text-red"
            >
              GOT IT! LET'S GO!
            </button>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 pb-5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`inline-block h-2.5 w-2.5 rounded-full transition-colors ${
                i === currentStep ? "bg-game-green" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
