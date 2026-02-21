"use client";

import { useState } from "react";
import type { TradeoffConfig } from "@design-dash/shared";

interface TradeoffSliderProps {
  tradeoff: TradeoffConfig;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

function getSliderLabel(value: number, leftLabel: string, rightLabel: string): string {
  switch (value) {
    case 0: return `Strongly ${leftLabel}`;
    case 25: return `Lean ${leftLabel}`;
    case 50: return "Balanced";
    case 75: return `Lean ${rightLabel}`;
    case 100: return `Strongly ${rightLabel}`;
    default: return "Balanced";
  }
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
          <p className="text-sm font-semibold text-accent-red mb-1">
            {tradeoff.leftLabel}
          </p>
          <p className="text-xs text-text-tertiary leading-relaxed">
            {tradeoff.leftDescription}
          </p>
        </div>
        <div className="flex-1 text-right">
          <p className="text-sm font-semibold text-accent-green mb-1">
            {tradeoff.rightLabel}
          </p>
          <p className="text-xs text-text-tertiary leading-relaxed">
            {tradeoff.rightDescription}
          </p>
        </div>
      </div>

      {/* Slider track with tick marks */}
      <div className="relative px-1">
        {/* Tick marks */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-[9px] pointer-events-none">
          {[0, 25, 50, 75, 100].map((tick) => (
            <div
              key={tick}
              className={`w-2.5 h-2.5 rounded-full border-2 ${
                tick === localValue
                  ? "bg-white border-accent-primary"
                  : "bg-white border-border-secondary"
              }`}
            />
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={25}
          value={localValue}
          onChange={handleChange}
          disabled={disabled}
          className={`
            w-full h-2 rounded-full appearance-none cursor-pointer
            bg-gradient-to-r from-accent-red via-accent-yellow to-accent-green
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-border-secondary
            [&::-webkit-slider-thumb]:shadow-card
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-border-secondary
            [&::-moz-range-thumb]:shadow-card
            [&::-moz-range-thumb]:cursor-pointer
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        />
      </div>

      {/* Value indicator */}
      <div className="text-center">
        <span className="text-lg font-bold text-accent-primary">
          {getSliderLabel(localValue, tradeoff.leftLabel, tradeoff.rightLabel)}
        </span>
      </div>
    </div>
  );
}
