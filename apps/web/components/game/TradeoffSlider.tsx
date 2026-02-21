"use client";

import { useState } from "react";
import type { TradeoffConfig } from "@design-dash/shared";

interface TradeoffSliderProps {
  tradeoff: TradeoffConfig;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function TradeoffSlider({
  tradeoff,
  value,
  onChange,
  disabled = false,
}: TradeoffSliderProps) {
  const [localValue, setLocalValue] = useState(value);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    setLocalValue(v);
    onChange(v);
  }

  return (
    <div className="space-y-4">
      {/* Labels */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 text-left">
          <p className="font-pixel text-xs text-game-red mb-1">
            {tradeoff.leftLabel}
          </p>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            {tradeoff.leftDescription}
          </p>
        </div>
        <div className="flex-1 text-right">
          <p className="font-pixel text-xs text-game-green mb-1">
            {tradeoff.rightLabel}
          </p>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            {tradeoff.rightDescription}
          </p>
        </div>
      </div>

      {/* Slider track */}
      <div className="relative px-1">
        <input
          type="range"
          min={0}
          max={100}
          value={localValue}
          onChange={handleChange}
          disabled={disabled}
          className={`
            w-full h-2 rounded-full appearance-none cursor-pointer
            bg-gradient-to-r from-game-red via-game-yellow to-game-green
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-game-blue
            [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(255,255,255,0.3)]
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-game-blue
            [&::-moz-range-thumb]:cursor-pointer
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        />
      </div>

      {/* Value indicator */}
      <div className="text-center">
        <span className="font-pixel text-sm text-game-yellow">
          {localValue}%
        </span>
        <span className="text-xs text-gray-500 ml-2">
          {localValue < 30
            ? `Leaning ${tradeoff.leftLabel}`
            : localValue > 70
            ? `Leaning ${tradeoff.rightLabel}`
            : "Balanced"}
        </span>
      </div>
    </div>
  );
}
