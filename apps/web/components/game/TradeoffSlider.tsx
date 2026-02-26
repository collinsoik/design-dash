"use client";

import { useState } from "react";
import type { TradeoffConfig } from "@design-dash/shared";

interface TradeoffSliderProps {
  tradeoff: TradeoffConfig;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const TICK_VALUES = [0, 25, 50, 75, 100] as const;

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

  const selectedIndex = TICK_VALUES.indexOf(localValue as (typeof TICK_VALUES)[number]);

  return (
    <div className="space-y-4">
      {/* End labels */}
      <div className="flex justify-between items-center">
        <span className="text-base font-semibold text-accent-red">
          {tradeoff.leftLabel}
        </span>
        <span className="text-base font-semibold text-accent-green">
          {tradeoff.rightLabel}
        </span>
      </div>

      {/* Slider track with tick marks */}
      <div className="relative px-1">
        {/* Tick marks */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-[9px] pointer-events-none">
          {TICK_VALUES.map((tick) => (
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

      {/* Point descriptions row */}
      <div className="flex justify-between">
        {tradeoff.points.map((desc, i) => (
          <div
            key={i}
            className={`flex-1 text-center px-0.5 ${
              i === selectedIndex
                ? "text-accent-primary font-semibold"
                : "text-text-tertiary"
            }`}
          >
            <span className="text-sm leading-tight block">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
