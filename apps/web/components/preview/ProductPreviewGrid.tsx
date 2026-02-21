"use client";

import { useState } from "react";
import type { Team, GameState } from "@design-dash/shared";
import { TEAM_COLORS } from "@design-dash/shared";
import PhoneFrame from "./PhoneFrame";
import ProductPreview from "./ProductPreview";

interface ProductPreviewGridProps {
  teams: Team[];
  gameState: GameState;
  myTeamId: string | null;
}

export default function ProductPreviewGrid({ teams, gameState, myTeamId }: ProductPreviewGridProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const caseStudyId = gameState.caseStudy.id;
  const productName = gameState.caseStudy.productName;

  const goNext = () => setCurrentIndex((i) => (i + 1) % teams.length);
  const goPrev = () => setCurrentIndex((i) => (i - 1 + teams.length) % teams.length);

  const team = teams[currentIndex];
  const teamIndex = parseInt(team.id.split("-")[1]);
  const teamColor = TEAM_COLORS[teamIndex] || "#7C8CF5";
  const isOwnTeam = team.id === myTeamId;
  const teamDecisions = gameState.teamDecisions[team.id]?.decisions ?? {};

  return (
    <div className="mb-10">
      <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-6 text-center">
        Compare Designs
      </h2>

      <div className="flex items-center justify-center gap-4 md:gap-8">
        {/* Left arrow */}
        <button
          onClick={goPrev}
          className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-border-primary shadow-card flex items-center justify-center hover:shadow-elevated transition-shadow cursor-pointer"
          aria-label="Previous team"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-text-secondary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Center: phone + team info */}
        <div className="flex flex-col items-center gap-4">
          {/* Team name */}
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: teamColor }}>
              {team.name}
            </p>
            {isOwnTeam && (
              <p className="text-xs text-text-tertiary">Your Team</p>
            )}
          </div>

          {/* Scaled-up phone */}
          <div className="relative" style={{ width: "320px", height: `${320 * (19 / 9)}px` }}>
            <div
              className="origin-top-left"
              style={{ transform: `scale(${320 / 180})`, width: "180px" }}
            >
              <PhoneFrame teamColor={teamColor} productName={productName}>
                <ProductPreview caseStudyId={caseStudyId} decisions={teamDecisions} />
              </PhoneFrame>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {teams.map((t, i) => {
              const tIdx = parseInt(t.id.split("-")[1]);
              const tColor = TEAM_COLORS[tIdx] || "#7C8CF5";
              return (
                <button
                  key={t.id}
                  onClick={() => setCurrentIndex(i)}
                  className="rounded-full transition-all cursor-pointer"
                  style={{
                    width: i === currentIndex ? "24px" : "8px",
                    height: "8px",
                    backgroundColor: i === currentIndex ? tColor : "#D0D4DA",
                  }}
                  aria-label={`View ${t.name}`}
                />
              );
            })}
          </div>

          {/* Counter */}
          <p className="text-xs text-text-tertiary">
            {currentIndex + 1} / {teams.length}
          </p>
        </div>

        {/* Right arrow */}
        <button
          onClick={goNext}
          className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-border-primary shadow-card flex items-center justify-center hover:shadow-elevated transition-shadow cursor-pointer"
          aria-label="Next team"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-text-secondary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
