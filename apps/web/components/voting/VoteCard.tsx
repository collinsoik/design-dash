"use client";

import { useState } from "react";
import type { SectionSlot } from "@/lib/types";

interface VoteCardProps {
  teamId: string;
  teamName: string;
  teamColor: string;
  sections: SectionSlot[];
  isOwnTeam: boolean;
  onVote: (teamId: string, rating: number) => void;
}

export default function VoteCard({
  teamId,
  teamName,
  teamColor,
  sections,
  isOwnTeam,
  onVote,
}: VoteCardProps) {
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);

  function handleStarClick(star: number) {
    if (isOwnTeam) return;
    setSelectedRating(star);
    onVote(teamId, star);
  }

  /** Render a filled or empty star for the 1-5 rating system. */
  function renderStar(star: number) {
    const isActive = star <= (hoveredStar || selectedRating);

    return (
      <button
        key={star}
        type="button"
        disabled={isOwnTeam}
        onClick={() => handleStarClick(star)}
        onMouseEnter={() => !isOwnTeam && setHoveredStar(star)}
        onMouseLeave={() => !isOwnTeam && setHoveredStar(0)}
        className={`text-2xl transition-transform duration-100 ${
          isOwnTeam
            ? "cursor-not-allowed opacity-30"
            : "cursor-pointer hover:scale-125"
        }`}
        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill={isActive ? "#f5c518" : "none"}
          stroke={isActive ? "#f5c518" : "#555"}
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      </button>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg border-2 bg-game-dark/90 transition-shadow ${
        isOwnTeam
          ? "border-white/10 opacity-60"
          : "border-white/10 hover:shadow-lg hover:shadow-game-purple/20"
      }`}
      style={{ borderTopColor: teamColor, borderTopWidth: "4px" }}
    >
      {/* Own-team overlay badge */}
      {isOwnTeam && (
        <div className="absolute top-3 right-3 z-10 rounded bg-white/10 px-2 py-1 font-pixel text-[8px] uppercase tracking-widest text-white/60 backdrop-blur-sm">
          Your Team
        </div>
      )}

      {/* Team header */}
      <div className="px-5 pt-4 pb-3">
        <h3
          className="font-pixel text-xs tracking-wider uppercase"
          style={{ color: teamColor }}
        >
          {teamName}
        </h3>
      </div>

      {/* Sections preview */}
      <div className="px-5 pb-3">
        <p className="mb-2 font-pixel text-[8px] text-white/50 uppercase tracking-wide">
          Website Sections
        </p>

        <ul className="space-y-1.5">
          {sections.map((section) => (
            <li
              key={section.id}
              className="flex items-center gap-2 rounded bg-white/5 px-3 py-2"
            >
              {/* Slot status indicator */}
              <span
                className={`inline-block h-2 w-2 shrink-0 rounded-sm ${
                  section.status === "placed" || section.status === "locked"
                    ? "bg-game-green"
                    : "bg-white/20"
                }`}
              />

              {/* Section label */}
              <span className="font-sans text-xs text-white/70 truncate">
                {section.label}
              </span>

              {/* Placed component name (if any) */}
              {section.placedComponent ? (
                <span className="ml-auto shrink-0 rounded bg-game-blue/40 px-2 py-0.5 font-sans text-[10px] text-game-green">
                  {section.placedComponent.registryId}
                </span>
              ) : (
                <span className="ml-auto shrink-0 font-sans text-[10px] text-white/25 italic">
                  empty
                </span>
              )}
            </li>
          ))}

          {sections.length === 0 && (
            <li className="py-3 text-center font-sans text-xs text-white/30 italic">
              No sections
            </li>
          )}
        </ul>
      </div>

      {/* Star rating */}
      <div className="border-t border-white/5 px-5 py-4">
        {isOwnTeam ? (
          <p className="text-center font-sans text-xs text-white/30 italic">
            You cannot vote for your own team
          </p>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="font-pixel text-[8px] text-white/50 uppercase tracking-wide">
              Your Rating
            </p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(renderStar)}
            </div>
            {selectedRating > 0 && (
              <p className="font-sans text-xs text-game-yellow">
                {selectedRating} / 5 stars
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
