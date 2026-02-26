"use client";

import { useState, useEffect, useCallback } from "react";

interface DiscussionPromptProps {
  onReveal: () => void;
}

const TIMER_OPTIONS = [30, 60, 90] as const;

export default function DiscussionPrompt({ onReveal }: DiscussionPromptProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [running, setRunning] = useState(false);

  const reveal = useCallback(() => {
    setRunning(false);
    setSecondsLeft(null);
    onReveal();
  }, [onReveal]);

  useEffect(() => {
    if (!running || secondsLeft === null) return;
    if (secondsLeft <= 0) {
      reveal();
      return;
    }
    const timeout = setTimeout(() => setSecondsLeft((s) => (s ?? 1) - 1), 1000);
    return () => clearTimeout(timeout);
  }, [running, secondsLeft, reveal]);

  function startTimer(seconds: number) {
    setSecondsLeft(seconds);
    setRunning(true);
  }

  const minutes = secondsLeft !== null ? Math.floor(secondsLeft / 60) : 0;
  const secs = secondsLeft !== null ? secondsLeft % 60 : 0;

  return (
    <div className="rounded-xl border-2 border-accent-primary/30 bg-accent-primary/5 p-6 text-center space-y-4">
      <div>
        <h4 className="text-lg font-bold text-accent-primary">
          Discuss with your group
        </h4>
        <p className="text-base text-text-secondary mt-1">
          Talk it over before seeing the options
        </p>
      </div>

      {running && secondsLeft !== null ? (
        <div className="space-y-3">
          <p className="text-4xl font-mono font-bold text-accent-primary tabular-nums">
            {minutes}:{secs.toString().padStart(2, "0")}
          </p>
          <button
            onClick={reveal}
            className="btn-ghost text-sm"
          >
            Show Options Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            {TIMER_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => startTimer(t)}
                className="px-4 py-2 rounded-lg border border-accent-primary/30 text-accent-primary font-semibold hover:bg-accent-primary/10 transition-colors cursor-pointer"
              >
                {t}s
              </button>
            ))}
          </div>
          <button
            onClick={reveal}
            className="btn-primary px-6 py-2"
          >
            Show Options
          </button>
        </div>
      )}
    </div>
  );
}
