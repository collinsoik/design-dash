"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  COMPONENT_REGISTRY,
  getComponentsByCategory,
} from "@design-dash/shared";
import type { ComponentCategory, ComponentEntry } from "@/lib/types";
import { useGameStore } from "@/lib/game-store";

// ── Human-readable labels for categories ──────────────────
const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  headers: "Headers",
  hero_sections: "Hero Sections",
  feature_sections: "Feature Sections",
  content_sections: "Content Sections",
  cta_sections: "CTA Sections",
  pricing_sections: "Pricing Sections",
  testimonials: "Testimonials",
  team_sections: "Team Sections",
  stats_sections: "Stats Sections",
  contact_sections: "Contact Sections",
  newsletter_sections: "Newsletters",
  blog_sections: "Blog Sections",
  footers: "Footers",
  logo_clouds: "Logo Clouds",
  faqs: "FAQs",
  banners: "Banners",
  bento_grids: "Bento Grids",
  about_pages: "About Pages",
  "404_pages": "404 Pages",
  flyout_menus: "Flyout Menus",
  header_sections: "Header Sections",
  landing_pages: "Landing Pages",
  pricing_pages: "Pricing Pages",
};

// ── Draggable component card ──────────────────────────────
function DraggableComponentCard({ entry }: { entry: ComponentEntry }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: entry.id,
      data: {
        type: "component",
        entry,
      },
    });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        group relative cursor-grab active:cursor-grabbing
        border-2 border-game-blue/60 bg-game-dark/90
        hover:border-game-green/80 hover:bg-game-blue/20
        transition-colors duration-150 rounded
        ${isDragging ? "opacity-40 border-game-green" : ""}
      `}
    >
      {/* Preview thumbnail */}
      <div className="relative w-full h-24 overflow-hidden bg-white/5 rounded-t">
        <Image
          src={entry.preview}
          alt={entry.name}
          fill
          sizes="200px"
          className="object-cover object-top"
          unoptimized
        />
      </div>

      {/* Component name */}
      <div className="px-2 py-1.5 border-t border-game-blue/40">
        <p className="font-pixel text-[8px] text-gray-300 truncate leading-tight">
          {entry.name}
        </p>
      </div>

      {/* Drag handle indicator */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          className="w-3 h-3 text-game-green/60"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <circle cx="4" cy="4" r="1.5" />
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="4" cy="12" r="1.5" />
          <circle cx="10" cy="4" r="1.5" />
          <circle cx="10" cy="8" r="1.5" />
          <circle cx="10" cy="12" r="1.5" />
        </svg>
      </div>
    </div>
  );
}

// ── Main palette component ────────────────────────────────
export default function ComponentPalette() {
  const room = useGameStore((s) => s.room);
  const playerId = useGameStore((s) => s.playerId);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<
    Set<ComponentCategory>
  >(new Set());

  // Find the player's currently assigned empty slots and their ideal categories
  const { currentSlotCategories, currentSlotLabel, designTip } = useMemo(() => {
    const caseStudy = room?.gameState?.caseStudy;
    const turnState = room?.gameState?.currentTurn;
    if (!caseStudy?.idealCategories || !turnState || !playerId) {
      return { currentSlotCategories: null, currentSlotLabel: null, designTip: null };
    }

    const assignedSlots = turnState.assignedSlots[playerId] ?? [];
    if (assignedSlots.length === 0) {
      return { currentSlotCategories: null, currentSlotLabel: null, designTip: null };
    }

    const teamId = room.players[playerId]?.teamId;
    if (!teamId) return { currentSlotCategories: null, currentSlotLabel: null, designTip: null };

    const teamWebsite = room.gameState?.teamWebsites[teamId];
    if (!teamWebsite) return { currentSlotCategories: null, currentSlotLabel: null, designTip: null };

    // Find the first assigned slot that's still empty
    for (const slotId of assignedSlots) {
      const section = teamWebsite.sections.find((s) => s.id === slotId);
      if (section && section.status === "empty") {
        const categories = (caseStudy.idealCategories[slotId] ?? []) as ComponentCategory[];
        return {
          currentSlotCategories: categories,
          currentSlotLabel: section.label,
          designTip: caseStudy.designTips?.[slotId] ?? null,
        };
      }
    }

    // All assigned slots are filled, show categories for all assigned slots
    const allCats: ComponentCategory[] = [];
    for (const slotId of assignedSlots) {
      const cats = (caseStudy.idealCategories[slotId] ?? []) as ComponentCategory[];
      for (const c of cats) {
        if (!allCats.includes(c)) allCats.push(c);
      }
    }
    return { currentSlotCategories: allCats, currentSlotLabel: null, designTip: null };
  }, [room, playerId]);

  // Determine which categories to show
  const relevantCategories = useMemo<ComponentCategory[]>(() => {
    // If we know the player's current slot categories, show those first
    if (currentSlotCategories && currentSlotCategories.length > 0) {
      return currentSlotCategories;
    }

    // Otherwise fall back to all categories from the case study
    const caseStudy = room?.gameState?.caseStudy;
    if (caseStudy?.idealCategories) {
      const allCategories = Object.values(caseStudy.idealCategories).flat();
      return [...new Set(allCategories)] as ComponentCategory[];
    }
    return Object.keys(COMPONENT_REGISTRY) as ComponentCategory[];
  }, [room, currentSlotCategories]);

  // Auto-expand relevant categories when they change
  useEffect(() => {
    if (currentSlotCategories && currentSlotCategories.length > 0) {
      setExpandedCategories(new Set(currentSlotCategories));
    }
  }, [currentSlotCategories]);

  // Filter components by search query
  const filteredByCategory = useMemo(() => {
    const result: Partial<Record<ComponentCategory, ComponentEntry[]>> = {};
    const query = searchQuery.toLowerCase().trim();

    for (const category of relevantCategories) {
      const components = getComponentsByCategory(category);
      const filtered = query
        ? components.filter(
            (c) =>
              c.name.toLowerCase().includes(query) ||
              c.category.toLowerCase().includes(query)
          )
        : components;

      if (filtered.length > 0) {
        result[category] = filtered;
      }
    }

    return result;
  }, [relevantCategories, searchQuery]);

  function toggleCategory(category: ComponentCategory) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  const totalComponents = Object.values(filteredByCategory).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return (
    <aside className="w-64 border-r-3 border-game-blue bg-game-dark/80 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b-3 border-game-blue">
        <h2 className="font-pixel text-xs text-game-yellow text-center mb-1">
          COMPONENTS
        </h2>
        <p className="font-pixel text-[8px] text-gray-500 text-center">
          {totalComponents} available
        </p>
      </div>

      {/* Current slot indicator */}
      {currentSlotLabel && (
        <div className="px-3 py-2 border-b border-game-green/30 bg-game-green/5">
          <p className="font-pixel text-[9px] text-game-green">
            Pick a component for:
          </p>
          <p className="font-pixel text-xs text-white mt-0.5">
            {currentSlotLabel}
          </p>
        </div>
      )}

      {/* Design Tip */}
      {designTip && (
        <div className="px-3 py-2 border-b border-game-yellow/30 bg-game-yellow/5">
          <p className="font-pixel text-[8px] text-game-yellow mb-1">
            TIP
          </p>
          <p className="text-xs text-gray-300 leading-relaxed">
            {designTip}
          </p>
        </div>
      )}

      {/* Search */}
      <div className="p-2 border-b border-game-blue/40">
        <div className="relative">
          <svg
            className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search components..."
            className="w-full bg-game-dark border-2 border-game-blue/60 pl-7 pr-2 py-1.5
              text-xs text-white placeholder-gray-600
              focus:border-game-green focus:outline-none rounded"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-game-blue scrollbar-track-transparent">
        {Object.entries(filteredByCategory).length === 0 ? (
          <div className="p-4 text-center">
            <p className="font-pixel text-[10px] text-gray-500">
              No components found
            </p>
          </div>
        ) : (
          Object.entries(filteredByCategory).map(([cat, components]) => {
            const category = cat as ComponentCategory;
            const isExpanded = expandedCategories.has(category);
            const isRecommended =
              currentSlotCategories?.includes(category) ?? false;

            return (
              <div key={category} className="border-b border-game-blue/20">
                {/* Category header (toggle) */}
                <button
                  onClick={() => toggleCategory(category)}
                  className={`w-full flex items-center justify-between px-3 py-2.5
                    hover:bg-game-blue/20 transition-colors
                    ${isRecommended ? "bg-game-green/5" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    {isRecommended && (
                      <div className="w-1.5 h-1.5 rounded-full bg-game-green" />
                    )}
                    <span className={`font-pixel text-[9px] truncate ${
                      isRecommended ? "text-game-green" : "text-gray-400"
                    }`}>
                      {CATEGORY_LABELS[category] || category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-[8px] text-gray-500">
                      {components.length}
                    </span>
                    <svg
                      className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Expanded component cards */}
                {isExpanded && (
                  <div className="px-2 pb-2 grid grid-cols-2 gap-1.5">
                    {components.map((entry) => (
                      <DraggableComponentCard key={entry.id} entry={entry} />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer tip */}
      <div className="p-2 border-t border-game-blue/40">
        <p className="font-pixel text-[8px] text-gray-600 text-center leading-relaxed">
          Drag a component to the canvas
        </p>
      </div>
    </aside>
  );
}
