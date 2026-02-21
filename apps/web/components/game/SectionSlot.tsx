"use client";

import { useDroppable } from "@dnd-kit/core";
import Image from "next/image";
import { getComponentById } from "@design-dash/shared";
import type { SectionSlot as SectionSlotType } from "@/lib/types";
import { useGameStore } from "@/lib/game-store";
import { getSocket } from "@/lib/socket";

interface SectionSlotProps {
  slot: SectionSlotType;
  isActivePlayerSlot: boolean;
  assignedPlayerName?: string;
}

export default function SectionSlot({
  slot,
  isActivePlayerSlot,
  assignedPlayerName,
}: SectionSlotProps) {
  const playerId = useGameStore((s) => s.playerId);
  const { isOver, setNodeRef } = useDroppable({
    id: slot.id,
    data: {
      type: "slot",
      slot,
    },
    disabled: slot.status === "locked",
  });

  const component = slot.placedComponent
    ? getComponentById(slot.placedComponent.registryId)
    : null;

  const isLocked = slot.status === "locked";
  const isPlaced = slot.status === "placed" && component !== undefined;
  const isEmpty = slot.status === "empty";

  // Determine if the current user can interact with this slot
  const canInteract = isActivePlayerSlot && !isLocked;

  function handleRemove() {
    if (!canInteract) return;
    const socket = getSocket();
    socket.emit("turn:remove", { slotId: slot.id });
  }

  return (
    <div
      ref={setNodeRef}
      className={`
        relative transition-all duration-200 rounded
        ${isEmpty ? "min-h-[80px]" : "min-h-[100px]"}
        ${
          isLocked
            ? "border-2 border-gray-700/50 bg-game-dark/40 opacity-60 cursor-not-allowed"
            : isOver
            ? "border-3 border-game-green bg-game-green/10 shadow-[0_0_20px_rgba(22,199,154,0.3)]"
            : isActivePlayerSlot
            ? "border-3 border-game-yellow/70 bg-game-blue/10 shadow-[0_0_12px_rgba(245,197,24,0.15)]"
            : "border-2 border-game-blue/40 bg-game-dark/20"
        }
        ${isEmpty && !isLocked ? "border-dashed" : "border-solid"}
      `}
    >
      {/* Lock overlay for locked slots */}
      {isLocked && (
        <div className="absolute top-2 right-2 z-10">
          <svg
            className="w-4 h-4 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Active player glow indicator */}
      {isActivePlayerSlot && !isLocked && (
        <div className="absolute -top-0.5 -left-0.5 -right-0.5 -bottom-0.5 rounded border border-game-yellow/30 animate-pulse pointer-events-none" />
      )}

      {/* Slot content */}
      {isEmpty ? (
        /* ── Empty state ─────────────────────────── */
        <div className="flex flex-col items-center justify-center h-full min-h-[80px] px-4 py-3">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="font-pixel text-[10px] text-gray-400">
              Drop {slot.label} here
            </span>
          </div>
          {assignedPlayerName && (
            <span className="font-pixel text-[8px] text-gray-600 mt-1">
              Assigned to {assignedPlayerName}
            </span>
          )}
        </div>
      ) : isPlaced && component ? (
        /* ── Placed component ────────────────────── */
        <div className="relative">
          {/* Component preview image */}
          <div className="relative w-full h-28 overflow-hidden rounded-t bg-white/5">
            <Image
              src={component.preview}
              alt={component.name}
              fill
              sizes="600px"
              className="object-cover object-top"
              unoptimized
            />
            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-game-dark/90 to-transparent" />
          </div>

          {/* Component info bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-game-dark/60">
            <div className="flex-1 min-w-0">
              <p className="font-pixel text-[9px] text-game-green truncate">
                {component.name}
              </p>
              <p className="font-pixel text-[8px] text-gray-500 truncate">
                {slot.label}
              </p>
            </div>

            {/* Remove button (only for active player's slot) */}
            {canInteract && (
              <button
                onClick={handleRemove}
                className="ml-2 p-1.5 rounded border border-game-red/40 bg-game-red/10
                  hover:bg-game-red/30 hover:border-game-red transition-colors
                  flex-shrink-0"
                title="Remove component"
              >
                <svg
                  className="w-3.5 h-3.5 text-game-red"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ── Fallback placed but no component found ── */
        <div className="flex flex-col items-center justify-center h-full min-h-[80px] px-4 py-3">
          <span className="font-pixel text-[10px] text-game-red">
            Unknown Component
          </span>
          <span className="font-pixel text-[8px] text-gray-500 mt-1">
            {slot.label}
          </span>
        </div>
      )}

      {/* Drop hover indicator */}
      {isOver && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-game-green/5 rounded pointer-events-none">
          <div className="px-4 py-2 bg-game-green/20 border border-game-green rounded">
            <span className="font-pixel text-[10px] text-game-green">
              DROP HERE
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
