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
      "You're a web design rescue team! A business has a BROKEN website and they need YOUR help to fix it. You'll pick website building blocks (called 'components') and place them in the right spots to rebuild the site. Think of it like building with LEGO, but for websites!",
  },
  {
    title: "HOW TEAMS WORK",
    icon: "\uD83D\uDC65",
    content:
      "You'll be automatically split into teams. Each team gets the SAME broken website to fix \u2014 so it's a competition! You take turns \u2014 when it's YOUR turn, you get to drag and drop components onto the website. When it's not your turn, you can plan your next move with your team in the chat!",
  },
  {
    title: "THE COMPONENT PALETTE",
    icon: "\uD83E\uDDE9",
    content:
      "On the LEFT side of the screen, you'll see a panel full of website pieces \u2014 headers, hero sections, footers, and more. Click a category to expand it and see the options. Each component has a preview image so you can see what it looks like before you use it!",
  },
  {
    title: "DRAG & DROP",
    icon: "\uD83D\uDDB1\uFE0F",
    content:
      "When it's YOUR turn, grab a component from the left panel and DRAG it over to the matching slot on the website canvas in the center. Each slot tells you what it needs (like 'Header' or 'Hero Section'). Drop the component that looks best for that spot! If you don't like your choice, hit the X button to remove it and try another one.",
  },
  {
    title: "TEAM CHAT",
    icon: "\uD83D\uDCAC",
    content:
      "See the chat panel at the bottom of the screen? That's your BRAINSTORM ZONE! Talk strategy with your teammates \u2014 discuss which components look best, plan your moves, and work together. The best teams communicate! Pro tip: You can chat even when it's not your turn.",
  },
  {
    title: "SCORING & VOTING",
    icon: "\u2B50",
    content:
      "After all turns are done, it's VOTING TIME! Each team rates the other teams' designs from 1 to 5 stars (you can't vote for your own team \u2014 no cheating!). The teacher also scores each team from 1 to 10. Peer votes count for 40% and the teacher's score counts for 60%. The team with the highest combined score WINS!",
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
